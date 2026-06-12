<?php

namespace App\Models;

use App\Enums\DiscountType;
use App\Enums\PromoRequiredRole;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'code',
        'name',
        'description',
        'discount_type',
        'discount_value',
        'free_service_id',
        'min_order',
        'valid_from',
        'valid_until',
        'max_uses',
        'max_uses_per_user',
        'used_count',
        'required_role',
        'is_active',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'valid_from'     => 'date',
            'valid_until'    => 'date',
            'discount_type'  => DiscountType::class,
            'required_role'  => PromoRequiredRole::class,
            'is_active'      => 'boolean',
            'discount_value' => 'decimal:2',
            'min_order'      => 'decimal:2',
        ];
    }

    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'promo_branches')->withTimestamps();
    }

    public function freeService()
    {
        return $this->belongsTo(Service::class, 'free_service_id');
    }

    public function usages()
    {
        return $this->hasMany(PromoUsage::class);
    }
}
