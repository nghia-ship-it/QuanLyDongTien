import React, { useState } from 'react';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State cho con mắt mật khẩu
  const [soTaiKhoanBank, setSoTaiKhoanBank] = useState('');
  const [tenNganHang, setTenNganHang] = useState('');
  const [loaiTaiKhoan, setLoaiTaiKhoan] = useState('ca_nhan'); 
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const API_URL = 'https://quanlydongtien.onrender.com/api';

    try {
      if (isLogin) {
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
      } else {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, soTaiKhoanBank, tenNganHang, loaiTaiKhoan }) 
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
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '20px' }}>
        {isLogin ? '🔑 ĐĂNG NHẬP HỆ THỐNG' : '📝 ĐĂNG KÝ TÀI KHOẢN SAAS'}
      </h2>
      
      {error && <p style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
      {message && <p style={{ color: '#15803d', backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
        <input 
          type="text" 
          placeholder="Tên đăng nhập hoặc Số điện thoại" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }} 
        />
        
        {/* Ô Nhập Mật Khẩu có nút Ẩn/Hiện */}
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
        
        {!isLogin && (
          <>
            {/* Giao diện chọn thẻ Account ngầu lòi */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '5px 0' }}>
              <label style={{
                cursor: 'pointer', padding: '12px 8px', borderRadius: '8px', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                border: loaiTaiKhoan === 'ca_nhan' ? '2px solid #28a745' : '2px solid #e2e8f0',
                backgroundColor: loaiTaiKhoan === 'ca_nhan' ? '#f0fdf4' : '#fff',
                boxShadow: loaiTaiKhoan === 'ca_nhan' ? '0 4px 6px -1px rgba(40, 167, 69, 0.1)' : 'none'
              }}>
                <input type="radio" name="loaiTK" value="ca_nhan" checked={loaiTaiKhoan === 'ca_nhan'} onChange={() => setLoaiTaiKhoan('ca_nhan')} style={{ display: 'none' }} />
                <span style={{ fontSize: '24px' }}>🧑‍💻</span>
                <span style={{ fontWeight: '900', color: loaiTaiKhoan === 'ca_nhan' ? '#166534' : '#64748b', fontSize: '14px' }}>Cá nhân</span>
                <span style={{ fontSize: '12px', color: loaiTaiKhoan === 'ca_nhan' ? '#22c55e' : '#94a3b8', fontWeight: 'bold' }}>(Chỉ Thu / Chi)</span>
              </label>

              <label style={{
                cursor: 'pointer', padding: '12px 8px', borderRadius: '8px', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                border: loaiTaiKhoan === 'doanh_nghiep' ? '2px solid #3b82f6' : '2px solid #e2e8f0',
                backgroundColor: loaiTaiKhoan === 'doanh_nghiep' ? '#eff6ff' : '#fff',
                boxShadow: loaiTaiKhoan === 'doanh_nghiep' ? '0 4px 6px -1px rgba(59, 130, 246, 0.1)' : 'none'
              }}>
                <input type="radio" name="loaiTK" value="doanh_nghiep" checked={loaiTaiKhoan === 'doanh_nghiep'} onChange={() => setLoaiTaiKhoan('doanh_nghiep')} style={{ display: 'none' }} />
                <span style={{ fontSize: '24px' }}>🏬</span>
                <span style={{ fontWeight: '900', color: loaiTaiKhoan === 'doanh_nghiep' ? '#1e40af' : '#64748b', fontSize: '14px' }}>Doanh nghiệp</span>
                <span style={{ fontSize: '12px', color: loaiTaiKhoan === 'doanh_nghiep' ? '#3b82f6' : '#94a3b8', fontWeight: 'bold' }}>(Có Kho Hàng)</span>
              </label>
            </div>

            <input 
              type="text" 
              placeholder="Số tài khoản ngân hàng (Để SePay canh)" 
              value={soTaiKhoanBank} 
              onChange={e => setSoTaiKhoanBank(e.target.value)} 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }} 
            />
            <input 
              type="text" 
              placeholder="Tên ngân hàng (Ví dụ: MBBank, VCB)" 
              value={tenNganHang} 
              onChange={e => setTenNganHang(e.target.value)} 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }} 
            />
          </>
        )}

        <button 
          type="submit" 
          style={{ padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '5px', transition: 'background 0.2s' }}
          onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.background = '#2563eb'}
        >
          {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản Mới'}
        </button>
      </form>

      <p 
        onClick={() => setIsLogin(!isLogin)} 
        style={{ textAlign: 'center', color: '#475569', cursor: 'pointer', marginTop: '20px', fontWeight: 'bold', fontSize: '14px' }}
      >
        {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '} 
        <span style={{ color: '#2563eb', textDecoration: 'underline' }}>
          {isLogin ? 'Đăng ký ngay' : 'Quay lại Đăng nhập'}
        </span>
      </p>
    </div>
  );
}