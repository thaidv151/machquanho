import { Article, ResearchEntry, Artisan, ExploreTopic, AdminUser, CategoryInfo, SiteConfig } from '../types';

export const INITIAL_ARTICLES: Article[] = [];

export const INITIAL_RESEARCH_ENTRIES: ResearchEntry[] = [];
export const RESEARCH_ENTRIES: ResearchEntry[] = INITIAL_RESEARCH_ENTRIES;

export const ARTISANS: Artisan[] = [];
export const ARTISANS_DATA: Artisan[] = ARTISANS;

export const EXPLORE_TOPICS: ExploreTopic[] = [
  {
    id: 'exp-lan-dieu',
    title: '212 Làn điệu Quan họ cổ',
    subtitle: 'Hệ thống lề lối - giọng vặt - giã bạn',
    description: 'Khám phá cấu trúc âm nhạc Quan họ với 3 chặng ca lề lối, giọng vặt mềm mại và lời ca giã bạn da diết.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    badge: 'Âm nhạc di sản',
    details: ['Phân loại 3 chặng ca chuẩn mực', 'Kỹ thuật hát Vang - Rền - Nền - Nẩy'],
    highlights: ['Giọng lề lối', 'Giọng vặt', 'Giọng giã bạn', 'Vang Rền Nền Nẩy']
  },
  {
    id: 'exp-49-lang-goc',
    title: '49 Làng Quan họ Gốc',
    subtitle: 'Hành trình khám phá các không gian di sản',
    description: 'Tìm hiểu 44 làng Quan họ ở Bắc Ninh và 5 làng ở Bắc Giang - nơi gìn giữ trọn vẹn phong tục kết nghĩa chạ.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    badge: 'Không gian di sản',
    details: ['Làng Diềm: Nơi duy nhất thờ Vua Bà', '49 Làng Quan họ thuộc 2 tỉnh Bắc Ninh & Bắc Giang'],
    highlights: ['Tục kết chạ', 'Nhà chứa Quan họ', 'Văn hóa kết bạn']
  },
  {
    id: 'exp-trang-phuc',
    title: 'Trang phục Quan họ truyền thống',
    subtitle: 'Nón ba tầm - Thắt lưng bao - Áo tứ thân',
    description: 'Tìm hiểu ý nghĩa biểu tượng của chiếc nón ba tầm quai thao, nón thúng và bộ trang phục rực rỡ Kinh Bắc.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    badge: 'Trang phục di sản',
    details: ['Trang phục liền chị: Áo tứ thân, nón ba tầm', 'Trang phục liền anh: Áo tơi, khăn xếp, ô đen'],
    highlights: ['Nón ba tầm', 'Áo tứ thân', 'Khăn mỏ quạ', 'Xà tích bạc']
  },
  {
    id: 'exp-tuc-ket-cha',
    title: 'Tục kết chạ & Đạo lý ứng xử',
    subtitle: 'Tình nghĩa tri kỷ anh em kết bạn',
    description: 'Định chế kết nghĩa anh em giữa các làng Quan họ cổ và phong tục ứng xử tao nhã, trọng nghĩa trọng tình.',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    badge: 'Phong tục Kinh Bắc',
    details: ['Mối quan hệ kết chạ Diềm - Khả Lĩnh', 'Nghi thức trao cơi trầu cánh phượng'],
    highlights: ['Làng Diềm', 'Khả Lĩnh', 'Mối tình tri kỷ', 'Trầu cau kết bạn']
  },
  {
    id: 'exp-vang-ren-nen-nay',
    title: 'Kỹ thuật Vang - Rền - Nền - Nẩy',
    subtitle: 'Bộ tiêu chuẩn thanh nhạc Quan họ truyền thống',
    description: 'Giải mã 4 tiêu chuẩn thanh nhạc vàng rèn luyện luyến láy, nhả chữ và nảy hạt sương của liền anh liền chị.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    badge: 'Thanh nhạc cổ',
    details: ['Chữ Vang ngân xa', 'Chữ Rền đằm thắm', 'Chữ Nền hòa quyện', 'Chữ Nẩy tinh tế'],
    highlights: ['Vang', 'Rền', 'Nền', 'Nẩy']
  },
  {
    id: 'exp-den-cung-gieng-ngoc',
    title: 'Không gian Đền Cùng - Giếng Ngọc',
    subtitle: 'Thủ phủ tâm linh Làng Diềm',
    description: 'Khám phá ngôi làng cổ duy nhất thờ Đức Vua Bà - Thủy tổ Dân ca Quan họ và dòng nước thiêng Giếng Ngọc.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    badge: 'Địa danh lịch sử',
    details: ['Đền Cùng thờ Thủy tổ Vua Bà', 'Dòng nước Giếng Ngọc ngọt mát quanh năm'],
    highlights: ['Làng Diềm', 'Giếng Ngọc', 'Vua Bà']
  }
];

export const CATEGORIES_LIST: CategoryInfo[] = [];

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    name: 'Quản trị viên',
    email: 'admin@machquanho.vn',
    role: 'Quản trị viên',
    status: 'Hoạt động',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdDate: '01/01/2024',
    lastActive: 'Vừa xong',
    phone: '0912 345 678'
  }
];
export const INITIAL_ADMIN_USERS: AdminUser[] = MOCK_ADMIN_USERS;

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: 'MẠCH QUAN HỌ',
  logoType: 'text',
  logoText: 'MẠCH QUAN HỌ',
  logoSubtext: 'Kinh Bắc Di Sản',
  header: {
    topNoticeText: 'Di sản Văn hóa Phi vật thể đại diện của Nhân loại - UNESCO 2009',
    topSubText: 'Kinh Bắc - Vùng đất địa linh nhân kiệt',
    topAudioCtaText: 'Nghe Quan họ',
    navItems: [
      { id: 'nav-1', label: 'Trang chủ', viewType: 'home', icon: 'Home' },
      { id: 'nav-2', label: 'Tin tức & Hoạt động', viewType: 'news', icon: 'Newspaper' },
      { id: 'nav-3', label: 'Nhật ký nghiên cứu', viewType: 'research-diary', icon: 'BookOpen' },
      { id: 'nav-4', label: 'Về chúng tôi', viewType: 'about', icon: 'Users' }
    ]
  },
  banner: {
    mode: 'slider',
    height: 'medium',
    autoPlay: true,
    intervalSpeed: 5,
    textAlign: 'left',
    headline: '',
    subtitle: '',
    introText: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    quote: '',
    slides: []
  },
  contactEmail: 'lienhe@machquanho.vn',
  contactPhone: '(0222) 382 1234',
  address: 'Số 15 Lý Thái Tổ, Phường Suối Hoa, Thành phố Bắc Ninh',
  socialLinks: {
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    tiktok: 'https://tiktok.com'
  },
  footer: {
    tagline: 'Giữ mạch di sản – Khơi mạch tương lai',
    description: 'Website của nhóm nghiên cứu đề tài "Chính sách khai thác và phát huy giá trị di sản dân ca Quan họ phục vụ phát triển công nghiệp văn hóa trên địa bàn tỉnh Bắc Ninh".',
    quickLinksTitle: 'LIÊN KẾT NHANH',
    quickLinks: [
      { id: 'fl-1', label: 'Trang chủ', url: '/' },
      { id: 'fl-2', label: 'Tin tức & hoạt động', url: '/news' },
      { id: 'fl-3', label: 'Nhật ký nghiên cứu', url: '/research-diary' },
      { id: 'fl-4', label: 'Về chúng tôi', url: '/about' }
    ],
    socialLinksTitle: 'KẾT NỐI VỚI CHÚNG TÔI',
    socialPlatforms: [
      { id: 'sp-1', name: 'Facebook', url: 'https://facebook.com', iconType: 'facebook' },
      { id: 'sp-2', name: 'YouTube', url: 'https://youtube.com', iconType: 'youtube' },
      { id: 'sp-3', name: 'TikTok', url: 'https://tiktok.com', iconType: 'tiktok' },
      { id: 'sp-4', name: 'Email', url: 'mailto:machquanho@gmail.com', iconType: 'email' }
    ],
    contactTitle: 'THÔNG TIN LIÊN HỆ',
    address: 'Bắc Ninh, Việt Nam',
    email: 'machquanho@gmail.com',
    phone: '0123 456 789',
    copyrightText: '© 2026 Mạch Quan Họ. All rights reserved.',
    bottomLinks: [
      { id: 'bl-1', label: 'Sitemap', url: '/sitemap' },
      { id: 'bl-2', label: 'Chính sách bảo mật', url: '/privacy' },
      { id: 'bl-3', label: 'Điều khoản sử dụng', url: '/terms' }
    ]
  },
  seo: {
    homeMetaTitle: 'MẠCH QUAN HỌ - Nơi Gìn Giữ & Phát Huy Thanh Âm Di Sản Kinh Bắc',
    homeMetaDescription: 'Dự án nghiên cứu, lưu trữ và bảo tồn Dân ca Quan họ Bắc Ninh - Di sản văn hóa phi vật thể đại diện của nhân loại.',
    homeMetaKeywords: 'quan họ bắc ninh, dân ca quan họ, làng quan họ, nghệ nhân quan họ, mạch quan họ, di sản kinh bắc',
    homeOgImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    defaultMetaTitle: 'MẠCH QUAN HỌ - Di Sản Văn Hóa Dân Ca Quan Họ Bắc Ninh',
    defaultMetaDescription: 'Khám phá tri thức dân gian, nghệ nhân di sản và nhật ký nghiên cứu điền dã Quan họ Bắc Ninh.',
    defaultMetaKeywords: 'quan họ, bắc ninh, di sản văn hóa, kinh bắc',
    googleSiteVerification: '',
    headScript: '<!-- Google Tag Manager / Analytics Code -->',
    bodyScript: '<!-- Live Chat Widget Code -->'
  }
};
