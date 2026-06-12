<?php

namespace App\Models;

use App\Enums\BookingStatus;
use App\Enums\BookingType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'booking_number',
        'branch_id',
        'barber_id',
        'customer_user_id',
        'customer_name',
        'customer_phone',
        'notes',
        'scheduled_at',
        'total_duration_minutes',
        'total_price',
        'status',
        'type',
        'reschedule_count',
        'original_scheduled_at',
        'confirmed_at',
        'started_at',
        'completed_at',
        'expired_at',
        'cancelled_at',
        'cancelled_by',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at'          => 'datetime',
            'original_scheduled_at' => 'datetime',
            'confirmed_at'          => 'datetime',
            'started_at'            => 'datetime',
            'completed_at'          => 'datetime',
            'expired_at'            => 'datetime',
            'cancelled_at'          => 'datetime',
            'status'                => BookingStatus::class,
            'type'                  => BookingType::class,
            'total_price'           => 'decimal:2',
        ];
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function barber()
    {
        return $this->belongsTo(Barber::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_user_id');
    }

    public function services()
    {
        return $this->hasMany(BookingService::class);
    }

    public function rating()
    {
        return $this->hasOne(Rating::class);
    }

    public function receipt()
    {
        return $this->hasOne(Receipt::class);
    }
}
