import React, { useState } from 'react';
import { SiteConfig, SiteSeoConfig } from '../../../types';
import { DEFAULT_SITE_CONFIG } from '../../../data/mockData';
import { ImageUploader } from '../../../components/ImageUploader';
import { Save, Search, Home, Globe, Lightbulb, ExternalLink, Loader2 } from 'lucide-react';

interface AdminSeoTabProps {
  siteConfig: SiteConfig;
  isSubmitting: boolean;
  onSaveSeoConfig: (newSeoConfig: SiteSeoConfig) => Promise<void>;
}

export const AdminSeoTab: React.FC<AdminSeoTabProps> = ({
  siteConfig,
  isSubmitting,
  onSaveSeoConfig,
}) => {
  const initialSeo: SiteSeoConfig = siteConfig.seo || DEFAULT_SITE_CONFIG.seo!;
  const [formData, setFormData] = useState<SiteSeoConfig>({ ...initialSeo });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSeoConfig(formData);
  };

  const titleLength = (formData.homeMetaTitle || '').length;
  const descLength = (formData.homeMetaDescription || '').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="pb-4 border-b border-[#E8DFC8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-culture text-xl font-bold text-[#2D241E] flex items-center space-x-2">
            <Search className="w-5 h-5 text-[#114D3A]" />
            <span>Cài đặt SEO Toàn Site</span>
          </h2>
          <p className="text-xs text-[#7A6B60] mt-1">
            Tối ưu hóa công cụ tìm kiếm (Search Engine Optimization) cho Trang chủ và toàn bộ website Mạch Quan Họ.
          </p>
        </div>

        <button
          type="submit"
          form="admin-seo-form"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-[#114D3A] text-white text-xs font-bold hover:bg-[#0D3B2C] transition-colors cursor-pointer flex items-center space-x-2 shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Lưu cài đặt SEO</span>
            </>
          )}
        </button>
      </div>

      <form id="admin-seo-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8-Col Area: Homepage & Global Defaults Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Trang Chủ SEO */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-[#E8DFC8] pb-3 text-[#8C2F2F]">
              <Home className="w-5 h-5" />
              <h3 className="font-serif-culture text-base font-bold text-[#2D241E]">
                Cấu hình SEO cho Trang Chủ
              </h3>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#4A3B32]">Meta Title (Tiêu đề trang chủ)</label>
                <span className={`text-[11px] ${titleLength > 70 ? 'text-[#8C2F2F] font-bold' : 'text-[#7A6B60]'}`}>
                  {titleLength}/70 ký tự (Khuyến nghị 50-60)
                </span>
              </div>
              <input
                type="text"
                value={formData.homeMetaTitle || ''}
                onChange={(e) => setFormData({ ...formData, homeMetaTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="Nhập Meta Title trang chủ..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#4A3B32]">Meta Description (Mô tả tìm kiếm)</label>
                <span className={`text-[11px] ${descLength > 160 ? 'text-[#8C2F2F] font-bold' : 'text-[#7A6B60]'}`}>
                  {descLength}/160 ký tự (Khuyến nghị 120-160)
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.homeMetaDescription || ''}
                onChange={(e) => setFormData({ ...formData, homeMetaDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="Nhập tóm tắt mô tả thu hút người dùng khi xem trên Google..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">
                Meta Keywords (Từ khóa tìm kiếm, phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={formData.homeMetaKeywords || ''}
                onChange={(e) => setFormData({ ...formData, homeMetaKeywords: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="quan họ bắc ninh, dân ca quan họ, làng quan họ, mạch quan họ..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">
                OG Image (URL ảnh đại diện khi chia sẻ lên Facebook / Zalo)
              </label>
              <ImageUploader
                value={formData.homeOgImage || ''}
                onChange={(url) => setFormData({ ...formData, homeOgImage: url })}
                placeholder="Tải lên hoặc dán link ảnh bìa chia sẻ Facebook (Khuyên dùng 1200x630px)..."
              />
            </div>
          </div>

          {/* Section 2: Mặc Định Toàn Site */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-[#E8DFC8] pb-3 text-[#114D3A]">
              <Globe className="w-5 h-5" />
              <div>
                <h3 className="font-serif-culture text-base font-bold text-[#2D241E]">
                  Mặc Định Toàn Site (Default Fallback SEO)
                </h3>
                <p className="text-[11px] text-[#7A6B60]">Áp dụng tự động cho các trang không cấu hình SEO riêng</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Default Meta Title</label>
              <input
                type="text"
                value={formData.defaultMetaTitle || ''}
                onChange={(e) => setFormData({ ...formData, defaultMetaTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="MẠCH QUAN HỌ - Di Sản Văn Hóa Dân Ca Quan Họ..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Default Meta Description</label>
              <textarea
                rows={2}
                value={formData.defaultMetaDescription || ''}
                onChange={(e) => setFormData({ ...formData, defaultMetaDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="Mô tả mặc định toàn site..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Default Meta Keywords</label>
              <input
                type="text"
                value={formData.defaultMetaKeywords || ''}
                onChange={(e) => setFormData({ ...formData, defaultMetaKeywords: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="quan họ, bắc ninh, di sản văn hóa..."
              />
            </div>
          </div>

        </div>

        {/* Right 4-Col Area: Google Search Preview & SEO Tips */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Live Google Search Preview Box */}
          <div className="bg-white rounded-2xl p-5 border border-[#E8DFC8] space-y-3 shadow-xs">
            <h3 className="font-serif-culture text-xs font-bold text-[#7A6B60] uppercase tracking-wider flex items-center space-x-1.5 border-b border-[#E8DFC8] pb-2">
              <Search className="w-3.5 h-3.5 text-[#114D3A]" />
              <span>XEM TRƯỚC GOOGLE — TRANG CHỦ</span>
            </h3>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8] space-y-1 font-sans">
              <p className="text-xs text-[#202124] truncate flex items-center space-x-1">
                <span>https://machquanho.vn</span>
                <span className="text-gray-400">› home</span>
              </p>
              <h4 className="text-sm font-medium text-[#1a0dab] hover:underline cursor-pointer line-clamp-2 leading-snug">
                {formData.homeMetaTitle || 'MẠCH QUAN HỌ - Di Sản Văn Hóa Kinh Bắc'}
              </h4>
              <p className="text-[11.5px] text-[#4d5156] line-clamp-3 leading-relaxed">
                {formData.homeMetaDescription || 'Dự án nghiên cứu, lưu trữ và bảo tồn Dân ca Quan họ Bắc Ninh...'}
              </p>
            </div>
          </div>

          {/* SEO Tips Box */}
          <div className="bg-[#FFF8F0] rounded-2xl p-5 border border-[#F5E2CE] space-y-2.5">
            <h4 className="font-serif-culture text-xs font-bold text-[#8C2F2F] flex items-center space-x-1.5 uppercase tracking-wide">
              <Lightbulb className="w-4 h-4 text-[#D4A25A]" />
              <span>Mẹo tối ưu SEO chuẩn Google</span>
            </h4>
            <ul className="text-xs text-[#6B5A4E] space-y-1.5 leading-relaxed list-disc list-inside">
              <li><strong>Meta Title:</strong> Độ dài lý tưởng từ 50–60 ký tự.</li>
              <li><strong>Meta Description:</strong> Độ dài lý tưởng từ 120–160 ký tự.</li>
              <li><strong>Keyword chính:</strong> Nên đặt ở phần đầu của Meta Title.</li>
              <li><strong>OG Image:</strong> Kích thước chuẩn 1200x630px cho Facebook/Zalo.</li>
              <li><strong>Search Console:</strong> Hãy khai báo file sitemap trên Google Search Console.</li>
            </ul>
          </div>

        </div>

      </form>
    </div>
  );
};
