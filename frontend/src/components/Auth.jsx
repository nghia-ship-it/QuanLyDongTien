import React, { useState } from 'react';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle giữa Login và Register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [soTaiKhoanBank, setSoTaiKhoanBank] = useState('');
  const [tenNganHang, setTenNganHang] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Link API backend của mày (Đổi thành link Render của mày khi deploy nhé)
    const API_URL = 'http://localhost:5000/api'; 

    try {
      if (isLogin) {
        // Xử lý Đăng Nhập
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');
        
        // Lưu token và thông tin user vào localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Báo cho App.jsx biết là đã login thành công
        onLoginSuccess(data.token);
      } else {
        // Xử lý Đăng Ký
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, soTaiKhoanBank, tenNganHang })
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại');
        
        setMessage('Đăng ký thành công! Đang chuyển sang đăng nhập...');
        setTimeout(() => {
          setIsLogin(true);
          setPassword('');
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial' }}>
      <h2>{isLogin ? '🔑 ĐĂNG NHẬP HỆ THỐNG' : '📝 ĐĂNG KÝ TÀI KHOẢN SAAS'}</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" placeholder="Email của mày" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '8px' }} />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '8px' }} />
        
        {!isLogin && (
          <>
            <input type="text" placeholder="Số tài khoản ngân hàng (Để SePay canh)" value={soTaiKhoanBank} onChange={e => setSoTaiKhoanBank(e.target.value)} style={{ padding: '8px' }} />
            <input type="text" placeholder="Tên ngân hàng (Ví dụ: MBBank, VCB)" value={tenNganHang} onChange={e => setTenNganHang(e.target.value)} style={{ padding: '8px' }} />
          </>
        )}

        <button type="submit" style={{ padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isLogin ? 'Đăng Nhập' : 'Đăng Ký Ngay'}
        </button>
      </form>

      <p onClick={() => setIsLogin(!isLogin)} style={{ textAlign: 'center', color: '#007bff', cursor: 'pointer', marginTop: '15px' }}>
        {isLogin ? 'Chưa có tài khoản? Bấm vào đây để đăng ký' : 'Đã có tài khoản? Quay lại Đăng nhập'}
      </p>
    </div>
  );
}