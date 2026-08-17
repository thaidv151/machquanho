import React, { useState } from 'react';
import { Article, ArticleCategory, ViewState } from '../types';
import { Search, Calendar, Clock, ArrowRight, Sparkles, Filter, Music, ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsListPageProps {
  articles: Article[];
  initialCategory?: string;
  initialSearchQuery?: string;
  onNavigate: (view: ViewState) => void;
}

export const NewsListPage: React.FC<NewsListPageProps> = ({
  articles,
  initialCategory,
  initialSearchQuery,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery || '');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const categories = ['Tất cả', 'Sự kiện', 'Chính sách', 'Góc nhìn', 'Hoạt động', 'Nghệ nhân', 'Khám phá'];

  // Filter articles
  const publishedArticles = articles.filter(a => a.status === 'Đã đăng');
  
  const filtered = publishedArticles.filter(article => {
    const matchesCategory = selectedCategory === 'Tất cả' || article.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Featured article (first featured or first item)
  const featuredArticle = filtered.find(a => a.featured) || filtered[0];
  const gridArticles = filtered.filter(a => a.id !== featuredArticle?.id);

  // Pagination logic for grid articles
  const totalPages = Math.ceil(gridArticles.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGridArticles = gridArticles.slice(startIndex, startIndex + itemsPerPage);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div id="news-list-page" className="min-h-screen bg-[#FAF8F5] pb-20">
      
      {/* Page Header Banner */}
      <div className="bg-[#2D1614] text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80"
            alt="Di sản Quan họ"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[#E5B567] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Thông tin & Truyền thông</span>
          </div>
          <h1 className="font-serif-culture text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Tin tức & Hoạt động di sản
          </h1>
          <p className="text-sm sm:text-base text-[#D4C8BE] max-w-2xl mt-2 leading-relaxed">
            Cập nhật toàn diện các sự kiện lễ hội, đề án bảo tồn, chính sách đãi ngộ nghệ nhân và các câu chuyện văn hóa đậm tình Kinh Bắc.
          </p>
        </div>
      </div>

      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Controls Bar: Category Pills + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8DFC8]">
          
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`category-tab-${cat}`}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#8C2320] text-white shadow-xs'
                    : 'bg-[#F2EDE4] text-[#5C4D44] hover:bg-[#E5DDCF] hover:text-[#8C2320]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6B50]" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#D9CEBA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8C2320] text-[#2D241E]"
            />
          </div>

        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DFC8] p-8">
            <p className="font-serif-culture text-lg text-[#5C4D44]">Không tìm thấy bài viết phù hợp với tìm kiếm của bạn.</p>
            <button
              onClick={() => { setSelectedCategory('Tất cả'); setSearchQuery(''); }}
              className="mt-4 px-5 py-2 text-xs font-semibold bg-[#8C2320] text-white rounded-full hover:bg-[#6E1B19]"
            >
              Xem lại tất cả bài viết
            </button>
          </div>
        )}

        {/* Featured Big Article Card (When available) */}
        {featuredArticle && selectedCategory === 'Tất cả' && !searchQuery && (
          <div
            id="featured-hero-article"
            onClick={() => onNavigate({ type: 'article-detail', articleId: featuredArticle.slug || featuredArticle.id })}
            className="bg-white rounded-3xl overflow-hidden border border-[#E8DFC8] hover:border-[#8C2320] hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Image side */}
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-[#2D1614]">
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold bg-[#8C2320] text-white shadow-sm flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-[#E5B567]" />
                  <span>Sự kiện nổi bật</span>
                </span>
              </div>

              {/* Text content side */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-xs text-[#8C6B50]">
                    <span className="font-semibold text-[#8C2320] uppercase tracking-wider">{featuredArticle.category}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{featuredArticle.date}</span>
                    </span>
                    <span>•</span>
                    <span>{featuredArticle.readTime}</span>
                  </div>

                  <h2 className="font-serif-culture text-xl sm:text-2xl lg:text-3xl font-bold text-[#2D241E] group-hover:text-[#8C2320] transition-colors leading-tight">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#6B5A4E] leading-relaxed line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {featuredArticle.authorAvatar ? (
                      <img src={featuredArticle.authorAvatar} alt={featuredArticle.author} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#8C2320]/10 text-[#8C2320] font-bold text-xs flex items-center justify-center">
                        {featuredArticle.author.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-medium text-[#4A3B32]">{featuredArticle.author}</span>
                  </div>

                  <span className="text-xs font-bold text-[#8C2320] flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Đọc toàn văn</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentGridArticles.map((article) => {
            const articleSlugOrId = article.slug || article.id;
            return (
              <article
                key={article.id}
                id={`news-card-${articleSlugOrId}`}
                onClick={() => onNavigate({ type: 'article-detail', articleId: articleSlugOrId })}
                className="bg-white rounded-2xl overflow-hidden border border-[#E8DFC8] hover:border-[#8C2320] hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden bg-[#2D1614]">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#8C2320] text-white shadow-xs">
                  {article.category}
                </span>

                {article.audioTitle && (
                  <span className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-xs text-[#E5B567]">
                    <Music className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Card Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-[#8C6B50] mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="font-serif-culture text-base font-bold text-[#2D241E] group-hover:text-[#8C2320] transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#6B5A4E] mt-2 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs">
                  <span className="text-[#7A6B60] truncate max-w-[140px]">
                    Tác giả: {article.author}
                  </span>
                  <span className="font-semibold text-[#8C2320] flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#D9CEBA] bg-white hover:bg-[#F4EFE6] text-[#4A3B32] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#8C2320] text-white shadow-xs'
                    : 'bg-white border border-[#D9CEBA] text-[#4A3B32] hover:bg-[#F4EFE6]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[#D9CEBA] bg-white hover:bg-[#F4EFE6] text-[#4A3B32] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
