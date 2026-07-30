import React, { useState } from 'react';
import Dashboard from './Dashboard';
import NguonNhap from './NguonNhap/NguonNhap';
import DoanhThu from './DoanhThu/DoanhThu';
import KhoHang from './KhoHang/KhoHang';
import TaiKhoan from './TaiKhoan';
import HuongDanSePay from './HuongDanSePay';
import CongNo from './CongNo/CongNo';

export default function MainDashboard({ onLogout }) {
  const token = localStorage.getItem('token');
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setIsMobileMenuOpen(false);
  };

  const navBtn = (tab, color, icon, text) => {
    const isActive = currentTab === tab;
    return (
      <button 
        onClick={() => handleTabChange(tab)} 
        className={`px-3 py-2 rounded-lg text-sm font-bold transition shadow-sm ${isActive ? color : 'text-gray-300 hover:bg-[#3A3A3A]'}`}
      >
        {icon} {text}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img src="/LandingPage.png" alt="Background" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Navbar đồng bộ Landing Page */}
      <nav className="bg-[radial-gradient(circle_at_75%_10%,#5D5C5B_0%,#2B2B2B_35%,#111111_100%)] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <img src="/favicon.png" alt="FLOW Logo" className="h-8 w-auto object-contain" />
              <h1 className="text-xl font-extrabold text-emerald-500 tracking-tight">F.L.O.W</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              {navBtn('dashboard', 'bg-indigo-600 text-white', '📊', 'Tổng Quan')}
              {navBtn('nguonNhap', 'bg-blue-600 text-white', '💰', 'Chi Tiêu')}
              {navBtn('doanhThu', 'bg-emerald-600 text-white', '📈', 'Doanh Thu')}
              {navBtn('congNo', 'bg-orange-600 text-white', '📒', 'Công Nợ')}
              {userInfo.loaiTaiKhoan === 'doanh_nghiep' && navBtn('khoHang', 'bg-amber-600 text-white', '📦', 'Kho Hàng')}
              {navBtn('huongDan', 'bg-indigo-600 text-white', '⚙️', 'SePay')}
              {navBtn('taiKhoan', 'bg-purple-600 text-white', '👤', 'Tài Khoản')}
              
              <button onClick={onLogout} className="ml-4 px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/40 hover:text-red-300 font-bold rounded-lg transition">
                🚪 Thoát
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 focus:outline-none p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#2B2B2B] border-t border-gray-700 px-2 pt-2 pb-3 space-y-1 shadow-lg">
            <button onClick={() => handleTabChange('dashboard')} className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold text-white hover:bg-[#3A3A3A]">📊 Tổng Quan</button>
            <button onClick={() => handleTabChange('nguonNhap')} className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold text-white hover:bg-[#3A3A3A]">💰 Chi Tiêu</button>
            <button onClick={() => handleTabChange('doanhThu')} className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold text-white hover:bg-[#3A3A3A]">📈 Doanh Thu</button>
            <button onClick={() => handleTabChange('congNo')} className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold text-white hover:bg-[#3A3A3A]">📒 Công Nợ</button>
            {userInfo.loaiTaiKhoan === 'doanh_nghiep' && <button onClick={() => handleTabChange('khoHang')} className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold text-white hover:bg-[#3A3A3A]">📦 Kho Hàng</button>}
            <button onClick={() => handleTabChange('taiKhoan')} className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold text-white hover:bg-[#3A3A3A]">👤 Tài Khoản</button>
            <button onClick={onLogout} className="w-full text-left px-4 py-3 text-red-400 font-bold hover:bg-[#3A3A3A]">🚪 Thoát</button>
          </div>
        )}
      </nav>

      <main className="relative z-10 flex-grow max-w-7xl mx-auto w-full py-4 sm:px-4 lg:px-6">
        {currentTab === 'dashboard' && <Dashboard token={token} />}
        {currentTab === 'nguonNhap' && <NguonNhap token={token} />}
        {currentTab === 'doanhThu' && <DoanhThu token={token} />}
        {currentTab === 'congNo' && <CongNo token={token} />}
        {currentTab === 'khoHang' && userInfo.loaiTaiKhoan === 'doanh_nghiep' && <KhoHang token={token} />}
        {currentTab === 'huongDan' && <HuongDanSePay />}
        {currentTab === 'taiKhoan' && <TaiKhoan token={token} />}
      </main>

      {/* Footer đồng bộ Landing Page */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center relative z-20 mt-auto">
        <p className="text-sm">© 2026 F.L.O.W System. Phát triển bởi Trần Hà Gia Nghĩa.</p>
      </footer>
    </div>
  );
}