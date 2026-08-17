import React from 'react';
import { LayoutDashboard, FileText, Users, FolderKanban, Settings, ArrowLeft, Compass, Menu, BookOpen, Globe, Search, Code, Layers } from 'lucide-react';
import { ViewState } from '../../types';

interface AdminSidebarProps {
  activeTab: 'dashboard' | 'articles' | 'users' | 'categories' | 'banner' | 'header' | 'menus' | 'research' | 'footer' | 'seo' | 'scripts';
  articlesCount: number;
  usersCount: number;
  categoriesCount: number;
  onSelectTab: (tab: 'dashboard' | 'articles' | 'users' | 'categories' | 'banner' | 'header' | 'menus' | 'research' | 'footer' | 'seo' | 'scripts') => void;
  onNavigate: (view: ViewState) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  articlesCount,
  usersCount,
  categoriesCount,
  onSelectTab,
  onNavigate,
}) => {
  const navGroups = [
    {
      groupTitle: 'TỔNG QUAN & NỘI DUNG',
      items: [
        { id: 'dashboard' as const, label: 'Bảng tổng quan', icon: LayoutDashboard },
        { id: 'articles' as const, label: 'Quản lý tin bài', icon: FileText, badge: articlesCount },
        { id: 'research' as const, label: 'Nhật ký nghiên cứu', icon: BookOpen },
        { id: 'categories' as const, label: 'Quản lý chuyên mục', icon: FolderKanban, badge: categoriesCount },
      ],
    },
    {
      groupTitle: 'GIAO DIỆN & CẤU HÌNH',
      items: [
        { id: 'banner' as const, label: 'Cấu hình Banner trang chủ', icon: Settings },
        { id: 'header' as const, label: 'Cấu hình Header & Logo', icon: Compass },
        { id: 'menus' as const, label: 'Quản lý Menu Navigation', icon: Menu },
        { id: 'footer' as const, label: 'Cấu hình Chân trang (Footer)', icon: Globe },
      ],
    },
    {
      groupTitle: 'TỐI ƯU SEO & KĨ THUẬT',
      items: [
        { id: 'seo' as const, label: 'Cài đặt SEO toàn Site', icon: Search },
        { id: 'scripts' as const, label: 'Script / Widget (GSC & Pixel)', icon: Code },
      ],
    },
    {
      groupTitle: 'HỆ THỐNG & TÀI KHOẢN',
      items: [
        { id: 'users' as const, label: 'Quản lý người dùng', icon: Users, badge: usersCount },
      ],
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#1C1412] text-[#E0D5CE] shrink-0 border-r border-[#382B26] flex flex-col justify-between max-h-screen overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#382B26] flex items-center justify-between sticky top-0 bg-[#1C1412] z-10">
          <div 
            onClick={() => onNavigate({ type: 'home' })}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8C2320] to-[#B83E3E] flex items-center justify-center text-white font-serif-culture font-bold text-base shadow-md border border-[#6B1B18] group-hover:scale-105 transition-transform">
              MQ
            </div>
            <div>
              <h1 className="font-serif-culture text-base font-bold text-white tracking-wide group-hover:text-[#E5B567] transition-colors">
                Mạch Quan Họ
              </h1>
              <p className="text-[10.5px] text-[#A8988B] font-semibold uppercase tracking-widest">Hệ thống CMS</p>
            </div>
          </div>
        </div>

        {/* Structured Parent Categories Navigation */}
        <div className="px-3 py-4 space-y-5">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {/* Parent Group Header Title */}
              <div className="px-3 pb-1.5 pt-1 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8988B]/70">
                  {group.groupTitle}
                </span>
                <div className="w-8 h-[1px] bg-[#382B26]" />
              </div>

              {/* Group Child Items */}
              <nav className="space-y-1 text-xs font-semibold">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`admin-nav-${item.id}`}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                        active
                          ? 'bg-[#8C2320] text-white font-bold shadow-md'
                          : 'text-[#C4B7AC] hover:bg-[#2A1C18] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3 text-left min-w-0 pr-2">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-left text-xs leading-snug truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${active ? 'bg-white/20 text-white font-bold' : 'bg-[#3D2C26] text-[#A8988B]'}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer Link */}
      <div className="p-4 border-t border-[#382B26] sticky bottom-0 bg-[#1C1412] z-10">
        <button
          id="admin-back-to-site-btn"
          onClick={() => onNavigate({ type: 'home' })}
          className="w-full flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-[#2A1C18] hover:bg-[#382520] text-[#E0D5CE] hover:text-white font-semibold text-xs border border-[#3D2C26] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#E5B567]" />
          <span>Quay lại trang người xem</span>
        </button>
      </div>
    </aside>
  );
};
