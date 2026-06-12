<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerPunchCard extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'customer_user_id',
        'punch_count',
        'lifetime_punch_count',
        'last_punched_at',
        'last_rewarded_at',
    ];

    protected function casts(): array
    {
        return [
            'last_punched_at'  => 'datetime',
            'last_rewarded_at' => 'datetime',
        ];
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_user_id');
    }

    public function history()
    {
        return $this->hasMany(PunchCardHistory::class, 'customer_user_id', 'customer_user_id');
    }
}
