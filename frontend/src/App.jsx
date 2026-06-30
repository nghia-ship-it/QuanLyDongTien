import React, { useState, useEffect } from 'react';
import Auth from './components/Auth'; 
import DoanhThu from './components/DoanhThu';
import NguonNhap from './components/NguonNhap';
import Dashboard from './components/Dashboard'; 
import HuongDanSePay from './components/HuongDanSePay'; 
import KhoHang from './components/KhoHang/KhoHang';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // State Đồ Chơi
  const [isDark, setIsDark] = useState(false);
  const [fontSize, setFontSize] = useState('text-base');
  
  // State quản lý Menu Xổ xuống trên điện thoại/laptop nhỏ
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) document.body.classList.add('dark-theme');
    else document.body.classList.remove('dark-theme');
  }, [isDark]);

  const toggleFontSize = () => {
    if (fontSize === 'text-sm') setFontSize('text-base');
    else if (fontSize === 'text-base') setFontSize('text-lg');
    else setFontSize('text-sm');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
  };

  // Hàm chuyển tab tiện tay đóng luôn cái menu trên điện thoại
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setIsMenuOpen(false); 
  };

  if (!token) {
    return <Auth onLoginSuccess={(savedToken) => setToken(savedToken)} />;
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${fontSize} font-sans antialiased transition-all`}>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                💼 <span className="hidden sm:inline">Quản Lý Dòng Tiền</span>
              </span>
            </div>

            {/* Nút Menu Hamburger (Chỉ hiện trên màn hình nhỏ) */}
            <div className="flex lg:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none p-2 rounded-md transition"
              >
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Cụm Nút Điều Hướng & Công Cụ (Chỉ hiện trên màn hình bự từ LG trở lên) */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex space-x-2">
                <button onClick={() => handleTabChange('dashboard')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  📊 Tổng Quan
                </button>
                <button onClick={() => handleTabChange('nguonNhap')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'nguonNhap' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  💰 Nguồn Nhập
                </button>
                <button onClick={() => handleTabChange('doanhThu')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'doanhThu' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  📈 Doanh Thu
                </button>
                <button onClick={() => handleTabChange('khoHang')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'khoHang' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  📦 Kho Hàng
                </button>
                <button onClick={() => handleTabChange('huongDan')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'huongDan' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  ⚙️ Tích hợp SePay
                </button>
              </div>
              
              {/* Đám nút Công cụ */}
              <div className="flex items-center gap-2 border-l pl-6">
                <button onClick={toggleFontSize} className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg font-bold hover:bg-amber-200 transition" title="Đổi cỡ chữ">
                  A±
                </button>
                <button onClick={() => setIsDark(!isDark)} className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-200 transition" title="Giao diện tối">
                  {isDark ? '☀️ Sáng' : '🌙 Tối'}
                </button>
                <button onClick={handleLogout} className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-bold transition" title="Đăng xuất">
                  🚪 Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dropdown Menu thả xuống cho Điện thoại / Laptop nhỏ */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl z-50">
            <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
              <button onClick={() => handleTabChange('dashboard')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'dashboard' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                📊 Tổng Quan
              </button>
              <button onClick={() => handleTabChange('nguonNhap')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'nguonNhap' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                💰 Nguồn Nhập
              </button>
              <button onClick={() => handleTabChange('doanhThu')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'doanhThu' ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                📈 Doanh Thu
              </button>
              <button onClick={() => handleTabChange('khoHang')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'khoHang' ? 'bg-amber-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                📦 Kho Hàng
              </button>
              <button onClick={() => handleTabChange('huongDan')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'huongDan' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                ⚙️ Tích hợp SePay
              </button>
              
              <div className="border-t border-gray-200 mt-2 pt-4 flex gap-2 justify-center">
                <button onClick={toggleFontSize} className="flex-1 bg-amber-100 text-amber-800 px-3 py-2 rounded-lg font-bold hover:bg-amber-200 transition">
                  A±
                </button>
                <button onClick={() => setIsDark(!isDark)} className="flex-1 bg-indigo-100 text-indigo-800 px-3 py-2 rounded-lg font-bold hover:bg-indigo-200 transition">
                  {isDark ? '☀️ Sáng' : '🌙 Tối'}
                </button>
                <button onClick={handleLogout} className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg font-bold hover:bg-red-200 transition">
                  🚪 Thoát
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-4 sm:px-4 lg:px-6">
        {currentTab === 'dashboard' && <Dashboard token={token} />}
        {currentTab === 'nguonNhap' && <NguonNhap token={token} />}
        {currentTab === 'doanhThu' && <DoanhThu token={token} />}
        {currentTab === 'khoHang'&& <KhoHang token={token}/>}
        {currentTab === 'huongDan' && <HuongDanSePay />}
      </main>
    </div>
  );
}