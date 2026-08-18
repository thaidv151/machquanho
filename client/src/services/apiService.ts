import apiClient from './apiClient';
import { Article, CategoryInfo, ResearchEntry, Artisan, ExploreTopic, SiteConfig, AdminUser } from '../types';
import { DEFAULT_SITE_CONFIG } from '../data/mockData';

// Helper normalizers to bridge Laravel snake_case DB fields with Frontend TS interfaces

function normalizeArticle(item: any): Article {
  if (!item) return item;
  return {
    ...item,
    id: String(item.id),
    category: item.category || item.category_name || 'Sự kiện',
    coverImage: item.coverImage || item.cover_image || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    imageCaption: item.imageCaption || item.image_caption,
    authorRole: item.authorRole || item.author_role || 'Ban biên tập',
    authorAvatar: item.authorAvatar || item.author_avatar,
    readTime: item.readTime || item.read_time || '4 phút đọc',
    audioTitle: item.audioTitle || item.audio_title,
    audioDuration: item.audioDuration || item.audio_duration,
    galleryImages: item.galleryImages || item.gallery_images || [],
    tags: Array.isArray(item.tags) ? item.tags : (item.tags ? (typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags) : []),
    content: Array.isArray(item.content) ? item.content : [item.content || ''],
  };
}

function safeParseJson(data: any) {
  if (!data) return null;
  if (typeof data === 'object') return data;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

function normalizeSiteConfig(config: any): SiteConfig {
  if (!config) return config;
  
  const rawBanner = safeParseJson(config.banner);
  const rawHeader = safeParseJson(config.header) || safeParseJson(config.headerConfig) || safeParseJson(config.header_config) || safeParseJson(rawBanner?.header_config);
  const rawSocial = safeParseJson(config.socialLinks) || safeParseJson(config.social_links);

  return {
    siteName: config.siteName || config.site_name || 'MẠCH QUAN HỌ',
    logoType: config.logoType || config.logo_type || 'text',
    logoText: config.logoText || config.logo_text || 'MẠCH QUAN HỌ',
    logoSubtext: config.logoSubtext || config.logo_subtext || 'Kinh Bắc Di Sản',
    logoImageUrl: config.logoImageUrl || config.logo_image_url,
    header: {
      topNoticeText: rawHeader?.topNoticeText || 'Di sản Văn hóa Phi vật thể đại diện của Nhân loại - UNESCO 2009',
      topSubText: rawHeader?.topSubText || 'Kinh Bắc - Vùng đất địa linh nhân kiệt',
      topAudioCtaText: rawHeader?.topAudioCtaText || 'Nghe Quan họ',
      navItems: Array.isArray(rawHeader?.navItems) && rawHeader.navItems.length > 0
        ? rawHeader.navItems
        : [
            { id: 'nav-1', label: 'Trang chủ', viewType: 'home', icon: 'Home' },
            { id: 'nav-2', label: 'Tin tức & Hoạt động', viewType: 'news', icon: 'Newspaper' },
            { id: 'nav-3', label: 'Nhật ký nghiên cứu', viewType: 'research-diary', icon: 'BookOpen' },
            { id: 'nav-4', label: 'Về chúng tôi', viewType: 'about', icon: 'Users' }
          ]
    },
    banner: {
      mode: rawBanner?.mode || 'slider',
      height: rawBanner?.height || 'medium',
      autoPlay: rawBanner?.autoPlay !== false,
      intervalSpeed: rawBanner?.intervalSpeed || 5,
      textAlign: rawBanner?.textAlign || 'left',
      slideEffect: rawBanner?.slideEffect || 'fade',
      textAnimation: rawBanner?.textAnimation || 'slideUp',
      tagline: rawBanner?.tagline || '',
      taglineFontSize: rawBanner?.taglineFontSize || 'normal',
      headline: rawBanner?.headline || '',
      subtitle: rawBanner?.subtitle || '',
      introText: rawBanner?.introText || '',
      imageUrl: rawBanner?.imageUrl || '',
      buttonText: rawBanner?.buttonText || '',
      buttonLink: rawBanner?.buttonLink || '',
      quote: rawBanner?.quote || '',
      buttons: Array.isArray(rawBanner?.buttons) ? rawBanner.buttons : [],
      slides: Array.isArray(rawBanner?.slides) ? rawBanner.slides : []
    },
    contactEmail: config.contactEmail || config.contact_email || 'lienhe@machquanho.vn',
    contactPhone: config.contactPhone || config.contact_phone || '(0222) 382 1234',
    address: config.address || 'Số 15 Lý Thái Tổ, Phường Suối Hoa, Thành phố Bắc Ninh',
    socialLinks: rawSocial || {
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com',
      tiktok: 'https://tiktok.com'
    }
  };
}

function normalizeResearchEntry(entry: any): ResearchEntry {
  if (!entry) return entry;
  return {
    ...entry,
    id: String(entry.id),
    iconType: entry.iconType || entry.icon_type || 'book',
    findings: Array.isArray(entry.findings) ? entry.findings : (entry.findings ? (typeof entry.findings === 'string' ? JSON.parse(entry.findings) : entry.findings) : []),
    images: Array.isArray(entry.images) ? entry.images : (entry.images ? (typeof entry.images === 'string' ? JSON.parse(entry.images) : entry.images) : []),
    audioTitle: entry.audioTitle || entry.audio_title,
    sortOrder: entry.sortOrder ?? entry.sort_order ?? 0,
  };
}

function normalizeArtisan(artisan: any): Artisan {
  if (!artisan) return artisan;
  return {
    ...artisan,
    id: String(artisan.id),
    birthYear: artisan.birthYear || artisan.birth_year || 1945,
    specialties: Array.isArray(artisan.specialties) ? artisan.specialties : [],
    awards: Array.isArray(artisan.awards) ? artisan.awards : [],
    songs: Array.isArray(artisan.songs) ? artisan.songs : [],
  };
}

function normalizeUser(u: any): AdminUser {
  if (!u) return u;
  return {
    ...u,
    id: String(u.id),
    role: u.role || 'Biên tập viên',
    status: u.status || 'Hoạt động',
    avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdDate: u.createdDate || (u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '15/08/2026'),
    lastActive: u.lastActive || 'Vừa xong',
  };
}

export const apiService = {
  // --- Public Endpoints ---
  async getArticles(params?: { category?: string; searchQuery?: string; featured?: boolean }): Promise<Article[]> {
    const res = await apiClient.get('/articles', { params });
    const list = res.data.data || [];
    return list.map(normalizeArticle);
  },

  async getArticleBySlugOrId(idOrSlug: string): Promise<Article> {
    const res = await apiClient.get(`/articles/${idOrSlug}`);
    return normalizeArticle(res.data.data);
  },

  async getCategories(): Promise<CategoryInfo[]> {
    const res = await apiClient.get('/categories');
    return (res.data.data || []).map((c: any) => ({ ...c, id: String(c.id) }));
  },

  async getResearchEntries(): Promise<ResearchEntry[]> {
    const res = await apiClient.get('/research-entries');
    return (res.data.data || []).map(normalizeResearchEntry);
  },

  async getArtisans(): Promise<Artisan[]> {
    const res = await apiClient.get('/artisans');
    return (res.data.data || []).map(normalizeArtisan);
  },

  async getExploreTopics(): Promise<ExploreTopic[]> {
    const res = await apiClient.get('/explore-topics');
    return (res.data.data || []).map((t: any) => ({
      ...t,
      id: String(t.id),
      details: Array.isArray(t.details) ? t.details : [],
      highlights: Array.isArray(t.highlights) ? t.highlights : [],
    }));
  },

  async getSiteConfig(): Promise<SiteConfig> {
    try {
      const res = await apiClient.get('/site-config');
      if (res.data && res.data.data) {
        const normalized = normalizeSiteConfig(res.data.data);
        localStorage.setItem('mqh_site_config', JSON.stringify(normalized));
        return normalized;
      }
    } catch (err) {
      console.warn('API /site-config fetch failed, using local/default:', err);
    }
    const local = localStorage.getItem('mqh_site_config');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return DEFAULT_SITE_CONFIG;
  },

  // --- Auth Endpoints ---
  async login(credentials: { email: string; password: string }) {
    const res = await apiClient.post('/auth/login', credentials);
    if (res.data.access_token) {
      localStorage.setItem('mqh_jwt_token', res.data.access_token);
    }
    return res.data;
  },

  async getMe(): Promise<AdminUser | null> {
    try {
      const res = await apiClient.get('/auth/me');
      return normalizeUser(res.data);
    } catch {
      return null;
    }
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('mqh_jwt_token');
    }
  },

  // --- Admin CRUD Endpoints ---
  // 1. Articles
  async adminGetArticles(payload?: any): Promise<Article[]> {
    const res = await apiClient.post('/admin/articles/GetData', payload || {});
    return (res.data.data || []).map(normalizeArticle);
  },

  async adminCreateArticle(article: Partial<Article>): Promise<Article> {
    const res = await apiClient.post('/admin/articles', article);
    return normalizeArticle(res.data.data);
  },

  async adminUpdateArticle(id: string | number, article: Partial<Article>): Promise<Article> {
    const res = await apiClient.post(`/admin/articles/${id}/update`, article);
    return normalizeArticle(res.data.data);
  },

  async adminDeleteArticle(id: string | number) {
    const res = await apiClient.post(`/admin/articles/${id}/delete`);
    return res.data;
  },

  // 2. Categories
  async adminGetCategories(payload?: any): Promise<CategoryInfo[]> {
    const res = await apiClient.post('/admin/categories/GetData', payload || {});
    return (res.data.data || []).map((c: any) => ({ ...c, id: String(c.id) }));
  },

  async adminCreateCategory(cat: Partial<CategoryInfo>): Promise<CategoryInfo> {
    const res = await apiClient.post('/admin/categories', cat);
    return { ...res.data.data, id: String(res.data.data.id) };
  },

  async adminUpdateCategory(id: string | number, cat: Partial<CategoryInfo>): Promise<CategoryInfo> {
    const res = await apiClient.post(`/admin/categories/${id}/update`, cat);
    return { ...res.data.data, id: String(res.data.data.id) };
  },

  async adminDeleteCategory(id: string | number) {
    const res = await apiClient.post(`/admin/categories/${id}/delete`);
    return res.data;
  },

  // 3. Research Entries
  async adminGetResearchEntries(payload?: any): Promise<ResearchEntry[]> {
    const res = await apiClient.post('/admin/research-entries/GetData', payload || {});
    return (res.data.data || []).map(normalizeResearchEntry);
  },

  async adminCreateResearchEntry(entry: Partial<ResearchEntry>): Promise<ResearchEntry> {
    const payload = {
      ...entry,
      sort_order: entry.sortOrder ?? (entry as any).sort_order ?? 0,
      icon_type: entry.iconType || (entry as any).icon_type || 'book',
      audio_title: entry.audioTitle || (entry as any).audio_title || '',
    };
    const res = await apiClient.post('/admin/research-entries', payload);
    return normalizeResearchEntry(res.data.data);
  },

  async adminUpdateResearchEntry(id: string | number, entry: Partial<ResearchEntry>): Promise<ResearchEntry> {
    const payload = {
      ...entry,
      sort_order: entry.sortOrder ?? (entry as any).sort_order ?? 0,
      icon_type: entry.iconType || (entry as any).icon_type || 'book',
      audio_title: entry.audioTitle || (entry as any).audio_title || '',
    };
    const res = await apiClient.post(`/admin/research-entries/${id}/update`, payload);
    return normalizeResearchEntry(res.data.data);
  },

  async adminDeleteResearchEntry(id: string | number) {
    const res = await apiClient.post(`/admin/research-entries/${id}/delete`);
    return res.data;
  },

  // 4. Artisans
  async adminGetArtisans(payload?: any): Promise<Artisan[]> {
    const res = await apiClient.post('/admin/artisans/GetData', payload || {});
    return (res.data.data || []).map(normalizeArtisan);
  },

  async adminCreateArtisan(artisan: Partial<Artisan>): Promise<Artisan> {
    const res = await apiClient.post('/admin/artisans', artisan);
    return normalizeArtisan(res.data.data);
  },

  async adminUpdateArtisan(id: string | number, artisan: Partial<Artisan>): Promise<Artisan> {
    const res = await apiClient.post(`/admin/artisans/${id}/update`, artisan);
    return normalizeArtisan(res.data.data);
  },

  async adminDeleteArtisan(id: string | number) {
    const res = await apiClient.post(`/admin/artisans/${id}/delete`);
    return res.data;
  },

  // 5. Explore Topics
  async adminGetExploreTopics(payload?: any): Promise<ExploreTopic[]> {
    const res = await apiClient.post('/admin/explore-topics/GetData', payload || {});
    return (res.data.data || []).map((t: any) => ({ ...t, id: String(t.id) }));
  },

  async adminCreateExploreTopic(topic: Partial<ExploreTopic>): Promise<ExploreTopic> {
    const res = await apiClient.post('/admin/explore-topics', topic);
    return { ...res.data.data, id: String(res.data.data.id) };
  },

  async adminUpdateExploreTopic(id: string | number, topic: Partial<ExploreTopic>): Promise<ExploreTopic> {
    const res = await apiClient.post(`/admin/explore-topics/${id}/update`, topic);
    return { ...res.data.data, id: String(res.data.data.id) };
  },

  async adminDeleteExploreTopic(id: string | number) {
    const res = await apiClient.post(`/admin/explore-topics/${id}/delete`);
    return res.data;
  },

  // 6. Site Config
  async adminUpdateSiteConfig(config: Partial<SiteConfig>): Promise<SiteConfig> {
    let normalizedConfig: SiteConfig;
    try {
      const res = await apiClient.post('/admin/site-config', config);
      normalizedConfig = normalizeSiteConfig(res.data.data);
    } catch (err) {
      console.warn('API admin/site-config update failed, saving locally:', err);
      normalizedConfig = config as SiteConfig;
    }
    localStorage.setItem('mqh_site_config', JSON.stringify(normalizedConfig));
    return normalizedConfig;
  },

  // 7. Users
  async adminGetUsers(payload?: any): Promise<AdminUser[]> {
    const res = await apiClient.post('/admin/users/GetData', payload || {});
    return (res.data.data || []).map(normalizeUser);
  },

  async adminCreateUser(user: Partial<AdminUser>): Promise<AdminUser> {
    const res = await apiClient.post('/admin/users', user);
    return normalizeUser(res.data.data);
  },

  async adminUpdateUser(id: string | number, user: Partial<AdminUser>): Promise<AdminUser> {
    const res = await apiClient.post(`/admin/users/${id}/update`, user);
    return normalizeUser(res.data.data);
  },

  async adminDeleteUser(id: string | number) {
    const res = await apiClient.post(`/admin/users/${id}/delete`);
    return res.data;
  },

  // 8. File Upload
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.url) {
        return res.data.url;
      }
    } catch (err) {
      console.warn('API upload failed, falling back to local FileReader Base64 Data URL:', err);
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },
};

export default apiService;
