<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Artisan;
use App\Models\Category;
use App\Models\ExploreTopic;
use App\Models\ResearchEntry;
use App\Models\SiteConfig;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin Users
        User::firstOrCreate(
            ['email' => 'admin@machquanho.vn'],
            [
                'name' => 'Nguyễn Văn A',
                'password' => Hash::make('password123'),
            ]
        );

        User::firstOrCreate(
            ['email' => 'thai@example.com'],
            [
                'name' => 'Thai Do',
                'password' => Hash::make('password123'),
            ]
        );

        // 2. Categories
        $categoriesData = [
            [
                'name' => 'Sự kiện',
                'slug' => 'su-kien',
                'count' => 12,
                'color' => '#8B263E',
                'description' => 'Các sự kiện lễ hội Quan họ, hội Lim và các hoạt động trình diễn văn hóa Kinh Bắc.',
            ],
            [
                'name' => 'Chính sách',
                'slug' => 'chinh-sach',
                'count' => 5,
                'color' => '#2E5B88',
                'description' => 'Văn bản, nghị quyết, đề án bảo tồn và phát huy giá trị di sản Dân ca Quan họ Bắc Ninh.',
            ],
            [
                'name' => 'Góc nhìn',
                'slug' => 'goc-nhin',
                'count' => 8,
                'color' => '#D97706',
                'description' => 'Bài phân tích, cảm nhận và chia sẻ từ các nhà nghiên cứu, nghệ nhân và độc giả.',
            ],
            [
                'name' => 'Hoạt động',
                'slug' => 'hoat-dong',
                'count' => 15,
                'color' => '#059669',
                'description' => 'Hoạt động truyền dạy Quan họ tại trường học, các CLB và chuyến đi điền dã sưu tầm.',
            ],
            [
                'name' => 'Nghệ nhân',
                'slug' => 'nghe-nhan',
                'count' => 9,
                'color' => '#7C3AED',
                'description' => 'Chân dung các Nghệ nhân Nhân dân, Nghệ nhân Ưu tú giữ lửa cho di sản Quan họ.',
            ],
            [
                'name' => 'Khám phá',
                'slug' => 'kham-pha',
                'count' => 11,
                'color' => '#DB2777',
                'description' => 'Tìm hiểu 49 làng Quan họ gốc, các phong tục tập quán, lề lối ứng xử và văn hóa Kinh Bắc.',
            ],
        ];

        $createdCategories = [];
        foreach ($categoriesData as $cat) {
            $createdCategories[$cat['name']] = Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }

        // 3. Articles
        $articles = [
            [
                'category_name' => 'Sự kiện',
                'title' => 'Bảo tồn lề lối hát canh cổ truyền trong không gian làng xã Kinh Bắc',
                'slug' => 'bao-ton-le-loi-hat-canh-co-truyen',
                'excerpt' => 'Nghiên cứu về nghi thức hát canh đêm Quan họ, từ phong tục tục kết bạn, ca đối đáp lề lối đến không gian nhà liền anh liền chị.',
                'content' => [
                    'Hát canh Quan họ là hình thức diễn xướng nguyên bản và tinh tế nhất của Dân ca Quan họ Bắc Ninh. Không đơn thuần là cuộc ca hát giải trí, mỗi đêm hát canh là một nghi lễ văn hóa thiêng liêng giữa hai bọn Quan họ kết nghĩa.',
                    'Một đêm hát canh chuẩn mực thường diễn ra từ chạng vạng tối đến tận mờ sáng hôm sau, trải qua 3 chặng ca: Giọng lề lối (mở đầu trang trọng), Giọng vặt (trữ tình phong phú) và Giọng giã bạn (lưu luyến bịt rịn).',
                    'Đặc biệt, trong không gian ấm cúng tại nhà trùm Quan họ, sự hòa quyện giữa kỹ thuật Vang - Rền - Nền - Nẩy cùng chén trà xanh nồng hậu đã tạo nên linh hồn di sản Kinh Bắc tồn tại qua hàng trăm năm.',
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
                'image_caption' => 'Không gian hát canh cổ truyền mộc mạc và ấm cúng',
                'author' => 'ThS. Nguyễn Văn Hoài',
                'author_role' => 'Chuyên gia Nghiên cứu Di sản',
                'date' => '18/02/2026',
                'read_time' => '6 phút đọc',
                'featured' => true,
                'tags' => ['Lề lối', 'Hát canh', 'Kinh Bắc', 'UNESCO'],
                'views' => 1850,
                'status' => 'Đã đăng',
                'audio_title' => 'Hát giao duyên: Khách Đến Chơi Nhà - Bản thu âm lề lối',
                'audio_duration' => '03:45',
            ],
            [
                'category_name' => 'Sự kiện',
                'title' => 'Khai mạc Lễ hội Lim 2026: Đêm thơ nhạc và giao lưu câu lạc bộ Quan họ cổ',
                'slug' => 'khai-mac-hoi-lim-2026-dem-tho-nhac',
                'excerpt' => 'Lễ hội truyền thống mở hội trên đồi Lim với hàng chục lán hát Quan họ, thu hút hàng vạn du khách và liền anh liền chị Kinh Bắc.',
                'content' => [
                    'Hội Lim năm nay khai mạc trong không khí xuân tưng bừng tại đồi Lim, thị trấn Lim, huyện Tiên Du, tỉnh Bắc Ninh. Đây là lễ hội văn hóa đặc sắc tụ hội hàng trăm câu lạc bộ Quan họ truyền thống.',
                    'Tại các lán hát Quan họ trên đồi, các liền anh áo tơi nón ba tầm, liền chị áo tứ thân khăn mỏ quạ cùng cất lên những câu hát mừng xuân, đón khách tha thiết.',
                    'Bên cạnh các lán hát, hội Lim năm nay còn tổ chức thi hát Quan họ trên thuyền rồng tại hồ điều hòa và các trò chơi dân gian như đấu vật, đu tiên, chọi gà.',
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?auto=format&fit=crop&w=1200&q=80',
                'image_caption' => 'Hội Lim tưng bừng với tiếng hát giao duyên trên thuyền rồng',
                'author' => 'Lê Thanh Tùng',
                'author_role' => 'Phóng viên Văn hóa',
                'date' => '17/02/2026',
                'read_time' => '4 phút đọc',
                'featured' => true,
                'tags' => ['Hội Lim', 'Tiên Du', 'Lễ hội xuân'],
                'views' => 3420,
                'status' => 'Đã đăng',
                'audio_title' => 'Mối Tình Tri Kỷ - Giọng vặt Hội Lim',
                'audio_duration' => '04:12',
            ],
            [
                'category_name' => 'Nghệ nhân',
                'title' => 'Nghệ nhân Nhân dân Thúy Hường và 40 năm giữ lửa câu ca Quan họ lề lối',
                'slug' => 'nghe-nhan-nhan-dan-thuy-huong-40-nam-giu-lua',
                'excerpt' => 'Cuộc trò chuyện điền dã sâu sắc với Nghệ nhân Nhân dân Thúy Hường về bí quyết luyến láy, nảy hạt và truyền nghề cho thế hệ trẻ.',
                'content' => [
                    'Nghệ nhân Nhân dân Thúy Hường là một trong những cây đại thụ của làn điệu Quan họ Kinh Bắc. Bà đã dành hơn 40 năm cuộc đời để sưu tầm, phục dựng và truyền dạy các bài Quan họ lề lối cổ.',
                    'Chia sẻ về kỹ thuật ca Quan họ, NNND Thúy Hường nhấn mạnh: "Hát Quan họ không chỉ bằng giọng mà bằng cả tấm lòng chân thành. Luyện nhả chữ vang, rền, nền, nẩy phải mất nhiều năm miệt mài."',
                    'Hiện nay bà vẫn tiếp tục mở các lớp dạy hát miễn phí cho thiếu nhi tại làng Diềm, nuôi dưỡng tình yêu di sản cho thế hệ tương lai.',
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
                'author' => 'Bích Ngọc',
                'author_role' => 'Biên tập viên Mạch Quan Họ',
                'date' => '15/02/2026',
                'read_time' => '7 phút đọc',
                'featured' => false,
                'tags' => ['Nghệ nhân', 'Thúy Hường', 'Làng Diềm'],
                'views' => 2190,
                'status' => 'Đã đăng',
            ],
            [
                'category_name' => 'Khám phá',
                'title' => 'Nghệ thuật nhả chữ, nảy hạt và vang rền nền nẩy trong Dân ca Quan họ',
                'slug' => 'nghe-thuat-nha-chu-nay-hat-trong-quan-ho',
                'excerpt' => 'Phân tích kỹ thuật thanh nhạc độc đáo "Vang - Rền - Nền - Nẩy" đặc trưng giúp tiếng hát Quan họ vừa ấm áp vừa bay bổng.',
                'content' => [
                    'Bốn đặc tính âm thanh "Vang - Rền - Nền - Nẩy" là bộ tiêu chuẩn vàng đánh giá trình độ ca hát của một liền anh, liền chị Quan họ.',
                    'Chữ "Vang" đòi hỏi khẩu hình mở rộng để âm thanh ngân xa. "Rền" là độ rung ngân mềm mại ở vòm họng. "Nền" giữ hơi thở vững vàng. "Nẩy" là kỹ thuật nảy hạt nốt nhạc li ti như hạt sương rơi.',
                    'Sự kết hợp tinh tế này giúp giọng hát Quan họ có sức lay động lòng người kỳ diệu.',
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
                'author' => 'Nhạc sĩ Vũ Trọng Bằng',
                'author_role' => 'Nhà nghiên cứu Thanh nhạc',
                'date' => '14/02/2026',
                'read_time' => '5 phút đọc',
                'featured' => false,
                'tags' => ['Thanh nhạc', 'Vang Rền Nền Nẩy', 'Kỹ thuật hát'],
                'views' => 1420,
                'status' => 'Đã đăng',
            ],
            [
                'category_name' => 'Chính sách',
                'title' => 'Bắc Ninh ban hành Nghị quyết chế độ đãi ngộ đặc thù cho Nghệ nhân Quan họ',
                'slug' => 'bac-ninh-nghi-quyet-che-do-dai-ngo-nghe-nhan',
                'excerpt' => 'Chính sách hỗ trợ kinh phí hàng tháng và bảo hiểm y tế cho các Nghệ nhân Nhân dân, Nghệ nhân Ưu tú nhằm vinh danh cống hiến.',
                'content' => [
                    'HĐND tỉnh Bắc Ninh đã thông qua Nghị quyết quy định chính sách đãi ngộ đặc thù đối với các Nghệ nhân tiêu biểu trong lĩnh vực di sản văn hóa phi vật thể.',
                    'Theo đó, các Nghệ nhân Nhân dân và Nghệ nhân Ưu tú Dân ca Quan họ được hưởng trợ cấp sinh hoạt hàng tháng, cấp thẻ bảo hiểm y tế miễn phí và hỗ trợ mai táng phí.',
                    'Chính sách nhân văn này góp phần tạo động lực lớn giúp các nghệ nhân an tâm gắn bó và truyền dạy di sản cho các thế hệ mai sau.',
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
                'author' => 'Phạm Hoàng Nam',
                'author_role' => 'Phóng viên Pháp luật & Chính sách',
                'date' => '12/02/2026',
                'read_time' => '4 phút đọc',
                'featured' => false,
                'tags' => ['Chính sách', 'Đãi ngộ', 'Bắc Ninh'],
                'views' => 980,
                'status' => 'Đã đăng',
            ],
            [
                'category_name' => 'Hoạt động',
                'title' => 'Số hóa hơn 200 băng cối thu âm Dân ca Quan họ cổ từ thập niên 1970',
                'slug' => 'so-hoa-bang-coi-thu-am-quan-ho-co',
                'excerpt' => 'Dự án Mạch Quan Họ hoàn thành số hóa tư liệu âm thanh dạng băng cối hiếm có do Viện Âm nhạc lưu trữ từ năm 1972.',
                'content' => [
                    'Nhóm kỹ thuật dự án Mạch Quan Họ hợp tác với các chuyên gia âm thanh đã phục chế và số hóa thành công hơn 200 cuộn băng cối thu âm Quan họ cổ.',
                    'Các bản thu này ghi lại giọng hát quý giá của những cụ trùm Quan họ sinh ra từ cuối thế kỷ 19, với nhiều làn điệu giã bạn và giọng vặt đã thất truyền.',
                    'Toàn bộ dữ liệu âm thanh số hóa chuẩn Hi-Res Audio sẽ được lưu trữ mở trên nền tảng web Mạch Quan Họ phục vụ cộng đồng nghiên cứu.',
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
                'author' => 'KTV. Đỗ Minh Quân',
                'author_role' => 'Trưởng nhóm Số hóa Âm thanh',
                'date' => '10/02/2026',
                'read_time' => '5 phút đọc',
                'featured' => false,
                'tags' => ['Số hóa', 'Băng cối', 'Tư liệu cổ'],
                'views' => 2760,
                'status' => 'Đã đăng',
            ],
            [
                'category_name' => 'Góc nhìn',
                'title' => 'Tục kết nghĩa chạ giữa các làng Quan họ: Tri kỷ và đạo lý ứng xử Kinh Bắc',
                'slug' => 'tuc-ket-nghia-cha-giua-cac-lang-quan-ho',
                'excerpt' => 'Tìm hiểu nghi thức kết nghĩa anh em giữa hai làng Diềm và Khả Lĩnh – nét đẹp văn hóa gắn kết tình làng nghĩa xóm.',
                'content' => [
                    'Tục kết chạ (kết nghĩa giữa các làng Quan họ) là một định chế xã hội độc đáo duy nhất chỉ có ở vùng văn hóa Kinh Bắc.',
                    'Khi hai làng đã kết chạ, người dân hai làng coi nhau như anh em ruột thịt. Đặc biệt, người Quan họ trong hai làng kết chạ tuyệt đối không kết hôn với nhau để giữ trọn tình tri kỷ tinh khiết.',
                    'Mối quan hệ kết chạ thiêng liêng này được duy trì qua hàng trăm năm thông qua các buổi thăm hỏi, chúc Tết và hát canh giao duyên.',
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
                'author' => 'NCS. Trần Đình Thắng',
                'author_role' => 'Nhà Văn hóa học',
                'date' => '08/02/2026',
                'read_time' => '6 phút đọc',
                'featured' => false,
                'tags' => ['Kết chạ', 'Làng Diềm', 'Văn hóa Kinh Bắc'],
                'views' => 1630,
                'status' => 'Đã đăng',
            ],
            [
                'category_name' => 'Khám phá',
                'title' => 'Không gian văn hóa Đền Cùng - Giếng Ngọc: Nơi phát tích câu ca lề lối',
                'slug' => 'khong-gian-van-hoa-den-cung-gieng-ngoc',
                'excerpt' => 'Hành trình điền dã về làng Diềm, ngôi làng cổ duy nhất thờ Thủy tổ Quan họ và dòng nước thiêng Giếng Ngọc.',
                'content' => [
                    'Đền Cùng - Giếng Ngọc thuộc làng Diềm (xã Hòa Long, thành phố Bắc Ninh) được xem là trái tim tâm linh của vùng di sản Dân ca Quan họ.',
                    'Dòng nước Giếng Ngọc trong mát ngọt lành quanh năm là nguồn cảm hứng cho bao câu ca Quan họ tha thiết. Người dân tin rằng uống nước Giếng Ngọc sẽ có giọng hát trong trẻo, ngọt ngào.',
                    'Hàng năm vào rằm tháng Giêng, du khách thập phương đổ về làng Diềm trẩy hội, dâng hương thờ Đức Vua Bà - Thủy tổ Dân ca Quan họ.',
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
                'author' => 'Vũ Quỳnh Anh',
                'author_role' => 'Phóng viên Du lịch Văn hóa',
                'date' => '05/02/2026',
                'read_time' => '5 phút đọc',
                'featured' => false,
                'tags' => ['Làng Diềm', 'Giếng Ngọc', 'Vua Bà'],
                'views' => 3100,
                'status' => 'Đã đăng',
            ],
            [
                'category_name' => 'Sự kiện',
                'title' => 'Tọa đàm quốc tế: Quảng bá di sản Dân ca Quan họ ra thế giới',
                'slug' => 'toa-dam-quoc-te-quang-ba-quan-ho-ra-the-gioi',
                'excerpt' => 'Các chuyên gia văn hóa UNESCO và các học giả âm nhạc quốc tế thảo luận về mô hình bảo tồn di sản Quan họ bền vững.',
                'content' => [
                    'Tọa đàm quốc tế với chủ đề "Bảo tồn và Phát huy Giá trị Di sản Dân ca Quan họ Bắc Ninh trong bối cảnh Hội nhập" vừa diễn ra thành công tại Trung tâm Văn hóa Tỉnh.',
                    'Tại tọa đàm, nhiều đại diện từ UNESCO đánh giá cao nỗ lực của chính quyền và nhân dân tỉnh Bắc Ninh trong việc gìn giữ di sản suốt 17 năm qua.',
                    'Các đại biểu cũng đề xuất nhiều giải pháp ứng dụng công nghệ thực tế ảo VR/AR và nền tảng số để đưa tiếng hát Quan họ đến với bạn bè quốc tế.',
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
                'author' => 'Hà Thu Thủy',
                'author_role' => 'Phóng viên Đối ngoại',
                'date' => '02/02/2026',
                'read_time' => '4 phút đọc',
                'featured' => false,
                'tags' => ['Tọa đàm', 'UNESCO', 'Quốc tế'],
                'views' => 1250,
                'status' => 'Đã đăng',
            ],
        ];

        foreach ($articles as $art) {
            $catName = $art['category_name'];
            $catId = isset($createdCategories[$catName]) ? $createdCategories[$catName]->id : null;
            $art['category_id'] = $catId;
            Article::firstOrCreate(['slug' => $art['slug']], $art);
        }

        // 4. Research Entries
        $researchEntries = [
            [
                'title' => 'Khảo sát thực địa các Canh hát Cổ truyền tại Làng Diềm (Thủy Đường)',
                'date' => '15/01/2024',
                'location' => 'Làng Diềm, xã Hòa Long, TP. Bắc Ninh',
                'phase' => 'Giai đoạn 1: Sưu tầm điệu cổ',
                'icon_type' => 'mic',
                'summary' => 'Ghi âm và ghi hình trực tiếp 5 canh hát đêm tại Nhà chứa Quan họ Làng Diềm với sự tham gia của 12 nghệ nhân lão thành.',
                'content' => 'Làng Diềm được xem là "thủ phủ" của Dân ca Quan họ Bắc Ninh, nơi duy nhất thờ Vua Bà - Thủy tổ ngành Quan họ. Nhóm nghiên cứu đã tiếp cận và thu âm các làn điệu hiếm như "Nguyệt gác mái đình", "Lời canh khuya".',
                'findings' => [
                    'Sưu tầm được 14 bản thu âm chất lượng cao các điệu hát giọng Giã bạn ít phổ biến.',
                    'Ghi chép chi tiết quy trình têm trầu và nghi thức trao chén trà mở canh hát.',
                ],
                'images' => [
                    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
                ],
                'audio_title' => 'Bản thu âm điền dã: Làn điệu cổ La Rằng',
                'researcher' => 'TS. Nguyễn Văn Bình',
            ],
        ];

        foreach ($researchEntries as $re) {
            ResearchEntry::firstOrCreate(['title' => $re['title']], $re);
        }

        // 5. Artisans
        $artisans = [
            [
                'name' => 'Nguyễn Thị Khướu',
                'honorific' => 'NNND.',
                'birth_year' => 1934,
                'village' => 'Làng Diềm (Hòa Long, Bắc Ninh)',
                'avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
                'bio' => 'Cụ Khướu là một trong những cây đại thụ của làng Quan họ Diềm xá. Cụ thuộc lòng hơn 200 làn điệu cổ và hát chuẩn xác lề lối "vang, rền, nền, nảy".',
                'quote' => 'Tiếng hát Quan họ là máu thịt, là cái nết ăn nết ở của người Kinh Bắc.',
                'specialties' => ['Hát giọng lề lối', 'Têm trầu cánh phượng', 'Truyền dạy nón quai thao'],
                'awards' => ['Nghệ nhân Nhân dân năm 2019', 'Bằng khen của Bộ VHTTDL'],
                'songs' => ['La rằng', 'Đường bạn', 'Con nhện giăng mùng'],
            ],
        ];

        foreach ($artisans as $artisan) {
            Artisan::firstOrCreate(['name' => $artisan['name']], $artisan);
        }

        // 6. Explore Topics
        $exploreTopics = [
            [
                'title' => '212 Làn điệu Quan họ cổ',
                'subtitle' => 'Hệ thống lề lối - giọng vặt - giã bạn',
                'description' => 'Khám phá cấu trúc âm nhạc Quan họ với 3 chặng ca lề lối, giọng vặt mềm mại và lời ca giã bạn da diết.',
                'image' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
                'badge' => 'Âm nhạc di sản',
                'details' => ['Phân loại 3 chặng ca chuẩn mực', 'Kỹ thuật hát Vang - Rền - Nền - Nẩy'],
                'highlights' => ['Giọng lề lối', 'Giọng vặt', 'Giọng giã bạn', 'Vang Rền Nền Nẩy'],
            ],
            [
                'title' => '49 Làng Quan họ Gốc',
                'subtitle' => 'Hành trình khám phá các không gian văn hóa di sản',
                'description' => 'Tìm hiểu 44 làng Quan họ ở Bắc Ninh và 5 làng ở Bắc Giang - nơi gìn giữ trọn vẹn phong tục kết nghĩa chạ và canh hát đêm.',
                'image' => 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
                'badge' => 'Không gian văn hóa',
                'details' => ['Làng Diềm: Nơi duy nhất thờ Vua Bà', '49 Làng Quan họ thuộc 2 tỉnh Bắc Ninh & Bắc Giang'],
                'highlights' => ['Tục kết chạ', 'Nhà chứa Quan họ', 'Văn hóa kết bạn giao duyên'],
            ],
            [
                'title' => 'Trang phục Quan họ truyền thống',
                'subtitle' => 'Nón ba tầm - Thắt lưng bao - Áo tứ thân',
                'description' => 'Tìm hiểu ý nghĩa biểu tượng của chiếc nón ba tầm quai thao, nón thúng và bộ trang phục rực rỡ Kinh Bắc.',
                'image' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
                'badge' => 'Trang phục di sản',
                'details' => ['Trang phục liền chị: Áo tứ thân, nón ba tầm', 'Trang phục liền anh: Áo tơi, khăn xếp, ô đen'],
                'highlights' => ['Nón ba tầm', 'Áo tứ thân', 'Khăn mỏ quạ', 'Xà tích bạc'],
            ],
            [
                'title' => 'Tục kết chạ & Đạo lý ứng xử',
                'subtitle' => 'Tình nghĩa tri kỷ anh em kết bạn',
                'description' => 'Định chế kết nghĩa anh em giữa các làng Quan họ cổ và phong tục ứng xử tao nhã, trọng nghĩa trọng tình.',
                'image' => 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
                'badge' => 'Phong tục Kinh Bắc',
                'details' => ['Mối quan hệ kết chạ Diềm - Khả Lĩnh', 'Nghi thức trao cơi trầu cánh phượng'],
                'highlights' => ['Làng Diềm', 'Khả Lĩnh', 'Mối tình tri kỷ', 'Trầu cau kết bạn'],
            ],
            [
                'title' => 'Kỹ thuật Vang - Rền - Nền - Nẩy',
                'subtitle' => 'Bộ tiêu chuẩn thanh nhạc Quan họ truyền thống',
                'description' => 'Giải mã 4 tiêu chuẩn thanh nhạc vàng rèn luyện luyến láy, nhả chữ và nảy hạt sương của liền anh liền chị.',
                'image' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
                'badge' => 'Thanh nhạc cổ',
                'details' => ['Chữ Vang ngân xa', 'Chữ Rền đằm thắm', 'Chữ Nền hòa quyện', 'Chữ Nẩy tinh tế'],
                'highlights' => ['Vang', 'Rền', 'Nền', 'Nẩy'],
            ],
            [
                'title' => 'Không gian Đền Cùng - Giếng Ngọc',
                'subtitle' => 'Thủ phủ tâm linh Làng Diềm',
                'description' => 'Khám phá ngôi làng cổ duy nhất thờ Đức Vua Bà - Thủy tổ Dân ca Quan họ và dòng nước thiêng Giếng Ngọc.',
                'image' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                'badge' => 'Địa danh lịch sử',
                'details' => ['Đền Cùng thờ Thủy tổ Vua Bà', 'Dòng nước Giếng Ngọc ngọt mát quanh năm'],
                'highlights' => ['Làng Diềm', 'Giếng Ngọc', 'Vua Bà'],
            ],
        ];

        foreach ($exploreTopics as $topic) {
            ExploreTopic::firstOrCreate(['title' => $topic['title']], $topic);
        }

        // 7. Site Config
        SiteConfig::firstOrCreate(
            ['id' => 1],
            [
                'site_name' => 'Mạch Quan Họ',
                'logo_type' => 'text',
                'logo_text' => 'Mạch Quan Họ',
                'logo_subtext' => 'Di sản Văn hóa Kinh Bắc',
                'banner' => [
                    'headline' => 'Mạch Quan Họ',
                    'subtitle' => 'Gìn giữ & Lan tỏa Thanh âm Di sản Văn hóa Kinh Bắc',
                    'introText' => 'Dự án lưu trữ, nghiên cứu và tôn vinh Dân ca Quan họ Bắc Ninh - Di sản văn hóa phi vật thể đại diện của nhân loại.',
                    'imageUrl' => 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
                    'buttonText' => 'Khám phá bài viết',
                    'buttonLink' => '/news',
                    'quote' => 'Người ơi người ở đừng về...',
                ],
                'contact_email' => 'lienhe@machquanho.vn',
                'contact_phone' => '0988 123 456',
                'address' => 'Thành phố Bắc Ninh, Tỉnh Bắc Ninh, Việt Nam',
                'social_links' => [
                    'facebook' => 'https://facebook.com',
                    'youtube' => 'https://youtube.com',
                    'tiktok' => 'https://tiktok.com',
                ],
                'footer' => [
                    'tagline' => 'Giữ mạch di sản – Khơi mạch tương lai',
                    'description' => 'Website của nhóm nghiên cứu đề tài "Chính sách khai thác và phát huy giá trị di sản dân ca Quan họ phục vụ phát triển công nghiệp văn hóa trên địa bàn tỉnh Bắc Ninh".',
                    'quickLinksTitle' => 'LIÊN KẾT NHANH',
                    'quickLinks' => [
                        ['id' => 'fl-1', 'label' => 'Trang chủ', 'url' => '/'],
                        ['id' => 'fl-2', 'label' => 'Tin tức & hoạt động', 'url' => '/news'],
                        ['id' => 'fl-3', 'label' => 'Nhật ký nghiên cứu', 'url' => '/research-diary'],
                        ['id' => 'fl-4', 'label' => 'Về chúng tôi', 'url' => '/about'],
                    ],
                    'socialLinksTitle' => 'KẾT NỐI VỚI CHÚNG TÔI',
                    'contactTitle' => 'THÔNG TIN LIÊN HỆ',
                    'address' => 'Bắc Ninh, Việt Nam',
                    'email' => 'machquanho@gmail.com',
                    'phone' => '0123 456 789',
                    'copyrightText' => '© 2026 Mạch Quan Họ. All rights reserved.',
                    'bottomLinks' => [
                        ['id' => 'bl-1', 'label' => 'Sitemap', 'url' => '/sitemap'],
                        ['id' => 'bl-2', 'label' => 'Chính sách bảo mật', 'url' => '/privacy'],
                        ['id' => 'bl-3', 'label' => 'Điều khoản sử dụng', 'url' => '/terms'],
                    ],
                ],
                'seo' => [
                    'homeMetaTitle' => 'MẠCH QUAN HỌ - Nơi Gìn Giữ & Phát Huy Thanh Âm Di Sản Kinh Bắc',
                    'homeMetaDescription' => 'Dự án nghiên cứu, lưu trữ và bảo tồn Dân ca Quan họ Bắc Ninh - Di sản văn hóa phi vật thể đại diện của nhân loại.',
                    'homeMetaKeywords' => 'quan họ bắc ninh, dân ca quan họ, làng quan họ, nghệ nhân quan họ, mạch quan họ, di sản kinh bắc',
                    'homeOgImage' => 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
                    'defaultMetaTitle' => 'MẠCH QUAN HỌ - Di Sản Văn Hóa Dân Ca Quan Họ Bắc Ninh',
                    'defaultMetaDescription' => 'Khám phá tri thức dân gian, nghệ nhân di sản và nhật ký nghiên cứu điền dã Quan họ Bắc Ninh.',
                    'defaultMetaKeywords' => 'quan họ, bắc ninh, di sản văn hóa, kinh bắc',
                    'googleSiteVerification' => '',
                    'headScript' => '<!-- Google Tag Manager / Analytics Code -->',
                    'bodyScript' => '<!-- Live Chat Widget Code -->',
                ],
            ]
        );
    }
}
