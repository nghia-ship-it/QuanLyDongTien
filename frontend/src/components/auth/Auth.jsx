import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function Auth({ onLoginSuccess }) {
  const [view, setView] = useState('login'); 

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <img src="/LandingPage.png" alt="Background" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Khung Form Đăng nhập (Hiệu ứng kính mờ Glassmorphism) */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-center text-2xl font-black text-gray-800 mb-6 uppercase">
          {view === 'forgot' && '🔓 Khôi phục mật khẩu'}
          {view === 'login' && '🔑 Đăng nhập hệ thống'}
          {view === 'register' && '📝 Đăng ký tài khoản'}
        </h2>

        {view === 'login' && <LoginForm onLoginSuccess={onLoginSuccess} setView={setView} />}
        {view === 'register' && <RegisterForm setView={setView} />}
        {view === 'forgot' && <ForgotPasswordForm setView={setView} />}
      </div>
    </div>
  );
}