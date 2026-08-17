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

export interface HeaderNavItem {
  id: string;
  label: string;
  viewType: 'home' | 'news' | 'research-diary' | 'about';
  icon?: string; // Predefined icon key e.g. 'Home' | 'Newspaper' | 'BookOpen' | 'Users' | 'Sparkles' | 'Music' | 'Globe'
  customIconUrl?: string; // Custom uploaded image URL
}

export interface SiteHeaderConfig {
  topNoticeText: string;
  topSubText: string;
  topAudioCtaText: string;
  navItems: HeaderNavItem[];
}

export interface BannerButtonItem {
  id: string;
  text: string;
  icon?: string;
  link: string;
  bgColor?: string;
  textColor?: string;
}

export type TaglineFontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | 'small' | 'normal' | 'large';
export type HeadlineFontSize = '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | 'normal' | 'large' | 'huge';
export type SubtitleFontSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'normal' | 'large' | 'huge';
export type IntroFontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | 'small' | 'normal' | 'large';

export type BannerSlideEffect = 'fade' | 'slide-left' | 'slide-right' | 'zoom';
export type BannerTextAnimation = 'fadeIn' | 'slideUp' | 'slideDown' | 'zoomIn' | 'bounce';

export interface BannerSlideItem {
  id: string;
  imageUrl: string;
  tagline?: string;
  taglineFontSize?: TaglineFontSize;
  headline?: string;
  headlineFontSize?: HeadlineFontSize;
  subtitle?: string;
  subtitleFontSize?: SubtitleFontSize;
  introText?: string;
  introFontSize?: IntroFontSize;
  textAlign?: 'left' | 'center' | 'right';
  slideEffect?: BannerSlideEffect;
  textAnimation?: BannerTextAnimation;
  quote?: string;
  buttons?: BannerButtonItem[];
  // Backwards compatibility fallbacks
  showButton?: boolean;
  buttonText?: string;
  buttonIcon?: string;
  buttonLink?: string;
  showButton2?: boolean;
  button2Text?: string;
  button2Icon?: string;
  button2Link?: string;
}

export interface SiteBannerConfig {
  mode?: 'static' | 'slider';
  height?: 'small' | 'medium' | 'large' | 'full';
  autoPlay?: boolean;
  intervalSpeed?: number;
  slideEffect?: BannerSlideEffect;
  textAnimation?: BannerTextAnimation;
  tagline?: string;
  taglineFontSize?: TaglineFontSize;
  headline: string;
  headlineFontSize?: HeadlineFontSize;
  subtitle: string;
  subtitleFontSize?: SubtitleFontSize;
  introText: string;
  introFontSize?: IntroFontSize;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  quote: string;
  textAlign?: 'left' | 'center' | 'right';
  buttons?: BannerButtonItem[];
  slides?: BannerSlideItem[];
}

export interface FooterLinkItem {
  id: string;
  label: string;
  url: string;
}

export interface SocialPlatformItem {
  id: string;
  name: string;
  url: string;
  iconUrl?: string;
  iconType?: 'facebook' | 'youtube' | 'tiktok' | 'email' | 'custom';
}

export interface SiteFooterConfig {
  tagline: string;
  description: string;
  quickLinksTitle: string;
  quickLinks: FooterLinkItem[];
  socialLinksTitle: string;
  socialPlatforms?: SocialPlatformItem[];
  contactTitle: string;
  address: string;
  email: string;
  phone: string;
  copyrightText: string;
  bottomLinks: FooterLinkItem[];
}

export interface SiteSeoConfig {
  homeMetaTitle?: string;
  homeMetaDescription?: string;
  homeMetaKeywords?: string;
  homeOgImage?: string;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  defaultMetaKeywords?: string;
  googleSiteVerification?: string;
  headScript?: string;
  bodyScript?: string;
}

export interface SiteConfig {
  siteName: string;
  logoType: 'text' | 'image';
  logoText: string;
  logoSubtext: string;
  logoImageUrl?: string;
  header: SiteHeaderConfig;
  banner: SiteBannerConfig;
  footer?: SiteFooterConfig;
  seo?: SiteSeoConfig;
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
  | { type: 'admin'; section: 'dashboard' | 'articles' | 'users' | 'categories' | 'banner' | 'header' | 'menus' | 'research' | 'footer' | 'seo' | 'scripts' };
