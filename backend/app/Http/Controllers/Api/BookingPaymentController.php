<?php

namespace App\Http\Controllers\Api;

use App\Enums\BookingStatus;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BranchBankAccount;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class BookingPaymentController extends Controller
{
    use ApiResponse;

    /**
     * Info pembayaran: sisa waktu (server), total, QRIS cabang, rekening cabang.
     * Sumber kebenaran deadline ada di server; melepas slot kedaluwarsa secara lazy.
     */
    public function paymentInfo(string $bookingNumber): JsonResponse
    {
        $booking = Booking::where('booking_number', $bookingNumber)
            ->with('branch:id,name,qris_image_path')
            ->first();

        if (! $booking) {
            return $this->error('Booking tidak ditemukan.', 404);
        }

        $this->expireIfOverdue($booking);

        $remaining = ($booking->status === BookingStatus::PendingPayment && $booking->payment_deadline_at)
            ? max(0, (int) now()->diffInSeconds($booking->payment_deadline_at, false))
            : 0;

        $bankAccounts = BranchBankAccount::where('branch_id', $booking->branch_id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get(['bank_name', 'account_number', 'account_holder']);

        $qrisUrl = $booking->branch?->qris_image_path
            ? Storage::disk('public')->url($booking->branch->qris_image_path)
            : null;

        return $this->ok('OK', [
            'booking_number'    => $booking->booking_number,
            'status'            => $booking->status->value,
            'total_price'       => (float) $booking->total_price,
            'deadline_at'       => $booking->payment_deadline_at?->toIso8601String(),
            'remaining_seconds' => $remaining,
            'proof_uploaded'    => (bool) $booking->payment_proof_path,
            'qris_image_url'    => $qrisUrl,
            'bank_accounts'     => $bankAccounts,
        ]);
    }

    /**
     * Upload bukti transfer manual. Hanya sah jika masih dalam masa pembayaran.
     */
    public function uploadProof(Request $request, string $bookingNumber): JsonResponse
    {
        $booking = Booking::where('booking_number', $bookingNumber)->first();

        if (! $booking) {
            return $this->error('Booking tidak ditemukan.', 404);
        }

        $validated = $request->validate([
            'payment_method' => ['required', Rule::in(['bank_transfer', 'qris_external'])],
            'proof'          => ['required', 'image', 'max:4096'],
        ]);

        if ($booking->status !== BookingStatus::PendingPayment) {
            return $this->error('Booking tidak dalam masa pembayaran.', 422);
        }

        if ($this->expireIfOverdue($booking)) {
            return $this->error('Waktu pembayaran habis. Slot telah dilepas.', 422);
        }

        $path = $request->file('proof')->store('payment-proofs', 'public');

        $booking->update([
            'payment_method'     => $validated['payment_method'],
            'payment_proof_path' => $path,
            'proof_uploaded_at'  => now(),
            'status'             => BookingStatus::PendingConfirmation,
        ]);

        return $this->ok('Bukti pembayaran terkirim. Menunggu verifikasi kasir.', [
            'booking_number' => $booking->booking_number,
            'status'         => $booking->status->value,
        ]);
    }

    /** Tandai expired jika pending_payment dan deadline sudah lewat. Return true jika di-expire. */
    private function expireIfOverdue(Booking $booking): bool
    {
        if ($booking->status === BookingStatus::PendingPayment
            && $booking->payment_deadline_at
            && $booking->payment_deadline_at->isPast()) {
            $booking->update([
                'status'       => BookingStatus::Expired,
                'expired_at'   => now(),
                'cancelled_by' => 'system',
            ]);
            return true;
        }

        return false;
    }
}
