import React from 'react';
import { FileText, TrendingUp, Sparkles, Users, Plus, Sliders } from 'lucide-react';
import { Article, AdminUser } from '../../../types';

interface AdminDashboardTabProps {
  articles: Article[];
  users: AdminUser[];
  onOpenNewArticle: () => void;
  onSelectTab: (tab: 'dashboard' | 'articles' | 'users' | 'categories' | 'banner') => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  articles,
  users,
  onOpenNewArticle,
  onSelectTab,
}) => {
  const publishedArticlesCount = articles.filter(a => a.status === 'Đã đăng').length;
  const draftArticlesCount = articles.filter(a => a.status === 'Nháp').length;
  const activeUsersCount = users.filter(u => u.status === 'Hoạt động').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
          Bảng điều khiển hệ thống
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6B60] mt-1">
          Tổng hợp số liệu tin bài, tư liệu điền dã và người dùng của Mạch Quan Họ
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8C6B50] uppercase tracking-wider">Tổng bài viết</span>
            <div className="p-2 rounded-xl bg-[#FAF8F5] text-[#8C2320]">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif-culture font-bold text-[#2D241E]">{articles.length}</span>
            <p className="text-[11px] text-[#7A6B60] mt-1">
              <span className="text-green-700 font-bold">{publishedArticlesCount} đã xuất bản</span> • {draftArticlesCount} bản nháp
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8C6B50] uppercase tracking-wider">Lượt đọc bài</span>
            <div className="p-2 rounded-xl bg-[#FAF8F5] text-[#007f32]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif-culture font-bold text-[#2D241E]">7.460</span>
            <p className="text-[11px] text-[#007f32] font-semibold mt-1">+18.4% so với tháng trước</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8C6B50] uppercase tracking-wider">Nhật ký điền dã</span>
            <div className="p-2 rounded-xl bg-[#FAF8F5] text-[#D97706]">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif-culture font-bold text-[#2D241E]">3</span>
            <p className="text-[11px] text-[#7A6B60] mt-1">Làng Diềm, Làng Bịu, Thổ Hà</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFC8] shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8C6B50] uppercase tracking-wider">Thành viên ban quản trị</span>
            <div className="p-2 rounded-xl bg-[#FAF8F5] text-[#2563EB]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif-culture font-bold text-[#2D241E]">{users.length}</span>
            <p className="text-[11px] text-[#7A6B60] mt-1">{activeUsersCount} tài khoản hoạt động</p>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h3 className="font-serif-culture text-lg font-bold text-[#2D241E]">Thao tác nhanh</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              onClick={onOpenNewArticle}
              className="p-4 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#E8DFC8] text-left transition-colors cursor-pointer group"
            >
              <Plus className="w-5 h-5 text-[#8C2320] mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-[#2D241E]">Soạn bài viết mới</p>
              <p className="text-[11px] text-[#7A6B60]">Thêm bài hoặc phóng sự</p>
            </button>

            <button 
              onClick={() => onSelectTab('banner')}
              className="p-4 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EDE2] border border-[#E8DFC8] text-left transition-colors cursor-pointer group"
            >
              <Sliders className="w-5 h-5 text-[#8C2320] mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-[#2D241E]">Đổi Banner chính</p>
              <p className="text-[11px] text-[#7A6B60]">Cập nhật hình & thông điệp</p>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h3 className="font-serif-culture text-lg font-bold text-[#2D241E]">Nhật ký hoạt động gần đây</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0EBE1] flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-[#2D241E]">Xuất bản bài: "Khai mạc Hội Lim 2024"</p>
                <p className="text-[11px] text-[#8C6B50]">Bởi Nguyễn Thanh Tùng</p>
              </div>
              <span className="text-[10px] text-[#8C6B50]">Hôm nay</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F0EBE1] flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-[#2D241E]">Cập nhật tư liệu: "Khảo sát tục kết chạ Làng Diềm"</p>
                <p className="text-[11px] text-[#8C6B50]">Bởi Trần Thị Mai Phương</p>
              </div>
              <span className="text-[10px] text-[#8C6B50]">Hôm qua</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
