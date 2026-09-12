const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { DoanhThu, NguonNhap, CongNo } = require('../models/Database');
const { verifyToken } = require('../middleware/auth');

router.get('/stats', verifyToken, async (req, res) => {
    try {
        const { thang, nam } = req.query;
        const currentNam = parseInt(nam) || new Date().getFullYear();
        const currentThang = parseInt(thang) || new Date().getMonth() + 1;
        const userId = new mongoose.Types.ObjectId(req.user._id);

        const prefixThang = `${currentNam}-${currentThang.toString().padStart(2, '0')}`;
        const prefixNam = `${currentNam}-`;

        // 1. Thống kê phương thức thanh toán trong tháng
        const thanhToanStats = await DoanhThu.aggregate([
            { $match: { userId: userId, ngayNhap: { $regex: `^${prefixThang}` } } },
            { $group: { 
                _id: null, 
                tongTienMat: { $sum: "$tienMat" },
                tongChuyenKhoan: { $sum: "$chuyenKhoan" }
            }}
        ]);

        // 2. Top 5 nguồn chi tiêu (Đại lý) lớn nhất trong tháng
        const topChiTieu = await NguonNhap.aggregate([
            { $match: { userId: userId, ngayNhap: { $regex: `^${prefixThang}` } } },
            { $group: {
                _id: "$tenNguon",
                tongChiPhi: { $sum: "$soTien" }
            }},
            { $sort: { tongChiPhi: -1 } },
            { $limit: 5 }
        ]);

        // 3. Top 5 khách nợ nhiều nhất (Hiện tại)
        const topKhachNo = await CongNo.aggregate([
            { $match: { userId: userId, loaiCongNo: 'khach_no', trangThai: { $ne: 'Đã hoàn tất' } } },
            { $project: {
                tenDoiTac: 1,
                conNo: { $subtract: ["$soTienNo", "$soTienDaTra"] }
            }},
            { $match: { conNo: { $gt: 0 } } },
            { $sort: { conNo: -1 } },
            { $limit: 5 }
        ]);

        // 4. Biểu đồ xu hướng Doanh Thu & Chi Phí trong 12 tháng của năm
        const doanhThuNam = await DoanhThu.aggregate([
            { $match: { userId: userId, ngayNhap: { $regex: `^${prefixNam}` } } },
            { $group: {
                _id: { $substr: ["$ngayNhap", 5, 2] },
                tongDoanhThu: { $sum: "$tongCong" }
            }}
        ]);

        const chiPhiNam = await NguonNhap.aggregate([
            { $match: { userId: userId, ngayNhap: { $regex: `^${prefixNam}` } } },
            { $group: {
                _id: { $substr: ["$ngayNhap", 5, 2] },
                tongChiPhi: { $sum: "$soTien" }
            }}
        ]);

        let bieuDoNam = [];
        for (let i = 1; i <= 12; i++) {
            const mStr = i.toString().padStart(2, '0');
            const dt = doanhThuNam.find(d => d._id === mStr);
            const cp = chiPhiNam.find(c => c._id === mStr);
            bieuDoNam.push({
                thang: `T${i}`,
                doanhThu: dt ? dt.tongDoanhThu : 0,
                chiPhi: cp ? cp.tongChiPhi : 0
            });
        }

        res.json({
            thanhToan: thanhToanStats.length > 0 ? thanhToanStats[0] : { tongTienMat: 0, tongChuyenKhoan: 0 },
            topChiTieu: topChiTieu,
            topKhachNo: topKhachNo,
            bieuDoNam: bieuDoNam
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
