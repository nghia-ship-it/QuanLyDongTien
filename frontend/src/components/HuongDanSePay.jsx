import React, { useState } from 'react';

export default function HuongDanSePay() {
  const [copied, setCopied] = useState(false);
  const webhookUrl = "https://quanlydongtien.onrender.com/api/webhook/sepay";

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  return (
    <div className="p-6 bg-transparent min-h-screen">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">🚀 Tích Hợp Thanh Toán Tự Động</h2>
          <p className="text-gray-500 mt-2">Biến tài khoản ngân hàng của bạn thành máy thu tiền tự động chỉ với 3 bước đơn giản.</p>
        </div>

        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">1</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Tạo tài khoản & Liên kết ngân hàng</h3>
              <p className="text-gray-600 mt-1">
                Truy cập trang web <a href="https://my.sepay.vn" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">my.sepay.vn</a> và đăng ký một tài khoản miễn phí. Sau đó, vào mục <b>Ngân hàng</b> để quét mã QR liên kết tài khoản ngân hàng của bạn vào hệ thống.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">2</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Cấu hình Webhook</h3>
              <p className="text-gray-600 mt-1">
                Trong giao diện SePay, tìm đến menu <b>Tích hợp Webhook</b>. Nhấn "Thêm Webhook" và dán đường link đặc quyền dưới đây của hệ thống vào ô <b>Webhook URL</b>:
              </p>
              
              <div className="mt-3 flex items-center bg-gray-100 p-2 rounded-lg border border-gray-300">
                <code className="flex-1 text-pink-600 font-mono text-sm px-2 overflow-x-auto whitespace-nowrap">
                  {webhookUrl}
                </code>
                <button 
                  onClick={handleCopy}
                  className={`ml-2 px-4 py-2 rounded-md font-bold text-white transition-all ${copied ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  {copied ? '✅ Đã Copy' : '📋 Copy Link'}
                </button>
              </div>
              <p className="text-sm text-amber-600 mt-2 font-medium">
                * Lưu ý: Tích chọn các sự kiện <b>"Giao dịch mới"</b> để hệ thống nhận được thông báo nhé!
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg">3</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Tận hưởng kết quả</h3>
              <p className="text-gray-600 mt-1">
                Lấy điện thoại chuyển thử 1.000đ vào tài khoản ngân hàng của chính bạn. Nếu thấy tiền tự động cộng vào biểu đồ <b>Doanh Thu</b> trên app này, xin chúc mừng, bạn đã setup thành công! 🎉
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}