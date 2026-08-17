<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('explore_topics', function (Blueprint $table) {
            $table->id();
            $table->string('title', 191);
            $table->string('subtitle', 191)->nullable();
            $table->text('description')->nullable();
            $table->string('image', 255)->nullable();
            $table->string('badge', 50)->default('Khám phá');
            $table->json('details')->nullable();
            $table->json('highlights')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('explore_topics');
    }
};
