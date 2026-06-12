<?php

namespace App\Jobs;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class BookingExpiryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        Booking::where('status', BookingStatus::PendingConfirmation)
            ->where('scheduled_at', '<=', now()->subMinutes(15))
            ->chunkById(100, function ($bookings) {
                foreach ($bookings as $booking) {
                    $booking->update([
                        'status'       => BookingStatus::Expired,
                        'expired_at'   => now(),
                        'cancelled_by' => 'system',
                    ]);
                }
            });
    }
}
