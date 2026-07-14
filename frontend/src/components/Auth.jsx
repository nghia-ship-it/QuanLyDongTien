import React, { useState } from 'react';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); 
  // Đổi state email thành username
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [soTaiKhoanBank, setSoTaiKhoanBank] = useState('');
  const [tenNganHang, setTenNganHang] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const API_URL = 'https://quanlydongtien.onrender.com/api';

    try {
      if (isLogin) {
        // Xử lý Đăng Nhập
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }) // Gửi username thay vì email
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Đăng nhập thất bại');
        
        // Lưu token và thông tin user vào localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        onLoginSuccess(data.token);
      } else {
        // Xử lý Đăng Ký
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, soTaiKhoanBank, tenNganHang }) // Gửi username thay vì email
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
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>
        {isLogin ? '🔑 ĐĂNG NHẬP HỆ THỐNG' : '📝 ĐĂNG KÝ TÀI KHOẢN SAAS'}
      </h2>
      
      {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
      {message && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
        <input 
          type="text" 
          placeholder="Tên đăng nhập hoặc Số điện thoại" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '15px' }} 
        />
        <input 
          type="password" 
          placeholder="Mật khẩu" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '15px' }} 
        />
        
        {!isLogin && (
          <>
            <input 
              type="text" 
              placeholder="Số tài khoản ngân hàng (Để SePay canh)" 
              value={soTaiKhoanBank} 
              onChange={e => setSoTaiKhoanBank(e.target.value)} 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '15px' }} 
            />
            <input 
              type="text" 
              placeholder="Tên ngân hàng (Ví dụ: MBBank, VCB)" 
              value={tenNganHang} 
              onChange={e => setTenNganHang(e.target.value)} 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '15px' }} 
            />
          </>
        )}

        <button 
          type="submit" 
          style={{ padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}
        >
          {isLogin ? 'Đăng Nhập' : 'Đăng Ký Ngay'}
        </button>
      </form>

      <p 
        onClick={() => setIsLogin(!isLogin)} 
        style={{ textAlign: 'center', color: '#007bff', cursor: 'pointer', marginTop: '20px', fontWeight: 'bold' }}
      >
        {isLogin ? 'Chưa có tài khoản? Bấm vào đây để đăng ký' : 'Đã có tài khoản? Quay lại Đăng nhập'}
      </p>
    </div>
  );
}