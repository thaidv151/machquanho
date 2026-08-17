import React from 'react';
import { LogOut } from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminHeaderProps {
  activeTab: 'dashboard' | 'articles' | 'users' | 'categories' | 'banner' | 'header' | 'menus';
  currentUser?: AdminUser | null;
  onLogout?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  currentUser,
  onLogout,
}) => {
  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Bảng tổng quan';
      case 'articles': return 'Quản lý tin bài';
      case 'users': return 'Quản lý người dùng';
      case 'categories': return 'Quản lý chuyên mục';
      case 'menus': return 'Quản lý Menu Navigation';
      case 'header': return 'Cấu hình Header & Logo';
      case 'banner': return 'Cấu hình Banner trang chủ';
      default: return 'Bảng điều khiển';
    }
  };

  return (
    <header className="bg-[#FAF8F5] border-b border-[#E8DFC8] px-6 py-3.5 flex items-center justify-between shadow-xs z-30 shrink-0">
      
      {/* Left: Active Section Breadcrumb */}
      <div className="flex items-center space-x-3">
        <span className="text-xs font-semibold text-[#8C6B50]">Hệ thống Quản trị</span>
        <span className="text-[#C8BBA9] text-xs">/</span>
        <span className="text-xs font-bold text-[#8C2320] capitalize bg-[#F3EDE2] px-3 py-1 rounded-full border border-[#E4D9C7]">
          {getTabLabel(activeTab)}
        </span>
      </div>

      {/* Right: User Account Profile & Logout CTA */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        
        {/* Account Profile Badge */}
        <div className="flex items-center space-x-3 pl-3 pr-4 py-1.5 bg-white border border-[#E2D6C3] rounded-full shadow-xs">
          <img 
            src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
            alt={currentUser?.name || "Admin"} 
            className="w-8 h-8 rounded-full object-cover border border-[#8C2320]"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-[#2D241E] leading-tight">
              {currentUser?.name || 'Nguyễn Văn A'}
            </span>
            <span className="text-[10px] text-[#8C2320] font-semibold">
              {currentUser?.role || 'Quản trị viên'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-full bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
            title="Đăng xuất khỏi hệ thống"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        )}
      </div>

    </header>
  );
};
