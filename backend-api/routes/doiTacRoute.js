const express = require('express');
const router = express.Router();
const { DoiTac } = require('../models/Database');
const { verifyToken } = require('../middleware/auth');

// 1. TÌM KIẾM ĐỐI TÁC THEO TÊN HOẶC CHỮ CÁI (AUTOCOMPLETE)
router.get('/search', verifyToken, async (req, res) => {
    try {
        const { query, loai } = req.query; // loai: 'dai_ly' | 'khach_hang'
        let filter = { userId: req.user._id };
        if (query) {
            filter.tenDoiTac = { $regex: new RegExp(query, 'i') };
        }
        
        if (loai) {
            filter.loaiDoiTac = loai;
        }

        const results = await DoiTac.find(filter).sort({ tenDoiTac: 1 });
        res.json(results.map(r => ({ id: r._id, tenDoiTac: r.tenDoiTac, loaiDoiTac: r.loaiDoiTac, soDienThoai: r.soDienThoai })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. LẤY TẤT CẢ DANH SÁCH (NẾU CẦN)
router.get('/', verifyToken, async (req, res) => {
    try {
        const { loai } = req.query;
        let filter = { userId: req.user._id };
        if (loai) filter.loaiDoiTac = loai;

        const results = await DoiTac.find(filter).sort({ tenDoiTac: 1 });
        res.json(results.map(r => ({ id: r._id, tenDoiTac: r.tenDoiTac, loaiDoiTac: r.loaiDoiTac, soDienThoai: r.soDienThoai, ghiChu: r.ghiChu })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. THÊM ĐỐI TÁC MỚI
router.post('/', verifyToken, async (req, res) => {
    try {
        const { tenDoiTac, loaiDoiTac, soDienThoai, ghiChu } = req.body;
        
        // Kiểm tra xem đã có chưa
        let existing = await DoiTac.findOne({ userId: req.user._id, tenDoiTac: { $regex: new RegExp(`^${tenDoiTac}$`, 'i') }, loaiDoiTac });
        if (existing) {
            return res.status(400).json({ message: 'Đối tác này đã tồn tại!' });
        }

        const dt = new DoiTac({
            userId: req.user._id,
            tenDoiTac,
            loaiDoiTac,
            soDienThoai,
            ghiChu
        });
        await dt.save();
        res.json({ id: dt._id, tenDoiTac: dt.tenDoiTac, loaiDoiTac: dt.loaiDoiTac, message: 'Đã thêm đối tác mới!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
