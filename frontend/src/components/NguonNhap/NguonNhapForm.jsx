import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_URL = 'https://quanlydongtien.onrender.com/api/nguonnhap';

export default function NguonNhapForm({ token, onRefresh, selectedItem, clearSelection, listNames, onExport }) {
  const [tenNguon, setTenNguon] = useState('');
  const [soTien, setSoTien] = useState('');
  const [ghiChu, setGhiChu] = useState('');
  const [ngayNhap, setNgayNhap] = useState(new Date().toISOString().slice(0, 16));
  const [suggestions, setSuggestions] = useState([]);

  const config = { headers: { 'auth-token': token } };
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedItem) {
      setTenNguon(selectedItem.tenNguon);
      const st = Number(selectedItem.soTien) || 0;
      setSoTien(st > 0 ? st.toLocaleString('vi-VN') : '');
      setGhiChu(selectedItem.ghiChu || '');
      if (selectedItem.ngayNhap) {
        setNgayNhap(String(selectedItem.ngayNhap).replace(' ', 'T').substring(0, 16));
      }
    } else {
      resetForm();
    }
  }, [selectedItem]);

  const resetForm = () => {
    setTenNguon('');
    setSoTien('');
    setGhiChu('');
    setNgayNhap(new Date().toISOString().slice(0, 16));
    setSuggestions([]);
  };

  const handleMoneyChange = (val) => {
    const rawStr = val.replace(/\./g, '');
    if (!rawStr || isNaN(rawStr)) {
      setSoTien(''); setSuggestions([]); return;
    }
    const num = parseInt(rawStr);
    setSoTien(num.toLocaleString('vi-VN'));
    const multipliers = [1000, 10000, 100000, 1000000];
    setSuggestions(multipliers.map(m => (num * m).toLocaleString('vi-VN')));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); 
        
        const formatLocal = (d) => {
          if (!d || isNaN(d.getTime())) return null;
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          const hh = String(d.getHours()).padStart(2, '0');
          const mi = String(d.getMinutes()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd} ${hh}:${mi}:00`;
        };

        const parseDate = (val) => {
          if (!val) return formatLocal(new Date());
          if (val instanceof Date) {
             const loc = formatLocal(val);
             if (loc) return loc;
          }
          if (typeof val === 'number') {
             const d = new Date((val - 25569) * 86400 * 1000);
             const loc = formatLocal(d);
             if (loc) return loc;
          }
          if (typeof val === 'string') {
             const str = val.trim();
             // DD/MM/YYYY
             const match = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
             if (match) {
                const [_, dd, mm, yyyy, hh, mi, ss] = match;
                return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')} ${(hh||'00').padStart(2,'0')}:${(mi||'00').padStart(2,'0')}:${(ss||'00').padStart(2,'0')}`;
             }
             // YYYY-MM-DD
             const match2 = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
             if (match2) {
                const [_, yyyy, mm, dd, hh, mi, ss] = match2;
                return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')} ${(hh||'00').padStart(2,'0')}:${(mi||'00').padStart(2,'0')}:${(ss||'00').padStart(2,'0')}`;
             }
             // Fallback
             const d = new Date(val);
             const loc = formatLocal(d);
             if (loc) return loc;
          }
          return formatLocal(new Date());
        };

        const formattedData = data.map(item => {
          const vals = Object.values(item);
          const rawTen = item['Tên Nguồn'] || item.TenNguon || item.tenNguon || vals[0];
          const rawTien = item['Số Tiền'] || item.SoTien || item.soTien || vals[1];
          const rawGhiChu = item['Ghi Chú'] || item.GhiChu || item.ghiChu || vals[2];
          const rawNgay = item['Ngày Nhập'] || item.NgayNhap || item.ngayNhap || vals[3];

          return {
            tenNguon: String(rawTen || 'Khác').trim(),
            soTien: Number(String(rawTien || 0).replace(/,/g, '')) || 0,
            ghiChu: String(rawGhiChu || '').trim(),
            ngayNhap: parseDate(rawNgay)
          };
        });

        if(formattedData.length === 0) return alert("File rỗng!");
        await axios.post(`${API_URL}/bulk`, { data: formattedData }, config);
        alert(`🎉 Đã nhập thành công ${formattedData.length} khoản chi từ Excel!`);
        clearSelection();
        onRefresh(); 
      } catch (error) { alert('Lỗi file Excel!'); }
      e.target.value = null; 
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawST = parseFloat(soTien.replace(/\./g, '')) || 0;
    if (!tenNguon.trim()) return alert('Vui lòng điền tên nguồn nhập!');
    if (rawST <= 0) return alert('Số tiền nhập không hợp lệ!');

    const payload = {
      tenNguon: tenNguon.trim(),
      soTien: rawST,
      ghiChu: ghiChu.trim(),
      ngayNhap: ngayNhap.replace('T', ' ') + ':00'
    };

    try {
      if (selectedItem) {
        await axios.put(`${API_URL}/${selectedItem.id}`, payload, config);
        alert('Cập nhật thành công!');
      } else {
        await axios.post(API_URL, payload, config);
        alert('Thêm nguồn nhập thành công!');
      }
      clearSelection();
      onRefresh(); 
    } catch (err) { alert('Lỗi lưu dữ liệu!'); }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-blue-100 mb-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày giờ:</label>
          <input type="datetime-local" value={ngayNhap} onChange={(e) => setNgayNhap(e.target.value)} className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên nguồn nhập:</label>
          <input
            type="text"
            list="danhSachTenNguon"
            value={tenNguon}
            onChange={(e) => setTenNguon(e.target.value)}
            placeholder="Ví dụ: Đại lý A, Bán lẻ..."
            className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 font-semibold"
            required
          />
          <datalist id="danhSachTenNguon">
            {listNames.map((name, index) => <option key={index} value={name} />)}
          </datalist>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VND):</label>
          <input type="text" value={soTien} onChange={(e) => handleMoneyChange(e.target.value)} placeholder="Nhập số tiền..." className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500 font-semibold" required />
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 bg-white border shadow-lg rounded mt-1 z-10 p-1 flex flex-wrap gap-1">
              {suggestions.map((s, idx) => (
                <button key={idx} type="button" onClick={() => { setSoTien(s); setSuggestions([]); }} className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded hover:bg-blue-100">{s}</button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú:</label>
          <input type="text" value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="Nhập ghi chú nếu có..." className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500" />
        </div>
        
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-blue-600 text-white font-bold p-2 rounded hover:bg-blue-700 transition shadow cursor-pointer">
            {selectedItem ? '✏️ Cập nhật' : '➕ Thêm'}
          </button>
        </div>
        
        <div className="md:col-span-5 flex justify-end gap-2 mt-2">
          <button type="button" onClick={onExport} className="bg-cyan-600 text-white font-bold p-2 px-4 rounded shadow hover:bg-cyan-700">📤 Xuất CSV</button>
          <input type="file" accept=".xlsx, .xls" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current.click()} className="bg-purple-600 text-white font-bold p-2 px-4 rounded shadow hover:bg-purple-700">📥 Nhập Excel</button>
        </div>
      </form>
    </div>
  );
}