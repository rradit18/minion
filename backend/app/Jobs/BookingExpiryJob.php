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
        // Lepas slot yang sudah lewat batas waktu pembayaran tanpa upload bukti.
        // (pending_confirmation = sudah bayar/menunggu verifikasi kasir → tidak di-expire otomatis.)
        Booking::where('status', BookingStatus::PendingPayment)
            ->whereNotNull('payment_deadline_at')
            ->where('payment_deadline_at', '<=', now())
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
