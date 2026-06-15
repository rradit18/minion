<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PunchCardHistory extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'customer_user_id',
        'booking_id',
        'action',
        'punch_count_after',
        'note',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_user_id');
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
