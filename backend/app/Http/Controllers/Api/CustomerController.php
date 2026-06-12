<?php

namespace App\Http\Controllers\Api;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Promo;
use App\Services\AvailabilityService;
use App\Services\BookingService;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    use ApiResponse;

    public function __construct(
        private AvailabilityService $availability,
        private BookingService $bookingService,
    ) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'branch_id'     => ['required', 'uuid', 'exists:branches,id'],
            'barber_id'     => ['required', 'uuid', 'exists:barbers,id'],
            'service_ids'   => ['required', 'array', 'min:1'],
            'service_ids.*' => ['uuid', 'exists:services,id'],
            'scheduled_at'  => ['required', 'date', 'after:now'],
            'notes'         => ['nullable', 'string', 'max:500'],
        ]);

        $user        = $request->user();
        $scheduledAt = Carbon::parse($validated['scheduled_at']);

        $slots = $this->availability->getAvailableSlots(
            $validated['barber_id'],
            $scheduledAt->toDateString(),
            $validated['service_ids'],
        );

        $isAvailable = collect($slots)->contains(
            fn($s) => Carbon::parse($s['datetime'])->eq($scheduledAt)
        );

        if (! $isAvailable) {
            return $this->error('Slot waktu tidak tersedia.', 422);
        }

        $validated['customer_name']  = $user->name;
        $validated['customer_phone'] = $user->phone;

        try {
            $booking = $this->bookingService->createBooking($validated, $user->id);
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 409);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Booking berhasil dibuat.',
            'data'    => [
                'booking_number' => $booking->booking_number,
                'scheduled_at'   => $booking->scheduled_at->setTimezone('Asia/Jakarta')->toIso8601String(),
                'barber'         => ['name' => $booking->barber->name, 'slug' => $booking->barber->slug],
                'branch'         => ['name' => $booking->branch->name, 'slug' => $booking->branch->slug],
                'services'       => $booking->services->map(fn($s) => [
                    'name'  => $s->service_name,
                    'price' => (float) $s->price,
                ]),
                'total_price' => (float) $booking->total_price,
                'status'      => $booking->status->value,
            ],
        ], 201);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'phone'    => ['sometimes', 'string', 'max:20', Rule::unique('users', 'phone')->ignore($user->id)],
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $user->update($validated);

        return $this->updated('Profil berhasil diperbarui.', $user->id);
    }

    public function bookings(Request $request): JsonResponse
    {
        $status = $request->query('status', 'all');
        $user   = $request->user();

        $query = Booking::where('customer_user_id', $user->id)
            ->with(['barber:id,name,slug,photo_url', 'branch:id,name,slug', 'services'])
            ->latest('scheduled_at');

        match ($status) {
            'upcoming'  => $query->whereIn('status', [
                BookingStatus::PendingConfirmation,
                BookingStatus::Confirmed,
                BookingStatus::InProgress,
            ]),
            'completed' => $query->where('status', BookingStatus::Completed),
            'cancelled' => $query->whereIn('status', [BookingStatus::Cancelled, BookingStatus::Expired]),
            default     => null,
        };

        return $this->paginated('OK', $query->paginate(10));
    }

    public function reschedule(Request $request, string $id): JsonResponse
    {
        $user    = $request->user();
        $booking = Booking::where('id', $id)
            ->where('customer_user_id', $user->id)
            ->firstOrFail();

        if (! in_array($booking->status, [BookingStatus::PendingConfirmation, BookingStatus::Confirmed])) {
            return $this->error('Booking tidak dapat dijadwalkan ulang.', 422);
        }

        if ($booking->scheduled_at->lte(now()->addHour())) {
            return $this->error('Reschedule hanya bisa dilakukan minimal 1 jam sebelum jadwal.', 422);
        }

        if ($booking->reschedule_count >= 1) {
            return $this->error('Booking hanya dapat dijadwalkan ulang 1 kali.', 422);
        }

        $validated = $request->validate([
            'scheduled_at' => ['required', 'date', 'after:' . now()->addHour()->toDateTimeString()],
        ]);

        $newScheduledAt = Carbon::parse($validated['scheduled_at']);
        $serviceIds     = $booking->services->pluck('service_id')->toArray();

        $slots = $this->availability->getAvailableSlots(
            $booking->barber_id,
            $newScheduledAt->toDateString(),
            $serviceIds
        );

        $isAvailable = collect($slots)->contains(
            fn($slot) => Carbon::parse($slot['datetime'])->equalTo($newScheduledAt)
        );

        if (! $isAvailable) {
            return $this->error('Slot waktu tidak tersedia.', 422);
        }

        if (! $this->availability->lockSlot($booking->barber_id, $newScheduledAt, $user->id)) {
            return $this->error('Slot sudah diambil pengguna lain.', 409);
        }

        $booking->update([
            'original_scheduled_at' => $booking->original_scheduled_at ?? $booking->scheduled_at,
            'scheduled_at'          => $newScheduledAt,
            'reschedule_count'      => $booking->reschedule_count + 1,
        ]);

        return $this->updated('Booking berhasil dijadwalkan ulang.', $booking->id);
    }

    public function cancel(Request $request, string $id): JsonResponse
    {
        $user    = $request->user();
        $booking = Booking::where('id', $id)
            ->where('customer_user_id', $user->id)
            ->firstOrFail();

        if ($booking->status !== BookingStatus::PendingConfirmation) {
            return $this->error('Booking hanya bisa dibatalkan saat status pending konfirmasi.', 422);
        }

        if ($booking->scheduled_at->lte(now()->addHour())) {
            return $this->error('Pembatalan hanya bisa dilakukan minimal 1 jam sebelum jadwal.', 422);
        }

        $booking->update([
            'status'       => BookingStatus::Cancelled,
            'cancelled_at' => now(),
            'cancelled_by' => 'customer',
        ]);

        return $this->deleted('Booking berhasil dibatalkan.');
    }

    public function rate(Request $request, string $id): JsonResponse
    {
        $user    = $request->user();
        $booking = Booking::where('id', $id)
            ->where('customer_user_id', $user->id)
            ->where('status', BookingStatus::Completed)
            ->firstOrFail();

        if ($booking->rating()->exists()) {
            return $this->error('Booking sudah pernah dinilai.', 422);
        }

        $validated = $request->validate([
            'stars'        => 'required|integer|min:1|max:5',
            'comment'      => 'nullable|string|max:500',
            'is_anonymous' => 'boolean',
        ]);

        $booking->rating()->create([
            'barber_id'        => $booking->barber_id,
            'customer_user_id' => $user->id,
            'stars'            => $validated['stars'],
            'comment'          => $validated['comment'] ?? null,
            'is_anonymous'     => $validated['is_anonymous'] ?? true,
        ]);

        return $this->deleted('Rating berhasil diberikan.');
    }

    public function loyalty(Request $request): JsonResponse
    {
        $user = $request->user();
        $card = $user->punchCard;

        return $this->ok('OK', [
            'punch_count'          => $card?->punch_count ?? 0,
            'lifetime_punch_count' => $card?->lifetime_punch_count ?? 0,
            'next_reward_at'       => 10,
            'last_punched_at'      => $card?->last_punched_at?->setTimezone('Asia/Jakarta')->toIso8601String(),
            'last_rewarded_at'     => $card?->last_rewarded_at?->setTimezone('Asia/Jakarta')->toIso8601String(),
        ]);
    }

    public function promos(Request $request): JsonResponse
    {
        $promos = Promo::where('is_active', true)
            ->where('valid_from', '<=', today())
            ->where('valid_until', '>=', today())
            ->where(fn($q) => $q->whereNull('max_uses')->orWhereRaw('used_count < max_uses'))
            ->get(['id', 'code', 'name', 'discount_type', 'discount_value', 'valid_until', 'min_order']);

        return $this->ok('OK', $promos);
    }
}
