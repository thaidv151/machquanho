<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artisan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'honorific',
        'birth_year',
        'village',
        'avatar',
        'bio',
        'quote',
        'specialties',
        'awards',
        'songs',
    ];

    protected $casts = [
        'specialties' => 'array',
        'awards' => 'array',
        'songs' => 'array',
    ];
}
