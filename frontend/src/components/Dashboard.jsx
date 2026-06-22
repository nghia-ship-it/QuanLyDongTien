import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [thang, setThang] = useState(new Date().getMonth() + 1);
  const [nam, setNam] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState([]);
  
  const [tongDoanhThu, setTongDoanhThu] = useState(0);
  const [tongChiPhi, setTongChiPhi] = useState(0);
  const [loiNhuan, setLoiNhuan] = useState(0);

  useEffect(() => {
    fetchData();
  }, [thang, nam]);

  const fetchData = async () => {
    try {
      const resDT = await axios.get(`https://quanlydongtien.onrender.com/api/doanhthu?thang=${thang}&nam=${nam}`);
      const resNN = await axios.get(`https://quanlydongtien.onrender.com/api/nguonnhap/grouped?thang=${thang}&nam=${nam}`);
      
      const dtData = resDT.data;
      const nnData = resNN.data;

      // Tính tổng 3 thông số vàng
      const thu = dtData.reduce((acc, curr) => acc + curr.tongCong, 0);
      const chi = nnData.reduce((acc, curr) => acc + curr.tongTienNgay, 0);
      setTongDoanhThu(thu);
      setTongChiPhi(chi);
      setLoiNhuan(thu - chi);

      // Chế biến dữ liệu rải đều ra 31 ngày cho biểu đồ
      const dtMap = {};
      dtData.forEach(item => {
        let dStr = item.ngayNhap.split(' ')[0];
        if (dStr.includes('-')) {
          const parts = dStr.split('-');
          dStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        dtMap[dStr] = (dtMap[dStr] || 0) + item.tongCong;
      });

      const nnMap = {};
      nnData.forEach(item => { nnMap[item.ngayHienThi] = item.tongTienNgay; });

      const daysInMonth = new Date(nam, thang, 0).getDate();
      let arr = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const dStr = `${i.toString().padStart(2, '0')}/${thang.toString().padStart(2, '0')}/${nam}`;
        arr.push({
          ngay: `${i}/${thang}`,
          "Doanh Thu": dtMap[dStr] || 0,
          "Chi Phí": nnMap[dStr] || 0
        });
      }
      setChartData(arr);
    } catch (err) {
      console.error("Lỗi tải dữ liệu Dashboard");
    }
  };

  const formatMoney = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen">
      <div className="bg-gray-800 p-4 rounded-xl text-white shadow-md flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📊 Tổng Quan Dòng Tiền</h2>
        <div className="flex gap-4 items-center">
          <label className="font-medium">Tháng:</label>
          <select 
            value={thang} 
            onChange={(e) => setThang(Number(e.target.value))} 
            className="text-black p-1 rounded bg-white cursor-pointer"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          <label className="font-medium">Năm:</label>
          <select 
            value={nam} 
            onChange={(e) => setNam(Number(e.target.value))} 
            className="text-black p-1 rounded bg-white cursor-pointer"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={2024 + i} value={2024 + i}>{2024 + i}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Thẻ Thông số */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border-l-8 border-emerald-500">
          <p className="text-gray-500 font-bold mb-1">TỔNG DOANH THU</p>
          <h3 className="text-3xl font-black text-emerald-600">{formatMoney(tongDoanhThu)}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-8 border-red-500">
          <p className="text-gray-500 font-bold mb-1">TỔNG CHI PHÍ (Nguồn nhập)</p>
          <h3 className="text-3xl font-black text-red-600">{formatMoney(tongChiPhi)}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-8 border-blue-500 relative overflow-hidden">
          <p className="text-gray-500 font-bold mb-1">LỢI NHUẬN THỰC TẾ</p>
          <h3 className="text-3xl font-black text-blue-700">{formatMoney(loiNhuan)}</h3>
          {loiNhuan > 0 ? <span className="absolute right-4 top-4 text-4xl">🚀</span> : <span className="absolute right-4 top-4 text-4xl">📉</span>}
        </div>
      </div>

      {/* Biểu đồ Cột */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-lg font-bold text-gray-700 mb-6 text-center">📈 Biểu đồ so sánh Thu - Chi theo ngày</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ngay" />
              <YAxis tickFormatter={(val) => new Intl.NumberFormat('vi-VN', { notation: "compact" }).format(val)} />
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Legend />
              <Bar dataKey="Doanh Thu" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Chi Phí" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}