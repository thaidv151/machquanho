import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  duration = 3500,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          containerBg: 'bg-[#0F172A]',
          borderColor: 'border-emerald-500/80',
          textColor: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          Icon: CheckCircle2,
          label: 'Thành công',
        };
      case 'error':
        return {
          containerBg: 'bg-[#0F172A]',
          borderColor: 'border-rose-500/80',
          textColor: 'text-rose-400',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          Icon: XCircle,
          label: 'Lỗi thao tác',
        };
      case 'warning':
        return {
          containerBg: 'bg-[#0F172A]',
          borderColor: 'border-amber-500/80',
          textColor: 'text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          Icon: AlertTriangle,
          label: 'Cảnh báo',
        };
      default:
        return {
          containerBg: 'bg-[#0F172A]',
          borderColor: 'border-sky-500/80',
          textColor: 'text-sky-400',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
          Icon: Info,
          label: 'Thông báo',
        };
    }
  };

  const style = getStyle();
  const IconComponent = style.Icon;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideDown max-w-md w-full px-4 sm:px-0">
      <div className={`${style.containerBg} text-white px-4 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3.5 border-2 ${style.borderColor} backdrop-blur-md transition-all`}>
        <div className={`p-2 rounded-xl ${style.badgeBg} border shrink-0`}>
          <IconComponent className={`w-5 h-5 ${style.textColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] font-bold uppercase tracking-wider ${style.textColor}`}>
            {style.label}
          </p>
          <p className="text-xs font-semibold text-slate-100 truncate mt-0.5">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
