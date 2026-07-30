import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen font-sans overflow-x-hidden">
      {/* Header / Navbar */}
      <nav className="flex justify-between items-center p-6 bg-[radial-gradient(circle_at_75%_10%,#5D5C5B_0%,#2B2B2B_35%,#111111_100%)] shadow-sm relative z-50">
        <div className="flex items-center gap-2">
          <img src="/favicon.png" alt="FLOW Logo" className="h-10 w-auto object-contain" />
          <h1 className="text-2xl font-extrabold text-emerald-600 tracking-tight">F.L.O.W</h1>
        </div>
        <div>
          <Link to="/login" className="text-white hover:text-emerald-600 mr-6 font-medium transition">
            Đăng nhập
          </Link>
          <Link to="/register" className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition shadow-md">
            Đăng ký miễn phí
          </Link>
        </div>
      </nav>

      {/* Hero Section*/}
      <main className="relative w-full min-h-[85vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/LandingPage.png" 
            alt="Giao diện phần mềm FLOW" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Quản lý Bán hàng & Dòng tiền <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Toàn diện, Tự động
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow">
            Giải pháp số hóa tối ưu cho Cá nhân và Doanh nghiệp. Tự động đối soát giao dịch, quản lý kho hàng và báo cáo doanh thu theo thời gian thực.
          </p>
          
          <div className="flex justify-center gap-4">
            {/* Nút bấm tao thêm hiệu ứng phát sáng (glow) nhìn bao ảo */}
            <Link to="/register" className="bg-emerald-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition transform hover:-translate-y-1">
              Bắt đầu trải nghiệm ngay
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-[radial-gradient(circle_at_75%_10%,#5D5C5B_0%,#2B2B2B_35%,#111111_100%)] py-24 relative z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-300">Tính năng nổi bật của hệ thống</h2>
            <p className="text-gray-100 mt-4 text-lg">Được thiết kế riêng để tối ưu hóa quy trình kinh doanh của bạn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-8 border border-gray-700 rounded-3xl shadow-sm hover:shadow-xl hover:bg-[#333333] hover:-translate-y-2 transition duration-300 bg-[#2B2B2B]">
              <div className="text-5xl mb-6 bg-[#3A3A3A] w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">
                💰
              </div>

              <h3 className="text-xl font-bold mb-3 text-white">
                Quản lý Thu Chi
              </h3>

              <p className="text-gray-300 leading-relaxed">
                Kiểm soát mọi khoản tiền ra vào dễ dàng. Cung cấp Dashboard báo cáo
                thống kê trực quan dành riêng cho cá nhân và hộ kinh doanh.
              </p>
          </div>


            <div className="p-8 border border-gray-700 rounded-3xl shadow-sm hover:shadow-xl hover:bg-[#333333] hover:-translate-y-2 transition duration-300 bg-[#2B2B2B]">
              <div className="text-5xl mb-6 bg-[#3A3A3A] w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">
                📦
                </div>
               <h3 className="text-xl font-bold mb-3 text-white">
                Quản lý Kho Hàng
                </h3>
              <p className="text-gray-300 leading-relaxed">
                Phân hệ chuyên sâu cho Doanh nghiệp: Nhập/xuất kho, kiểm kê vật tư và theo dõi tình trạng tồn kho tức thì, cảnh báo khi sắp hết hàng.
              </p>
            </div>

            <div className="p-8 border border-gray-700 rounded-3xl shadow-sm hover:shadow-xl hover:bg-[#333333] hover:-translate-y-2 transition duration-300 bg-[#2B2B2B]">
              <div className="text-5xl mb-6 bg-[#3A3A3A] w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm">
                ⚡
                </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Đối soát Tự động
                </h3>
              <p className="text-gray-300 leading-relaxed">
                Tích hợp Webhook SePay độc quyền. Tiền "ting ting" vào tài khoản ngân hàng là hệ thống lập tức tự động ghi nhận doanh thu không trượt phát nào.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center relative z-20">
        <p>© 2026 F.L.O.W System. Phát triển bởi Trần Hà Gia Nghĩa.</p>
      </footer>
    </div>
  );
}