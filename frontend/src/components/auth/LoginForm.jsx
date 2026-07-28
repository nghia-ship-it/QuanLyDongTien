import React, { useState } from 'react';

export default function LoginForm({ onLoginSuccess, setView }) {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const API_URL = 'https://quanlydongtien.onrender.com/api';

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) 
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onLoginSuccess(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {error && <p style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>{error}</p>}
      
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
          style={{ padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '5px', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.background = '#2563eb'}
        >
          Đăng Nhập
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p onClick={() => setView('register')} style={{ color: '#475569', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          Chưa có tài khoản? <span style={{ color: '#2563eb', textDecoration: 'underline' }}>Đăng ký ngay</span>
        </p>
      </div>
    </>
  );
}