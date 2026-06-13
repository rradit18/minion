<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Promo;
use App\Models\PromoUsage;
use App\Models\Receipt;
use Illuminate\Support\Facades\DB;

class ReceiptService
{
    public function __construct(private LoyaltyService $loyalty) {}

    /**
     * Create a receipt for a completed booking (5-step POS flow).
     *
     * $data keys:
     *   booking_id, kasir_id, branch_id
     *   promo_id (nullable), promo_discount (float)
     *   tip_amount (float), payment_method (string)
     *   amount_paid (float)
     *   addons (array of {service_id, item_name, price})
     */
    public function create(array $data): Receipt
    {
        return DB::transaction(function () use ($data) {
            $booking = Booking::with('services')->findOrFail($data['booking_id']);

            // Build line items: original booking services + add-ons
            $items = $booking->services->map(fn($s) => [
                'service_id' => $s->service_id,
                'item_name'  => $s->service_name,
                'price'      => (float) $s->price,
                'quantity'   => 1,
                'subtotal'   => (float) $s->price,
            ])->toArray();

            foreach ($data['addons'] ?? [] as $addon) {
                $items[] = [
                    'service_id' => $addon['service_id'],
                    'item_name'  => $addon['item_name'],
                    'price'      => (float) $addon['price'],
                    'quantity'   => 1,
                    'subtotal'   => (float) $addon['price'],
                ];
            }

            $subtotal      = collect($items)->sum('subtotal');
            $promoDiscount = (float) ($data['promo_discount'] ?? 0);
            $tipAmount     = (float) ($data['tip_amount'] ?? 0);
            $total         = max(0.0, $subtotal - $promoDiscount);
            $amountPaid    = (float) ($data['amount_paid'] ?? $total);
            $changeAmount  = max(0.0, $amountPaid - $total);

            $receipt = Receipt::create([
                'receipt_number' => $this->generateReceiptNumber(),
                'booking_id'     => $booking->id,
                'kasir_id'       => $data['kasir_id'],
                'branch_id'      => $data['branch_id'],
                'subtotal'       => $subtotal,
                'promo_discount' => $promoDiscount,
                'tip_amount'     => $tipAmount,
                'total'          => $total,
                'payment_method' => $data['payment_method'],
                'amount_paid'    => $amountPaid,
                'change_amount'  => $changeAmount,
            ]);

            // Create receipt items
            foreach ($items as $item) {
                $receipt->items()->create($item);
            }

            // Mark booking completed
            $booking->update([
                'status'       => BookingStatus::Completed,
                'completed_at' => now(),
            ]);

            // Record promo usage
            if (! empty($data['promo_id']) && $promoDiscount > 0) {
                PromoUsage::create([
                    'promo_id'         => $data['promo_id'],
                    'receipt_id'       => $receipt->id,
                    'user_id'          => $booking->customer_user_id,
                    'discount_applied' => $promoDiscount,
                ]);
                Promo::where('id', $data['promo_id'])->increment('used_count');
            }

            // Loyalty punch (only for registered customers)
            if ($booking->customer_user_id) {
                $this->loyalty->punch($booking->customer_user_id, $booking->id);
            }

            return $receipt->load(['items', 'booking.barber', 'booking.branch', 'kasir:id,name']);
        });
    }

    private function generateReceiptNumber(): string
    {
        $date   = now()->format('Ymd');
        $prefix = "RCP-{$date}-";

        $last = Receipt::where('receipt_number', 'like', $prefix . '%')
            ->lockForUpdate()
            ->orderByDesc('receipt_number')
            ->value('receipt_number');

        $seq = $last ? (int) substr($last, -4) + 1 : 1;

        return $prefix . str_pad($seq, 4, '0', STR_PAD_LEFT);
    }
}
