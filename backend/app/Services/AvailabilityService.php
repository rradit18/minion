<?php

namespace App\Services;

use App\Models\BarberShift;
use App\Models\Booking;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Support\Facades\Redis;

class AvailabilityService
{
    private const SLOT_INTERVAL = 30;
    private const BOOKING_BUFFER = 10;
    private const LOCK_TTL = 300;

    public function getAvailableSlots(string $barberId, string $date, array $serviceIds): array
    {
        $shift = BarberShift::where('barber_id', $barberId)
            ->where('shift_date', $date)
            ->whereNot('status', 'cancelled')
            ->first();

        if (! $shift) {
            return [];
        }

        $totalDuration = Service::whereIn('id', $serviceIds)->sum('duration_minutes');

        if ($totalDuration <= 0) {
            return [];
        }

        $slots = $this->generateSlots($shift, $date);
        $busyRanges = $this->getBusyRanges($barberId, $date);

        return collect($slots)
            ->filter(fn($slot) => $this->isSlotAvailable($slot, $totalDuration, $busyRanges, $barberId))
            ->map(fn($slot) => [
                'time'     => $slot->format('H:i'),
                'datetime' => $slot->toIso8601String(),
            ])
            ->values()
            ->all();
    }

    public function lockSlot(string $barberId, Carbon $scheduledAt, string $lockToken): bool
    {
        $key = $this->lockKey($barberId, $scheduledAt);

        return (bool) Redis::set($key, $lockToken, 'EX', self::LOCK_TTL, 'NX');
    }

    public function releaseSlot(string $barberId, Carbon $scheduledAt, string $lockToken): void
    {
        $key = $this->lockKey($barberId, $scheduledAt);

        if (Redis::get($key) === $lockToken) {
            Redis::del($key);
        }
    }

    public function isSlotLocked(string $barberId, Carbon $scheduledAt): bool
    {
        return (bool) Redis::exists($this->lockKey($barberId, $scheduledAt));
    }

    private function generateSlots(BarberShift $shift, string $date): array
    {
        $start = Carbon::parse("{$date} {$shift->start_time}", 'UTC');
        $end   = Carbon::parse("{$date} {$shift->end_time}", 'UTC');
        $slots = [];

        $current = $start->copy();
        while ($current->lt($end)) {
            $slots[] = $current->copy();
            $current->addMinutes(self::SLOT_INTERVAL);
        }

        // Remove break slots
        if ($shift->break_start && $shift->break_end) {
            $breakStart = Carbon::parse("{$date} {$shift->break_start}", 'UTC');
            $breakEnd   = Carbon::parse("{$date} {$shift->break_end}", 'UTC');
            $slots = array_filter($slots, fn($s) => $s->lt($breakStart) || $s->gte($breakEnd));
        }

        return array_values($slots);
    }

    private function getBusyRanges(string $barberId, string $date): array
    {
        return Booking::where('barber_id', $barberId)
            ->whereDate('scheduled_at', $date)
            ->where(function ($q) {
                // Booking yang sudah pasti menahan slot.
                $q->whereIn('status', ['pending_confirmation', 'confirmed', 'in_progress'])
                    // Slot yang masih dalam masa pembayaran (deadline belum lewat).
                    // Setelah deadline lewat, slot otomatis dianggap bebas (lazy release).
                    ->orWhere(fn ($q2) => $q2
                        ->where('status', 'pending_payment')
                        ->where('payment_deadline_at', '>', now()));
            })
            ->get(['scheduled_at', 'total_duration_minutes'])
            ->map(fn($b) => [
                'start' => $b->scheduled_at,
                'end'   => $b->scheduled_at->copy()->addMinutes($b->total_duration_minutes + self::BOOKING_BUFFER),
            ])
            ->all();
    }

    private function isSlotAvailable(Carbon $slot, int $duration, array $busyRanges, string $barberId): bool
    {
        $slotEnd = $slot->copy()->addMinutes($duration);

        foreach ($busyRanges as $range) {
            if ($slot->lt($range['end']) && $slotEnd->gt($range['start'])) {
                return false;
            }
        }

        if ($this->isSlotLocked($barberId, $slot)) {
            return false;
        }

        return true;
    }

    private function lockKey(string $barberId, Carbon $scheduledAt): string
    {
        return "slot_lock:{$barberId}:{$scheduledAt->unix()}";
    }
}
