import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Header / Navbar */}
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🚀</span>
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">DongTienWeb</h1>
        </div>
        <div>
          <Link to="/login" className="text-gray-600 hover:text-blue-600 mr-6 font-medium transition">
            Đăng nhập
          </Link>
          <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-md">
            Đăng ký miễn phí
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Quản lý Bán hàng & Dòng tiền <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Toàn diện, Tự động
          </span>
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Giải pháp số hóa tối ưu cho Cá nhân và Doanh nghiệp. Tự động đối soát giao dịch, quản lý kho hàng và báo cáo doanh thu theo thời gian thực mà không cần nhập liệu thủ công.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            Bắt đầu trải nghiệm ngay
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Tính năng nổi bật của hệ thống</h2>
            <p className="text-gray-500 mt-4 text-lg">Được thiết kế riêng để tối ưu hóa quy trình kinh doanh của bạn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-8 border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 bg-slate-50">
              <div className="text-5xl mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">💰</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Quản lý Thu Chi</h3>
              <p className="text-gray-600 leading-relaxed">
                Kiểm soát mọi khoản tiền ra vào dễ dàng. Cung cấp Dashboard báo cáo thống kê trực quan dành riêng cho cá nhân và hộ kinh doanh.
              </p>
            </div>

            <div className="p-8 border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 bg-slate-50">
              <div className="text-5xl mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">📦</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Quản lý Kho Hàng</h3>
              <p className="text-gray-600 leading-relaxed">
                Phân hệ chuyên sâu cho Doanh nghiệp: Nhập/xuất kho, kiểm kê vật tư và theo dõi tình trạng tồn kho tức thì, cảnh báo khi sắp hết hàng.
              </p>
            </div>

            <div className="p-8 border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition duration-300 bg-slate-50">
              <div className="text-5xl mb-6 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">⚡</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Đối soát Tự động</h3>
              <p className="text-gray-600 leading-relaxed">
                Tích hợp Webhook SePay độc quyền. Tiền "ting ting" vào tài khoản ngân hàng là hệ thống lập tức tự động ghi nhận doanh thu không trượt phát nào.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <p>© 2026 DongTienWeb. Phát triển bởi Trần Hà Gia Nghĩa.</p>
      </footer>
    </div>
  );
}