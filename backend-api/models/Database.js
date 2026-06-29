const mongoose = require('mongoose');

// Bảng User
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    soTaiKhoanBank: { type: String, default: '' }, 
    tenNganHang: { type: String, default: '' }
});
const User = mongoose.model('User', userSchema);

// Bảng Doanh Thu
const doanhThuSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ngayNhap: String,
    tienMat: Number,
    chuyenKhoan: Number,
    tongCong: Number,
    ghiChu: String
});
const DoanhThu = mongoose.model('DoanhThu', doanhThuSchema);

// Bảng Nguồn Nhập
const nguonNhapSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tenNguon: String,
    soTien: Number,
    ghiChu: String,
    ngayNhap: String
});
const NguonNhap = mongoose.model('NguonNhap', nguonNhapSchema);

module.exports = { User, DoanhThu, NguonNhap };