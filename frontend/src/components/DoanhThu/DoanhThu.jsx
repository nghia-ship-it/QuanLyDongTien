import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  const exportCSV = () => {
    let csvContent = "\uFEFFMã,Ngày Giờ,Tiền Mặt,Chuyển Khoản,Tổng Cộng\n";
    list.forEach(r => {
      csvContent += `${r.id},${r.ngayNhap},${r.tienMat},${r.chuyenKhoan},${r.tongCong}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `DoanhThu_${thang}_${nam}.csv`;
    link.click();
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
        onExport={exportCSV} 
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