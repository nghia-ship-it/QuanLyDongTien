import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NguonNhapForm from './NguonNhapForm';
import NguonNhapTable from './NguonNhapTable';

const API_URL = 'https://quanlydongtien.onrender.com/api/nguonnhap';

export default function NguonNhap({ token }) {
  const [listGrouped, setListGrouped] = useState([]);
  const [listNames, setListNames] = useState([]);
  const [thang, setThang] = useState(new Date().getMonth() + 1);
  const [nam, setNam] = useState(new Date().getFullYear());

  const [selectedNgay, setSelectedNgay] = useState(null);
  const [detailList, setDetailList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const config = { headers: { 'auth-token': token } };

  useEffect(() => {
    fetchGroupedData();
    fetchNames();
    setSelectedNgay(null);
    setDetailList([]);
  }, [thang, nam]);

  const fetchGroupedData = async () => {
    try {
      const res = await axios.get(`${API_URL}/grouped?thang=${thang}&nam=${nam}`, config);
      setListGrouped(res.data);
    } catch (err) { alert('Lỗi lấy danh sách gom nhóm ngày!'); }
  };

  const fetchNames = async () => {
    try {
      const res = await axios.get(`${API_URL}/names`, config);
      setListNames(res.data);
    } catch (err) { console.error('Lỗi lấy danh sách tên nguồn!'); }
  };

  const loadDetailNgay = async (ngayHienThi, ngayGoc) => {
    try {
      const res = await axios.get(`${API_URL}/detail?ngay=${ngayGoc}`, config);
      setDetailList(res.data);
      setSelectedNgay(ngayHienThi);
    } catch (err) { alert('Lỗi lấy chi tiết ngày!'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Chắc chắn muốn xóa giao dịch nguồn này?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      alert('Đã xóa dữ liệu thành công!');
      if (selectedItem && selectedItem.id === id) setSelectedItem(null);
      fetchGroupedData();
      setSelectedNgay(null); // Đóng bảng chi tiết sau khi xóa cho an toàn
    } catch (err) { alert('Lỗi xóa dữ liệu!'); }
  };

  const handleRefreshAfterSubmit = () => {
    fetchGroupedData();
    fetchNames();
    setSelectedNgay(null); // Load data mới thì reset chi tiết
  };

  const formatMoney = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  const tongThang = listGrouped.reduce((acc, curr) => acc + curr.tongTienNgay, 0);

  return (
    <div className="p-6 bg-[#f0f4f8] min-h-screen">
      {/* Header */}
      <div className="bg-[#1e78c8] p-4 rounded-xl text-white shadow-md flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-bold">💰 Quản Lý Nguồn Chi Tiêu</h2>
        <div className="flex gap-4 items-center">
          <label className="font-medium">Tháng:</label>
          <select value={thang} onChange={(e) => setThang(e.target.value)} className="text-black p-1 rounded bg-white outline-none">
            {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
          </select>
          <label className="font-medium">Năm:</label>
          <select value={nam} onChange={(e) => setNam(e.target.value)} className="text-black p-1 rounded bg-white outline-none">
            {Array.from({ length: 5 }, (_, i) => <option key={2024 + i} value={2024 + i}>{2024 + i}</option>)}
          </select>
          <button onClick={() => { setSelectedItem(null); fetchGroupedData(); setSelectedNgay(null); }} className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-700 font-semibold text-sm transition">
            🔄 Làm mới
          </button>
        </div>
      </div>

      <NguonNhapForm 
        token={token} 
        onRefresh={handleRefreshAfterSubmit} 
        selectedItem={selectedItem} 
        clearSelection={() => setSelectedItem(null)} 
        listNames={listNames} 
      />

      <NguonNhapTable 
        listGrouped={listGrouped} 
        detailList={detailList} 
        selectedNgay={selectedNgay} 
        loadDetailNgay={loadDetailNgay} 
        onEdit={setSelectedItem} 
        onDelete={handleDelete} 
        tongThang={tongThang} 
        formatMoney={formatMoney} 
      />
    </div>
  );
}