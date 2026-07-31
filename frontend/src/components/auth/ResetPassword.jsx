import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Lấy cái mã token từ trên thanh URL xuống
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('Mật khẩu nhập lại không khớp!');
    }

    if (!token) {
      return setError('Đường dẫn không hợp lệ hoặc không tìm thấy mã xác thực!');
    }

    setIsLoading(true);
    try {
      const res = await fetch('https://quanlydongtien.onrender.com/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi đặt lại mật khẩu');

      setMessage('🎉 ' + data.message);
      
      // Thành công thì tự động đá về trang login sau 3 giây
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Ảnh nền y hệt Landing Page */}
      <div className="absolute inset-0 z-0">
        <img src="/LandingPage.png" alt="Background" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Khung Form Đổi Mật Khẩu */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-center text-2xl font-black text-gray-800 mb-6 uppercase">
          🔐 THIẾT LẬP MẬT KHẨU MỚI
        </h2>

        {error && <p className="text-red-700 bg-red-50 p-3 rounded-lg text-center font-bold text-sm mb-4">{error}</p>}
        {message && <p className="text-emerald-700 bg-emerald-50 p-3 rounded-lg text-center font-bold text-sm mb-4">{message}</p>}

        {!message && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu mới:</label>
              <input 
                type="password" 
                placeholder="Nhập mật khẩu mới" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
                disabled={isLoading}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Xác nhận mật khẩu:</label>
              <input 
                type="password" 
                placeholder="Nhập lại mật khẩu mới" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
                disabled={isLoading}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`p-3 text-white rounded-lg font-bold text-lg mt-2 transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading ? 'Đang xử lý...' : 'Xác nhận Đổi Mật Khẩu'}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/login" className="text-gray-500 hover:text-blue-600 font-bold text-sm">
            ← Quay lại trang Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}