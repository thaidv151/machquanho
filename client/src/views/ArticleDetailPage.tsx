import React, { useState } from 'react';
import { Article, ViewState } from '../types';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, Music, Play, Pause, Eye, Tag, Sparkles, ArrowRight } from 'lucide-react';
import { audioPlayer } from '../utils/audioSynth';

interface ArticleDetailPageProps {
  article: Article;
  relatedArticles: Article[];
  onNavigate: (view: ViewState) => void;
  isPlayingAudio: boolean;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  article,
  relatedArticles = [],
  onNavigate,
  isPlayingAudio
}) => {
  const [bookmarked, setBookmarked] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép đường dẫn bài viết vào bộ nhớ tạm!');
    }
  };

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 space-y-4 bg-[#FAF8F5]">
        <div className="w-12 h-12 rounded-full bg-[#114D3A]/10 text-[#114D3A] flex items-center justify-center animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="font-serif-culture text-xl font-bold text-[#114D3A]">
          Đang tải dữ liệu bài viết...
        </h2>
        <p className="text-xs text-[#6B5A4E]">
          Hệ thống đang cập nhật dữ liệu từ máy chủ. Vui lòng chờ trong giây lát.
        </p>
        <button
          onClick={() => onNavigate({ type: 'news' })}
          className="px-6 py-2.5 rounded-full bg-[#114D3A] text-white text-xs font-bold hover:bg-[#0D3B2C] transition-colors cursor-pointer shadow-xs"
        >
          &larr; Quay lại danh sách tin tức
        </button>
      </div>
    );
  }

  return (
    <article id="article-detail-view" className="min-h-screen bg-[#FAF8F5] pb-24">
      
      {/* 1. Header Breadcrumbs & Actions Bar */}
      <div className="bg-[#FAF6F0] border-b border-[#E8DFC8] py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8C6B50]">
          
          {/* Breadcrumb links */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onNavigate({ type: 'home' })}
              className="hover:text-[#8C2320] transition-colors cursor-pointer"
            >
              Trang chủ
            </button>
            <span>/</span>
            <button 
              onClick={() => onNavigate({ type: 'news' })}
              className="hover:text-[#8C2320] transition-colors cursor-pointer"
            >
              Tin tức & Hoạt động
            </button>
            <span>/</span>
            <span className="font-semibold text-[#8C2320]">{article.category}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate({ type: 'news' })}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white border border-[#D9CEBA] hover:bg-[#F2EDE4] text-[#4A3B32] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại danh sách</span>
            </button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                bookmarked ? 'bg-[#8C2320] text-white border-[#8C2320]' : 'bg-white border-[#D9CEBA] text-[#4A3B32] hover:text-[#8C2320]'
              }`}
              title="Lưu bài viết"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-full bg-white border border-[#D9CEBA] text-[#4A3B32] hover:text-[#8C2320] transition-colors cursor-pointer"
              title="Chia sẻ bài viết"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 2. Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-6 space-y-4">
        
        {/* Category badge */}
        <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-[#8C2320] text-white shadow-xs">
          {article.category}
        </span>

        {/* Title */}
        <h1 className="font-serif-culture text-2xl sm:text-4xl lg:text-4xl font-bold text-[#2D241E] leading-tight sm:leading-snug">
          {article.title}
        </h1>

        {/* Excerpt lead paragraph */}
        <p className="text-base sm:text-lg text-[#5C4D44] font-medium leading-relaxed border-l-4 border-[#8C2320] pl-4 italic">
          {article.excerpt}
        </p>

        {/* Meta details */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E8DFC8] text-xs text-[#7A6B60]">
          
          <div className="flex items-center space-x-3">
            {article.authorAvatar ? (
              <img src={article.authorAvatar} alt={article.author} className="w-10 h-10 rounded-full object-cover border border-[#D9CEBA]" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#8C2320] text-white font-bold text-sm flex items-center justify-center">
                {article.author.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-bold text-[#2D241E] text-sm">{article.author}</p>
              <p className="text-[#8C6B50]">{article.authorRole}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.date}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{article.views} lượt xem</span>
            </span>
          </div>

        </div>

      </header>

      {/* 3. Main Cover Image with Caption */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 my-6">
        <div className="rounded-2xl overflow-hidden shadow-lg border border-[#E8DFC8] bg-[#2D1614]">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full max-h-[520px] object-cover"
          />
        </div>
        {article.imageCaption && (
          <p className="text-center text-xs text-[#7A6B60] italic mt-2.5 px-4">
            Hình ảnh: {article.imageCaption}
          </p>
        )}
      </div>

      {/* 5. Rich Body Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6 text-[#382D26] leading-relaxed text-base sm:text-lg">
        
        {Array.isArray(article.content) ? (
          article.content.map((paragraph, index) => (
            <div
              key={index}
              className="leading-relaxed prose max-w-none text-[#382D26]"
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))
        ) : (
          <div
            className="leading-relaxed prose max-w-none text-[#382D26]"
            dangerouslySetInnerHTML={{ __html: article.content || '' }}
          />
        )}

        {/* Pull Quote */}
        {article.quote && (
          <div className="my-8 p-6 bg-[#FAF4EB] border-l-4 border-[#8C2320] rounded-r-2xl shadow-xs">
            <blockquote className="font-serif-culture text-lg sm:text-xl italic font-semibold text-[#2D241E] leading-relaxed">
              “{article.quote.text}”
            </blockquote>
            <p className="text-right text-xs font-bold text-[#8C2320] mt-3 uppercase tracking-wider">
              — {article.quote.author}
            </p>
          </div>
        )}

        {/* Gallery Sub-images */}
        {article.galleryImages && article.galleryImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            {article.galleryImages.map((img, idx) => (
              <div key={idx} className="space-y-1.5">
                <img src={img.url} alt={img.caption} className="w-full h-56 object-cover rounded-xl border border-[#E8DFC8]" />
                <p className="text-xs text-[#7A6B60] italic text-center">{img.caption}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 6. Tags Cloud & Interaction Buttons */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 border-t border-b border-[#E8DFC8] flex flex-wrap items-center justify-between gap-4">
        
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-[#8C2320]" />
          {article.tags.map((tag, idx) => (
            <span
              key={idx}
              onClick={() => onNavigate({ type: 'news', searchQuery: tag })}
              className="text-xs px-3 py-1 rounded-full bg-white border border-[#D9CEBA] text-[#5C4D44] hover:border-[#8C2320] hover:text-[#8C2320] transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Share Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-[#4A3B32] border border-[#D9CEBA] hover:text-[#8C2320] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Chia sẻ bài viết</span>
          </button>
        </div>

      </div>



      {/* 8. Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 border-t border-[#E8DFC8]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif-culture text-2xl font-bold text-[#2D241E]">
              Tin tức & Bài viết liên quan
            </h3>
            <button
              onClick={() => onNavigate({ type: 'news', category: article.category })}
              className="text-xs font-bold text-[#8C2320] hover:underline"
            >
              Xem thêm trong {article.category} &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedArticles.slice(0, 3).map((rel) => (
              <div
                key={rel.id}
                onClick={() => onNavigate({ type: 'article-detail', articleId: rel.id })}
                className="bg-white rounded-xl overflow-hidden border border-[#E8DFC8] hover:border-[#8C2320] hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div className="h-36 overflow-hidden bg-[#2D1614]">
                  <img src={rel.coverImage} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#8C2320] uppercase">{rel.category}</span>
                    <h4 className="font-serif-culture font-bold text-sm text-[#2D241E] group-hover:text-[#8C2320] line-clamp-2 mt-1">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="text-[11px] text-[#8C6B50] flex items-center justify-between pt-2 border-t border-[#F0EBE1]">
                    <span>{rel.date}</span>
                    <ArrowRight className="w-3 h-3 text-[#8C2320]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </article>
  );
};
