<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('category_name', 100)->default('Sự kiện');
            $table->string('title', 191);
            $table->string('slug', 191)->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable(); // JSON or text array
            $table->string('cover_image', 255)->nullable();
            $table->string('image_caption', 255)->nullable();
            $table->string('author', 100)->default('Ban biên tập');
            $table->string('author_role', 100)->default('Tác giả');
            $table->string('author_avatar', 255)->nullable();
            $table->string('date', 50)->nullable();
            $table->string('read_time', 50)->default('5 phút đọc');
            $table->boolean('featured')->default(false);
            $table->json('tags')->nullable();
            $table->integer('views')->default(0);
            $table->string('status', 50)->default('Đã đăng');
            $table->string('audio_title', 255)->nullable();
            $table->string('audio_duration', 50)->nullable();
            $table->json('quote')->nullable();
            $table->json('gallery_images')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
