<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use App\Models\Booking;
use App\Models\BranchServicePrice;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;

class BookingService
{
    public function __construct(private AvailabilityService $availability) {}

    public function createBooking(array $data, ?string $customerUserId): Booking
    {
        $scheduledAt = Carbon::parse($data['scheduled_at']);

        return DB::transaction(function () use ($data, $customerUserId, $scheduledAt) {
            $lockToken = $customerUserId ?? 'guest_' . Str::random(16);

            if (! $this->availability->lockSlot($data['barber_id'], $scheduledAt, $lockToken)) {
                throw new \RuntimeException('Slot sudah diambil oleh pengguna lain.');
            }

            $services = $this->resolveServices($data['service_ids'], $data['branch_id']);
            $totalDuration = $services->sum('duration_minutes');
            $totalPrice    = $services->sum('price');

            $booking = Booking::create([
                'booking_number'         => $this->generateBookingNumber(),
                'branch_id'              => $data['branch_id'],
                'barber_id'              => $data['barber_id'],
                'customer_user_id'       => $customerUserId,
                'customer_name'          => $data['customer_name'],
                'customer_phone'         => $data['customer_phone'],
                'notes'                  => $data['notes'] ?? null,
                'scheduled_at'           => $scheduledAt,
                'total_duration_minutes' => $totalDuration,
                'total_price'            => $totalPrice,
                'status'                 => BookingStatus::PendingPayment,
                'payment_deadline_at'    => now()->addMinutes((int) config('booking.payment_window', 10)),
                'type'                   => BookingType::Online,
            ]);

            foreach ($services as $svc) {
                $booking->services()->create([
                    'service_id'       => $svc['service_id'],
                    'service_name'     => $svc['name'],
                    'price'            => $svc['price'],
                    'duration_minutes' => $svc['duration_minutes'],
                ]);
            }

            return $booking->load(['barber:id,name,slug', 'branch:id,name,slug', 'services']);
        });
    }

    public function createWalkinBooking(array $data, ?string $customerUserId): Booking
    {
        $scheduledAt = Carbon::parse($data['scheduled_at']);

        return DB::transaction(function () use ($data, $customerUserId, $scheduledAt) {
            $services      = $this->resolveServices($data['service_ids'], $data['branch_id']);
            $totalDuration = $services->sum('duration_minutes');
            $totalPrice    = $services->sum('price');

            $booking = Booking::create([
                'booking_number'         => $this->generateBookingNumber(),
                'branch_id'              => $data['branch_id'],
                'barber_id'              => $data['barber_id'],
                'customer_user_id'       => $customerUserId,
                'customer_name'          => $data['customer_name'],
                'customer_phone'         => $data['customer_phone'] ?? null,
                'notes'                  => $data['notes'] ?? null,
                'scheduled_at'           => $scheduledAt,
                'total_duration_minutes' => $totalDuration,
                'total_price'            => $totalPrice,
                'status'                 => BookingStatus::Confirmed,
                'type'                   => BookingType::Walkin,
                'confirmed_at'           => now(),
            ]);

            foreach ($services as $svc) {
                $booking->services()->create([
                    'service_id'       => $svc['service_id'],
                    'service_name'     => $svc['name'],
                    'price'            => $svc['price'],
                    'duration_minutes' => $svc['duration_minutes'],
                ]);
            }

            return $booking->load(['barber:id,name,slug', 'branch:id,name,slug', 'services']);
        });
    }

    private function resolveServices(array $serviceIds, string $branchId): Collection
    {
        $globalServices = Service::whereIn('id', $serviceIds)->get()->keyBy('id');
        $branchPrices   = BranchServicePrice::where('branch_id', $branchId)
            ->whereIn('service_id', $serviceIds)
            ->where('is_active', true)
            ->get()
            ->keyBy('service_id');

        return collect($serviceIds)->map(function ($id) use ($globalServices, $branchPrices) {
            $service = $globalServices[$id] ?? null;
            if (! $service) {
                throw new \RuntimeException("Layanan {$id} tidak ditemukan.");
            }

            $price = isset($branchPrices[$id])
                ? (float) $branchPrices[$id]->price
                : (float) $service->default_price;

            return [
                'service_id'       => $id,
                'name'             => $service->name,
                'price'            => $price,
                'duration_minutes' => $service->duration_minutes,
            ];
        });
    }

    private function generateBookingNumber(): string
    {
        $date   = now()->format('Ymd');
        $prefix = "MB-{$date}-";

        $last = Booking::where('booking_number', 'like', $prefix . '%')
            ->lockForUpdate()
            ->orderByDesc('booking_number')
            ->value('booking_number');

        $seq = $last ? (int) substr($last, -4) + 1 : 1;

        return $prefix . str_pad($seq, 4, '0', STR_PAD_LEFT);
    }
}
