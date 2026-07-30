const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const khoHangRoute = require('./routes/khoHangRoute')

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
const congNoRoute = require('./routes/congNoRoute');

// 3. ĐĂNG KÝ ĐƯỜNG DẪN API
app.use('/api', authRoute); 
app.use('/api/doanhthu', doanhThuRoute);
app.use('/api/nguonnhap', nguonNhapRoute);
app.use('/api/khohang' ,khoHangRoute);
app.use('/api/webhook', webhookRoute);
app.use('/api/congno', congNoRoute);

// 4. CHẠY SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('Server đang chạy ở cổng ' + PORT);
});