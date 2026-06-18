<?php

namespace App\Models;

use App\Enums\BarberSignatureColor;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Barber extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'photo_url',
        'photo_public_id',
        'bio',
        'tagline',
        'signature_color',
        'specializations',
        'instagram',
        'tiktok',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active'       => 'boolean',
            'specializations' => 'array',
            'signature_color' => BarberSignatureColor::class,
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branchAssignments()
    {
        return $this->hasMany(BarberBranchAssignment::class);
    }

    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'barber_branch_assignments')
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

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function getPhotoUrlAttribute($value): ?string
    {
        if (!$value) return null;
        if (str_starts_with($value, 'http')) return $value;
        return Storage::disk('public')->url($value);
    }

    public function getAvgRatingAttribute(): ?float
    {
        return $this->ratings()->avg('stars');
    }
}
