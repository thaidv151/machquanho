import React from 'react';
import { X, Loader2 } from 'lucide-react';

interface CategoryFormModalProps {
  isOpen: boolean;
  newCatName: string;
  newCatColor: string;
  newCatDesc: string;
  isSubmitting: boolean;
  setNewCatName: (val: string) => void;
  setNewCatColor: (val: string) => void;
  setNewCatDesc: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  newCatName,
  newCatColor,
  newCatDesc,
  isSubmitting,
  setNewCatName,
  setNewCatColor,
  setNewCatDesc,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 relative space-y-4 animate-scaleUp border border-[#E8DFC8]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]">
          <h3 className="font-serif-culture text-lg font-bold text-[#2D241E]">
            Thêm chuyên mục mới
          </h3>
          <button onClick={onClose} className="p-1 text-[#7A6B60]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tên chuyên mục *</label>
            <input
              type="text"
              required
              placeholder="VD: Không gian Lễ hội"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Màu sắc đại diện</label>
            <input
              type="color"
              value={newCatColor}
              onChange={(e) => setNewCatColor(e.target.value)}
              className="w-full h-10 p-1 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Mô tả ngắn</label>
            <input
              type="text"
              placeholder="Mô tả tóm tắt ý nghĩa chuyên mục..."
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
            />
          </div>

          <div className="pt-3 border-t border-[#E8DFC8] flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-full text-xs font-bold text-[#5C4D44] bg-[#FAF8F5]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-1.5 rounded-full text-xs font-bold text-white bg-[#8C2320] flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Tạo...</span>
                </>
              ) : (
                <span>Tạo chuyên mục</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
