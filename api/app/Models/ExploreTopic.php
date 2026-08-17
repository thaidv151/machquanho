<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExploreTopic extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'image',
        'badge',
        'details',
        'highlights',
    ];

    protected $casts = [
        'details' => 'array',
        'highlights' => 'array',
    ];
}
