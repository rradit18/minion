<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromoUsage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'promo_id',
        'receipt_id',
        'user_id',
        'discount_applied',
    ];

    protected function casts(): array
    {
        return [
            'discount_applied' => 'decimal:2',
        ];
    }

    public function promo()
    {
        return $this->belongsTo(Promo::class);
    }

    public function receipt()
    {
        return $this->belongsTo(Receipt::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
