import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { TimelineEntry } from '../../../types';
import { ImageUploader } from '../../../components/ImageUploader';

interface TimelineFormModalProps {
  isOpen: boolean;
  editingEntry: TimelineEntry | null;
  formData: Partial<TimelineEntry>;
  isSubmitting: boolean;
  setFormData: React.Dispatch<React.SetStateAction<Partial<TimelineEntry>>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TimelineFormModal: React.FC<TimelineFormModalProps> = ({
  isOpen,
  editingEntry,
  formData,
  isSubmitting,
  setFormData,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-6 animate-scaleUp border border-[#E8DFC8]">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
          <h3 className="font-serif-culture text-xl font-bold text-[#2D241E]">
            {editingEntry ? 'Chỉnh sửa mốc Dòng chảy Quan Họ' : 'Thêm mốc Dòng chảy Quan Họ mới'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FAF8F5] text-[#7A6B60]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Loại dòng chảy *</label>
              <select
                value={formData.type || 'heritage'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'heritage' | 'policy' })}
                className="w-full px-3 py-2 border border-[#E8DFC8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007f32] text-[#2D241E] bg-[#FAF8F5]"
              >
                <option value="heritage">Dòng chảy di sản (Lịch sử, UNESCO, Văn hóa)</option>
                <option value="policy">Dòng chảy chính sách (Quyết định, Chủ trương, Đề án)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Thời gian / Giai đoạn *</label>
              <input
                type="text"
                value={formData.period || ''}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="VD: Thế kỷ 17 - 18, Năm 2009, Năm 2013..."
                className="w-full px-3 py-2 border border-[#E8DFC8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007f32] text-[#2D241E]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tiêu đề mốc lịch sử / chính sách *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Sự hình thành dòng ca Quan Họ / UNESCO vinh danh"
              className="w-full px-3 py-2 border border-[#E8DFC8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007f32] text-[#2D241E]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Nội dung chi tiết mốc lịch sử *</label>
            <textarea
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả bối cảnh, ý nghĩa và những diễn biến trọng tâm của cột mốc..."
              className="w-full px-3 py-2 border border-[#E8DFC8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007f32] text-[#2D241E]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Biểu tượng Icon watermark</label>
              <select
                value={formData.icon || 'landmark'}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-[#E8DFC8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007f32] text-[#2D241E] bg-[#FAF8F5]"
              >
                <option value="landmark">🏛️ Di sản / Công trình (Landmark)</option>
                <option value="scroll">📜 Cuộn thư / Văn bản (Scroll)</option>
                <option value="award">🏆 Giải thưởng / Danh hiệu (Award)</option>
                <option value="sparkles">✨ Nổi bật / Đặc sắc (Sparkles)</option>
                <option value="globe">🌐 Thế giới / UNESCO (Globe)</option>
                <option value="book">📚 Tư liệu / Sách (Book)</option>
                <option value="policy">⚖️ Chính sách / Pháp lý (Policy)</option>
                <option value="document">📄 Quyết định / Văn kiện (Document)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Thứ tự hiển thị (Sort Order)</label>
              <input
                type="number"
                value={formData.sortOrder ?? 0}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-[#E8DFC8] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007f32] text-[#2D241E]"
              />
            </div>
          </div>

          {/* Mandatory ImageUploader Component Rule */}
          <div>
            <ImageUploader
              label="Hình ảnh minh họa mốc timeline"
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished !== false}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 text-[#007f32] rounded focus:ring-[#007f32]"
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-[#2D241E]">
              Hiển thị mốc lịch sử này trên trang chủ public
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#E8DFC8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#7A6B60] hover:bg-[#FAF8F5] rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 bg-[#007f32] hover:bg-[#006628] text-white text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>{editingEntry ? 'Cập nhật' : 'Thêm mới'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimelineFormModal;
