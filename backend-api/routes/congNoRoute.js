const express = require('express');
const router = express.Router();
const { CongNo, DoanhThu, NguonNhap } = require('../models/Database');
const { verifyToken } = require('../middleware/auth');

// Hàm tạo ngày giờ hiện tại định dạng YYYY-MM-DD HH:mm:ss
const getNowString = () => {
    const today = new Date();
    today.setHours(today.getHours() + 7); // Múi giờ VN
    return today.toISOString().slice(0, 19).replace('T', ' ');
};

// 1. LẤY DANH SÁCH CÔNG NỢ
router.get('/', verifyToken, async (req, res) => {
    try {
        const rows = await CongNo.find({ userId: req.user._id }).sort({ ngayGhiNo: -1 });
        res.json(rows.map(r => ({
            id: r._id, loaiCongNo: r.loaiCongNo, tenDoiTac: r.tenDoiTac, doiTacId: r.doiTacId,
            soTienNo: r.soTienNo, soTienDaTra: r.soTienDaTra, trangThai: r.trangThai,
            ngayGhiNo: r.ngayGhiNo, ngayHenTra: r.ngayHenTra, ghiChu: r.ghiChu
        })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. THÊM CÔNG NỢ MỚI
router.post('/', verifyToken, async (req, res) => {
    try {
        const { loaiCongNo, tenDoiTac, doiTacId, soTienNo, soTienDaTra, ngayGhiNo, ngayHenTra, ghiChu } = req.body;
        
        let trangThai = 'Chưa thanh toán';
        const tra = Number(soTienDaTra) || 0;
        if (tra > 0 && tra < soTienNo) trangThai = 'Thanh toán một phần';
        if (tra >= soTienNo) trangThai = 'Đã hoàn tất';

        const cn = new CongNo({
            userId: req.user._id, loaiCongNo, tenDoiTac, doiTacId, soTienNo, soTienDaTra: tra,
            trangThai, ngayGhiNo, ngayHenTra, ghiChu
        });
        await cn.save();

        // Ghi nhận dòng tiền ngay nếu có thanh toán trước
        if (tra > 0) {
            const nowStr = getNowString();
            if (loaiCongNo === 'khach_no') {
                await new DoanhThu({ userId: req.user._id, ngayNhap: nowStr, tienMat: 0, chuyenKhoan: tra, tongCong: tra, ghiChu: `Khách hàng ${tenDoiTac} thanh toán nợ` }).save();
            } else {
                await new NguonNhap({ userId: req.user._id, doiTacId, tenNguon: tenDoiTac, soTien: tra, ghiChu: `Thanh toán nợ cho đại lý ${tenDoiTac}`, ngayNhap: nowStr }).save();
            }
        }

        res.json({ id: cn._id, message: 'Thêm công nợ thành công!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. CẬP NHẬT TRẢ NỢ HOẶC SỬA THÔNG TIN
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { loaiCongNo, tenDoiTac, doiTacId, soTienNo, soTienDaTra, ngayGhiNo, ngayHenTra, ghiChu } = req.body;
        
        const oldCn = await CongNo.findOne({ _id: req.params.id, userId: req.user._id });
        if (!oldCn) return res.status(404).json({ message: 'Không tìm thấy khoản nợ' });

        const traMoi = Number(soTienDaTra) || 0;
        const diff = traMoi - (oldCn.soTienDaTra || 0);

        // Tự động tính trạng thái
        let trangThai = 'Chưa thanh toán';
        if (traMoi > 0 && traMoi < soTienNo) trangThai = 'Thanh toán một phần';
        if (traMoi >= soTienNo) trangThai = 'Đã hoàn tất';

        await CongNo.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, {
            loaiCongNo, tenDoiTac, doiTacId, soTienNo, soTienDaTra: traMoi, trangThai, ngayGhiNo, ngayHenTra, ghiChu
        });

        // Ghi nhận dòng tiền nếu số tiền trả tăng lên
        if (diff > 0) {
            const nowStr = getNowString();
            if (loaiCongNo === 'khach_no') {
                await new DoanhThu({ userId: req.user._id, ngayNhap: nowStr, tienMat: 0, chuyenKhoan: diff, tongCong: diff, ghiChu: `Khách hàng ${tenDoiTac} thanh toán nợ` }).save();
            } else {
                await new NguonNhap({ userId: req.user._id, doiTacId, tenNguon: tenDoiTac, soTien: diff, ghiChu: `Thanh toán nợ cho đại lý ${tenDoiTac}`, ngayNhap: nowStr }).save();
            }
        }

        res.json({ success: true, message: 'Cập nhật thành công!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. XÓA CÔNG NỢ
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await CongNo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. API NHẬP HÀNG LOẠT EXCEL CHO CÔNG NỢ 
router.post('/bulk', verifyToken, async (req, res) => {
    try {
        const dataArray = req.body.data;
        if (!dataArray || dataArray.length === 0) return res.status(400).json({ message: 'Không có dữ liệu!' });

        const dataToSave = dataArray.map(item => {
            const soTienNo = Number(item.TienNo) || 0;
            const soTienDaTra = Number(item.DaTra) || 0;
            
            let trangThai = 'Chưa thanh toán';
            if (soTienDaTra > 0 && soTienDaTra < soTienNo) trangThai = 'Thanh toán một phần';
            if (soTienDaTra >= soTienNo) trangThai = 'Đã hoàn tất';

            return {
                userId: req.user._id,
                loaiCongNo: item.Loai === 'Mình nợ' ? 'no_dai_ly' : 'khach_no',
                tenDoiTac: item.DoiTac || 'Khách Vãng Lai',
                soTienNo, soTienDaTra, trangThai,
                ngayGhiNo: item.NgayGhiNo || new Date().toISOString().slice(0, 10),
                ngayHenTra: item.NgayHenTra || '', ghiChu: item.GhiChu || ''
            };
        });

        await CongNo.insertMany(dataToSave);
        res.json({ success: true, message: `Đã nhập thành công ${dataToSave.length} khoản nợ!` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;