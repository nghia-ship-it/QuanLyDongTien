import React, { useState } from 'react';

export default function LoginForm({ onLoginSuccess, setView }) {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const API_URL = 'https://quanlydongtien.onrender.com/api';

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) 
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onLoginSuccess(data.token);
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng hoặc thử lại sau.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {error ? (
        <p style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>
          {error}
        </p>
      ) : null}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
        <input 
          type="text" 
          placeholder="Tên đăng nhập hoặc Số điện thoại" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }} 
        />
        
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Mật khẩu" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', width: '100%', outline: 'none' }} 
          />
          <span 
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '12px', cursor: 'pointer', fontSize: '18px' }}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <div style={{ textAlign: 'right', marginTop: '-5px' }}>
          <span 
            onClick={() => setView('forgot')} 
            style={{ color: '#2563eb', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Quên mật khẩu?
          </span>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: '14px', background: isLoading ? '#94a3b8' : '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '5px', transition: 'background 0.2s' }}
          onMouseOver={(e) => { if (!isLoading) e.target.style.background = '#1d4ed8' }}
          onMouseOut={(e) => { if (!isLoading) e.target.style.background = '#2563eb' }}
        >
          <span>{isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}</span>
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p onClick={() => setView('register')} style={{ color: '#475569', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          Chưa có tài khoản? <span style={{ color: '#2563eb', textDecoration: 'underline' }}>Đăng ký ngay</span>
        </p>
      </div>
    </div>
  );
}