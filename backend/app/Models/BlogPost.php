<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image_url',
        'tags',
        'status',
        'published_at',
        'author_id',
    ];

    protected function casts(): array
    {
        return [
            'tags'         => 'array',
            'published_at' => 'datetime',
        ];
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
