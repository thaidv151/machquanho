import React, { useState } from 'react';
import { SiteConfig, SiteSeoConfig } from '../../../types';
import { DEFAULT_SITE_CONFIG } from '../../../data/mockData';
import { Save, Code, Terminal, CheckCircle2, Info, Loader2, Key } from 'lucide-react';

interface AdminScriptsTabProps {
  siteConfig: SiteConfig;
  isSubmitting: boolean;
  onSaveSeoConfig: (newSeoConfig: SiteSeoConfig) => Promise<void>;
}

export const AdminScriptsTab: React.FC<AdminScriptsTabProps> = ({
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

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="pb-4 border-b border-[#E8DFC8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-culture text-xl font-bold text-[#2D241E] flex items-center space-x-2">
            <Code className="w-5 h-5 text-[#114D3A]" />
            <span>Script / Widget & Hỗ trợ Google Search Console</span>
          </h2>
          <p className="text-xs text-[#7A6B60] mt-1">
            Chèn mã Google Search Console Meta, Google Analytics, Tag Manager, Facebook Pixel hoặc Widget Chat vào website.
          </p>
        </div>

        <button
          type="submit"
          form="admin-scripts-form"
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
              <span>Lưu Script / Widget</span>
            </>
          )}
        </button>
      </div>

      <form id="admin-scripts-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8-Col Area: Scripts Textareas */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Block 1: Google Search Console Verification Meta Tag */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-[#E8DFC8] pb-3 text-[#114D3A]">
              <Key className="w-5 h-5" />
              <div>
                <h3 className="font-serif-culture text-base font-bold text-[#2D241E]">
                  Mã xác minh Google Search Console
                </h3>
                <p className="text-[11px] text-[#7A6B60]">
                  Nhập mã token hoặc toàn bộ thẻ meta `google-site-verification` để Google nhận diện sitemap website
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">
                Google Search Console Verification Token / Tag
              </label>
              <input
                type="text"
                value={formData.googleSiteVerification || ''}
                onChange={(e) => setFormData({ ...formData, googleSiteVerification: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs font-mono bg-[#FAF8F5] focus:outline-none focus:border-[#114D3A]"
                placeholder='Ví dụ: google-site-verification=abc123xyz... hoặc <meta name="google-site-verification" content="..." />'
              />
            </div>
          </div>

          {/* Block 2: Script trong Head */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-[#E8DFC8] pb-3 text-[#114D3A]">
              <Terminal className="w-5 h-5" />
              <div>
                <h3 className="font-serif-culture text-base font-bold text-[#2D241E]">
                  Script chèn trong thẻ &lt;head&gt;
                </h3>
                <p className="text-[11px] text-[#7A6B60]">
                  Dán mã Google Analytics (gtag.js), Google Tag Manager, Facebook Pixel header code...
                </p>
              </div>
            </div>

            <div>
              <textarea
                rows={7}
                value={formData.headScript || ''}
                onChange={(e) => setFormData({ ...formData, headScript: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs font-mono bg-[#1E1E1E] text-[#D4D4D4] focus:outline-none focus:border-[#114D3A]"
                placeholder="<!-- Dán mã Google Analytics / GTM vào đây -->&#10;<script async src='https://www.googletagmanager.com/gtag/js?id=G-XXXXX'></script>"
              />
            </div>
          </div>

          {/* Block 3: Script trước Body đóng */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] space-y-3 shadow-xs">
            <div className="flex items-center space-x-2 border-b border-[#E8DFC8] pb-3 text-[#114D3A]">
              <Code className="w-5 h-5" />
              <div>
                <h3 className="font-serif-culture text-base font-bold text-[#2D241E]">
                  Script chèn trước thẻ &lt;/body&gt; đóng
                </h3>
                <p className="text-[11px] text-[#7A6B60]">
                  Dán widget chat (Zalo Widget, Facebook Chat, Tawk.to) hoặc script theo dõi conversion cuối trang
                </p>
              </div>
            </div>

            <div>
              <textarea
                rows={6}
                value={formData.bodyScript || ''}
                onChange={(e) => setFormData({ ...formData, bodyScript: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs font-mono bg-[#1E1E1E] text-[#D4D4D4] focus:outline-none focus:border-[#114D3A]"
                placeholder="<!-- Dán widget chat hoặc script hỗ trợ cuối trang -->&#10;<script>/* Chat Widget Script */</script>"
              />
            </div>
          </div>

        </div>

        {/* Right 4-Col Area: Save Action & Hints */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8DFC8] space-y-3">
            <h4 className="font-serif-culture text-xs font-bold text-[#114D3A] uppercase tracking-wide flex items-center space-x-1.5 border-b border-[#E8DFC8] pb-2">
              <Info className="w-4 h-4 text-[#D4A25A]" />
              <span>Gợi ý chèn Script & Google Search Console</span>
            </h4>
            <ul className="text-xs text-[#6B5A4E] space-y-2 leading-relaxed">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#114D3A] shrink-0 mt-0.5" />
                <span>
                  <strong>Google Search Console:</strong> Nhập mã xác minh HTML Tag để Google cập nhật sitemap và lập chỉ mục nhanh chóng.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#114D3A] shrink-0 mt-0.5" />
                <span>
                  <strong>Google Analytics / GTM:</strong> Nên đặt ở khung <em>Script trong Head</em> để theo dõi chính xác toàn bộ lượt truy cập.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#114D3A] shrink-0 mt-0.5" />
                <span>
                  <strong>Widget Chat / Live Support:</strong> Đặt ở khung <em>Script trước thẻ Body đóng</em> để tránh làm chậm tốc độ tải trang ban đầu.
                </span>
              </li>
            </ul>
          </div>

        </div>

      </form>
    </div>
  );
};
