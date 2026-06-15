<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'booking_id',
        'barber_id',
        'customer_user_id',
        'stars',
        'comment',
        'is_anonymous',
    ];

    protected function casts(): array
    {
        return [
            'stars'        => 'integer',
            'is_anonymous' => 'boolean',
        ];
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function barber()
    {
        return $this->belongsTo(Barber::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_user_id');
    }
}
