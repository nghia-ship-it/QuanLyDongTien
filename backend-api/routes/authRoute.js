const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/Database');
const { verifyToken } = require('../middleware/auth');

router.post('/register', async (req, res) => {
    try {
        const { username, password, soTaiKhoanBank, tenNganHang, loaiTaiKhoan } = req.body;
        
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'Tên đăng nhập hoặc Số điện thoại này đã tồn tại!' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            username, 
            password: hashedPassword, 
            soTaiKhoanBank, 
            tenNganHang, 
            loaiTaiKhoan 
        });
        await newUser.save();

        res.json({ message: 'Đăng ký thành công!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Không tìm thấy tài khoản!' });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Sai mật khẩu!' });

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET || 'BiMatCuaTao', { expiresIn: '7d' });
        
        const userInfo = { 
            id: user._id, 
            username: user.username, 
            email: user.email, 
            phoneNumber: user.phoneNumber, 
            soTaiKhoanBank: user.soTaiKhoanBank, 
            tenNganHang: user.tenNganHang,
            loaiTaiKhoan: user.loaiTaiKhoan
        };
        
        res.json({ token, user: userInfo });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/update-profile', verifyToken, async (req, res) => {
    try {
        const { email, phoneNumber, soTaiKhoanBank, tenNganHang, oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (oldPassword && newPassword) {
            const validPass = await bcrypt.compare(oldPassword, user.password);
            if (!validPass) return res.status(400).json({ message: 'Mật khẩu cũ không chính xác!' });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        user.email = email !== undefined ? email : user.email;
        user.phoneNumber = phoneNumber !== undefined ? phoneNumber : user.phoneNumber;
        user.soTaiKhoanBank = soTaiKhoanBank !== undefined ? soTaiKhoanBank : user.soTaiKhoanBank;
        user.tenNganHang = tenNganHang !== undefined ? tenNganHang : user.tenNganHang;

        await user.save();
        
        const updatedInfo = { 
            id: user._id, 
            username: user.username, 
            email: user.email, 
            phoneNumber: user.phoneNumber, 
            soTaiKhoanBank: user.soTaiKhoanBank, 
            tenNganHang: user.tenNganHang,
            loaiTaiKhoan: user.loaiTaiKhoan
        };
        res.json({ message: 'Cập nhật tài khoản thành công!', user: updatedInfo });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;