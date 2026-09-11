import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import CongNoForm from './CongNoForm';
import CongNoTable from './CongNoTable';

const API_URL = `${import.meta.env.VITE_API_URL}/api/congno`;

export default function CongNo({ token }) {
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyDoiTac, setHistoryDoiTac] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const config = { headers: { 'auth-token': token } };

  useEffect(() => { fetchData(); }, []);

  const handleViewHistory = (doiTacId, tenDoiTac) => {
    setHistoryDoiTac(tenDoiTac);
    const data = list.filter(item => item.doiTacId === doiTacId || (item.tenDoiTac === tenDoiTac && !item.doiTacId));
    setHistoryData(data);
    setShowHistoryModal(true);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL, config);
      setList(res.data);
    } catch (err) { alert('Lỗi lấy dữ liệu công nợ!'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Chắc chắn muốn xóa khoản nợ này? Dữ liệu sẽ bay vĩnh viễn!')) return;
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      if (selectedItem && selectedItem.id === id) setSelectedItem(null);
      fetchData();
    } catch (err) { alert('Lỗi xóa dữ liệu!'); }
  };

  const exportExcel = () => {
    try {
      if (list.length === 0) return alert('Không có dữ liệu để xuất!');

      const wb = XLSX.utils.book_new();
      const fmtNum = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);

      const buildSheet = (data, sheetName) => {
        const header = ['STT', 'Tên Đối Tác', 'Tiền Nợ (VND)', 'Đã Trả (VND)', 'Còn Lại (VND)', 'Trạng Thái', 'Ngày Ghi Nợ', 'Ngày Hẹn Trả', 'Ghi Chú'];
        const rows = data.map((r, i) => [
          i + 1,
          r.tenDoiTac,
          fmtNum(r.soTienNo),
          fmtNum(r.soTienDaTra),
          fmtNum(r.soTienNo - r.soTienDaTra),
          r.trangThai,
          r.ngayGhiNo || '',
          r.ngayHenTra || '',
          r.ghiChu || ''
        ]);
        const tongNo = data.reduce((a, c) => a + (c.soTienNo || 0), 0);
        const tongTra = data.reduce((a, c) => a + (c.soTienDaTra || 0), 0);
        rows.push(['', 'TỔNG CỘNG', fmtNum(tongNo), fmtNum(tongTra), fmtNum(tongNo - tongTra), '', '', '', '']);

        const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
        ws['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      };

      // --- Sheet 1: Phải Thu (Khách Nợ) ---
      const khachNo = list.filter(i => i.loaiCongNo === 'khach_no');
      buildSheet(khachNo, 'Phải Thu (Khách Nợ)');

      // --- Sheet 2: Phải Trả (Nợ Đại Lý) ---
      const noDaiLy = list.filter(i => i.loaiCongNo === 'no_dai_ly');
      buildSheet(noDaiLy, 'Phải Trả (Nợ Đại Lý)');

      // --- Sheet 3: Tổng Kết ---
      const tongKhachNo = khachNo.reduce((a, c) => a + (c.soTienNo - c.soTienDaTra), 0);
      const tongNoDaiLy = noDaiLy.reduce((a, c) => a + (c.soTienNo - c.soTienDaTra), 0);
      const wsTK = XLSX.utils.aoa_to_sheet([
        ['BÁO CÁO CÔNG NỢ'],
        [],
        ['Chỉ tiêu', 'Giá trị'],
        ['Tổng Phải Thu (Khách Nợ)', fmtNum(tongKhachNo) + ' VND'],
        ['Số khoản phải thu', khachNo.length],
        ['Tổng Phải Trả (Nợ Đại Lý)', fmtNum(tongNoDaiLy) + ' VND'],
        ['Số khoản phải trả', noDaiLy.length],
        [],
        ['Chênh lệch (Thu - Trả)', fmtNum(tongKhachNo - tongNoDaiLy) + ' VND'],
        [],
        ['Ngày xuất báo cáo', new Date().toLocaleDateString('vi-VN')]
      ]);
      wsTK['!cols'] = [{ wch: 30 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(wb, wsTK, 'Tổng Kết');

      const fileName = `BaoCao_CongNo_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi xuất file Excel!');
    }
  };

  const formatMoney = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
  const tongKhachNo = list.filter(i => i.loaiCongNo === 'khach_no').reduce((acc, curr) => acc + (curr.soTienNo - curr.soTienDaTra), 0);
  const tongNoDaiLy = list.filter(i => i.loaiCongNo === 'no_dai_ly').reduce((acc, curr) => acc + (curr.soTienNo - curr.soTienDaTra), 0);

  return (
    <div className="p-6 bg-transparent min-h-screen">
      <div className="bg-[#ea580c] p-4 rounded-xl text-white shadow-md flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📒 Quản Lý Công Nợ</h2>
        <button onClick={() => setSelectedItem(null)} className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 font-semibold text-sm transition">
          🔄 Làm mới Form
        </button>
      </div>
      <CongNoForm token={token} onRefresh={fetchData} selectedItem={selectedItem} clearSelection={() => setSelectedItem(null)} onExport={exportExcel} />
      <CongNoTable 
        list={list} 
        onEdit={setSelectedItem} 
        onDelete={handleDelete} 
        formatMoney={formatMoney} 
        tongKhachNo={tongKhachNo} 
        tongNoDaiLy={tongNoDaiLy} 
        onViewHistory={handleViewHistory}
      />

      {/* Modal Lịch Sử Nợ */}
      {showHistoryModal && historyDoiTac && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Lịch sử công nợ: {historyDoiTac}</h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-white hover:text-gray-200 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-4 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm font-bold uppercase">
                    <th className="p-2 border-b">Ngày</th>
                    <th className="p-2 border-b">Số tiền nợ</th>
                    <th className="p-2 border-b">Đã trả</th>
                    <th className="p-2 border-b">Còn lại</th>
                    <th className="p-2 border-b">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map(h => (
                    <tr key={h.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{h.ngayGhiNo}</td>
                      <td className="p-2 text-gray-700">{formatMoney(h.soTienNo)}</td>
                      <td className="p-2 text-emerald-600">{formatMoney(h.soTienDaTra)}</td>
                      <td className="p-2 text-red-600 font-bold">{formatMoney(h.soTienNo - h.soTienDaTra)}</td>
                      <td className="p-2 text-sm">{h.trangThai}</td>
                    </tr>
                  ))}
                  {historyData.length === 0 && <tr><td colSpan="5" className="p-4 text-center">Không có dữ liệu.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 text-right border-t">
              <button onClick={() => setShowHistoryModal(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}