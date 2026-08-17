import React, { useState } from 'react';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import { ResearchEntry } from '../../../types';
import { ImageUploader } from '../../../components/ImageUploader';

interface ResearchFormModalProps {
  isOpen: boolean;
  editingEntry: ResearchEntry | null;
  formData: Partial<ResearchEntry>;
  isSubmitting: boolean;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ResearchEntry>>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ResearchFormModal: React.FC<ResearchFormModalProps> = ({
  isOpen,
  editingEntry,
  formData,
  isSubmitting,
  setFormData,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [newFinding, setNewFinding] = useState('');

  const handleAddFinding = () => {
    if (newFinding.trim()) {
      const currentFindings = formData.findings || [];
      setFormData({ ...formData, findings: [...currentFindings, newFinding.trim()] });
      setNewFinding('');
    }
  };

  const handleRemoveFinding = (index: number) => {
    const currentFindings = formData.findings || [];
    setFormData({ ...formData, findings: currentFindings.filter((_, i) => i !== index) });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-6 animate-scaleUp border border-[#E8DFC8]">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
          <h3 className="font-serif-culture text-xl font-bold text-[#2D241E]">
            {editingEntry ? 'Chỉnh sửa nhật ký nghiên cứu' : 'Thêm ghi chép nghiên cứu mới'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FAF8F5] text-[#7A6B60]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tên công trình / Ghi chép điền dã *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A] focus:ring-1 focus:ring-[#114D3A]"
              placeholder="Nhập tiêu đề đợt điền dã..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Ngày thực địa</label>
              <input
                type="text"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="Ví dụ: 15/02/2026"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Địa điểm khảo sát</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="Làng Diềm, TP. Bắc Ninh"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Giai đoạn nghiên cứu</label>
              <input
                type="text"
                value={formData.phase || ''}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="Giai đoạn 1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Loại Biểu tượng (Icon)</label>
              <select
                value={formData.iconType || 'book'}
                onChange={(e) => setFormData({ ...formData, iconType: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
              >
                <option value="book">Sách tư liệu (Book)</option>
                <option value="mic">Âm thanh / Hát canh (Mic)</option>
                <option value="camera">Ghi hình / Phim (Camera)</option>
                <option value="map">Bản đồ điền dã (Map)</option>
                <option value="users">Hội thảo / Kết nghĩa (Users)</option>
                <option value="archive">Lưu trữ băng đĩa (Archive)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Người / Đoàn nghiên cứu</label>
              <input
                type="text"
                value={formData.researcher || ''}
                onChange={(e) => setFormData({ ...formData, researcher: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="Đoàn điền dã Mạch Quan Họ"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Bản thu âm đi kèm (nếu có)</label>
              <input
                type="text"
                value={formData.audioTitle || ''}
                onChange={(e) => setFormData({ ...formData, audioTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="Hát lề lối: La Rằng..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Ảnh tư liệu điền dã *</label>
            <ImageUploader
              value={formData.images && formData.images.length > 0 ? formData.images[0] : ''}
              onChange={(url) => setFormData({ ...formData, images: url ? [url] : [] })}
              placeholder="Chọn hoặc tải lên ảnh tư liệu điền dã..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tóm tắt nội dung điền dã *</label>
            <textarea
              rows={2}
              required
              value={formData.summary || ''}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
              placeholder="Tóm tắt ngắn gọn mục tiêu và kết quả chuyến đi..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Nội dung báo cáo điền dã chi tiết</label>
            <textarea
              rows={4}
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
              placeholder="Nội dung báo cáo chi tiết..."
            />
          </div>

          {/* Key Findings List */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#4A3B32]">Kết quả / Phát hiện quan trọng (Findings)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFinding}
                onChange={(e) => setNewFinding(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFinding(); } }}
                className="flex-1 px-3.5 py-2 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="Nhập 1 phát hiện nổi bật..."
              />
              <button
                type="button"
                onClick={handleAddFinding}
                className="px-3.5 py-2 rounded-xl bg-[#114D3A] text-white text-xs font-bold hover:bg-[#0D3B2C] flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>
            {formData.findings && formData.findings.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {formData.findings.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5] border border-[#E8DFC8] text-xs">
                    <span className="text-[#2D241E]">• {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFinding(idx)}
                      className="text-[#8C2F2F] hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs font-bold text-[#6B5A4E] hover:bg-[#FAF8F5]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#114D3A] text-white text-xs font-bold hover:bg-[#0D3B2C] flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>{editingEntry ? 'Cập nhật ghi chép' : 'Lưu ghi chép mới'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
