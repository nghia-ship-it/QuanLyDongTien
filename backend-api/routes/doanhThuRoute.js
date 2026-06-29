const express = require('express');
const router = express.Router();
const { DoanhThu } = require('../models/Database');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const { thang, nam } = req.query;
        const prefix = `${nam}-${thang.toString().padStart(2, '0')}`;
        const rows = await DoanhThu.find({ userId: req.user._id, ngayNhap: { $regex: `^${prefix}` } }).sort({ ngayNhap: -1 });
        res.json(rows.map(row => ({
            id: row._id, ngayNhap: row.ngayNhap, tienMat: row.tienMat || 0,
            chuyenKhoan: row.chuyenKhoan || 0, tongCong: row.tongCong || 0, ghiChu: row.ghiChu
        })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const { tienMat, chuyenKhoan, ngayNhap, ghiChu } = req.body;
        const tong = (Number(tienMat) || 0) + (Number(chuyenKhoan) || 0);
        const dt = new DoanhThu({ userId: req.user._id, ngayNhap, tienMat, chuyenKhoan, tongCong: tong, ghiChu });
        await dt.save();
        res.json({ id: dt._id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { tienMat, chuyenKhoan, ngayNhap, ghiChu } = req.body;
        const tong = (Number(tienMat) || 0) + (Number(chuyenKhoan) || 0);
        await DoanhThu.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { ngayNhap, tienMat, chuyenKhoan, tongCong: tong, ghiChu });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await DoanhThu.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;