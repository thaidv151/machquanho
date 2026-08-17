import React, { useState } from 'react';
import { Article, ViewState } from '../types';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, Music, Play, Pause, Eye, Heart, MessageSquare, Tag, Sparkles, ArrowRight } from 'lucide-react';
import { audioPlayer } from '../utils/audioSynth';

interface ArticleDetailPageProps {
  article: Article;
  relatedArticles: Article[];
  onNavigate: (view: ViewState) => void;
  isPlayingAudio: boolean;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  article,
  relatedArticles,
  onNavigate,
  isPlayingAudio
}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(article.views > 100 ? Math.floor(article.views / 12) : 24);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ name: string; date: string; content: string }[]>([
    {
      name: 'Trần Văn Hùng (CLB Quan họ Kinh Bắc)',
      date: '15/02/2024',
      content: 'Bài viết rất công phu và sâu sắc, thể hiện đúng cái hồn cốt lề lối của người Quan họ xưa. Rất mong dự án Mạch Quan Họ tiếp tục số hóa thêm nhiều tư liệu quý.'
    },
    {
      name: 'Nguyễn Thị Mai Lan',
      date: '16/02/2024',
      content: 'Nghe làn điệu phát trên trang mà bồi hồi xúc động, như được hòa mình vào không khí ngày hội Lim đầu xuân.'
    }
  ]);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      setComments([
        {
          name: 'Độc giả yêu Quan họ',
          date: 'Vừa xong',
          content: commentText.trim()
        },
        ...comments
      ]);
      setCommentText('');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép đường dẫn bài viết vào bộ nhớ tạm!');
    }
  };

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

      {/* 4. Audio Player Widget inside Article (if track available) */}
      {article.audioTitle && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 my-8">
          <div className="bg-gradient-to-r from-[#3A1816] to-[#591E1A] text-white p-5 rounded-2xl shadow-md border border-[#8C2320] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-[#E5B567] text-[#3A1816] flex items-center justify-center shrink-0 shadow-xs">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#E5B567] tracking-wider">
                  Trải nghiệm thanh âm di sản
                </div>
                <h4 className="font-serif-culture font-bold text-sm sm:text-base text-white">
                  {article.audioTitle}
                </h4>
                <p className="text-xs text-[#D9C4B7]">Thời lượng: {article.audioDuration || '04:30'}</p>
              </div>
            </div>

            <button
              onClick={() => audioPlayer.toggle(article.audioTitle!)}
              className="px-6 py-2.5 rounded-full bg-[#E5B567] hover:bg-[#F3CE8D] text-[#3A1816] font-bold text-xs flex items-center space-x-2 transition-transform hover:scale-105 cursor-pointer shrink-0"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlayingAudio ? 'Tạm dừng' : 'Nghe diễn xướng'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Rich Body Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6 text-[#382D26] leading-relaxed text-base sm:text-lg">
        
        {article.content.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {index === 0 ? (
              <span className="first-letter:font-serif-culture first-letter:text-5xl first-letter:font-bold first-letter:text-[#8C2320] first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                {paragraph}
              </span>
            ) : (
              paragraph
            )}
          </p>
        ))}

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

        {/* Like & Share */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
              hasLiked ? 'bg-[#8C2320] text-white border-[#8C2320]' : 'bg-white text-[#4A3B32] border-[#D9CEBA] hover:text-[#8C2320]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
            <span>Thích ({likes})</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-[#4A3B32] border border-[#D9CEBA] hover:text-[#8C2320] transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Chia sẻ</span>
          </button>
        </div>

      </div>

      {/* 7. Comments & Reflections Box */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-6 space-y-6">
        <div className="flex items-center space-x-2 text-[#2D241E]">
          <MessageSquare className="w-5 h-5 text-[#8C2320]" />
          <h3 className="font-serif-culture text-xl font-bold">Cảm nghĩ & Bình luận ({comments.length})</h3>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleAddComment} className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-3">
          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Chia sẻ cảm xúc của bạn về làn điệu hoặc nội dung bài viết..."
            className="w-full p-3 text-sm bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8C2320] text-[#2D241E]"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-5 py-2 text-xs font-bold text-white bg-[#8C2320] hover:bg-[#6E1B19] disabled:opacity-40 rounded-full transition-colors cursor-pointer"
            >
              Gửi cảm nghĩ
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-3">
          {comments.map((c, idx) => (
            <div key={idx} className="p-4 bg-white rounded-xl border border-[#EDE5D8] space-y-1">
              <div className="flex items-center justify-between text-xs text-[#8C6B50]">
                <span className="font-bold text-[#2D241E]">{c.name}</span>
                <span>{c.date}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#4A3B32]">{c.content}</p>
            </div>
          ))}
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
