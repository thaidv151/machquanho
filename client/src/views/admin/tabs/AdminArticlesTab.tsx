import React from 'react';
import { Plus, Search, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Article, ViewState } from '../../../types';

interface AdminArticlesTabProps {
  articles: Article[];
  filteredArticles: Article[];
  articleSearch: string;
  articleCategoryFilter: string;
  articleStatusFilter: string;
  categoriesList: string[];
  setArticleSearch: (val: string) => void;
  setArticleCategoryFilter: (val: string) => void;
  setArticleStatusFilter: (val: string) => void;
  onOpenNewArticle: () => void;
  onOpenEditArticle: (art: Article) => void;
  onDeleteArticle: (id: string) => void;
  onToggleArticleStatus: (art: Article) => void;
  onNavigate: (view: ViewState) => void;
}

export const AdminArticlesTab: React.FC<AdminArticlesTabProps> = ({
  articles,
  filteredArticles,
  articleSearch,
  articleCategoryFilter,
  articleStatusFilter,
  categoriesList,
  setArticleSearch,
  setArticleCategoryFilter,
  setArticleStatusFilter,
  onOpenNewArticle,
  onOpenEditArticle,
  onDeleteArticle,
  onToggleArticleStatus,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-culture text-2xl font-bold text-[#2D241E]">
            Quản lý tin bài & Phóng sự
          </h2>
          <p className="text-xs text-[#7A6B60] mt-1">
            Tổng cộng <span className="font-bold text-[#8C2320]">{articles.length}</span> bài viết trong hệ thống
          </p>
        </div>
        <button
          onClick={onOpenNewArticle}
          className="px-5 py-2.5 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-full shadow-md flex items-center justify-center space-x-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Soạn bài viết mới</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6B50]" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề bài viết hoặc tác giả..."
            value={articleSearch}
            onChange={(e) => setArticleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8C2320]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={articleCategoryFilter}
            onChange={(e) => setArticleCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBA] rounded-full font-medium text-[#4A3B32]"
          >
            <option value="Tất cả">Tất cả chuyên mục</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={articleStatusFilter}
            onChange={(e) => setArticleStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D9CEBA] rounded-full font-medium text-[#4A3B32]"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Đã đăng">Đã xuất bản</option>
            <option value="Nháp">Bản nháp</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-[#E8DFC8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E8DFC8] text-[#8C6B50] uppercase tracking-wider font-semibold">
                <th className="p-4">Bài viết</th>
                <th className="p-4">Chuyên mục</th>
                <th className="p-4">Tác giả</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Lượt xem</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFC8]/60 text-[#3A1E16]">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 italic">
                    Không tìm thấy bài viết nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3 max-w-md">
                        <img 
                          src={art.coverImage} 
                          alt={art.title} 
                          className="w-12 h-12 rounded-lg object-cover border border-[#E8DFC8] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[#2D241E] truncate hover:text-[#8C2320] cursor-pointer" onClick={() => onOpenEditArticle(art)}>
                            {art.title}
                          </p>
                          <p className="text-[11px] text-[#8C6B50] truncate">{art.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F3EDE2] text-[#8C2320] border border-[#E4D9C7]">
                        {art.category}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{art.author}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => onToggleArticleStatus(art)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          art.status === 'Đã đăng' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {art.status === 'Đã đăng' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{art.status}</span>
                      </button>
                    </td>
                    <td className="p-4 font-semibold text-[#8C6B50]">{art.views}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onNavigate({ type: 'article-detail', articleId: art.id })}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem trước"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenEditArticle(art)}
                          className="p-1.5 text-gray-600 hover:text-[#8C2320] hover:bg-red-50 rounded-lg transition-colors"
                          title="Sửa bài"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteArticle(art.id)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa bài"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
