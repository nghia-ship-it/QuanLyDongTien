import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/doanhthu';

export default function DoanhThu() {
  const [list, setList] = useState([]);
  const [thang, setThang] = useState(new Date().getMonth() + 1);
  const [nam, setNam] = useState(new Date().getFullYear());

  // Form states
  const [selectedId, setSelectedId] = useState(null);
  const [tienMat, setTienMat] = useState('');
  const [chuyenKhoan, setChuyenKhoan] = useState('');
  const [ngayNhap, setNgayNhap] = useState(new Date().toISOString().slice(0, 16));

  // Gợi ý động cho Tiền mặt & Chuyển khoản
  const [suggestionsTM, setSuggestionsTM] = useState([]);
  const [suggestionsCK, setSuggestionsCK] = useState([]);

  useEffect(() => {
    fetchData();
  }, [thang, nam]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}?thang=${thang}&nam=${nam}`);
      setList(res.data);
    } catch (err) {
      alert('Lỗi lấy dữ liệu doanh thu!');
    }
  };

  const formatMoney = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleTextChange = (val, setRaw, setSug) => {
    const rawStr = val.replace(/\./g, '');
    if (!rawStr || isNaN(rawStr)) {
      setRaw('');
      setSug([]);
      return;
    }
    const num = parseInt(rawStr);
    setRaw(num.toLocaleString('vi-VN'));

    // Sinh gợi ý nhân tiền nhanh x1k, x10k, x100k, x1M
    const multipliers = [1000, 10000, 100000, 1000000];
    const sugs = multipliers.map(m => (num * m).toLocaleString('vi-VN'));
    setSug(sugs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawTM = parseFloat(tienMat.replace(/\./g, '')) || 0;
    const rawCK = parseFloat(chuyenKhoan.replace(/\./g, '')) || 0;

    if (rawTM === 0 && rawCK === 0) {
      alert('Vui lòng nhập ít nhất số Tiền mặt hoặc Chuyển khoản!');
      return;
    }

    const payload = {
      tienMat: rawTM,
      chuyenKhoan: rawCK,
      ngayNhap: ngayNhap.replace('T', ' ') + ':00'
    };

    try {
      if (selectedId) {
        await axios.put(`${API_URL}/${selectedId}`, payload);
        alert('Cập nhật thành công!');
      } else {
        await axios.post(API_URL, payload);
        alert('Thêm doanh thu thành công!');
      }
      clearForm();
      fetchData();
    } catch (err) {
      alert('Lỗi xử lý dữ liệu!');
    }
  };

  const handleEdit = (item) => {
    setSelectedId(item.id);
    setTienMat(item.tienMat ? item.tienMat.toLocaleString('vi-VN') : '');
    setChuyenKhoan(item.chuyenKhoan ? item.chuyenKhoan.toLocaleString('vi-VN') : '');
    setNgayNhap(item.ngayNhap.replace(' ', 'T').substring(0, 16));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Mày chắc chắn muốn xóa dòng này không?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert('Đã xóa dòng doanh thu!');
      if (selectedId === id) clearForm();
      fetchData();
    } catch (err) {
      alert('Lỗi xóa dữ liệu!');
    }
  };

  const clearForm = () => {
    setSelectedId(null);
    setTienMat('');
    setChuyenKhoan('');
    setNgayNhap(new Date().toISOString().slice(0, 16));
    setSuggestionsTM([]);
    setSuggestionsCK([]);
  };

  const exportCSV = () => {
    let csvContent = "\uFEFFMã,Ngày Giờ,Tiền Mặt,Chuyển Khoản,Tổng Cộng\n";
    list.forEach(r => {
      csvContent += `${r.id},${r.ngayNhap},${r.tienMat},${r.chuyenKhoan},${r.tongCong}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `DoanhThu_${thang}_${nam}.csv`);
    link.click();
  };

  const tongThang = list.reduce((acc, curr) => acc + curr.tongCong, 0);

  return (
    <div className="p-6 bg-[#f0f8f4] min-h-screen">
      {/* Header */}
      <div className="bg-[#14a064] p-4 rounded-xl text-white shadow-md flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📈 Thông Tin Doanh Thu</h2>
        <div className="flex gap-4 items-center">
          <label className="font-medium">Tháng:</label>
          <select value={thang} onChange={(e) => setThang(e.target.value)} className="text-black p-1 rounded bg-white">
            {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
          </select>
          <label className="font-medium">Năm:</label>
          <select value={nam} onChange={(e) => setNam(e.target.value)} className="text-black p-1 rounded bg-white">
            {Array.from({ length: 5 }, (_, i) => <option key={2024 + i} value={2024 + i}>{2024 + i}</option>)}
          </select>
          <button onClick={clearForm} className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-700 font-semibold text-sm transition">🔄 Làm mới</button>
        </div>
      </div>

      {/* Form Nhập */}
      <div className="bg-white p-5 rounded-xl shadow border border-emerald-100 mb-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày giờ nhập:</label>
            <input type="datetime-local" value={ngayNhap} onChange={(e) => setNgayNhap(e.target.value)} className="w-full border rounded p-2 focus:ring-1 focus:ring-emerald-500" required />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiền mặt (VND):</label>
            <input type="text" value={tienMat} onChange={(e) => handleTextChange(e.target.value, setTienMat, setSuggestionsTM)} placeholder="Nhập số tiền..." className="w-full border rounded p-2 focus:ring-1 focus:ring-emerald-500 font-semibold" />
            {suggestionsTM.length > 0 && (
              <div className="absolute left-0 right-0 bg-white border shadow-lg rounded mt-1 z-10 p-1 flex flex-wrap gap-1">
                {suggestionsTM.map((s, idx) => (
                  <button key={idx} type="button" onClick={() => { setTienMat(s); setSuggestionsTM([]); }} className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded hover:bg-emerald-100">{s}</button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Chuyển khoản (VND):</label>
            <input type="text" value={chuyenKhoan} onChange={(e) => handleTextChange(e.target.value, setChuyenKhoan, setSuggestionsCK)} placeholder="Nhập số tiền..." className="w-full border rounded p-2 focus:ring-1 focus:ring-emerald-500 font-semibold" />
            {suggestionsCK.length > 0 && (
              <div className="absolute left-0 right-0 bg-white border shadow-lg rounded mt-1 z-10 p-1 flex flex-wrap gap-1">
                {suggestionsCK.map((s, idx) => (
                  <button key={idx} type="button" onClick={() => { setChuyenKhoan(s); setSuggestionsCK([]); }} className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded hover:bg-emerald-100">{s}</button>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-emerald-600 text-white font-bold p-2 rounded hover:bg-emerald-700 transition shadow cursor-pointer">
              {selectedId ? '✏️ Sửa' : '➕ Thêm'}
            </button>
            <button type="button" onClick={exportCSV} className="bg-cyan-600 text-white font-bold p-2 rounded hover:bg-cyan-700 transition shadow cursor-pointer">📤 Xuất</button>
          </div>
        </form>
      </div>

      {/* Bảng Dữ Liệu */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#14a064] text-white text-sm font-bold uppercase">
                <th className="p-3">Ngày/Giờ Nhập</th>
                <th className="p-3">Tiền Mặt</th>
                <th className="p-3">Chuyển Khoản</th>
                <th className="p-3">Tổng Cộng</th>
                <th className="p-3 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {list.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-400">Không có dữ liệu trong tháng này.</td></tr>
              ) : (
                list.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/40 transition">
                    <td className="p-3 font-medium">{item.ngayNhap}</td>
                    <td className="p-3 text-emerald-700 font-semibold">{formatMoney(item.tienMat)}</td>
                    <td className="p-3 text-blue-700 font-semibold">{formatMoney(item.chuyenKhoan)}</td>
                    <td className="p-3 font-bold text-gray-900">{formatMoney(item.tongCong)}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button onClick={() => handleEdit(item)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded transition">Sửa</button>
                      <button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded transition">Xóa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Footer Tổng kết */}
        <div className="bg-[#14a064] p-4 text-white font-bold flex justify-between items-center text-md">
          <span>Tổng tháng {thang}: <span className="text-yellow-200 text-lg">{formatMoney(tongThang)}</span></span>
        </div>
      </div>
    </div>
  );
}