<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaPost extends Model
{
    protected $table = 'media_posts';

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'sub_title',
        'description',
        'content',
        'media_type',
        'media_url',
        'thumbnail_url',
        'duration',
        'is_featured',
        'view_count',
        'play_count',
        'status',
        'published_at',
    ];

    protected $casts = [
        'category_id' => 'integer',
        'is_featured' => 'boolean',
        'view_count' => 'integer',
        'play_count' => 'integer',
        'published_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(MediaCategory::class, 'category_id');
    }
}
