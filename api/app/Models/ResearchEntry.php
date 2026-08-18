<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResearchEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date',
        'location',
        'phase',
        'icon_type',
        'summary',
        'content',
        'findings',
        'images',
        'audio_title',
        'researcher',
        'sort_order',
    ];

    protected $casts = [
        'findings' => 'array',
        'images' => 'array',
        'sort_order' => 'integer',
    ];
}
