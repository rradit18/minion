<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'password',
        'role',
        'is_active',
        'branch_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password'  => 'hashed',
            'role'      => UserRole::class,
            'is_active' => 'boolean',
        ];
    }

    public function barber()
    {
        return $this->hasOne(Barber::class);
    }

    public function punchCard()
    {
        return $this->hasOne(CustomerPunchCard::class, 'customer_user_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'customer_user_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function getFilamentName(): string
    {
        return $this->name;
    }
}
