<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MenuItem;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        if (MenuItem::count() > 0) {
            return;
        }

        $items = [
            ['label' => 'Trang chủ', 'view_type' => '/', 'icon' => 'Home', 'sort_order' => 1, 'is_active' => true],
            ['label' => 'Tin tức & Hoạt động', 'view_type' => '/news', 'icon' => 'Newspaper', 'sort_order' => 2, 'is_active' => true],
            ['label' => 'Nhật ký nghiên cứu', 'view_type' => '/research-diary', 'icon' => 'BookOpen', 'sort_order' => 3, 'is_active' => true],
            ['label' => 'Dòng chảy Quan họ', 'view_type' => '/timeline', 'icon' => 'Calendar', 'sort_order' => 4, 'is_active' => true],
            ['label' => 'Bản đồ di sản', 'view_type' => '/map', 'icon' => 'MapPin', 'sort_order' => 5, 'is_active' => true],
            ['label' => 'Về chúng tôi', 'view_type' => '/about', 'icon' => 'Users', 'sort_order' => 6, 'is_active' => true],
        ];

        foreach ($items as $item) {
            MenuItem::create($item);
        }
    }
}
