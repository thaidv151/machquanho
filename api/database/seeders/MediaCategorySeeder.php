<?php

namespace Database\Seeders;

use App\Models\MediaCategory;
use Illuminate\Database\Seeder;

class MediaCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Nghe bài Quan họ',
                'slug' => 'nghe-bai-quan-ho',
                'description' => 'Các làn điệu Dân ca Quan họ cổ truyền và trình diễn đặc sắc.',
                'order_index' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Nghe chuyện Quan họ',
                'slug' => 'nghe-chuyen-quan-ho',
                'description' => 'Những câu chuyện, giai thoại và phong tục kết bạn giao duyên Kinh Bắc.',
                'order_index' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Người giữ Mạch kể',
                'slug' => 'nguoi-giu-mach-ke',
                'description' => 'Chân dung và chia sẻ của các Nghệ nhân Nhân dân, Nghệ nhân Ưu tú.',
                'order_index' => 3,
                'is_active' => true,
            ],
            [
                'name' => '60 giây thấu Quan họ',
                'slug' => '60-giay-thau-quan-ho',
                'description' => 'Video ngắn, podcast và tri thức Quan họ đúc kết cô đọng.',
                'order_index' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $cat) {
            MediaCategory::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
