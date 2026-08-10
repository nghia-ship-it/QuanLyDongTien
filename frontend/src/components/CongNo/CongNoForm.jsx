import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_URL = 'https://quanlydongtien.onrender.com/api/congno';

export default function CongNoForm({ token, onRefresh, selectedItem, clearSelection, onExport }) {
  const [loaiCongNo, setLoaiCongNo] = useState('khach_no');
  const [tenDoiTac, setTenDoiTac] = useState('');
  const [soTienNo, setSoTienNo] = useState('');
  const [soTienDaTra, setSoTienDaTra] = useState('');
  const [ngayGhiNo, setNgayGhiNo] = useState(new Date().toISOString().slice(0, 10));
  const [ngayHenTra, setNgayHenTra] = useState('');
  const [ghiChu, setGhiChu] = useState('');

  const config = { headers: { 'auth-token': token } };
  const fileInputRef = useRef(null);

  const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
  const isCaNhan = userInfo.loaiTaiKhoan === 'ca_nhan';
  const textKhachNo = isCaNhan ? 'Người ta nợ mình (Phải Thu)' : 'Khách Nợ Mình (Phải Thu)';

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
    setTenDoiTac(''); setSoTienNo(''); setSoTienDaTra('');
    setNgayGhiNo(new Date().toISOString().slice(0, 10));
    setNgayHenTra(''); setGhiChu('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); 
        const formattedData = data.map(item => {
          const vals = Object.values(item);
          return {
            TienNo: Number(item['Tiền Nợ'] || item.TienNo || vals[2]) || 0,
            DaTra: Number(item['Đã Trả'] || item.DaTra || vals[3]) || 0,
            Loai: item['Loại'] || item.Loai || vals[0] || 'khach_no',
            DoiTac: item['Đối Tác'] || item.DoiTac || vals[1] || 'Khách Vãng Lai',
            NgayGhiNo: item['Ngày Ghi Nợ'] || item.NgayGhiNo || vals[4] || new Date().toISOString().slice(0, 10),
            NgayHenTra: item['Ngày Hẹn Trả'] || item.NgayHenTra || vals[5] || '',
            GhiChu: item['Ghi Chú'] || item.GhiChu || vals[6] || ''
          };
        });
        if(formattedData.length === 0) return alert("File rỗng!");
        await axios.post(`${API_URL}/bulk`, { data: formattedData }, config);
        alert(`🎉 Đã nhập thành công ${formattedData.length} khoản nợ từ Excel!`);
        clearSelection();
        onRefresh(); 
      } catch (error) { alert('Lỗi file Excel!'); }
      e.target.value = null; 
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      loaiCongNo, tenDoiTac: tenDoiTac.trim(), soTienNo: Number(soTienNo) || 0,
      soTienDaTra: Number(soTienDaTra) || 0, ngayGhiNo, ngayHenTra, ghiChu: ghiChu.trim()
    };
    if (!payload.tenDoiTac) return alert('Vui lòng nhập tên đối tác!');
    if (payload.soTienNo <= 0) return alert('Số tiền nợ phải lớn hơn 0!');
    
    try {
      if (selectedItem) {
        await axios.put(`${API_URL}/${selectedItem.id}`, payload, config);
        alert('Cập nhật thành công!');
      } else {
        await axios.post(API_URL, payload, config);
        alert('Thêm khoản nợ mới thành công!');
      }
      clearSelection(); onRefresh();
    } catch (err) { alert('Lỗi lưu dữ liệu!'); }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-orange-100 mb-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Loại Công Nợ:</label>
          <select value={loaiCongNo} onChange={(e) => setLoaiCongNo(e.target.value)} className="w-full border rounded p-2 focus:ring-1 focus:ring-orange-500 bg-gray-50 font-bold outline-none">
            <option value="khach_no">{textKhachNo}</option>
            <option value="no_dai_ly">Mình Nợ Người Ta (Phải Trả)</option>
          </select>
        </div>
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên Người Nợ / Chủ Nợ:</label>
          <input type="text" value={tenDoiTac} onChange={(e) => setTenDoiTac(e.target.value)} placeholder="Nhập tên..." className="w-full border rounded p-2 font-semibold outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số Tiền Nợ (VND):</label>
          <input type="number" value={soTienNo} onChange={(e) => setSoTienNo(e.target.value)} placeholder="VD: 50000" className="w-full border rounded p-2 font-bold text-red-600 outline-none" required />
        </div>
        {selectedItem && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đã Trả / Đã Thu (VND):</label>
            <input type="number" value={soTienDaTra} onChange={(e) => setSoTienDaTra(e.target.value)} placeholder="Nhập số tiền..." className="w-full border rounded p-2 font-bold text-emerald-600 outline-none" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Ghi Nợ:</label>
          <input type="date" value={ngayGhiNo} onChange={(e) => setNgayGhiNo(e.target.value)} className="border rounded p-2 w-full outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Hẹn Trả:</label>
          <input type="date" value={ngayHenTra} onChange={(e) => setNgayHenTra(e.target.value)} className="border rounded p-2 w-full outline-none" />
        </div>
        <div className={selectedItem ? "md:col-span-1" : "md:col-span-2"}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ghi Chú:</label>
          <input type="text" value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Nhập ghi chú..." className="w-full border rounded p-2 outline-none" />
        </div>
        
        <div className="md:col-span-4 flex gap-2 mt-2">
          <button type="submit" className="flex-1 bg-orange-600 text-white font-bold p-3 rounded-lg hover:bg-orange-700 transition shadow-md">
            {selectedItem ? '✏️ Lưu Cập Nhật' : '➕ Tạo Khoản Nợ Mới'}
          </button>
          <button type="button" onClick={onExport} className="bg-cyan-600 text-white font-bold p-3 px-4 rounded-lg shadow-md hover:bg-cyan-700">📤 Xuất</button>
          <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current.click()} className="bg-purple-600 text-white font-bold p-3 px-4 rounded-lg shadow-md hover:bg-purple-700">📥 Nhập Excel</button>
        </div>
      </form>
    </div>
  );
}