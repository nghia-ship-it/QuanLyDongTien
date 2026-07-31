import React from 'react';

export default function CongNoTable({ list, onEdit, onDelete, formatMoney, tongKhachNo, tongNoDaiLy }) {
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
  const isCaNhan = userInfo.loaiTaiKhoan === 'ca_nhan';
  
  const textTongKhachNo = isCaNhan ? 'TỔNG NGƯỜI TA NỢ (Phải Thu)' : 'TỔNG KHÁCH ĐANG NỢ (Phải Thu)';
  const textBadgeKhachNo = isCaNhan ? 'Người Ta Nợ Mình' : 'Khách Nợ Mình';

  const getStatusStyle = (status) => {
    if (status === 'Đã hoàn tất') return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    if (status === 'Thanh toán một phần') return 'bg-blue-100 text-blue-700 border border-blue-200';
    return 'bg-red-100 text-red-700 border border-red-200';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl border-l-8 border-emerald-500 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-bold text-sm mb-1">{textTongKhachNo}</p>
            <h3 className="text-3xl font-black text-emerald-600">{formatMoney(tongKhachNo)}</h3>
          </div>
          <div className="text-4xl opacity-80">🤑</div>
        </div>
        <div className="bg-white p-5 rounded-xl border-l-8 border-red-500 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 font-bold text-sm mb-1">TỔNG MÌNH ĐANG NỢ (Phải Trả)</p>
            <h3 className="text-3xl font-black text-red-600">{formatMoney(tongNoDaiLy)}</h3>
          </div>
          <div className="text-4xl opacity-80">💸</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto w-full pb-4">
          <table className="w-full text-left border-collapse min-w-[800px] whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm font-bold uppercase border-b">
                <th className="p-4">Đối Tác</th>
                <th className="p-4 text-right">Tổng Tiền Nợ</th>
                <th className="p-4 text-right">Đã Trả / Thu</th>
                <th className="p-4 text-right">Còn Lại</th>
                <th className="p-4 text-center">Trạng Thái</th>
                <th className="p-4 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {list.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400 font-medium">Chưa có dữ liệu công nợ nào.</td></tr>
              ) : (
                list.map((item) => (
                  <tr key={item.id} className="hover:bg-orange-50/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-lg">{item.tenDoiTac}</div>
                      <div className="mt-1">
                        {item.loaiCongNo === 'khach_no' ? (
                          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-bold border border-emerald-200">{textBadgeKhachNo}</span>
                        ) : (
                          <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs font-bold border border-red-200">Mình Nợ Người Ta</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-2 font-medium">Ghi nợ: {item.ngayGhiNo.split('-').reverse().join('/')}</div>
                    </td>
                    <td className="p-4 text-right font-semibold text-gray-600">{formatMoney(item.soTienNo)}</td>
                    <td className="p-4 text-right font-semibold text-emerald-600">{formatMoney(item.soTienDaTra)}</td>
                    <td className="p-4 text-right font-black text-red-600 text-lg">{formatMoney(item.soTienNo - item.soTienDaTra)}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(item.trangThai)}`}>{item.trangThai}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => onEdit(item)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-2 rounded transition">Trả Nợ</button>
                        <button onClick={() => onDelete(item.id)} className="bg-gray-200 hover:bg-red-600 hover:text-white text-gray-600 font-bold text-xs px-3 py-2 rounded transition">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}