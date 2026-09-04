<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageBanner extends Model
{
    use HasFactory;

    protected $table = 'page_banners';

    protected $fillable = [
        'page_code',
        'page_name',
        'tagline',
        'title',
        'description',
        'bg_image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
