<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('media_categories')->onDelete('cascade');
            $table->string('title');
            $table->string('slug');
            $table->string('sub_title')->nullable(); // Artist name or sub genre
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('media_type')->default('audio'); // 'audio', 'video', 'youtube_embed', 'local_upload'
            $table->text('media_url')->nullable();
            $table->text('thumbnail_url')->nullable();
            $table->string('duration')->nullable(); // e.g. "04:35"
            $table->boolean('is_featured')->default(false);
            $table->integer('view_count')->default(0);
            $table->integer('play_count')->default(0);
            $table->string('status')->default('published'); // 'published', 'draft'
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_posts');
    }
};
