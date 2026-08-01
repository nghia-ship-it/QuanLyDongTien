import React, { useState, useMemo } from 'react';

export default function NguonNhapTable({ listGrouped, detailList, selectedNgay, loadDetailNgay, onEdit, onDelete, tongThang, formatMoney }) {
  const [expandedGroup, setExpandedGroup] = useState(null);

  // Thuật toán gom nhóm detailList theo TenNguon nằm gọn trong đây
  const groupedDetails = useMemo(() => {
    return detailList.reduce((acc, item) => {
      if (!acc[item.tenNguon]) {
        acc[item.tenNguon] = { total: 0, items: [] };
      }
      acc[item.tenNguon].items.push(item);
      acc[item.tenNguon].total += item.soTien;
      return acc;
    }, {});
  }, [detailList]);

  const toggleGroup = (name) => {
    setExpandedGroup(expandedGroup === name ? null : name);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bảng 1: Tổng hợp theo ngày */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="bg-[#e1ebfa] p-3 border-b text-blue-800 font-bold text-sm">📋 Danh sách tổng hợp theo ngày</div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-xs font-bold uppercase border-b">
              <th className="p-3">Ngày</th>
              <th className="p-3">Tổng Tiền Chi</th>
              <th className="p-3 text-center">Số Giao Dịch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {listGrouped.map((item, idx) => (
              <tr key={idx} onClick={() => { loadDetailNgay(item.ngayHienThi, item.ngayGoc); setExpandedGroup(null); }} className={`cursor-pointer transition ${selectedNgay === item.ngayHienThi ? 'bg-blue-100/70 font-semibold' : 'hover:bg-blue-50/50'}`}>
                <td className="p-3">{item.ngayHienThi}</td>
                <td className="p-3 text-blue-700 font-bold">{formatMoney(item.tongTienNgay)}</td>
                <td className="p-3 text-center text-gray-500">{item.soLanGiaoDich} lần</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50 border-t font-bold text-gray-800 text-sm">Tổng tiền tháng: {formatMoney(tongThang)}</div>
      </div>

      {/* Bảng 2: Chi tiết của ngày được chọn */}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
        <div className="bg-emerald-50 p-3 border-b text-emerald-800 font-bold text-sm">
          {selectedNgay ? `📅 Chi tiết ngày: ${selectedNgay}` : '👈 Hãy bấm vào một ngày ở bảng bên để xem chi tiết'}
        </div>
        {selectedNgay && (
          <div className="overflow-x-auto w-full pb-4">
          <table className="w-full text-left border-collapse text-sm min-w-[600px] whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-xs font-bold uppercase border-b">
                <th className="p-3 w-10 text-center">#</th>
                <th className="p-3">Tên Nguồn / Giờ</th>
                <th className="p-3">Số Tiền</th>
                <th className="p-3">Ghi Chú</th>
                <th className="p-3 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {Object.entries(groupedDetails).map(([name, group]) => (
                <React.Fragment key={name}>
                  <tr onClick={() => toggleGroup(name)} className="bg-blue-50 cursor-pointer border-b border-blue-100 hover:bg-blue-100 transition">
                    <td className="p-3 text-center">{expandedGroup === name ? '👇' : '👉'}</td>
                    <td className="p-3 font-bold text-gray-800">
                      {name} <span className="text-xs text-gray-500 font-normal ml-1">({group.items.length} gd)</span>
                    </td>
                    <td className="p-3 text-blue-700 font-bold">{formatMoney(group.total)}</td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                  </tr>

                  {expandedGroup === name && group.items.map(item => (
                    <tr key={item.id} className="bg-white hover:bg-gray-50 border-b border-gray-50">
                      <td className="p-3"></td>
                      <td className="p-3 pl-8 font-medium text-gray-400">↳ {item.ngayNhap.split(' ')[1]}</td>
                      <td className="p-3 text-emerald-600 font-semibold">{formatMoney(item.soTien)}</td>
                      <td className="p-3 text-xs max-w-[100px] truncate">{item.ghiChu || '-'}</td>
                      <td className="p-3 flex justify-center gap-1.5">
                        <button onClick={() => onEdit(item)} className="text-amber-600 hover:text-amber-700 font-bold text-xs px-2 py-1 bg-amber-50 rounded">Sửa</button>
                        <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-700 font-bold text-xs px-2 py-1 bg-red-50 rounded">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}