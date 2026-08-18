import React, { useState, useEffect } from 'react';
import { Article, AdminUser, CategoryInfo, SiteConfig, ViewState, ArticleCategory } from '../types';
import { apiService } from '../services/apiService';
import { ConfirmModal } from '../components/ConfirmModal';
import { Toast, ToastType } from '../components/Toast';
import { CheckCircle } from 'lucide-react';

import { AdminHeader } from './admin/AdminHeader';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminDashboardTab } from './admin/tabs/AdminDashboardTab';
import { AdminArticlesTab } from './admin/tabs/AdminArticlesTab';
import { AdminUsersTab } from './admin/tabs/AdminUsersTab';
import { AdminCategoriesTab } from './admin/tabs/AdminCategoriesTab';
import { AdminBannerTab } from './admin/tabs/AdminBannerTab';
import { AdminHeaderTab } from './admin/tabs/AdminHeaderTab';
import { AdminMenuTab } from './admin/tabs/AdminMenuTab';
import { AdminResearchTab } from './admin/tabs/AdminResearchTab';
import { AdminFooterTab } from './admin/tabs/AdminFooterTab';
import { AdminSeoTab } from './admin/tabs/AdminSeoTab';
import { AdminScriptsTab } from './admin/tabs/AdminScriptsTab';
import { HeaderNavItem, ResearchEntry, SiteFooterConfig, SiteSeoConfig } from '../types';

import { UserFormModal } from './admin/modals/UserFormModal';
import { CategoryFormModal } from './admin/modals/CategoryFormModal';
import { AdminArticleEditorPage } from './admin/pages/AdminArticleEditorPage';
import { AdminResearchEditorPage } from './admin/pages/AdminResearchEditorPage';

interface AdminPortalProps {
  section: 'dashboard' | 'articles' | 'users' | 'categories' | 'banner' | 'header' | 'menus' | 'research' | 'footer' | 'seo' | 'scripts';
  articles: Article[];
  users: AdminUser[];
  categories: CategoryInfo[];
  researchEntries?: ResearchEntry[];
  siteConfig: SiteConfig;
  currentUser?: AdminUser | null;
  onUpdateArticles: (articles: Article[]) => void;
  onUpdateUsers: (users: AdminUser[]) => void;
  onUpdateCategories: (categories: CategoryInfo[]) => void;
  onUpdateResearchEntries?: (entries: ResearchEntry[]) => void;
  onUpdateSiteConfig: (config: SiteConfig) => void;
  onLogout: () => void;
  onNavigate: (view: ViewState) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  section,
  articles,
  users,
  categories,
  researchEntries = [],
  siteConfig,
  currentUser,
  onUpdateArticles,
  onUpdateUsers,
  onUpdateCategories,
  onUpdateResearchEntries = () => {},
  onUpdateSiteConfig,
  onLogout,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'articles' | 'users' | 'categories' | 'banner' | 'header' | 'menus' | 'research' | 'footer' | 'seo' | 'scripts'>(section || 'dashboard');
  const [toastState, setToastState] = useState<{ message: string; type: ToastType } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync activeTab state with URL section prop
  useEffect(() => {
    if (section && section !== activeTab) {
      setActiveTab(section);
    }
  }, [section]);

  // Toast Helper
  const showToast = (msg: string, type: ToastType = 'success') => {
    setToastState({ message: msg, type });
  };

  // Custom Confirm Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => Promise<void> | void;
    isLoading?: boolean;
  }>({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  const requestConfirm = (message: string, onConfirm: () => Promise<void> | void, title = 'Xác nhận xóa') => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm,
      isLoading: false,
    });
  };

  const handleConfirmExecute = async () => {
    setConfirmState(prev => ({ ...prev, isLoading: true }));
    try {
      await confirmState.onConfirm();
    } finally {
      setConfirmState(prev => ({ ...prev, isOpen: false, isLoading: false }));
    }
  };

  // Article State & Handlers
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
    author: currentUser?.name || 'Ban biên tập Mạch Quan Họ',
    authorRole: 'Biên tập viên',
    status: 'Đã đăng',
    tags: ['Quan họ', 'Kinh Bắc'],
    readTime: '4 phút đọc'
  });

  // Full Page Editor State
  const [editorView, setEditorView] = useState<{
    type: 'none' | 'article' | 'research';
    editingItem?: any;
  }>({ type: 'none' });

  const categoriesList = categories.map(c => c.name);

  const handleOpenNewArticle = () => {
    setEditorView({ type: 'article', editingItem: null });
  };

  const handleOpenEditArticle = (art: Article) => {
    setEditorView({ type: 'article', editingItem: art });
  };

  const handleSaveArticleFromEditor = async (formData: Partial<Article>) => {
    setIsSubmitting(true);
    try {
      if (formData.id) {
        await apiService.adminUpdateArticle(formData.id, formData);
        showToast('Cập nhật bài viết thành công!', 'success');
      } else {
        await apiService.adminCreateArticle(formData);
        showToast('Thêm bài viết mới thành công!', 'success');
      }
      const refreshed = await apiService.adminGetArticles();
      onUpdateArticles(refreshed);
      setEditorView({ type: 'none' });
    } catch (err: any) {
      console.error('Save article error:', err);
      showToast(err?.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenNewResearch = () => {
    setEditorView({ type: 'research', editingItem: null });
  };

  const handleOpenEditResearch = (entry: ResearchEntry) => {
    setEditorView({ type: 'research', editingItem: entry });
  };

  const handleSaveResearchFromEditor = async (formData: Partial<ResearchEntry>) => {
    setIsSubmitting(true);
    try {
      if (formData.id) {
        await apiService.adminUpdateResearchEntry(formData.id, formData);
        showToast('Cập nhật ghi chép nghiên cứu thành công!', 'success');
      } else {
        await apiService.adminCreateResearchEntry(formData);
        showToast('Tạo mới ghi chép nghiên cứu thành công!', 'success');
      }
      const refreshed = await apiService.adminGetResearchEntries();
      onUpdateResearchEntries(refreshed);
      setEditorView({ type: 'none' });
    } catch (err: any) {
      console.error('Save research error:', err);
      showToast(err?.response?.data?.message || 'Có lỗi xảy ra khi lưu nhật ký', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = (id: string) => {
    requestConfirm('Bạn có chắc chắn muốn xóa bài viết này?', async () => {
      try {
        await apiService.adminDeleteArticle(id);
        const refreshed = await apiService.adminGetArticles();
        onUpdateArticles(refreshed);
        showToast('Đã xóa bài viết.');
      } catch (err) {
        console.error('Delete article error:', err);
        showToast('Lỗi khi xóa bài viết.', 'error');
      }
    }, 'Xác nhận xóa bài viết');
  };

  const handleToggleArticleStatus = async (art: Article) => {
    const nextStatus = art.status === 'Đã đăng' ? 'Nháp' : 'Đã đăng';
    try {
      await apiService.adminUpdateArticle(art.id, { status: nextStatus });
      const refreshed = await apiService.adminGetArticles();
      onUpdateArticles(refreshed);
      showToast(`Đã chuyển trạng thái bài viết thành: ${nextStatus}`);
    } catch (err) {
      console.error('Toggle status error:', err);
      showToast('Lỗi khi cập nhật trạng thái.', 'error');
    }
  };

  // User State & Handlers
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

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.name?.trim() || !userFormData.email?.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingUser) {
        await apiService.adminUpdateUser(editingUser.id, userFormData);
        showToast('Đã cập nhật người dùng!');
      } else {
        await apiService.adminCreateUser(userFormData);
        showToast('Đã thêm người dùng mới!');
      }
      const refreshed = await apiService.adminGetUsers();
      onUpdateUsers(refreshed);
      setIsUserModalOpen(false);
    } catch (err) {
      console.error('Save user error:', err);
      showToast('Lỗi khi lưu thông tin người dùng.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleUserStatus = async (usr: AdminUser) => {
    const nextStatus = usr.status === 'Hoạt động' ? 'Khóa' : 'Hoạt động';
    try {
      await apiService.adminUpdateUser(usr.id, { status: nextStatus });
      const refreshed = await apiService.adminGetUsers();
      onUpdateUsers(refreshed);
      showToast(`Đã chuyển trạng thái người dùng thành: ${nextStatus}`);
    } catch (err) {
      console.error('Toggle user status error:', err);
      showToast('Lỗi khi cập nhật trạng thái người dùng.', 'error');
    }
  };

  const handleDeleteUser = (id: string) => {
    requestConfirm('Bạn có chắc chắn muốn xóa tài khoản người dùng này?', async () => {
      try {
        await apiService.adminDeleteUser(id);
        const refreshed = await apiService.adminGetUsers();
        onUpdateUsers(refreshed);
        showToast('Đã xóa người dùng.');
      } catch (err) {
        console.error('Delete user error:', err);
        showToast('Lỗi khi xóa tài khoản.', 'error');
      }
    }, 'Xác nhận xóa người dùng');
  };

  // Category State & Handlers
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#8C2320');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsSubmitting(true);
    try {
      await apiService.adminCreateCategory({
        name: newCatName as ArticleCategory,
        slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
        color: newCatColor,
        description: newCatDesc || 'Chuyên mục mới'
      });
      const refreshed = await apiService.adminGetCategories();
      onUpdateCategories(refreshed);
      setNewCatName('');
      setNewCatDesc('');
      setIsCategoryModalOpen(false);
      showToast('Đã thêm chuyên mục mới!');
    } catch (err) {
      console.error('Add category error:', err);
      showToast('Lỗi khi thêm chuyên mục.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    requestConfirm('Bạn có chắc chắn muốn xóa chuyên mục này?', async () => {
      try {
        await apiService.adminDeleteCategory(id);
        const refreshed = await apiService.adminGetCategories();
        onUpdateCategories(refreshed);
        showToast('Đã xóa chuyên mục.');
      } catch (err) {
        console.error('Delete category error:', err);
        showToast('Lỗi khi xóa chuyên mục.', 'error');
      }
    }, 'Xác nhận xóa chuyên mục');
  };

  // Banner State & Handlers
  const [bannerForm, setBannerForm] = useState(siteConfig.banner);
  const [siteInfoForm, setSiteInfoForm] = useState({
    siteName: siteConfig.siteName,
    logoText: siteConfig.logoText,
    logoSubtext: siteConfig.logoSubtext,
    contactEmail: siteConfig.contactEmail,
    contactPhone: siteConfig.contactPhone,
    address: siteConfig.address
  });

  useEffect(() => {
    if (siteConfig.banner) {
      setBannerForm(siteConfig.banner);
    }
    setSiteInfoForm({
      siteName: siteConfig.siteName || 'MẠCH QUAN HỌ',
      logoText: siteConfig.logoText || 'MẠCH QUAN HỌ',
      logoSubtext: siteConfig.logoSubtext || 'Kinh Bắc Di Sản',
      contactEmail: siteConfig.contactEmail || '',
      contactPhone: siteConfig.contactPhone || '',
      address: siteConfig.address || ''
    });
  }, [siteConfig]);

  const handleSaveBannerAndSiteConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updated = await apiService.adminUpdateSiteConfig({
        ...siteConfig,
        siteName: siteInfoForm.siteName,
        logoText: siteInfoForm.logoText,
        logoSubtext: siteInfoForm.logoSubtext,
        contactEmail: siteInfoForm.contactEmail,
        contactPhone: siteInfoForm.contactPhone,
        address: siteInfoForm.address,
        banner: bannerForm
      });
      onUpdateSiteConfig(updated);
      showToast('Đã lưu thay đổi cấu hình!');
    } catch (err) {
      console.error('Save site config error:', err);
      showToast('Lỗi khi cập nhật cấu hình website.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveHeaderConfig = async (
    updatedHeaderNotice: { topNoticeText: string; topSubText: string; topAudioCtaText: string },
    logoSettings: { logoType: 'text' | 'image'; logoText: string; logoSubtext: string; logoImageUrl?: string }
  ) => {
    setIsSubmitting(true);
    try {
      const updated = await apiService.adminUpdateSiteConfig({
        ...siteConfig,
        logoType: logoSettings.logoType,
        logoText: logoSettings.logoText,
        logoSubtext: logoSettings.logoSubtext,
        logoImageUrl: logoSettings.logoImageUrl,
        header: {
          ...siteConfig.header,
          ...updatedHeaderNotice,
        }
      });
      onUpdateSiteConfig(updated);
      showToast('Đã lưu thay đổi Header & Logo!');
    } catch (err) {
      console.error('Save header config error:', err);
      showToast('Lỗi khi cập nhật cấu hình Header.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveMenuNavItems = async (navItems: HeaderNavItem[]) => {
    setIsSubmitting(true);
    try {
      const updated = await apiService.adminUpdateSiteConfig({
        ...siteConfig,
        header: {
          ...siteConfig.header,
          navItems,
        }
      });
      onUpdateSiteConfig(updated);
      showToast('Đã lưu danh sách Menu Navigation!');
    } catch (err) {
      console.error('Save menu config error:', err);
      showToast('Lỗi khi cập nhật danh sách Menu.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Lists
  const filteredArticles = articles.filter(a => {
    const matchesCat = articleCategoryFilter === 'Tất cả' || a.category === articleCategoryFilter;
    const matchesStatus = articleStatusFilter === 'Tất cả' || a.status === articleStatusFilter;
    const matchesSearch = !articleSearch.trim() || 
      a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.author.toLowerCase().includes(articleSearch.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const filteredUsers = users.filter(u => {
    const matchesRole = userRoleFilter === 'Tất cả' || u.role === userRoleFilter;
    const matchesSearch = !userSearch.trim() || 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleSaveFooterConfig = async (newFooterConfig: SiteFooterConfig) => {
    setIsSubmitting(true);
    try {
      const updatedConfig = {
        ...siteConfig,
        footer: newFooterConfig,
      };
      await apiService.adminUpdateSiteConfig(updatedConfig);
      onUpdateSiteConfig(updatedConfig);
      showToast('Cập nhật cấu hình Chân trang thành công!', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Có lỗi xảy ra khi lưu cấu hình Chân trang!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSeoConfig = async (newSeoConfig: SiteSeoConfig) => {
    setIsSubmitting(true);
    try {
      const updatedConfig = {
        ...siteConfig,
        seo: newSeoConfig,
      };
      await apiService.adminUpdateSiteConfig(updatedConfig);
      onUpdateSiteConfig(updatedConfig);
      showToast('Cập nhật cấu hình SEO & Scripts thành công!', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Có lỗi xảy ra khi lưu cấu hình SEO!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (editorView.type === 'article') {
    return (
      <AdminArticleEditorPage
        editingArticle={editorView.editingItem}
        categoriesList={categoriesList}
        isSubmitting={isSubmitting}
        onSave={handleSaveArticleFromEditor}
        onBack={() => setEditorView({ type: 'none' })}
        onCategoryCreated={(newCat) => onUpdateCategories([...categories, newCat])}
      />
    );
  }

  if (editorView.type === 'research') {
    return (
      <AdminResearchEditorPage
        editingEntry={editorView.editingItem}
        isSubmitting={isSubmitting}
        onSave={handleSaveResearchFromEditor}
        onBack={() => setEditorView({ type: 'none' })}
      />
    );
  }

  return (
    <div id="admin-portal-root" className="min-h-screen bg-[#F1EDE8] flex flex-col lg:flex-row">
      
      {/* Left Sidebar Component */}
      <AdminSidebar
        activeTab={activeTab}
        articlesCount={articles.length}
        usersCount={users.length}
        categoriesCount={categories.length}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          onNavigate({ type: 'admin', section: tab });
        }}
        onNavigate={onNavigate}
      />

      {/* Main Admin Workspace Area with Top Header Nav */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-hidden">
        
        {/* Top Header Component */}
        <AdminHeader
          activeTab={activeTab}
          currentUser={currentUser}
          onLogout={onLogout}
        />

        {/* Content Workspace Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <AdminDashboardTab
              articles={articles}
              users={users}
              onOpenNewArticle={handleOpenNewArticle}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                onNavigate({ type: 'admin', section: tab });
              }}
            />
          )}

          {activeTab === 'articles' && (
            <AdminArticlesTab
              articles={articles}
              filteredArticles={filteredArticles}
              articleSearch={articleSearch}
              articleCategoryFilter={articleCategoryFilter}
              articleStatusFilter={articleStatusFilter}
              categoriesList={categoriesList}
              setArticleSearch={setArticleSearch}
              setArticleCategoryFilter={setArticleCategoryFilter}
              setArticleStatusFilter={setArticleStatusFilter}
              onOpenNewArticle={handleOpenNewArticle}
              onOpenEditArticle={handleOpenEditArticle}
              onDeleteArticle={handleDeleteArticle}
              onToggleArticleStatus={handleToggleArticleStatus}
              onNavigate={onNavigate}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsersTab
              users={users}
              filteredUsers={filteredUsers}
              userSearch={userSearch}
              userRoleFilter={userRoleFilter}
              setUserSearch={setUserSearch}
              setUserRoleFilter={setUserRoleFilter}
              onOpenNewUser={handleOpenNewUser}
              onOpenEditUser={handleOpenEditUser}
              onDeleteUser={handleDeleteUser}
              onToggleUserStatus={handleToggleUserStatus}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategoriesTab
              categories={categories}
              onOpenAddCategory={() => setIsCategoryModalOpen(true)}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {activeTab === 'banner' && (
            <AdminBannerTab
              bannerForm={bannerForm}
              siteInfoForm={siteInfoForm}
              isSubmitting={isSubmitting}
              setBannerForm={setBannerForm}
              setSiteInfoForm={setSiteInfoForm}
              onSubmit={handleSaveBannerAndSiteConfig}
            />
          )}

          {activeTab === 'header' && (
            <AdminHeaderTab
              siteConfig={siteConfig}
              isSubmitting={isSubmitting}
              onSaveHeaderConfig={handleSaveHeaderConfig}
            />
          )}

          {activeTab === 'menus' && (
            <AdminMenuTab
              siteConfig={siteConfig}
              isSubmitting={isSubmitting}
              onSaveMenuConfig={handleSaveMenuNavItems}
            />
          )}

          {activeTab === 'research' && (
            <AdminResearchTab
              researchEntries={researchEntries}
              onUpdateResearchEntries={onUpdateResearchEntries}
              onOpenNewResearch={handleOpenNewResearch}
              onOpenEditResearch={handleOpenEditResearch}
              showToast={showToast}
              onRequestConfirm={(opts) => setConfirmState({ isOpen: true, ...opts })}
            />
          )}

          {activeTab === 'footer' && (
            <AdminFooterTab
              siteConfig={siteConfig}
              isSubmitting={isSubmitting}
              onSaveFooterConfig={handleSaveFooterConfig}
            />
          )}

          {activeTab === 'seo' && (
            <AdminSeoTab
              siteConfig={siteConfig}
              isSubmitting={isSubmitting}
              onSaveSeoConfig={handleSaveSeoConfig}
            />
          )}

          {activeTab === 'scripts' && (
            <AdminScriptsTab
              siteConfig={siteConfig}
              isSubmitting={isSubmitting}
              onSaveSeoConfig={handleSaveSeoConfig}
            />
          )}
        </main>
      </div>

      {/* Modals */}

      <UserFormModal
        isOpen={isUserModalOpen}
        editingUser={editingUser}
        userFormData={userFormData}
        isSubmitting={isSubmitting}
        setUserFormData={setUserFormData}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={handleSaveUser}
      />

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        newCatName={newCatName}
        newCatColor={newCatColor}
        newCatDesc={newCatDesc}
        isSubmitting={isSubmitting}
        setNewCatName={setNewCatName}
        setNewCatColor={setNewCatColor}
        setNewCatDesc={setNewCatDesc}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleAddCategory}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        isLoading={confirmState.isLoading}
        onConfirm={handleConfirmExecute}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />

      {toastState && (
        <Toast
          type={toastState.type}
          message={toastState.message}
          onClose={() => setToastState(null)}
        />
      )}

    </div>
  );
};
