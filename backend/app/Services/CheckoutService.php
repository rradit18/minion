<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\PaymentMethod;
use App\Models\Booking;
use App\Models\Receipt;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CheckoutService
{
    public function __construct(private PromoService $promoService) {}

    public function checkout(Booking $booking, array $data, User $kasir): Receipt
    {
        return DB::transaction(function () use ($booking, $data, $kasir) {
            $subtotal      = (float) $booking->total_price;
            $promoDiscount = 0.0;
            $promo         = null;

            if (! empty($data['promo_code'])) {
                $customer = $booking->customer_user_id
                    ? User::find($booking->customer_user_id)
                    : null;

                $result        = $this->promoService->validate(
                    $data['promo_code'],
                    $subtotal,
                    $booking->branch_id,
                    $customer,
                );
                $promoDiscount = $result['discount'];
                $promo         = $result['promo'];
            }

            $tip        = (float) ($data['tip_amount'] ?? 0);
            $total      = max(0, $subtotal - $promoDiscount + $tip);
            $amountPaid = isset($data['amount_paid']) ? (float) $data['amount_paid'] : null;
            $change     = ($amountPaid !== null) ? max(0, $amountPaid - $total) : null;

            $booking->update([
                'status'       => BookingStatus::Completed,
                'completed_at' => now(),
            ]);

            $receipt = Receipt::create([
                'receipt_number' => $this->generateReceiptNumber(),
                'booking_id'     => $booking->id,
                'kasir_id'       => $kasir->id,
                'branch_id'      => $booking->branch_id,
                'subtotal'       => $subtotal,
                'promo_discount' => $promoDiscount,
                'tip_amount'     => $tip,
                'total'          => $total,
                'payment_method' => PaymentMethod::from($data['payment_method']),
                'amount_paid'    => $amountPaid,
                'change_amount'  => $change,
            ]);

            foreach ($booking->services as $svc) {
                $receipt->items()->create([
                    'service_id' => $svc->service_id,
                    'item_name'  => $svc->service_name,
                    'price'      => (float) $svc->price,
                    'quantity'   => 1,
                    'subtotal'   => (float) $svc->price,
                ]);
            }

            if ($promo) {
                $receipt->promoUsages()->create([
                    'promo_id'         => $promo->id,
                    'user_id'          => $booking->customer_user_id,
                    'discount_applied' => $promoDiscount,
                ]);
                $promo->increment('used_count');
            }

            return $receipt->load('items');
        });
    }

    private function generateReceiptNumber(): string
    {
        $date   = now()->format('Ymd');
        $prefix = "RC-{$date}-";

        $last = Receipt::where('receipt_number', 'like', $prefix . '%')
            ->lockForUpdate()
            ->orderByDesc('receipt_number')
            ->value('receipt_number');

        $seq = $last ? (int) substr($last, -4) + 1 : 1;

        return $prefix . str_pad($seq, 4, '0', STR_PAD_LEFT);
    }
}
