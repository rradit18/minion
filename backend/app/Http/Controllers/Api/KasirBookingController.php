<?php

namespace App\Http\Controllers\Api;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KasirBookingController extends Controller
{
    use ApiResponse;

    public function confirm(Request $request, string $id): JsonResponse
    {
        $kasir   = $request->user();
        $booking = Booking::where('id', $id)
            ->where('branch_id', $kasir->branch_id)
            ->where('status', BookingStatus::PendingConfirmation)
            ->firstOrFail();

        $booking->update([
            'status'       => BookingStatus::Confirmed,
            'confirmed_at' => now(),
        ]);

        return $this->updated('Booking dikonfirmasi.', $booking->id);
    }

    public function start(Request $request, string $id): JsonResponse
    {
        $kasir   = $request->user();
        $booking = Booking::where('id', $id)
            ->where('branch_id', $kasir->branch_id)
            ->where('status', BookingStatus::Confirmed)
            ->firstOrFail();

        $booking->update([
            'status'     => BookingStatus::InProgress,
            'started_at' => now(),
        ]);

        return $this->updated('Sesi dimulai.', $booking->id);
    }
}
