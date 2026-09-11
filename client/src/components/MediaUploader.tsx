import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, X, Loader2, Music, Video, Check, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';

interface MediaUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  mediaType: 'audio' | 'video';
  label?: string;
  placeholder?: string;
  className?: string;
  maxAudioSizeMB?: number; // Default 50MB
  maxVideoSizeMB?: number; // Default 100MB
  disabled?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  value = '',
  onChange,
  mediaType = 'audio',
  label = 'Tệp Âm thanh / Video',
  placeholder = 'Nhập link file MP3, MP4 hoặc URL YouTube...',
  className = '',
  maxAudioSizeMB = 50,
  maxVideoSizeMB = 100,
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeMB = mediaType === 'video' ? maxVideoSizeMB : maxAudioSizeMB;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileSelect = async (file: File) => {
    setErrorMessage(null);

    // Validate size limit
    if (file.size > maxSizeBytes) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const msg = `Dung lượng tệp ${mediaType === 'video' ? 'video' : 'ghi âm'} (${fileSizeMB}MB) vượt quá giới hạn cho phép ${maxSizeMB}MB. Vui lòng chọn tệp nhỏ hơn${mediaType === 'video' ? ' hoặc nhập link YouTube' : ''}!`;
      setErrorMessage(msg);
      alert(msg);
      return;
    }

    // Validate file type
    const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(file.name);
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|avi|mkv|flv|wmv)$/i.test(file.name);

    if (mediaType === 'audio' && !isAudio && !isVideo) {
      const msg = 'Vui lòng chọn tệp định dạng âm thanh (.mp3, .wav, .m4a, .aac, .ogg, .flac)';
      setErrorMessage(msg);
      alert(msg);
      return;
    }

    if (mediaType === 'video' && !isVideo) {
      const msg = 'Vui lòng chọn tệp định dạng video (.mp4, .webm, .mov, .avi, .mkv)';
      setErrorMessage(msg);
      alert(msg);
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await apiService.uploadFile(file);
      onChange(uploadedUrl);
      setUrlInput(uploadedUrl);
      setErrorMessage(null);
    } catch (err: any) {
      console.error('Media upload failed:', err);
      const msg = err.message || 'Tải tệp media thất bại. Vui lòng thử lại!';
      setErrorMessage(msg);
      alert(msg);
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
    setErrorMessage(null);
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isYouTubeUrl = (url: string) => {
    return /youtube\.com|youtu\.be/i.test(url);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#4A3B32]">
            {label} <span className="text-[11px] font-normal text-[#8C6B50]">(Giới hạn {maxSizeMB}MB)</span>
          </label>
          <div className="flex items-center space-x-1.5 text-[10.5px]">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'upload' ? 'bg-[#8C2320] text-white' : 'bg-[#FAF8F5] text-[#7A6B60] hover:text-[#2D241E]'
              }`}
            >
              Tải tệp từ máy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                activeTab === 'url' ? 'bg-[#8C2320] text-white' : 'bg-[#FAF8F5] text-[#7A6B60] hover:text-[#2D241E]'
              }`}
            >
              Dán Link URL
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={mediaType === 'video' ? 'video/*,.mp4,.webm,.mov,.avi,.mkv' : 'audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac'}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Current Preview or Upload Dropzone */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-[#D9CEBA] bg-[#FAF8F5] p-3 space-y-2">
          {/* Media Player Preview */}
          {mediaType === 'video' || isYouTubeUrl(value) ? (
            <div className="w-full relative bg-black rounded-xl overflow-hidden flex items-center justify-center min-h-[140px]">
              {isYouTubeUrl(value) ? (
                <div className="p-4 text-center text-xs text-white flex flex-col items-center space-y-1">
                  <Video className="w-8 h-8 text-red-500" />
                  <span className="font-bold">Video YouTube</span>
                  <span className="text-[11px] font-mono text-gray-300 truncate max-w-full">{value}</span>
                </div>
              ) : (
                <video src={value} controls className="w-full max-h-48 object-contain rounded-xl" />
              )}
            </div>
          ) : (
            <div className="p-3 bg-white rounded-xl border border-[#E8DFC8] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#8C2320]">
                <Music className="w-4 h-4" />
                <span>Xem trước bản ghi âm / Audio</span>
              </div>
              <audio src={value} controls className="w-full h-9" />
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-[#8C6B50] truncate max-w-[70%]">{value}</span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="px-3 py-1 bg-[#8C2320] text-white rounded-lg text-xs font-bold hover:bg-[#6E1B19] transition-colors cursor-pointer flex items-center space-x-1"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Đổi tệp</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={disabled}
                className="p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                title="Xóa tệp"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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
            <div className="flex flex-col items-center justify-center space-y-2 py-4">
              <Loader2 className="w-8 h-8 text-[#8C2320] animate-spin" />
              <p className="text-xs font-bold text-[#8C2320]">
                Đang tải tệp {mediaType === 'video' ? 'video' : 'âm thanh'} lên máy chủ...
              </p>
              <p className="text-[10.5px] text-[#7A6B60]">Vui lòng giữ trình duyệt mở cho tới khi tải xong</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E8DFC8] flex items-center justify-center text-[#8C2320] shadow-xs">
                {mediaType === 'video' ? <Video className="w-5 h-5" /> : <Music className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-[#2D241E]">
                  Kéo thả tệp {mediaType === 'video' ? 'video' : 'ghi âm / MP3'} vào đây hoặc <span className="text-[#8C2320] underline">duyệt từ máy</span>
                </p>
                <p className="text-[10.5px] text-[#7A6B60] mt-0.5">
                  {mediaType === 'video'
                    ? `Hỗ trợ MP4, WEBM, MOV, AVI, MKV (Tối đa ${maxVideoSizeMB}MB)`
                    : `Hỗ trợ MP3, WAV, M4A, AAC, OGG, FLAC (Tối đa ${maxAudioSizeMB}MB)`}
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
              className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl text-xs text-[#1C1412] focus:ring-2 focus:ring-[#8C2320]"
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
