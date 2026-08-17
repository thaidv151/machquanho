import React, { useState, useEffect } from 'react';
import { 
  Save, Loader2, Plus, Trash2, Home, Newspaper, BookOpen, Users, 
  Sparkles, Music, Globe, Bookmark, Award, Calendar, ArrowUp, ArrowDown, Pencil 
} from 'lucide-react';
import { SiteConfig, SiteHeaderConfig, HeaderNavItem } from '../../../types';
import { HeaderNavItemModal } from '../modals/HeaderNavItemModal';

interface AdminMenuTabProps {
  siteConfig: SiteConfig;
  isSubmitting: boolean;
  onSaveMenuConfig: (navItems: HeaderNavItem[]) => void;
}

export const AdminMenuTab: React.FC<AdminMenuTabProps> = ({
  siteConfig,
  isSubmitting,
  onSaveMenuConfig,
}) => {
  const [navItems, setNavItems] = useState<HeaderNavItem[]>(() => 
    siteConfig.header?.navItems || [
      { id: 'nav-1', label: 'Trang chủ', viewType: 'home', icon: 'Home' },
      { id: 'nav-2', label: 'Tin tức & Hoạt động', viewType: 'news', icon: 'Newspaper' },
      { id: 'nav-3', label: 'Nhật ký nghiên cứu', viewType: 'research-diary', icon: 'BookOpen' },
      { id: 'nav-4', label: 'Về chúng tôi', viewType: 'about', icon: 'Users' }
    ]
  );

  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [editingNavItem, setEditingNavItem] = useState<HeaderNavItem | null>(null);

  useEffect(() => {
    if (siteConfig.header?.navItems) {
      setNavItems(siteConfig.header.navItems);
    }
  }, [siteConfig]);

  const handleOpenAddNavModal = () => {
    setEditingNavItem(null);
    setIsNavModalOpen(true);
  };

  const handleOpenEditNavModal = (item: HeaderNavItem) => {
    setEditingNavItem(item);
    setIsNavModalOpen(true);
  };

  const handleSaveNavItemModal = (item: HeaderNavItem) => {
    if (editingNavItem) {
      setNavItems(prev => prev.map(nav => nav.id === item.id ? item : nav));
    } else {
      setNavItems(prev => [...prev, item]);
    }
    setIsNavModalOpen(false);
  };

  const handleDeleteNavItem = (id: string) => {
    setNavItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const items = [...navItems];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    setNavItems(items);
  };

  const handleMoveDown = (index: number) => {
    if (index >= navItems.length - 1) return;
    const items = [...navItems];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    setNavItems(items);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMenuConfig(navItems);
  };

  const renderNavIcon = (item: HeaderNavItem) => {
    if (item.customIconUrl) {
      return (
        <img 
          src={item.customIconUrl} 
          alt={item.label} 
          className="w-5 h-5 object-cover rounded-md border border-[#E8DFC8]"
        />
      );
    }
    switch (item.icon) {
      case 'Newspaper': return <Newspaper className="w-4 h-4 text-[#8C2320]" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-[#8C2320]" />;
      case 'Users': return <Users className="w-4 h-4 text-[#8C2320]" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-[#8C2320]" />;
      case 'Music': return <Music className="w-4 h-4 text-[#8C2320]" />;
      case 'Globe': return <Globe className="w-4 h-4 text-[#8C2320]" />;
      case 'Bookmark': return <Bookmark className="w-4 h-4 text-[#8C2320]" />;
      case 'Award': return <Award className="w-4 h-4 text-[#8C2320]" />;
      case 'Calendar': return <Calendar className="w-4 h-4 text-[#8C2320]" />;
      default: return <Home className="w-4 h-4 text-[#8C2320]" />;
    }
  };

  const getRouteLabel = (viewType: string) => {
    switch (viewType) {
      case 'home': return 'Trang chủ (/)';
      case 'news': return 'Tin tức (/news)';
      case 'research-diary': return 'Nhật ký (/research-diary)';
      case 'about': return 'Giới thiệu (/about)';
      default: return viewType;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
            Quản lý Menu Navigation Hệ thống
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6B60] mt-1">
            Danh sách các mục menu hiển thị trên Header theo số thứ tự (STT) và thứ tự sắp xếp linh hoạt
          </p>
        </div>
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleOpenAddNavModal}
            className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#E8DFC8] border border-[#D9CEBA] text-[#2D241E] text-xs font-bold rounded-full shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-[#8C2320]" />
            <span>Thêm mục menu</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-full shadow-md transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu danh sách Menu</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
            <div>
              <h3 className="font-serif-culture text-xl font-bold text-[#8C2320]">
                Danh sách Menu & Thứ tự Hiển thị
              </h3>
              <p className="text-xs text-[#7A6B60] mt-0.5">
                Tổng cộng <span className="font-bold text-[#8C2320]">{navItems.length}</span> mục menu navigation
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddNavModal}
              className="px-4 py-2 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-full shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mục mới</span>
            </button>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto rounded-2xl border border-[#E8DFC8]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] text-[11px] font-bold text-[#4A3B32] uppercase tracking-wider border-b border-[#E8DFC8]">
                  <th className="py-3.5 px-4 w-16 text-center">STT</th>
                  <th className="py-3.5 px-4">Tên mục & Icon</th>
                  <th className="py-3.5 px-4">Trang liên kết (Route)</th>
                  <th className="py-3.5 px-4 text-center w-28">Thứ tự</th>
                  <th className="py-3.5 px-4 text-right w-28">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFC8] text-xs">
                {navItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#7A6B60] italic">
                      Chưa có mục menu nào. Bấm "Thêm mục menu mới" để bắt đầu.
                    </td>
                  </tr>
                ) : (
                  navItems.map((item, idx) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-[#FAF8F5]/80 transition-colors group"
                    >
                      {/* STT */}
                      <td className="py-3.5 px-4 text-center font-bold text-[#8C2320]">
                        <span className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#D9CEBA] inline-flex items-center justify-center text-xs">
                          #{idx + 1}
                        </span>
                      </td>

                      {/* Icon & Label */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl flex items-center justify-center">
                            {renderNavIcon(item)}
                          </div>
                          <span className="font-bold text-[#2D241E] text-xs">
                            {item.label}
                          </span>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="py-3.5 px-4">
                        <span className="px-3 py-1 bg-[#FAF8F5] border border-[#E8DFC8] text-[#5C4D44] font-mono text-[11px] rounded-lg">
                          {getRouteLabel(item.viewType)}
                        </span>
                      </td>

                      {/* Order Controls */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(idx)}
                            disabled={idx === 0}
                            className="p-1 rounded-md text-[#7A6B60] hover:text-[#8C2320] hover:bg-[#FAF8F5] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                            title="Di chuyển lên trên"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(idx)}
                            disabled={idx === navItems.length - 1}
                            className="p-1 rounded-md text-[#7A6B60] hover:text-[#8C2320] hover:bg-[#FAF8F5] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                            title="Di chuyển xuống dưới"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditNavModal(item)}
                          className="p-1.5 text-[#5C4D44] hover:text-[#8C2320] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
                          title="Sửa mục menu"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNavItem(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa mục menu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Save Action CTA */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#8C2320] hover:bg-[#6E1B19] text-white rounded-full text-xs font-bold shadow-md transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu danh sách Menu Navigation</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Header Nav Item Modal */}
      <HeaderNavItemModal
        isOpen={isNavModalOpen}
        editingItem={editingNavItem}
        onClose={() => setIsNavModalOpen(false)}
        onSave={handleSaveNavItemModal}
      />
    </div>
  );
};
