export type ArticleCategory = 
  | 'Sự kiện'
  | 'Chính sách'
  | 'Góc nhìn'
  | 'Hoạt động'
  | 'Nghệ nhân'
  | 'Khám phá';

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: ArticleCategory;
  excerpt: string;
  content: string[];
  coverImage: string;
  imageCaption?: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  date: string;
  readTime: string;
  featured?: boolean;
  tags: string[];
  views: number;
  status: 'Đã đăng' | 'Nháp';
  audioTitle?: string;
  audioDuration?: string;
  quote?: {
    text: string;
    author: string;
  };
  galleryImages?: {
    url: string;
    caption: string;
  }[];
}

export interface ResearchEntry {
  id: string;
  title: string;
  date: string;
  location: string;
  phase: string;
  iconType: 'book' | 'mic' | 'map' | 'users' | 'camera' | 'archive';
  summary: string;
  content: string;
  findings: string[];
  images: string[];
  audioTitle?: string;
  researcher: string;
}

export interface Artisan {
  id: string;
  name: string;
  honorific: string; // e.g. 'NNND.' | 'NNƯT.' | 'Nghệ nhân'
  birthYear: number | string;
  village: string;
  avatar: string;
  bio: string;
  quote: string;
  specialties: string[];
  awards: string[];
  songs: string[];
}

export interface ExploreTopic {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  details: string[];
  highlights: string[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Quản trị viên' | 'Biên tập viên' | 'Cộng tác viên';
  status: 'Hoạt động' | 'Khóa';
  avatar: string;
  createdDate: string;
  lastActive: string;
  phone?: string;
}

export interface CategoryInfo {
  id: string;
  name: ArticleCategory;
  slug: string;
  count: number;
  color: string;
  description: string;
}

export interface SiteBannerConfig {
  headline: string;
  subtitle: string;
  introText: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  quote: string;
}

export interface SiteConfig {
  siteName: string;
  logoType: 'text' | 'image';
  logoText: string;
  logoSubtext: string;
  logoImageUrl?: string;
  banner: SiteBannerConfig;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook: string;
    youtube: string;
    tiktok: string;
  };
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'news'; category?: string; searchQuery?: string }
  | { type: 'article-detail'; articleId: string }
  | { type: 'research-diary'; selectedId?: string }
  | { type: 'about' }
  | { type: 'explore-detail'; topicId: string }
  | { type: 'admin'; section: 'dashboard' | 'articles' | 'users' | 'categories' | 'banner' };
