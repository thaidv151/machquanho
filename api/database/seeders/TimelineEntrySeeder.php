<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TimelineEntry;

class TimelineEntrySeeder extends Seeder
{
    public function run(): void
    {
        if (TimelineEntry::count() > 0) {
            return;
        }

        $heritageEntries = [
            [
                'tab_type' => 'heritage',
                'time_period' => 'Thế kỷ XV – XVI',
                'title' => 'Khởi nguồn sinh hoạt dân gian',
                'description' => 'Hình thành trong sinh hoạt dân gian vùng Kinh Bắc, gắn với tục kết bạn và hát đối giao duyên.',
                'image_url' => '/images/quan_ho_thuyen_rong.jpg',
                'icon_type' => 'tree',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'tab_type' => 'heritage',
                'time_period' => 'Thế kỷ XVII – XVIII',
                'title' => 'Hình thành làng Quan họ gốc',
                'description' => 'Phát triển mạnh trong các làng Quan họ, hình thành các làn điệu cổ và không gian diễn xướng đặc trưng.',
                'image_url' => 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
                'icon_type' => 'tree',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'tab_type' => 'heritage',
                'time_period' => 'Thế kỷ XIX – đầu XX',
                'title' => 'Lan tỏa rộng khắp vùng Kinh Bắc',
                'description' => 'Quan họ lan tỏa rộng khắp Kinh Bắc, trở thành nét văn hóa đặc sắc của vùng đất quan họ.',
                'image_url' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
                'icon_type' => 'pagoda',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'tab_type' => 'heritage',
                'time_period' => '1950 – 1980',
                'title' => 'Phục hồi và phát triển phong trào',
                'description' => 'Được phục hồi và phát triển trong các phong trào văn hóa – nghệ thuật của địa phương.',
                'image_url' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
                'icon_type' => 'building',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'tab_type' => 'heritage',
                'time_period' => '2009',
                'title' => 'UNESCO vinh danh di sản thế giới',
                'description' => 'Dân ca Quan họ Bắc Ninh được UNESCO ghi danh là Di sản văn hóa phi vật thể đại diện của nhân loại.',
                'image_url' => 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
                'icon_type' => 'unesco',
                'sort_order' => 5,
                'is_active' => true,
            ],
        ];

        $policyEntries = [
            [
                'tab_type' => 'policy',
                'time_period' => 'Nghị quyết 05/2010',
                'title' => 'Đề án Đãi ngộ Nghệ nhân & Bảo tồn',
                'description' => 'Chính sách bảo tồn và phát huy giá trị di sản văn hóa Dân ca Quan họ Bắc Ninh giai đoạn 2010 - 2020.',
                'image_url' => 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
                'icon_type' => 'building',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'tab_type' => 'policy',
                'time_period' => 'Nghị quyết 71/2017',
                'title' => 'Hỗ trợ Câu lạc bộ Quan họ',
                'description' => 'Quy định chế độ đãi ngộ đối với Nghệ nhân Dân ca Quan họ Bắc Ninh và hỗ trợ kinh phí hoạt động cho các CLB Quan họ.',
                'image_url' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
                'icon_type' => 'building',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'tab_type' => 'policy',
                'time_period' => 'Nghị quyết 09/2022',
                'title' => 'Tôn vinh Làng Quan họ thực hành',
                'description' => 'Chính sách hỗ trợ kinh phí cho các nghệ nhân, CLB Quan họ gốc và các làng Quan họ thực hành tiêu biểu.',
                'image_url' => 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
                'icon_type' => 'unesco',
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];

        foreach (array_merge($heritageEntries, $policyEntries) as $entry) {
            TimelineEntry::create($entry);
        }
    }
}
