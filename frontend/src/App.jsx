import React, { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import NguonNhap from './components/NguonNhap';
import DoanhThu from './components/DoanhThu';
import KhoHang from './components/KhoHang';
import TaiKhoan from './components/TaiKhoan';
import HuongDanSePay from './components/HuongDanSePay';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lấy thông tin user để soi loại tài khoản
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);
  };

  if (!token) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header & Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-black text-indigo-600 tracking-tight">SmartBiz SaaS</h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              <button onClick={() => handleTabChange('dashboard')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                📊 Tổng Quan
              </button>
              <button onClick={() => handleTabChange('nguonNhap')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'nguonNhap' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                💰 Nguồn Nhập
              </button>
              <button onClick={() => handleTabChange('doanhThu')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'doanhThu' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                📈 Doanh Thu
              </button>
              
              {/* CHỈ HIỆN KHO HÀNG NẾU LÀ DOANH NGHIỆP */}
              {userInfo.loaiTaiKhoan === 'doanh_nghiep' && (
                <button onClick={() => handleTabChange('khoHang')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'khoHang' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  📦 Kho Hàng
                </button>
              )}

              <button onClick={() => handleTabChange('huongDan')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'huongDan' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                ⚙️ Tích hợp SePay
              </button>
              <button onClick={() => handleTabChange('taiKhoan')} className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'taiKhoan' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                👤 Tài Khoản
              </button>
              
              <button onClick={handleLogout} className="ml-4 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-lg transition">
                🚪 Đăng xuất
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-2 pt-2 pb-3 space-y-1 shadow-lg">
            <button onClick={() => handleTabChange('dashboard')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              📊 Tổng Quan
            </button>
            <button onClick={() => handleTabChange('nguonNhap')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'nguonNhap' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              💰 Nguồn Nhập
            </button>
            <button onClick={() => handleTabChange('doanhThu')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'doanhThu' ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              📈 Doanh Thu
            </button>

            {/* CHỈ HIỆN KHO HÀNG NẾU LÀ DOANH NGHIỆP */}
            {userInfo.loaiTaiKhoan === 'doanh_nghiep' && (
              <button onClick={() => handleTabChange('khoHang')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'khoHang' ? 'bg-amber-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                📦 Kho Hàng
              </button>
            )}

            <button onClick={() => handleTabChange('huongDan')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'huongDan' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              ⚙️ Tích hợp SePay
            </button>
            <button onClick={() => handleTabChange('taiKhoan')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition shadow-sm ${currentTab === 'taiKhoan' ? 'bg-purple-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
              👤 Tài Khoản
            </button>
            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-bold rounded-lg transition mt-2">
              🚪 Đăng xuất
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:px-4 lg:px-6">
        {currentTab === 'dashboard' && <Dashboard token={token} />}
        {currentTab === 'nguonNhap' && <NguonNhap token={token} />}
        {currentTab === 'doanhThu' && <DoanhThu token={token} />}
        
        {/* CHẶN HIỂN THỊ COMPONENT NẾU KHÔNG PHẢI DOANH NGHIỆP */}
        {currentTab === 'khoHang' && userInfo.loaiTaiKhoan === 'doanh_nghiep' && <KhoHang token={token} />}
        
        {currentTab === 'huongDan' && <HuongDanSePay />}
        {currentTab === 'taiKhoan' && <TaiKhoan token={token} />}
      </main>
    </div>
  );
}