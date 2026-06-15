<?php

namespace App\Services;

use App\Enums\DiscountType;
use App\Enums\PromoRequiredRole;
use App\Models\BranchServicePrice;
use App\Models\Promo;
use App\Models\PromoUsage;
use App\Models\Service;
use App\Models\User;

class PromoService
{
    /**
     * Validate a promo code and return the applicable discount.
     *
     * @param  string    $code
     * @param  float     $subtotal
     * @param  string    $branchId
     * @param  User|null $customer  The customer (not the kasir). Null = guest.
     * @return array     ['promo' => Promo, 'discount' => float]
     *
     * @throws \RuntimeException with HTTP status in $code property
     */
    public function validate(string $code, float $subtotal, string $branchId, ?User $customer): array
    {
        // 1. Exists?
        $promo = Promo::with('branches')->where('code', $code)->first();
        if (! $promo) {
            throw new \RuntimeException('Kode promo tidak ditemukan.', 404);
        }

        // 2. is_active?
        if (! $promo->is_active) {
            throw new \RuntimeException('Promo tidak aktif.', 422);
        }

        // 3. valid_from <= TODAY <= valid_until?
        $today = today();
        if ($today->lt($promo->valid_from) || $today->gt($promo->valid_until)) {
            throw new \RuntimeException('Promo belum atau sudah tidak berlaku.', 422);
        }

        // 4. Branch sesuai?
        if ($promo->branches->isNotEmpty() && ! $promo->branches->contains('id', $branchId)) {
            throw new \RuntimeException('Promo tidak berlaku di cabang ini.', 422);
        }

        // 5. required_role = registered_only tapi guest?
        if ($promo->required_role === PromoRequiredRole::RegisteredOnly && ! $customer) {
            throw new \RuntimeException('Promo khusus member terdaftar.', 422);
        }

        // 6. subtotal >= min_order?
        if ($promo->min_order && $subtotal < (float) $promo->min_order) {
            throw new \RuntimeException(
                'Minimum order Rp ' . number_format((float) $promo->min_order, 0, ',', '.') . '.',
                422
            );
        }

        // 7. max_uses not exceeded?
        if ($promo->max_uses !== null && $promo->used_count >= $promo->max_uses) {
            throw new \RuntimeException('Promo sudah habis digunakan.', 422);
        }

        // 8. max_uses_per_user not exceeded?
        if ($promo->max_uses_per_user !== null && $customer) {
            $usageCount = PromoUsage::where('promo_id', $promo->id)
                ->where('user_id', $customer->id)
                ->count();

            if ($usageCount >= $promo->max_uses_per_user) {
                throw new \RuntimeException('Kamu sudah menggunakan promo ini sebanyak batas maksimal.', 422);
            }
        }

        $discount = $this->calculateDiscount($promo, $subtotal, $branchId);

        return ['promo' => $promo, 'discount' => $discount];
    }

    public function calculateDiscount(Promo $promo, float $subtotal, string $branchId): float
    {
        return match ($promo->discount_type) {
            DiscountType::Percentage  => round($subtotal * ((float) $promo->discount_value / 100), 2),
            DiscountType::FixedAmount => min((float) $promo->discount_value, $subtotal),
            DiscountType::FreeService => $this->getFreeServicePrice($promo, $branchId),
        };
    }

    private function getFreeServicePrice(Promo $promo, string $branchId): float
    {
        if (! $promo->free_service_id) {
            return 0.0;
        }

        $price = BranchServicePrice::where('branch_id', $branchId)
            ->where('service_id', $promo->free_service_id)
            ->value('price');

        if ($price !== null) {
            return (float) $price;
        }

        return (float) (Service::find($promo->free_service_id)?->default_price ?? 0);
    }
}
