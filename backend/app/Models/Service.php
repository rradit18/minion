<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'description',
        'duration_minutes',
        'default_price',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active'        => 'boolean',
            'default_price'    => 'decimal:2',
            'duration_minutes' => 'integer',
        ];
    }

    public function branchPrices()
    {
        return $this->hasMany(BranchServicePrice::class);
    }

    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'branch_service_prices')
            ->withPivot('price', 'is_active')
            ->withTimestamps();
    }
}
