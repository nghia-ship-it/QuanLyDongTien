import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import KhoHangForm from './KhoHangForm';
import KhoHangTable from './KhoHangTable';

const API_URL = 'https://quanlydongtien.onrender.com/api/khohang';

export default function KhoHang({ token }) {
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); 
  const config = { headers: { 'auth-token': token } };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL, config);
      setList(res.data);
    } catch (err) { alert('Lỗi lấy dữ liệu kho hàng!'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Chắc chắn muốn xóa mặt hàng này khỏi kho?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      alert('Đã xóa thành công!');
      if (selectedItem && selectedItem.id === id) setSelectedItem(null); 
      fetchData();
    } catch (err) { alert('Lỗi xóa dữ liệu!'); }
  };

  const exportExcel = () => {
    try {
      if (list.length === 0) return alert('Không có dữ liệu để xuất!');

      const wb = XLSX.utils.book_new();
      const fmtNum = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);

      // --- Sheet 1: Kho Hàng ---
      const headerKH = ['STT', 'Tên Sản Phẩm', 'Tồn Kho', 'Đơn Vị', 'Giá Nhập (VND)', 'Giá Bán (VND)', 'Giá Trị Tồn (VND)', 'Ngày Cập Nhật'];
      const dataKH = list.map((r, i) => [
        i + 1,
        r.tenSanPham,
        r.soLuongTon,
        r.donViTinh,
        fmtNum(r.giaNhap),
        fmtNum(r.giaBan),
        fmtNum(r.soLuongTon * r.giaNhap),
        r.ngayCapNhat || ''
      ]);

      const ws1 = XLSX.utils.aoa_to_sheet([headerKH, ...dataKH]);
      ws1['!cols'] = [{ wch: 5 }, { wch: 24 }, { wch: 10 }, { wch: 8 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(wb, ws1, 'Kho Hàng');

      // --- Sheet 2: Tổng Kết ---
      const tongGiaTriKho = list.reduce((acc, curr) => acc + (curr.soLuongTon * curr.giaNhap), 0);
      const tongGiaTriBan = list.reduce((acc, curr) => acc + (curr.soLuongTon * curr.giaBan), 0);
      const wsTK = XLSX.utils.aoa_to_sheet([
        ['BÁO CÁO KHO HÀNG'],
        [],
        ['Chỉ tiêu', 'Giá trị'],
        ['Tổng số mặt hàng', list.length],
        ['Tổng giá trị kho (theo giá nhập)', fmtNum(tongGiaTriKho) + ' VND'],
        ['Tổng giá trị kho (theo giá bán)', fmtNum(tongGiaTriBan) + ' VND'],
        ['Chênh lệch (Lãi tiềm năng)', fmtNum(tongGiaTriBan - tongGiaTriKho) + ' VND'],
        [],
        ['Ngày xuất báo cáo', new Date().toLocaleDateString('vi-VN')]
      ]);
      wsTK['!cols'] = [{ wch: 34 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, wsTK, 'Tổng Kết');

      const fileName = `BaoCao_KhoHang_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xuất file Excel!');
    }
  };

  const tongGiaTriKho = list.reduce((acc, curr) => acc + (curr.soLuongTon * curr.giaNhap), 0);
  const formatMoney = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="p-6 bg-transparent min-h-screen">
      <div className="bg-[#d97706] p-4 rounded-xl text-white shadow-md flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📦 Quản Lý Kho Hàng & Vật Tư</h2>
        <button onClick={() => setSelectedItem(null)} className="bg-gray-800 px-3 py-1 rounded hover:bg-gray-900 font-semibold text-sm transition">
          🔄 Làm mới Form
        </button>
      </div>

      <KhoHangForm token={token} onRefresh={fetchData} selectedItem={selectedItem} clearSelection={() => setSelectedItem(null)} onExport={exportExcel} />
      <KhoHangTable list={list} onEdit={setSelectedItem} onDelete={handleDelete} tongGiaTriKho={tongGiaTriKho} formatMoney={formatMoney} />
    </div>
  );
}