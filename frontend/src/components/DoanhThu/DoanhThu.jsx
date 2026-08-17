import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import DoanhThuForm from './DoanhThuForm';
import DoanhThuTable from './DoanhThuTable';

const API_URL = 'https://quanlydongtien.onrender.com/api/doanhthu';

export default function DoanhThu({ token }) { 
  const [list, setList] = useState([]);
  const [thang, setThang] = useState(new Date().getMonth() + 1);
  const [nam, setNam] = useState(new Date().getFullYear());
  const [selectedItem, setSelectedItem] = useState(null);

  const config = { headers: { 'auth-token': token } };

  useEffect(() => {
    fetchData();
  }, [thang, nam]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}?thang=${thang}&nam=${nam}`, config);
      setList(res.data);
    } catch (err) {
      alert('Lỗi lấy dữ liệu doanh thu!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Chắc chắn muốn xóa?')) return;
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

      // --- Sheet 1: Doanh Thu Chi Tiết ---
      const tongTM = list.reduce((a, c) => a + (c.tienMat || 0), 0);
      const tongCK = list.reduce((a, c) => a + (c.chuyenKhoan || 0), 0);
      const tongTC = list.reduce((a, c) => a + (c.tongCong || 0), 0);

      const headerDT = ['STT', 'Ngày Giờ', 'Tiền Mặt (VND)', 'Chuyển Khoản (VND)', 'Tổng Cộng (VND)'];
      const dataDT = list.map((r, i) => [
        i + 1,
        r.ngayNhap,
        fmtNum(r.tienMat),
        fmtNum(r.chuyenKhoan),
        fmtNum(r.tongCong)
      ]);
      dataDT.push(['', 'TỔNG CỘNG', fmtNum(tongTM), fmtNum(tongCK), fmtNum(tongTC)]);

      const ws1 = XLSX.utils.aoa_to_sheet([headerDT, ...dataDT]);
      ws1['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 18 }, { wch: 20 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(wb, ws1, 'Doanh Thu');

      // --- Sheet 2: Tổng Kết ---
      const wsTK = XLSX.utils.aoa_to_sheet([
        [`BÁO CÁO DOANH THU THÁNG ${thang}/${nam}`],
        [],
        ['Chỉ tiêu', 'Giá trị (VND)'],
        ['Tổng Tiền Mặt', fmtNum(tongTM)],
        ['Tổng Chuyển Khoản', fmtNum(tongCK)],
        ['Tổng Doanh Thu', fmtNum(tongTC)],
        ['Số giao dịch', list.length],
        [],
        ['Ngày xuất báo cáo', new Date().toLocaleDateString('vi-VN')]
      ]);
      wsTK['!cols'] = [{ wch: 22 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, wsTK, 'Tổng Kết');

      const fileName = `BaoCao_DoanhThu_Thang${thang}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xuất file Excel!');
    }
  };

  const formatMoney = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  const tongThang = list.reduce((acc, curr) => acc + curr.tongCong, 0);

  return (
    <div className="p-6 bg-transparent min-h-screen">
      {/* Header Điều khiển Tháng/Năm */}
      <div className="bg-[#14a064] p-4 rounded-xl text-white shadow-md flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📈 Thông Tin Doanh Thu</h2>
        <div className="flex gap-4 items-center">
          <label className="font-medium">Tháng:</label>
          <select value={thang} onChange={(e) => setThang(e.target.value)} className="text-black p-1 rounded bg-white outline-none">
            {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
          </select>
          
          <label className="font-medium">Năm:</label>
          <select value={nam} onChange={(e) => setNam(e.target.value)} className="text-black p-1 rounded bg-white outline-none">
            {Array.from({ length: 5 }, (_, i) => <option key={2024 + i} value={2024 + i}>{2024 + i}</option>)}
          </select>
          
          <button onClick={() => setSelectedItem(null)} className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-700 transition font-medium text-sm">
            🔄 Làm mới Form
          </button>
        </div>
      </div>

      {/* Gọi 2 component con lên */}
      <DoanhThuForm 
        token={token} 
        onRefresh={fetchData} 
        selectedItem={selectedItem} 
        clearSelection={() => setSelectedItem(null)} 
        onExport={exportExcel} 
      />

      <DoanhThuTable 
        list={list} 
        onEdit={setSelectedItem} 
        onDelete={handleDelete} 
        formatMoney={formatMoney} 
        tongThang={tongThang} 
        thang={thang} 
      />
    </div>
  );
}