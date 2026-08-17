<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artisans', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('honorific', 50)->default('NNƯT.');
            $table->string('birth_year', 50)->nullable();
            $table->string('village', 100)->nullable();
            $table->string('avatar', 255)->nullable();
            $table->text('bio')->nullable();
            $table->text('quote')->nullable();
            $table->json('specialties')->nullable();
            $table->json('awards')->nullable();
            $table->json('songs')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artisans');
    }
};
