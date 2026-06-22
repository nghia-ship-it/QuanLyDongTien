import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/nguonnhap';

export default function NguonNhap() {
  const [listGrouped, setListGrouped] = useState([]);
  const [listNames, setListNames] = useState([]); // Danh sách tên nguồn gợi ý
  const [thang, setThang] = useState(new Date().getMonth() + 1);
  const [nam, setNam] = useState(new Date().getFullYear());
  
  // Chi tiết theo ngày được chọn
  const [selectedNgay, setSelectedNgay] = useState(null);
  const [detailList, setDetailList] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null); // Trạng thái mở/gập nhóm tên

  // Form input
  const [selectedId, setSelectedId] = useState(null);
  const [tenNguon, setTenNguon] = useState('');
  const [soTien, setSoTien] = useState('');
  const [ghiChu, setGhiChu] = useState('');
  const [ngayNhap, setNgayNhap] = useState(new Date().toISOString().slice(0, 16));
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchGroupedData();
    fetchNames(); // Tải danh sách tên nguồn lúc mới vào
    setSelectedNgay(null);
    setDetailList([]);
    setExpandedGroup(null);
  }, [thang, nam]);

  const fetchGroupedData = async () => {
    try {
      const res = await axios.get(`${API_URL}/grouped?thang=${thang}&nam=${nam}`);
      setListGrouped(res.data);
    } catch (err) {
      alert('Lỗi lấy danh sách gom nhóm ngày!');
    }
  };

  const fetchNames = async () => {
    try {
      const res = await axios.get(`${API_URL}/names`);
      setListNames(res.data);
    } catch (err) {
      console.error('Lỗi lấy danh sách tên nguồn!');
    }
  };

  const loadDetailNgay = async (ngayHienThi, ngayGoc) => {
    try {
      const res = await axios.get(`${API_URL}/detail?ngay=${ngayGoc}`);
      setDetailList(res.data);
      setSelectedNgay(ngayHienThi);
      setExpandedGroup(null); // Reset trạng thái gập/mở khi chuyển ngày khác
    } catch (err) {
      alert('Lỗi lấy chi tiết ngày!');
    }
  };

  // Thuật toán gom nhóm detailList theo TenNguon
  const groupedDetails = useMemo(() => {
    return detailList.reduce((acc, item) => {
      if (!acc[item.tenNguon]) {
        acc[item.tenNguon] = { total: 0, items: [] };
      }
      acc[item.tenNguon].items.push(item);
      acc[item.tenNguon].total += item.soTien;
      return acc;
    }, {});
  }, [detailList]);

  const toggleGroup = (name) => {
    setExpandedGroup(expandedGroup === name ? null : name);
  };

  const formatMoney = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const handleMoneyChange = (val) => {
    const rawStr = val.replace(/\./g, '');
    if (!rawStr || isNaN(rawStr)) {
      setSoTien('');
      setSuggestions([]);
      return;
    }
    const num = parseInt(rawStr);
    setSoTien(num.toLocaleString('vi-VN'));

    const multipliers = [1000, 10000, 100000, 1000000];
    setSuggestions(multipliers.map(m => (num * m).toLocaleString('vi-VN')));
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
      if (selectedId) {
        await axios.put(`${API_URL}/${selectedId}`, payload);
        alert('Cập nhật thành công!');
      } else {
        await axios.post(API_URL, payload);
        alert('Thêm nguồn nhập thành công!');
      }
      clearForm();
      fetchGroupedData();
      fetchNames(); // Cập nhật lại danh sách tên lỡ có tên mới
      if (selectedNgay) setSelectedNgay(null);
    } catch (err) {
      alert('Lỗi lưu dữ liệu!');
    }
  };

  const handleEdit = (item) => {
    setSelectedId(item.id);
    setTenNguon(item.tenNguon);
    const st = Number(item.soTien) || 0;
    setSoTien(st > 0 ? st.toLocaleString('vi-VN') : '');
    setGhiChu(item.ghiChu || '');
    if (item.ngayNhap) {
      const dateStr = String(item.ngayNhap);
      setNgayNhap(dateStr.replace(' ', 'T').substring(0, 16));
    } else {
      setNgayNhap(new Date().toISOString().slice(0, 16));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Chắc chắn muốn xóa giao dịch nguồn này?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert('Đã xóa dữ liệu thành công!');
      clearForm();
      fetchGroupedData();
      setSelectedNgay(null);
    } catch (err) {
      alert('Lỗi xóa dữ liệu!');
    }
  };

  const clearForm = () => {
    setSelectedId(null);
    setTenNguon('');
    setSoTien('');
    setGhiChu('');
    setNgayNhap(new Date().toISOString().slice(0, 16));
    setSuggestions([]);
  };

  const tongThang = listGrouped.reduce((acc, curr) => acc + curr.tongTienNgay, 0);

  return (
    <div className="p-6 bg-[#f0f4f8] min-h-screen">
      {/* Header */}
      <div className="bg-[#1e78c8] p-4 rounded-xl text-white shadow-md flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-bold">💰 Quản Lý Nguồn Nhập</h2>
        <div className="flex gap-4 items-center">
          <label className="font-medium">Tháng:</label>
          <select value={thang} onChange={(e) => setThang(e.target.value)} className="text-black p-1 rounded bg-white">
            {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
          </select>
          <label className="font-medium">Năm:</label>
          <select value={nam} onChange={(e) => setNam(e.target.value)} className="text-black p-1 rounded bg-white">
            {Array.from({ length: 5 }, (_, i) => <option key={2024 + i} value={2024 + i}>{2024 + i}</option>)}
          </select>
          <button onClick={() => { clearForm(); fetchGroupedData(); setSelectedNgay(null); }} className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-700 font-semibold text-sm transition">🔄 Tất cả</button>
        </div>
      </div>

      {/* Form Nhập */}
      <div className="bg-white p-5 rounded-xl shadow border border-blue-100 mb-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày giờ:</label>
            <input type="datetime-local" value={ngayNhap} onChange={(e) => setNgayNhap(e.target.value)} className="w-full border rounded p-2 focus:ring-1 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên nguồn nhập:</label>
            {/* Gắn datalist vào input để làm List gợi ý */}
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
              {listNames.map((name, index) => (
                <option key={index} value={name} />
              ))}
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
          <div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold p-2 rounded hover:bg-blue-700 transition shadow cursor-pointer">
              {selectedId ? '✏️ Cập nhật' : '➕ Thêm & Nhập số liệu'}
            </button>
          </div>
        </form>
      </div>

      {/* Khối Bảng hiển thị giao diện đôi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bảng tổng hợp theo ngày */}
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="bg-[#e1ebfa] p-3 border-b text-blue-800 font-bold text-sm">📋 Danh sách tổng hợp theo ngày</div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-xs font-bold uppercase border-b">
                <th className="p-3">Ngày</th>
                <th className="p-3">Tổng Tiền Nhập</th>
                <th className="p-3 text-center">Số Giao Dịch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {listGrouped.map((item, idx) => (
                <tr key={idx} onClick={() => loadDetailNgay(item.ngayHienThi, item.ngayGoc)} className={`cursor-pointer transition ${selectedNgay === item.ngayHienThi ? 'bg-blue-100/70 font-semibold' : 'hover:bg-blue-50/50'}`}>
                  <td className="p-3">{item.ngayHienThi}</td>
                  <td className="p-3 text-blue-700 font-bold">{formatMoney(item.tongTienNgay)}</td>
                  <td className="p-3 text-center text-gray-500">{item.soLanGiaoDich} lần</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-gray-50 border-t font-bold text-gray-800 text-sm">Tổng tiền tháng: {formatMoney(tongThang)}</div>
        </div>

        {/* Bảng chi tiết của ngày được chọn */}
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="bg-emerald-50 p-3 border-b text-emerald-800 font-bold text-sm">
            {selectedNgay ? `📅 Chi tiết ngày: ${selectedNgay}` : '👈 Hãy bấm vào một ngày ở bảng bên để xem chi tiết'}
          </div>
          {selectedNgay && (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xs font-bold uppercase border-b">
                  <th className="p-3 w-10 text-center">#</th>
                  <th className="p-3">Tên Nguồn / Giờ</th>
                  <th className="p-3">Số Tiền</th>
                  <th className="p-3">Ghi Chú</th>
                  <th className="p-3 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {Object.entries(groupedDetails).map(([name, group]) => (
                  <React.Fragment key={name}>
                    {/* Dòng cha: Tên nguồn + Tổng tiền */}
                    <tr onClick={() => toggleGroup(name)} className="bg-blue-50 cursor-pointer border-b border-blue-100 hover:bg-blue-100 transition">
                      <td className="p-3 text-center">{expandedGroup === name ? '👇' : '👉'}</td>
                      <td className="p-3 font-bold text-gray-800">
                        {name} <span className="text-xs text-gray-500 font-normal ml-1">({group.items.length} gd)</span>
                      </td>
                      <td className="p-3 text-blue-700 font-bold">{formatMoney(group.total)}</td>
                      <td className="p-3"></td>
                      <td className="p-3"></td>
                    </tr>
                    
                    {/* Các dòng con: Chi tiết từng giao dịch (Chỉ hiện khi dòng cha được mở) */}
                    {expandedGroup === name && group.items.map(item => (
                      <tr key={item.id} className="bg-white hover:bg-gray-50 border-b border-gray-50">
                        <td className="p-3"></td>
                        <td className="p-3 pl-8 font-medium text-gray-400">↳ {item.ngayNhap.split(' ')[1]}</td>
                        <td className="p-3 text-emerald-600 font-semibold">{formatMoney(item.soTien)}</td>
                        <td className="p-3 text-xs max-w-[100px] truncate">{item.ghiChu || '-'}</td>
                        <td className="p-3 flex justify-center gap-1.5">
                          <button onClick={() => handleEdit(item)} className="text-amber-600 hover:text-amber-700 font-bold text-xs px-2 py-1 bg-amber-50 rounded">Sửa</button>
                          <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 font-bold text-xs px-2 py-1 bg-red-50 rounded">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}