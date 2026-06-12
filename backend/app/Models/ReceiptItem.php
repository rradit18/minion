<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReceiptItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'receipt_id',
        'service_id',
        'item_name',
        'price',
        'quantity',
        'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'price'    => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function receipt()
    {
        return $this->belongsTo(Receipt::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
