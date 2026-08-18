import React, { useState, useEffect } from 'react';
import { SiteConfig, ViewState, BannerSlideItem, BannerButtonItem } from '../types';
import {
  Play, Sparkles, Music, ChevronRight, ChevronLeft, BookOpen, Users, Globe, ArrowRight, ExternalLink
} from 'lucide-react';
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
  const isSliderMode = banner.mode === 'slider';

  const defaultSlideFromBanner: BannerSlideItem = {
    id: 'slide-default',
    imageUrl: banner.imageUrl || '',
    tagline: banner.tagline || '',
    taglineFontSize: banner.taglineFontSize || 'base',
    headline: banner.headline || '',
    headlineFontSize: banner.headlineFontSize || '6xl',
    subtitle: banner.subtitle || '',
    subtitleFontSize: banner.subtitleFontSize || '2xl',
    introText: banner.introText || '',
    introFontSize: banner.introFontSize || 'base',
    buttonText: banner.buttonText || '',
    quote: banner.quote || '',
    textAlign: banner.textAlign || 'left',
    buttons: banner.buttons,
  };

  const slides: BannerSlideItem[] = isSliderMode
    ? (Array.isArray(banner.slides) && banner.slides.length > 0 ? banner.slides : (banner.imageUrl || banner.headline ? [defaultSlideFromBanner] : []))
    : [];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto Slider Timer
  useEffect(() => {
    if (!isSliderMode || banner.autoPlay === false || slides.length <= 1) return;

    const speedMs = (banner.intervalSpeed || 5) * 1000;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, speedMs);

    return () => clearInterval(timer);
  }, [isSliderMode, banner.autoPlay, banner.intervalSpeed, slides.length]);

  // Determine current active display data
  const currentSlide: BannerSlideItem | null = isSliderMode && slides.length > 0 ? slides[currentSlideIndex] : null;

  const currentImageUrl = currentSlide ? currentSlide.imageUrl : banner.imageUrl;
  const currentTagline = currentSlide ? currentSlide.tagline : banner.tagline;
  const currentTaglineFontSize = currentSlide?.taglineFontSize || banner.taglineFontSize || 'base';

  const currentHeadline = currentSlide ? currentSlide.headline : banner.headline;
  const currentHeadlineFontSize = currentSlide?.headlineFontSize || banner.headlineFontSize || '6xl';

  const currentSubtitle = currentSlide ? currentSlide.subtitle : banner.subtitle;
  const currentSubtitleFontSize = currentSlide?.subtitleFontSize || banner.subtitleFontSize || '2xl';

  const currentIntroText = currentSlide ? currentSlide.introText : banner.introText;
  const currentIntroFontSize = currentSlide?.introFontSize || banner.introFontSize || 'base';

  const currentQuote = currentSlide ? currentSlide.quote : banner.quote;
  const currentTextAlign = (currentSlide ? currentSlide.textAlign : banner.textAlign) || 'left';

  const currentSlideEffect = currentSlide?.slideEffect || banner.slideEffect || 'fade';
  const currentTextAnimation = currentSlide?.textAnimation || banner.textAnimation || 'slideUp';

  const getSlideEffectClass = () => {
    switch (currentSlideEffect) {
      case 'slide-left': return 'animate-slideLeft';
      case 'slide-right': return 'animate-slideRight';
      case 'zoom': return 'animate-zoomIn';
      default: return 'animate-fadeIn';
    }
  };

  const getTextAnimationClass = () => {
    switch (currentTextAnimation) {
      case 'fadeIn': return 'animate-fadeIn';
      case 'slideDown': return 'animate-slideDown';
      case 'zoomIn': return 'animate-zoomIn';
      case 'bounce': return 'animate-bounceIn';
      default: return 'animate-slideUp';
    }
  };

  // Dynamic Buttons List Retrieval
  const activeButtons: BannerButtonItem[] = (() => {
    if (currentSlide?.buttons && currentSlide.buttons.length > 0) {
      return currentSlide.buttons;
    }
    if (banner.buttons && banner.buttons.length > 0) {
      return banner.buttons;
    }
    // Fallback legacy buttons only if text exists
    const legacyBtns: BannerButtonItem[] = [];
    const btn1Text = currentSlide ? currentSlide.buttonText : banner.buttonText;
    if ((currentSlide ? currentSlide.showButton !== false : true) && btn1Text && btn1Text.trim() !== '') {
      legacyBtns.push({
        id: 'legacy-btn-1',
        text: btn1Text,
        icon: currentSlide?.buttonIcon || 'ChevronRight',
        link: (currentSlide ? currentSlide.buttonLink : banner.buttonLink) || 'news',
        bgColor: '#8C2320',
        textColor: '#FFFFFF',
      });
    }
    const btn2Text = currentSlide?.button2Text;
    if (currentSlide && currentSlide.showButton2 === true && btn2Text && btn2Text.trim() !== '') {
      legacyBtns.push({
        id: 'legacy-btn-2',
        text: btn2Text,
        icon: currentSlide?.button2Icon || 'Music',
        link: currentSlide?.button2Link || 'audio-play',
        bgColor: '#F2EDE4',
        textColor: '#6B201D',
      });
    }
    return legacyBtns;
  })();

  // Height Styling
  const getHeightClass = () => {
    switch (banner.height) {
      case 'small': return 'min-h-[450px] py-12';
      case 'large': return 'min-h-[700px] py-20 sm:py-28';
      case 'full': return 'min-h-screen py-24 flex flex-col justify-center';
      default: return 'min-h-[600px] py-16 sm:py-20 lg:py-24'; // medium
    }
  };

  // Alignment Styling
  const getAlignClass = () => {
    switch (currentTextAlign) {
      case 'center':
        return {
          container: 'items-center text-center mx-auto',
          buttons: 'justify-center',
          box: 'mx-auto text-center',
          maxW: 'mx-auto max-w-4xl',
        };
      case 'right':
        return {
          container: 'items-end text-right ml-auto',
          buttons: 'justify-end',
          box: 'ml-auto text-right',
          maxW: 'ml-auto max-w-4xl',
        };
      default:
        return {
          container: 'items-start text-left mr-auto',
          buttons: 'justify-start',
          box: 'mr-auto text-left',
          maxW: 'mr-auto max-w-4xl',
        };
    }
  };

  const alignStyle = getAlignClass();

  // Dynamic Font Size Classes Mapping
  const getTaglineFontSizeClass = () => {
    switch (currentTaglineFontSize) {
      case 'xs': return 'text-[11px] sm:text-xs';
      case 'sm': return 'text-xs sm:text-sm';
      case 'base': return 'text-sm sm:text-base';
      case 'lg': return 'text-base sm:text-lg';
      case 'xl': return 'text-lg sm:text-xl';
      case '2xl': return 'text-xl sm:text-2xl';
      case 'small': return 'text-[11px] sm:text-xs';
      case 'large': return 'text-sm sm:text-base';
      default: return 'text-xs sm:text-sm';
    }
  };

  const getHeadlineFontSizeClass = () => {
    switch (currentHeadlineFontSize) {
      case '2xl': return 'text-xl sm:text-2xl lg:text-3xl';
      case '3xl': return 'text-2xl sm:text-3xl lg:text-4xl';
      case '4xl': return 'text-3xl sm:text-4xl lg:text-5xl';
      case '5xl': return 'text-4xl sm:text-5xl lg:text-6xl';
      case '6xl': return 'text-5xl sm:text-6xl lg:text-7xl';
      case '7xl': return 'text-6xl sm:text-7xl lg:text-8xl';
      case '8xl': return 'text-7xl sm:text-8xl lg:text-9xl';
      case 'normal': return 'text-3xl sm:text-4xl lg:text-5xl';
      case 'huge': return 'text-6xl sm:text-7xl lg:text-8xl';
      default: return 'text-4xl sm:text-6xl lg:text-7xl'; // large
    }
  };

  const getSubtitleFontSizeClass = () => {
    switch (currentSubtitleFontSize) {
      case 'sm': return 'text-xs sm:text-sm lg:text-base';
      case 'base': return 'text-sm sm:text-base lg:text-lg';
      case 'lg': return 'text-base sm:text-lg lg:text-xl';
      case 'xl': return 'text-lg sm:text-xl lg:text-2xl';
      case '2xl': return 'text-xl sm:text-2xl lg:text-3xl';
      case '3xl': return 'text-2xl sm:text-3xl lg:text-4xl';
      case '4xl': return 'text-3xl sm:text-4xl lg:text-5xl';
      case 'normal': return 'text-base sm:text-lg lg:text-xl';
      case 'huge': return 'text-2xl sm:text-3xl lg:text-4xl';
      default: return 'text-xl sm:text-2xl lg:text-3xl';
    }
  };

  const getIntroFontSizeClass = () => {
    switch (currentIntroFontSize) {
      case 'xs': return 'text-xs';
      case 'sm': return 'text-xs sm:text-sm';
      case 'base': return 'text-sm sm:text-base';
      case 'lg': return 'text-base sm:text-lg';
      case 'xl': return 'text-lg sm:text-xl';
      case 'small': return 'text-xs sm:text-sm';
      case 'large': return 'text-base sm:text-lg';
      default: return 'text-sm sm:text-base';
    }
  };

  const handlePrevSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Play': return <Play className="w-4 h-4" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Music': return <Music className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Users': return <Users className="w-4 h-4" />;
      case 'Globe': return <Globe className="w-4 h-4" />;
      case 'ArrowRight': return <ArrowRight className="w-4 h-4" />;
      case 'ExternalLink': return <ExternalLink className="w-4 h-4" />;
      default: return <ChevronRight className="w-4 h-4" />;
    }
  };

  const handleButtonClick = (link?: string) => {
    if (!link) return;
    const cleanLink = link.trim();
    if (cleanLink === 'audio-play') {
      audioPlayer.toggle('Hát giao duyên: Khách Đến Chơi Nhà');
      return;
    }
    if (cleanLink.startsWith('http://') || cleanLink.startsWith('https://')) {
      window.open(cleanLink, '_blank');
      return;
    }
    const route = cleanLink.startsWith('/') ? cleanLink.slice(1) : cleanLink;
    if (route === 'news' || route === 'research-diary' || route === 'about' || route === 'home' || route === '') {
      onNavigate({ type: (route || 'home') as any });
      return;
    }
    onNavigate({ type: 'news' });
  };

  const hasTagline = Boolean(currentTagline && currentTagline.trim() !== '');
  const hasTitleOrSub = Boolean((currentHeadline && currentHeadline.trim() !== '') || (currentSubtitle && currentSubtitle.trim() !== ''));
  const hasIntroOrBtns = Boolean((currentIntroText && currentIntroText.trim() !== '') || activeButtons.length > 0);
  const hasQuote = Boolean(currentQuote && currentQuote.trim() !== '');

  return (
    <section id="hero-banner-section" className="relative overflow-hidden bg-[#0A3326] transition-all">
      {/* Background Image with Dynamic Fade */}
      <div className="absolute inset-0 z-0">
        {currentImageUrl ? (
          <img
            key={currentImageUrl}
            src={currentImageUrl}
            alt="Mạch Quan Họ Banner"
            className={`w-full h-full object-cover object-center transform scale-105 filter brightness-75 contrast-105 transition-all duration-700 ${getSlideEffectClass()}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0A3326] via-[#114D3A] to-[#8C2F2F]/40" />
        )}

      </div>

      {/* Slider Prev / Next Controls */}
      {isSliderMode && slides.length > 1 && (
        <>
          <button
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-[#114D3A] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-xl backdrop-blur-md hover:scale-110"
            title="Slide trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-[#114D3A] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-xl backdrop-blur-md hover:scale-110"
            title="Slide tiếp theo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Bottom Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${idx === currentSlideIndex
                    ? 'w-8 bg-[#114D3A] shadow-md border border-[#D4A25A]'
                    : 'w-2.5 bg-white/40 hover:bg-white/80'
                  }`}
                title={`Slide #${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Hero Content Container - Aligned higher at ~2/8 from top */}
      <div className={`relative z-10 max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 ${getHeightClass()} flex items-start pt-14 sm:pt-20 lg:pt-24 pb-12`}>
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Floating Content (Staggered Sequential Entrance Animations) */}
          {(hasTagline || hasTitleOrSub || hasIntroOrBtns) && (
            <div key={currentSlideIndex} className={`${hasQuote ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6 ${alignStyle.box}`}>

              {/* Top Tagline Badge */}
              {hasTagline && (
                <div
                  className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#114D3A]/70 backdrop-blur-md border border-[#D4A25A]/40 text-[#F2E9DD] font-semibold w-fit ${alignStyle.container} ${getTaglineFontSizeClass()} ${getTextAnimationClass()}`}
                  style={{ animationDelay: '100ms' }}
                >
                  <Sparkles className="w-4 h-4 text-[#D4A25A]" />
                  <span>{currentTagline}</span>
                </div>
              )}

              {/* Main Title & Subtitle */}
              {hasTitleOrSub && (
                <div className={`space-y-3 flex flex-col ${alignStyle.container}`}>
                  {currentHeadline && currentHeadline.trim() !== '' && (
                    <h1
                      className={`font-serif-culture font-bold tracking-tight text-white drop-shadow-md transition-all max-w-5xl ${alignStyle.maxW} ${getHeadlineFontSizeClass()} ${getTextAnimationClass()}`}
                      style={{ animationDelay: '250ms' }}
                    >
                      {currentHeadline}
                    </h1>
                  )}
                  {currentSubtitle && currentSubtitle.trim() !== '' && (
                    <p
                      className={`font-serif-culture font-medium text-[#D4A25A] tracking-wide transition-all max-w-3xl sm:max-w-4xl ${alignStyle.maxW} ${getSubtitleFontSizeClass()} ${getTextAnimationClass()}`}
                      style={{ animationDelay: '400ms' }}
                    >
                      {currentSubtitle}
                    </p>
                  )}
                </div>
              )}

              {/* Intro Text */}
              {currentIntroText && currentIntroText.trim() !== '' && (
                <p
                  className={`text-[#F2E9DD] drop-shadow-md leading-relaxed font-normal max-w-3xl ${alignStyle.maxW} ${getIntroFontSizeClass()} ${getTextAnimationClass()}`}
                  style={{ animationDelay: '550ms' }}
                >
                  {currentIntroText}
                </p>
              )}

              {/* Action Buttons Row */}
              {activeButtons.length > 0 && (
                <div
                  className={`flex flex-wrap gap-3.5 items-center pt-2 ${alignStyle.buttons} ${getTextAnimationClass()}`}
                  style={{ animationDelay: '700ms' }}
                >
                  {activeButtons.map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => handleButtonClick(btn.link)}
                      className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center space-x-2.5 cursor-pointer hover:scale-105 hover:shadow-xl border border-white/20"
                      style={{
                        backgroundColor: btn.bgColor || '#114D3A',
                        color: btn.textColor || '#FFFFFF',
                      }}
                    >
                      <span>{btn.link === 'audio-play' && isPlayingAudio ? 'Tạm dừng nhạc' : btn.text}</span>
                      {renderIcon(btn.icon)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Right Column: Floating Quote Card */}
          {hasQuote && (
            <div
              key={`quote-${currentSlideIndex}`}
              className={`${(hasTagline || hasTitleOrSub || hasIntroOrBtns) ? 'lg:col-span-4' : 'lg:col-span-6'} hidden lg:block bg-[#0A3326]/85 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-[#D4A25A]/30 text-white/95 shadow-2xl font-serif-culture leading-relaxed ${getTextAnimationClass()}`}
              style={{ animationDelay: '850ms' }}
            >
              <div className="text-xs uppercase tracking-widest text-[#D4A25A] font-sans font-bold mb-3 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#D4A25A]" />
                <span>Trích dẫn Quan họ</span>
              </div>
              <p className="text-sm sm:text-base italic leading-relaxed text-[#F2E9DD]">
                {currentQuote}
              </p>
              <div className="mt-4 pt-3 border-t border-white/10 text-xs text-[#D4A25A] not-italic font-sans font-semibold">
                — Dân ca Quan họ Bắc Ninh
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
