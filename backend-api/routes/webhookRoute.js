const express = require('express');
const router = express.Router();
const { User, DoanhThu } = require('../models/Database');

router.post('/sepay', async (req, res) => {
    try {
        const data = req.body;
        if (data && data.transferAmount > 0) {
            const tkNhanTien = data.accountNumber; 
            const user = await User.findOne({ soTaiKhoanBank: tkNhanTien });

            if (!user) {
                console.log(`⚠️ Có tiền vào tài khoản ${tkNhanTien} nhưng chưa ai đăng ký số này!`);
                return res.status(200).json({ message: 'Không tìm thấy user khớp với STK' });
            }

            const today = new Date();
            today.setHours(today.getHours() + 7); 
            const yyyy = today.getUTCFullYear();
            const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
            const dd = String(today.getUTCDate()).padStart(2, '0');
            const hh = String(today.getUTCHours()).padStart(2, '0');
            const min = String(today.getUTCMinutes()).padStart(2, '0');
            const ss = String(today.getUTCSeconds()).padStart(2, '0');
            const ngayNhap = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;

            const dtMoi = new DoanhThu({
                userId: user._id, ngayNhap: ngayNhap, tienMat: 0,
                chuyenKhoan: data.transferAmount, tongCong: data.transferAmount, ghiChu: data.content 
            });
            await dtMoi.save();
            console.log(`🤑 TING TING! Vừa cộng ${data.transferAmount}đ cho tài khoản: ${user.email}`);
        }
        res.status(200).json({ success: true, message: 'Webhook received' });
    } catch (error) {
        console.error('❌ Lỗi xử lý Webhook:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;