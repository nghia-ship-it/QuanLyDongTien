import React, { useState } from 'react';

export default function DoanhThuTable({ listGrouped, detailList, selectedNgay, loadDetailNgay, onEdit, onDelete, tongThang, formatMoney, thang }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      {/* Bảng 1: Tổng hợp theo ngày */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="bg-[#14a064] p-3 border-b text-white font-bold text-sm">📋 Danh sách tổng hợp theo ngày</div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-xs font-bold uppercase border-b">
              <th className="p-3">Ngày</th>
              <th className="p-3">Tổng Thu</th>
              <th className="p-3 text-center">Số Giao Dịch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {listGrouped.length === 0 ? (
              <tr><td colSpan="3" className="p-4 text-center text-gray-500">Không có dữ liệu.</td></tr>
            ) : (
              listGrouped.map((item, idx) => (
                <tr key={idx} onClick={() => loadDetailNgay(item.ngayHienThi, item.ngayGoc)} className={`cursor-pointer transition ${selectedNgay === item.ngayHienThi ? 'bg-emerald-100/70 font-semibold' : 'hover:bg-emerald-50/50'}`}>
                  <td className="p-3">{item.ngayHienThi}</td>
                  <td className="p-3 text-emerald-700 font-bold">{formatMoney(item.tongTienNgay)}</td>
                  <td className="p-3 text-center text-gray-500">{item.soLanGiaoDich} lần</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50 border-t font-bold text-gray-800 text-sm flex justify-between">
          <span>Tổng tiền tháng {thang}:</span>
          <span className="text-emerald-700">{formatMoney(tongThang)}</span>
        </div>
      </div>

      {/* Bảng 2: Chi tiết của ngày được chọn */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="bg-[#14a064] p-3 border-b text-white font-bold text-sm">
          {selectedNgay ? `📅 Chi tiết ngày: ${selectedNgay}` : '👈 Hãy bấm vào một ngày ở bảng bên để xem chi tiết'}
        </div>
        {selectedNgay && (
          <div className="overflow-x-auto w-full pb-4">
            <table className="w-full text-left border-collapse text-sm min-w-[600px] whitespace-nowrap">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs font-bold uppercase border-b">
                  <th className="p-3">Ngày / Giờ</th>
                  <th className="p-3">Tiền Mặt</th>
                  <th className="p-3">Chuyển Khoản</th>
                  <th className="p-3">Tổng Cộng</th>
                  <th className="p-3 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y divide-gray-100">
                {detailList.length === 0 ? (
                  <tr><td colSpan="5" className="p-4 text-center">Không có chi tiết.</td></tr>
                ) : (
                  detailList.map(item => (
                    <tr key={item.id} className="bg-white hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{item.ngayNhap}</td>
                      <td className="p-3 text-emerald-600">{formatMoney(item.tienMat)}</td>
                      <td className="p-3 text-blue-600">{formatMoney(item.chuyenKhoan)}</td>
                      <td className="p-3 font-bold text-gray-900">{formatMoney(item.tongCong)}</td>
                      <td className="p-3 flex justify-center gap-1.5">
                        <button onClick={() => onEdit(item)} className="text-amber-600 hover:text-amber-700 font-bold text-xs px-2 py-1 bg-amber-50 rounded">Sửa</button>
                        <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-700 font-bold text-xs px-2 py-1 bg-red-50 rounded">Xóa</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}