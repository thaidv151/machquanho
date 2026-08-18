import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { Article, ArticleCategory } from '../../../types';
import { ImageUploader } from '../../../components/ImageUploader';
import Editor from '../../../components/Editor';

interface ArticleFormModalProps {
  isOpen: boolean;
  editingArticle: Article | null;
  articleFormData: Partial<Article>;
  categoriesList: string[];
  isSubmitting: boolean;
  setArticleFormData: React.Dispatch<React.SetStateAction<Partial<Article>>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ArticleFormModal: React.FC<ArticleFormModalProps> = ({
  isOpen,
  editingArticle,
  articleFormData,
  categoriesList,
  isSubmitting,
  setArticleFormData,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-6 animate-scaleUp border border-[#E8DFC8]">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
          <h3 className="font-serif-culture text-xl font-bold text-[#2D241E]">
            {editingArticle ? 'Chỉnh sửa bài viết' : 'Soạn bài viết mới'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FAF8F5] text-[#7A6B60]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tiêu đề bài viết *</label>
            <input
              type="text"
              required
              value={articleFormData.title || ''}
              onChange={(e) => setArticleFormData({ ...articleFormData, title: e.target.value })}
              placeholder="Nhập tiêu đề tin tức, sự kiện..."
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Chuyên mục bài viết</label>
              <select
                value={articleFormData.category || 'Sự kiện'}
                onChange={(e) => setArticleFormData({ ...articleFormData, category: e.target.value as ArticleCategory })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Trạng thái phát hành</label>
              <select
                value={articleFormData.status || 'Đã đăng'}
                onChange={(e) => setArticleFormData({ ...articleFormData, status: e.target.value as 'Đã đăng' | 'Nháp' })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              >
                <option value="Đã đăng">Đã xuất bản (Đã đăng)</option>
                <option value="Nháp">Bản nháp (Lưu nháp)</option>
              </select>
            </div>
          </div>

          <ImageUploader
            label="Ảnh bìa bài viết (Cover Image)"
            value={articleFormData.coverImage || ''}
            onChange={(url) => setArticleFormData({ ...articleFormData, coverImage: url })}
            aspectRatio="wide"
          />

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tóm tắt ngắn (Excerpt) *</label>
            <textarea
              rows={2}
              required
              value={articleFormData.excerpt || ''}
              onChange={(e) => setArticleFormData({ ...articleFormData, excerpt: e.target.value })}
              placeholder="Đoạn tóm tắt nổi bật hiển thị ở danh sách bài viết..."
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Nội dung bài viết *</label>
            <Editor
              value={Array.isArray(articleFormData.content) ? articleFormData.content.join('') : (articleFormData.content || '')}
              onChange={(val) => setArticleFormData({ ...articleFormData, content: [val] })}
              minHeight={260}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tác giả</label>
              <input
                type="text"
                value={articleFormData.author || ''}
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
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-full text-xs font-bold text-[#5C4D44] bg-[#FAF8F5] hover:bg-[#EAE1D2]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#8C2320] hover:bg-[#6E1B19] flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>{editingArticle ? 'Cập nhật bài viết' : 'Đăng bài viết'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
