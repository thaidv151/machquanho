import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { SiteConfig, SiteHeaderConfig } from '../../../types';
import { ImageUploader } from '../../../components/ImageUploader';

interface AdminHeaderTabProps {
  siteConfig: SiteConfig;
  isSubmitting: boolean;
  onSaveHeaderConfig: (
    updatedHeaderNotice: { topNoticeText: string; topSubText: string; topAudioCtaText: string },
    logoSettings: { logoType: 'text' | 'image'; logoText: string; logoSubtext: string; logoImageUrl?: string }
  ) => void;
}

export const AdminHeaderTab: React.FC<AdminHeaderTabProps> = ({
  siteConfig,
  isSubmitting,
  onSaveHeaderConfig,
}) => {
  const [noticeForm, setNoticeForm] = useState({
    topNoticeText: siteConfig.header?.topNoticeText || 'Di sản Văn hóa Phi vật thể đại diện của Nhân loại - UNESCO 2009',
    topSubText: siteConfig.header?.topSubText || 'Kinh Bắc - Vùng đất địa linh nhân kiệt',
    topAudioCtaText: siteConfig.header?.topAudioCtaText || 'Nghe Quan họ',
  });

  const [logoForm, setLogoForm] = useState({
    logoType: siteConfig.logoType || 'text',
    logoText: siteConfig.logoText || 'MẠCH QUAN HỌ',
    logoSubtext: siteConfig.logoSubtext || 'Kinh Bắc Di Sản',
    logoImageUrl: siteConfig.logoImageUrl || ''
  });

  useEffect(() => {
    if (siteConfig.header) {
      setNoticeForm({
        topNoticeText: siteConfig.header.topNoticeText || 'Di sản Văn hóa Phi vật thể đại diện của Nhân loại - UNESCO 2009',
        topSubText: siteConfig.header.topSubText || 'Kinh Bắc - Vùng đất địa linh nhân kiệt',
        topAudioCtaText: siteConfig.header.topAudioCtaText || 'Nghe Quan họ',
      });
    }
    setLogoForm({
      logoType: siteConfig.logoType || 'text',
      logoText: siteConfig.logoText || 'MẠCH QUAN HỌ',
      logoSubtext: siteConfig.logoSubtext || 'Kinh Bắc Di Sản',
      logoImageUrl: siteConfig.logoImageUrl || ''
    });
  }, [siteConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveHeaderConfig(noticeForm, logoForm);
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      {/* Top Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-culture text-2xl sm:text-3xl font-bold text-[#2D241E]">
            Cấu hình Header & Logo Thương hiệu
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6B60] mt-1">
            Tùy chỉnh dải thông báo di sản trên cùng và kiểu hiển thị Logo thương hiệu website
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
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
              <span>Lưu thay đổi Header</span>
            </>
          )}
        </button>
      </div>

      {/* Main Unified Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Notice Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-5">
          <div className="border-b border-[#F0EBE1] pb-3">
            <h3 className="font-serif-culture text-xl font-bold text-[#8C2320]">
              1. Thanh Thông báo trên cùng (Top Accent Bar)
            </h3>
            <p className="text-xs text-[#7A6B60] mt-0.5">
              Hiển thị dải băng di sản trên cùng của toàn bộ website
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">
                Thông báo Di sản UNESCO (Thanh góc trái) *
              </label>
              <input
                type="text"
                required
                value={noticeForm.topNoticeText}
                onChange={(e) => setNoticeForm({ ...noticeForm, topNoticeText: e.target.value })}
                placeholder="VD: Di sản Văn hóa Phi vật thể đại diện của Nhân loại - UNESCO 2009"
                className="w-full p-3 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] font-medium focus:ring-2 focus:ring-[#8C2320]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">
                  Câu khẩu hiệu vùng đất (Thanh góc phải)
                </label>
                <input
                  type="text"
                  value={noticeForm.topSubText}
                  onChange={(e) => setNoticeForm({ ...noticeForm, topSubText: e.target.value })}
                  placeholder="VD: Kinh Bắc - Vùng đất địa linh nhân kiệt"
                  className="w-full p-3 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">
                  Nút CTA Phát âm thanh Quan họ
                </label>
                <input
                  type="text"
                  value={noticeForm.topAudioCtaText}
                  onChange={(e) => setNoticeForm({ ...noticeForm, topAudioCtaText: e.target.value })}
                  placeholder="VD: Nghe Quan họ"
                  className="w-full p-3 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Logo & Brand */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-5">
          <div className="border-b border-[#F0EBE1] pb-3">
            <h3 className="font-serif-culture text-xl font-bold text-[#8C2320]">
              2. Logo & Thương hiệu Hệ thống
            </h3>
            <p className="text-xs text-[#7A6B60] mt-0.5">
              Tùy chỉnh kiểu hiển thị Logo chữ hoặc Ảnh Logo riêng trên Header
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-2">Loại Logo hiển thị</label>
              <div className="flex items-center space-x-6 bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DFC8]">
                <label className="flex items-center space-x-2 text-xs font-bold text-[#2D241E] cursor-pointer">
                  <input
                    type="radio"
                    name="logoType"
                    value="text"
                    checked={logoForm.logoType === 'text'}
                    onChange={() => setLogoForm({ ...logoForm, logoType: 'text' })}
                    className="w-4 h-4 accent-[#8C2320]"
                  />
                  <span>Chữ thương hiệu (Typography Logo)</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-bold text-[#2D241E] cursor-pointer">
                  <input
                    type="radio"
                    name="logoType"
                    value="image"
                    checked={logoForm.logoType === 'image'}
                    onChange={() => setLogoForm({ ...logoForm, logoType: 'image' })}
                    className="w-4 h-4 accent-[#8C2320]"
                  />
                  <span>Ảnh Logo tùy chỉnh (Image Logo URL)</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">Tên hệ thống chính *</label>
                <input
                  type="text"
                  required
                  value={logoForm.logoText}
                  onChange={(e) => setLogoForm({ ...logoForm, logoText: e.target.value })}
                  placeholder="MẠCH QUAN HỌ"
                  className="w-full p-3 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs font-bold text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A3B32] mb-1.5">Mô tả ngắn thương hiệu *</label>
                <input
                  type="text"
                  required
                  value={logoForm.logoSubtext}
                  onChange={(e) => setLogoForm({ ...logoForm, logoSubtext: e.target.value })}
                  placeholder="Kinh Bắc Di Sản"
                  className="w-full p-3 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
                />
              </div>
            </div>

            {logoForm.logoType === 'image' && (
              <ImageUploader
                label="Tải tệp / Nhập URL Ảnh Logo thương hiệu"
                value={logoForm.logoImageUrl || ''}
                onChange={(url) => setLogoForm({ ...logoForm, logoImageUrl: url })}
                aspectRatio="auto"
              />
            )}
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
                <span>Lưu thay đổi Header & Logo</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
