import React from 'react';
import { SiteConfig, ViewState } from '../types';
import { Play, Sparkles, Compass, Music, ChevronRight } from 'lucide-react';
import { audioPlayer } from '../utils/audioSynth';

interface HomeHeroProps {
  siteConfig: SiteConfig;
  onNavigate: (view: ViewState) => void;
  isPlayingAudio: boolean;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  siteConfig,
  onNavigate,
  isPlayingAudio
}) => {
  const banner = siteConfig.banner;

  return (
    <section id="hero-banner-section" className="relative overflow-hidden bg-[#2D1614]">
      {/* Background Image with Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={banner.imageUrl || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85'}
          alt="Mạch Quan Họ - Di sản Kinh Bắc"
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-75 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C0E0C] via-[#1C0E0C]/60 to-black/30" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#8C2320]/15 to-[#1C0E0C]/80" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 min-h-[560px] flex flex-col justify-between">
        
        {/* Top Tagline */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5]/15 backdrop-blur-md border border-[#FAF8F5]/25 text-[#F5EDE8] text-xs font-semibold w-fit">
          <Sparkles className="w-3.5 h-3.5 text-[#E5B567]" />
          <span>Không gian văn hóa Dân ca Quan họ Bắc Ninh</span>
        </div>

        {/* Main Title & Subtitle */}
        <div className="my-8 max-w-3xl space-y-4">
          <h1 className="font-serif-culture text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-md">
            {banner.headline || 'MẠCH QUAN HỌ'}
          </h1>
          <p className="font-serif-culture text-xl sm:text-2xl lg:text-3xl font-medium text-[#E5B567] tracking-wide">
            {banner.subtitle || 'Giữ mạch di sản – Khơi mạch tương lai'}
          </p>
        </div>

        {/* Bottom Floating Info Card & Action CTAs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          
          {/* Intro Box */}
          <div className="lg:col-span-8 bg-[#FAF8F5]/95 backdrop-blur-md p-6 sm:p-7 rounded-2xl shadow-xl border border-[#E8DFC8] text-[#2D241E]">
            <div className="flex items-center space-x-2 text-[#8C2320] text-xs font-bold uppercase tracking-wider mb-2">
              <span>Hồn cốt Kinh Bắc</span>
              <span>•</span>
              <span>Di sản Nhân loại</span>
            </div>
            <p className="text-sm sm:text-base text-[#4A3B32] leading-relaxed mb-5">
              {banner.introText || 'Cổng thông tin chuyên biệt, số hóa tư liệu điền dã và tôn vinh nét đẹp Dân ca Quan họ Bắc Ninh - Di sản Văn hóa Phi vật thể đại diện của Nhân loại.'}
            </p>
            
            {/* Buttons Row */}
            <div className="flex flex-wrap gap-3 items-center">
              <button
                id="hero-explore-news-btn"
                onClick={() => onNavigate({ type: 'news' })}
                className="px-6 py-2.5 rounded-full bg-[#8C2320] hover:bg-[#6E1B19] text-white text-sm font-semibold shadow-md transition-all flex items-center space-x-2 cursor-pointer group"
              >
                <span>{banner.buttonText || 'Khám phá ngay'}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-play-audio-btn"
                onClick={() => audioPlayer.toggle('Hát giao duyên: Khách Đến Chơi Nhà')}
                className="px-5 py-2.5 rounded-full bg-[#F2EDE4] hover:bg-[#E4DCD0] text-[#6B201D] text-sm font-semibold border border-[#D9CEBA] transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Music className={`w-4 h-4 text-[#8C2320] ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>{isPlayingAudio ? 'Tạm dừng nhạc' : 'Nghe làn điệu'}</span>
              </button>

              <button
                id="hero-research-btn"
                onClick={() => onNavigate({ type: 'research-diary' })}
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#5C4D44] hover:text-[#8C2320] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                Xem Nhật ký nghiên cứu &rarr;
              </button>
            </div>
          </div>

          {/* Right Quote Badge */}
          <div className="lg:col-span-4 hidden lg:block bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-white/90 text-xs italic font-serif-culture leading-relaxed">
            <p>
              {banner.quote || '"Người ơi người ở đừng về - Câu hát ngàn xưa thắm đượm tình người đất Bắc."'}
            </p>
            <div className="mt-2 text-[11px] text-[#E5B567] not-italic font-sans font-semibold">
              — Dân ca Quan họ Bắc Ninh
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
