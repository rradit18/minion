<?php

namespace App\Models;

use App\Enums\ProductCategory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'branch_id',
        'name',
        'image_path',
        'category',
        'sku',
        'price',
        'stock_qty',
        'low_stock_threshold',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'category'            => ProductCategory::class,
            'price'               => 'decimal:2',
            'stock_qty'           => 'integer',
            'low_stock_threshold' => 'integer',
            'is_active'           => 'boolean',
        ];
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function isLowStock(): bool
    {
        return $this->stock_qty <= $this->low_stock_threshold;
    }
}
