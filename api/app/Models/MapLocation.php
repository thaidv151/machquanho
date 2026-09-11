<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MapLocation extends Model
{
    use HasFactory;

    protected $table = 'map_locations';

    protected $fillable = [
        'title',
        'category',
        'address',
        'latitude',
        'longitude',
        'image_url',
        'summary',
        'content',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'status' => 'boolean',
        'sort_order' => 'integer',
    ];
}
