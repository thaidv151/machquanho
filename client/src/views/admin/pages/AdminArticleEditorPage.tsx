import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Save, Send, Plus, Check } from 'lucide-react';
import { Article, ArticleCategory, CategoryInfo } from '../../../types';
import { ImageUploader } from '../../../components/ImageUploader';
import Editor from '../../../components/Editor';
import { apiService } from '../../../services/apiService';

interface AdminArticleEditorPageProps {
  editingArticle: Article | null;
  categoriesList: string[];
  isSubmitting: boolean;
  onSave: (articleData: Partial<Article>) => Promise<void>;
  onBack: () => void;
  onCategoryCreated?: (newCategory: CategoryInfo) => void;
}

export const AdminArticleEditorPage: React.FC<AdminArticleEditorPageProps> = ({
  editingArticle,
  categoriesList,
  isSubmitting,
  onSave,
  onBack,
  onCategoryCreated,
}) => {
  const [formData, setFormData] = useState<Partial<Article>>(() => {
    if (editingArticle) {
      return { ...editingArticle };
    }
    return {
      title: '',
      category: 'Sự kiện' as ArticleCategory,
      status: 'Đã đăng',
      excerpt: '',
      content: [''],
      coverImage: '',
      author: 'Ban Biên Tập Mạch Quan Họ',
      authorRole: 'Biên tập viên di sản',
      audioTitle: '',
    };
  });

  // Quick Category Addition State
  const [isAddingQuickCat, setIsAddingQuickCat] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');
  const [isQuickCatSubmitting, setIsQuickCatSubmitting] = useState(false);
  const [localCategories, setLocalCategories] = useState<string[]>(categoriesList);

  useEffect(() => {
    setLocalCategories(categoriesList);
  }, [categoriesList]);

  const handleCreateQuickCategory = async () => {
    if (!quickCatName.trim()) return;
    setIsQuickCatSubmitting(true);
    const catName = quickCatName.trim();
    try {
      const created = await apiService.adminCreateCategory({
        name: catName,
        slug: catName.toLowerCase().replace(/\s+/g, '-'),
        description: 'Chuyên mục tạo nhanh',
        color: '#8C2320',
      });
      if (!localCategories.includes(created.name)) {
        setLocalCategories((prev) => [...prev, created.name]);
      }
      setFormData((prev) => ({ ...prev, category: created.name as ArticleCategory }));
      if (onCategoryCreated) {
        onCategoryCreated(created);
      }
    } catch (err) {
      console.warn('Quick category API error, fallback local creation:', err);
      if (!localCategories.includes(catName)) {
        setLocalCategories((prev) => [...prev, catName]);
      }
      setFormData((prev) => ({ ...prev, category: catName as ArticleCategory }));
    } finally {
      setQuickCatName('');
      setIsAddingQuickCat(false);
      setIsQuickCatSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const editorContent = Array.isArray(formData.content)
    ? formData.content.join('')
    : (formData.content || '');

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col animate-fadeIn">
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5] border-b border-[#E8DFC8] px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-full hover:bg-[#EAE1D2] text-[#4A3B32] transition-colors cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif-culture text-xl font-bold text-[#2D241E]">
              {editingArticle ? 'Chỉnh sửa bài viết' : 'Soạn bài viết mới'}
            </h1>
            <p className="text-xs text-[#7A6B60]">
              {editingArticle ? `ID: ${editingArticle.id} — ${editingArticle.title}` : 'Tạo mới nội dung bài viết tin tức di sản'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-full text-xs font-bold text-[#5C4D44] bg-white border border-[#D9CEBA] hover:bg-[#EAE1D2] transition-colors cursor-pointer"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title?.trim()}
            className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#8C2320] hover:bg-[#6E1B19] flex items-center space-x-2 shadow-sm disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lưu bài...</span>
              </>
            ) : (
              <>
                {editingArticle ? <Save className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                <span>{editingArticle ? 'Cập nhật bài viết' : 'Xuất bản bài viết'}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <form onSubmit={handleSubmit} className="flex-1 p-6 max-w-[1480px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Main Content Editor Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Article Title Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-2">
            <label className="block text-xs font-bold text-[#4A3B32] uppercase tracking-wider">
              Tiêu đề bài viết *
            </label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề tin tức, phóng sự di sản..."
              className="w-full text-lg sm:text-xl font-serif-culture font-bold text-[#2D241E] p-3 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl focus:ring-2 focus:ring-[#8C2320] focus:outline-none"
            />
          </div>

          {/* Article Excerpt */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-2">
            <label className="block text-xs font-bold text-[#4A3B32] uppercase tracking-wider">
              Tóm tắt ngắn nổi bật (Excerpt) *
            </label>
            <textarea
              rows={3}
              required
              value={formData.excerpt || ''}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Nhập đoạn tóm tắt ngắn hiển thị ở danh sách bài viết trang chủ..."
              className="w-full p-3 text-xs sm:text-sm text-[#2D241E] bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl focus:ring-2 focus:ring-[#8C2320] focus:outline-none"
            />
          </div>

          {/* TipTap Rich Text Editor Workspace */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-3">
            <label className="block text-xs font-bold text-[#4A3B32] uppercase tracking-wider">
              Nội dung bài viết chi tiết (TipTap Editor) *
            </label>
            <Editor
              value={editorContent}
              onChange={(val) => setFormData({ ...formData, content: [val] })}
              minHeight={450}
            />
          </div>

        </div>

        {/* Right Settings Sidebar Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Publishing Settings */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
            <h3 className="font-serif-culture font-bold text-sm text-[#2D241E] border-b border-[#EDE5D8] pb-3">
              Cấu hình xuất bản
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#4A3B32]">Chuyên mục bài viết</label>
                <button
                  type="button"
                  onClick={() => setIsAddingQuickCat(!isAddingQuickCat)}
                  className="text-[11px] font-bold text-[#8C2320] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isAddingQuickCat ? 'Đóng' : 'Thêm nhanh'}</span>
                </button>
              </div>

              {isAddingQuickCat ? (
                <div className="p-3 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl space-y-2 animate-fadeIn">
                  <input
                    type="text"
                    value={quickCatName}
                    onChange={(e) => setQuickCatName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateQuickCategory();
                      }
                    }}
                    placeholder="Nhập tên chuyên mục mới..."
                    className="w-full p-2 bg-white border border-[#D9CEBA] rounded-lg text-xs text-[#2D241E] focus:ring-1 focus:ring-[#8C2320]"
                    autoFocus
                  />
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingQuickCat(false)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#7A6B60] hover:bg-[#EAE1D2] rounded-md"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateQuickCategory}
                      disabled={isQuickCatSubmitting || !quickCatName.trim()}
                      className="px-3 py-1 text-[11px] font-bold text-white bg-[#8C2320] hover:bg-[#6E1B19] rounded-md disabled:opacity-50 flex items-center space-x-1 cursor-pointer"
                    >
                      {isQuickCatSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      <span>Tạo & Chọn</span>
                    </button>
                  </div>
                </div>
              ) : (
                <select
                  value={formData.category || 'Sự kiện'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ArticleCategory })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] font-medium focus:ring-2 focus:ring-[#8C2320]"
                >
                  {localCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">Trạng thái phát hành</label>
              <select
                value={formData.status || 'Đã đăng'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Đã đăng' | 'Nháp' })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] font-medium"
              >
                <option value="Đã đăng">Đã xuất bản (Đã đăng)</option>
                <option value="Nháp">Bản nháp (Lưu nháp)</option>
              </select>
            </div>
          </div>

          {/* Cover Image Uploader */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs">
            <ImageUploader
              label="Ảnh bìa bài viết (Cover Image)"
              value={formData.coverImage || ''}
              onChange={(url) => setFormData({ ...formData, coverImage: url })}
              aspectRatio="wide"
            />
          </div>

          {/* Author Details */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
            <h3 className="font-serif-culture font-bold text-sm text-[#2D241E] border-b border-[#EDE5D8] pb-3">
              Tác giả & Âm thanh
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">Tác giả bài viết</label>
              <input
                type="text"
                value={formData.author || ''}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                placeholder="Ban Biên Tập Mạch Quan Họ"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">Làn điệu âm thanh đính kèm (nếu có)</label>
              <input
                type="text"
                value={formData.audioTitle || ''}
                onChange={(e) => setFormData({ ...formData, audioTitle: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                placeholder="VD: Hát giao duyên: Cây Trúc Xinh"
              />
            </div>
          </div>

        </div>

      </form>
    </div>
  );
};
