import React, { useState } from 'react';

export default function RegisterForm({ setView }) {
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
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
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, soTaiKhoanBank, tenNganHang, loaiTaiKhoan }) 
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Đăng ký thất bại');
      
      setMessage('Đăng ký thành công! Đang chuyển sang đăng nhập...');
      setTimeout(() => {
        setView('login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {error && <p style={{ color: '#b91c1c', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>{error}</p>}
      {message && <p style={{ color: '#15803d', backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
        <input 
          type="text" 
          placeholder="Tên đăng nhập hoặc Số điện thoại" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }} 
        />
        
        <input 
          type="email" 
          placeholder="Nhập địa chỉ Email của bạn" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '5px 0' }}>
          <label style={{
            cursor: 'pointer', padding: '12px 8px', borderRadius: '8px', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            border: loaiTaiKhoan === 'ca_nhan' ? '2px solid #28a745' : '2px solid #e2e8f0',
            backgroundColor: loaiTaiKhoan === 'ca_nhan' ? '#f0fdf4' : '#fff'
          }}>
            <input type="radio" name="loaiTK" value="ca_nhan" checked={loaiTaiKhoan === 'ca_nhan'} onChange={() => setLoaiTaiKhoan('ca_nhan')} style={{ display: 'none' }} />
            <span style={{ fontSize: '24px' }}>🧑‍💻</span>
            <span style={{ fontWeight: '900', color: loaiTaiKhoan === 'ca_nhan' ? '#166534' : '#64748b', fontSize: '14px' }}>Cá nhân</span>
          </label>

          <label style={{
            cursor: 'pointer', padding: '12px 8px', borderRadius: '8px', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            border: loaiTaiKhoan === 'doanh_nghiep' ? '2px solid #3b82f6' : '2px solid #e2e8f0',
            backgroundColor: loaiTaiKhoan === 'doanh_nghiep' ? '#eff6ff' : '#fff'
          }}>
            <input type="radio" name="loaiTK" value="doanh_nghiep" checked={loaiTaiKhoan === 'doanh_nghiep'} onChange={() => setLoaiTaiKhoan('doanh_nghiep')} style={{ display: 'none' }} />
            <span style={{ fontSize: '24px' }}>🏬</span>
            <span style={{ fontWeight: '900', color: loaiTaiKhoan === 'doanh_nghiep' ? '#1e40af' : '#64748b', fontSize: '14px' }}>Doanh nghiệp</span>
          </label>
        </div>

        <input 
          type="text" 
          placeholder="Số tài khoản ngân hàng" 
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

        <button 
          type="submit" 
          style={{ padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}
        >
          Tạo Tài Khoản Mới
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p onClick={() => setView('login')} style={{ color: '#475569', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          Đã có tài khoản? <span style={{ color: '#2563eb', textDecoration: 'underline' }}>Đăng nhập</span>
        </p>
      </div>
    </>
  );
}