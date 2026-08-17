import React from 'react';
import { ExploreTopic } from '../types';
import { X, Sparkles, CheckCircle2, Music, Play, Compass } from 'lucide-react';
import { audioPlayer } from '../utils/audioSynth';

interface ExploreTopicModalProps {
  topic: ExploreTopic | null;
  onClose: () => void;
  isPlayingAudio: boolean;
}

export const ExploreTopicModal: React.FC<ExploreTopicModalProps> = ({
  topic,
  onClose,
  isPlayingAudio
}) => {
  if (!topic) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-6 animate-scaleUp border border-[#E8DFC8]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF8F5] hover:bg-[#EAE1D2] text-[#4A3B32] transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Cover */}
        <div className="relative h-56 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 overflow-hidden rounded-t-3xl bg-[#2D1614]">
          <img
            src={topic.image}
            alt={topic.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#8C2320] text-white">
              {topic.badge}
            </span>
            <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold mt-1 text-white">
              {topic.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#E5B567]">
              {topic.subtitle}
            </p>
          </div>
        </div>

        {/* Description Body */}
        <div className="space-y-3 text-sm text-[#4A3B32] leading-relaxed">
          <p className="text-base text-[#2D241E] font-medium">{topic.description}</p>
        </div>

        {/* Highlights tags */}
        <div className="space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#8C2320]">Điểm nhấn cốt lõi</h4>
          <div className="flex flex-wrap gap-2">
            {topic.highlights.map((h, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-[#FAF4EB] border border-[#E5B567] text-xs font-semibold text-[#8C2320]">
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Detailed Points */}
        <div className="space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#8C2320]">Nội dung chi tiết</h4>
          <ul className="space-y-2">
            {topic.details.map((detail, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-[#4A3B32]">
                <CheckCircle2 className="w-4 h-4 text-[#8C2320] shrink-0 mt-0.5" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Audio interaction */}
        <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#EDE5D8] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#8C2320] text-white flex items-center justify-center">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#2D241E]">Làn điệu minh họa</p>
              <p className="text-[11px] text-[#7A6B60]">Bèo Dạt Mây Trôi / Khách Đến Chơi Nhà</p>
            </div>
          </div>

          <button
            onClick={() => audioPlayer.toggle(`Chuyên đề: ${topic.title}`)}
            className="px-4 py-2 rounded-full bg-[#8C2320] text-white text-xs font-bold hover:bg-[#6E1B19] transition-colors flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPlayingAudio ? 'Tạm dừng' : 'Nghe giai điệu'}</span>
          </button>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[#E8DFC8] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#8C2320] hover:bg-[#6E1B19] text-white rounded-full text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng chuyên đề
          </button>
        </div>

      </div>
    </div>
  );
};
