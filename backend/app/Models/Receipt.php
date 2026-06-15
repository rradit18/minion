<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'receipt_number',
        'booking_id',
        'kasir_id',
        'branch_id',
        'subtotal',
        'promo_discount',
        'tip_amount',
        'total',
        'payment_method',
        'amount_paid',
        'change_amount',
    ];

    protected function casts(): array
    {
        return [
            'subtotal'       => 'decimal:2',
            'promo_discount' => 'decimal:2',
            'tip_amount'     => 'decimal:2',
            'total'          => 'decimal:2',
            'amount_paid'    => 'decimal:2',
            'change_amount'  => 'decimal:2',
            'payment_method' => PaymentMethod::class,
        ];
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function kasir()
    {
        return $this->belongsTo(User::class, 'kasir_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function items()
    {
        return $this->hasMany(ReceiptItem::class);
    }

    public function promoUsages()
    {
        return $this->hasMany(PromoUsage::class);
    }
}
