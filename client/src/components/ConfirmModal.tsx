import React from 'react';
import { AlertTriangle, Trash2, X, Check, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Xác nhận thao tác',
  message,
  confirmText = 'Đồng ý xóa',
  cancelText = 'Hủy bỏ',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-2xl border border-[#E2D6C3] shadow-2xl overflow-hidden animate-scaleUp">
        
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-[#8C2320] to-[#B83E3E] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              {variant === 'danger' ? (
                <Trash2 className="w-5 h-5 text-[#F9EFE6]" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-[#F5E6D3]" />
              )}
            </div>
            <h3 className="font-serif-culture text-lg font-bold tracking-wide">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-[#3A1E16] leading-relaxed">
            {message}
          </p>

          <div className="bg-[#F3EDE2] border border-[#E4D9C7] p-3.5 rounded-xl text-xs text-[#7A6B60] flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-[#8C2320] shrink-0 mt-0.5" />
            <span>Thao tác này không thể hoàn tác sau khi đã thực thi thành công.</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-[#F0EBE1] border-t border-[#E2D6C3] flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2 rounded-xl text-xs font-bold text-[#5C4D44] bg-white border border-[#D9CEBA] hover:bg-[#FAF8F5] transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8C2320] to-[#A32D29] hover:from-[#6E1B19] hover:to-[#8C2320] shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
