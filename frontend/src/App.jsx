import React, { useState, useEffect } from 'react';
import Auth from './components/Auth'; 
import DoanhThu from './components/DoanhThu';
import NguonNhap from './components/NguonNhap';
import Dashboard from './components/Dashboard'; 

export default function App() {
  // Thay isUnlocked bằng token
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // State Đồ Chơi
  const [isDark, setIsDark] = useState(false);
  const [fontSize, setFontSize] = useState('text-base');

  useEffect(() => {
    // Ép class CSS để bật tắt Dark Mode toàn trang
    if (isDark) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
  }, [isDark]);

  const toggleFontSize = () => {
    if (fontSize === 'text-sm') setFontSize('text-base');
    else if (fontSize === 'text-base') setFontSize('text-lg');
    else setFontSize('text-sm');
  };

  // Hàm Đăng xuất xịn: xóa token khỏi máy
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
  };

  // Nếu chưa có token thì vứt ra màn hình Đăng nhập/Đăng ký
  if (!token) {
    return <Auth onLoginSuccess={(savedToken) => setToken(savedToken)} />;
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${fontSize} font-sans antialiased transition-all`}>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap">
              <span className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                💼 <span className="hidden sm:inline">Quản Lý Dòng Tiền</span>
              </span>
              <div className="flex space-x-2">
                <button onClick={() => setCurrentTab('dashboard')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  📊 Tổng Quan
                </button>
                <button onClick={() => setCurrentTab('nguonNhap')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'nguonNhap' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  💰 Nguồn Nhập
                </button>
                <button onClick={() => setCurrentTab('doanhThu')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'doanhThu' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  📈 Doanh Thu
                </button>
              </div>
            </div>
            
            {/* Đám nút Công cụ */}
            <div className="flex items-center gap-2">
              <button onClick={toggleFontSize} className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg font-bold hover:bg-amber-200 transition" title="Đổi cỡ chữ">
                A±
              </button>
              <button onClick={() => setIsDark(!isDark)} className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-200 transition" title="Giao diện tối">
                {isDark ? '☀️ Sáng' : '🌙 Tối'}
              </button>
              {/* Đổi thành hàm handleLogout */}
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 p-2 rounded-lg text-sm font-semibold transition" title="Đăng xuất">
                🚪 Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-4 sm:px-4 lg:px-6">
        {/* QUAN TRỌNG: Phải truyền cái token này xuống cho mấy trang con để tụi nó xài gọi API */}
        {currentTab === 'dashboard' && <Dashboard token={token} />}
        {currentTab === 'nguonNhap' && <NguonNhap token={token} />}
        {currentTab === 'doanhThu' && <DoanhThu token={token} />}
      </main>
    </div>
  );
}