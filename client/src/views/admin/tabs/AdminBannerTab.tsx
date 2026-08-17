import React, { useState } from 'react';
import { 
  Save, Loader2, Plus, Trash2, ArrowUp, ArrowDown, AlignLeft, 
  AlignCenter, AlignRight, Sliders, Image as ImageIcon, Pencil, CheckCircle2, Circle 
} from 'lucide-react';
import { SiteBannerConfig, BannerSlideItem } from '../../../types';
import { ImageUploader } from '../../../components/ImageUploader';
import { BannerSlideModal } from '../modals/BannerSlideModal';
import { BannerButtonsEditor } from '../components/BannerButtonsEditor';

interface AdminBannerTabProps {
  bannerForm: SiteBannerConfig;
  siteInfoForm: {
    siteName: string;
    logoText: string;
    logoSubtext: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
  isSubmitting: boolean;
  setBannerForm: React.Dispatch<React.SetStateAction<SiteBannerConfig>>;
  setSiteInfoForm: React.Dispatch<React.SetStateAction<{
    siteName: string;
    logoText: string;
    logoSubtext: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
}

export const AdminBannerTab: React.FC<AdminBannerTabProps> = ({
  bannerForm,
  siteInfoForm,
  isSubmitting,
  setBannerForm,
  setSiteInfoForm,
  onSubmit,
}) => {
  const mode = bannerForm.mode || 'static';
  const slides = Array.isArray(bannerForm.slides) ? bannerForm.slides : [];

  // Modal State for Slide editing
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<BannerSlideItem | null>(null);

  const handleOpenAddSlideModal = () => {
    setEditingSlide(null);
    setIsSlideModalOpen(true);
  };

  const handleOpenEditSlideModal = (slide: BannerSlideItem) => {
    setEditingSlide(slide);
    setIsSlideModalOpen(true);
  };

  const handleSaveSlideModal = (slide: BannerSlideItem) => {
    if (editingSlide) {
      setBannerForm(prev => ({
        ...prev,
        slides: (prev.slides || []).map(s => s.id === slide.id ? slide : s)
      }));
    } else {
      setBannerForm(prev => ({
        ...prev,
        slides: [...(prev.slides || []), slide]
      }));
    }
    setIsSlideModalOpen(false);
  };

  const handleDeleteSlide = (id: string) => {
    setBannerForm(prev => ({
      ...prev,
      slides: (prev.slides || []).filter(s => s.id !== id)
    }));
  };

  const handleMoveSlideUp = (index: number) => {
    if (index <= 0) return;
    setBannerForm(prev => {
      const list = [...(prev.slides || [])];
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
      return { ...prev, slides: list };
    });
  };

  const handleMoveSlideDown = (index: number) => {
    if (index >= slides.length - 1) return;
    setBannerForm(prev => {
      const list = [...(prev.slides || [])];
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
      return { ...prev, slides: list };
    });
  };

  const getAlignLabel = (align?: string) => {
    switch (align) {
      case 'center': return 'Căn giữa';
      case 'right': return 'Căn phải';
      default: return 'Căn trái';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      {/* Title & Save Button Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
            Cấu hình Giao diện & Banner Trang chủ
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6B60] mt-1">
            Tùy chọn hiển thị Banner Tĩnh hoặc dạng Slider nhiều ảnh, căn chỉnh chữ, chiều cao và tốc độ slider
          </p>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-full shadow-md transition-all flex items-center space-x-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        
        {/* CARD 1: Display Mode & Frame Settings */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-6">
          <div className="border-b border-[#F0EBE1] pb-3">
            <h3 className="font-serif-culture text-xl font-bold text-[#8C2320]">
              1. Chọn Chế độ Hiển thị Banner Trang chủ
            </h3>
            <p className="text-xs text-[#7A6B60] mt-0.5">Chọn giữa 1 ảnh Banner tĩnh duy nhất hoặc Carousel Slider chuyển động nhiều ảnh</p>
          </div>

          {/* Prominent Mode Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* OPTION A: STATIC BANNER */}
            <div
              onClick={() => setBannerForm({ ...bannerForm, mode: 'static' })}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                mode === 'static'
                  ? 'bg-[#8C2320]/5 border-[#8C2320] shadow-md ring-2 ring-[#8C2320]/20'
                  : 'bg-[#FAF8F5] border-[#E8DFC8] hover:border-[#8C2320]/50 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    mode === 'static' ? 'bg-[#8C2320] text-white shadow-xs' : 'bg-[#E8DFC8]/60 text-[#7A6B60]'
                  }`}>
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#2D241E]">
                      Banner Tĩnh (1 Ảnh cố định)
                    </h4>
                    <span className="text-[11px] font-bold text-[#8C2320] bg-[#8C2320]/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      Chỉ 1 Ảnh Nền
                    </span>
                  </div>
                </div>
                {mode === 'static' ? (
                  <CheckCircle2 className="w-6 h-6 text-[#8C2320] shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 shrink-0" />
                )}
              </div>

              <p className="text-xs text-[#5C4D44] leading-relaxed">
                Sử dụng 1 bức ảnh duy nhất làm nền Hero chính. Phù hợp khi muốn thông điệp đơn giản, súc tích và tối ưu tốc độ tải trang.
              </p>

              {mode === 'static' && (
                <div className="text-[11px] font-bold text-[#8C2320] flex items-center space-x-1.5 pt-2 border-t border-[#8C2320]/15">
                  <span>✓ Đang áp dụng Chế độ Banner Tĩnh</span>
                </div>
              )}
            </div>

            {/* OPTION B: MULTI-IMAGE SLIDER */}
            <div
              id="banner-mode-slider-card"
              onClick={() => {
                setBannerForm({ ...bannerForm, mode: 'slider' });
              }}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                mode === 'slider'
                  ? 'bg-gradient-to-br from-[#8C2320]/10 via-[#8C2320]/5 to-white border-[#8C2320] shadow-lg ring-4 ring-[#8C2320]/20 scale-[1.01]'
                  : 'bg-[#FAF8F5] border-[#E8DFC8] hover:border-[#8C2320]/50 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                    mode === 'slider' ? 'bg-[#8C2320] text-white shadow-md scale-105' : 'bg-[#E8DFC8]/60 text-[#7A6B60]'
                  }`}>
                    <Sliders className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#2D241E]">
                      Slider Carousel (Nhiều Ảnh chuyển động)
                    </h4>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                      mode === 'slider' ? 'bg-[#007F32] text-white shadow-2xs' : 'bg-[#007F32]/10 text-[#007F32]'
                    }`}>
                      ★ Đang chọn: Danh sách Nhiều Slide ({slides.length})
                    </span>
                  </div>
                </div>
                {mode === 'slider' ? (
                  <CheckCircle2 className="w-7 h-7 text-[#8C2320] shrink-0 animate-bounce" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 shrink-0" />
                )}
              </div>

              <p className="text-xs text-[#5C4D44] leading-relaxed">
                Trình chiếu danh sách nhiều Slide ảnh tự động. Mỗi slide có thể tùy chỉnh hình ảnh, vị trí chữ, cỡ chữ và các nút bấm riêng.
              </p>

              {mode === 'slider' && (
                <div className="text-xs font-extrabold text-[#007F32] flex items-center justify-between pt-2 border-t border-[#007F32]/20">
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-[#007F32] animate-ping" />
                    <span>✓ ĐANG ÁP DỤNG SLIDER NHIỀU ẢNH</span>
                  </span>
                  <span className="text-[11px] font-normal underline text-[#8C2320]">Quản lý {slides.length} slide bên dưới &darr;</span>
                </div>
              )}
            </div>

          </div>

          {/* Banner Height & Controls Grid */}
          <div className="pt-4 border-t border-[#F0EBE1] grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner Height Selection */}
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-2">Chiều cao khung Banner (Banner Height)</label>
              <select
                value={bannerForm.height || 'medium'}
                onChange={(e) => setBannerForm({ ...bannerForm, height: e.target.value as any })}
                className="w-full p-3 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs font-bold text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
              >
                <option value="small">Vừa phải (Chiều cao ~450px)</option>
                <option value="medium">Tiêu chuẩn (Chiều cao ~550px - Khuyến nghị)</option>
                <option value="large">Rộng lớn (Chiều cao ~650px)</option>
                <option value="full">Toàn màn hình (Full HD 100vh)</option>
              </select>
            </div>

            {/* Slider Specific Settings: AutoPlay & Interval Speed */}
            {mode === 'slider' ? (
              <div className="p-3.5 bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tự động chuyển Slide</label>
                  <label className="flex items-center space-x-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={bannerForm.autoPlay !== false}
                      onChange={(e) => setBannerForm({ ...bannerForm, autoPlay: e.target.checked })}
                      className="w-4 h-4 accent-[#8C2320]"
                    />
                    <span className="text-xs font-semibold text-[#2D241E]">Tự động cuộn (Auto-play)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B32] mb-1">Thời gian chuyển Slide</label>
                  <select
                    value={bannerForm.intervalSpeed || 5}
                    onChange={(e) => setBannerForm({ ...bannerForm, intervalSpeed: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                  >
                    <option value={3}>3 giây / Slide</option>
                    <option value={5}>5 giây / Slide (Chuẩn)</option>
                    <option value={7}>7 giây / Slide</option>
                    <option value={10}>10 giây / Slide</option>
                  </select>
                </div>
              </div>
            ) : null}

            {/* Animation & Effect Settings Row */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Hiệu ứng Chuyển ảnh Slide (Slide Transition)</label>
                <select
                  value={bannerForm.slideEffect || 'fade'}
                  onChange={(e) => setBannerForm({ ...bannerForm, slideEffect: e.target.value as any })}
                  className="w-full p-2 bg-white border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                >
                  <option value="fade">Mờ dần ➔ Hiện dần (Cross Fade - Mượt mà)</option>
                  <option value="slide-left">Trượt ngang sang Trái (Slide Left)</option>
                  <option value="slide-right">Trượt ngang sang Phải (Slide Right)</option>
                  <option value="zoom">Phóng to nhẹ (Zoom In Fade)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Hiệu ứng Xuất hiện Chữ (Text Animation)</label>
                <select
                  value={bannerForm.textAnimation || 'slideUp'}
                  onChange={(e) => setBannerForm({ ...bannerForm, textAnimation: e.target.value as any })}
                  className="w-full p-2 bg-white border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                >
                  <option value="slideUp">Trượt từ dưới lên (Slide Up - Ấn tượng)</option>
                  <option value="fadeIn">Hiện dần nhẹ nhàng (Fade In)</option>
                  <option value="slideDown">Trượt từ trên xuống (Slide Down)</option>
                  <option value="zoomIn">Phóng to xuất hiện (Zoom In / Pop)</option>
                  <option value="bounce">Nảy nhẹ sống động (Bounce In)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Content Configuration (Static vs Slider Table) */}
        {mode === 'static' ? (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-5 animate-fadeIn">
            <div className="border-b border-[#F0EBE1] pb-3">
              <h3 className="font-serif-culture text-xl font-bold text-[#8C2320]">
                2. Nội dung Banner Tĩnh
              </h3>
              <p className="text-xs text-[#7A6B60] mt-0.5">Tùy chỉnh hình ảnh, chữ đè lên ảnh và vị trí căn chỉnh</p>
            </div>

            {/* Text Alignment Choice */}
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-2">Vị trí căn chỉnh chữ trên Banner</label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setBannerForm({ ...bannerForm, textAlign: 'left' })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border cursor-pointer transition-all ${
                    (bannerForm.textAlign || 'left') === 'left'
                      ? 'bg-[#8C2320] text-white border-[#8C2320]'
                      : 'bg-[#FAF8F5] text-[#5C4D44] border-[#D9CEBA]'
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                  <span>Căn trái (Left)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBannerForm({ ...bannerForm, textAlign: 'center' })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border cursor-pointer transition-all ${
                    bannerForm.textAlign === 'center'
                      ? 'bg-[#8C2320] text-white border-[#8C2320]'
                      : 'bg-[#FAF8F5] text-[#5C4D44] border-[#D9CEBA]'
                  }`}
                >
                  <AlignCenter className="w-4 h-4" />
                  <span>Căn giữa (Center)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBannerForm({ ...bannerForm, textAlign: 'right' })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border cursor-pointer transition-all ${
                    bannerForm.textAlign === 'right'
                      ? 'bg-[#8C2320] text-white border-[#8C2320]'
                      : 'bg-[#FAF8F5] text-[#5C4D44] border-[#D9CEBA]'
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                  <span>Căn phải (Right)</span>
                </button>
              </div>
            </div>

            {/* Image Uploader */}
            <ImageUploader
              label="Ảnh nền Banner Hero chính *"
              value={bannerForm.imageUrl || ''}
              onChange={(url) => setBannerForm({ ...bannerForm, imageUrl: url })}
              aspectRatio="wide"
            />

            {/* Text Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Thẻ nhãn nhỏ trên cùng (Tagline Badge)</label>
                <input
                  type="text"
                  value={bannerForm.tagline || ''}
                  onChange={(e) => setBannerForm({ ...bannerForm, tagline: e.target.value })}
                  placeholder="VD: Không gian văn hóa Dân ca Quan họ Bắc Ninh"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs font-semibold text-[#2D241E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Cỡ chữ Thẻ nhãn</label>
                <select
                  value={bannerForm.taglineFontSize || 'base'}
                  onChange={(e) => setBannerForm({ ...bannerForm, taglineFontSize: e.target.value as any })}
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

            {/* Headline & Subtitle with Font Sizes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tiêu đề chính (Headline)</label>
                <input
                  type="text"
                  value={bannerForm.headline}
                  onChange={(e) => setBannerForm({ ...bannerForm, headline: e.target.value })}
                  placeholder="MẠCH QUAN HỌ"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs font-bold text-[#2D241E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Cỡ chữ Tiêu đề chính</label>
                <select
                  value={bannerForm.headlineFontSize || '6xl'}
                  onChange={(e) => setBannerForm({ ...bannerForm, headlineFontSize: e.target.value as any })}
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tiêu đề phụ (Subtitle)</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="Giữ mạch di sản – Khơi mạch tương lai"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Cỡ chữ Tiêu đề phụ</label>
                <select
                  value={bannerForm.subtitleFontSize || '2xl'}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitleFontSize: e.target.value as any })}
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Đoạn văn giới thiệu ngắn</label>
                <textarea
                  rows={2}
                  value={bannerForm.introText}
                  onChange={(e) => setBannerForm({ ...bannerForm, introText: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1">Cỡ chữ Đoạn văn</label>
                <select
                  value={bannerForm.introFontSize || 'base'}
                  onChange={(e) => setBannerForm({ ...bannerForm, introFontSize: e.target.value as any })}
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

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Câu ca dao / Trích dẫn nổi bật</label>
              <input
                type="text"
                value={bannerForm.quote}
                onChange={(e) => setBannerForm({ ...bannerForm, quote: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] italic"
              />
            </div>

            {/* Dynamic Buttons List Editor for Static Banner */}
            <BannerButtonsEditor
              buttons={bannerForm.buttons || [
                { id: 'b1', text: bannerForm.buttonText || 'Khám phá ngay', icon: 'ChevronRight', link: 'news', bgColor: '#8C2320', textColor: '#FFFFFF' }
              ]}
              onChange={(updatedBtns) => setBannerForm({ ...bannerForm, buttons: updatedBtns })}
            />
          </div>
        ) : (
          /* SLIDER MODE: Table View of Slide Records */
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE1] gap-3">
              <div>
                <h3 className="font-serif-culture text-xl font-bold text-[#8C2320]">
                  2. Danh sách các Bản ghi Slide Banner ({slides.length})
                </h3>
                <p className="text-xs text-[#7A6B60] mt-0.5">Quản lý theo bản ghi dạng danh sách, tùy chỉnh vị trí chữ, cỡ chữ và các nút bấm qua Modal</p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddSlideModal}
                className="px-5 py-2.5 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-full shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Slide mới</span>
              </button>
            </div>

            {/* Table View of Slides */}
            <div className="overflow-x-auto rounded-2xl border border-[#E8DFC8]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF8F5] text-[11px] font-bold text-[#4A3B32] uppercase tracking-wider border-b border-[#E8DFC8]">
                    <th className="py-3.5 px-4 w-16 text-center">STT</th>
                    <th className="py-3.5 px-4 w-28">Xem trước ảnh</th>
                    <th className="py-3.5 px-4">Tiêu đề chính & Nội dung Slide</th>
                    <th className="py-3.5 px-4 text-center w-28">Căn chỉnh</th>
                    <th className="py-3.5 px-4 text-center w-28">Thứ tự</th>
                    <th className="py-3.5 px-4 text-right w-28">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DFC8] text-xs">
                  {slides.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#7A6B60] italic">
                        Chưa có slide nào. Bấm "Thêm Slide mới" để tạo slide đầu tiên.
                      </td>
                    </tr>
                  ) : (
                    slides.map((slide, idx) => (
                      <tr key={slide.id} className="hover:bg-[#FAF8F5]/80 transition-colors group">
                        {/* STT */}
                        <td className="py-3.5 px-4 text-center font-bold text-[#8C2320]">
                          <span className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#D9CEBA] inline-flex items-center justify-center text-xs">
                            #{idx + 1}
                          </span>
                        </td>

                        {/* Image Thumbnail */}
                        <td className="py-3.5 px-4">
                          <img
                            src={slide.imageUrl || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=300&q=80'}
                            alt={slide.headline || 'Slide'}
                            className="w-20 h-12 object-cover rounded-xl border border-[#D9CEBA] shadow-xs"
                          />
                        </td>

                        {/* Slide Title & Info */}
                        <td className="py-3.5 px-4 space-y-1">
                          <p className="font-bold text-[#2D241E] text-xs line-clamp-1">
                            {slide.headline || 'Chưa đặt tiêu đề'}
                          </p>
                          <p className="text-[11px] text-[#7A6B60] line-clamp-1">
                            {slide.subtitle || slide.introText || 'Không có mô tả'}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {slide.showButton !== false && (
                              <span className="px-2 py-0.5 bg-[#8C2320]/10 text-[#8C2320] text-[10px] font-bold rounded-md border border-[#8C2320]/20">
                                Nút 1: {slide.buttonText || 'Khám phá'} ({slide.buttonIcon || 'Icon'})
                              </span>
                            )}
                            {slide.showButton2 === true && (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-200">
                                Nút 2: {slide.button2Text || 'Nghe nhạc'} ({slide.button2Icon || 'Music'})
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Text Align Badge */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#E8DFC8] text-[#5C4D44] text-[11px] font-semibold rounded-lg">
                            {getAlignLabel(slide.textAlign)}
                          </span>
                        </td>

                        {/* Move Up/Down */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleMoveSlideUp(idx)}
                              disabled={idx === 0}
                              className="p-1 rounded-md text-[#7A6B60] hover:text-[#8C2320] hover:bg-[#FAF8F5] disabled:opacity-30 cursor-pointer"
                              title="Lên trên"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveSlideDown(idx)}
                              disabled={idx === slides.length - 1}
                              className="p-1 rounded-md text-[#7A6B60] hover:text-[#8C2320] hover:bg-[#FAF8F5] disabled:opacity-30 cursor-pointer"
                              title="Xuống dưới"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditSlideModal(slide)}
                            className="p-1.5 text-[#5C4D44] hover:text-[#8C2320] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
                            title="Sửa Slide này"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa Slide"
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
        )}

        {/* CARD 3: Brand & Contact Info */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-4">
          <h3 className="font-serif-culture text-lg font-bold text-[#8C2320] pb-2 border-b border-[#F0EBE1]">
            3. Thông tin Liên hệ & Địa chỉ Hệ thống
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Email liên hệ hệ thống</label>
              <input
                type="email"
                value={siteInfoForm.contactEmail}
                onChange={(e) => setSiteInfoForm({ ...siteInfoForm, contactEmail: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Số điện thoại hotline</label>
              <input
                type="text"
                value={siteInfoForm.contactPhone}
                onChange={(e) => setSiteInfoForm({ ...siteInfoForm, contactPhone: e.target.value })}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Địa chỉ trụ sở</label>
            <input
              type="text"
              value={siteInfoForm.address}
              onChange={(e) => setSiteInfoForm({ ...siteInfoForm, address: e.target.value })}
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E]"
            />
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end pt-2">
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
                <span>Lưu thay đổi Banner & Cấu hình</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Banner Slide Modal */}
      <BannerSlideModal
        isOpen={isSlideModalOpen}
        editingSlide={editingSlide}
        onClose={() => setIsSlideModalOpen(false)}
        onSave={handleSaveSlideModal}
      />
    </div>
  );
};
