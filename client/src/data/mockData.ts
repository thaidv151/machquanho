import { Article, ResearchEntry, Artisan, ExploreTopic, AdminUser, CategoryInfo, SiteConfig } from '../types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Khai mạc Hội Lim 2024: Lan tỏa thanh âm di sản ngàn năm văn hiến',
    slug: 'khai-mac-hoi-lim-2024',
    category: 'Sự kiện',
    excerpt: 'Hội Lim xuân Giáp Thìn 2024 thu hút hàng vạn du khách trẩy hội trên đồi Lim và các lán trại hát Quan họ, tôn vinh nét đẹp văn hóa xứ Kinh Bắc đậm đà bản sắc.',
    content: [
      'Sáng ngày 13 tháng Giêng năm Giáp Thìn, tại đồi Lim (thị trấn Lim, huyện Tiên Du, tỉnh Bắc Ninh), Lễ hội Lim truyền thống xuân 2024 chính thức khai mạc trong không khí rộn ràng, thắm đượm tình người đất Quan họ.',
      'Lễ hội Lim từ lâu đã trở thành biểu tượng tinh hoa văn hóa phi vật thể của nhân loại được UNESCO vinh danh. Năm nay, phần lễ diễn ra trang nghiêm với lễ dâng hương tại chùa Hồng Ân, lăng tướng Nguyễn Đình Diễn, cùng đoàn rước sắc phong uy nghiêm từ làng Lũng Giang về đồi Lim.',
      'Phần hội tưng bừng với không gian hát Quan họ truyền thống tại 6 lán trại và trên thuyền rồng hồ Vân Tương. Hàng trăm liền anh, liền chị trong trang phục áo tứ thân, khăn xếp, nón quai thao đã cất lên những điệu hát đối đáp thiết tha: "Khách đến chơi nhà", "Mười nhớ", "Ngồi tựa mạn thuyền", giao duyên đậm tình nồng ấm.',
      'Bên cạnh các canh hát thâu đêm suốt sáng tại các nhà chứa Quan họ, lễ hội còn tổ chức nhiều trò chơi dân gian đặc sắc như đu tiên, đấu vật truyền thống, bịt mắt bắt dê, tổ tôm điếm và trưng bày hiện vật khảo cổ học Kinh Bắc.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Các liền chị duyên dáng trong tà áo tứ thân, nón quai thao hát giao duyên trên thuyền rồng tại Hội Lim',
    author: 'Nguyễn Văn A',
    authorRole: 'Ban biên tập Mạch Quan Họ',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    date: '14/02/2024',
    readTime: '5 phút đọc',
    featured: true,
    tags: ['Hội Lim', 'Văn hóa Kinh Bắc', 'Bảo tồn di sản', 'Lễ hội truyền thống'],
    views: 3420,
    status: 'Đã đăng',
    audioTitle: 'Hát giao duyên: Khách Đến Chơi Nhà - Làn điệu cổ Hội Lim',
    audioDuration: '04:15',
    quote: {
      text: 'Quan họ không chỉ là câu hát giãi bày tâm sự, mà là cả một lề lối sống nhân nghĩa, tao nhã và trọng nghĩa tình của con người vùng quê Kinh Bắc.',
      author: 'Nghệ nhân Nhân dân Nguyễn Thị Khướu'
    },
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
        caption: 'Không gian hát đối đáp truyền thống bên mái đình làng cổ kính'
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        caption: 'Liền anh liền chị trao cơi trầu têm cánh phượng thắm tình'
      }
    ]
  },
  {
    id: 'art-2',
    title: 'Bảo tồn lề lối hát canh cổ truyền: Nỗi trăn trở của những nghệ nhân tiền bối',
    slug: 'bao-ton-le-loi-hat-canh-co-truyen',
    category: 'Góc nhìn',
    excerpt: 'Hát canh Quan họ đòi hỏi sự nghiêm cẩn trong lề lối, từ giọng hát "vang, rền, nền, nảy" đến cách giao tiếp ứng xử tao nhã của người nghệ sĩ Kinh Bắc xưa.',
    content: [
      'Trong dòng chảy đương đại, khi Quan họ sân khấu hóa và Quan họ lời mới trở nên phổ biến, việc giữ gìn những canh hát truyền thống thâu đêm đang đứng trước nhiều thách thức.',
      'Một canh hát Quan họ đúng lề lối xưa phải trải qua đủ các chặng: Hát Giọng lề lối (như La rằng, Đường bạn, Kim lan), Hát Giọng vặt (các bài trữ tình phong phú) và Hát Giọng giã bạn (như Con nhện giăng mùng, Chia rẽ đôi nơi, Người ơi người ở đừng về).',
      'Đặc biệt, kỹ thuật hát đòi hỏi 4 tiêu chuẩn vàng: Vang (âm thanh ngân vang), Rền (âm thanh đằm thắm rung động), Nền (hòa quyện giọng bè đi đôi), Nảy (nhả chữ tinh tế bằng hạt âm thanh truyền cảm).'
    ],
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Canh hát Quan họ cổ truyền trong không gian nhà chứa ấm cúng',
    author: 'Trần Minh Khang',
    authorRole: 'Nhà nghiên cứu văn hóa dân gian',
    date: '10/02/2024',
    readTime: '6 phút đọc',
    featured: false,
    tags: ['Hát canh', 'Nghệ thuật Quan họ', 'Vang rền nền nảy', 'Di sản sống'],
    views: 2150,
    status: 'Đã đăng',
    audioTitle: 'Làn điệu lề lối: La Rằng - Trình bày bởi các Nghệ nhân Làng Diềm',
    audioDuration: '05:30'
  },
  {
    id: 'art-3',
    title: 'Dự án "Đưa Quan họ vào trường học" ghi nhận hơn 10.000 học sinh tham gia',
    slug: 'du-an-dua-quan-ho-vao-truong-hoc',
    category: 'Hoạt động',
    excerpt: 'Sở Giáo dục và Đào tạo tỉnh Bắc Ninh phối hợp cùng các CLB nghệ nhân tổ chức các buổi truyền dạy hát dân ca Quan họ miễn phí cho thế hệ trẻ.',
    content: [
      'Chương trình truyền dạy Dân ca Quan họ trong các trường tiểu học, trung học cơ sở và THPT trên địa bàn tỉnh Bắc Ninh đã tạo nên làn sóng hưởng ứng nhiệt liệt từ học sinh và phụ huynh.',
      'Tại các buổi học ngoại khóa, các em không chỉ được tập luyện phát âm, nhả chữ, hát các điệu cơ bản như "Cây trúc xinh", "Lý cây đa", mà còn được học về văn hóa ứng xử, cách têm trầu cánh phượng và lịch sử các làng Quan họ cổ.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Học sinh Bắc Ninh hào hứng trong tiết học trải nghiệm hát Quan họ',
    author: 'Lê Thu Hương',
    authorRole: 'Phóng viên Văn hóa Giáo dục',
    date: '05/02/2024',
    readTime: '4 phút đọc',
    featured: false,
    tags: ['Giáo dục di sản', 'Thế hệ trẻ', 'Bắc Ninh', 'Truyền dạy'],
    views: 1890,
    status: 'Đã đăng'
  },
  {
    id: 'art-4',
    title: 'Nghị quyết mới về chế độ đãi ngộ và vinh danh Nghệ nhân Dân ca Quan họ',
    slug: 'nghi-quyet-dai-ngo-nghe-nhan-quan-ho',
    category: 'Chính sách',
    excerpt: 'HĐND tỉnh Bắc Ninh ban hành chính sách hỗ trợ kinh phí hàng tháng, bảo hiểm y tế và hỗ trợ hoạt động cho 49 làng Quan họ gốc và các CLB bảo tồn.',
    content: [
      'Bắc Ninh tiếp tục là tỉnh đi đầu cả nước trong việc ban hành cơ chế chính sách đặc thù nhằm tôn vinh, đãi ngộ các nghệ nhân Dân ca Quan họ - những báu vật nhân văn sống của quê hương.',
      'Mỗi Nghệ nhân Nhân dân, Nghệ nhân Ưu tú sẽ được hưởng trợ cấp sinh hoạt hàng tháng, cấp thẻ BHYT miễn phí, thăm khám sức khỏe định kỳ và hỗ trợ không gian truyền dạy tại gia đình.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Lễ vinh danh và trao bằng công nhận Nghệ nhân Dân ca Quan họ',
    author: 'Hoàng Quốc Việt',
    authorRole: 'Cổng Thông tin tỉnh Bắc Ninh',
    date: '28/01/2024',
    readTime: '3 phút đọc',
    featured: false,
    tags: ['Chính sách văn hóa', 'Nghệ nhân', 'Đãi ngộ di sản', 'Bắc Ninh'],
    views: 1420,
    status: 'Đã đăng'
  },
  {
    id: 'art-5',
    title: 'Nghệ nhân Nhân dân Nguyễn Thị Khướu: Một đời đắm say câu ca Quan họ',
    slug: 'nghe-nhan-nhan-dan-nguyen-thi-khuou-mot-doi-dam-say',
    category: 'Nghệ nhân',
    excerpt: 'Gần một thế kỷ gắn bó với làn điệu dân ca quê nhà, cụ Khướu vẫn gìn giữ vẹn nguyên chất giọng trong trẻo và hàng trăm bài ca cổ ít người còn nhớ.',
    content: [
      'Ở tuổi ngoài 90, tại làng Quan họ gốc Diềm Xá (xã Hòa Long, TP Bắc Ninh), Nghệ nhân Nhân dân Nguyễn Thị Khướu vẫn say sưa chỉ bảo từng nốt luyến láy, từng cử chỉ buông tà áo cho các cháu nhỏ trong xóm.',
      'Cụ chia sẻ: "Hát Quan họ phải xuất phát từ cái tâm chân thật, cái tình bạn bè kết chạ trong sáng. Người hát không mưu cầu danh lợi mà hát để trải lòng, để gửi gắm nét thanh tao của đất trời".'
    ],
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Nghệ nhân Nhân dân Nguyễn Thị Khướu trong trang phục Quan họ truyền thống',
    author: 'Ban biên tập Mạch Quan Họ',
    authorRole: 'Phỏng vấn chuyên sâu',
    date: '18/01/2024',
    readTime: '7 phút đọc',
    featured: false,
    tags: ['Nghệ nhân Nhân dân', 'Làng Diềm', 'Chân dung', 'Kinh Bắc'],
    views: 2980,
    status: 'Đã đăng',
    audioTitle: 'Điệu hát cổ: Ngồi Tựa Cột Buồm - NNND Nguyễn Thị Khướu',
    audioDuration: '04:48'
  },
  {
    id: 'art-6',
    title: 'Giải mã vẻ đẹp trang phục Quan họ: Nón quai thao và áo năm thân the thâm',
    slug: 'giai-ma-ve-dep-trang-phuc-quan-ho',
    category: 'Khám phá',
    excerpt: 'Tìm hiểu ý nghĩa biểu tượng sâu sắc đằng sau chiếc nón thúng quai thao duyên dáng và tà áo the nhiều lớp tượng trưng cho vẻ đẹp kín đáo, e ấp của người phụ nữ.',
    content: [
      'Trang phục Quan họ không đơn thuần là trang phục biểu diễn mà là cả một hệ giá trị thẩm mỹ truyền thống của cư dân đồng bằng Bắc Bộ.',
      'Bộ trang phục nữ gồm áo cánh trắng bên trong, yếm lụa điều rực rỡ, khoác ngoài là 3-5 lớp áo the mỏng nhiều màu (màu the đen ngoài cùng tạo hiệu ứng lấp lánh ẩn hiện gọi là áo mớ ba mớ bảy). Chiếc nón quai thao với đường kính lớn, viền lá cọ bóng mượt cùng đôi quai thao lụa tơ tằm buông dài càng làm tăng vẻ đoan trang, đài các.'
    ],
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Chi tiết chiếc nón quai thao và dải yếm điều truyền thống',
    author: 'ThS. Đỗ Phương Thảo',
    authorRole: 'Viện Mỹ thuật Dân gian',
    date: '12/01/2024',
    readTime: '5 phút đọc',
    featured: false,
    tags: ['Trang phục truyền thống', 'Nón quai thao', 'Áo tứ thân', 'Văn hóa thẩm mỹ'],
    views: 2340,
    status: 'Đã đăng'
  }
];

export const INITIAL_RESEARCH_ENTRIES: ResearchEntry[] = [
  {
    id: 'res-1',
    title: 'Khảo sát tục kết chạ giữa Làng Diềm và Làng Bịu (Bắc Giang)',
    date: 'Tháng 02/2024',
    location: 'Làng Diềm (Viêm Xá), Bắc Ninh & Làng Bịu (Hiệp Hòa), Bắc Giang',
    phase: 'Giai đoạn 3',
    iconType: 'map',
    summary: 'Thu thập tư liệu điền dã về quan hệ kết bạn anh em kết chạ truyền thống giữa các bọn Quan họ nam nữ hai bên bờ sông Cầu.',
    content: 'Chuyến điền dã kéo dài 5 ngày ghi nhận nghi thức đón tiếp bạn kết nghĩa tại đền Vua Bà, các quy ước nghiêm ngặt về việc không lấy nhau giữa các làng kết chạ, và hệ thống 24 bài hát đối đáp đặc trưng chỉ được hát trong dịp thăm hỏi.',
    findings: [
      'Ghi âm thành công 8 làn điệu đối đáp cổ không có trong các ấn bản phổ thông',
      'Phỏng vấn sâu 4 cụ cao niên trên 85 tuổi về lề lối ăn ở, đãi bạn cơi trầu chén rượu',
      'Ký họa sơ đồ không gian sinh hoạt nhà chứa Quan họ tại thôn Viêm Xá'
    ],
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80'
    ],
    audioTitle: 'Thu âm điền dã: Hát đối giọng Lề lối - Đền Cùng Giếng Ngọc',
    researcher: 'Nhóm nghiên cứu Mạch Di Sản (TS. Hoàng An & cộng sự)'
  },
  {
    id: 'res-2',
    title: 'Số hóa kho tư liệu băng cối ghi âm Quan họ cổ thập niên 1970',
    date: 'Tháng 12/2023',
    location: 'Trung tâm Lưu trữ Văn hóa Kinh Bắc, TP Bắc Ninh',
    phase: 'Giai đoạn 2',
    iconType: 'archive',
    summary: 'Phục chế và chuyển đổi số chất lượng cao 35 cuộn băng cối ghi lại giọng hát của các nghệ nhân bậc thầy thế hệ đầu tiên sau ngày hòa bình.',
    content: 'Quá trình lọc tạp âm và khử nhiễu giúp phục dựng lại những thanh âm nguyên bản chưa từng công bố, bao gồm các biến thể làn điệu "La rằng", "Tình tang", "Gió mát trăng thanh".',
    findings: [
      'Số hóa 120 giờ thu âm nguyên bản chất lượng 24-bit/96kHz',
      'Biên soạn danh mục 320 làn điệu có định danh nguồn gốc nghệ nhân',
      'Phát hiện 3 biến thể âm giai ngũ cung cổ chưa từng được ký âm văn bản'
    ],
    images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
    ],
    audioTitle: 'Phục chế tư liệu 1974: Làn điệu Nhớ Mãi Khôn Nguôi',
    researcher: 'ThS. Nguyễn Đức Toàn (Kỹ thuật âm thanh di sản)'
  },
  {
    id: 'res-3',
    title: 'Nghiên cứu cấu trúc ngữ âm & kỹ thuật nảy hạt trong phát âm Quan họ',
    date: 'Tháng 10/2023',
    location: 'Viện Nghiên cứu Âm nhạc Dân tộc',
    phase: 'Giai đoạn 1',
    iconType: 'mic',
    summary: 'Phân tích âm học thực nghiệm kỹ thuật lấy hơi từ bụng và cách bật âm vòm họng tạo độ nảy đặc trưng của người Kinh Bắc.',
    content: 'Sử dụng phần mềm phân tích phổ âm (spectrogram) để định lượng độ rung (vibrato) và độ vang vòm họng của các nghệ nhân truyền thống so sánh với ca sĩ tân nhạc hiện đại.',
    findings: [
      'Kỹ thuật "Nảy" tạo ra các đỉnh xung tần số 2.5kHz - 3.2kHz giúp giọng hát vút xa ngoài trời không cần micro',
      'Đặc trưng rung giọng tự nhiên mềm mại, không giật như kỹ thuật phương Tây',
      'Bộ tài liệu hướng dẫn kỹ thuật luyện thanh Quan họ chuẩn hóa'
    ],
    images: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
    ],
    audioTitle: 'Mẫu phân tích thanh âm: Kỹ thuật nhả chữ Nảy Hạt',
    researcher: 'TS. Vũ Hải Nam & Nhóm Âm học Dân gian'
  }
];

export const ARTISANS_DATA: Artisan[] = [
  {
    id: 'artisan-1',
    name: 'Nguyễn Thị Khướu',
    honorific: 'NNND.',
    birthYear: 1932,
    village: 'Làng Diềm (Viêm Xá, TP Bắc Ninh)',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    bio: 'Cây đại thụ của làng Quan họ Thủy Tổ Làng Diềm. Cụ thuộc lòng hơn 200 làn điệu cổ và là người nắm giữ trọn vẹn lề lối hát canh, tục kết chạ truyền đời xứ Bắc.',
    quote: 'Mỗi lời ca Quan họ là một hạt ngọc của lòng nhân, của cái tình sâu nặng người Kinh Bắc trao nhau.',
    specialties: ['Hát giọng lề lối cổ', 'Hát đối đáp giã bạn', 'Tục kết chạ cổ', 'Têm trầu cánh phượng'],
    awards: ['Nghệ nhân Nhân dân (2019)', 'Huân chương Lao động hạng Ba', 'Bằng khen của Bộ VHTTDL'],
    songs: ['La rằng cổ', 'Ngồi tựa cột buồm', 'Chia rẽ đôi nơi', 'Lý con sáo']
  },
  {
    id: 'artisan-2',
    name: 'Trần Văn Tôn',
    honorific: 'NNƯT.',
    birthYear: 1948,
    village: 'Làng Bồ Sơn (Võ Cường, TP Bắc Ninh)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Liền anh tiêu biểu với chất giọng vang trầm ấm áp. Nghệ nhân Trần Văn Tôn đã dành hơn 50 năm sưu tầm, ký âm và đào tạo hơn 40 thế hệ học trò kế cận.',
    quote: 'Học Quan họ trước hết phải học đạo làm người, nói năng khiêm nhường, xưng hô anh hai chị hai đầy kính trọng.',
    specialties: ['Giọng lề lối trầm', 'Đàn nguyệt & Trống cơm', 'Soạn lời đối Quan họ', 'Nghi lễ thờ Vua Bà'],
    awards: ['Nghệ nhân Ưu tú (2015)', 'Giải thưởng Văn học Nghệ thuật sông Cầu'],
    songs: ['Đường bạn cổ', 'Kim lan tương ngộ', 'Khách đến chơi nhà', 'Bèo dạt mây trôi']
  },
  {
    id: 'artisan-3',
    name: 'Nguyễn Thị Hoa',
    honorific: 'Nghệ nhân',
    birthYear: 1965,
    village: 'Làng Thổ Hà (Việt Yên, Bắc Giang)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'Liền chị tài hoa của vùng gốm Thổ Hà bên dòng sông Cầu. Chị là chủ nhiệm CLB Dân ca Quan họ Thổ Hà với nhiều hoạt động giao lưu quốc tế quảng bá văn hóa Việt.',
    quote: 'Tiếng hát Quan họ cất lên bên mái đình rêu phong khiến người xa quê lúc nào cũng đau đáu nhớ nguồn cội.',
    specialties: ['Hát giao duyên trên sông', 'Truyền dạy thiếu nhi', 'Dệt lụa quai thao'],
    awards: ['Nghệ nhân tỉnh Bắc Giang', 'Huy chương Vì sự nghiệp Văn hóa'],
    songs: ['Cây trúc xinh', 'Lý cây đa', 'Hoa thơm bướm lượn', 'Người ơi người ở đừng về']
  }
];

export const EXPLORE_TOPICS: ExploreTopic[] = [
  {
    id: 'exp-lich-su',
    title: 'Lịch sử & Nguồn gốc',
    subtitle: 'Hành trình ngàn năm kết tinh văn hiến',
    description: 'Tìm hiểu cội nguồn hình thành Dân ca Quan họ từ thời Lý - Trần gắn liền với tín ngưỡng thờ Đức Thủy Tổ Quan họ tại đền Vua Bà Làng Diềm.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    badge: 'Khởi nguồn',
    details: [
      'Gắn liền với truyền thuyết về nàng Nhữ Nương (Đức Vua Bà)',
      'Hình thành tại vùng văn hóa Kinh Bắc trù phú châu thổ sông Hồng',
      'Được UNESCO công nhận là Di sản Văn hóa Phi vật thể đại diện của nhân loại năm 2009'
    ],
    highlights: ['Đền Vua Bà Thủy Tổ', 'Sông Cầu lịch sử', 'Vùng đất 49 làng cổ']
  },
  {
    id: 'exp-khong-gian',
    title: 'Không gian Quan họ',
    subtitle: 'Nhà chứa, mái đình, bến nước cây đa',
    description: 'Khám phá các không gian diễn xướng độc đáo từ nhà chứa Quan họ ấm cúng, thuyền rồng trên hồ đến sân đình trong ngày hội làng.',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
    badge: 'Diễn xướng',
    details: [
      'Nhà chứa: Không gian thiêng liêng để các bọn Quan họ tụ họp luyện giọng và thết bạn',
      'Hát trên thuyền: Nét thơ mộng trữ tình trong các ngày hội xuân',
      'Hát cửa đình: Lễ nghi trang trọng hướng về tổ tiên, thành hoàng làng'
    ],
    highlights: ['Nhà chứa truyền thống', 'Thuyền rồng hồ hội', 'Sân đình Kinh Bắc']
  },
  {
    id: 'exp-lang-quan-ho',
    title: 'Làng Quan họ cổ',
    subtitle: '49 làng gốc lưu giữ hồn cốt xứ Kinh Bắc',
    description: 'Hành trình ghé thăm các làng Quan họ cổ trứ danh: Làng Diềm, Làng Lim, Làng Bồ Sơn, Làng Châm, Làng Khả Lễ, Làng Thị Cầu...',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    badge: 'Địa danh',
    details: [
      'Bắc Ninh sở hữu 44 làng Quan họ cổ truyền và Bắc Giang có 5 làng cổ',
      'Mỗi làng có quy ước lề lối hát và các câu ca đặc trưng',
      'Bảo tồn hệ thống cây đa, giếng nước ngọc, cổng làng rêu phong ngàn năm'
    ],
    highlights: ['Thôn Viêm Xá (Làng Diềm)', 'Thị trấn Lim', 'Làng Đặng Xá']
  },
  {
    id: 'exp-nghe-nhan',
    title: 'Nghệ nhân giữ lửa',
    subtitle: 'Những báu vật nhân văn sống',
    description: 'Chân dung các bậc tiền bối trọn đời cống hiến, gìn giữ vốn ca cổ và miệt mài truyền dạy ngọn lửa di sản cho thế hệ mai sau.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    badge: 'Con người',
    details: [
      'Hơn 100 Nghệ nhân Nhân dân và Nghệ nhân Ưu tú đã được phong tặng',
      'Ký ức sống về hàng trăm canh hát cổ không văn bản',
      'Những người thầy mẫu mực về văn hóa ứng xử nhân nghĩa'
    ],
    highlights: ['Nghệ nhân Nhân dân', 'Nghệ nhân Ưu tú', 'Lớp truyền dạy trẻ']
  },
  {
    id: 'exp-lien-anh-chi',
    title: 'Liền anh – Liền chị',
    subtitle: 'Phẩm hạnh, cốt cách và ân tình',
    description: 'Tìm hiểu phong thái lịch thiệp, xưng hô nhã nhặn "anh Hai, chị Hai, anh Ba, chị Ba", cùng nét đẹp tâm hồn của người Quan họ.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    badge: 'Cốt cách',
    details: [
      'Trang phục trang nhã: Nón quai thao, áo tứ thân mớ ba mớ bảy, khăn xếp áo the',
      'Cách têm trầu cánh phượng khéo léo thể hiện lòng hiếu khách',
      'Nguyên tắc kết bạn thủy chung, trọng nghĩa khinh tài'
    ],
    highlights: ['Áo the khăn xếp', 'Nón quai thao', 'Trầu têm cánh phượng']
  },
  {
    id: 'exp-lan-dieu',
    title: 'Làn điệu Quan họ',
    subtitle: 'Hơn 200 làn điệu phong phú diệu kỳ',
    description: 'Hệ thống âm nhạc đồ sộ với 3 chặng hát chính: Giọng lề lối, Giọng vặt phong phú và Giọng giã bạn bịn rịn nghĩa tình.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    badge: 'Âm nhạc',
    details: [
      'Hát Giọng lề lối: Các bài hát mở đầu đòi hỏi kỹ thuật cao nhất (La rằng, Tình tang)',
      'Hát Giọng vặt: Trữ tình, mượt mà, phản ánh đời sống thường nhật (Cây trúc xinh, Lý cây đa)',
      'Hát Giọng giã bạn: Bịn rịn lúc chia tay (Người ơi người ở đừng về, Con nhện giăng mùng)'
    ],
    highlights: ['Giọng lề lối', 'Giọng vặt', 'Giọng giã bạn']
  }
];

export const CATEGORIES_LIST: CategoryInfo[] = [
  { id: 'cat-1', name: 'Sự kiện', slug: 'su-kien', count: 12, color: '#B83E3E', description: 'Các lễ hội, chương trình giao lưu, sự kiện văn hóa nghệ thuật Quan họ' },
  { id: 'cat-2', name: 'Chính sách', slug: 'chinh-sach', count: 8, color: '#2563EB', description: 'Nghị quyết, cơ chế bảo tồn và hỗ trợ nghệ nhân từ các cấp quản lý' },
  { id: 'cat-3', name: 'Góc nhìn', slug: 'goc-nhin', count: 15, color: '#D97706', description: 'Bài viết chuyên sâu, góc nhìn nghiên cứu từ các chuyên gia văn hóa' },
  { id: 'cat-4', name: 'Hoạt động', slug: 'hoat-dong', count: 24, color: '#059669', description: 'Các phong trào truyền dạy, liên hoan dân ca, sinh hoạt câu lạc bộ' },
  { id: 'cat-5', name: 'Nghệ nhân', slug: 'nghe-nhan', count: 19, color: '#7C3AED', description: 'Chân dung, câu chuyện cuộc đời và đóng góp của các bậc tiền bối' },
  { id: 'cat-6', name: 'Khám phá', slug: 'kham-pha', count: 16, color: '#DB2777', description: 'Kiến thức trang phục, phong tục, địa danh các làng Quan họ cổ' },
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Nguyễn Thanh Tùng',
    email: 'admin.tung@machquanho.vn',
    role: 'Quản trị viên',
    status: 'Hoạt động',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    createdDate: '15/01/2023',
    lastActive: 'Vừa xong',
    phone: '0912 345 678'
  },
  {
    id: 'usr-2',
    name: 'Trần Thị Mai Phương',
    email: 'phuong.ttm@machquanho.vn',
    role: 'Biên tập viên',
    status: 'Hoạt động',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdDate: '20/02/2023',
    lastActive: '2 giờ trước',
    phone: '0988 765 432'
  },
  {
    id: 'usr-3',
    name: 'Lê Hoàng Long',
    email: 'long.lh@machquanho.vn',
    role: 'Biên tập viên',
    status: 'Hoạt động',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    createdDate: '10/06/2023',
    lastActive: 'Hôm qua',
    phone: '0903 112 233'
  },
  {
    id: 'usr-4',
    name: 'Vũ Thị Minh Anh',
    email: 'minhanh.ctv@machquanho.vn',
    role: 'Cộng tác viên',
    status: 'Khóa',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    createdDate: '01/11/2023',
    lastActive: '2 tuần trước',
    phone: '0977 889 900'
  }
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: 'MẠCH QUAN HỌ',
  logoType: 'text',
  logoText: 'MẠCH QUAN HỌ',
  logoSubtext: 'Kinh Bắc Di Sản',
  banner: {
    headline: 'MẠCH QUAN HỌ',
    subtitle: 'Giữ mạch di sản – Khơi mạch tương lai',
    introText: 'Cổng thông tin chuyên biệt, số hóa tư liệu điền dã và tôn vinh nét đẹp Dân ca Quan họ Bắc Ninh - Di sản Văn hóa Phi vật thể đại diện của Nhân loại.',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'Khám phá ngay',
    buttonLink: 'news',
    quote: '"Người ơi người ở đừng về - Câu hát ngàn xưa thắm đượm tình người đất Bắc"'
  },
  contactEmail: 'lienhe@machquanho.vn',
  contactPhone: '(0222) 382 1234',
  address: 'Số 15 Lý Thái Tổ, Phường Suối Hoa, Thành phố Bắc Ninh',
  socialLinks: {
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    tiktok: 'https://tiktok.com'
  }
};
