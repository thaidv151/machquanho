<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('page_banners', function (Blueprint $table) {
            $table->id();
            $table->string('page_code', 50)->unique();
            $table->string('page_name', 100);
            $table->string('tagline')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('bg_image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed initial page banners for default pages
        DB::table('page_banners')->insert([
            [
                'page_code' => 'about',
                'page_name' => 'Trang Về dự án (/about)',
                'tagline' => 'Giữ mạch di sản – Khơi mạch tương lai',
                'title' => 'Về dự án Mạch Quan Họ',
                'description' => '"Quan họ là câu ca kết nối cội nguồn quá khứ, nhịp thở hiện tại và mạch nguồn tương lai của vùng đất di sản Kinh Bắc."',
                'bg_image' => '/images/quan_ho_thuyen_rong.jpg',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_code' => 'research-diary',
                'page_name' => 'Trang Nhật ký nghiên cứu (/research-diary)',
                'tagline' => 'Tư liệu điền dã & Khảo sát thực địa',
                'title' => 'Nhật ký nghiên cứu di sản',
                'description' => 'Hành trình ghi nhận thực địa, phỏng vấn nghệ nhân tiền bối, số hóa tư liệu âm thanh cổ và phục dựng không gian diễn xướng Quan họ Kinh Bắc.',
                'bg_image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=75',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_code' => 'news',
                'page_name' => 'Trang Tin tức & Sự kiện (/news)',
                'tagline' => 'Thông tin & Truyền thông',
                'title' => 'Tin tức & Hoạt động di sản',
                'description' => 'Cập nhật toàn diện các sự kiện lễ hội, đề án bảo tồn, chính sách đãi ngộ nghệ nhân và các câu chuyện văn hóa đậm tình Kinh Bắc.',
                'bg_image' => 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=75',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_banners');
    }
};
