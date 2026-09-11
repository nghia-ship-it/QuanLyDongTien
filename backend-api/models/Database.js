const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    email: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    soTaiKhoanBank: { type: String, default: '' }, 
    tenNganHang: { type: String, default: '' },
    loaiTaiKhoan: { type: String, default: 'ca_nhan' }, // ca_nhan hoac doanh_nghiep
    webhookToken: { type: String, default: '' } // Mã bảo mật riêng cho webhook SePay
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

const doiTacSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tenDoiTac: { type: String, required: true },
    loaiDoiTac: { type: String, enum: ['dai_ly', 'khach_hang'], required: true },
    soDienThoai: { type: String, default: '' },
    ghiChu: { type: String, default: '' }
});
const DoiTac = mongoose.model('DoiTac', doiTacSchema);

const nguonNhapSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doiTacId: { type: mongoose.Schema.Types.ObjectId, ref: 'DoiTac' }, // Thêm liên kết đối tác
    tenNguon: String, // Vẫn giữ để tương thích với dữ liệu cũ, hoặc tên đại lý text
    soTien: Number,
    ghiChu: String,
    ngayNhap: String
});
const NguonNhap = mongoose.model('NguonNhap', nguonNhapSchema);

const khoHangSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doiTacId: { type: mongoose.Schema.Types.ObjectId, ref: 'DoiTac' }, // Đối tác cung cấp
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
    doiTacId: { type: mongoose.Schema.Types.ObjectId, ref: 'DoiTac' }, // Liên kết đối tác
    loaiCongNo: { type: String, enum: ['khach_no', 'no_dai_ly'], required: true }, // Ai đang nợ?
    tenDoiTac: { type: String, required: true }, // Tên khách hoặc tên nhà cung cấp (text fallback)
    soTienNo: { type: Number, required: true }, // Số tiền nợ ban đầu
    soTienDaTra: { type: Number, default: 0 }, // Trả góp từ từ
    trangThai: { type: String, default: 'Chưa thanh toán' }, // Xong rồi thì đổi thành 'Đã thanh toán'
    ngayGhiNo: { type: String },
    ngayHenTra: { type: String },
    ghiChu: String
});
const CongNo = mongoose.model('CongNo', congNoSchema);

module.exports = { User, DoanhThu, NguonNhap, KhoHang, CongNo, DoiTac };