import React, { useState } from 'react';
import { ResearchEntry, ViewState } from '../types';
import { BookOpen, MapPin, Calendar, Mic, Archive, Users, CheckCircle, Music, Play, Sparkles, ArrowLeft, Download, Volume2 } from 'lucide-react';
import { audioPlayer } from '../utils/audioSynth';

interface ResearchDiaryPageProps {
  entries: ResearchEntry[];
  selectedId?: string;
  onNavigate: (view: ViewState) => void;
  isPlayingAudio: boolean;
}

export const ResearchDiaryPage: React.FC<ResearchDiaryPageProps> = ({
  entries,
  selectedId,
  onNavigate,
  isPlayingAudio
}) => {
  const [activeEntryId, setActiveEntryId] = useState<string>(selectedId || entries[0]?.id || '');
  const [filterPhase, setFilterPhase] = useState<string>('Tất cả');

  const phases = ['Tất cả', 'Giai đoạn 1', 'Giai đoạn 2', 'Giai đoạn 3'];

  const filteredEntries = entries.filter(e => {
    return filterPhase === 'Tất cả' || e.phase === filterPhase;
  });

  const activeEntry = entries.find(e => e.id === activeEntryId) || filteredEntries[0] || entries[0];

  return (
    <div id="research-diary-page" className="min-h-screen bg-[#FAF8F5] pb-24">
      
      {/* 1. Header Banner */}
      <div className="bg-[#2D1614] text-white py-14 sm:py-18 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
            alt="Nhật ký nghiên cứu"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[#E5B567] text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tư liệu điền dã & Khảo sát thực địa</span>
          </div>
          <h1 className="font-serif-culture text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Nhật ký nghiên cứu di sản
          </h1>
          <p className="text-sm sm:text-base text-[#D4C8BE] max-w-2xl mt-2 leading-relaxed">
            Hành trình ghi nhận thực địa, phỏng vấn nghệ nhân tiền bối, số hóa tư liệu âm thanh cổ và phục dựng không gian diễn xướng Quan họ Kinh Bắc.
          </p>
        </div>
      </div>

      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Phase Filter Tabs */}
        <div className="flex items-center space-x-2 pb-6 border-b border-[#E8DFC8] overflow-x-auto scrollbar-none">
          {phases.map((ph) => (
            <button
              key={ph}
              onClick={() => setFilterPhase(ph)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                filterPhase === ph
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
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#8C2320] shadow-md ring-2 ring-[#8C2320]/20'
                        : 'bg-[#FAF6F0] border-[#E8DFC8] hover:bg-white hover:border-[#8C2320]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-[#8C6B50] mb-1.5">
                      <span className="px-2 py-0.5 rounded-md font-bold bg-[#F4EFE6] text-[#8C2320] border border-[#E4DAC8]">
                        {entry.phase}
                      </span>
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

                    <p className="text-xs text-[#5C4D44] line-clamp-2 mt-2 leading-relaxed">
                      {entry.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Entry Deep Dive */}
          {activeEntry && (
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFC8] shadow-sm space-y-6">
              
              {/* Header */}
              <div className="space-y-3 pb-6 border-b border-[#E8DFC8]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#8C2320] text-white">
                    {activeEntry.phase}
                  </span>
                  <span className="text-xs font-medium text-[#8C6B50] flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeEntry.date}</span>
                  </span>
                </div>

                <h2 className="font-serif-culture text-xl sm:text-3xl font-bold text-[#2D241E] leading-snug">
                  {activeEntry.title}
                </h2>

                <div className="flex items-center space-x-2 text-xs sm:text-sm text-[#7A6B60] bg-[#FAF8F5] p-3 rounded-xl border border-[#EDE5D8]">
                  <MapPin className="w-4 h-4 text-[#8C2320] shrink-0" />
                  <span><strong>Địa bàn:</strong> {activeEntry.location}</span>
                </div>

                <p className="text-xs text-[#8C6B50]">
                  <strong>Chủ nhiệm đề tài:</strong> {activeEntry.researcher}
                </p>
              </div>

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

              {/* Research Notes & Findings */}
              <div className="space-y-4 text-sm text-[#4A3B32] leading-relaxed">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#8C2320]">Mô tả quá trình điền dã</h4>
                <p>{activeEntry.content}</p>

                <h4 className="font-bold text-xs uppercase tracking-wider text-[#8C2320] pt-2">Kết quả & Tư liệu thu nhận</h4>
                <ul className="space-y-2">
                  {activeEntry.findings.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm">
                      <CheckCircle className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Photo Evidence */}
              {activeEntry.images && activeEntry.images.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#8C2320]">Hình ảnh khảo sát thực tế</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeEntry.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Tư liệu điền dã"
                        className="w-full h-44 object-cover rounded-xl border border-[#E8DFC8]"
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
