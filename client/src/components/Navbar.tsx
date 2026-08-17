import React, { useState } from 'react';
import { ViewState, SiteConfig } from '../types';
import { Search, Shield, Music, Menu, X, Sparkles, BookOpen, Newspaper, Users, Home } from 'lucide-react';
import { audioPlayer } from '../utils/audioSynth';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  siteConfig: SiteConfig;
  isPlayingAudio: boolean;
  currentAudioTrack: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  siteConfig,
  isPlayingAudio,
  currentAudioTrack
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const navItems = [
    { label: 'Trang chủ', view: { type: 'home' } as ViewState, icon: Home },
    { label: 'Tin tức & Hoạt động', view: { type: 'news' } as ViewState, icon: Newspaper },
    { label: 'Nhật ký nghiên cứu', view: { type: 'research-diary' } as ViewState, icon: BookOpen },
    { label: 'Về chúng tôi', view: { type: 'about' } as ViewState, icon: Users }
  ];

  const isActive = (itemType: string) => {
    return currentView.type === itemType;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onNavigate({ type: 'news', searchQuery: searchVal.trim() });
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  return (
    <>
      {/* Top Heritage Accent Bar */}
      <div id="top-heritage-bar" className="bg-[#7A1F1D] text-[#F9EFE6] text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E5B567] animate-pulse"></span>
            <span>Di sản Văn hóa Phi vật thể đại diện của Nhân loại - UNESCO 2009</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-[#F1D8B4]">Kinh Bắc - Vùng đất địa linh nhân kiệt</span>
            <span className="text-[#A24442]">|</span>
            <button 
              id="header-listen-cta"
              onClick={() => audioPlayer.toggle('Hát giao duyên: Khách Đến Chơi Nhà')}
              className="flex items-center space-x-1 hover:text-[#E5B567] transition-colors cursor-pointer"
            >
              <Music className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-[#E5B567] animate-bounce' : ''}`} />
              <span>{isPlayingAudio ? 'Đang phát làn điệu' : 'Nghe Quan họ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header id="main-header" className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFC8]/70 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div 
              id="site-brand-logo"
              onClick={() => onNavigate({ type: 'home' })}
              className="flex items-center space-x-3.5 cursor-pointer group select-none"
            >
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#8C2320] to-[#B83E3E] flex items-center justify-center text-[#F9EFE6] shadow-sm border border-[#6B1B18] group-hover:scale-105 transition-transform">
                <span className="font-serif-culture text-xl font-bold tracking-tight">MQ</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif-culture text-xl sm:text-2xl font-bold tracking-tight text-[#3A1E16] group-hover:text-[#8C2320] transition-colors">
                  {siteConfig.logoText || 'MẠCH QUAN HỌ'}
                </span>
                <span className="text-[10.5px] uppercase tracking-widest font-semibold text-[#8C6B50]">
                  {siteConfig.logoSubtext || 'Kinh Bắc Di Sản'}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav id="desktop-nav-menu" className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item, idx) => {
                const active = isActive(item.view.type);
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    id={`nav-link-${item.view.type}`}
                    onClick={() => onNavigate(item.view)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                      active
                        ? 'bg-[#8C2320] text-white shadow-sm font-semibold'
                        : 'text-[#4A3B32] hover:text-[#8C2320] hover:bg-[#F0EBE1]'
                    }`}
                  >
                    <Icon className="w-4 h-4 opacity-80" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Tools & Admin Switcher */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Button */}
              <button
                id="search-toggle-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full text-[#4A3B32] hover:text-[#8C2320] hover:bg-[#EFEAE1] transition-colors cursor-pointer"
                title="Tìm kiếm bài viết"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Admin Portal Toggle Button */}
              <button
                id="admin-portal-nav-btn"
                onClick={() => onNavigate({ type: 'admin', section: 'dashboard' })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer border ${
                  currentView.type === 'admin'
                    ? 'bg-[#1E293B] text-white border-[#0F172A] shadow-inner ring-2 ring-[#B83E3E]'
                    : 'bg-[#F4EFE6] text-[#6B2825] border-[#E2D6C3] hover:bg-[#EAE1D2] hover:border-[#C43632]'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[#B83E3E]" />
                <span className="hidden sm:inline">Quản trị CMS</span>
                <span className="sm:hidden">Admin</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-[#4A3B32] hover:bg-[#EFEAE1] transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Search Popdown Bar */}
        {searchOpen && (
          <div id="quick-search-bar" className="border-t border-[#E8DFC8] bg-[#F7F3EC] py-3 px-4 shadow-sm animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6B50]" />
                <input
                  type="text"
                  placeholder="Tìm kiếm làn điệu, bài viết, lễ hội, nghệ nhân Làng Diềm..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#D9CEBA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8C2320] focus:border-transparent text-[#3A1E16]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#8C2320] hover:bg-[#6E1B19] rounded-full transition-colors cursor-pointer"
              >
                Tìm
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-[#8C6B50] hover:text-[#3A1E16] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-nav-drawer" className="lg:hidden border-t border-[#E8DFC8] bg-[#FAF8F5] py-4 px-4 shadow-lg space-y-2">
            {navItems.map((item, idx) => {
              const active = isActive(item.view.type);
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#8C2320] text-white font-semibold'
                      : 'text-[#4A3B32] hover:bg-[#EFEAE1]'
                  }`}
                >
                  <Icon className="w-5 h-5 opacity-80" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-3 border-t border-[#E8DFC8]">
              <button
                onClick={() => {
                  onNavigate({ type: 'admin', section: 'dashboard' });
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E293B] text-white text-sm font-semibold hover:bg-black transition-colors"
              >
                <Shield className="w-4 h-4 text-[#E5B567]" />
                <span>Trang Quản trị Hệ thống (Admin Portal)</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
