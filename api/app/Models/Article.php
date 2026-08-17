<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'category_name',
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'image_caption',
        'author',
        'author_role',
        'author_avatar',
        'date',
        'read_time',
        'featured',
        'tags',
        'views',
        'status',
        'audio_title',
        'audio_duration',
        'quote',
        'gallery_images',
    ];

    protected $casts = [
        'content' => 'array',
        'tags' => 'array',
        'quote' => 'array',
        'gallery_images' => 'array',
        'featured' => 'boolean',
        'views' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
