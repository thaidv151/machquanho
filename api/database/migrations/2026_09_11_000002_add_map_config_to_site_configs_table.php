<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_configs', function (Blueprint $table) {
            if (!Schema::hasColumn('site_configs', 'map_config')) {
                $table->json('map_config')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('site_configs', function (Blueprint $table) {
            if (Schema::hasColumn('site_configs', 'map_config')) {
                $table->dropColumn('map_config');
            }
        });
    }
};
