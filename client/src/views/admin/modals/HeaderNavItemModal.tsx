import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { HeaderNavItem } from '../../../types';
import { ImageUploader } from '../../../components/ImageUploader';

interface HeaderNavItemModalProps {
  isOpen: boolean;
  editingItem: HeaderNavItem | null;
  onClose: () => void;
  onSave: (item: HeaderNavItem) => void;
}

const PRESET_ICONS = [
  'Home', 'Newspaper', 'BookOpen', 'Users', 'Sparkles', 'Music', 'Globe', 'Bookmark', 'Award', 'Calendar'
];

export const HeaderNavItemModal: React.FC<HeaderNavItemModalProps> = ({
  isOpen,
  editingItem,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<HeaderNavItem>({
    id: `nav-${Date.now()}`,
    label: '',
    viewType: 'home',
    icon: 'Home',
    customIconUrl: '',
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({ ...editingItem });
    } else {
      setFormData({
        id: `nav-${Date.now()}`,
        label: '',
        viewType: 'home',
        icon: 'Home',
        customIconUrl: '',
      });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative space-y-5 animate-scaleUp border border-[#E8DFC8]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]">
          <h3 className="font-serif-culture text-xl font-bold text-[#2D241E]">
            {editingItem ? 'Chỉnh sửa mục Menu' : 'Thêm mục Menu mới'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#7A6B60] hover:text-[#2D241E] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tên mục Menu *</label>
            <input
              type="text"
              required
              placeholder="VD: Tin tức & Sự kiện"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs font-bold text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Trang liên kết (Route)</label>
            <select
              value={formData.viewType}
              onChange={(e) => setFormData({ ...formData, viewType: e.target.value as any })}
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
            >
              <option value="home">Trang chủ (/)</option>
              <option value="news">Tin tức & Hoạt động (/news)</option>
              <option value="research-diary">Nhật ký nghiên cứu (/research-diary)</option>
              <option value="about">Về chúng tôi (/about)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Icon hệ thống (Lucide)</label>
            <select
              value={formData.icon || 'Home'}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
            >
              {PRESET_ICONS.map((iconName) => (
                <option key={iconName} value={iconName}>
                  {iconName}
                </option>
              ))}
            </select>
          </div>

          <ImageUploader
            label="Tải tệp / Nhập URL Logo Icon riêng (Tùy chọn)"
            value={formData.customIconUrl || ''}
            onChange={(url) => setFormData({ ...formData, customIconUrl: url })}
            aspectRatio="square"
          />

          <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs font-bold text-[#5C4D44] bg-[#FAF8F5] cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#8C2320] hover:bg-[#6E1B19] flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <span>{editingItem ? 'Cập nhật' : 'Thêm mục menu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
