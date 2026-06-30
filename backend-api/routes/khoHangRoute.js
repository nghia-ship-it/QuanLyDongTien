const express = require('express');
const router = express.Router();
const { KhoHang } = require('../models/Database');
const { verifyToken } = require('../middleware/auth');

// Lấy danh sách hàng hóa trong kho
router.get('/', verifyToken, async (req, res) => {
    try {
        const rows = await KhoHang.find({ userId: req.user._id }).sort({ ngayCapNhat: -1 });
        res.json(rows.map(r => ({
            id: r._id, tenSanPham: r.tenSanPham, soLuongTon: r.soLuongTon,
            donViTinh: r.donViTinh, giaNhap: r.giaNhap, giaBan: r.giaBan, ngayCapNhat: r.ngayCapNhat
        })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Thêm mặt hàng mới
router.post('/', verifyToken, async (req, res) => {
    try {
        const { tenSanPham, soLuongTon, donViTinh, giaNhap, giaBan, ngayCapNhat } = req.body;
        const kh = new KhoHang({ userId: req.user._id, tenSanPham, soLuongTon, donViTinh, giaNhap, giaBan, ngayCapNhat });
        await kh.save();
        res.json({ id: kh._id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Cập nhật (Nhập thêm / Xuất bớt)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { tenSanPham, soLuongTon, donViTinh, giaNhap, giaBan, ngayCapNhat } = req.body;
        await KhoHang.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, 
            { tenSanPham, soLuongTon, donViTinh, giaNhap, giaBan, ngayCapNhat });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Xóa mặt hàng
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await KhoHang.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;