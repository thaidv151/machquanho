import React, { useState } from 'react';
import { Lock, Mail, Shield, X, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { apiService } from '../services/apiService';
import { AdminUser } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await apiService.login({ email: email.trim(), password: password.trim() });
      const user = await apiService.getMe();
      if (user) {
        onLoginSuccess(user);
        onClose();
        // Reset form inputs for security
        setEmail('');
        setPassword('');
      } else {
        setErrorMsg('Đăng nhập thành công nhưng không lấy được thông tin người dùng.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.data?.error) {
        setErrorMsg('Tên đăng nhập hoặc mật khẩu không chính xác.');
      } else if (err.response?.status === 401) {
        setErrorMsg('Tài khoản hoặc mật khẩu không chính xác.');
      } else {
        setErrorMsg('Không thể kết nối đến Máy chủ API Backend. Vui lòng kiểm tra lại kết nối.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-2xl border border-[#E2D6C3] shadow-2xl overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#8C2320] to-[#B83E3E] p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7 text-[#F5E6D3]" />
          </div>

          <h2 className="text-xl font-bold font-serif-culture tracking-wide">
            ĐĂNG NHẬP QUẢN TRỊ CMS
          </h2>
          <p className="text-xs text-[#F1D8B4] mt-1 font-light">
            Vui lòng nhập tài khoản và mật khẩu được cấp để truy cập hệ thống
          </p>
        </div>

        {/* Login Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 text-xs text-[#8C2320] bg-[#FDF2F2] border border-[#F8C4C4] rounded-xl flex items-center space-x-2 animate-shake">
              <Lock className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-[#4A3B32] mb-1.5 uppercase tracking-wider">
              Email Quản trị
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6B50]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email tài khoản của bạn..."
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D9CEBA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8C2320] focus:border-transparent text-[#3A1E16] placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-[#4A3B32] mb-1.5 uppercase tracking-wider">
              Mật khẩu
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C6B50]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D9CEBA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8C2320] focus:border-transparent text-[#3A1E16]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 mt-2 text-sm font-semibold text-white bg-gradient-to-r from-[#8C2320] to-[#A32D29] hover:from-[#6E1B19] hover:to-[#8C2320] rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xác thực thông tin...</span>
              </>
            ) : (
              <>
                <span>Đăng nhập Hệ thống</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#F0EBE1] border-t border-[#E2D6C3] text-center text-[11px] text-[#8C6B50]">
          Bảo mật hệ thống • Xác thực mã hóa JWT Token
        </div>
      </div>
    </div>
  );
};
