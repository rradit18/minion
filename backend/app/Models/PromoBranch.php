<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromoBranch extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'promo_id',
        'branch_id',
    ];

    public function promo()
    {
        return $this->belongsTo(Promo::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
