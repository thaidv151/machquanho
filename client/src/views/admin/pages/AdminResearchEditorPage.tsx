import React, { useState } from 'react';
import { ArrowLeft, Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { ResearchEntry } from '../../../types';
import { ImageUploader } from '../../../components/ImageUploader';
import Editor from '../../../components/Editor';

interface AdminResearchEditorPageProps {
  editingEntry: ResearchEntry | null;
  isSubmitting: boolean;
  onSave: (entryData: Partial<ResearchEntry>) => Promise<void>;
  onBack: () => void;
}

export const AdminResearchEditorPage: React.FC<AdminResearchEditorPageProps> = ({
  editingEntry,
  isSubmitting,
  onSave,
  onBack,
}) => {
  const [formData, setFormData] = useState<Partial<ResearchEntry>>(() => {
    let parsedFindings: string[] = [];
    if (editingEntry?.findings) {
      if (Array.isArray(editingEntry.findings)) {
        parsedFindings = editingEntry.findings;
      } else if (typeof editingEntry.findings === 'string') {
        try {
          parsedFindings = JSON.parse(editingEntry.findings);
        } catch {
          parsedFindings = [editingEntry.findings];
        }
      }
    }

    let parsedImages: string[] = [];
    if (editingEntry?.images) {
      if (Array.isArray(editingEntry.images)) {
        parsedImages = editingEntry.images;
      } else if (typeof editingEntry.images === 'string') {
        try {
          parsedImages = JSON.parse(editingEntry.images);
        } catch {
          parsedImages = [editingEntry.images];
        }
      }
    }

    if (editingEntry) {
      return {
        ...editingEntry,
        findings: parsedFindings,
        images: parsedImages,
        sortOrder: editingEntry.sortOrder ?? (editingEntry as any).sort_order ?? 0,
      };
    }
    return {
      title: '',
      date: new Date().toLocaleDateString('vi-VN'),
      location: 'Bắc Ninh',
      phase: 'Giai đoạn 1',
      iconType: 'mic',
      researcher: 'Đoàn điền dã Mạch Quan Họ',
      summary: '',
      content: '',
      findings: [],
      images: [],
      audioTitle: '',
      sortOrder: 0,
    };
  });

  const [newFinding, setNewFinding] = useState('');

  const handleAddFinding = () => {
    if (newFinding.trim()) {
      const currentFindings = Array.isArray(formData.findings) ? formData.findings : [];
      setFormData(prev => ({ ...prev, findings: [...currentFindings, newFinding.trim()] }));
      setNewFinding('');
    }
  };

  const handleRemoveFinding = (index: number) => {
    const currentFindings = Array.isArray(formData.findings) ? formData.findings : [];
    setFormData(prev => ({ ...prev, findings: currentFindings.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col animate-fadeIn">
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5] border-b border-[#E8DFC8] px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-full hover:bg-[#EAE1D2] text-[#4A3B32] transition-colors cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif-culture text-xl font-bold text-[#2D241E]">
              {editingEntry ? 'Chỉnh sửa nhật ký nghiên cứu' : 'Tạo ghi chép nghiên cứu mới'}
            </h1>
            <p className="text-xs text-[#7A6B60]">
              {editingEntry ? `ID: ${editingEntry.id} — ${editingEntry.title}` : 'Ghi chép khảo sát thực địa & thu thập tư liệu quan họ'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-full text-xs font-bold text-[#5C4D44] bg-white border border-[#D9CEBA] hover:bg-[#EAE1D2] transition-colors cursor-pointer"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title?.trim()}
            className="px-6 py-2 rounded-full text-xs font-bold text-white bg-[#114D3A] hover:bg-[#0D3B2C] flex items-center space-x-2 shadow-sm disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{editingEntry ? 'Cập nhật ghi chép' : 'Lưu ghi chép mới'}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <form onSubmit={handleSubmit} className="flex-1 p-6 max-w-[1480px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Main Content Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Entry Title */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-2">
            <label className="block text-xs font-bold text-[#4A3B32] uppercase tracking-wider">
              Tên công trình / Ghi chép điền dã *
            </label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề chuyến khảo sát thực địa..."
              className="w-full text-lg sm:text-xl font-serif-culture font-bold text-[#2D241E] p-3 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl focus:ring-2 focus:ring-[#114D3A] focus:outline-none"
            />
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-2">
            <label className="block text-xs font-bold text-[#4A3B32] uppercase tracking-wider">
              Tóm tắt nội dung điền dã *
            </label>
            <textarea
              rows={3}
              required
              value={formData.summary || ''}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Tóm tắt ngắn gọn mục tiêu và kết quả chính của chuyến thực địa..."
              className="w-full p-3 text-xs sm:text-sm text-[#2D241E] bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl focus:ring-2 focus:ring-[#114D3A] focus:outline-none"
            />
          </div>

          {/* TipTap Rich Text Editor for Detailed Report */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-3">
            <label className="block text-xs font-bold text-[#4A3B32] uppercase tracking-wider">
              Nội dung báo cáo điền dã chi tiết (TipTap Editor)
            </label>
            <Editor
              value={formData.content || ''}
              onChange={(val) => setFormData({ ...formData, content: val })}
              minHeight={450}
            />
          </div>

          {/* Key Findings List */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
            <label className="block text-xs font-bold text-[#4A3B32] uppercase tracking-wider">
              Kết quả / Phát hiện quan trọng (Findings)
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFinding}
                onChange={(e) => setNewFinding(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFinding();
                  }
                }}
                className="flex-1 p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                placeholder="Nhập 1 kết quả/tư liệu thu thập được..."
              />
              <button
                type="button"
                onClick={handleAddFinding}
                className="px-4 py-2.5 bg-[#114D3A] text-white text-xs font-bold rounded-xl flex items-center space-x-1 hover:bg-[#0D3B2C] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm</span>
              </button>
            </div>

            {formData.findings && formData.findings.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#EDE5D8]">
                {formData.findings.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E8DFC8] text-xs text-[#2D241E]">
                    <span>• {item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFinding(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Settings Sidebar Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Metadata & Logistics */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
            <h3 className="font-serif-culture font-bold text-sm text-[#2D241E] border-b border-[#EDE5D8] pb-3">
              Thông tin thực địa
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">Số thứ tự sắp xếp (STT)</label>
              <input
                type="number"
                value={formData.sortOrder ?? 0}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                placeholder="0 (Số nhỏ hơn lên trước)"
              />
              <p className="text-[10.5px] text-[#7A6B60] mt-1">Số nhỏ xếp lên trước (0, 1, 2...)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">Ngày thực địa</label>
              <input
                type="text"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                placeholder="VD: 15/02/2026"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">Địa điểm khảo sát</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                placeholder="Làng Diềm, TP. Bắc Ninh"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">Giai đoạn nghiên cứu</label>
              <input
                type="text"
                value={formData.phase || ''}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                placeholder="Giai đoạn 1"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">Loại Biểu tượng (Icon)</label>
              <select
                value={formData.iconType || 'mic'}
                onChange={(e) => setFormData({ ...formData, iconType: e.target.value as any })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] font-medium"
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
              <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">Người / Đoàn nghiên cứu</label>
              <input
                type="text"
                value={formData.researcher || ''}
                onChange={(e) => setFormData({ ...formData, researcher: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                placeholder="Đoàn điền dã Mạch Quan Họ"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">Bản thu âm đi kèm (nếu có)</label>
              <input
                type="text"
                value={formData.audioTitle || ''}
                onChange={(e) => setFormData({ ...formData, audioTitle: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                placeholder="Hát lề lối: La Rằng..."
              />
            </div>
          </div>

          {/* Research Photo Evidence */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] shadow-xs">
            <ImageUploader
              label="Ảnh tư liệu khảo sát thực tế"
              value={formData.images && formData.images.length > 0 ? formData.images[0] : ''}
              onChange={(url) => setFormData({ ...formData, images: url ? [url] : [] })}
              placeholder="Chọn hoặc tải lên ảnh tư liệu điền dã..."
            />
          </div>

        </div>

      </form>
    </div>
  );
};
