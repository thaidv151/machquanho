import apiClient from './apiClient';
import { Article, CategoryInfo, ResearchEntry, Artisan, ExploreTopic, SiteConfig, AdminUser, TeamMember, TimelineEntry, MapLocation, MapConfig, HeaderNavItem, MediaCategory, MediaPost } from '../types';
import { DEFAULT_SITE_CONFIG } from '../data/mockData';

// Helper normalizers to bridge Laravel snake_case DB fields with Frontend TS interfaces

function normalizeMediaCategory(item: any): MediaCategory {
  if (!item) return item;
  return {
    id: String(item.id),
    name: item.name || '',
    slug: item.slug || '',
    description: item.description,
    orderIndex: item.order_index ?? item.orderIndex ?? 0,
    isActive: item.is_active !== undefined ? Boolean(item.is_active) : true,
  };
}

function normalizeMediaPost(item: any): MediaPost {
  if (!item) return item;
  return {
    id: String(item.id),
    categoryId: String(item.category_id || item.categoryId || ''),
    categoryName: item.category?.name || item.categoryName,
    categorySlug: item.category?.slug || item.categorySlug,
    title: item.title || '',
    slug: item.slug || '',
    subTitle: item.sub_title || item.subTitle || '',
    description: item.description || '',
    content: item.content || '',
    mediaType: item.media_type || item.mediaType || 'audio',
    mediaUrl: item.media_url || item.mediaUrl || '',
    thumbnailUrl: item.thumbnail_url || item.thumbnailUrl || '',
    duration: item.duration || '04:00',
    isFeatured: Boolean(item.is_featured ?? item.isFeatured ?? false),
    viewCount: item.view_count ?? item.viewCount ?? 0,
    playCount: item.play_count ?? item.playCount ?? 0,
    status: item.status || 'published',
    publishedAt: item.published_at || item.publishedAt,
  };
}

function normalizeTimelineEntry(item: any): TimelineEntry {
  if (!item) return item;
  return {
    id: String(item.id),
    title: item.title || '',
    period: item.period || item.time_period || '',
    description: item.description || '',
    image: item.image || item.image_url || '',
    icon: item.icon || item.icon_type || 'landmark',
    type: (item.type || item.tab_type || 'heritage') === 'policy' ? 'policy' : 'heritage',
    sortOrder: item.sortOrder ?? item.sort_order ?? 0,
    isPublished: item.isPublished ?? item.is_published ?? item.is_active ?? true,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

function normalizeMenuItem(item: any): HeaderNavItem {
  if (!item) return item;
  return {
    id: String(item.id),
    label: item.label || '',
    viewType: item.view_type || item.viewType || '/',
    icon: item.icon || 'Home',
    customIconUrl: item.custom_icon_url || item.customIconUrl,
  };
}

function normalizeTeamMember(item: any): TeamMember {
  if (!item) return item;
  return {
    id: String(item.id),
    name: item.name || '',
    role: item.role || 'Thành viên',
    avatar: item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: item.bio || '',
    sortOrder: item.sort_order ?? item.sortOrder ?? 0,
    isActive: item.is_active !== undefined ? Boolean(item.is_active) : (item.isActive !== undefined ? Boolean(item.isActive) : true),
  };
}

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
  if (!config) return DEFAULT_SITE_CONFIG;

  const rawBanner = safeParseJson(config.banner);
  const rawHeader = safeParseJson(config.header) || safeParseJson(config.headerConfig) || safeParseJson(config.header_config) || safeParseJson(rawBanner?.header_config);
  const rawFooter = safeParseJson(config.footer);
  const rawSocial = safeParseJson(config.socialLinks) || safeParseJson(config.social_links);

  const navItemsRaw = safeParseJson(rawHeader?.navItems) || rawHeader?.navItems;
  const slidesRaw = safeParseJson(rawBanner?.slides) || rawBanner?.slides;
  const buttonsRaw = safeParseJson(rawBanner?.buttons) || rawBanner?.buttons;

  const quickLinksRaw = safeParseJson(rawFooter?.quickLinks) || rawFooter?.quickLinks;
  const socialPlatformsRaw = safeParseJson(rawFooter?.socialPlatforms) || rawFooter?.socialPlatforms;
  const bottomLinksRaw = safeParseJson(rawFooter?.bottomLinks) || rawFooter?.bottomLinks;

  const defaultFooter = DEFAULT_SITE_CONFIG.footer!;

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
      navItems: Array.isArray(navItemsRaw) && navItemsRaw.length > 0
        ? navItemsRaw.map((n: any) => typeof n === 'string' ? safeParseJson(n) : n).filter(Boolean)
        : DEFAULT_SITE_CONFIG.header!.navItems
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
      buttons: Array.isArray(buttonsRaw) ? buttonsRaw.map((b: any) => typeof b === 'string' ? safeParseJson(b) : b).filter(Boolean) : [],
      slides: Array.isArray(slidesRaw) ? slidesRaw.map((s: any) => typeof s === 'string' ? safeParseJson(s) : s).filter(Boolean) : [],
      pageBanners: rawBanner?.pageBanners || DEFAULT_SITE_CONFIG.banner?.pageBanners
    },
    contactEmail: config.contactEmail || config.contact_email || 'lienhe@machquanho.vn',
    contactPhone: config.contactPhone || config.contact_phone || '(0222) 382 1234',
    address: config.address || 'Số 15 Lý Thái Tổ, Phường Suối Hoa, Thành phố Bắc Ninh',
    socialLinks: rawSocial || {
      facebook: 'https://facebook.com',
      youtube: 'https://youtube.com',
      tiktok: 'https://tiktok.com'
    },
    footer: {
      tagline: rawFooter?.tagline || defaultFooter.tagline,
      description: rawFooter?.description || defaultFooter.description,
      quickLinksTitle: rawFooter?.quickLinksTitle || defaultFooter.quickLinksTitle,
      quickLinks: Array.isArray(quickLinksRaw) && quickLinksRaw.length > 0
        ? quickLinksRaw.map((l: any) => typeof l === 'string' ? safeParseJson(l) : l).filter(Boolean)
        : defaultFooter.quickLinks,
      socialLinksTitle: rawFooter?.socialLinksTitle || defaultFooter.socialLinksTitle,
      socialPlatforms: Array.isArray(socialPlatformsRaw) && socialPlatformsRaw.length > 0
        ? socialPlatformsRaw.map((s: any) => typeof s === 'string' ? safeParseJson(s) : s).filter(Boolean)
        : defaultFooter.socialPlatforms,
      contactTitle: rawFooter?.contactTitle || defaultFooter.contactTitle,
      address: rawFooter?.address || config.address || defaultFooter.address,
      email: rawFooter?.email || config.contactEmail || defaultFooter.email,
      phone: rawFooter?.phone || config.contactPhone || defaultFooter.phone,
      copyrightText: rawFooter?.copyrightText || defaultFooter.copyrightText,
      bottomLinks: Array.isArray(bottomLinksRaw) && bottomLinksRaw.length > 0
        ? bottomLinksRaw.map((b: any) => typeof b === 'string' ? safeParseJson(b) : b).filter(Boolean)
        : defaultFooter.bottomLinks,
    },
    seo: safeParseJson(config.seo) || DEFAULT_SITE_CONFIG.seo
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

// In-memory API Request Cache (60s TTL) & Request Deduplication Map to prevent duplicate roundtrips
const apiMemoryCache = new Map<string, { timestamp: number; data: any }>();
const inFlightRequests = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 60000;

function getCachedData<T>(key: string): T | null {
  const cached = apiMemoryCache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data as T;
  }
  return null;
}

function setCachedData(key: string, data: any): void {
  apiMemoryCache.set(key, { timestamp: Date.now(), data });
}

export function clearApiCache(): void {
  apiMemoryCache.clear();
  inFlightRequests.clear();
}

async function fetchDeduplicated<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = getCachedData<T>(key);
  if (cached !== null) {
    return cached;
  }

  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key) as Promise<T>;
  }

  const promise = fetcher()
    .then((data) => {
      setCachedData(key, data);
      inFlightRequests.delete(key);
      return data;
    })
    .catch((err) => {
      inFlightRequests.delete(key);
      throw err;
    });

  inFlightRequests.set(key, promise);
  return promise;
}

export const apiService = {
  clearCache: clearApiCache,

  // --- Public Endpoints ---
  async getArticles(params?: { category?: string; searchQuery?: string; featured?: boolean }): Promise<Article[]> {
    const key = `getArticles_${JSON.stringify(params || {})}`;
    return fetchDeduplicated(key, async () => {
      const res = await apiClient.get('/articles', { params });
      const list = (res.data.data || []).map(normalizeArticle);
      return list.filter(a => a.status === 'Đã đăng');
    });
  },

  async getArticleBySlugOrId(idOrSlug: string): Promise<Article> {
    const key = `getArticleBySlugOrId_${idOrSlug}`;
    return fetchDeduplicated(key, async () => {
      const res = await apiClient.get(`/articles/${idOrSlug}`);
      return normalizeArticle(res.data.data);
    });
  },

  async getCategories(): Promise<CategoryInfo[]> {
    return fetchDeduplicated('getCategories', async () => {
      const res = await apiClient.get('/categories');
      return (res.data.data || []).map((c: any) => ({ ...c, id: String(c.id) }));
    });
  },

  async getResearchEntries(): Promise<ResearchEntry[]> {
    return fetchDeduplicated('getResearchEntries', async () => {
      const res = await apiClient.get('/research-entries');
      return (res.data.data || []).map(normalizeResearchEntry);
    });
  },

  async getArtisans(): Promise<Artisan[]> {
    return fetchDeduplicated('getArtisans', async () => {
      const res = await apiClient.get('/artisans');
      return (res.data.data || []).map(normalizeArtisan);
    });
  },

  async getExploreTopics(): Promise<ExploreTopic[]> {
    return fetchDeduplicated('getExploreTopics', async () => {
      const res = await apiClient.get('/explore-topics');
      return (res.data.data || []).map((t: any) => ({
        ...t,
        id: String(t.id),
        details: Array.isArray(t.details) ? t.details : [],
        highlights: Array.isArray(t.highlights) ? t.highlights : [],
      }));
    });
  },

  async getSiteConfig(): Promise<SiteConfig> {
    return fetchDeduplicated('getSiteConfig', async () => {
      try {
        const res = await apiClient.get('/site-config');
        if (res.data && res.data.data) {
          return normalizeSiteConfig(res.data.data);
        }
      } catch (err) {
        console.warn('API /site-config fetch failed, using default:', err);
      }
      return DEFAULT_SITE_CONFIG;
    });
  },

  async getTimelineEntries(type?: 'heritage' | 'policy'): Promise<TimelineEntry[]> {
    const key = `getTimelineEntries_${type || 'all'}`;
    return fetchDeduplicated(key, async () => {
      const res = await apiClient.get('/timeline-entries', { params: { type } });
      return (res.data.data || []).map(normalizeTimelineEntry);
    });
  },

  async getMenuItems(): Promise<HeaderNavItem[]> {
    return fetchDeduplicated('getMenuItems', async () => {
      try {
        const res = await apiClient.get('/menu-items');
        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          return res.data.data.map(normalizeMenuItem);
        }
      } catch (err) {
        console.warn('API /menu-items fetch failed:', err);
      }
      return [];
    });
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
    const token = localStorage.getItem('mqh_jwt_token');
    if (!token) return null;

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
    clearApiCache();
    return { ...res.data.data, id: String(res.data.data.id) };
  },

  async adminUpdateCategory(id: string | number, cat: Partial<CategoryInfo>): Promise<CategoryInfo> {
    const res = await apiClient.post(`/admin/categories/${id}/update`, cat);
    clearApiCache();
    return { ...res.data.data, id: String(res.data.data.id) };
  },

  async adminDeleteCategory(id: string | number) {
    const res = await apiClient.post(`/admin/categories/${id}/delete`);
    clearApiCache();
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

  // 5.5 Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    return fetchDeduplicated('team_members_all', async () => {
      const res = await apiClient.get('/team-members');
      return (res.data.data || []).map(normalizeTeamMember);
    });
  },

  async adminGetTeamMembers(payload?: any): Promise<TeamMember[]> {
    const res = await apiClient.post('/admin/team-members/GetData', payload || {});
    return (res.data.data || []).map(normalizeTeamMember);
  },

  async adminCreateTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
    const payload = {
      name: member.name,
      role: member.role,
      avatar: member.avatar,
      bio: member.bio,
      sort_order: member.sortOrder,
      is_active: member.isActive,
    };
    const res = await apiClient.post('/admin/team-members', payload);
    return normalizeTeamMember(res.data.data);
  },

  async adminUpdateTeamMember(id: string | number, member: Partial<TeamMember>): Promise<TeamMember> {
    const payload = {
      name: member.name,
      role: member.role,
      avatar: member.avatar,
      bio: member.bio,
      sort_order: member.sortOrder,
      is_active: member.isActive,
    };
    const res = await apiClient.post(`/admin/team-members/${id}/update`, payload);
    return normalizeTeamMember(res.data.data);
  },

  async adminDeleteTeamMember(id: string | number) {
    const res = await apiClient.post(`/admin/team-members/${id}/delete`);
    return res.data;
  },

  // Timeline Entries
  async adminGetTimelineEntries(payload?: { type?: string; searchQuery?: string; pageIndex?: number; pageSize?: number }): Promise<{ data: TimelineEntry[]; totalItems: number; pageIndex: number; pageSize: number; totalPages: number }> {
    const res = await apiClient.post('/admin/timeline-entries/GetData', payload || {});
    return {
      data: (res.data.data || []).map(normalizeTimelineEntry),
      totalItems: res.data.totalItems || 0,
      pageIndex: res.data.pageIndex || 1,
      pageSize: res.data.pageSize || 20,
      totalPages: res.data.totalPages || 1,
    };
  },

  async adminCreateTimelineEntry(entry: Partial<TimelineEntry>): Promise<TimelineEntry> {
    const payload = {
      title: entry.title,
      period: entry.period,
      description: entry.description,
      image: entry.image,
      icon: entry.icon,
      type: entry.type || 'heritage',
      sort_order: entry.sortOrder,
      is_published: entry.isPublished,
    };
    const res = await apiClient.post('/admin/timeline-entries', payload);
    return normalizeTimelineEntry(res.data.data);
  },

  async adminUpdateTimelineEntry(id: string | number, entry: Partial<TimelineEntry>): Promise<TimelineEntry> {
    const payload = {
      title: entry.title,
      period: entry.period,
      description: entry.description,
      image: entry.image,
      icon: entry.icon,
      type: entry.type,
      sort_order: entry.sortOrder,
      is_published: entry.isPublished,
    };
    const res = await apiClient.post(`/admin/timeline-entries/${id}/update`, payload);
    return normalizeTimelineEntry(res.data.data);
  },

  async adminDeleteTimelineEntry(id: string | number) {
    const res = await apiClient.post(`/admin/timeline-entries/${id}/delete`);
    return res.data;
  },

  // 6. Site Config
  async adminUpdateSiteConfig(config: Partial<SiteConfig>): Promise<SiteConfig> {
    let normalizedConfig: SiteConfig;
    try {
      const res = await apiClient.post('/admin/site-config', config);
      normalizedConfig = normalizeSiteConfig(res.data.data);
    } catch (err) {
      console.warn('API admin/site-config update failed:', err);
      normalizedConfig = config as SiteConfig;
    }
    setCachedData('site_config_full', normalizedConfig);
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

  // 8. Map Locations & Map Config API
  async getMapLocations(category?: string): Promise<MapLocation[]> {
    try {
      const res = await apiClient.get('/map-locations', { params: { category } });
      const items = res.data.data || res.data;
      return Array.isArray(items) ? items.map(normalizeMapLocation) : [];
    } catch (err) {
      console.error('getMapLocations error:', err);
      return [];
    }
  },

  async adminGetMapLocations(params: any): Promise<{ data: MapLocation[]; total: number }> {
    try {
      const res = await apiClient.post('/admin/map-locations/GetData', params);
      const items = res.data.data || [];
      return {
        data: Array.isArray(items) ? items.map(normalizeMapLocation) : [],
        total: res.data.total || items.length,
      };
    } catch (err) {
      console.error('adminGetMapLocations error:', err);
      return { data: [], total: 0 };
    }
  },

  async createMapLocation(data: Partial<MapLocation>): Promise<MapLocation> {
    const res = await apiClient.post('/admin/map-locations', data);
    clearApiCache();
    return normalizeMapLocation(res.data.data);
  },

  async updateMapLocation(id: number | string, data: Partial<MapLocation>): Promise<MapLocation> {
    const res = await apiClient.post(`/admin/map-locations/${id}/update`, data);
    clearApiCache();
    return normalizeMapLocation(res.data.data);
  },

  async deleteMapLocation(id: number | string) {
    const res = await apiClient.post(`/admin/map-locations/${id}/delete`);
    clearApiCache();
    return res.data;
  },

  async getMapConfig(): Promise<MapConfig> {
    try {
      const res = await apiClient.get('/map-config');
      const data = res.data.data || res.data;
      const rawCategories = Array.isArray(data.categories) ? data.categories : [];
      
      const normalizedCategories = rawCategories.map((c: any, index: number) => ({
        id: c.id || `cat-${index + 1}`,
        name: c.name || '',
        icon: c.icon || '📍',
        color: c.color || '#8B263E',
        sort_order: Number(c.sort_order ?? c.sortOrder ?? index + 1),
      })).sort((a: any, b: any) => a.sort_order - b.sort_order);

      return {
        title: data.title || 'BẢN ĐỒ MẠCH QUAN HỌ',
        subtitle: data.subtitle || 'Khám phá các điểm di sản, làng Quan họ và không gian văn hóa',
        height: data.height || '600px',
        width: data.width || '100%',
        defaultLat: Number(data.defaultLat || 21.1861),
        defaultLng: Number(data.defaultLng || 106.0763),
        defaultZoom: Number(data.defaultZoom || 12),
        categories: normalizedCategories,
      };
    } catch (err) {
      return {
        title: 'BẢN ĐỒ MẠCH QUAN HỌ',
        subtitle: 'Khám phá các điểm di sản, làng Quan họ và không gian văn hóa',
        height: '600px',
        width: '100%',
        defaultLat: 21.1861,
        defaultLng: 106.0763,
        defaultZoom: 12,
        categories: [],
      };
    }
  },

  async updateMapConfig(config: MapConfig): Promise<MapConfig> {
    const payload = {
      title: config.title || 'BẢN ĐỒ MẠCH QUAN HỌ',
      subtitle: config.subtitle || 'Khám phá các điểm di sản, làng Quan họ và không gian văn hóa',
      height: config.height || '600px',
      width: config.width || '100%',
      defaultLat: Number(config.defaultLat || 21.1861),
      defaultLng: Number(config.defaultLng || 106.0763),
      defaultZoom: Number(config.defaultZoom || 12),
      categories: (config.categories || []).map((c, i) => ({
        id: c.id || `cat-${i + 1}`,
        name: c.name || 'Danh mục',
        icon: c.icon || '📍',
        color: c.color || '#8B263E',
        sort_order: i + 1,
      })),
    };
    const res = await apiClient.post('/admin/map-config', payload);
    clearApiCache();
    return res.data.data;
  },

  // 9. File Upload (Images, Videos, Audio)
  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.url) {
        return res.data.url;
      }
    } catch (err: any) {
      console.error('API file upload error:', err);
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|mkv|avi|flv|wmv)$/i.test(file.name);
      if (isVideo) {
        throw new Error('Upload video lên máy chủ thất bại. Vui lòng kiểm tra dung lượng tệp hoặc kết nối server API.');
      }
    }
    // Fallback to Base64 data URL only for small images if server is offline
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },

  async uploadImage(file: File): Promise<string> {
    return this.uploadFile(file);
  },

  // Menu Items API (Admin CRUD)
  async adminGetMenuItems(payload?: any): Promise<HeaderNavItem[]> {
    const res = await apiClient.post('/admin/menu-items/GetData', payload || {});
    return (res.data.data || []).map(normalizeMenuItem);
  },

  async adminCreateMenuItem(item: Partial<HeaderNavItem>): Promise<HeaderNavItem> {
    const res = await apiClient.post('/admin/menu-items', {
      label: item.label,
      view_type: item.viewType || '/',
      icon: item.icon || 'Home',
      custom_icon_url: item.customIconUrl,
    });
    clearApiCache();
    return normalizeMenuItem(res.data.data);
  },

  async adminUpdateMenuItem(id: string, item: Partial<HeaderNavItem>): Promise<HeaderNavItem> {
    const res = await apiClient.post(`/admin/menu-items/${id}/update`, {
      label: item.label,
      view_type: item.viewType,
      icon: item.icon,
      custom_icon_url: item.customIconUrl,
    });
    clearApiCache();
    return normalizeMenuItem(res.data.data);
  },

  async adminDeleteMenuItem(id: string): Promise<void> {
    await apiClient.post(`/admin/menu-items/${id}/delete`);
    clearApiCache();
  },

  async adminReorderMenuItems(orderedIds: string[]): Promise<void> {
    await apiClient.post('/admin/menu-items/reorder', { ordered_ids: orderedIds });
    clearApiCache();
  },

  // Media / Nghe Quan Ho API
  async getMediaCategories(): Promise<MediaCategory[]> {
    return fetchDeduplicated('media_categories', async () => {
      try {
        const res = await apiClient.get('/media/categories');
        const items = res.data.data || res.data || [];
        return Array.isArray(items) ? items.map(normalizeMediaCategory) : [];
      } catch (err) {
        console.error('getMediaCategories error:', err);
        return [];
      }
    });
  },

  async getMediaPosts(categorySlug?: string, isFeatured?: boolean, limit?: number): Promise<MediaPost[]> {
    const key = `media_posts_${categorySlug || 'all'}_${isFeatured ?? 'all'}_${limit || 20}`;
    return fetchDeduplicated(key, async () => {
      try {
        const res = await apiClient.get('/media/posts', {
          params: { category_slug: categorySlug, is_featured: isFeatured, limit }
        });
        const items = res.data.data || res.data || [];
        return Array.isArray(items) ? items.map(normalizeMediaPost) : [];
      } catch (err) {
        console.error('getMediaPosts error:', err);
        return [];
      }
    });
  },

  async getFeaturedTodayMedia(): Promise<MediaPost | null> {
    return fetchDeduplicated('featured_today_media', async () => {
      try {
        const res = await apiClient.get('/media/featured-today');
        const item = res.data.data;
        return item ? normalizeMediaPost(item) : null;
      } catch (err) {
        console.error('getFeaturedTodayMedia error:', err);
        return null;
      }
    });
  },

  async incrementMediaPlay(id: string | number): Promise<void> {
    try {
      await apiClient.post(`/media/posts/${id}/increment-play`);
    } catch (err) {
      console.warn('incrementMediaPlay failed:', err);
    }
  },

  // Media / Nghe Quan Ho Admin CRUD
  async adminGetMediaCategories(): Promise<MediaCategory[]> {
    const res = await apiClient.post('/admin/media/categories/GetData');
    const items = res.data.data || [];
    return Array.isArray(items) ? items.map(normalizeMediaCategory) : [];
  },

  async adminCreateMediaCategory(cat: Partial<MediaCategory>): Promise<MediaCategory> {
    const res = await apiClient.post('/admin/media/categories', cat);
    clearApiCache();
    return normalizeMediaCategory(res.data.data);
  },

  async adminUpdateMediaCategory(id: string | number, cat: Partial<MediaCategory>): Promise<MediaCategory> {
    const res = await apiClient.post(`/admin/media/categories/${id}/update`, cat);
    clearApiCache();
    return normalizeMediaCategory(res.data.data);
  },

  async adminDeleteMediaCategory(id: string | number) {
    const res = await apiClient.post(`/admin/media/categories/${id}/delete`);
    clearApiCache();
    return res.data;
  },

  async adminGetMediaPosts(params?: Record<string, any>): Promise<MediaPost[]> {
    const res = await apiClient.post('/admin/media/posts/GetData', params || {});
    const items = res.data.data || [];
    return Array.isArray(items) ? items.map(normalizeMediaPost) : [];
  },

  async adminCreateMediaPost(post: Partial<MediaPost>): Promise<MediaPost> {
    const res = await apiClient.post('/admin/media/posts', post);
    clearApiCache();
    return normalizeMediaPost(res.data.data);
  },

  async adminUpdateMediaPost(id: string | number, post: Partial<MediaPost>): Promise<MediaPost> {
    const res = await apiClient.post(`/admin/media/posts/${id}/update`, post);
    clearApiCache();
    return normalizeMediaPost(res.data.data);
  },

  async adminDeleteMediaPost(id: string | number) {
    const res = await apiClient.post(`/admin/media/posts/${id}/delete`);
    clearApiCache();
    return res.data;
  },
};

function normalizeMapLocation(item: any): MapLocation {
  if (!item) return item;
  return {
    id: item.id,
    title: item.title || '',
    category: item.category || 'Địa điểm di sản',
    address: item.address || '',
    latitude: Number(item.latitude || 21.1861),
    longitude: Number(item.longitude || 106.0763),
    image_url: item.image_url || item.imageUrl || '',
    summary: item.summary || '',
    content: item.content || '',
    status: item.status !== undefined ? Boolean(item.status) : true,
    sort_order: item.sort_order ?? item.sortOrder ?? 0,
    created_at: item.created_at,
    updated_at: item.updated_at,
  };
}

export default apiService;
