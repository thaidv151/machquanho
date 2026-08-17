import React, { useState } from 'react';
import { Article, AdminUser, CategoryInfo, SiteConfig, ViewState, ArticleCategory } from '../types';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  FolderKanban, 
  Settings, 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Unlock, 
  Save, 
  Sliders, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  X,
  Image as ImageIcon,
  Check
} from 'lucide-react';

interface AdminPortalProps {
  section: 'dashboard' | 'articles' | 'users' | 'categories' | 'banner';
  articles: Article[];
  users: AdminUser[];
  categories: CategoryInfo[];
  siteConfig: SiteConfig;
  onUpdateArticles: (articles: Article[]) => void;
  onUpdateUsers: (users: AdminUser[]) => void;
  onUpdateCategories: (categories: CategoryInfo[]) => void;
  onUpdateSiteConfig: (config: SiteConfig) => void;
  onNavigate: (view: ViewState) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  section,
  articles,
  users,
  categories,
  siteConfig,
  onUpdateArticles,
  onUpdateUsers,
  onUpdateCategories,
  onUpdateSiteConfig,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'articles' | 'users' | 'categories' | 'banner'>(section || 'dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Article State
  const [articleSearch, setArticleSearch] = useState('');
  const [articleCategoryFilter, setArticleCategoryFilter] = useState('Tất cả');
  const [articleStatusFilter, setArticleStatusFilter] = useState('Tất cả');
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleFormData, setArticleFormData] = useState<Partial<Article>>({
    title: '',
    category: 'Sự kiện',
    excerpt: '',
    content: [''],
    coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    author: 'Ban biên tập Mạch Quan Họ',
    authorRole: 'Biên tập viên',
    status: 'Đã đăng',
    tags: ['Quan họ', 'Kinh Bắc'],
    readTime: '4 phút đọc'
  });

  // User State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('Tất cả');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userFormData, setUserFormData] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    phone: '',
    role: 'Biên tập viên',
    status: 'Hoạt động',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  });

  // Category State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#8C2320');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Banner State
  const [bannerForm, setBannerForm] = useState(siteConfig.banner);
  const [siteInfoForm, setSiteInfoForm] = useState({
    siteName: siteConfig.siteName,
    logoText: siteConfig.logoText,
    logoSubtext: siteConfig.logoSubtext,
    contactEmail: siteConfig.contactEmail,
    contactPhone: siteConfig.contactPhone,
    address: siteConfig.address
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Article Handlers
  const handleOpenNewArticle = () => {
    setEditingArticle(null);
    setArticleFormData({
      title: '',
      slug: '',
      category: 'Sự kiện',
      excerpt: '',
      content: [''],
      coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      author: 'Ban biên tập Mạch Quan Họ',
      authorRole: 'Biên tập viên',
      status: 'Đã đăng',
      tags: ['Quan họ', 'Kinh Bắc'],
      readTime: '4 phút đọc',
      views: 0
    });
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArticleFormData({ ...art });
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleFormData.title?.trim()) return;

    if (editingArticle) {
      const updated = articles.map(a => a.id === editingArticle.id ? { ...a, ...articleFormData } as Article : a);
      onUpdateArticles(updated);
      showToast('Đã cập nhật bài viết thành công!');
    } else {
      const newArt: Article = {
        id: `art-${Date.now()}`,
        title: articleFormData.title || '',
        slug: (articleFormData.title || '').toLowerCase().replace(/\s+/g, '-'),
        category: (articleFormData.category as ArticleCategory) || 'Sự kiện',
        excerpt: articleFormData.excerpt || '',
        content: Array.isArray(articleFormData.content) ? articleFormData.content : [articleFormData.content || ''],
        coverImage: articleFormData.coverImage || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
        author: articleFormData.author || 'Ban biên tập',
        authorRole: articleFormData.authorRole || 'Biên tập viên',
        date: new Date().toLocaleDateString('vi-VN'),
        readTime: articleFormData.readTime || '4 phút đọc',
        tags: typeof articleFormData.tags === 'string' ? (articleFormData.tags as string).split(',').map(s => s.trim()) : (articleFormData.tags || ['Quan họ']),
        views: 1,
        status: (articleFormData.status as 'Đã đăng' | 'Nháp') || 'Đã đăng'
      };
      onUpdateArticles([newArt, ...articles]);
      showToast('Đã tạo bài viết mới thành công!');
    }
    setIsArticleModalOpen(false);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      onUpdateArticles(articles.filter(a => a.id !== id));
      showToast('Đã xóa bài viết.');
    }
  };

  const handleToggleArticleStatus = (art: Article) => {
    const nextStatus = art.status === 'Đã đăng' ? 'Nháp' : 'Đã đăng';
    const updated = articles.map(a => a.id === art.id ? { ...a, status: nextStatus } as Article : a);
    onUpdateArticles(updated);
    showToast(`Đã chuyển trạng thái bài viết thành: ${nextStatus}`);
  };

  // User Handlers
  const handleOpenNewUser = () => {
    setEditingUser(null);
    setUserFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Biên tập viên',
      status: 'Hoạt động',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (usr: AdminUser) => {
    setEditingUser(usr);
    setUserFormData({ ...usr });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.name?.trim() || !userFormData.email?.trim()) return;

    if (editingUser) {
      const updated = users.map(u => u.id === editingUser.id ? { ...u, ...userFormData } as AdminUser : u);
      onUpdateUsers(updated);
      showToast('Đã cập nhật thông tin người dùng!');
    } else {
      const newUsr: AdminUser = {
        id: `usr-${Date.now()}`,
        name: userFormData.name || '',
        email: userFormData.email || '',
        phone: userFormData.phone || '',
        role: userFormData.role || 'Biên tập viên',
        status: userFormData.status || 'Hoạt động',
        avatar: userFormData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdDate: new Date().toLocaleDateString('vi-VN'),
        lastActive: 'Vừa xong'
      };
      onUpdateUsers([...users, newUsr]);
      showToast('Đã thêm người dùng mới thành công!');
    }
    setIsUserModalOpen(false);
  };

  const handleToggleUserStatus = (usr: AdminUser) => {
    const nextStatus = usr.status === 'Hoạt động' ? 'Khóa' : 'Hoạt động';
    const updated = users.map(u => u.id === usr.id ? { ...u, status: nextStatus } as AdminUser : u);
    onUpdateUsers(updated);
    showToast(`Đã chuyển trạng thái người dùng thành: ${nextStatus}`);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa tài khoản này?')) {
      onUpdateUsers(users.filter(u => u.id !== id));
      showToast('Đã xóa người dùng.');
    }
  };

  // Category Handlers
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: CategoryInfo = {
      id: `cat-${Date.now()}`,
      name: newCatName as ArticleCategory,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      count: 0,
      color: newCatColor,
      description: newCatDesc || 'Chuyên mục mới'
    };
    onUpdateCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatDesc('');
    setIsCategoryModalOpen(false);
    showToast('Đã thêm chuyên mục mới!');
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa chuyên mục này?')) {
      onUpdateCategories(categories.filter(c => c.id !== id));
      showToast('Đã xóa chuyên mục.');
    }
  };

  // Banner & Site Config Save
  const handleSaveBannerAndSiteConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteConfig({
      ...siteConfig,
      siteName: siteInfoForm.siteName,
      logoText: siteInfoForm.logoText,
      logoSubtext: siteInfoForm.logoSubtext,
      contactEmail: siteInfoForm.contactEmail,
      contactPhone: siteInfoForm.contactPhone,
      address: siteInfoForm.address,
      banner: bannerForm
    });
    showToast('Đã lưu cấu hình banner và giao diện thành công!');
  };

  // Filtered Articles
  const filteredArticles = articles.filter(a => {
    const matchesCat = articleCategoryFilter === 'Tất cả' || a.category === articleCategoryFilter;
    const matchesStatus = articleStatusFilter === 'Tất cả' || a.status === articleStatusFilter;
    const matchesSearch = !articleSearch.trim() || 
      a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.author.toLowerCase().includes(articleSearch.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesRole = userRoleFilter === 'Tất cả' || u.role === userRoleFilter;
    const matchesSearch = !userSearch.trim() || 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div id="admin-portal-root" className="min-h-screen bg-[#F1EDE8] flex flex-col lg:flex-row">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#1E293B] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-slideDown border border-slate-700">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-[#1C1412] text-[#E0D5CE] shrink-0 border-r border-[#382B26] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-[#382B26] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-[#8C2320] flex items-center justify-center text-white font-serif-culture font-bold text-base shadow-xs">
                MQ
              </div>
              <div>
                <h1 className="font-serif-culture text-base font-bold text-white tracking-wide">
                  Hệ thống Quản trị
                </h1>
                <p className="text-[11px] text-[#A8988B] font-medium">Mạch Quan Họ CMS</p>
              </div>
            </div>
          </div>

          {/* User Profile Summary */}
          <div className="p-4 mx-4 my-4 rounded-xl bg-[#291C18] border border-[#3D2C26] flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" 
              alt="Admin" 
              className="w-10 h-10 rounded-full object-cover border border-[#8C2320]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Nguyễn Thanh Tùng</p>
              <span className="inline-block text-[10px] px-2 py-0.5 rounded-md bg-[#8C2320] text-white font-semibold">
                Quản trị viên
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            {[
              { id: 'dashboard', label: 'Bảng tổng quan', icon: LayoutDashboard },
              { id: 'articles', label: 'Quản lý tin bài', icon: FileText, badge: articles.length },
              { id: 'users', label: 'Quản lý người dùng', icon: Users, badge: users.length },
              { id: 'categories', label: 'Quản lý chuyên mục', icon: FolderKanban, badge: categories.length },
              { id: 'banner', label: 'Cấu hình giao diện', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#8C2320] text-white font-bold shadow-xs'
                      : 'text-[#C4B7AC] hover:bg-[#2A1C18] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-[#3D2C26] text-[#A8988B]'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Back to Client Site button */}
        <div className="p-4 border-t border-[#382B26]">
          <button
            id="admin-back-to-site-btn"
            onClick={() => onNavigate({ type: 'home' })}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-white text-[#8C2320] font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang người xem</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-screen">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
                Bảng điều khiển hệ thống
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6B60] mt-1">
                Tổng hợp số liệu tin bài, tư liệu điền dã và người dùng của Mạch Quan Họ
              </p>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#8C2320]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C6B50]">Tổng bài viết</span>
                  <FileText className="w-5 h-5" />
                </div>
                <p className="font-serif-culture text-3xl font-bold text-[#2D241E]">{articles.length}</p>
                <p className="text-[11px] text-[#059669] font-semibold">
                  {articles.filter(a => a.status === 'Đã đăng').length} đã xuất bản • {articles.filter(a => a.status === 'Nháp').length} bản nháp
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#2563EB]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C6B50]">Lượt đọc bài</span>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="font-serif-culture text-3xl font-bold text-[#2D241E]">
                  {articles.reduce((acc, a) => acc + (a.views || 0), 0).toLocaleString('vi-VN')}
                </p>
                <p className="text-[11px] text-[#2563EB] font-semibold">+18.4% so với tháng trước</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#D97706]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C6B50]">Nhật ký điền dã</span>
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="font-serif-culture text-3xl font-bold text-[#2D241E]">3</p>
                <p className="text-[11px] text-[#7A6B60] font-medium">Làng Diềm, Làng Bịu, Thổ Hà</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[#7C3AED]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C6B50]">Thành viên ban quản trị</span>
                  <Users className="w-5 h-5" />
                </div>
                <p className="font-serif-culture text-3xl font-bold text-[#2D241E]">{users.length}</p>
                <p className="text-[11px] text-[#059669] font-semibold">{users.filter(u => u.status === 'Hoạt động').length} tài khoản hoạt động</p>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Quick Actions */}
              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-4">
                <h3 className="font-serif-culture text-lg font-bold text-[#2D241E]">Thao tác nhanh</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleOpenNewArticle}
                    className="p-4 rounded-xl bg-[#FAF6F0] hover:bg-[#8C2320] hover:text-white border border-[#E8DFC8] text-left transition-all cursor-pointer group"
                  >
                    <Plus className="w-5 h-5 text-[#8C2320] group-hover:text-white mb-2" />
                    <p className="font-bold text-xs sm:text-sm">Soạn bài viết mới</p>
                    <p className="text-[11px] text-[#8C6B50] group-hover:text-white/80 mt-0.5">Thêm bài hoặc phóng sự</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('banner')}
                    className="p-4 rounded-xl bg-[#FAF6F0] hover:bg-[#8C2320] hover:text-white border border-[#E8DFC8] text-left transition-all cursor-pointer group"
                  >
                    <Sliders className="w-5 h-5 text-[#8C2320] group-hover:text-white mb-2" />
                    <p className="font-bold text-xs sm:text-sm">Đổi Banner chính</p>
                    <p className="text-[11px] text-[#8C6B50] group-hover:text-white/80 mt-0.5">Cập nhật hình & thông điệp</p>
                  </button>
                </div>
              </div>

              {/* Recent Activity Log */}
              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-4">
                <h3 className="font-serif-culture text-lg font-bold text-[#2D241E]">Nhật ký hoạt động gần đây</h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE5D8] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#2D241E]">Xuất bản bài: "Khai mạc Hội Lim 2024"</p>
                      <p className="text-[#8C6B50]">Bởi Nguyễn Thanh Tùng</p>
                    </div>
                    <span className="text-[#A8988B]">Hôm nay</span>
                  </div>
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE5D8] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#2D241E]">Cập nhật tư liệu: "Khảo sát tục kết chạ Làng Diềm"</p>
                      <p className="text-[#8C6B50]">Bởi Trần Thị Mai Phương</p>
                    </div>
                    <span className="text-[#A8988B]">Hôm qua</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: QUẢN LÝ TIN BÀI (ARTICLES) */}
        {activeTab === 'articles' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header & New Article CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
                  Quản lý tin bài & hoạt động
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6B60] mt-1">
                  Đăng tải, hiệu chỉnh và phân loại các bài viết về di sản Quan họ
                </p>
              </div>

              <button
                id="admin-add-article-btn"
                onClick={handleOpenNewArticle}
                className="px-5 py-2.5 rounded-full bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm bài viết mới</span>
              </button>
            </div>

            {/* Filters bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6B50]" />
                <input
                  type="text"
                  placeholder="Tìm theo tiêu đề hoặc tác giả..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#8C2320]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select
                  value={articleCategoryFilter}
                  onChange={(e) => setArticleCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:outline-none"
                >
                  <option value="Tất cả">Tất cả chuyên mục</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={articleStatusFilter}
                  onChange={(e) => setArticleStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:outline-none"
                >
                  <option value="Tất cả">Tất cả trạng thái</option>
                  <option value="Đã đăng">Đã đăng</option>
                  <option value="Nháp">Nháp</option>
                </select>
              </div>

            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-2xl border border-[#E8DFC8] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF6F0] text-[#7A6B60] uppercase tracking-wider font-semibold border-b border-[#E8DFC8]">
                    <tr>
                      <th className="py-3.5 px-4">Bài viết</th>
                      <th className="py-3.5 px-4">Chuyên mục</th>
                      <th className="py-3.5 px-4">Tác giả</th>
                      <th className="py-3.5 px-4">Trạng thái</th>
                      <th className="py-3.5 px-4">Ngày đăng</th>
                      <th className="py-3.5 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE1] text-[#2D241E]">
                    {filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={art.coverImage}
                              alt={art.title}
                              className="w-12 h-10 rounded-lg object-cover border border-[#D9CEBA] shrink-0"
                            />
                            <div className="min-w-0 max-w-sm">
                              <p className="font-bold font-serif-culture text-sm text-[#2D241E] truncate" title={art.title}>
                                {art.title}
                              </p>
                              <p className="text-[11px] text-[#8C6B50] truncate">{art.excerpt}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FAF4EB] border border-[#E5B567] text-[#8C2320]">
                            {art.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#5C4D44]">{art.author}</td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleArticleStatus(art)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                              art.status === 'Đã đăng'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                            title="Bấm để đổi trạng thái"
                          >
                            ● {art.status}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-[#8C6B50]">{art.date}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => onNavigate({ type: 'article-detail', articleId: art.id })}
                              className="p-1.5 rounded-lg text-[#5C4D44] hover:text-[#8C2320] hover:bg-[#F4EFE6]"
                              title="Xem bài viết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEditArticle(art)}
                              className="p-1.5 rounded-lg text-[#2563EB] hover:bg-blue-50"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="p-1.5 rounded-lg text-[#DC2626] hover:bg-red-50"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: QUẢN LÝ NGƯỜI DÙNG (USERS) */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
                  Quản lý người dùng & phân quyền
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6B60] mt-1">
                  Quản lý danh sách ban biên tập, quản trị viên và cộng tác viên nghiên cứu
                </p>
              </div>

              <button
                id="admin-add-user-btn"
                onClick={handleOpenNewUser}
                className="px-5 py-2.5 rounded-full bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm người dùng mới</span>
              </button>
            </div>

            {/* Filter */}
            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6B50]" />
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#8C2320]"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:outline-none"
              >
                <option value="Tất cả">Tất cả vai trò</option>
                <option value="Quản trị viên">Quản trị viên</option>
                <option value="Biên tập viên">Biên tập viên</option>
                <option value="Cộng tác viên">Cộng tác viên</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-[#E8DFC8] shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6F0] text-[#7A6B60] uppercase tracking-wider font-semibold border-b border-[#E8DFC8]">
                  <tr>
                    <th className="py-3.5 px-4">Thành viên</th>
                    <th className="py-3.5 px-4">Email / SĐT</th>
                    <th className="py-3.5 px-4">Vai trò</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4">Hoạt động gần nhất</th>
                    <th className="py-3.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE1]">
                  {filteredUsers.map((usr) => (
                    <tr key={usr.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img src={usr.avatar} alt={usr.name} className="w-9 h-9 rounded-full object-cover border border-[#D9CEBA]" />
                          <div>
                            <p className="font-bold text-[#2D241E]">{usr.name}</p>
                            <p className="text-[10px] text-[#8C6B50]">Tạo ngày: {usr.createdDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-[#2D241E]">{usr.email}</p>
                        <p className="text-[10px] text-[#8C6B50]">{usr.phone || 'Chưa cập nhật'}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          usr.role === 'Quản trị viên' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          usr.status === 'Hoạt động' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          <span>●</span>
                          <span>{usr.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#8C6B50]">{usr.lastActive}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleToggleUserStatus(usr)}
                            className="p-1.5 rounded-lg text-[#5C4D44] hover:bg-[#F4EFE6]"
                            title={usr.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
                          >
                            {usr.status === 'Hoạt động' ? <Lock className="w-4 h-4 text-amber-600" /> : <Unlock className="w-4 h-4 text-green-600" />}
                          </button>
                          <button
                            onClick={() => handleOpenEditUser(usr)}
                            className="p-1.5 rounded-lg text-[#2563EB] hover:bg-blue-50"
                            title="Sửa thông tin"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(usr.id)}
                            className="p-1.5 rounded-lg text-[#DC2626] hover:bg-red-50"
                            title="Xóa người dùng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: QUẢN LÝ CHUYÊN MỤC (CATEGORIES) */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
                  Quản lý chuyên mục di sản
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6B60] mt-1">
                  Cấu hình các danh mục phân loại bài viết và tư liệu
                </p>
              </div>

              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm chuyên mục</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-md text-xs font-bold text-white" style={{ backgroundColor: cat.color }}>
                        {cat.name}
                      </span>
                      <span className="text-xs font-semibold text-[#8C6B50]">
                        {articles.filter(a => a.category === cat.name).length} bài viết
                      </span>
                    </div>

                    <p className="text-xs text-[#5C4D44] mt-3 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs text-[#8C6B50]">
                    <span>slug: /{cat.slug}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Xóa chuyên mục"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CẤU HÌNH GIAO DIỆN (BANNER & THEME CONFIG) */}
        {activeTab === 'banner' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
                Cấu hình Banner & Giao diện trang chủ
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6B60] mt-1">
                Tùy biến hình ảnh hero, thông điệp truyền thông và thông tin liên hệ di sản
              </p>
            </div>

            <form onSubmit={handleSaveBannerAndSiteConfig} className="space-y-8">
              
              {/* 1. Banner Headline & Intro */}
              <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
                <h3 className="font-serif-culture text-lg font-bold text-[#2D241E] pb-2 border-b border-[#E8DFC8]">
                  1. Cấu hình Banner Hero Trang chủ
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tiêu đề chính (Headline)</label>
                    <input
                      type="text"
                      value={bannerForm.headline}
                      onChange={(e) => setBannerForm({ ...bannerForm, headline: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tiêu đề phụ (Subtitle)</label>
                    <input
                      type="text"
                      value={bannerForm.subtitle}
                      onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Đường dẫn ảnh nền Banner (Cover Image URL)</label>
                  <input
                    type="text"
                    value={bannerForm.imageUrl}
                    onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                  />
                  <p className="text-[11px] text-[#8C6B50] mt-1">Gợi ý: Dùng ảnh phong cảnh Bắc Ninh, đền chùa, hoặc thuyền rồng Quan họ chất lượng cao.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Đoạn văn giới thiệu (Intro Text)</label>
                  <textarea
                    rows={3}
                    value={bannerForm.introText}
                    onChange={(e) => setBannerForm({ ...bannerForm, introText: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Câu đối thoại / Trích dẫn văn hóa (Quote)</label>
                  <input
                    type="text"
                    value={bannerForm.quote}
                    onChange={(e) => setBannerForm({ ...bannerForm, quote: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                  />
                </div>
              </div>

              {/* 2. Site Branding & Contact */}
              <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
                <h3 className="font-serif-culture text-lg font-bold text-[#2D241E] pb-2 border-b border-[#E8DFC8]">
                  2. Thông tin thương hiệu & Liên hệ
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tên Logo hiển thị</label>
                    <input
                      type="text"
                      value={siteInfoForm.logoText}
                      onChange={(e) => setSiteInfoForm({ ...siteInfoForm, logoText: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4A3B32] mb-1">Phụ đề Logo (Subtext)</label>
                    <input
                      type="text"
                      value={siteInfoForm.logoSubtext}
                      onChange={(e) => setSiteInfoForm({ ...siteInfoForm, logoSubtext: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A3B32] mb-1">Email liên hệ</label>
                    <input
                      type="email"
                      value={siteInfoForm.contactEmail}
                      onChange={(e) => setSiteInfoForm({ ...siteInfoForm, contactEmail: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4A3B32] mb-1">Số điện thoại hotline</label>
                    <input
                      type="text"
                      value={siteInfoForm.contactPhone}
                      onChange={(e) => setSiteInfoForm({ ...siteInfoForm, contactPhone: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Địa chỉ trụ sở</label>
                  <input
                    type="text"
                    value={siteInfoForm.address}
                    onChange={(e) => setSiteInfoForm({ ...siteInfoForm, address: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                  />
                </div>
              </div>

              {/* Save CTA */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#8C2320] hover:bg-[#6E1B19] text-white rounded-full text-xs font-bold shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu tất cả cấu hình</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </main>

      {/* MODAL: ADD / EDIT ARTICLE */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-6 animate-scaleUp border border-[#E8DFC8]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
              <h3 className="font-serif-culture text-xl font-bold text-[#2D241E]">
                {editingArticle ? 'Chỉnh sửa bài viết' : 'Soạn bài viết mới'}
              </h3>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#FAF8F5] text-[#7A6B60]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  required
                  value={articleFormData.title}
                  onChange={(e) => setArticleFormData({ ...articleFormData, title: e.target.value })}
                  placeholder="Nhập tiêu đề tin tức, sự kiện..."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Chuyên mục</label>
                  <select
                    value={articleFormData.category}
                    onChange={(e) => setArticleFormData({ ...articleFormData, category: e.target.value as ArticleCategory })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Trạng thái</label>
                  <select
                    value={articleFormData.status}
                    onChange={(e) => setArticleFormData({ ...articleFormData, status: e.target.value as 'Đã đăng' | 'Nháp' })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                  >
                    <option value="Đã đăng">Đã đăng</option>
                    <option value="Nháp">Nháp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Đường dẫn ảnh bìa (Cover Image URL)</label>
                <input
                  type="text"
                  value={articleFormData.coverImage}
                  onChange={(e) => setArticleFormData({ ...articleFormData, coverImage: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tóm tắt ngắn (Excerpt) *</label>
                <textarea
                  rows={2}
                  required
                  value={articleFormData.excerpt}
                  onChange={(e) => setArticleFormData({ ...articleFormData, excerpt: e.target.value })}
                  placeholder="Đoạn tóm tắt nổi bật hiển thị ở danh sách bài viết..."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Nội dung bài viết *</label>
                <textarea
                  rows={6}
                  required
                  value={Array.isArray(articleFormData.content) ? articleFormData.content.join('\n\n') : articleFormData.content}
                  onChange={(e) => setArticleFormData({ ...articleFormData, content: e.target.value.split('\n\n') })}
                  placeholder="Nhập các đoạn nội dung bài viết (cách nhau 2 lần enter)..."
                  className="w-full p-3 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tác giả</label>
                  <input
                    type="text"
                    value={articleFormData.author}
                    onChange={(e) => setArticleFormData({ ...articleFormData, author: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Làn điệu âm thanh đính kèm (nếu có)</label>
                  <input
                    type="text"
                    placeholder="VD: Hát giao duyên: Cây Trúc Xinh"
                    value={articleFormData.audioTitle || ''}
                    onChange={(e) => setArticleFormData({ ...articleFormData, audioTitle: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-5 py-2 rounded-full text-xs font-bold text-[#5C4D44] bg-[#FAF8F5] hover:bg-[#EAE1D2]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#8C2320] hover:bg-[#6E1B19]"
                >
                  {editingArticle ? 'Cập nhật bài viết' : 'Đăng bài viết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT USER */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative space-y-5 animate-scaleUp border border-[#E8DFC8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]">
              <h3 className="font-serif-culture text-xl font-bold text-[#2D241E]">
                {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  placeholder="VD: Trần Văn B"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Email đăng nhập *</label>
                <input
                  type="email"
                  required
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  placeholder="email@machquanho.vn"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={userFormData.phone || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                  placeholder="0912 345 678"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Vai trò</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as AdminUser['role'] })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                  >
                    <option value="Quản trị viên">Quản trị viên</option>
                    <option value="Biên tập viên">Biên tập viên</option>
                    <option value="Cộng tác viên">Cộng tác viên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Trạng thái</label>
                  <select
                    value={userFormData.status}
                    onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value as 'Hoạt động' | 'Khóa' })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                  >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Khóa">Khóa</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-5 py-2 rounded-full text-xs font-bold text-[#5C4D44] bg-[#FAF8F5]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#8C2320]"
                >
                  {editingUser ? 'Cập nhật' : 'Thêm người dùng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative space-y-4 animate-scaleUp border border-[#E8DFC8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]">
              <h3 className="font-serif-culture text-lg font-bold text-[#2D241E]">
                Thêm chuyên mục mới
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-1 text-[#7A6B60]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tên chuyên mục *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Không gian Lễ hội"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Màu sắc đại diện</label>
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-full h-10 p-1 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Mô tả ngắn</label>
                <input
                  type="text"
                  placeholder="Mô tả tóm tắt ý nghĩa chuyên mục..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                />
              </div>

              <div className="pt-3 border-t border-[#E8DFC8] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-1.5 rounded-full text-xs font-bold text-[#5C4D44] bg-[#FAF8F5]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full text-xs font-bold text-white bg-[#8C2320]"
                >
                  Tạo chuyên mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
