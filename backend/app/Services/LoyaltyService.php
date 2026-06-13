<?php

namespace App\Services;

use App\Enums\DiscountType;
use App\Enums\PromoRequiredRole;
use App\Models\CustomerPunchCard;
use App\Models\Promo;
use App\Models\PunchCardHistory;
use App\Models\Service;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LoyaltyService
{
    public function punch(string $customerUserId, string $bookingId): void
    {
        DB::transaction(function () use ($customerUserId, $bookingId) {
            $card = CustomerPunchCard::firstOrCreate(
                ['customer_user_id' => $customerUserId],
                ['punch_count' => 0, 'lifetime_punch_count' => 0]
            );

            $card->increment('punch_count');
            $card->increment('lifetime_punch_count');
            $card->last_punched_at = now();
            $card->save();

            PunchCardHistory::create([
                'customer_user_id'  => $customerUserId,
                'booking_id'        => $bookingId,
                'action'            => 'punch',
                'punch_count_after' => $card->punch_count,
            ]);

            if ($card->punch_count % 10 === 0) {
                $this->generateReward($customerUserId);

                $card->punch_count      = 0;
                $card->last_rewarded_at = now();
                $card->save();

                PunchCardHistory::create([
                    'customer_user_id'  => $customerUserId,
                    'booking_id'        => $bookingId,
                    'action'            => 'reward',
                    'punch_count_after' => 0,
                    'note'              => 'Reward 10x potong generated',
                ]);
            }
        });
    }

    public function generateReward(string $customerUserId): Promo
    {
        return Promo::create([
            'code'              => 'LOYALTY-' . strtoupper(Str::random(8)),
            'name'              => 'Reward 10x Potong',
            'discount_type'     => DiscountType::FreeService,
            'free_service_id'   => $this->getDefaultRewardServiceId(),
            'required_role'     => PromoRequiredRole::RegisteredOnly,
            'max_uses'          => 1,
            'max_uses_per_user' => 1,
            'valid_from'        => today()->toDateString(),
            'valid_until'       => now()->addDays(30)->toDateString(),
            'is_active'         => true,
            'created_by'        => null,
        ]);
    }

    private function getDefaultRewardServiceId(): ?string
    {
        return Service::where('is_active', true)->orderBy('sort_order')->value('id');
    }
}
