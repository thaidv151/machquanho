import React from 'react';
import { ResearchEntry, ViewState } from '../types';
import { BookOpen, MapPin, Calendar, ArrowRight, Mic, Camera, Map, Archive, Users, Bookmark } from 'lucide-react';

interface HomeTimelineProps {
  entries: ResearchEntry[];
  onNavigate: (view: ViewState) => void;
}

export const HomeTimeline: React.FC<HomeTimelineProps> = ({ entries, onNavigate }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'mic': return Mic;
      case 'map': return Map;
      case 'camera': return Camera;
      case 'archive': return Archive;
      case 'users': return Users;
      default: return BookOpen;
    }
  };

  return (
    <div id="home-research-timeline" className="bg-[#FAF8F5] p-6 sm:p-7 rounded-2xl border border-[#E8DFC8] shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-[#E8DFC8] mb-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#8C2320]/10 flex items-center justify-center text-[#8C2320]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-culture text-xl font-bold text-[#2D241E]">
              Nhật ký nghiên cứu
            </h3>
            <p className="text-xs text-[#8C6B50]">Hành trình điền dã & bảo tồn di sản</p>
          </div>
        </div>

        <button
          id="view-all-research-btn"
          onClick={() => onNavigate({ type: 'research-diary' })}
          className="text-xs font-semibold text-[#8C2320] hover:text-[#5E1412] flex items-center space-x-1 cursor-pointer group"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#D9CEBA]">
        {entries.slice(0, 3).map((entry, index) => {
          const Icon = getIcon(entry.iconType);
          return (
            <div 
              key={entry.id}
              onClick={() => onNavigate({ type: 'research-diary', selectedId: entry.id })}
              className="relative group cursor-pointer"
            >
              {/* Timeline Dot Icon */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#FAF8F5] border-2 border-[#8C2320] group-hover:bg-[#8C2320] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C2320] group-hover:bg-white transition-colors" />
              </div>

              {/* Card Body */}
              <div className="bg-white p-4 rounded-xl border border-[#EDE5D8] group-hover:border-[#8C2320]/60 group-hover:shadow-md transition-all">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#F4EFE6] text-[#8C2320] border border-[#E4DAC8]">
                    {entry.phase}
                  </span>
                  <div className="flex items-center space-x-1 text-[11px] text-[#8C6B50]">
                    <Calendar className="w-3 h-3" />
                    <span>{entry.date}</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="font-serif-culture text-sm sm:text-base font-bold text-[#2D241E] group-hover:text-[#8C2320] transition-colors line-clamp-2">
                  {entry.title}
                </h4>

                {/* Location */}
                <div className="flex items-center space-x-1 text-xs text-[#7A6B60] mt-1.5">
                  <MapPin className="w-3 h-3 text-[#B83E3E] shrink-0" />
                  <span className="truncate">{entry.location}</span>
                </div>

                {/* Summary */}
                <p className="text-xs text-[#5C4E46] mt-2 line-clamp-2 leading-relaxed">
                  {entry.summary}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Callout */}
      <div className="mt-6 pt-4 border-t border-[#E8DFC8] text-center">
        <button
          onClick={() => onNavigate({ type: 'research-diary' })}
          className="w-full py-2 rounded-xl text-xs font-semibold text-[#8C2320] bg-[#F4EFE6] hover:bg-[#EAE1D2] border border-[#E0D4C0] transition-colors cursor-pointer"
        >
          Khám phá toàn bộ {entries.length} chuyến điền dã &rarr;
        </button>
      </div>

    </div>
  );
};
