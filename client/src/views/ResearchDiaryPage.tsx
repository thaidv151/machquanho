import React, { useState, useEffect } from 'react';
import { ResearchEntry, ViewState, SiteConfig } from '../types';
import { BookOpen, MapPin, Calendar, Mic, Archive, Users, CheckCircle, Music, Play, Sparkles, ArrowLeft, Download, Volume2 } from 'lucide-react';
import { audioPlayer } from '../utils/audioSynth';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { formatHtmlContent, hasHtmlContent } from '../utils/formatHtml';
import { apiService } from '../services/apiService';

interface ResearchDiaryPageProps {
  entries?: ResearchEntry[];
  selectedId?: string;
  onNavigate: (view: ViewState) => void;
  isPlayingAudio: boolean;
  siteConfig?: SiteConfig;
}

export const ResearchDiaryPage: React.FC<ResearchDiaryPageProps> = ({
  entries: initialEntries,
  selectedId,
  onNavigate,
  isPlayingAudio,
  siteConfig
}) => {
  const [entries, setEntries] = useState<ResearchEntry[]>(initialEntries || []);
  const [loading, setLoading] = useState(!initialEntries || initialEntries.length === 0);

  useEffect(() => {
    if (initialEntries && initialEntries.length > 0) {
      setEntries(initialEntries);
      setLoading(false);
    }
  }, [initialEntries]);

  useEffect(() => {
    let isMounted = true;
    if (!initialEntries || initialEntries.length === 0) {
      setLoading(true);
      apiService.getResearchEntries()
        .then((data) => {
          if (isMounted && data && data.length > 0) {
            setEntries(data);
          }
        })
        .catch((err) => console.warn('Failed to load research entries in ResearchDiaryPage:', err))
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, []);

  const [activeEntryId, setActiveEntryId] = useState<string>(selectedId || entries[0]?.id || '');
  const [filterPhase, setFilterPhase] = useState<string>('Tất cả');

  // Update active entry ID when entries load or selectedId prop changes
  useEffect(() => {
    if (selectedId) {
      setActiveEntryId(selectedId);
    } else if (entries.length > 0 && !activeEntryId) {
      setActiveEntryId(entries[0].id);
    }
  }, [selectedId, entries]);

  const pageBanner = siteConfig?.banner?.pageBanners?.research;
  const tagline = pageBanner?.tagline || 'Tư liệu điền dã & Khảo sát thực địa';
  const title = pageBanner?.title || 'Nhật ký nghiên cứu di sản';
  const description = pageBanner?.description || 'Hành trình ghi nhận thực địa, phỏng vấn nghệ nhân tiền bối, số hóa tư liệu âm thanh cổ và phục dựng không gian diễn xướng Quan họ Kinh Bắc.';
  const bgImage = pageBanner?.bgImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=75';

  // Sort entries by sortOrder ASC (smallest STT first)
  const sortedEntries = [...entries].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  const phases = ['Tất cả'];

  const filteredEntries = sortedEntries.filter(e => {
    return filterPhase === 'Tất cả' || e.phase === filterPhase;
  });

  const activeEntry = sortedEntries.find(e => String(e.id) === String(activeEntryId)) || sortedEntries[0];

  // Helper to safely parse findings array
  const getFindingsArray = (entry?: ResearchEntry): string[] => {
    if (!entry || !entry.findings) return [];
    if (Array.isArray(entry.findings)) return entry.findings;
    if (typeof entry.findings === 'string') {
      try { return JSON.parse(entry.findings); } catch { return [entry.findings]; }
    }
    return [];
  };

  // Helper to safely parse images array
  const getImagesArray = (entry?: ResearchEntry): string[] => {
    if (!entry || !entry.images) return [];
    if (Array.isArray(entry.images)) return entry.images;
    if (typeof entry.images === 'string') {
      try { return JSON.parse(entry.images); } catch { return [entry.images]; }
    }
    return [];
  };

  // Helper to safely parse and normalize Tiptap Editor HTML content
  const getContentHtml = (content: any): string => {
    if (!content) return '';
    if (Array.isArray(content)) {
      return content
        .map((item) => {
          if (typeof item !== 'string') return '';
          const trimmed = item.trim();
          if (trimmed.startsWith('<')) return trimmed;
          return `<p>${trimmed}</p>`;
        })
        .filter(Boolean)
        .join('');
    }
    if (typeof content === 'string') {
      const trimmed = content.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return parsed
              .map((item) => {
                if (typeof item !== 'string') return '';
                const t = item.trim();
                if (t.startsWith('<')) return t;
                return `<p>${t}</p>`;
              })
              .filter(Boolean)
              .join('');
          }
        } catch {
          // ignore
        }
      }
      return content;
    }
    return String(content);
  };

  return (
    <div id="research-diary-page" className="min-h-screen bg-[#FAF8F5] pb-24">

      {/* 1. Header Banner */}
      <div className="bg-[#2D1614] text-white py-14 sm:py-18 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={getOptimizedImageUrl(bgImage, 1200, 75)}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[#E5B567] text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{tagline}</span>
          </div>
          <h1 className="font-serif-culture text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-[#D4C8BE] max-w-2xl mt-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Phase Filter Tabs */}
        <div className="flex items-center space-x-2 pb-6 border-b border-[#E8DFC8] overflow-x-auto scrollbar-none">
          {phases.map((ph) => (
            <button
              key={ph}
              onClick={() => setFilterPhase(ph)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${filterPhase === ph
                  ? 'bg-[#8C2320] text-white shadow-xs'
                  : 'bg-[#F2EDE4] text-[#5C4D44] hover:bg-[#E5DDCF]'
                }`}
            >
              {ph}
            </button>
          ))}
        </div>

        {/* Two-Column Grid: Timeline List (Left) + Detailed Active Entry (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">

          {/* Left Column: Timeline Entries List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif-culture text-lg font-bold text-[#2D241E] pb-2 border-b border-[#E8DFC8]">
              Danh mục đợt khảo sát ({filteredEntries.length})
            </h3>

            <div className="space-y-3">
              {filteredEntries.map((entry) => {
                const isSelected = entry.id === activeEntry?.id;
                return (
                  <div
                    key={entry.id}
                    onClick={() => setActiveEntryId(entry.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${isSelected
                        ? 'bg-white border-[#8C2320] shadow-md ring-2 ring-[#8C2320]/20'
                        : 'bg-[#FAF6F0] border-[#E8DFC8] hover:bg-white hover:border-[#8C2320]/50'
                      }`}
                  >
                    <div className="flex items-center justify-between text-xs text-[#8C6B50] mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2 py-0.5 rounded-md font-bold bg-[#F4EFE6] text-[#8C2320] border border-[#E4DAC8]">
                          {entry.phase}
                        </span>
                        {entry.sortOrder !== undefined && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E8DFC8] text-[#4A3B32]">
                            STT #{entry.sortOrder}
                          </span>
                        )}
                      </div>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{entry.date}</span>
                      </span>
                    </div>

                    <h4 className={`font-serif-culture font-bold text-sm sm:text-base line-clamp-2 ${isSelected ? 'text-[#8C2320]' : 'text-[#2D241E]'}`}>
                      {entry.title}
                    </h4>

                    <p className="text-xs text-[#7A6B60] flex items-center space-x-1 mt-1.5 truncate">
                      <MapPin className="w-3 h-3 text-[#B83E3E] shrink-0" />
                      <span>{entry.location}</span>
                    </p>

                    {entry.summary && (
                      <p className="text-xs text-[#5C4D44] line-clamp-2 mt-2 leading-relaxed">
                        {entry.summary}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Entry Deep Dive */}
          {activeEntry && (
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-sm space-y-6">

              {/* Header Info */}
              <div className="space-y-3 pb-6 border-b border-[#E8DFC8]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#8C2320] text-white">
                      {activeEntry.phase}
                    </span>
                    {activeEntry.sortOrder !== undefined && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#F2EDE4] text-[#8C2320] border border-[#E8DFC8]">
                        STT #{activeEntry.sortOrder}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-[#8C6B50] flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeEntry.date}</span>
                  </span>
                </div>

                <h2 className="font-serif-culture text-xl sm:text-3xl font-bold text-[#2D241E] leading-snug">
                  {activeEntry.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#7A6B60] bg-[#FAF8F5] p-3 rounded-xl border border-[#EDE5D8]">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#8C2320] shrink-0" />
                    <span><strong>Địa bàn:</strong> {activeEntry.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#8C2320] shrink-0" />
                    <span><strong>Đoàn nghiên cứu:</strong> {activeEntry.researcher}</span>
                  </div>
                </div>
              </div>

              {/* Summary Highlight Box */}
              {activeEntry.summary && (
                <div className="p-4 bg-[#FAF4EB] border-l-4 border-[#8C2320] rounded-r-2xl text-xs sm:text-sm text-[#4A3B32] italic font-serif-culture leading-relaxed">
                  “{activeEntry.summary}”
                </div>
              )}

              {/* Audio Box if audioTitle present */}
              {activeEntry.audioTitle && (
                <div className="p-4 bg-[#FAF4EB] rounded-2xl border border-[#E5B567] flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#8C2320] text-white flex items-center justify-center shrink-0">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#8C2320]">Tư liệu thu âm điền dã</div>
                      <p className="text-xs sm:text-sm font-bold text-[#2D241E]">{activeEntry.audioTitle}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => audioPlayer.toggle(activeEntry.audioTitle!)}
                    className="px-4 py-2 rounded-full bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isPlayingAudio ? 'Tạm dừng' : 'Nghe tư liệu'}</span>
                  </button>
                </div>
              )}

              {/* Research Detailed Content */}
              {hasHtmlContent(activeEntry.content) && (
                <div className="space-y-3 text-sm text-[#4A3B32] leading-relaxed pt-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#8C2320]">Nội dung báo cáo điền dã chi tiết</h4>
                  <div
                    className="prose max-w-none text-sm text-[#4A3B32] leading-relaxed [&_p]:mb-3 [&_img]:rounded-xl [&_img]:my-3 [&_video]:rounded-xl [&_video]:w-full [&_video]:my-3 [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_table]:w-full [&_table]:border-collapse [&_th]:p-2.5 [&_th]:border [&_th]:border-[#E8DFC8] [&_th]:bg-[#FAF4EB] [&_td]:p-2.5 [&_td]:border [&_td]:border-[#E8DFC8]"
                    dangerouslySetInnerHTML={{ __html: formatHtmlContent(activeEntry.content) }}
                  />
                </div>
              )}

              {/* Key Findings List */}
              {getFindingsArray(activeEntry).length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#8C2320]">Kết quả & Tư liệu thu nhận</h4>
                  <ul className="space-y-2">
                    {getFindingsArray(activeEntry).map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EDE5D8]">
                        <CheckCircle className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Photo Evidence Gallery */}
              {getImagesArray(activeEntry).length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#8C2320]">Hình ảnh khảo sát thực tế</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getImagesArray(activeEntry).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Tư liệu điền dã"
                        className="w-full h-48 object-cover rounded-xl border border-[#E8DFC8]"
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
