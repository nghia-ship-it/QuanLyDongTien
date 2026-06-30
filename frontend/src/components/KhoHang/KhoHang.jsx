import React, { useState, useEffect } from 'react';
import axios from 'axios';
import KhoHangForm from './KhoHangForm';
import KhoHangTable from './KhoHangTable';

const API_URL = 'https://quanlydongtien.onrender.com/api/khohang';

export default function KhoHang({ token }) {
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Lưu item đang chọn để sửa

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
      if (selectedItem && selectedItem.id === id) setSelectedItem(null); // Nếu đang chọn xóa luôn thì reset form
      fetchData();
    } catch (err) { alert('Lỗi xóa dữ liệu!'); }
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

      {/* Gọi 2 Component con ra và truyền Props xuống cho tụi nó xài */}
      <KhoHangForm 
        token={token} 
        onRefresh={fetchData} 
        selectedItem={selectedItem} 
        clearSelection={() => setSelectedItem(null)} 
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