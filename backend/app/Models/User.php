<?php

namespace App\Models;

use App\Enums\UserRole;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
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
        'force_password_change',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password'              => 'hashed',
            'role'                  => UserRole::class,
            'is_active'             => 'boolean',
            'force_password_change' => 'boolean',
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

    public function canAccessPanel(Panel $panel): bool
    {
        return match ($panel->getId()) {
            'admin'  => $this->role === UserRole::Admin  && $this->is_active,
            'kasir'  => $this->role === UserRole::Cashier && $this->is_active,
            'barber' => $this->role === UserRole::Barber  && $this->is_active,
            default  => false,
        };
    }

    public function getFilamentName(): string
    {
        return $this->name;
    }
}
