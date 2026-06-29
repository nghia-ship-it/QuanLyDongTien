const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. KẾT NỐI MONGODB CLOUD
// ==========================================
// THAY CÁI LINK CỦA MÀY VÀO ĐÂY (Nhớ đổi <password> và thêm tên DB)
const MONGO_URI = "mongodb+srv://admin:Alo123456@cluster0.upycxci.mongodb.net/QuanLyDongTien?appName=Cluster0"; 

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Đã kết nối MongoDB Cloud rực rỡ!'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// ==========================================
// 2. KHAI BÁO CẤU TRÚC BẢNG (SCHEMA)
// ==========================================
const doanhThuSchema = new mongoose.Schema({
    ngayNhap: String,
    tienMat: Number,
    chuyenKhoan: Number,
    tongCong: Number
});
const DoanhThu = mongoose.model('DoanhThu', doanhThuSchema);

const nguonNhapSchema = new mongoose.Schema({
    tenNguon: String,
    soTien: Number,
    ghiChu: String,
    ngayNhap: String
});
const NguonNhap = mongoose.model('NguonNhap', nguonNhapSchema);

// ==========================================
// 3. API DOANH THU
// ==========================================
app.get('/api/doanhthu', async (req, res) => {
    try {
        const { thang, nam } = req.query;
        const prefix = `${nam}-${thang.toString().padStart(2, '0')}`;
        // Tìm các dòng có ngày bắt đầu bằng YYYY-MM
        const rows = await DoanhThu.find({ ngayNhap: { $regex: `^${prefix}` } }).sort({ ngayNhap: -1 });

        res.json(rows.map(row => ({
            id: row._id, // Trả về _id của Mongo thay cho MaDoanhThu
            ngayNhap: row.ngayNhap,
            tienMat: row.tienMat || 0,
            chuyenKhoan: row.chuyenKhoan || 0,
            tongCong: row.tongCong || 0
        })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/doanhthu', async (req, res) => {
    try {
        const { tienMat, chuyenKhoan, ngayNhap } = req.body;
        const tong = (Number(tienMat) || 0) + (Number(chuyenKhoan) || 0);
        const dt = new DoanhThu({ ngayNhap, tienMat, chuyenKhoan, tongCong: tong });
        await dt.save();
        res.json({ id: dt._id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/doanhthu/:id', async (req, res) => {
    try {
        const { tienMat, chuyenKhoan, ngayNhap } = req.body;
        const tong = (Number(tienMat) || 0) + (Number(chuyenKhoan) || 0);
        await DoanhThu.findByIdAndUpdate(req.params.id, { ngayNhap, tienMat, chuyenKhoan, tongCong: tong });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/doanhthu/:id', async (req, res) => {
    try {
        await DoanhThu.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 4. API NGUỒN NHẬP
// ==========================================
app.get('/api/nguonnhap/grouped', async (req, res) => {
    try {
        const { thang, nam } = req.query;
        const prefix = `${nam}-${thang.toString().padStart(2, '0')}`;

        // Dùng Aggregate của Mongo để gom nhóm theo ngày (Y chang SQLite)
        const rows = await NguonNhap.aggregate([
            { $match: { ngayNhap: { $regex: `^${prefix}` } } },
            { $group: {
                _id: { $substr: ["$ngayNhap", 0, 10] }, // Cắt lấy chuỗi YYYY-MM-DD
                tongTienNgay: { $sum: "$soTien" },
                soLanGiaoDich: { $sum: 1 }
            }},
            { $sort: { _id: -1 } }
        ]);

        res.json(rows.map(r => {
            const parts = r._id.split('-');
            return {
                ngayHienThi: `${parts[2]}/${parts[1]}/${parts[0]}`, // Đổi thành DD/MM/YYYY
                ngayGoc: r._id,
                tongTienNgay: r.tongTienNgay,
                soLanGiaoDich: r.soLanGiaoDich
            };
        }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/nguonnhap/detail', async (req, res) => {
    try {
        const { ngay } = req.query;
        const rows = await NguonNhap.find({ ngayNhap: { $regex: `^${ngay}` } }).sort({ ngayNhap: -1 });

        res.json(rows.map(r => ({
            id: r._id,
            ngayNhap: r.ngayNhap,
            tenNguon: r.tenNguon,
            soTien: r.soTien || 0,
            ghiChu: r.ghiChu
        })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/nguonnhap/names', async (req, res) => {
    try {
        const names = await NguonNhap.distinct('tenNguon');
        res.json(names.sort());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/nguonnhap', async (req, res) => {
    try {
        const { tenNguon, soTien, ghiChu, ngayNhap } = req.body;
        const nn = new NguonNhap({ tenNguon, soTien, ghiChu, ngayNhap });
        await nn.save();
        res.json({ id: nn._id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/nguonnhap/:id', async (req, res) => {
    try {
        const { tenNguon, soTien, ghiChu, ngayNhap } = req.body;
        await NguonNhap.findByIdAndUpdate(req.params.id, { tenNguon, soTien, ghiChu, ngayNhap });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/nguonnhap/:id', async (req, res) => {
    try {
        await NguonNhap.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 5.API Webhook nhận biến động số dư từ SePay
// ==========================================
app.post('/api/webhook/sepay', async (req, res) => {
    try {
        const data = req.body;
        
        // SePay nó sẽ gửi cục data về, mình chỉ lấy giao dịch CỘNG TIỀN
        if (data && data.transferAmount > 0) {
            
            // Lấy ngày giờ hiện tại chuẩn YYYY-MM-DD HH:mm:ss và ép về giờ Việt Nam (UTC+7)
            const today = new Date();
            today.setHours(today.getHours() + 7); 
            
            const yyyy = today.getUTCFullYear();
            const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
            const dd = String(today.getUTCDate()).padStart(2, '0');
            const hh = String(today.getUTCHours()).padStart(2, '0');
            const min = String(today.getUTCMinutes()).padStart(2, '0');
            const ss = String(today.getUTCSeconds()).padStart(2, '0');
            
            const ngayNhap = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;

            // Tạo một bản ghi Doanh Thu mới
            const dtMoi = new DoanhThu({
                ngayNhap: ngayNhap,
                tienMat: 0,
                chuyenKhoan: data.transferAmount,
                tongCong: data.transferAmount,
                ghiChu: data.content 
            });

            await dtMoi.save();
            console.log(`🤑 TING TING! Vừa nhận ${data.transferAmount}đ. Nội dung: ${data.content}`);
        }
        
        // Báo cho SePay biết là "Tao nhận được rồi, cảm ơn!"
        res.status(200).json({ success: true, message: 'Webhook received' });
    } catch (error) {
        console.error('❌ Lỗi xử lý Webhook:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('Server đang chạy ở cổng ' + PORT);
});