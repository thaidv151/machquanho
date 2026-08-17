import React from 'react';
import { Article, ResearchEntry, ExploreTopic, SiteConfig, ViewState } from '../types';
import { HomeHero } from '../components/HomeHero';
import { HomeTimeline } from '../components/HomeTimeline';
import { HomeExploreCarousel } from '../components/HomeExploreCarousel';
import { Newspaper, Calendar, ArrowRight, Eye, Sparkles, Clock, Music } from 'lucide-react';
import { audioPlayer } from '../utils/audioSynth';

interface HomePageProps {
  articles: Article[];
  researchEntries: ResearchEntry[];
  exploreTopics: ExploreTopic[];
  siteConfig: SiteConfig;
  onNavigate: (view: ViewState) => void;
  onSelectTopic: (topicId: string) => void;
  isPlayingAudio: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  articles,
  researchEntries,
  exploreTopics,
  siteConfig,
  onNavigate,
  onSelectTopic,
  isPlayingAudio
}) => {
  // Published articles only for client view
  const publishedArticles = articles.filter(a => a.status === 'Đã đăng');
  const latestArticles = publishedArticles.slice(0, 4);

  return (
    <div id="home-page-container" className="space-y-12">
      
      {/* 1. Hero Banner */}
      <HomeHero
        siteConfig={siteConfig}
        onNavigate={onNavigate}
        isPlayingAudio={isPlayingAudio}
      />

      {/* 2. Main Two-Column Content: News & Activities + Research Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left Column: Tin tức & Hoạt động (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Section Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#8C2320]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#8C2320] flex items-center justify-center text-white">
                  <Newspaper className="w-4 h-4" />
                </div>
                <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
                  Tin tức & Hoạt động
                </h2>
              </div>

              <button
                id="view-all-news-link"
                onClick={() => onNavigate({ type: 'news' })}
                className="text-xs sm:text-sm font-semibold text-[#8C2320] hover:text-[#5E1412] flex items-center space-x-1 cursor-pointer group"
              >
                <span>Xem tất cả bài viết</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 2x2 Responsive News Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {latestArticles.map((article) => (
                <article
                  key={article.id}
                  id={`home-article-card-${article.id}`}
                  onClick={() => onNavigate({ type: 'article-detail', articleId: article.id })}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E8DFC8] hover:border-[#8C2320] hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  {/* Card Thumbnail */}
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-[#2D1614]">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Pill */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#8C2320] text-white shadow-xs">
                      {article.category}
                    </span>

                    {/* Audio indicator if present */}
                    {article.audioTitle && (
                      <span className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-xs text-[#E5B567]">
                        <Music className="w-3.5 h-3.5" />
                      </span>
                    )}

                    {/* Read time floating */}
                    <span className="absolute bottom-2.5 right-3 text-[11px] text-white/90 font-medium flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#E5B567]" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center space-x-3 text-xs text-[#8C6B50] mb-2">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{article.date}</span>
                        </span>
                        <span>•</span>
                        <span>{article.author}</span>
                      </div>

                      <h3 className="font-serif-culture text-base sm:text-lg font-bold text-[#2D241E] group-hover:text-[#8C2320] transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#6B5A4E] mt-2 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    {/* Tags / Link */}
                    <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs">
                      <span className="text-[#8C6B50] font-medium">
                        {article.views} lượt xem
                      </span>
                      <span className="font-semibold text-[#8C2320] group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                        <span>Đọc tiếp</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Quick Explore Banner in News Section */}
            <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-serif-culture text-base font-bold text-[#2D241E]">
                  Bạn muốn tìm hiểu các làn điệu Quan họ cổ?
                </h4>
                <p className="text-xs text-[#7A6B60]">
                  Khám phá kho tư liệu hơn 200 làn điệu lề lối, giọng vặt và giã bạn có bản thu âm.
                </p>
              </div>
              <button
                onClick={() => onSelectTopic('exp-lan-dieu')}
                className="px-4 py-2 rounded-full bg-[#8C2320] text-white text-xs font-semibold hover:bg-[#6E1B19] transition-colors cursor-pointer shrink-0"
              >
                Khám phá Làn điệu
              </button>
            </div>

          </div>

          {/* Right Column: Nhật ký nghiên cứu Timeline (4 cols) */}
          <div className="lg:col-span-4">
            <HomeTimeline
              entries={researchEntries}
              onNavigate={onNavigate}
            />
          </div>

        </div>
      </section>

      {/* 3. Khám phá Quan họ Carousel */}
      <HomeExploreCarousel
        topics={exploreTopics}
        onSelectTopic={onSelectTopic}
      />

    </div>
  );
};
