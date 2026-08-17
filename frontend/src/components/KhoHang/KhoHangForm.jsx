import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_URL = 'https://quanlydongtien.onrender.com/api/khohang';

export default function KhoHangForm({ token, onRefresh, selectedItem, clearSelection, onExport }) {
  const [tenSanPham, setTenSanPham] = useState('');
  const [soLuongTon, setSoLuongTon] = useState('');
  const [donViTinh, setDonViTinh] = useState('Cái');
  const [giaNhap, setGiaNhap] = useState('');
  const [giaBan, setGiaBan] = useState('');
  const [ngayCapNhat, setNgayCapNhat] = useState(new Date().toISOString().slice(0, 16));

  const config = { headers: { 'auth-token': token } };
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedItem) {
      setTenSanPham(selectedItem.tenSanPham);
      setSoLuongTon(selectedItem.soLuongTon ? selectedItem.soLuongTon.toLocaleString('vi-VN') : '0');
      setDonViTinh(selectedItem.donViTinh || 'Cái');
      setGiaNhap(selectedItem.giaNhap ? selectedItem.giaNhap.toLocaleString('vi-VN') : '0');
      setGiaBan(selectedItem.giaBan ? selectedItem.giaBan.toLocaleString('vi-VN') : '0');
      setNgayCapNhat(selectedItem.ngayCapNhat ? selectedItem.ngayCapNhat.replace(' ', 'T').substring(0, 16) : new Date().toISOString().slice(0, 16));
    } else {
      resetForm();
    }
  }, [selectedItem]);

  const resetForm = () => {
    setTenSanPham('');
    setSoLuongTon('');
    setDonViTinh('Cái');
    setGiaNhap('');
    setGiaBan('');
    setNgayCapNhat(new Date().toISOString().slice(0, 16));
  };

  const handleNumberChange = (val, setter) => {
    const rawStr = val.replace(/\./g, '');
    if (!rawStr || isNaN(rawStr)) return setter('');
    setter(parseInt(rawStr).toLocaleString('vi-VN'));
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
            tenSanPham: item['Tên Sản Phẩm'] || item.TenSanPham || vals[0] || 'Sản phẩm mới',
            soLuongTon: Number(item['Số Lượng'] || item.SoLuong || item.soLuongTon || vals[1]) || 0,
            donViTinh: item['Đơn Vị'] || item.DonVi || item.donViTinh || vals[2] || 'Cái',
            giaNhap: Number(item['Giá Nhập'] || item.GiaNhap || item.giaNhap || vals[3]) || 0,
            giaBan: Number(item['Giá Bán'] || item.GiaBan || item.giaBan || vals[4]) || 0,
            ngayCapNhat: item['Ngày Cập Nhật'] || item.NgayCapNhat || vals[5] || new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
        });
        if(formattedData.length === 0) return alert("File rỗng!");
        await axios.post(`${API_URL}/bulk`, { data: formattedData }, config);
        alert(`🎉 Đã nhập thành công ${formattedData.length} sản phẩm từ Excel!`);
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
      tenSanPham: tenSanPham.trim(),
      soLuongTon: parseFloat(soLuongTon.replace(/\./g, '')) || 0,
      donViTinh: donViTinh,
      giaNhap: parseFloat(giaNhap.replace(/\./g, '')) || 0,
      giaBan: parseFloat(giaBan.replace(/\./g, '')) || 0,
      ngayCapNhat: ngayCapNhat.replace('T', ' ') + ':00'
    };

    if (!payload.tenSanPham) return alert('Vui lòng nhập tên sản phẩm!');

    try {
      if (selectedItem) {
        await axios.put(`${API_URL}/${selectedItem.id}`, payload, config);
        alert('Cập nhật kho thành công!');
      } else {
        await axios.post(API_URL, payload, config);
        alert('Thêm mặt hàng mới thành công!');
      }
      clearSelection(); 
      onRefresh();      
    } catch (err) { alert('Lỗi lưu dữ liệu!'); }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-amber-100 mb-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên Hàng Hóa / Sản phẩm:</label>
          <input type="text" value={tenSanPham} onChange={(e) => setTenSanPham(e.target.value)} placeholder="Nhập tên hàng..." className="w-full border rounded p-2 focus:ring-1 focus:ring-amber-500 font-semibold" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn:</label>
          <input type="text" value={soLuongTon} onChange={(e) => handleNumberChange(e.target.value, setSoLuongTon)} className="w-full border rounded p-2 focus:ring-1 focus:ring-amber-500 font-bold text-blue-600" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị:</label>
          <input type="text" value={donViTinh} onChange={(e) => setDonViTinh(e.target.value)} className="w-full border rounded p-2 focus:ring-1 focus:ring-amber-500" placeholder="Cái, Kg, Hộp..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giá Nhập (VND):</label>
          <input type="text" value={giaNhap} onChange={(e) => handleNumberChange(e.target.value, setGiaNhap)} className="w-full border rounded p-2 focus:ring-1 focus:ring-amber-500 font-semibold" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giá Bán (VND):</label>
          <input type="text" value={giaBan} onChange={(e) => handleNumberChange(e.target.value, setGiaBan)} className="w-full border rounded p-2 focus:ring-1 focus:ring-amber-500 font-semibold text-emerald-600" />
        </div>
        
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày cập nhật gần nhất:</label>
          <input type="datetime-local" value={ngayCapNhat} onChange={(e) => setNgayCapNhat(e.target.value)} className="border rounded p-2 focus:ring-1 focus:ring-amber-500 w-full" required />
        </div>
        
        <div className="md:col-span-3 flex gap-2">
          <button type="submit" className="flex-1 bg-amber-600 text-white font-bold p-2 rounded hover:bg-amber-700 transition shadow cursor-pointer">
            {selectedItem ? '✏️ Cập Nhật' : '➕ Nhập Kho'}
          </button>
          <button type="button" onClick={onExport} className="bg-emerald-600 text-white font-bold p-2 px-4 rounded shadow hover:bg-emerald-700">📤 Xuất Excel</button>
          <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current.click()} className="bg-purple-600 text-white font-bold p-2 px-4 rounded shadow hover:bg-purple-700">📥 Nhập Excel</button>
        </div>
      </form>
    </div>
  );
}