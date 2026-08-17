<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_configs', function (Blueprint $table) {
            $table->id();
            $table->string('site_name', 100)->default('Mạch Quan Họ');
            $table->string('logo_type', 50)->default('text');
            $table->string('logo_text', 100)->default('Mạch Quan Họ');
            $table->string('logo_subtext', 100)->default('Di sản Văn hóa Kinh Bắc');
            $table->string('logo_image_url', 255)->nullable();
            $table->json('banner')->nullable();
            $table->string('contact_email', 100)->nullable();
            $table->string('contact_phone', 50)->nullable();
            $table->string('address', 255)->nullable();
            $table->json('social_links')->nullable();
            $table->json('header_config')->nullable();
            $table->json('footer')->nullable();
            $table->json('seo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_configs');
    }
};
