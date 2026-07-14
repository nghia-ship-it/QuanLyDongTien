import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_URL = 'https://quanlydongtien.onrender.com/api/doanhthu';

export default function DoanhThuForm({ token, onRefresh, selectedItem, clearSelection, onExport }) {
  const [tienMat, setTienMat] = useState('');
  const [chuyenKhoan, setChuyenKhoan] = useState('');
  const [ngayNhap, setNgayNhap] = useState(new Date().toISOString().slice(0, 16));

  const [suggestionsTM, setSuggestionsTM] = useState([]);
  const [suggestionsCK, setSuggestionsCK] = useState([]);
  
  const fileInputRef = useRef(null); 
  const config = { headers: { 'auth-token': token } };

  // Lắng nghe cha truyền data xuống để sửa
  useEffect(() => {
    if (selectedItem) {
      setTienMat(selectedItem.tienMat ? selectedItem.tienMat.toLocaleString('vi-VN') : '');
      setChuyenKhoan(selectedItem.chuyenKhoan ? selectedItem.chuyenKhoan.toLocaleString('vi-VN') : '');
      setNgayNhap(selectedItem.ngayNhap.replace(' ', 'T').substring(0, 16));
    } else {
      resetForm();
    }
  }, [selectedItem]);

  const resetForm = () => {
    setTienMat('');
    setChuyenKhoan('');
    setNgayNhap(new Date().toISOString().slice(0, 16));
    setSuggestionsTM([]);
    setSuggestionsCK([]);
  };

  const handleTextChange = (val, setRaw, setSug) => {
    const rawStr = val.replace(/\./g, '');
    if (!rawStr || isNaN(rawStr)) {
      setRaw(''); setSug([]); return;
    }
    const num = parseInt(rawStr);
    setRaw(num.toLocaleString('vi-VN'));
    const multipliers = [1000, 10000, 100000, 1000000];
    setSug(multipliers.map(m => (num * m).toLocaleString('vi-VN')));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawTM = parseFloat(tienMat.replace(/\./g, '')) || 0;
    const rawCK = parseFloat(chuyenKhoan.replace(/\./g, '')) || 0;

    if (rawTM === 0 && rawCK === 0) return alert('Vui lòng nhập số tiền!');

    const payload = {
      tienMat: rawTM,
      chuyenKhoan: rawCK,
      ngayNhap: ngayNhap.replace('T', ' ') + ':00'
    };

    try {
      if (selectedItem) {
        await axios.put(`${API_URL}/${selectedItem.id}`, payload, config);
        alert('Cập nhật thành công!');
      } else {
        await axios.post(API_URL, payload, config);
        alert('Thêm doanh thu thành công!');
      }
      clearSelection();
      onRefresh();
    } catch (err) { alert('Lỗi xử lý dữ liệu!'); }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0]; 
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws); 
        
        const formattedData = data.map(row => ({
          ngayNhap: row.NgayNhap || row['Ngày Nhập'] || '',
          tienMat: Number(row.TienMat || row['Tiền Mặt']) || 0,
          chuyenKhoan: Number(row.ChuyenKhoan || row['Chuyển Khoản']) || 0,
        }));

        if(formattedData.length === 0) return alert("File rỗng hoặc sai định dạng cột!");

        await axios.post(`${API_URL}/bulk`, { data: formattedData }, config);
        alert(`🎉 Đã nhập thành công ${formattedData.length} dòng từ Excel!`);
        clearSelection();
        onRefresh(); 
      } catch (error) {
        console.error(error);
        alert('Lỗi đọc file Excel! Đảm bảo file có cột: NgayNhap, TienMat, ChuyenKhoan');
      }
      e.target.value = null; 
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-emerald-100 mb-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày giờ nhập:</label>
          <input type="datetime-local" value={ngayNhap} onChange={(e) => setNgayNhap(e.target.value)} className="w-full border rounded p-2 focus:ring-1 focus:ring-emerald-500" required />
        </div>
        
        <div className="relative md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiền mặt (VND):</label>
          <input type="text" value={tienMat} onChange={(e) => handleTextChange(e.target.value, setTienMat, setSuggestionsTM)} placeholder="Nhập số tiền..." className="w-full border rounded p-2 focus:ring-1 focus:ring-emerald-500 font-semibold" />
          {suggestionsTM.length > 0 && (
            <div className="absolute left-0 right-0 bg-white border shadow-lg rounded mt-1 z-10 p-1 flex flex-wrap gap-1">
              {suggestionsTM.map((s, idx) => <button key={idx} type="button" onClick={() => { setTienMat(s); setSuggestionsTM([]); }} className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded hover:bg-emerald-100">{s}</button>)}
            </div>
          )}
        </div>

        <div className="relative md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Chuyển khoản (VND):</label>
          <input type="text" value={chuyenKhoan} onChange={(e) => handleTextChange(e.target.value, setChuyenKhoan, setSuggestionsCK)} placeholder="Nhập số tiền..." className="w-full border rounded p-2 focus:ring-1 focus:ring-emerald-500 font-semibold" />
          {suggestionsCK.length > 0 && (
            <div className="absolute left-0 right-0 bg-white border shadow-lg rounded mt-1 z-10 p-1 flex flex-wrap gap-1">
              {suggestionsCK.map((s, idx) => <button key={idx} type="button" onClick={() => { setChuyenKhoan(s); setSuggestionsCK([]); }} className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded hover:bg-emerald-100">{s}</button>)}
            </div>
          )}
        </div>
        
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold p-2 rounded hover:bg-emerald-700 transition shadow">
            {selectedItem ? '✏️ Sửa' : '➕ Thêm'}
          </button>
          
          <button type="button" onClick={onExport} className="bg-cyan-600 text-white font-bold p-2 px-3 rounded hover:bg-cyan-700 transition shadow">
            📤 Xuất
          </button>
          
          {/* Nút Nhập Excel Ẩn */}
          <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current.click()} className="bg-purple-600 text-white font-bold p-2 px-3 rounded hover:bg-purple-700 transition shadow">
            📥 Nhập Excel
          </button>
        </div>
      </form>
    </div>
  );
}