<?php

namespace App\Models;

use App\Enums\ShiftStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarberShift extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'barber_id',
        'branch_id',
        'shift_date',
        'start_time',
        'end_time',
        'break_start',
        'break_end',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'shift_date' => 'date',
            'status'     => ShiftStatus::class,
        ];
    }

    public function barber()
    {
        return $this->belongsTo(Barber::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
