import React, { useState, useEffect } from 'react';
import { Landmark, ShieldCheck, Clock, Loader2 } from 'lucide-react';
import { TimelineEntry } from '../types';
import apiService from '../services/apiService';

interface TimelinePageProps {
  onNavigate?: (view: any) => void;
}

// Cultural Svg Icons in faded bronze/gold tone for Column 1
const HeritageSvgIcon: React.FC<{ index: number; className?: string }> = ({ index, className = "w-14 h-14" }) => {
  const iconIndex = index % 5;
  switch (iconIndex) {
    case 0:
      // Ancient Banyan Tree / Cây đa làng
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <path d="M32 8C20 8 12 16 12 26C12 32 16 37 20 40C18 44 16 48 14 56H50C48 48 46 44 44 40C48 37 52 32 52 26C52 16 44 8 32 8Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M32 26V56M26 38L32 46M38 34L32 42M24 24C28 22 36 22 40 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="20" cy="18" r="3" fill="currentColor" opacity="0.3"/>
          <circle cx="44" cy="18" r="3" fill="currentColor" opacity="0.3"/>
          <circle cx="32" cy="14" r="3.5" fill="currentColor" opacity="0.3"/>
        </svg>
      );
    case 1:
      // Village Gate / Cổng làng Kinh Bắc
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <path d="M8 24C16 16 48 16 56 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M12 22V56M52 22V56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M22 34H42V56H22V34Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M18 16L32 8L46 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M26 42C26 38 38 38 38 42V56H26V42Z" fill="currentColor" opacity="0.2"/>
        </svg>
      );
    case 2:
      // Tower / Pagoda / Tháp Bút
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <path d="M24 16H40M20 28H44M16 40H48M12 52H52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M32 6L32 16M26 16L24 28M38 16L40 28M22 28L20 40M42 28L44 40M18 40L16 52M46 40L48 52" stroke="currentColor" strokeWidth="2"/>
          <path d="M28 52V58M36 52V58M10 58H54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      );
    case 3:
      // Communal House / Mái đình làng cổ
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <path d="M6 28C14 18 50 18 58 28L32 12L6 28Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 28V54M50 28V54M26 28V54M38 28V54" stroke="currentColor" strokeWidth="2"/>
          <path d="M10 54H54" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M20 18C26 14 38 14 44 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 4:
    default:
      // Lotus / Hoa sen di sản
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <path d="M32 12C28 20 20 28 8 32C20 36 28 44 32 52C36 44 44 36 56 32C44 28 36 20 32 12Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="32" cy="32" r="6" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.2"/>
        </svg>
      );
  }
};

export const TimelinePage: React.FC<TimelinePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'heritage' | 'policy'>('heritage');
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTimelineData();
  }, [activeTab]);

  const fetchTimelineData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTimelineEntries(activeTab);
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching timeline entries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EF] py-10 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section matching reference image */}
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-sm font-medium text-[#7A4B27] tracking-wide mb-3">
            Hành trình hình thành và phát triển di sản
          </p>

          {/* Tab Switcher Buttons */}
          <div className="inline-flex p-1 rounded-xl bg-white border border-[#D8C7B5] shadow-xs space-x-1">
            <button
              onClick={() => setActiveTab('heritage')}
              className={`px-6 sm:px-8 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'heritage'
                  ? 'bg-[#6D4321] text-white shadow-sm'
                  : 'text-[#6D4321] hover:bg-[#FAF6EF] font-semibold'
              }`}
            >
              <span>Dòng chảy di sản</span>
            </button>
            <button
              onClick={() => setActiveTab('policy')}
              className={`px-6 sm:px-8 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'policy'
                  ? 'bg-[#6D4321] text-white shadow-sm'
                  : 'text-[#6D4321] hover:bg-[#FAF6EF] font-semibold'
              }`}
            >
              <span>Dòng chảy chính sách</span>
            </button>
          </div>
        </div>

        {/* Timeline Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-10 h-10 text-[#6D4321] animate-spin" />
            <p className="text-[#6D4321] font-medium text-sm">Đang tải dữ liệu dòng chảy lịch sử...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-2xl border border-[#E8DFC8]">
            <Clock className="w-10 h-10 text-[#B89775] mx-auto mb-2" />
            <p className="text-[#6D4321] font-medium">Chưa có mốc thời gian nào trong mục này.</p>
          </div>
        ) : (
          <div className="relative space-y-3 sm:space-y-4">
            {entries.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === entries.length - 1;

              return (
                <div key={item.id} className="relative flex flex-col md:grid md:grid-cols-12 gap-2 sm:gap-4 items-center group overflow-visible">
                  
                  {/* Column 1 (Leftmost): Cultural Icon (2 Cols on desktop) */}
                  <div className="hidden md:flex col-span-2 justify-center items-center text-[#C4A482] opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300">
                    <HeritageSvgIcon index={index} className="w-13 h-13 lg:w-15 lg:h-15" />
                  </div>

                  {/* Column 2 (Center Axis): Continuous Bold Timeline Line & Node (1 Col on desktop) */}
                  <div className="hidden md:flex col-span-1 justify-center items-center relative self-stretch py-2">
                    {/* Seamless Bold Vertical connecting line extending to join adjacent items */}
                    <div 
                      className={`absolute w-[2.5px] bg-[#8C6544] left-1/2 -translate-x-1/2 ${
                        isFirst ? 'top-1/2 bottom-0' : isLast ? 'top-0 bottom-1/2' : 'top-0 bottom-0'
                      }`} 
                    />
                    
                    {/* Circle Node (Numbered 1, 2, 3...) */}
                    <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#6D4321] text-white font-bold text-xs sm:text-sm border-2 border-[#FAF6EF] shadow-xs flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#8B3A2B] transition-all">
                      {index + 1}
                    </div>

                    {/* Horizontal Branch Connector Line to Right Content */}
                    <div className="absolute left-1/2 right-0 h-[2.5px] bg-[#8C6544]" />
                  </div>

                  {/* Mobile Header Badge for Node */}
                  <div className="flex md:hidden items-center space-x-3 w-full pb-2 border-b border-[#E8DFC8]">
                    <div className="w-7 h-7 rounded-full bg-[#6D4321] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <span className="font-bold text-base text-[#6D4321]">{item.period}</span>
                  </div>

                  {/* Column 3 (Right Content & Thumbnail): Transparent Background, Compact Spacing (9 Cols on desktop) */}
                  <div className="col-span-12 md:col-span-9 w-full bg-transparent p-3 sm:p-4 rounded-xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                      
                      {/* Text Info Block */}
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg lg:text-xl text-[#6D4321] leading-snug">
                          {item.period}
                        </h3>
                        {item.title && (
                          <h4 className="font-bold text-sm sm:text-base text-[#3E2D20] leading-snug">
                            {item.title}
                          </h4>
                        )}
                        <p className="text-xs sm:text-sm text-[#4A3B30] leading-relaxed whitespace-pre-line">
                          {item.description}
                        </p>
                      </div>

                      {/* Image Thumbnail (Right side) */}
                      {item.image && (
                        <div className="w-full lg:w-72 xl:w-80 shrink-0">
                          <div className="aspect-[16/9] rounded-lg overflow-hidden border border-[#E5D7C5]/80 shadow-2xs group/img">
                            <img
                              src={item.image}
                              alt={item.title || item.period}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default TimelinePage;
