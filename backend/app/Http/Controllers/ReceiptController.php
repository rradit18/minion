<?php

namespace App\Http\Controllers;

use App\Models\PunchCardHistory;
use App\Models\Receipt;
use Illuminate\Http\Response;

class ReceiptController extends Controller
{
    /** Stempel yang dibutuhkan untuk satu reward (lihat LoyaltyService::punch). */
    private const PUNCH_THRESHOLD = 10;

    public function show(string $receiptId): Response|\Illuminate\Contracts\View\View
    {
        $receipt = Receipt::with([
            'items',
            'booking.barber:id,name',
            'booking.branch:id,name,phone',
            'branch:id,name,phone',
            'kasir:id,name',
        ])->findOrFail($receiptId);

        // Info loyalty hanya untuk struk layanan (ada booking) dari customer terdaftar.
        $loyalty = $this->loyaltyForReceipt($receipt);

        return view('receipt', compact('receipt', 'loyalty'));
    }

    private function loyaltyForReceipt(Receipt $receipt): ?array
    {
        $customerId = $receipt->booking?->customer_user_id;
        if (! $customerId) {
            return null;
        }

        $history = PunchCardHistory::where('booking_id', $receipt->booking_id)
            ->where('customer_user_id', $customerId)
            ->get();

        $punch = $history->firstWhere('action', 'punch');
        if (! $punch) {
            return null;
        }

        $stamps       = (int) $punch->punch_count_after;          // 1..10 pada kunjungan ini
        $rewardEarned = $history->contains(fn($h) => $h->action === 'reward');

        return [
            'stamps'        => $stamps,
            'threshold'     => self::PUNCH_THRESHOLD,
            'remaining'     => max(0, self::PUNCH_THRESHOLD - $stamps),
            'reward_earned' => $rewardEarned,
        ];
    }
}
