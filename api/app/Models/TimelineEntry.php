<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimelineEntry extends Model
{
    use HasFactory;

    protected $table = 'timeline_entries';

    protected $fillable = [
        'tab_type',
        'time_period',
        'title',
        'description',
        'image_url',
        'icon_type',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];
}
