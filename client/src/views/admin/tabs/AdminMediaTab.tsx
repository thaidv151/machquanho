import React, { useState, useEffect } from 'react';
import { 
  Music, Headphones, Plus, Edit, Trash2, Search, Filter, FolderPlus, 
  RefreshCw, Star, X, CheckCircle2
} from 'lucide-react';
import { MediaCategory, MediaPost } from '../../../types';
import { apiService } from '../../../services/apiService';
import { ImageUploader } from '../../../components/ImageUploader';
import { MediaUploader } from '../../../components/MediaUploader';
import { ToastType } from '../../../components/Toast';

interface AdminMediaTabProps {
  showToast: (msg: string, type?: ToastType) => void;
  setConfirmState: (state: any) => void;
}

export const AdminMediaTab: React.FC<AdminMediaTabProps> = ({
  showToast,
  setConfirmState,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'categories'>('posts');
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Modal Post State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<MediaPost | null>(null);
  const [postFormData, setPostFormData] = useState<{
    category_id: string;
    title: string;
    sub_title: string;
    description: string;
    content: string;
    media_type: 'audio' | 'video';
    media_url: string;
    thumbnail_url: string;
    duration: string;
    is_featured: boolean;
    status: 'published' | 'draft';
  }>({
    category_id: '1',
    title: '',
    sub_title: '',
    description: '',
    content: '',
    media_type: 'audio',
    media_url: '',
    thumbnail_url: '',
    duration: '04:00',
    is_featured: false,
    status: 'published',
  });

  // Modal Category State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MediaCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<{
    name: string;
    description: string;
    order_index: number;
    is_active: boolean;
  }>({
    name: '',
    description: '',
    order_index: 0,
    is_active: true,
  });

  const [submitting, setSubmitting] = useState(false);

  // Load Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [catsData, postsData] = await Promise.all([
        apiService.adminGetMediaCategories(),
        apiService.adminGetMediaPosts(),
      ]);
      setCategories(catsData);
      setPosts(postsData);

      if (catsData.length > 0) {
        setPostFormData(prev => ({ ...prev, category_id: String(catsData[0].id) }));
      }
    } catch (err) {
      console.error('Failed to load media admin data:', err);
      showToast('Lỗi khi tải dữ liệu Nghe Quan Họ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Posts
  const filteredPosts = posts.filter(p => {
    const matchesSearch = !searchQuery.trim() || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subTitle && p.subTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCat = selectedCategoryFilter === 'all' || String(p.categoryId) === String(selectedCategoryFilter);
    return matchesSearch && matchesCat;
  });

  // --- Handlers for Posts ---
  const handleOpenCreatePost = () => {
    setEditingPost(null);
    setPostFormData({
      category_id: categories[0] ? String(categories[0].id) : '1',
      title: '',
      sub_title: '',
      description: '',
      content: '',
      media_type: 'audio',
      media_url: '',
      thumbnail_url: '',
      duration: '04:00',
      is_featured: false,
      status: 'published',
    });
    setIsPostModalOpen(true);
  };

  const handleOpenEditPost = (post: MediaPost) => {
    setEditingPost(post);
    setPostFormData({
      category_id: String(post.categoryId),
      title: post.title,
      sub_title: post.subTitle || '',
      description: post.description || '',
      content: post.content || '',
      media_type: post.mediaType === 'video' ? 'video' : 'audio',
      media_url: post.mediaUrl || '',
      thumbnail_url: post.thumbnailUrl || '',
      duration: post.duration || '04:00',
      is_featured: post.isFeatured || false,
      status: post.status === 'draft' ? 'draft' : 'published',
    });
    setIsPostModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postFormData.title.trim()) {
      showToast('Vui lòng nhập tên bài nhạc / podcast', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingPost) {
        await apiService.adminUpdateMediaPost(editingPost.id, postFormData);
        showToast('Cập nhật bài Nghe Quan Họ thành công!', 'success');
      } else {
        await apiService.adminCreateMediaPost(postFormData);
        showToast('Tạo bài Nghe Quan Họ mới thành công!', 'success');
      }
      setIsPostModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error('Failed to save media post:', err);
      showToast(err.message || 'Thao tác thất bại!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = (post: MediaPost) => {
    setConfirmState({
      isOpen: true,
      title: 'Xóa bài Nghe Quan Họ',
      message: `Bạn có chắc chắn muốn xóa bài "${post.title}"? Thao tác này không thể hoàn tác.`,
      confirmText: 'Xóa bài',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await apiService.adminDeleteMediaPost(post.id);
          showToast('Đã xóa bài Nghe Quan Họ thành công!', 'success');
          fetchData();
        } catch (err: any) {
          showToast('Lỗi khi xóa bài: ' + err.message, 'error');
        }
      },
    });
  };

  // --- Handlers for Categories ---
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: '',
      description: '',
      order_index: categories.length + 1,
      is_active: true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: MediaCategory) => {
    setEditingCategory(cat);
    setCategoryFormData({
      name: cat.name,
      description: cat.description || '',
      order_index: cat.orderIndex || 0,
      is_active: cat.isActive ?? true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      showToast('Vui lòng nhập tên danh mục', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        await apiService.adminUpdateMediaCategory(editingCategory.id, categoryFormData);
        showToast('Cập nhật danh mục thành công!', 'success');
      } else {
        await apiService.adminCreateMediaCategory(categoryFormData);
        showToast('Tạo danh mục mới thành công!', 'success');
      }
      setIsCategoryModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error('Failed to save category:', err);
      showToast(err.message || 'Thao tác thất bại!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = (cat: MediaCategory) => {
    setConfirmState({
      isOpen: true,
      title: 'Xóa danh mục Media',
      message: `Bạn có chắc chắn muốn xóa danh mục "${cat.name}"? Các bài nghe liên quan có thể bị ảnh hưởng.`,
      confirmText: 'Xóa danh mục',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await apiService.adminDeleteMediaCategory(cat.id);
          showToast('Đã xóa danh mục media!', 'success');
          fetchData();
        } catch (err: any) {
          showToast('Lỗi khi xóa danh mục: ' + err.message, 'error');
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#FAF8F5] border border-[#E8DFC8] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#114D3A] text-white flex items-center justify-center shadow-md">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif-culture font-bold text-[#1C1412]">
                Quản lý Nội dung "Nghe Quan Họ"
              </h2>
              <p className="text-xs text-[#7A6B60] mt-0.5">
                Quản lý bài hát, câu chuyện, podcast, video clip và các danh mục nghe Quan họ Kinh Bắc
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={fetchData}
            className="p-2.5 bg-white border border-[#D9CEBA] text-[#7A6B60] hover:text-[#1C1412] rounded-xl hover:bg-[#F2E9DD] transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          {activeSubTab === 'posts' ? (
            <button
              onClick={handleOpenCreatePost}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Bài Nghe / Video</span>
            </button>
          ) : (
            <button
              onClick={handleOpenCreateCategory}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-[#114D3A] hover:bg-[#0B3528] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center space-x-2"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Thêm Danh Mục Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex items-center space-x-2 border-b border-[#E8DFC8] pb-1">
        <button
          onClick={() => setActiveSubTab('posts')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center space-x-2 border-b-2 ${
            activeSubTab === 'posts'
              ? 'border-[#8C2320] text-[#8C2320] bg-[#FAF8F5]'
              : 'border-transparent text-[#7A6B60] hover:text-[#1C1412]'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Bài hát & Podcast ({posts.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('categories')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer flex items-center space-x-2 border-b-2 ${
            activeSubTab === 'categories'
              ? 'border-[#114D3A] text-[#114D3A] bg-[#FAF8F5]'
              : 'border-transparent text-[#7A6B60] hover:text-[#1C1412]'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Danh mục Nghe ({categories.length})</span>
        </button>
      </div>

      {/* --- TAB 1: MEDIA POSTS MANAGEMENT --- */}
      {activeSubTab === 'posts' && (
        <div className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DFC8]">
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6B50]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tiêu đề, nghệ nhân..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9CEBA] rounded-lg text-xs text-[#1C1412] focus:ring-2 focus:ring-[#8C2320]"
              />
            </div>
            <div className="md:col-span-4 flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#8C6B50] shrink-0" />
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full py-2 px-3 bg-white border border-[#D9CEBA] rounded-lg text-xs text-[#1C1412] focus:ring-2 focus:ring-[#8C2320]"
              >
                <option value="all">Tất cả danh mục ({posts.length})</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Table */}
          {loading ? (
            <div className="py-12 text-center text-xs font-semibold text-[#8C6B50]">
              Đang tải danh sách bài media...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white border border-[#E8DFC8] rounded-2xl p-12 text-center text-xs text-[#7A6B60]">
              Không tìm thấy bài nghe / video nào phù hợp.
            </div>
          ) : (
            <div className="bg-white border border-[#E8DFC8] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#4A3B32] border-b border-[#E8DFC8]">
                      <th className="py-3 px-4">Bài Nghe / Video</th>
                      <th className="py-3 px-4">Danh mục</th>
                      <th className="py-3 px-4">Loại / Thời lượng</th>
                      <th className="py-3 px-4 text-center">Nổi bật</th>
                      <th className="py-3 px-4 text-center">Lượt nghe</th>
                      <th className="py-3 px-4 text-center">Trạng thái</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFC8] text-xs">
                    {filteredPosts.map((post) => {
                      const catName = categories.find(c => String(c.id) === String(post.categoryId))?.name || post.categoryName || 'Khác';
                      return (
                        <tr key={post.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-xl bg-[#1C1412] overflow-hidden shrink-0 relative border border-[#D9CEBA]">
                                {post.thumbnailUrl ? (
                                  <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#D4A25A]">
                                    <Music className="w-5 h-5" />
                                  </div>
                                )}
                                {post.mediaType === 'video' && (
                                  <span className="absolute bottom-0.5 right-0.5 bg-red-600 text-white p-0.5 rounded-md text-[9px] font-bold">
                                    YT
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-[#1C1412] truncate max-w-xs">{post.title}</h4>
                                {post.subTitle && (
                                  <p className="text-[11px] text-[#8C6B50] truncate max-w-xs mt-0.5">
                                    {post.subTitle}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 bg-[#114D3A]/10 text-[#114D3A] rounded-full text-[11px] font-bold">
                              {catName}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#7A6B60]">
                            <div className="flex items-center space-x-1.5">
                              {post.mediaType === 'video' ? (
                                <span className="text-red-600 font-semibold">Video YouTube</span>
                              ) : (
                                <span className="text-[#114D3A] font-semibold">Audio MP3</span>
                              )}
                              <span>•</span>
                              <span>{post.duration || '04:00'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {post.isFeatured ? (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[10.5px] font-bold">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span>Nổi bật</span>
                              </span>
                            ) : (
                              <span className="text-[#A8988B] text-[11px]">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-[#8C2320]">
                            {post.playCount || 0}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {post.status === 'draft' ? (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10.5px] font-bold">
                                Bản nháp
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10.5px] font-bold">
                                Đã phát
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleOpenEditPost(post)}
                                className="p-1.5 bg-[#FAF8F5] border border-[#D9CEBA] hover:bg-[#8C2320] hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="Sửa"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePost(post)}
                                className="p-1.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="Xóa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: MEDIA CATEGORIES MANAGEMENT --- */}
      {activeSubTab === 'categories' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E8DFC8] rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-[#FAF8F5] border-b border-[#E8DFC8] flex items-center justify-between">
              <h3 className="font-serif-culture font-bold text-sm text-[#1C1412]">
                Danh sách Danh mục Nghe Quan Họ
              </h3>
              <p className="text-xs text-[#7A6B60]">
                Các danh mục hiển thị dưới dạng Tab switcher ở giao diện client `/nghe-quan-ho`
              </p>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] text-[11px] font-bold uppercase tracking-wider text-[#4A3B32] border-b border-[#E8DFC8]">
                  <th className="py-3 px-4">STT / Thứ tự</th>
                  <th className="py-3 px-4">Tên danh mục</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Mô tả</th>
                  <th className="py-3 px-4 text-center">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFC8] text-xs">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#8C2320]">
                      #{cat.orderIndex || 0}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1C1412]">
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#8C6B50]">
                      {cat.slug}
                    </td>
                    <td className="py-3 px-4 text-[#7A6B60]">
                      {cat.description || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {cat.isActive ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10.5px] font-bold">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10.5px] font-bold">
                          Ẩn
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditCategory(cat)}
                          className="p-1.5 bg-[#FAF8F5] border border-[#D9CEBA] hover:bg-[#114D3A] hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* --- MODAL FORM POST (Create / Edit) --- */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#E8DFC8] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="bg-[#FAF8F5] p-5 border-b border-[#E8DFC8] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Music className="w-5 h-5 text-[#8C2320]" />
                <h3 className="font-serif-culture font-bold text-base text-[#1C1412]">
                  {editingPost ? 'Chỉnh Sửa Bài Nghe / Video' : 'Thêm Bài Nghe / Podcast / Video Mới'}
                </h3>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1 text-[#8C6B50] hover:text-[#1C1412] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tên Bài Nghe / Tiêu đề *</label>
                  <input
                    type="text"
                    required
                    value={postFormData.title}
                    onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
                    placeholder="VD: Hát giao duyên: Khách Đến Chơi Nhà"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#1C1412] focus:ring-2 focus:ring-[#8C2320]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Danh mục *</label>
                  <select
                    value={postFormData.category_id}
                    onChange={(e) => setPostFormData({ ...postFormData, category_id: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#1C1412] focus:ring-2 focus:ring-[#8C2320]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Nghệ nhân / Ca sĩ thể hiện</label>
                  <input
                    type="text"
                    value={postFormData.sub_title}
                    onChange={(e) => setPostFormData({ ...postFormData, sub_title: e.target.value })}
                    placeholder="VD: NNƯT. Tạ Thị Hình & Liền anh Trọng Quý"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#1C1412] focus:ring-2 focus:ring-[#8C2320]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Thời lượng</label>
                  <input
                    type="text"
                    value={postFormData.duration}
                    onChange={(e) => setPostFormData({ ...postFormData, duration: e.target.value })}
                    placeholder="VD: 04:15"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#1C1412] focus:ring-2 focus:ring-[#8C2320]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Định dạng Media</label>
                <select
                  value={postFormData.media_type}
                  onChange={(e) => setPostFormData({ ...postFormData, media_type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#1C1412] focus:ring-2 focus:ring-[#8C2320]"
                >
                  <option value="audio">Audio MP3 / Bản ghi âm</option>
                  <option value="video">Video YouTube / Tệp Video (MP4)</option>
                </select>
              </div>

              {/* Direct File & Link Media Uploader */}
              <MediaUploader
                value={postFormData.media_url}
                onChange={(url) => setPostFormData({ ...postFormData, media_url: url })}
                mediaType={postFormData.media_type}
                label={postFormData.media_type === 'video' ? 'File Video hoặc Link YouTube' : 'File Bản ghi âm / Audio (MP3/WAV)'}
                maxAudioSizeMB={50}
                maxVideoSizeMB={100}
              />

              {/* Cover / Thumbnail Image Uploader */}
              <ImageUploader
                value={postFormData.thumbnail_url}
                onChange={(url) => setPostFormData({ ...postFormData, thumbnail_url: url })}
                label="Ảnh bìa / Thumbnail đại diện"
                aspectRatio="wide"
              />

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tóm tắt / Lời dẫn ngắn</label>
                <textarea
                  rows={2}
                  value={postFormData.description}
                  onChange={(e) => setPostFormData({ ...postFormData, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn nội dung bài hát hoặc câu chuyện..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#1C1412] focus:ring-2 focus:ring-[#8C2320]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Lời bài hát / Nội dung chi tiết</label>
                <textarea
                  rows={4}
                  value={postFormData.content}
                  onChange={(e) => setPostFormData({ ...postFormData, content: e.target.value })}
                  placeholder="Nhập lời bài hát đầy đủ hoặc nội dung ghi âm..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#1C1412] focus:ring-2 focus:ring-[#8C2320]"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs font-bold text-[#4A3B32] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={postFormData.is_featured}
                    onChange={(e) => setPostFormData({ ...postFormData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-[#8C2320] rounded border-[#D9CEBA]"
                  />
                  <span>Đặt làm Nổi bật hôm nay (Podcast Banner)</span>
                </label>

                <div className="flex items-center space-x-3 text-xs font-bold text-[#4A3B32]">
                  <span>Trạng thái:</span>
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={postFormData.status === 'published'}
                      onChange={() => setPostFormData({ ...postFormData, status: 'published' })}
                      className="text-[#8C2320]"
                    />
                    <span>Xuất bản</span>
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={postFormData.status === 'draft'}
                      onChange={() => setPostFormData({ ...postFormData, status: 'draft' })}
                      className="text-[#8C2320]"
                    />
                    <span>Bản nháp</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#E8DFC8] text-[#4A3B32] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingPost ? 'Lưu cập nhật' : 'Tạo mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL FORM CATEGORY (Create / Edit) --- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E8DFC8] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-[#FAF8F5] p-5 border-b border-[#E8DFC8] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FolderPlus className="w-5 h-5 text-[#114D3A]" />
                <h3 className="font-serif-culture font-bold text-base text-[#1C1412]">
                  {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Media Mới'}
                </h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-[#8C6B50] hover:text-[#1C1412] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tên Danh mục *</label>
                <input
                  type="text"
                  required
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  placeholder="VD: Nghe bài Quan họ, 60 giây thấu Quan họ..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#1C1412] focus:ring-2 focus:ring-[#114D3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Mô tả danh mục</label>
                <textarea
                  rows={3}
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn mục đích sử dụng..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#1C1412] focus:ring-2 focus:ring-[#114D3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Thứ tự hiển thị (Order)</label>
                  <input
                    type="number"
                    value={categoryFormData.order_index}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, order_index: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#1C1412] focus:ring-2 focus:ring-[#114D3A]"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 text-xs font-bold text-[#4A3B32] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryFormData.is_active}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, is_active: e.target.checked })}
                      className="w-4 h-4 text-[#114D3A] rounded border-[#D9CEBA]"
                    />
                    <span>Kích hoạt</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#E8DFC8] text-[#4A3B32] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#114D3A] hover:bg-[#0B3528] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingCategory ? 'Lưu cập nhật' : 'Tạo danh mục'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
