<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'site_name',
        'logo_type',
        'logo_text',
        'logo_subtext',
        'logo_image_url',
        'banner',
        'contact_email',
        'contact_phone',
        'address',
        'social_links',
        'header_config',
        'footer',
        'seo',
    ];

    protected $casts = [
        'banner' => 'array',
        'social_links' => 'array',
        'header_config' => 'array',
        'footer' => 'array',
        'seo' => 'array',
    ];
}
