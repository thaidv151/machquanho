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
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#0A3326]/95 text-white p-3.5 rounded-2xl shadow-2xl border border-[#D4A25A]/40 backdrop-blur-md transition-all duration-300 animate-slideUp"
    >
      <div className="flex items-center space-x-3">
        
        {/* Disc icon spinning */}
        <div className="relative shrink-0">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-[#114D3A] via-[#8C2F2F] to-[#D4A25A] flex items-center justify-center shadow-md ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
            <Disc className="w-5 h-5 text-white" />
          </div>
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A25A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4A25A]"></span>
            </span>
          )}
        </div>

        {/* Track Title & Subtext */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A25A]">Làn điệu Quan họ</span>
          </div>
          <p className="text-xs font-semibold text-white truncate" title={trackName}>
            {trackName || 'Làn điệu dân ca Quan họ Bắc Ninh'}
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-[#114D3A]/60 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#8C2F2F] to-[#D4A25A] h-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            id="global-audio-toggle-btn"
            onClick={() => audioPlayer.toggle(trackName || 'Hát giao duyên: Khách Đến Chơi Nhà')}
            className="p-2 rounded-full bg-[#8C2F2F] hover:bg-[#A83838] text-white transition-colors cursor-pointer shadow-xs"
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
