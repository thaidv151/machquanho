import React from 'react';
import { SocialPlatformIcon } from './SocialPlatformIcon';
import { ViewState, SiteConfig, SiteFooterConfig } from '../types';
import { Mail, Phone, MapPin, Facebook, Youtube, Send } from 'lucide-react';
import { DEFAULT_SITE_CONFIG } from '../data/mockData';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
  siteConfig: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, siteConfig }) => {
  const footerConfig: SiteFooterConfig = siteConfig.footer || DEFAULT_SITE_CONFIG.footer!;

  const handleLinkClick = (url: string) => {
    if (!url || url === '#') return;
    if (url === '/' || url === '/home') {
      onNavigate({ type: 'home' });
    } else if (url.startsWith('/news')) {
      onNavigate({ type: 'news' });
    } else if (url.startsWith('/research-diary')) {
      onNavigate({ type: 'research-diary' });
    } else if (url.startsWith('/about')) {
      onNavigate({ type: 'about' });
    } else if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  };

  return (
    <footer id="site-footer" className="bg-[#092B20] text-[#F2E9DD] pt-12 pb-6 border-t-2 border-[#114D3A]">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Balanced Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10">
          
          {/* Column 1: Brand Info (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-3.5">
            <div className="flex items-center space-x-3">
              {siteConfig.logoType === 'image' && siteConfig.logoImageUrl ? (
                <img 
                  src={siteConfig.logoImageUrl} 
                  alt={siteConfig.logoText || 'Logo'} 
                  className="h-12 max-h-12 object-contain shrink-0 rounded-lg border border-[#D4A25A]/30 bg-white/5 p-1" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#114D3A] flex items-center justify-center text-[#D4A25A] font-serif-culture font-bold text-lg border border-[#D4A25A]/40 shadow-xs shrink-0">
                  MQ
                </div>
              )}
              <div>
                <h3 className="font-serif-culture text-xl font-bold tracking-wide text-white">
                  {siteConfig.siteName || siteConfig.logoText || 'MẠCH QUAN HỌ'}
                </h3>
                <p className="text-xs text-[#D4A25A] font-medium tracking-wide">
                  {footerConfig.tagline}
                </p>
              </div>
            </div>
            <p className="text-xs text-[#F2E9DD]/80 leading-relaxed font-normal max-w-sm">
              {footerConfig.description}
            </p>
          </div>

          {/* Column 2: Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif-culture text-xs font-bold text-[#D4A25A] tracking-wider uppercase">
              {footerConfig.quickLinksTitle || 'LIÊN KẾT NHANH'}
            </h4>
            <ul className="space-y-2 text-xs">
              {(footerConfig.quickLinks || []).map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link.url)}
                    className="text-[#F2E9DD]/85 hover:text-[#D4A25A] transition-colors cursor-pointer text-left block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social Links / Platforms (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-culture text-xs font-bold text-[#D4A25A] tracking-wider uppercase">
              {footerConfig.socialLinksTitle || 'KẾT NỐI VỚI CHÚNG TÔI'}
            </h4>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {(footerConfig.socialPlatforms && footerConfig.socialPlatforms.length > 0
                ? footerConfig.socialPlatforms
                : [
                    { id: 'sp-1', name: 'Facebook', url: siteConfig.socialLinks?.facebook || '#', iconType: 'facebook' },
                    { id: 'sp-2', name: 'YouTube', url: siteConfig.socialLinks?.youtube || '#', iconType: 'youtube' },
                    { id: 'sp-3', name: 'TikTok', url: siteConfig.socialLinks?.tiktok || '#', iconType: 'tiktok' },
                    { id: 'sp-4', name: 'Email', url: `mailto:${footerConfig.email || 'machquanho@gmail.com'}`, iconType: 'email' }
                  ]
              ).map((item) => (
                <a
                  key={item.id}
                  href={item.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#D4A25A] hover:text-[#092B20] text-white flex items-center justify-center transition-all cursor-pointer border border-white/15 overflow-hidden group shrink-0"
                  title={item.name}
                >
                  <SocialPlatformIcon iconType={item.iconType} iconUrl={item.iconUrl} name={item.name} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Contact Info (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-culture text-xs font-bold text-[#D4A25A] tracking-wider uppercase">
              {footerConfig.contactTitle || 'THÔNG TIN LIÊN HỆ'}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F2E9DD]/85">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#D4A25A] shrink-0 mt-0.5" />
                <span>{footerConfig.address || 'Bắc Ninh, Việt Nam'}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#D4A25A] shrink-0" />
                <a href={`mailto:${footerConfig.email}`} className="hover:text-[#D4A25A] transition-colors">
                  {footerConfig.email || 'machquanho@gmail.com'}
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#D4A25A] shrink-0" />
                <a href={`tel:${footerConfig.phone}`} className="hover:text-[#D4A25A] transition-colors">
                  {footerConfig.phone || '0123 456 789'}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Sub-links */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F2E9DD]/70">
          <p>{footerConfig.copyrightText || '© 2026 Mạch Quan Họ. All rights reserved.'}</p>

          <div className="flex items-center space-x-3">
            {(footerConfig.bottomLinks || []).map((link, index) => (
              <React.Fragment key={link.id}>
                {index > 0 && <span className="text-white/30">|</span>}
                <button
                  onClick={() => handleLinkClick(link.url)}
                  className="hover:text-[#D4A25A] transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};
