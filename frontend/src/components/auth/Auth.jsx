import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function Auth({ onLoginSuccess }) {
  // Quản lý trạng thái xem màn hình nào: 'login', 'register', hay 'forgot'
  const [view, setView] = useState('login'); 

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
      
      <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '20px' }}>
        {view === 'forgot' && '🔓 KHÔI PHỤC MẬT KHẨU'}
        {view === 'login' && '🔑 ĐĂNG NHẬP HỆ THỐNG'}
        {view === 'register' && '📝 ĐĂNG KÝ TÀI KHOẢN'}
      </h2>

      {/* Dựa vào state view mà nó render đúng Component ra */}
      {view === 'login' && <LoginForm onLoginSuccess={onLoginSuccess} setView={setView} />}
      
      {view === 'register' && <RegisterForm setView={setView} />}
      
      {view === 'forgot' && <ForgotPasswordForm setView={setView} />}
      
    </div>
  );
}