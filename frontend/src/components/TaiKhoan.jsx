import React, { useState, useEffect } from 'react';

export default function TaiKhoan({ token }) {
  const [userInfo, setUserInfo] = useState({});
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [soTaiKhoanBank, setSoTaiKhoanBank] = useState('');
  const [tenNganHang, setTenNganHang] = useState('');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUserInfo(savedUser);
    setEmail(savedUser.email || '');
    setPhoneNumber(savedUser.phoneNumber || '');
    setSoTaiKhoanBank(savedUser.soTaiKhoanBank || '');
    setTenNganHang(savedUser.tenNganHang || '');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');

    const payload = {
      email, phoneNumber, soTaiKhoanBank, tenNganHang,
      oldPassword: oldPassword || undefined,
      newPassword: newPassword || undefined
    };

    try {
      const res = await fetch('https://quanlydongtien.onrender.com/api/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'auth-token': token },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Cập nhật thất bại!');

      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('🎉 Cập nhật thông tin thành công!');
      setOldPassword(''); setNewPassword('');
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="p-6 bg-transparent min-h-screen">
      <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-2xl font-black text-gray-800 mb-2">👤 Thông tin Tài khoản</h2>
        <p className="text-gray-500 mb-6">Xin chào, <span className="font-bold text-indigo-600">{userInfo.username}</span>! Bạn có thể cập nhật thông tin cá nhân tại đây.</p>

        {message && <div className="mb-4 p-3 bg-emerald-100 text-emerald-800 font-bold rounded-lg">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-800 font-bold rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="font-bold text-gray-700 border-b pb-2">Thông tin liên hệ</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Chưa cập nhật..." className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại:</label>
                <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Chưa cập nhật..." className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="font-bold text-gray-700 border-b pb-2">Liên kết Ngân hàng (SePay)</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản nhận tiền:</label>
                <input type="text" value={soTaiKhoanBank} onChange={e => setSoTaiKhoanBank(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 font-semibold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên ngân hàng (VD: MBBank):</label>
                <input type="text" value={tenNganHang} onChange={e => setTenNganHang(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-5 rounded-xl border border-red-100">
            <h3 className="font-bold text-red-800 border-b border-red-200 pb-2 mb-4">Đổi mật khẩu (Bỏ trống nếu không muốn đổi)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-1">Mật khẩu cũ:</label>
                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="••••••••" className="w-full border border-red-200 rounded-lg p-2 focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-red-700 mb-1">Mật khẩu mới:</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full border border-red-200 rounded-lg p-2 focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white font-black py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg text-lg">
            💾 LƯU THAY ĐỔI
          </button>
        </form>
      </div>
    </div>
  );
}