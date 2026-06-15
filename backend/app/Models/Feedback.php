<?php

namespace App\Models;

use App\Enums\FeedbackCategory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'branch_id',
        'user_id',
        'stars',
        'category',
        'message',
        'customer_name',
        'customer_phone',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'stars'    => 'integer',
            'is_read'  => 'boolean',
            'category' => FeedbackCategory::class,
        ];
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
