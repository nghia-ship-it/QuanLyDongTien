const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { NguonNhap } = require('../models/Database');
const { verifyToken } = require('../middleware/auth');

router.get('/grouped', verifyToken, async (req, res) => {
    try {
        const { thang, nam } = req.query;
        const prefix = `${nam}-${thang.toString().padStart(2, '0')}`;
        const rows = await NguonNhap.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user._id), ngayNhap: { $regex: `^${prefix}` } } },
            { $group: { _id: { $substr: ["$ngayNhap", 0, 10] }, tongTienNgay: { $sum: "$soTien" }, soLanGiaoDich: { $sum: 1 }}},
            { $sort: { _id: -1 } }
        ]);
        res.json(rows.map(r => {
            const parts = r._id.split('-');
            return { ngayHienThi: `${parts[2]}/${parts[1]}/${parts[0]}`, ngayGoc: r._id, tongTienNgay: r.tongTienNgay, soLanGiaoDich: r.soLanGiaoDich };
        }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/detail', verifyToken, async (req, res) => {
    try {
        const { ngay } = req.query;
        const rows = await NguonNhap.find({ userId: req.user._id, ngayNhap: { $regex: `^${ngay}` } }).sort({ ngayNhap: -1 });
        res.json(rows.map(r => ({ id: r._id, ngayNhap: r.ngayNhap, tenNguon: r.tenNguon, soTien: r.soTien || 0, ghiChu: r.ghiChu })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/names', verifyToken, async (req, res) => {
    try {
        const names = await NguonNhap.find({ userId: req.user._id }).distinct('tenNguon');
        res.json(names.sort());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        const { tenNguon, soTien, ghiChu, ngayNhap } = req.body;
        const nn = new NguonNhap({ userId: req.user._id, tenNguon, soTien, ghiChu, ngayNhap });
        await nn.save();
        res.json({ id: nn._id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { tenNguon, soTien, ghiChu, ngayNhap } = req.body;
        await NguonNhap.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { tenNguon, soTien, ghiChu, ngayNhap });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await NguonNhap.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- API NHẬP HÀNG LOẠT EXCEL CHO NGUỒN NHẬP (CHI TIÊU) ---
router.post('/bulk', verifyToken, async (req, res) => {
    try {
        const dataArray = req.body.data;
        if (!dataArray || dataArray.length === 0) return res.status(400).json({ message: 'Không có dữ liệu!' });

        const dataToSave = dataArray.map(item => ({
            userId: req.user._id,
            tenNguon: item.tenNguon || 'Khác',
            soTien: Number(item.soTien) || 0,
            ghiChu: item.ghiChu || '',
            ngayNhap: item.ngayNhap || new Date().toISOString().slice(0, 16).replace('T', ' ') + ':00'
        }));

        await NguonNhap.insertMany(dataToSave);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;