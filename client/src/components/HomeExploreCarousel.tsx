import React from 'react';
import { ExploreTopic } from '../types';
import { Compass, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface HomeExploreCarouselProps {
  topics: ExploreTopic[];
  onSelectTopic: (topicId: string) => void;
}

export const HomeExploreCarousel: React.FC<HomeExploreCarouselProps> = ({
  topics,
  onSelectTopic
}) => {
  const displayTopics = topics || [];
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="home-explore-section" className="py-10 bg-[#E3D5C3]/40 border-t border-[#E3D5C3]">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#114D3A]/10 text-[#114D3A] text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Chuyên đề văn hóa</span>
            </div>
            <h2 className="font-serif-culture text-2xl sm:text-3xl lg:text-4xl font-bold text-[#114D3A]">
              Khám phá di sản Quan họ
            </h2>
            <p className="text-sm text-[#6B5A4E] mt-1">
              Tìm hiểu các tầng sâu lịch sử, không gian diễn xướng và cốt cách người Kinh Bắc
            </p>
          </div>

          {/* Slider Arrow Controls */}
          {displayTopics.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                id="explore-scroll-left"
                onClick={() => handleScroll('left')}
                className="p-2.5 rounded-full bg-white hover:bg-[#114D3A] hover:text-white text-[#2D241E] border border-[#E3D5C3] shadow-xs transition-colors cursor-pointer"
                title="Cuộn sang trái"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="explore-scroll-right"
                onClick={() => handleScroll('right')}
                className="p-2.5 rounded-full bg-white hover:bg-[#114D3A] hover:text-white text-[#2D241E] border border-[#E3D5C3] shadow-xs transition-colors cursor-pointer"
                title="Cuộn sang phải"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content Section: Empty state vs Cards Grid */}
        {displayTopics.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white/70 rounded-3xl border border-[#E3D5C3]">
            <Compass className="w-10 h-10 text-[#A8988B] mx-auto mb-3 opacity-60" />
            <p className="font-serif-culture text-base font-bold text-[#4A3B32]">
              Hiện chưa có chuyên đề khám phá nào
            </p>
            <p className="text-xs text-[#8C6B50] mt-1">
              Vui lòng truy cập Cổng quản trị (CMS) &rarr; Chuyên đề Khám phá để thêm bài viết mới.
            </p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex space-x-5 overflow-x-auto pb-6 pt-1 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayTopics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className="w-[280px] sm:w-[320px] shrink-0 snap-start bg-white rounded-2xl overflow-hidden border border-[#E3D5C3] hover:border-[#114D3A] hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                {/* Card Image */}
                <div className="relative h-48 overflow-hidden bg-[#0A3326]">
                  <img
                    src={topic.image}
                    alt={topic.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badge */}
                  {topic.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#8C2F2F] text-white shadow-xs">
                      {topic.badge}
                    </span>
                  )}

                  {/* Subtitle floating */}
                  {topic.subtitle && (
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs text-[#D4A25A] font-semibold tracking-wide">
                        {topic.subtitle}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif-culture text-lg font-bold text-[#2D241E] group-hover:text-[#114D3A] transition-colors line-clamp-1">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-[#6B5A4E] mt-1.5 line-clamp-2 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  {/* Highlights Tags */}
                  <div className="pt-2 border-t border-[#F0EBE1] flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {topic.highlights && topic.highlights.slice(0, 2).map((hl, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#8C6B50] border border-[#E8DFC8]">
                          {hl}
                        </span>
                      ))}
                    </div>

                    <span className="w-7 h-7 rounded-full bg-[#F4EFE6] text-[#8C2320] group-hover:bg-[#8C2320] group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
