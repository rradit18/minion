<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'address',
        'city',
        'latitude',
        'longitude',
        'phone',
        'opening_time',
        'closing_time',
        'google_maps_url',
        'qris_image_path',
        'image_path',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function bankAccounts()
    {
        return $this->hasMany(BranchBankAccount::class);
    }

    public function servicePrices()
    {
        return $this->hasMany(BranchServicePrice::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'branch_service_prices')
            ->withPivot('price', 'is_active')
            ->withTimestamps();
    }

    public function barberAssignments()
    {
        return $this->hasMany(BarberBranchAssignment::class);
    }

    public function barbers()
    {
        return $this->belongsToMany(Barber::class, 'barber_branch_assignments')
            ->withPivot('is_active')
            ->withTimestamps();
    }

    public function shifts()
    {
        return $this->hasMany(BarberShift::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
