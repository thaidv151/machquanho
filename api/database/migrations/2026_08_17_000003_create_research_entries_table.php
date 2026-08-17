<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('research_entries', function (Blueprint $table) {
            $table->id();
            $table->string('title', 191);
            $table->string('date', 50)->nullable();
            $table->string('location', 191)->nullable();
            $table->string('phase', 100)->nullable();
            $table->string('icon_type', 50)->default('book');
            $table->text('summary')->nullable();
            $table->longText('content')->nullable();
            $table->json('findings')->nullable();
            $table->json('images')->nullable();
            $table->string('audio_title', 255)->nullable();
            $table->string('researcher', 100)->default('Nhà nghiên cứu');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('research_entries');
    }
};
