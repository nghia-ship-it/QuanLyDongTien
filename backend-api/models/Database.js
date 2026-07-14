const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    email: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    soTaiKhoanBank: { type: String, default: '' }, 
    tenNganHang: { type: String, default: '' },
    loaiTaiKhoan: { type: String, default: 'ca_nhan' } // ca_nhan hoac doanh_nghiep
});
const User = mongoose.model('User', userSchema);

const doanhThuSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ngayNhap: String,
    tienMat: Number,
    chuyenKhoan: Number,
    tongCong: Number,
    ghiChu: String
});
const DoanhThu = mongoose.model('DoanhThu', doanhThuSchema);

const nguonNhapSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tenNguon: String,
    soTien: Number,
    ghiChu: String,
    ngayNhap: String
});
const NguonNhap = mongoose.model('NguonNhap', nguonNhapSchema);

const khoHangSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tenSanPham: { type: String, required: true },
    soLuongTon: { type: Number, default: 0 },
    donViTinh: { type: String, default: 'Cái' },
    giaNhap: { type: Number, default: 0 },
    giaBan: { type: Number, default: 0 },
    ngayCapNhat: String
});
const KhoHang = mongoose.model('KhoHang', khoHangSchema);

module.exports = { User, DoanhThu, NguonNhap, KhoHang };