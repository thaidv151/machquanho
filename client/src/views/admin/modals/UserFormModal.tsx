import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { AdminUser } from '../../../types';
import { ImageUploader } from '../../../components/ImageUploader';

interface UserFormModalProps {
  isOpen: boolean;
  editingUser: AdminUser | null;
  userFormData: Partial<AdminUser>;
  isSubmitting: boolean;
  setUserFormData: React.Dispatch<React.SetStateAction<Partial<AdminUser>>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  editingUser,
  userFormData,
  isSubmitting,
  setUserFormData,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative space-y-5 animate-scaleUp border border-[#E8DFC8]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]">
          <h3 className="font-serif-culture text-xl font-bold text-[#2D241E]">
            {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-[#7A6B60] hover:text-[#2D241E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Họ và tên *</label>
            <input
              type="text"
              required
              placeholder="VD: Nguyễn Văn A"
              value={userFormData.name || ''}
              onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Email truy cập *</label>
            <input
              type="email"
              required
              placeholder="admin@machquanho.vn"
              value={userFormData.email || ''}
              onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Số điện thoại liên hệ</label>
            <input
              type="text"
              placeholder="0988 123 456"
              value={userFormData.phone || ''}
              onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
            />
          </div>

          <ImageUploader
            label="Ảnh đại diện (Avatar)"
            value={userFormData.avatar || ''}
            onChange={(url) => setUserFormData({ ...userFormData, avatar: url })}
            aspectRatio="square"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Vai trò</label>
              <select
                value={userFormData.role || 'Biên tập viên'}
                onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as AdminUser['role'] })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              >
                <option value="Quản trị viên">Quản trị viên</option>
                <option value="Biên tập viên">Biên tập viên</option>
                <option value="Cộng tác viên">Cộng tác viên</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Trạng thái</label>
              <select
                value={userFormData.status || 'Hoạt động'}
                onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value as 'Hoạt động' | 'Khóa' })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              >
                <option value="Hoạt động">Hoạt động</option>
                <option value="Khóa">Khóa</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-full text-xs font-bold text-[#5C4D44] bg-[#FAF8F5]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#8C2320] flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>{editingUser ? 'Cập nhật' : 'Thêm người dùng'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
