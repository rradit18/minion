<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Branch;
use App\Services\AvailabilityService;
use App\Services\BookingService;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    use ApiResponse;

    public function __construct(
        private BookingService $bookingService,
        private AvailabilityService $availability,
    ) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'branch_id'      => ['required', 'uuid', 'exists:branches,id'],
            'barber_id'      => ['required', 'uuid', 'exists:barbers,id'],
            'service_ids'    => ['required', 'array', 'min:1'],
            'service_ids.*'  => ['uuid', 'exists:services,id'],
            'scheduled_at'   => ['required', 'date', 'after:now'],
            'customer_name'  => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:20'],
            'notes'          => ['nullable', 'string', 'max:500'],
        ]);

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

        try {
            $booking = $this->bookingService->createBooking($validated, null);
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

    public function show(string $bookingNumber): JsonResponse
    {
        $booking = Booking::where('booking_number', $bookingNumber)
            ->with(['barber:id,name,slug', 'branch:id,name,slug', 'services'])
            ->first();

        if (! $booking) {
            return $this->error('Booking tidak ditemukan.', 404);
        }

        return $this->ok('OK', [
            'booking_number' => $booking->booking_number,
            'status'         => $booking->status->value,
            'scheduled_at'   => $booking->scheduled_at->setTimezone('Asia/Jakarta')->toIso8601String(),
            'customer_name'  => $booking->customer_name,
            'barber'         => ['name' => $booking->barber->name],
            'branch'         => ['name' => $booking->branch->name],
            'services'       => $booking->services->map(fn($s) => [
                'name'  => $s->service_name,
                'price' => (float) $s->price,
            ]),
            'total_price' => (float) $booking->total_price,
        ]);
    }

    public function queue(string $branchSlug): JsonResponse
    {
        $branch = Branch::where('slug', $branchSlug)->where('is_active', true)->first();

        if (! $branch) {
            return $this->error('Cabang tidak ditemukan.', 404);
        }

        $queue = Booking::where('branch_id', $branch->id)
            ->whereDate('scheduled_at', now()->toDateString())
            ->whereIn('status', ['pending_confirmation', 'confirmed', 'in_progress'])
            ->with('barber:id,name')
            ->orderBy('scheduled_at')
            ->get()
            ->map(fn($b) => [
                'booking_number' => $b->booking_number,
                'customer_name'  => $b->customer_name,
                'barber'         => $b->barber->name,
                'scheduled_at'   => $b->scheduled_at->setTimezone('Asia/Jakarta')->toIso8601String(),
                'status'         => $b->status->value,
            ]);

        return $this->ok('OK', $queue);
    }
}
