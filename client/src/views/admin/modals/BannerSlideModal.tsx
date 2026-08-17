import React, { useState, useEffect } from 'react';
import { X, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { BannerSlideItem } from '../../../types';
import { ImageUploader } from '../../../components/ImageUploader';
import { BannerButtonsEditor } from '../components/BannerButtonsEditor';

interface BannerSlideModalProps {
  isOpen: boolean;
  editingSlide: BannerSlideItem | null;
  onClose: () => void;
  onSave: (slide: BannerSlideItem) => void;
}

export const BannerSlideModal: React.FC<BannerSlideModalProps> = ({
  isOpen,
  editingSlide,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<BannerSlideItem>({
    id: `slide-${Date.now()}`,
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85',
    headline: 'MẠCH QUAN HỌ',
    headlineFontSize: 'large',
    subtitle: 'Giữ mạch di sản – Khơi mạch tương lai',
    subtitleFontSize: 'normal',
    introText: 'Cổng thông tin chuyên biệt, số hóa tư liệu điền dã và tôn vinh nét đẹp Dân ca Quan họ Bắc Ninh.',
    introFontSize: 'normal',
    textAlign: 'left',
    quote: '"Người ơi người ở đừng về - Câu hát ngàn xưa thắm đượm tình người đất Bắc."',
    buttons: [
      { id: 'b1', text: 'Khám phá ngay', icon: 'ChevronRight', link: 'news', bgColor: '#8C2320', textColor: '#FFFFFF' },
      { id: 'b2', text: 'Nghe làn điệu', icon: 'Music', link: 'audio-play', bgColor: '#F2EDE4', textColor: '#6B201D' },
    ]
  });

  useEffect(() => {
    if (editingSlide) {
      setFormData({ ...editingSlide });
    } else {
      setFormData({
        id: `slide-${Date.now()}`,
        imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85',
        headline: 'MẠCH QUAN HỌ',
        headlineFontSize: 'large',
        subtitle: 'Giữ mạch di sản – Khơi mạch tương lai',
        subtitleFontSize: 'normal',
        introText: 'Cổng thông tin chuyên biệt, số hóa tư liệu điền dã và tôn vinh nét đẹp Dân ca Quan họ Bắc Ninh.',
        introFontSize: 'normal',
        textAlign: 'left',
        quote: '"Người ơi người ở đừng về - Câu hát ngàn xưa thắm đượm tình người đất Bắc."',
        buttons: [
          { id: 'b1', text: 'Khám phá ngay', icon: 'ChevronRight', link: 'news', bgColor: '#8C2320', textColor: '#FFFFFF' },
          { id: 'b2', text: 'Nghe làn điệu', icon: 'Music', link: 'audio-play', bgColor: '#F2EDE4', textColor: '#6B201D' },
        ]
      });
    }
  }, [editingSlide, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl.trim() || !formData.headline?.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative space-y-6 animate-scaleUp border border-[#E8DFC8] my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8] sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-serif-culture text-xl font-bold text-[#2D241E]">
              {editingSlide ? 'Chỉnh sửa Bản ghi Slide Banner' : 'Thêm Bản ghi Slide Banner Mới'}
            </h3>
            <p className="text-xs text-[#7A6B60]">Tùy chỉnh ảnh, vị trí chữ, cỡ chữ và danh sách các nút bấm tùy chỉnh màu sắc</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#7A6B60] hover:text-[#2D241E] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Uploader */}
          <ImageUploader
            label="Ảnh nền Slide Banner *"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            aspectRatio="wide"
          />

          {/* Text Alignment */}
          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-2">Vị trí căn chỉnh chữ (Text Alignment)</label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, textAlign: 'left' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border cursor-pointer ${
                  (formData.textAlign || 'left') === 'left' ? 'bg-[#8C2320] text-white border-[#8C2320]' : 'bg-[#FAF8F5] text-[#5C4D44] border-[#D9CEBA]'
                }`}
              >
                <AlignLeft className="w-4 h-4" />
                <span>Căn trái (Left)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, textAlign: 'center' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border cursor-pointer ${
                  formData.textAlign === 'center' ? 'bg-[#8C2320] text-white border-[#8C2320]' : 'bg-[#FAF8F5] text-[#5C4D44] border-[#D9CEBA]'
                }`}
              >
                <AlignCenter className="w-4 h-4" />
                <span>Căn giữa (Center)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, textAlign: 'right' })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border cursor-pointer ${
                  formData.textAlign === 'right' ? 'bg-[#8C2320] text-white border-[#8C2320]' : 'bg-[#FAF8F5] text-[#5C4D44] border-[#D9CEBA]'
                }`}
              >
                <AlignRight className="w-4 h-4" />
                <span>Căn phải (Right)</span>
              </button>
            </div>
          </div>

          {/* Slide Effect & Text Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Hiệu ứng chuyển ảnh Slide</label>
              <select
                value={formData.slideEffect || 'fade'}
                onChange={(e) => setFormData({ ...formData, slideEffect: e.target.value as any })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              >
                <option value="fade">Mờ dần (Fade In)</option>
                <option value="slide-left">Trượt sang Trái (Slide Left)</option>
                <option value="slide-right">Trượt sang Phải (Slide Right)</option>
                <option value="zoom">Phóng to nhẹ (Zoom In)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Hiệu ứng xuất hiện Chữ</label>
              <select
                value={formData.textAnimation || 'slideUp'}
                onChange={(e) => setFormData({ ...formData, textAnimation: e.target.value as any })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              >
                <option value="slideUp">Trượt từ dưới lên (Slide Up)</option>
                <option value="fadeIn">Hiện dần (Fade In)</option>
                <option value="slideDown">Trượt từ trên xuống (Slide Down)</option>
                <option value="zoomIn">Phóng to xuất hiện (Zoom In / Pop)</option>
                <option value="bounce">Nảy nhẹ sống động (Bounce In)</option>
              </select>
            </div>
          </div>

          {/* Tagline Badge & Font Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Thẻ nhãn nhỏ trên cùng (Tagline Badge)</label>
              <input
                type="text"
                placeholder="VD: Không gian văn hóa Dân ca Quan họ Bắc Ninh"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs font-semibold text-[#2D241E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Cỡ chữ Thẻ nhãn</label>
              <select
                value={formData.taglineFontSize || 'base'}
                onChange={(e) => setFormData({ ...formData, taglineFontSize: e.target.value as any })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              >
                <option value="xs">Siêu nhỏ (12px)</option>
                <option value="sm">Nhỏ (14px)</option>
                <option value="base">Vừa (16px - Chuẩn)</option>
                <option value="lg">Lớn (18px)</option>
                <option value="xl">Rất lớn (20px)</option>
                <option value="2xl">Cực đại (24px)</option>
              </select>
            </div>
          </div>

          {/* Headline & Font Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tiêu đề chính (Headline) *</label>
              <input
                type="text"
                required
                placeholder="MẠCH QUAN HỌ"
                value={formData.headline || ''}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs font-bold text-[#2D241E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Cỡ chữ Tiêu đề chính</label>
              <select
                value={formData.headlineFontSize || '6xl'}
                onChange={(e) => setFormData({ ...formData, headlineFontSize: e.target.value as any })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              >
                <option value="2xl">Nhỏ (24px)</option>
                <option value="3xl">Vừa nhỏ (30px)</option>
                <option value="4xl">Vừa (36px)</option>
                <option value="5xl">Lớn vừa (48px)</option>
                <option value="6xl">Lớn (60px - Chuẩn)</option>
                <option value="7xl">Cực đại (72px)</option>
                <option value="8xl">Siêu cực đại (96px)</option>
              </select>
            </div>
          </div>

          {/* Subtitle & Font Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tiêu đề phụ (Subtitle)</label>
              <input
                type="text"
                placeholder="Giữ mạch di sản – Khơi mạch tương lai"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Cỡ chữ Tiêu đề phụ</label>
              <select
                value={formData.subtitleFontSize || '2xl'}
                onChange={(e) => setFormData({ ...formData, subtitleFontSize: e.target.value as any })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              >
                <option value="sm">Rất nhỏ (14px)</option>
                <option value="base">Nhỏ (16px)</option>
                <option value="lg">Vừa (18px)</option>
                <option value="xl">Lớn vừa (20px)</option>
                <option value="2xl">Lớn (24px - Chuẩn)</option>
                <option value="3xl">Cực đại (30px)</option>
                <option value="4xl">Siêu cực đại (36px)</option>
              </select>
            </div>
          </div>

          {/* Intro Text & Font Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Đoạn văn giới thiệu ngắn</label>
              <textarea
                rows={2}
                placeholder="Đoạn văn mô tả tóm tắt cho slide này..."
                value={formData.introText || ''}
                onChange={(e) => setFormData({ ...formData, introText: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Cỡ chữ Đoạn văn</label>
              <select
                value={formData.introFontSize || 'base'}
                onChange={(e) => setFormData({ ...formData, introFontSize: e.target.value as any })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              >
                <option value="xs">Siêu nhỏ (12px)</option>
                <option value="sm">Nhỏ (14px)</option>
                <option value="base">Vừa (16px - Chuẩn)</option>
                <option value="lg">Lớn (18px)</option>
                <option value="xl">Rất lớn (20px)</option>
              </select>
            </div>
          </div>

          {/* Quote Text */}
          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Câu ca dao / Trích dẫn nổi bật</label>
            <input
              type="text"
              placeholder='"Người ơi người ở đừng về..."'
              value={formData.quote || ''}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] italic"
            />
          </div>

          {/* Dynamic Buttons List Editor */}
          <BannerButtonsEditor
            buttons={formData.buttons || []}
            onChange={(updatedBtns) => setFormData({ ...formData, buttons: updatedBtns })}
          />

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#E8DFC8] flex items-center justify-end space-x-3 sticky bottom-0 bg-white z-10">
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
              <span>{editingSlide ? 'Cập nhật Slide' : 'Thêm Slide mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
