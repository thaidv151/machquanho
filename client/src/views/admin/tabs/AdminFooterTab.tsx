import React, { useState } from 'react';
import { SiteConfig, SiteFooterConfig, FooterLinkItem, SocialPlatformItem } from '../../../types';
import { DEFAULT_SITE_CONFIG } from '../../../data/mockData';
import { ImageUploader } from '../../../components/ImageUploader';
import { SocialPlatformIcon } from '../../../components/SocialPlatformIcon';
import { Save, Plus, Trash2, Loader2, Globe, Link as LinkIcon, Info, Share2 } from 'lucide-react';

interface AdminFooterTabProps {
  siteConfig: SiteConfig;
  isSubmitting: boolean;
  onSaveFooterConfig: (newFooterConfig: SiteFooterConfig) => Promise<void>;
}

export const AdminFooterTab: React.FC<AdminFooterTabProps> = ({
  siteConfig,
  isSubmitting,
  onSaveFooterConfig,
}) => {
  const initialFooter: SiteFooterConfig = siteConfig.footer || DEFAULT_SITE_CONFIG.footer!;
  const [formData, setFormData] = useState<SiteFooterConfig>({
    ...initialFooter,
    socialPlatforms: initialFooter.socialPlatforms || [
      { id: 'sp-1', name: 'Facebook', url: siteConfig.socialLinks?.facebook || 'https://facebook.com', iconType: 'facebook' },
      { id: 'sp-2', name: 'YouTube', url: siteConfig.socialLinks?.youtube || 'https://youtube.com', iconType: 'youtube' },
      { id: 'sp-3', name: 'TikTok', url: siteConfig.socialLinks?.tiktok || 'https://tiktok.com', iconType: 'tiktok' },
      { id: 'sp-4', name: 'Email', url: `mailto:${initialFooter.email || 'machquanho@gmail.com'}`, iconType: 'email' },
    ],
  });

  // Quick Links Helpers
  const handleAddQuickLink = () => {
    const newLink: FooterLinkItem = {
      id: `fl-${Date.now()}`,
      label: 'Liên kết mới',
      url: '/',
    };
    setFormData((prev) => ({
      ...prev,
      quickLinks: [...(prev.quickLinks || []), newLink],
    }));
  };

  const handleUpdateQuickLink = (id: string, field: 'label' | 'url', val: string) => {
    setFormData((prev) => ({
      ...prev,
      quickLinks: (prev.quickLinks || []).map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      ),
    }));
  };

  const handleRemoveQuickLink = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      quickLinks: (prev.quickLinks || []).filter((item) => item.id !== id),
    }));
  };

  // Social Platforms Helpers
  const handleAddSocialPlatform = () => {
    const newPlatform: SocialPlatformItem = {
      id: `sp-${Date.now()}`,
      name: 'Nền tảng mới',
      url: 'https://',
      iconType: 'custom',
    };
    setFormData((prev) => ({
      ...prev,
      socialPlatforms: [...(prev.socialPlatforms || []), newPlatform],
    }));
  };

  const handleUpdateSocialPlatform = (id: string, field: keyof SocialPlatformItem, val: any) => {
    setFormData((prev) => ({
      ...prev,
      socialPlatforms: (prev.socialPlatforms || []).map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      ),
    }));
  };

  const handleRemoveSocialPlatform = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      socialPlatforms: (prev.socialPlatforms || []).filter((item) => item.id !== id),
    }));
  };

  // Bottom Links Helpers
  const handleAddBottomLink = () => {
    const newLink: FooterLinkItem = {
      id: `bl-${Date.now()}`,
      label: 'Điều khoản mới',
      url: '#',
    };
    setFormData((prev) => ({
      ...prev,
      bottomLinks: [...(prev.bottomLinks || []), newLink],
    }));
  };

  const handleUpdateBottomLink = (id: string, field: 'label' | 'url', val: string) => {
    setFormData((prev) => ({
      ...prev,
      bottomLinks: (prev.bottomLinks || []).map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      ),
    }));
  };

  const handleRemoveBottomLink = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      bottomLinks: (prev.bottomLinks || []).filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveFooterConfig(formData);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="pb-4 border-b border-[#E8DFC8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-culture text-xl font-bold text-[#2D241E] flex items-center space-x-2">
            <Globe className="w-5 h-5 text-[#114D3A]" />
            <span>Quản lý Nội dung & Cấu hình Chân trang (Footer)</span>
          </h2>
          <p className="text-xs text-[#7A6B60] mt-1">
            Tùy chỉnh các cột liên kết, nền tảng mạng xã hội (có thể upload Icon tùy biến), thông tin liên hệ và link bản quyền.
          </p>
        </div>

        <button
          type="submit"
          form="admin-footer-form"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-[#114D3A] text-white text-xs font-bold hover:bg-[#0D3B2C] transition-colors cursor-pointer flex items-center space-x-2 shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Lưu cấu hình Chân trang</span>
            </>
          )}
        </button>
      </div>

      <form id="admin-footer-form" onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Brand Paragraph & Tagline (Cột 1) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] space-y-4 shadow-xs">
          <h3 className="font-serif-culture text-base font-bold text-[#114D3A] border-b border-[#E8DFC8] pb-2 flex items-center space-x-2">
            <Info className="w-4 h-4" />
            <span>Cột 1: Thông tin Cột Thương hiệu & Giới thiệu</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Khẩu hiệu / Tagline Chân trang</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="Giữ mạch di sản – Khơi mạch tương lai"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Dòng Bản quyền Copyright</label>
              <input
                type="text"
                value={formData.copyrightText || ''}
                onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="© 2026 Mạch Quan Họ. All rights reserved."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Mô tả chi tiết dưới thương hiệu</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
              placeholder="Nhập nội dung giới thiệu ngắn gọn..."
            />
          </div>
        </div>

        {/* Section 2: Quick Links List (Cột 2) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-2">
            <h3 className="font-serif-culture text-base font-bold text-[#114D3A] flex items-center space-x-2">
              <LinkIcon className="w-4 h-4" />
              <span>Cột 2: Cột Liên kết Nhanh (Nhập Link tùy chỉnh)</span>
            </h3>
            <button
              type="button"
              onClick={handleAddQuickLink}
              className="px-3 py-1.5 rounded-lg bg-[#114D3A]/10 text-[#114D3A] text-xs font-bold hover:bg-[#114D3A]/20 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm link</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tiêu đề Cột 2</label>
            <input
              type="text"
              value={formData.quickLinksTitle || 'LIÊN KẾT NHANH'}
              onChange={(e) => setFormData({ ...formData, quickLinksTitle: e.target.value })}
              className="w-full max-w-sm px-3.5 py-2 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
            />
          </div>

          <div className="space-y-2.5 pt-2">
            {(formData.quickLinks || []).map((link) => (
              <div key={link.id} className="flex flex-col sm:flex-row items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8]">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleUpdateQuickLink(link.id, 'label', e.target.value)}
                  placeholder="Tên nhãn (Ví dụ: Trang chủ)"
                  className="w-full sm:w-1/3 px-3 py-1.5 rounded-lg border border-[#E8DFC8] text-xs bg-white focus:outline-none focus:border-[#114D3A]"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleUpdateQuickLink(link.id, 'url', e.target.value)}
                  placeholder="Đường dẫn URL (Ví dụ: /news hoặc https://...)"
                  className="w-full sm:flex-1 px-3 py-1.5 rounded-lg border border-[#E8DFC8] text-xs bg-white focus:outline-none focus:border-[#114D3A]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveQuickLink(link.id)}
                  className="p-1.5 text-[#8C2F2F] hover:bg-[#8C2F2F]/10 rounded-lg transition-colors shrink-0"
                  title="Xóa link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Social Platforms with Custom Uploaded Icon Support (Cột 3) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-2">
            <h3 className="font-serif-culture text-base font-bold text-[#114D3A] flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Cột 3: Nền tảng KẾT NỐI VỚI CHÚNG TÔI (Cho phép Upload Icon tùy chỉnh)</span>
            </h3>
            <button
              type="button"
              onClick={handleAddSocialPlatform}
              className="px-3 py-1.5 rounded-lg bg-[#114D3A]/10 text-[#114D3A] text-xs font-bold hover:bg-[#114D3A]/20 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm nền tảng</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A3B32] mb-1">Tiêu đề Cột 3</label>
            <input
              type="text"
              value={formData.socialLinksTitle || 'KẾT NỐI VỚI CHÚNG TÔI'}
              onChange={(e) => setFormData({ ...formData, socialLinksTitle: e.target.value })}
              className="w-full max-w-sm px-3.5 py-2 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
            />
          </div>

          <div className="space-y-4 pt-2">
            {(formData.socialPlatforms || []).map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFC8] space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-1/4">
                    <label className="block text-[11px] font-bold text-[#7A6B60] mb-1">Tên nền tảng</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateSocialPlatform(item.id, 'name', e.target.value)}
                      placeholder="Ví dụ: Zalo, Spotify, Facebook..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E8DFC8] text-xs bg-white focus:outline-none focus:border-[#114D3A]"
                    />
                  </div>

                  <div className="w-full sm:flex-1">
                    <label className="block text-[11px] font-bold text-[#7A6B60] mb-1">Đường dẫn Link URL</label>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => handleUpdateSocialPlatform(item.id, 'url', e.target.value)}
                      placeholder="https://zalo.me/... hoặc https://facebook.com/..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[#E8DFC8] text-xs bg-white focus:outline-none focus:border-[#114D3A]"
                    />
                  </div>

                  <div className="w-full sm:w-1/3">
                    <label className="block text-[11px] font-bold text-[#7A6B60] mb-1">Icon hệ thống mặc định</label>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-[#092B20] text-white flex items-center justify-center border border-[#D4A25A]/40 shrink-0 shadow-xs">
                        <SocialPlatformIcon iconType={item.iconType} iconUrl={item.iconUrl} name={item.name} className="w-4 h-4" />
                      </div>
                      <select
                        value={item.iconType || 'custom'}
                        onChange={(e) => handleUpdateSocialPlatform(item.id, 'iconType', e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-[#E8DFC8] text-xs bg-white focus:outline-none focus:border-[#114D3A]"
                      >
                        <option value="facebook">Facebook Icon</option>
                        <option value="youtube">YouTube Icon</option>
                        <option value="tiktok">TikTok Icon (Chính thức)</option>
                        <option value="zalo">Zalo / Chat Icon</option>
                        <option value="instagram">Instagram Icon</option>
                        <option value="spotify">Spotify / Music Icon</option>
                        <option value="email">Email Icon</option>
                        <option value="globe">Website Icon</option>
                        <option value="phone">Hotline Icon</option>
                        <option value="custom">Upload Icon riêng (Tùy chỉnh)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSocialPlatform(item.id)}
                    className="p-2 text-[#8C2F2F] hover:bg-[#8C2F2F]/10 rounded-lg transition-colors shrink-0 self-end sm:self-center"
                    title="Xóa nền tảng"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Custom Icon Image Uploader */}
                <div className="pt-1 border-t border-[#E8DFC8]/60">
                  <label className="block text-[11px] font-bold text-[#4A3B32] mb-1">
                    Upload Icon tùy chỉnh cho nền tảng (Kéo thả hoặc chọn file từ máy tính)
                  </label>
                  <ImageUploader
                    value={item.iconUrl || ''}
                    onChange={(url) => handleUpdateSocialPlatform(item.id, 'iconUrl', url)}
                    placeholder="Tải lên biểu tượng logo của nền tảng (PNG, SVG, JPG)..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Contact Info (Cột 4) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] space-y-4 shadow-xs">
          <h3 className="font-serif-culture text-base font-bold text-[#114D3A] border-b border-[#E8DFC8] pb-2">
            Cột 4: Thông tin Liên hệ ở Chân trang
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Địa chỉ hiển thị</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="Bắc Ninh, Việt Nam"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Email liên hệ</label>
              <input
                type="text"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="machquanho@gmail.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A3B32] mb-1">Số điện thoại liên hệ</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#114D3A]"
                placeholder="0123 456 789"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Bottom Links */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8DFC8] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-2">
            <h3 className="font-serif-culture text-base font-bold text-[#114D3A] flex items-center space-x-2">
              <LinkIcon className="w-4 h-4" />
              <span>Các đường dẫn phụ bên phải dòng bản quyền dưới cùng</span>
            </h3>
            <button
              type="button"
              onClick={handleAddBottomLink}
              className="px-3 py-1.5 rounded-lg bg-[#114D3A]/10 text-[#114D3A] text-xs font-bold hover:bg-[#114D3A]/20 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm đường dẫn</span>
            </button>
          </div>

          <div className="space-y-2.5 pt-2">
            {(formData.bottomLinks || []).map((link) => (
              <div key={link.id} className="flex flex-col sm:flex-row items-center gap-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFC8]">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleUpdateBottomLink(link.id, 'label', e.target.value)}
                  placeholder="Tên nhãn (Ví dụ: Sitemap)"
                  className="w-full sm:w-1/3 px-3 py-1.5 rounded-lg border border-[#E8DFC8] text-xs bg-white focus:outline-none focus:border-[#114D3A]"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleUpdateBottomLink(link.id, 'url', e.target.value)}
                  placeholder="Đường dẫn URL (Ví dụ: /sitemap)"
                  className="w-full sm:flex-1 px-3 py-1.5 rounded-lg border border-[#E8DFC8] text-xs bg-white focus:outline-none focus:border-[#114D3A]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBottomLink(link.id)}
                  className="p-1.5 text-[#8C2F2F] hover:bg-[#8C2F2F]/10 rounded-lg transition-colors shrink-0"
                  title="Xóa link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </form>
    </div>
  );
};
