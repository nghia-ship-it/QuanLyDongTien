const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// 1. KẾT NỐI MONGODB
const MONGO_URI = "mongodb+srv://admin:Alo123456@cluster0.upycxci.mongodb.net/QuanLyDongTien?appName=Cluster0"; 
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Đã kết nối MongoDB Cloud rực rỡ!'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// 2. GỌI CÁC ROUTER (API) TỪ THƯ MỤC ROUTES
const authRoute = require('./routes/authRoute');
const doanhThuRoute = require('./routes/doanhThuRoute');
const nguonNhapRoute = require('./routes/nguonNhapRoute');
const webhookRoute = require('./routes/webhookRoute');

// 3. ĐĂNG KÝ ĐƯỜNG DẪN API
app.use('/api', authRoute);              // Sẽ chạy: /api/login, /api/register
app.use('/api/doanhthu', doanhThuRoute); // Sẽ chạy: /api/doanhthu/...
app.use('/api/nguonnhap', nguonNhapRoute); // Sẽ chạy: /api/nguonnhap/...
app.use('/api/webhook', webhookRoute);   // Sẽ chạy: /api/webhook/sepay

// 4. CHẠY SERVER
const PORT = process.env.PORT || 5000;
// --- ĐOẠN CODE CỨU HỘ DỮ LIỆU (Chạy xong xóa đi) ---
app.get('/api/cuu-du-lieu', async (req, res) => {
    try {
        const { User, DoanhThu, NguonNhap } = require('./models/Database');
        
        // MÀY ĐỔI CÁI EMAIL NÀY THÀNH EMAIL MÀY VỪA ĐĂNG KÝ NHA
        const emailCuaMay = 'nghiateprieunew@gmail.com'; 
        
        const me = await User.findOne({ email: emailCuaMay });
        if (!me) return res.send('Không tìm thấy tài khoản, kiểm tra lại email nha mạy!');

        // Tìm tất cả data cũ chưa có chủ (userId không tồn tại) và gán ID của mày vào
        const kq1 = await DoanhThu.updateMany(
            { userId: { $exists: false } }, 
            { $set: { userId: me._id } }
        );
        const kq2 = await NguonNhap.updateMany(
            { userId: { $exists: false } }, 
            { $set: { userId: me._id } }
        );

        res.json({
            message: "🎉 CỨU DỮ LIỆU THÀNH CÔNG! VÀO APP F5 LẠI ĐI!",
            doanhThuDaCuu: kq1.modifiedCount,
            nguonNhapDaCuu: kq2.modifiedCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.listen(PORT, '0.0.0.0', () => {
    console.log('Server đang chạy ở cổng ' + PORT);
});