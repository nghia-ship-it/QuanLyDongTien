import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import CongNoForm from './CongNoForm';
import CongNoTable from './CongNoTable';

const API_URL = 'https://quanlydongtien.onrender.com/api/congno';

export default function CongNo({ token }) {
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const config = { headers: { 'auth-token': token } };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL, config);
      setList(res.data);
    } catch (err) { alert('Lỗi lấy dữ liệu công nợ!'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Chắc chắn muốn xóa khoản nợ này? Dữ liệu sẽ bay vĩnh viễn!')) return;
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      if (selectedItem && selectedItem.id === id) setSelectedItem(null);
      fetchData();
    } catch (err) { alert('Lỗi xóa dữ liệu!'); }
  };

  const exportExcel = () => {
    try {
      if (list.length === 0) return alert('Không có dữ liệu để xuất!');

      const wb = XLSX.utils.book_new();
      const fmtNum = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);

      const buildSheet = (data, sheetName) => {
        const header = ['STT', 'Tên Đối Tác', 'Tiền Nợ (VND)', 'Đã Trả (VND)', 'Còn Lại (VND)', 'Trạng Thái', 'Ngày Ghi Nợ', 'Ngày Hẹn Trả', 'Ghi Chú'];
        const rows = data.map((r, i) => [
          i + 1,
          r.tenDoiTac,
          fmtNum(r.soTienNo),
          fmtNum(r.soTienDaTra),
          fmtNum(r.soTienNo - r.soTienDaTra),
          r.trangThai,
          r.ngayGhiNo || '',
          r.ngayHenTra || '',
          r.ghiChu || ''
        ]);
        const tongNo = data.reduce((a, c) => a + (c.soTienNo || 0), 0);
        const tongTra = data.reduce((a, c) => a + (c.soTienDaTra || 0), 0);
        rows.push(['', 'TỔNG CỘNG', fmtNum(tongNo), fmtNum(tongTra), fmtNum(tongNo - tongTra), '', '', '', '']);

        const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
        ws['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      };

      // --- Sheet 1: Phải Thu (Khách Nợ) ---
      const khachNo = list.filter(i => i.loaiCongNo === 'khach_no');
      buildSheet(khachNo, 'Phải Thu (Khách Nợ)');

      // --- Sheet 2: Phải Trả (Nợ Đại Lý) ---
      const noDaiLy = list.filter(i => i.loaiCongNo === 'no_dai_ly');
      buildSheet(noDaiLy, 'Phải Trả (Nợ Đại Lý)');

      // --- Sheet 3: Tổng Kết ---
      const tongKhachNo = khachNo.reduce((a, c) => a + (c.soTienNo - c.soTienDaTra), 0);
      const tongNoDaiLy = noDaiLy.reduce((a, c) => a + (c.soTienNo - c.soTienDaTra), 0);
      const wsTK = XLSX.utils.aoa_to_sheet([
        ['BÁO CÁO CÔNG NỢ'],
        [],
        ['Chỉ tiêu', 'Giá trị'],
        ['Tổng Phải Thu (Khách Nợ)', fmtNum(tongKhachNo) + ' VND'],
        ['Số khoản phải thu', khachNo.length],
        ['Tổng Phải Trả (Nợ Đại Lý)', fmtNum(tongNoDaiLy) + ' VND'],
        ['Số khoản phải trả', noDaiLy.length],
        [],
        ['Chênh lệch (Thu - Trả)', fmtNum(tongKhachNo - tongNoDaiLy) + ' VND'],
        [],
        ['Ngày xuất báo cáo', new Date().toLocaleDateString('vi-VN')]
      ]);
      wsTK['!cols'] = [{ wch: 30 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, wsTK, 'Tổng Kết');

      const fileName = `BaoCao_CongNo_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xuất file Excel!');
    }
  };

  const formatMoney = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
  const tongKhachNo = list.filter(i => i.loaiCongNo === 'khach_no').reduce((acc, curr) => acc + (curr.soTienNo - curr.soTienDaTra), 0);
  const tongNoDaiLy = list.filter(i => i.loaiCongNo === 'no_dai_ly').reduce((acc, curr) => acc + (curr.soTienNo - curr.soTienDaTra), 0);

  return (
    <div className="p-6 bg-transparent min-h-screen">
      <div className="bg-[#ea580c] p-4 rounded-xl text-white shadow-md flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📒 Quản Lý Công Nợ</h2>
        <button onClick={() => setSelectedItem(null)} className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 font-semibold text-sm transition">
          🔄 Làm mới Form
        </button>
      </div>
      <CongNoForm token={token} onRefresh={fetchData} selectedItem={selectedItem} clearSelection={() => setSelectedItem(null)} onExport={exportExcel} />
      <CongNoTable list={list} onEdit={setSelectedItem} onDelete={handleDelete} formatMoney={formatMoney} tongKhachNo={tongKhachNo} tongNoDaiLy={tongNoDaiLy} />
    </div>
  );
}