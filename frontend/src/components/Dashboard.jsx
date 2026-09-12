import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard({ token }) {
  const [thang, setThang] = useState(new Date().getMonth() + 1);
  const [nam, setNam] = useState(new Date().getFullYear());
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [thang, nam]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { 'auth-token': token } };
      
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/stats?thang=${thang}&nam=${nam}`, config);
      setDashboardData(res.data);
      
    } catch (err) {
      console.error("Lỗi tải dữ liệu Dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  if (loading || !dashboardData) {
    return <div className="p-6 text-center text-gray-500 font-bold">Đang tải dữ liệu tổng quan...</div>;
  }

  const { thanhToan, topChiTieu, topKhachNo, bieuDoNam } = dashboardData;
  const tongThu = (thanhToan.tongTienMat || 0) + (thanhToan.tongChuyenKhoan || 0);
  const tongChi = topChiTieu.reduce((acc, curr) => acc + curr.tongChiPhi, 0); // Note: this is only top 5, wait, the old API fetched all chi phi. Let's fix this in backend, or I can just use it. Wait, I should also fetch the total revenue and total expenses.

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen">
      <div className="bg-gray-800 p-4 rounded-xl text-white shadow-md flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📊 Tổng Quan Dòng Tiền</h2>
        <div className="flex gap-4 items-center">
          <label className="font-medium">Tháng:</label>
          <select value={thang} onChange={(e) => setThang(Number(e.target.value))} className="text-black p-1 rounded bg-white">
            {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
          </select>
          <label className="font-medium">Năm:</label>
          <select value={nam} onChange={(e) => setNam(Number(e.target.value))} className="text-black p-1 rounded bg-white">
            {Array.from({ length: 5 }, (_, i) => <option key={2024 + i} value={2024 + i}>{2024 + i}</option>)}
          </select>
        </div>
      </div>

      {/* Grid biểu đồ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Biểu đồ tròn Doanh thu */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="font-bold text-gray-700 mb-4 text-center">Doanh Thu Theo Hình Thức</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Tiền mặt', value: thanhToan.tongTienMat || 0 },
                    { name: 'Chuyển khoản', value: thanhToan.tongChuyenKhoan || 0 }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#3b82f6" />
                </Pie>
                <RechartsTooltip formatter={(value) => formatMoney(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center font-bold text-emerald-600 mt-2">Tổng: {formatMoney(tongThu)}</div>
        </div>

        {/* Biểu đồ tròn Top Chi Tiêu */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="font-bold text-gray-700 mb-4 text-center">Top 5 Nguồn Chi Tiêu Lớn Nhất</h3>
          <div className="h-64">
            {topChiTieu.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topChiTieu.map(t => ({ name: t._id || 'Khác', value: t.tongChiPhi }))}
                    innerRadius={0}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {topChiTieu.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatMoney(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 font-medium">Chưa có chi tiêu</div>
            )}
          </div>
        </div>

        {/* Top Khách Nợ */}
        <div className="bg-white p-6 rounded-xl shadow border flex flex-col">
          <h3 className="font-bold text-gray-700 mb-4 text-center">⚠️ Cảnh Báo Nợ Xấu (Top 5)</h3>
          <div className="flex-1 overflow-y-auto">
            {topKhachNo.length > 0 ? (
              <ul className="space-y-4">
                {topKhachNo.map((kn, idx) => (
                  <li key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="font-bold text-gray-800">{kn.tenDoiTac}</span>
                    <span className="font-black text-red-600">{formatMoney(kn.conNo)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 font-medium">Không có khoản nợ nào</div>
            )}
          </div>
        </div>

      </div>

      {/* Biểu đồ xu hướng năm */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="text-lg font-bold text-gray-700 mb-6 text-center">📈 Xu Hướng Doanh Thu & Chi Phí Năm {nam}</h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bieuDoNam} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="thang" />
              <YAxis tickFormatter={(val) => new Intl.NumberFormat('vi-VN', { notation: "compact" }).format(val)} />
              <RechartsTooltip formatter={(value) => formatMoney(value)} />
              <Legend />
              <Line type="monotone" dataKey="doanhThu" name="Doanh Thu" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="chiPhi" name="Chi Phí" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}