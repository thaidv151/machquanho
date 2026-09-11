import React, { useState, useEffect } from 'react';
import { 
  Save, Loader2, Plus, Trash2, Home, Newspaper, BookOpen, Users, 
  Sparkles, Music, Globe, Bookmark, Award, Calendar, ArrowUp, ArrowDown, Pencil, Search, RotateCcw, MapPin, Compass
} from 'lucide-react';
import { HeaderNavItem } from '../../../types';
import { HeaderNavItemModal } from '../modals/HeaderNavItemModal';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { Toast, ToastType } from '../../../components/Toast';
import { apiService } from '../../../services/apiService';

export const AdminMenuTab: React.FC = () => {
  const [navItems, setNavItems] = useState<HeaderNavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [toastState, setToastState] = useState<{ message: string; type: ToastType } | null>(null);
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [editingNavItem, setEditingNavItem] = useState<HeaderNavItem | null>(null);

  // Confirm delete modal state
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    itemId: string | null;
    itemLabel: string;
  }>({
    isOpen: false,
    itemId: null,
    itemLabel: '',
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToastState({ message, type });
  };

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const data = await apiService.adminGetMenuItems();
      setNavItems(data || []);
    } catch (err) {
      console.error('Failed to fetch admin menu items:', err);
      showToast('Lỗi khi tải danh sách Menu từ CSDL MySQL', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, []);

  const handleOpenAddNavModal = () => {
    setEditingNavItem(null);
    setIsNavModalOpen(true);
  };

  const handleOpenEditNavModal = (item: HeaderNavItem) => {
    setEditingNavItem(item);
    setIsNavModalOpen(true);
  };

  const handleSaveNavItemModal = async (item: HeaderNavItem) => {
    try {
      setIsSubmitting(true);
      if (editingNavItem) {
        const updated = await apiService.adminUpdateMenuItem(item.id, item);
        setNavItems(prev => prev.map(n => n.id === updated.id ? updated : n));
        showToast(`Cập nhật mục menu "${updated.label}" thành công!`, 'success');
      } else {
        const created = await apiService.adminCreateMenuItem(item);
        setNavItems(prev => [...prev, created]);
        showToast(`Thêm mới mục menu "${created.label}" vào CSDL thành công!`, 'success');
      }
      setIsNavModalOpen(false);
    } catch (err: any) {
      console.error('Save menu item error:', err);
      showToast(err?.response?.data?.message || 'Có lỗi xảy ra khi lưu mục menu!', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestDeleteNavItem = (item: HeaderNavItem) => {
    setDeleteConfirmState({
      isOpen: true,
      itemId: item.id,
      itemLabel: item.label,
    });
  };

  const confirmDeleteNavItem = async () => {
    if (!deleteConfirmState.itemId) return;
    try {
      setIsSubmitting(true);
      await apiService.adminDeleteMenuItem(deleteConfirmState.itemId);
      setNavItems(prev => prev.filter(item => item.id !== deleteConfirmState.itemId));
      showToast(`Đã xóa mục menu "${deleteConfirmState.itemLabel}" khỏi CSDL!`, 'success');
    } catch (err: any) {
      console.error('Delete menu item error:', err);
      showToast('Có lỗi xảy ra khi xóa mục menu!', 'error');
    } finally {
      setIsSubmitting(false);
      setDeleteConfirmState({ isOpen: false, itemId: null, itemLabel: '' });
    }
  };

  const handleResetToDefault = async () => {
    try {
      setIsSubmitting(true);
      const defaults = [
        { label: 'Trang chủ', viewType: '/', icon: 'Home' },
        { label: 'Tin tức & Hoạt động', viewType: '/news', icon: 'Newspaper' },
        { label: 'Nhật ký nghiên cứu', viewType: '/research-diary', icon: 'BookOpen' },
        { label: 'Dòng chảy Quan họ', viewType: '/timeline', icon: 'Calendar' },
        { label: 'Bản đồ di sản', viewType: '/map', icon: 'MapPin' },
        { label: 'Về chúng tôi', viewType: '/about', icon: 'Users' }
      ];

      for (const item of defaults) {
        await apiService.adminCreateMenuItem(item);
      }
      await loadMenuItems();
      showToast('Khôi phục danh sách Menu mặc định vào CSDL thành công!', 'success');
    } catch (err) {
      showToast('Có lỗi xảy ra khi tạo menu mặc định', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    const items = [...navItems];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;

    setNavItems(items);
    try {
      await apiService.adminReorderMenuItems(items.map(i => i.id));
      showToast('Đã cập nhật thứ tự Menu!', 'success');
    } catch (err) {
      console.error('Reorder error:', err);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index >= navItems.length - 1) return;
    const items = [...navItems];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;

    setNavItems(items);
    try {
      await apiService.adminReorderMenuItems(items.map(i => i.id));
      showToast('Đã cập nhật thứ tự Menu!', 'success');
    } catch (err) {
      console.error('Reorder error:', err);
    }
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
      case 'MapPin': case 'Map': return <MapPin className="w-4 h-4 text-[#8C2320]" />;
      default: return <Home className="w-4 h-4 text-[#8C2320]" />;
    }
  };

  const filteredNavItems = navItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.label.toLowerCase().includes(query) ||
      item.viewType.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      {/* Toast Notification */}
      {toastState && (
        <Toast
          message={toastState.message}
          type={toastState.type}
          onClose={() => setToastState(null)}
        />
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
            Quản lý Menu Navigation (CSDL MySQL)
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6B60] mt-1">
            Dữ liệu lưu trực tiếp vào bảng <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E8DFC8] text-[#8C2320] font-mono text-xs">menu_items</code> trong MySQL Database
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {navItems.length === 0 && (
            <button
              type="button"
              onClick={handleResetToDefault}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-[#FAF8F5] hover:bg-[#E8DFC8] border border-[#D9CEBA] text-[#4A3B32] text-xs font-bold rounded-full shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#8C2320]" />
              <span>Tạo menu mặc định</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleOpenAddNavModal}
            className="px-5 py-2.5 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-full shadow-md flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm mục menu mới</span>
          </button>
        </div>
      </div>

      {/* Main Table Container Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-6">
        
        {/* Table Toolbar / Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EBE1]">
          <div>
            <h3 className="font-serif-culture text-xl font-bold text-[#8C2320]">
              Bảng Dữ liệu Menu Header
            </h3>
            <p className="text-xs text-[#7A6B60] mt-0.5">
              Hiển thị <span className="font-bold text-[#8C2320]">{filteredNavItems.length}</span> / {navItems.length} mục menu trong CSDL
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6B60]" />
              <input
                type="text"
                placeholder="Tìm tên menu, đường dẫn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#8C2320]"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenAddNavModal}
              className="px-4 py-2 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer shrink-0 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mới</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#E8DFC8]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] text-[11px] font-bold text-[#4A3B32] uppercase tracking-wider border-b border-[#E8DFC8]">
                <th className="py-3.5 px-4 w-16 text-center">STT</th>
                <th className="py-3.5 px-4">Tên mục & Icon</th>
                <th className="py-3.5 px-4">Đường dẫn liên kết (Route)</th>
                <th className="py-3.5 px-4 text-center w-28">Thứ tự</th>
                <th className="py-3.5 px-4 text-right w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFC8] text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#7A6B60]">
                    <div className="flex flex-col items-center space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#8C2320]" />
                      <p className="text-xs font-semibold">Đang tải danh sách menu từ CSDL MySQL...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredNavItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#7A6B60]">
                    <div className="space-y-3 max-w-sm mx-auto">
                      <Compass className="w-10 h-10 text-[#A8988B] mx-auto opacity-60" />
                      <p className="font-serif-culture text-sm font-bold text-[#4A3B32]">
                        {searchQuery ? 'Không tìm thấy mục menu phù hợp' : 'Chưa có mục menu nào trong bảng CSDL'}
                      </p>
                      {navItems.length === 0 && (
                        <button
                          type="button"
                          onClick={handleResetToDefault}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-[#8C2320] text-white text-xs font-bold rounded-full shadow-xs inline-flex items-center space-x-1.5 cursor-pointer hover:bg-[#6E1B19]"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Tạo các mục menu mặc định vào CSDL</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNavItems.map((item, idx) => {
                  const originalIndex = navItems.findIndex((n) => n.id === item.id);
                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-[#FAF8F5]/80 transition-colors group"
                    >
                      {/* STT */}
                      <td className="py-3.5 px-4 text-center font-bold text-[#8C2320]">
                        <span className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#D9CEBA] inline-flex items-center justify-center text-xs">
                          #{originalIndex + 1}
                        </span>
                      </td>

                      {/* Icon & Label */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl flex items-center justify-center shrink-0">
                            {renderNavIcon(item)}
                          </div>
                          <span className="font-bold text-[#2D241E] text-xs">
                            {item.label}
                          </span>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="py-3.5 px-4">
                        <span className="px-3 py-1 bg-[#FAF8F5] border border-[#E8DFC8] text-[#5C4D44] font-mono text-[11px] rounded-lg inline-block">
                          {item.viewType}
                        </span>
                      </td>

                      {/* Order Controls */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(originalIndex)}
                            disabled={originalIndex <= 0 || isSubmitting}
                            className="p-1 rounded-md text-[#7A6B60] hover:text-[#8C2320] hover:bg-[#FAF8F5] disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                            title="Di chuyển lên trên"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(originalIndex)}
                            disabled={originalIndex >= navItems.length - 1 || isSubmitting}
                            className="p-1 rounded-md text-[#7A6B60] hover:text-[#8C2320] hover:bg-[#FAF8F5] disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                            title="Di chuyển xuống dưới"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditNavModal(item)}
                          disabled={isSubmitting}
                          className="p-1.5 text-[#5C4D44] hover:text-[#8C2320] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
                          title="Sửa mục menu"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDeleteNavItem(item)}
                          disabled={isSubmitting}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa mục menu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Header Nav Item Form Modal */}
      <HeaderNavItemModal
        isOpen={isNavModalOpen}
        editingItem={editingNavItem}
        onClose={() => setIsNavModalOpen(false)}
        onSave={handleSaveNavItemModal}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteConfirmState.isOpen}
        title="Xóa mục Menu Navigation"
        message={`Bạn có chắc chắn muốn xóa mục menu "${deleteConfirmState.itemLabel}" khỏi CSDL MySQL?`}
        confirmText="Xóa mục menu"
        cancelText="Hủy"
        onConfirm={confirmDeleteNavItem}
        onCancel={() => setDeleteConfirmState({ isOpen: false, itemId: null, itemLabel: '' })}
      />
    </div>
  );
};
