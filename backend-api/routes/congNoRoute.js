const express = require('express');
const router = express.Router();
const { CongNo } = require('../models/Database');
const { verifyToken } = require('../middleware/auth');

// 1. LẤY DANH SÁCH CÔNG NỢ
router.get('/', verifyToken, async (req, res) => {
    try {
        const rows = await CongNo.find({ userId: req.user._id }).sort({ ngayGhiNo: -1 });
        res.json(rows.map(r => ({
            id: r._id, loaiCongNo: r.loaiCongNo, tenDoiTac: r.tenDoiTac,
            soTienNo: r.soTienNo, soTienDaTra: r.soTienDaTra, trangThai: r.trangThai,
            ngayGhiNo: r.ngayGhiNo, ngayHenTra: r.ngayHenTra, ghiChu: r.ghiChu
        })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. THÊM CÔNG NỢ MỚI
router.post('/', verifyToken, async (req, res) => {
    try {
        const { loaiCongNo, tenDoiTac, soTienNo, ngayGhiNo, ngayHenTra, ghiChu } = req.body;
        const cn = new CongNo({
            userId: req.user._id, loaiCongNo, tenDoiTac, soTienNo,
            ngayGhiNo, ngayHenTra, ghiChu
        });
        await cn.save();
        res.json({ id: cn._id, message: 'Thêm công nợ thành công!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. CẬP NHẬT TRẢ NỢ HOẶC SỬA THÔNG TIN
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { loaiCongNo, tenDoiTac, soTienNo, soTienDaTra, ngayGhiNo, ngayHenTra, ghiChu } = req.body;
        
        // Tự động tính trạng thái
        let trangThai = 'Chưa thanh toán';
        if (soTienDaTra > 0 && soTienDaTra < soTienNo) trangThai = 'Thanh toán một phần';
        if (soTienDaTra >= soTienNo) trangThai = 'Đã hoàn tất';

        await CongNo.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, {
            loaiCongNo, tenDoiTac, soTienNo, soTienDaTra, trangThai, ngayGhiNo, ngayHenTra, ghiChu
        });
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

module.exports = router;