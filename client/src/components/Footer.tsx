import React from 'react';
import { ViewState, SiteConfig } from '../types';
import { Mail, Phone, MapPin, Heart, ArrowUpRight, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
  siteConfig: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, siteConfig }) => {
  return (
    <footer id="site-footer" className="bg-[#1C1412] text-[#E0D5CE] pt-16 pb-12 border-t-4 border-[#8C2320]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#3D302B]">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#8C2320] flex items-center justify-center text-[#FAF8F5] font-serif-culture font-bold text-lg border border-[#A24442]">
                MQ
              </div>
              <div>
                <h3 className="font-serif-culture text-xl font-bold text-[#F5EDE8]">
                  {siteConfig.siteName || 'MẠCH QUAN HỌ'}
                </h3>
                <p className="text-xs text-[#A8988B] tracking-wider uppercase font-medium">
                  {siteConfig.logoSubtext || 'Kinh Bắc Di Sản'}
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#C4B7AC] leading-relaxed">
              Dự án số hóa, bảo tồn và quảng bá giá trị di sản Dân ca Quan họ Bắc Ninh – Di sản Văn hóa Phi vật thể đại diện của Nhân loại do UNESCO ghi danh.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs text-[#D9A066]">
              <Sparkles className="w-4 h-4 text-[#E5B567]" />
              <span>Gìn giữ hồn cốt – Thắp sáng tương lai</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3.5">
            <h4 className="font-serif-culture text-base font-semibold text-[#F5EDE8] tracking-wide border-l-2 border-[#8C2320] pl-2.5">
              Liên kết nhanh
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button 
                  onClick={() => onNavigate({ type: 'home' })}
                  className="text-[#C4B7AC] hover:text-[#E5B567] transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>Trang chủ</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate({ type: 'news' })}
                  className="text-[#C4B7AC] hover:text-[#E5B567] transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>Tin tức & Hoạt động di sản</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate({ type: 'research-diary' })}
                  className="text-[#C4B7AC] hover:text-[#E5B567] transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>Nhật ký điền dã & nghiên cứu</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate({ type: 'about' })}
                  className="text-[#C4B7AC] hover:text-[#E5B567] transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>Về chúng tôi & Nghệ nhân</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate({ type: 'admin', section: 'dashboard' })}
                  className="text-[#C4B7AC] hover:text-[#E5B567] transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>Cổng quản trị nội dung (CMS)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-3.5">
            <h4 className="font-serif-culture text-base font-semibold text-[#F5EDE8] tracking-wide border-l-2 border-[#8C2320] pl-2.5">
              Chuyên mục chính
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {['Sự kiện', 'Chính sách', 'Góc nhìn', 'Hoạt động', 'Nghệ nhân', 'Khám phá'].map((cat, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => onNavigate({ type: 'news', category: cat })}
                    className="text-[#C4B7AC] hover:text-[#E5B567] transition-colors cursor-pointer flex items-center justify-between w-full max-w-[180px]"
                  >
                    <span>{cat}</span>
                    <span className="text-[11px] text-[#7A685D] group-hover:text-[#E5B567]">●</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-3.5">
            <h4 className="font-serif-culture text-base font-semibold text-[#F5EDE8] tracking-wide border-l-2 border-[#8C2320] pl-2.5">
              Thông tin liên hệ
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-[#C4B7AC]">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#8C2320] shrink-0 mt-0.5" />
                <span>{siteConfig.address}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#8C2320] shrink-0" />
                <span>{siteConfig.contactPhone}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#8C2320] shrink-0" />
                <span>{siteConfig.contactEmail}</span>
              </div>
            </div>

            {/* Newsletter input */}
            <div className="pt-2">
              <label className="text-xs text-[#A8988B] block mb-1.5 font-medium">Nhận thông báo bài viết mới:</label>
              <div className="flex rounded-lg overflow-hidden border border-[#3D302B] focus-within:border-[#8C2320]">
                <input 
                  type="email" 
                  placeholder="Email của bạn..." 
                  className="bg-[#241A17] px-3 py-1.5 text-xs text-white placeholder-[#6B5A4E] focus:outline-none flex-1"
                />
                <button 
                  type="button" 
                  onClick={() => alert('Cảm ơn bạn đã đăng ký nhận tin từ Mạch Quan Họ!')}
                  className="bg-[#8C2320] hover:bg-[#A24442] text-white text-xs px-3 py-1.5 font-medium transition-colors cursor-pointer"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C7A6E] space-y-3 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} <strong className="text-[#B5A496]">Mạch Quan Họ</strong>. Tất cả quyền được bảo lưu.
          </div>
          <div className="flex items-center space-x-1">
            <span>Bảo tồn & phát huy di sản văn hóa Kinh Bắc với</span>
            <Heart className="w-3.5 h-3.5 text-[#B83E3E] inline fill-[#B83E3E] mx-1" />
          </div>
        </div>

      </div>
    </footer>
  );
};
