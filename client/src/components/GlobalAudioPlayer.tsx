import React from 'react';
import { Play, Pause, Volume2, X, Music, Disc } from 'lucide-react';
import { audioPlayer } from '../utils/audioSynth';

interface GlobalAudioPlayerProps {
  isPlaying: boolean;
  trackName: string;
  progress: number;
}

export const GlobalAudioPlayer: React.FC<GlobalAudioPlayerProps> = ({
  isPlaying,
  trackName,
  progress
}) => {
  if (!trackName && !isPlaying) return null;

  return (
    <div 
      id="global-floating-audio-bar" 
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#241715]/95 text-white p-3.5 rounded-2xl shadow-2xl border border-[#7A2320]/80 backdrop-blur-md transition-all duration-300 animate-slideUp"
    >
      <div className="flex items-center space-x-3">
        
        {/* Disc icon spinning */}
        <div className="relative shrink-0">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-[#8C2320] to-[#E5B567] flex items-center justify-center shadow-md ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
            <Disc className="w-5 h-5 text-white" />
          </div>
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          )}
        </div>

        {/* Track Title & Subtext */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5B567]">Làn điệu Quan họ</span>
          </div>
          <p className="text-xs font-semibold text-white truncate" title={trackName}>
            {trackName || 'Làn điệu dân ca Quan họ Bắc Ninh'}
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-[#4A322C] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#B83E3E] to-[#E5B567] h-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            id="global-audio-toggle-btn"
            onClick={() => audioPlayer.toggle(trackName || 'Hát giao duyên: Khách Đến Chơi Nhà')}
            className="p-2 rounded-full bg-[#8C2320] hover:bg-[#A82D2A] text-white transition-colors cursor-pointer"
            title={isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          
          <button
            id="global-audio-close-btn"
            onClick={() => audioPlayer.stop()}
            className="p-1.5 rounded-full text-[#A8988B] hover:text-white hover:bg-[#3D2824] transition-colors cursor-pointer"
            title="Đóng phát nhạc"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
