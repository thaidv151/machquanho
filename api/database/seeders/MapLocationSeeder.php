<?php

namespace Database\Seeders;

use App\Models\MapLocation;
use Illuminate\Database\Seeder;

class MapLocationSeeder extends Seeder
{
    public function run(): void
    {
        // No fake mock data. Map locations are managed exclusively by administrator in CMS.
        $locations = [];

        foreach ($locations as $data) {
            MapLocation::create($data);
        }
    }
}
