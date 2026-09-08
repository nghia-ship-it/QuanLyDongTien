const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { DoanhThu } = require('../models/Database');
const { verifyToken } = require('../middleware/auth');

// --- API NHẬP LIỆU HÀNG LOẠT (TỪ EXCEL) ---
router.post('/bulk', verifyToken, async (req, res) => {
    try {
        const dataArray = req.body.data; // Frontend sẽ gửi mảng data lên đây
        if (!dataArray || dataArray.length === 0) return res.status(400).json({ message: 'Không có dữ liệu!' });

        // Gắn thêm userId vào từng dòng trước khi lưu
        const dataToSave = dataArray.map(item => ({
            ...item,
            userId: req.user._id,
            tongCong: (Number(item.tienMat) || 0) + (Number(item.chuyenKhoan) || 0)
        }));

        // insertMany là lệnh Mongo giúp lưu cả ngàn dòng trong 1 tích tắc
        await DoanhThu.insertMany(dataToSave);
        res.json({ success: true, message: `Đã nhập thành công ${dataToSave.length} dòng!` });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/grouped', verifyToken, async (req, res) => {
    try {
        const { thang, nam } = req.query;
        const prefix = `${nam}-${thang.toString().padStart(2, '0')}`;
        const rows = await DoanhThu.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user._id), ngayNhap: { $regex: `^${prefix}` } } },
            { $group: { 
                _id: { $substr: ["$ngayNhap", 0, 10] }, 
                tongTienNgay: { $sum: "$tongCong" }, 
                tongTienMat: { $sum: "$tienMat" },
                tongChuyenKhoan: { $sum: "$chuyenKhoan" },
                soLanGiaoDich: { $sum: 1 }
            }},
            { $sort: { _id: -1 } }
        ]);
        res.json(rows.map(r => {
            const parts = r._id.split('-');
            return { ngayHienThi: `${parts[2]}/${parts[1]}/${parts[0]}`, ngayGoc: r._id, tongTienNgay: r.tongTienNgay, tongTienMat: r.tongTienMat, tongChuyenKhoan: r.tongChuyenKhoan, soLanGiaoDich: r.soLanGiaoDich };
        }));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/detail', verifyToken, async (req, res) => {
    try {
        const { ngay } = req.query;
        const rows = await DoanhThu.find({ userId: req.user._id, ngayNhap: { $regex: `^${ngay}` } }).sort({ ngayNhap: -1 });
        res.json(rows.map(row => ({
            id: row._id, ngayNhap: row.ngayNhap, tienMat: row.tienMat || 0,
            chuyenKhoan: row.chuyenKhoan || 0, tongCong: row.tongCong || 0, ghiChu: row.ghiChu
        })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

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

router.get('/year', verifyToken, async (req, res) => {
    try {
        const { nam } = req.query;
        const prefix = `${nam}-`;
        const rows = await DoanhThu.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user._id), ngayNhap: { $regex: `^${prefix}` } } },
            { $group: { _id: null, tongDoanhThuNam: { $sum: "$tongCong" } } }
        ]);
        res.json({ tongDoanhThuNam: rows.length > 0 ? rows[0].tongDoanhThuNam : 0 });
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