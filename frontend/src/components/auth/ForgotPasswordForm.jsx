import React, { useState } from 'react';

export default function ForgotPasswordForm({ setView }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Chặn spam click

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true); // Bắt đầu quay vòng vòng

    const API_URL = 'https://quanlydongtien.onrender.com/api';

    try {
      // Bắn cục data chứa email lên API /forgot-password
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }) 
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Lỗi gửi email khôi phục');
      
      // Thành công thì in câu thông báo từ Backend ra
      setMessage(data.message);
      
      // Đợi 3 giây cho user đọc chữ xong rồi tự động quay về form Đăng nhập
      setTimeout(() => {
        setView('login');
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Chạy xong (dù lỗi hay không) thì mở khóa nút bấm
    }
  };

  return (
    <>
      {/* Hiển thị lỗi nếu có */}
      {error && <p style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>{error}</p>}
      
      {/* Hiển thị thành công */}
      {message && <p style={{ color: '#15803d', backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
        <input 
          type="email" 
          placeholder="Nhập địa chỉ Email của bạn" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          disabled={isLoading}
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', backgroundColor: isLoading ? '#f8fafc' : '#fff' }} 
        />

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: '14px', background: isLoading ? '#94a3b8' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '5px', transition: 'background 0.2s' }}
        >
          {isLoading ? 'Đang gửi email...' : 'Gửi liên kết khôi phục'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p onClick={() => !isLoading && setView('login')} style={{ color: isLoading ? '#94a3b8' : '#475569', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          ← Quay lại Đăng nhập
        </p>
      </div>
    </>
  );
}