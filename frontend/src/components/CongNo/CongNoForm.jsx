import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://quanlydongtien.onrender.com/api/congno';

export default function CongNoForm({ token, onRefresh, selectedItem, clearSelection }) {
  const [loaiCongNo, setLoaiCongNo] = useState('khach_no');
  const [tenDoiTac, setTenDoiTac] = useState('');
  const [soTienNo, setSoTienNo] = useState('');
  const [soTienDaTra, setSoTienDaTra] = useState('');
  const [ngayGhiNo, setNgayGhiNo] = useState(new Date().toISOString().slice(0, 10));
  const [ngayHenTra, setNgayHenTra] = useState('');
  const [ghiChu, setGhiChu] = useState('');

  const config = { headers: { 'auth-token': token } };

  useEffect(() => {
    if (selectedItem) {
      setLoaiCongNo(selectedItem.loaiCongNo);
      setTenDoiTac(selectedItem.tenDoiTac);
      setSoTienNo(selectedItem.soTienNo || '');
      setSoTienDaTra(selectedItem.soTienDaTra || '');
      setNgayGhiNo(selectedItem.ngayGhiNo || new Date().toISOString().slice(0, 10));
      setNgayHenTra(selectedItem.ngayHenTra || '');
      setGhiChu(selectedItem.ghiChu || '');
    } else {
      resetForm();
    }
  }, [selectedItem]);

  const resetForm = () => {
    setLoaiCongNo('khach_no');
    setTenDoiTac('');
    setSoTienNo('');
    setSoTienDaTra('');
    setNgayGhiNo(new Date().toISOString().slice(0, 10));
    setNgayHenTra('');
    setGhiChu('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      loaiCongNo,
      tenDoiTac: tenDoiTac.trim(),
      soTienNo: Number(soTienNo) || 0,
      soTienDaTra: Number(soTienDaTra) || 0,
      ngayGhiNo,
      ngayHenTra,
      ghiChu: ghiChu.trim()
    };

    if (!payload.tenDoiTac) return alert('Vui lòng nhập tên đối tác!');
    if (payload.soTienNo <= 0) return alert('Số tiền nợ phải lớn hơn 0!');
    if (payload.soTienDaTra > payload.soTienNo) return alert('Tiền trả không được lố tiền nợ nha sếp!');

    try {
      if (selectedItem) {
        await axios.put(`${API_URL}/${selectedItem.id}`, payload, config);
        alert('Cập nhật công nợ thành công!');
      } else {
        await axios.post(API_URL, payload, config);
        alert('Thêm khoản nợ mới thành công!');
      }
      clearSelection();
      onRefresh();
    } catch (err) { alert('Lỗi lưu dữ liệu!'); }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-orange-100 mb-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại Công Nợ:</label>
          <select value={loaiCongNo} onChange={(e) => setLoaiCongNo(e.target.value)} className="w-full border rounded p-2 focus:ring-1 focus:ring-orange-500 bg-gray-50 font-bold outline-none">
            <option value="khach_no">Khách Nợ Mình (Phải Thu)</option>
            <option value="no_dai_ly">Mình Nợ Người Ta (Phải Trả)</option>
          </select>
        </div>
        
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên Người Nợ / Chủ Nợ:</label>
          <input type="text" value={tenDoiTac} onChange={(e) => setTenDoiTac(e.target.value)} placeholder="Nhập tên..." className="w-full border rounded p-2 focus:ring-1 focus:ring-orange-500 font-semibold outline-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số Tiền Nợ (VND):</label>
          {/* Nhập số bình thường, không format */}
          <input type="number" value={soTienNo} onChange={(e) => setSoTienNo(e.target.value)} placeholder="VD: 50000" className="w-full border rounded p-2 focus:ring-1 focus:ring-orange-500 font-bold text-red-600 outline-none" required />
        </div>

        {selectedItem && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đã Trả / Đã Thu (VND):</label>
            <input type="number" value={soTienDaTra} onChange={(e) => setSoTienDaTra(e.target.value)} placeholder="Nhập số tiền đã trả..." className="w-full border rounded p-2 focus:ring-1 focus:ring-orange-500 font-bold text-emerald-600 outline-none" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Ghi Nợ:</label>
          <input type="date" value={ngayGhiNo} onChange={(e) => setNgayGhiNo(e.target.value)} className="border rounded p-2 focus:ring-1 focus:ring-orange-500 w-full outline-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Hẹn Trả (Nếu có):</label>
          <input type="date" value={ngayHenTra} onChange={(e) => setNgayHenTra(e.target.value)} className="border rounded p-2 focus:ring-1 focus:ring-orange-500 w-full outline-none" />
        </div>

        <div className={selectedItem ? "md:col-span-1" : "md:col-span-2"}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ghi Chú:</label>
          <input type="text" value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Nhập ghi chú..." className="w-full border rounded p-2 focus:ring-1 focus:ring-orange-500 outline-none" />
        </div>
        
        <div className="md:col-span-4 flex gap-2 mt-2">
          <button type="submit" className="w-full bg-orange-600 text-white font-bold p-3 rounded-lg hover:bg-orange-700 transition shadow-md">
            {selectedItem ? '✏️ Lưu Cập Nhật (Ghi nhận Trả nợ)' : '➕ Tạo Khoản Nợ Mới'}
          </button>
        </div>
      </form>
    </div>
  );
}