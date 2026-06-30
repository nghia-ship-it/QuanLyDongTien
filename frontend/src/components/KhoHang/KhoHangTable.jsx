import React from 'react';

export default function KhoHangTable({ list, onEdit, onDelete, tongGiaTriKho, formatMoney }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f59e0b] text-white text-sm font-bold uppercase">
              <th className="p-3">Tên Sản Phẩm</th>
              <th className="p-3 text-center">Tồn Kho</th>
              <th className="p-3">Giá Nhập</th>
              <th className="p-3">Giá Bán</th>
              <th className="p-3">Ngày Cập Nhật</th>
              <th className="p-3 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {list.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-400">Kho đang trống.</td></tr>
            ) : (
              list.map((item) => (
                <tr key={item.id} className="hover:bg-amber-50 transition">
                  <td className="p-3 font-bold text-gray-800">{item.tenSanPham}</td>
                  <td className="p-3 text-center font-black text-blue-600">
                    {item.soLuongTon} <span className="text-xs font-normal text-gray-500">{item.donViTinh}</span>
                  </td>
                  <td className="p-3 font-semibold">{formatMoney(item.giaNhap)}</td>
                  <td className="p-3 font-semibold text-emerald-600">{formatMoney(item.giaBan)}</td>
                  <td className="p-3 text-sm text-gray-500">{item.ngayCapNhat}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button onClick={() => onEdit(item)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded transition">Sửa</button>
                    <button onClick={() => onDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded transition">Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-[#fef3c7] p-4 text-amber-900 font-bold flex justify-between items-center text-md border-t border-amber-200">
        <span>Tổng giá trị tồn kho ước tính: <span className="text-xl ml-2">{formatMoney(tongGiaTriKho)}</span></span>
      </div>
    </div>
  );
}