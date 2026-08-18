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
  const latestArticles = publishedArticles.slice(0, 8);

  return (
    <div id="home-page-container" className="space-y-12">

      {/* 1. Hero Banner */}
      <HomeHero
        siteConfig={siteConfig}
        onNavigate={onNavigate}
        isPlayingAudio={isPlayingAudio}
      />

      {/* 2. Main Two-Column Content: News & Activities (8 cols) + Research Timeline (4 cols) */}
      <section className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          {/* Left Column: Tin tức & Hoạt động (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Section Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#114D3A]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#114D3A] flex items-center justify-center text-white shadow-xs">
                  <Newspaper className="w-4 h-4" />
                </div>
                <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
                  Tin tức & Hoạt động
                </h2>
              </div>

              <button
                id="view-all-news-link"
                onClick={() => onNavigate({ type: 'news' })}
                className="text-xs sm:text-sm font-bold text-[#114D3A] hover:text-[#8C2F2F] flex items-center space-x-1 cursor-pointer group"
              >
                <span>Xem tất cả bài viết</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 4 Articles on 1 Single Row Grid inside 8-Col Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-y-6">
              {latestArticles.map((article) => {
                const articleSlugOrId = article.slug || article.id;
                return (
                  <article
                    key={article.id}
                    id={`home-article-card-${articleSlugOrId}`}
                    onClick={() => onNavigate({ type: 'article-detail', articleId: articleSlugOrId })}
                    className="bg-white rounded-2xl overflow-hidden border border-[#E3D5C3] hover:border-[#114D3A] hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                  >
                    {/* Card Thumbnail */}
                    <div className="relative h-36 sm:h-44 overflow-hidden bg-[#0A3326]">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Real Category Pill */}
                      {article.category && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#8C2F2F] text-white shadow-xs">
                          {article.category}
                        </span>
                      )}

                      {/* Real Audio indicator if present */}
                      {article.audioTitle && (
                        <span className="absolute top-2 right-2 p-1 rounded-full bg-black/60 backdrop-blur-xs text-[#D4A25A]" title={article.audioTitle}>
                          <Music className="w-3 h-3" />
                        </span>
                      )}

                      {/* Real Read time floating */}
                      {article.readTime && (
                        <span className="absolute bottom-2 right-2 text-[10px] text-white/90 font-medium flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-[#D4A25A]" />
                          <span>{article.readTime}</span>
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex flex-wrap items-center space-x-2 text-[11px] text-[#8C6B50] mb-1">
                          {article.date && (
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-[#D4A25A]" />
                              <span>{article.date}</span>
                            </span>
                          )}
                          {article.author && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[90px]">{article.author}</span>
                            </>
                          )}
                        </div>

                        <h3 className="font-serif-culture text-sm font-bold text-[#2D241E] group-hover:text-[#114D3A] transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>

                        {article.excerpt && (
                          <p className="text-[11.5px] text-[#6B5A4E] mt-1 line-clamp-2 leading-relaxed">
                            {article.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Real Views Count & Link */}
                      <div className="pt-2 border-t border-[#E3D5C3]/60 flex items-center justify-between text-[11px]">
                        <span className="text-[#8C6B50] font-medium flex items-center space-x-1">
                          <Eye className="w-3 h-3 text-[#114D3A]" />
                          <span>{(article.views || 0).toLocaleString('vi-VN')} lượt xem</span>
                        </span>
                        <span className="font-bold text-[#114D3A] group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                          <span>Đọc tiếp</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Quick Explore Banner in News Section
            <div className="bg-[#E3D5C3]/40 p-5 rounded-2xl border border-[#E3D5C3] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-serif-culture text-base font-bold text-[#114D3A]">
                  Bạn muốn tìm hiểu các làn điệu Quan họ cổ?
                </h4>
                <p className="text-xs text-[#6B5A4E]">
                  Khám phá kho tư liệu hơn 200 làn điệu lề lối, giọng vặt và giã bạn có bản thu âm.
                </p>
              </div>
              <button
                onClick={() => onSelectTopic('exp-lan-dieu')}
                className="px-4 py-2 rounded-full bg-[#114D3A] text-white text-xs font-semibold hover:bg-[#0D3B2C] transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Khám phá Làn điệu
              </button>
            </div> */}

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
