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

// Quản lý Khách nợ mình & Mình nợ Đại lý
const congNoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loaiCongNo: { type: String, enum: ['khach_no', 'no_dai_ly'], required: true }, // Ai đang nợ?
    tenDoiTac: { type: String, required: true }, // Tên khách hoặc tên nhà cung cấp
    soTienNo: { type: Number, required: true }, // Số tiền nợ ban đầu
    soTienDaTra: { type: Number, default: 0 }, // Trả góp từ từ
    trangThai: { type: String, default: 'Chưa thanh toán' }, // Xong rồi thì đổi thành 'Đã thanh toán'
    ngayGhiNo: { type: String },
    ngayHenTra: { type: String },
    ghiChu: String
});
const CongNo = mongoose.model('CongNo', congNoSchema);

module.exports = { User, DoanhThu, NguonNhap, KhoHang, CongNo };