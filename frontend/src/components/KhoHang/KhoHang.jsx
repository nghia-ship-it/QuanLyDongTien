import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KhoHangForm from './KhoHangForm';
import KhoHangTable from './KhoHangTable';

const API_URL = 'https://quanlydongtien.onrender.com/api/khohang';

export default function KhoHang({ token }) {
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); 

  const config = { headers: { 'auth-token': token } };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL, config);
      setList(res.data);
    } catch (err) {
      alert('Lỗi lấy dữ liệu kho hàng!');
    }
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

  const exportCSV = () => {
    let csvContent = "\uFEFFMã,Tên Sản Phẩm,Tồn Kho,Đơn Vị,Giá Nhập,Giá Bán,Ngày Cập Nhật\n";
    list.forEach(r => {
      csvContent += `${r.id},${r.tenSanPham},${r.soLuongTon},${r.donViTinh},${r.giaNhap},${r.giaBan},${r.ngayCapNhat}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `KhoHang_HienTai.csv`;
    link.click();
  };

  const tongGiaTriKho = list.reduce((acc, curr) => acc + (curr.soLuongTon * curr.giaNhap), 0);
  const formatMoney = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="p-6 bg-[#fffbf0] min-h-screen">
      <div className="bg-[#d97706] p-4 rounded-xl text-white shadow-md flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📦 Quản Lý Kho Hàng & Vật Tư</h2>
        <button onClick={() => setSelectedItem(null)} className="bg-gray-800 px-3 py-1 rounded hover:bg-gray-900 font-semibold text-sm transition">
          🔄 Làm mới Form
        </button>
      </div>

      <KhoHangForm 
        token={token} 
        onRefresh={fetchData} 
        selectedItem={selectedItem} 
        clearSelection={() => setSelectedItem(null)} 
        onExport={exportCSV}
      />
      
      <KhoHangTable 
        list={list} 
        onEdit={setSelectedItem} 
        onDelete={handleDelete} 
        tongGiaTriKho={tongGiaTriKho} 
        formatMoney={formatMoney} 
      />
    </div>
  );
}