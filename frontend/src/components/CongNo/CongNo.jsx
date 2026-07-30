import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CongNoForm from './CongNoForm';
import CongNoTable from './CongNoTable';

const API_URL = 'https://quanlydongtien.onrender.com/api/congno';

export default function CongNo({ token }) {
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
      alert('Lỗi lấy dữ liệu công nợ!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Chắc chắn muốn xóa khoản nợ này? Dữ liệu sẽ bay vĩnh viễn!')) return;
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      if (selectedItem && selectedItem.id === id) setSelectedItem(null);
      fetchData();
    } catch (err) { alert('Lỗi xóa dữ liệu!'); }
  };

  const formatMoney = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  // Tính tổng để show lên Dashboard mini
  const tongKhachNo = list.filter(i => i.loaiCongNo === 'khach_no').reduce((acc, curr) => acc + (curr.soTienNo - curr.soTienDaTra), 0);
  const tongNoDaiLy = list.filter(i => i.loaiCongNo === 'no_dai_ly').reduce((acc, curr) => acc + (curr.soTienNo - curr.soTienDaTra), 0);

  return (
    <div className="p-6 bg-[#fff7ed] min-h-screen">
      <div className="bg-[#ea580c] p-4 rounded-xl text-white shadow-md flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📒 Quản Lý Công Nợ</h2>
        <button onClick={() => setSelectedItem(null)} className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 font-semibold text-sm transition">
          🔄 Làm mới Form
        </button>
      </div>

      <CongNoForm 
        token={token} 
        onRefresh={fetchData} 
        selectedItem={selectedItem} 
        clearSelection={() => setSelectedItem(null)} 
      />
      
      <CongNoTable 
        list={list} 
        onEdit={setSelectedItem} 
        onDelete={handleDelete} 
        formatMoney={formatMoney}
        tongKhachNo={tongKhachNo}
        tongNoDaiLy={tongNoDaiLy}
      />
    </div>
  );
}