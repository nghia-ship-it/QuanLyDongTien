import React from 'react';

export default function DoanhThuTable({ list, onEdit, onDelete, formatMoney, tongThang, thang }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-white/20">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#14a064] text-white text-sm font-bold uppercase">
              <th className="p-4">Ngày/Giờ Nhập</th>
              <th className="p-4">Tiền Mặt</th>
              <th className="p-4">Chuyển Khoản</th>
              <th className="p-4">Tổng Cộng</th>
              <th className="p-4 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {list.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                  Không có dữ liệu trong tháng này.
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className="hover:bg-emerald-50/80 transition duration-150">
                  <td className="p-4 font-medium">{item.ngayNhap}</td>
                  <td className="p-4 text-emerald-700 font-semibold">{formatMoney(item.tienMat)}</td>
                  <td className="p-4 text-blue-700 font-semibold">{formatMoney(item.chuyenKhoan)}</td>
                  <td className="p-4 font-black text-gray-900 text-lg">{formatMoney(item.tongCong)}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => onEdit(item)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-md transition shadow-sm">
                      Sửa
                    </button>
                    <button onClick={() => onDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-md transition shadow-sm">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-[#14a064] p-5 text-white font-bold flex justify-between items-center text-md shadow-inner">
        <span>Tổng tháng {thang}: <span className="text-yellow-300 text-2xl ml-2">{formatMoney(tongThang)}</span></span>
      </div>
    </div>
  );
}