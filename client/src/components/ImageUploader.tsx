import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, X, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import { apiService } from '../services/apiService';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  aspectRatio?: 'cover' | 'square' | 'wide' | 'auto';
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  onChange,
  label = 'Hình ảnh',
  placeholder = 'Nhập URL hình ảnh hoặc tải ảnh lên...',
  className = '',
  aspectRatio = 'auto',
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp định dạng hình ảnh (.jpg, .png, .webp, .gif, .svg)');
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await apiService.uploadImage(file);
      onChange(uploadedUrl);
      setUrlInput(uploadedUrl);
    } catch (err) {
      console.error('File upload failed:', err);
      alert('Tải ảnh thất bại. Vui lòng thử lại!');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(urlInput.trim());
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#4A3B32]">{label}</label>
          <div className="flex items-center space-x-1.5 text-[10.5px]">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'upload' ? 'bg-[#8C2320] text-white' : 'bg-[#FAF8F5] text-[#7A6B60] hover:text-[#2D241E]'
              }`}
            >
              Tải từ máy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'url' ? 'bg-[#8C2320] text-white' : 'bg-[#FAF8F5] text-[#7A6B60] hover:text-[#2D241E]'
              }`}
            >
              Nhập Link URL
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Current Preview or Upload Zone */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-[#D9CEBA] bg-[#FAF8F5]">
          <div className={`w-full relative bg-[#1C1412] flex items-center justify-center ${
            aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'wide' ? 'aspect-video' : 'h-40'
          }`}>
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="px-3.5 py-1.5 bg-white text-[#2D241E] rounded-full text-xs font-bold shadow-md hover:bg-[#FAF8F5] transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#8C2320]" />
                <span>Thay ảnh khác</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={disabled}
                className="p-1.5 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                title="Xóa ảnh"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-2 bg-white text-[11px] font-mono text-[#8C6B50] truncate border-t border-[#E8DFC8] flex items-center justify-between">
            <span className="truncate max-w-[85%]">{value}</span>
            <span className="text-green-600 font-bold flex items-center space-x-1 shrink-0">
              <Check className="w-3 h-3" />
              <span>Đã chọn</span>
            </span>
          </div>
        </div>
      ) : activeTab === 'upload' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#8C2320] bg-[#8C2320]/10 scale-[0.99]'
              : 'border-[#D9CEBA] bg-[#FAF8F5] hover:border-[#8C2320] hover:bg-[#F4EFE6]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-3">
              <Loader2 className="w-8 h-8 text-[#8C2320] animate-spin" />
              <p className="text-xs font-bold text-[#8C2320]">Đang xử lý & tải ảnh lên...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E8DFC8] flex items-center justify-center text-[#8C2320] shadow-xs">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2D241E]">
                  Kéo thả tệp ảnh vào đây hoặc <span className="text-[#8C2320] underline">duyệt từ máy</span>
                </p>
                <p className="text-[10.5px] text-[#7A6B60] mt-0.5">
                  Hỗ trợ định dạng PNG, JPG, WEBP, SVG, GIF (Tối đa 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleUrlSubmit} className="flex items-center space-x-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6B50]" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#2D241E] focus:ring-2 focus:ring-[#8C2320]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#8C2320] hover:bg-[#6E1B19] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Áp dụng
          </button>
        </form>
      )}
    </div>
  );
};
