import React, { useState, useRef, useEffect } from 'react';
import { ViewState, SiteConfig, AdminUser, HeaderNavItem } from '../types';
import {
  Search, Shield, Music, Menu, X, LogOut, BookOpen, Newspaper, Users, Home,
  ChevronDown, Sparkles, Globe, Bookmark, Award, Calendar, Clock, MapPin
} from 'lucide-react';
import { audioPlayer } from '../utils/audioSynth';
import { apiService } from '../services/apiService';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  siteConfig: SiteConfig;
  isPlayingAudio: boolean;
  currentAudioTrack: string;
  currentUser?: AdminUser | null;
  onLogout?: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Home,
  Newspaper,
  BookOpen,
  Users,
  Sparkles,
  Music,
  Globe,
  Bookmark,
  Award,
  Calendar,
  Clock,
  MapPin,
  Map: MapPin,
};

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  siteConfig,
  isPlayingAudio,
  currentAudioTrack,
  currentUser,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [dbMenuItems, setDbMenuItems] = useState<HeaderNavItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    apiService.getMenuItems().then((data) => {
      if (isMounted && data && data.length > 0) {
        setDbMenuItems(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Header configs from siteConfig
  const headerConfig = siteConfig.header || {
    topNoticeText: 'Di sản Văn hóa Phi vật thể đại diện của Nhân loại - UNESCO 2009',
    topSubText: 'Kinh Bắc - Vùng đất địa linh nhân kiệt',
    topAudioCtaText: 'Nghe Quan họ',
  };

  const navItemsList = dbMenuItems.length > 0
    ? dbMenuItems
    : (siteConfig.header?.navItems || [
      { id: 'nav-1', label: 'Trang chủ', viewType: '/', icon: 'Home' },
      { id: 'nav-2', label: 'Tin tức & Hoạt động', viewType: '/news', icon: 'Newspaper' },
      { id: 'nav-3', label: 'Nghe Quan họ', viewType: '/nghe-quan-ho', icon: 'Music' },
      { id: 'nav-4', label: 'Nhật ký nghiên cứu', viewType: '/research-diary', icon: 'BookOpen' },
      { id: 'nav-5', label: 'Dòng chảy Quan họ', viewType: '/timeline', icon: 'Calendar' },
      { id: 'nav-6', label: 'Bản đồ di sản', viewType: '/map', icon: 'MapPin' },
      { id: 'nav-7', label: 'Về chúng tôi', viewType: '/about', icon: 'Users' }
    ]);

  const resolveViewState = (viewTypeRaw: string): ViewState => {
    if (!viewTypeRaw) return { type: 'home' };
    const clean = viewTypeRaw.trim().toLowerCase();

    if (clean === 'home' || clean === '/' || clean === '') return { type: 'home' };
    if (clean === 'news' || clean === '/news') return { type: 'news' };
    if (clean === 'nghe-quan-ho' || clean === '/nghe-quan-ho' || clean === '/audio' || clean === '/podcast') return { type: 'nghe-quan-ho' };
    if (clean === 'research-diary' || clean === '/research-diary') return { type: 'research-diary' };
    if (clean === 'about' || clean === '/about') return { type: 'about' };
    if (clean === 'timeline' || clean === '/timeline' || clean === '/dong-chay-quan-ho') return { type: 'timeline' };
    if (clean === 'map' || clean === '/map' || clean === '/ban-do-di-san') return { type: 'map' };
    if (clean.startsWith('/admin') || clean === 'admin') return { type: 'admin', section: 'dashboard' };

    if (clean.startsWith('/')) {
      const main = clean.split('?')[0].split('/')[1];
      if (main === 'news') return { type: 'news' };
      if (main === 'nghe-quan-ho') return { type: 'nghe-quan-ho' };
      if (main === 'research-diary') return { type: 'research-diary' };
      if (main === 'timeline') return { type: 'timeline' };
      if (main === 'map') return { type: 'map' };
      if (main === 'about') return { type: 'about' };
    }

    return { type: 'home' };
  };

  const isActive = (itemType: string) => {
    const target = resolveViewState(itemType);
    return currentView.type === target.type;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onNavigate({ type: 'news', searchQuery: searchVal.trim() });
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  const renderItemIcon = (item: HeaderNavItem) => {
    if (item.customIconUrl) {
      return <img src={item.customIconUrl} alt={item.label} className="w-3.5 h-3.5 object-contain shrink-0" />;
    }
    const IconComponent = ICON_MAP[item.icon || 'Home'] || Home;
    return <IconComponent className="w-3.5 h-3.5 opacity-80 shrink-0" />;
  };

  return (
    <>
      {/* Top Heritage Accent Bar */}
      <div id="top-heritage-bar" className="bg-[#114D3A] text-[#F2E9DD] text-xs font-medium py-1.5 px-4">
        <div className="max-w-[1480px] mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#D4A25A] animate-pulse"></span>
            <span>{headerConfig.topNoticeText || 'Di sản Văn hóa Phi vật thể đại diện của Nhân loại - UNESCO 2009'}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-[#D4A25A]">{headerConfig.topSubText || 'Kinh Bắc - Vùng đất địa linh nhân kiệt'}</span>
            <span className="text-[#D4A25A]/40">|</span>
            <button
              id="header-listen-cta"
              onClick={() => onNavigate({ type: 'nghe-quan-ho' })}
              className="flex items-center space-x-1 hover:text-[#D4A25A] transition-colors cursor-pointer text-[#F2E9DD]"
            >
              <Music className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-[#D4A25A] animate-bounce' : ''}`} />
              <span>{isPlayingAudio ? 'Đang phát làn điệu' : (headerConfig.topAudioCtaText || 'Nghe Quan họ')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header id="main-header" className="sticky top-0 z-40 bg-[#F2E9DD]/95 backdrop-blur-md border-b border-[#E3D5C3] shadow-xs">
        <div className="max-w-[1480px] mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-20 gap-2 sm:gap-3">

            {/* Brand Logo & Text (Shrink-0) */}
            <div className="flex items-center shrink-0">
              <div
                id="site-brand-logo"
                onClick={() => onNavigate({ type: 'home' })}
                className="flex items-center space-x-2.5 cursor-pointer group select-none shrink-0"
              >
                {siteConfig.logoType === 'image' && siteConfig.logoImageUrl ? (
                  <img
                    src={siteConfig.logoImageUrl}
                    alt={siteConfig.logoText || 'Logo'}
                    className="h-10 sm:h-11 object-contain group-hover:scale-105 transition-transform shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#114D3A] to-[#1D7358] flex items-center justify-center text-[#F2E9DD] shadow-sm border border-[#0D3B2C] group-hover:scale-105 transition-transform shrink-0">
                    <span className="font-serif-culture text-lg sm:text-xl font-bold tracking-tight">MQ</span>
                  </div>
                )}

                <div className="flex flex-col shrink-0 min-w-0 max-w-[170px] sm:max-w-[210px] justify-center">
                  <span className="font-serif-culture text-base sm:text-lg font-bold tracking-tight text-[#114D3A] group-hover:text-[#8C2F2F] transition-colors leading-tight">
                    {siteConfig.logoText || 'MẠCH QUAN HỌ'}
                  </span>
                  <span className="text-[8.5px] sm:text-[11.5px]  tracking-wider font-bold text-[#8C2F2F] leading-[1.1]  line-clamp-2 mt-0.5">
                    {siteConfig.logoSubtext || 'Kinh Bắc Di Sản'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Desktop Navigation Links (Space Optimized - Fills Middle Area) */}
            <nav id="desktop-nav-menu" className="hidden lg:flex items-center justify-evenly flex-1 py-1 overflow-x-auto scrollbar-none">
              {navItemsList.map((item) => {
                const active = isActive(item.viewType);
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.viewType}`}
                    onClick={() => onNavigate(resolveViewState(item.viewType))}
                    className={`px-1 py-1 text-[11.5px] xl:text-[12.5px] font-bold transition-all flex items-center space-x-1 cursor-pointer relative whitespace-nowrap shrink-0 ${active
                      ? 'text-[#8C2320] after:absolute after:bottom-0 after:left-1 after:right-1 after:h-0.5 after:bg-[#8C2320] after:rounded-full'
                      : 'text-[#2D241E] hover:text-[#8C2320] hover:bg-[#E3D5C3]/50 rounded-lg'
                      }`}
                  >
                    {renderItemIcon(item)}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Search Tool & User Account Dropdown (Right Shrink-0) */}
            <div className="flex items-center justify-end space-x-2 sm:space-x-3 shrink-0">
              {/* Search Toggle Button */}
              <button
                id="search-toggle-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-full text-[#2D241E] hover:text-[#114D3A] hover:bg-[#E3D5C3]/60 transition-colors cursor-pointer"
                title="Tìm kiếm bài viết"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account Dropdown Menu (Circular Avatar Button) */}
              <div className="relative" ref={dropdownRef}>
                <button
                  id="user-account-dropdown-trigger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm border border-[#D4A25A]/60 bg-[#E3D5C3]/40 hover:bg-[#D4A25A]/30 hover:scale-105 active:scale-95 ${isDropdownOpen ? 'ring-2 ring-[#8C2320] ring-offset-2 ring-offset-[#FAF8F5]' : ''
                    }`}
                  title={currentUser ? `Tài khoản: ${currentUser.name}` : 'Tài khoản Quản trị CMS'}
                >
                  {currentUser ? (
                    <img
                      src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                      alt={currentUser.name}
                      className="w-full h-full rounded-full object-cover p-0.5"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center bg-[#8C2320] text-white shadow-inner">
                      <Shield className="w-4.5 h-4.5" />
                    </div>
                  )}
                </button>

                {/* Floating Dropdown Card */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E2D6C3] rounded-2xl shadow-xl py-2 z-50 animate-scaleUp text-xs">

                    {/* User Info Header */}
                    {currentUser ? (
                      <div className="px-4 py-3 border-b border-[#F0EBE1] flex items-center space-x-3 bg-[#FAF8F5]">
                        <img
                          src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#8C2320] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#2D241E] truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-[#8C6B50] truncate">{currentUser.email}</p>
                          <span className="inline-block mt-0.5 text-[9.5px] px-2 py-0.5 bg-[#8C2320] text-white font-bold rounded-md">
                            {currentUser.role}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-3 border-b border-[#F0EBE1] bg-[#FAF8F5]">
                        <p className="font-bold text-[#2D241E]">Hệ thống Quản trị</p>
                        <p className="text-[11px] text-[#8C6B50]">Yêu cầu xác thực tài khoản JWT</p>
                      </div>
                    )}

                    {/* Dropdown Actions List */}
                    <div className="p-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onNavigate({ type: 'admin', section: 'dashboard' });
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#FAF8F5] text-[#2D241E] font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-[#8C2320]" />
                        <span>Trang quản trị (Admin Portal)</span>
                      </button>

                      {currentUser && onLogout && (
                        <>
                          <div className="my-1 border-t border-[#F0EBE1]" />
                          <button
                            onClick={() => {
                              setIsDropdownOpen(false);
                              onLogout();
                            }}
                            className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-red-50 text-red-700 font-bold flex items-center space-x-2.5 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-red-600" />
                            <span>Đăng xuất tài khoản</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

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
          <div id="mobile-nav-drawer" className="lg:hidden border-t border-[#E3D5C3] bg-[#F2E9DD] py-4 px-4 shadow-lg space-y-2">
            {navItemsList.map((item) => {
              const active = isActive(item.viewType);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(resolveViewState(item.viewType));
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors ${active
                    ? 'bg-[#8C2320]/10 text-[#8C2320] font-bold border-l-4 border-[#8C2320]'
                    : 'text-[#2D241E] hover:bg-[#E3D5C3]/60'
                    }`}
                >
                  {renderItemIcon(item)}
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-3 border-t border-[#E8DFC8] space-y-2">
              <button
                onClick={() => {
                  onNavigate({ type: 'admin', section: 'dashboard' });
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E293B] text-white text-sm font-semibold hover:bg-black transition-colors"
              >
                <Shield className="w-4 h-4 text-[#E5B567]" />
                <span>Trang quản trị (Admin Portal)</span>
              </button>
              {currentUser && onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-red-100 text-red-800 text-xs font-semibold hover:bg-red-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất tài khoản</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
