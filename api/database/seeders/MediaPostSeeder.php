<?php

namespace Database\Seeders;

use App\Models\MediaCategory;
use App\Models\MediaPost;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MediaPostSeeder extends Seeder
{
    public function run(): void
    {
        $cat1 = MediaCategory::where('slug', 'nghe-bai-quan-ho')->first();
        $cat2 = MediaCategory::where('slug', 'nghe-chuyen-quan-ho')->first();
        $cat3 = MediaCategory::where('slug', 'nguoi-giu-mach-ke')->first();
        $cat4 = MediaCategory::where('slug', '60-giay-thau-quan-ho')->first();

        if ($cat1) {
            $postsCat1 = [
                [
                    'title' => 'Người ơi người ở đừng về',
                    'slug' => 'nguoi-oi-nguoi-o-dung-ve',
                    'sub_title' => 'Dân ca Quan họ cổ',
                    'description' => 'Một canh hát Quan họ truyền thống tại làng Diềm – Bắc Ninh, mộc mạc và đầy cảm xúc.',
                    'content' => 'Làn điệu "Người ơi người ở đừng về" là bài ca giã bạn nổi tiếng nhất trong Dân ca Quan họ Bắc Ninh. Ca từ thể hiện sự bịt rịn, lưu luyến sâu sắc giữa các liền anh liền chị khi cuộc hát canh sắp khép lại.',
                    'media_type' => 'audio',
                    'media_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
                    'duration' => '04:35',
                    'is_featured' => true,
                    'status' => 'published',
                ],
                [
                    'title' => 'Cây trúc xinh',
                    'slug' => 'cay-truc-xinh',
                    'sub_title' => 'Dân ca Quan họ cổ',
                    'description' => 'Điệu hát đối đáp ví von hình ảnh cây trúc mọc bên chùa với vẻ đẹp duyên dáng của người Quan họ.',
                    'content' => 'Cây trúc xinh mọc bờ đình gieo duyên nét đẹp thanh cao, mộc mạc và thủy chung của người dân vùng đất Kinh Bắc.',
                    'media_type' => 'audio',
                    'media_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                    'duration' => '03:42',
                    'is_featured' => false,
                    'status' => 'published',
                ],
                [
                    'title' => 'Hoa thơm bướm lượn',
                    'slug' => 'hoa-thom-buom-luon',
                    'sub_title' => 'Dân ca Quan họ cổ',
                    'description' => 'Giọng vặt tươi vui miêu tả cảnh thiên nhiên rộn rã và tình cảm tươi trẻ giao duyên.',
                    'content' => 'Điệu hát gợi lên không gian mùa xuân Kinh Bắc rộn rã tiếng ca hát hòa cùng tiếng sáo trúc đằm thắm.',
                    'media_type' => 'audio',
                    'media_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
                    'duration' => '03:56',
                    'is_featured' => false,
                    'status' => 'published',
                ],
                [
                    'title' => 'Mời nước mời trầu',
                    'slug' => 'moi-nuoc-moi-trau',
                    'sub_title' => 'Dân ca Quan họ cổ',
                    'description' => 'Màn hát mở đầu trang trọng thể hiện sự mến khách, tinh tế trong lề lối ứng xử Quan họ.',
                    'content' => 'Khái niệm "Trầu têm cánh phụng" mang đậm triết lý lòng mến khách và sự khéo léo thanh lịch của liền chị Kinh Bắc.',
                    'media_type' => 'audio',
                    'media_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
                    'duration' => '04:11',
                    'is_featured' => false,
                    'status' => 'published',
                ],
                [
                    'title' => 'Thương nhau nhớ ai',
                    'slug' => 'thuong-nhau-nho-ai',
                    'sub_title' => 'Dân ca Quan họ cổ',
                    'description' => 'Điệu ca da diết thể hiện nỗi niềm thương nhớ đồng điệu giữa hai bọn Quan họ kết nghĩa.',
                    'content' => 'Giai điệu mượt mà, sâu lắng đi cùng giọng vang rền nền nẩy của các nghệ nhân làng cổ.',
                    'media_type' => 'audio',
                    'media_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
                    'duration' => '04:20',
                    'is_featured' => false,
                    'status' => 'published',
                ],
            ];

            foreach ($postsCat1 as $p) {
                MediaPost::firstOrCreate(['slug' => $p['slug']], array_merge($p, ['category_id' => $cat1->id]));
            }
        }

        if ($cat2) {
            $postsCat2 = [
                [
                    'title' => 'Tục kết bạn giao duyên và lời thề không lấy nhau',
                    'slug' => 'tuc-ket-ban-giao-duyen',
                    'sub_title' => 'Giai thoại Quan họ',
                    'description' => 'Tìm hiểu nguồn gốc triết lý kết bạn thiêng liêng giữa các bọn Quan họ làng anh và làng chị.',
                    'content' => 'Người Quan họ kết bạn với nhau không phải để lấy nhau làm vợ chồng mà để trao truyền tri âm tri kỷ.',
                    'media_type' => 'audio',
                    'media_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
                    'duration' => '06:15',
                    'is_featured' => false,
                    'status' => 'published',
                ],
            ];
            foreach ($postsCat2 as $p) {
                MediaPost::firstOrCreate(['slug' => $p['slug']], array_merge($p, ['category_id' => $cat2->id]));
            }
        }

        if ($cat3) {
            $postsCat3 = [
                [
                    'title' => 'Nghệ nhân Nhân dân Tạ Thị Hình và ký ức 70 năm giữ lửa Quan họ',
                    'slug' => 'nghe-nhan-ta-thi-hinh',
                    'sub_title' => 'Truyện đời Nghệ nhân',
                    'description' => 'Lắng nghe những mảng ký ức điền dã sưu tầm những điệu hát cổ tưởng như đã thất truyền.',
                    'content' => 'Nghệ nhân Tạ Thị Hình chia sẻ về kỹ thuật nhả chữ, buông câu vang rền nền nẩy được truyền từ thế hệ trước.',
                    'media_type' => 'audio',
                    'media_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
                    'duration' => '08:40',
                    'is_featured' => false,
                    'status' => 'published',
                ],
            ];
            foreach ($postsCat3 as $p) {
                MediaPost::firstOrCreate(['slug' => $p['slug']], array_merge($p, ['category_id' => $cat3->id]));
            }
        }

        if ($cat4) {
            $postsCat4 = [
                [
                    'title' => 'Giải mã kỹ thuật Vang – Rền – Nền – Nẩy trong 60 giây',
                    'slug' => 'giai-ma-ky-thuat-vang-ren-nen-nay',
                    'sub_title' => 'Tri thức Quan họ',
                    'description' => '4 đặc trưng nguyên bản tạo nên chất giọng Quan họ đặc sắc của người Kinh Bắc.',
                    'content' => 'Vang là ngân xa, Rền là rền rĩ tình cảm, Nền là chắc chắn nhịp điệu, Nẩy là kỹ thuật nẩy hạt tinh tế.',
                    'media_type' => 'video',
                    'media_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
                    'duration' => '01:00',
                    'is_featured' => false,
                    'status' => 'published',
                ],
            ];
            foreach ($postsCat4 as $p) {
                MediaPost::firstOrCreate(['slug' => $p['slug']], array_merge($p, ['category_id' => $cat4->id]));
            }
        }
    }
}
