const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); 
const { User } = require('../models/Database');
const { verifyToken } = require('../middleware/auth');

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    service: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// API ĐĂNG KÝ
router.post('/register', async (req, res) => {
    try {
        // Bổ sung thêm biến "email" để hứng từ Frontend
        const { username, email, password, soTaiKhoanBank, tenNganHang, loaiTaiKhoan } = req.body;
        
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'Tên đăng nhập hoặc Số điện thoại này đã tồn tại!' });

        // Tùy chọn: Check xem email đã có ai xài chưa
        if (email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ message: 'Email này đã được đăng ký cho tài khoản khác!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            username, 
            email,
            password: hashedPassword, 
            soTaiKhoanBank, 
            tenNganHang, 
            loaiTaiKhoan 
        });
        await newUser.save();

        res.json({ message: 'Đăng ký thành công!' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// API ĐĂNG NHẬP
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

// API CẬP NHẬT TÀI KHOẢN
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

// 3. API QUÊN MẬT KHẨU 
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email này chưa được đăng ký trong hệ thống!' });

        // Tạo token dùng một lần để đổi mật khẩu (hết hạn sau 15 phút)
        const resetToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET || 'BiMatCuaTao', { expiresIn: '15m' });

        // Tạo link để người dùng click vào (Trỏ về Frontend)
        const resetLink = `https://cashflowvn.vercel.app/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"SmartBiz SaaS" <${process.env.EMAIL_USER}>`,
            to: email, 
            subject: '🔒 Yêu cầu khôi phục mật khẩu',
            html: `
                <h3>Chào bạn,</h3>
                <p>Hệ thống nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn.</p>
                <p>Vui lòng click vào nút bên dưới để đặt lại mật khẩu mới (Link này sẽ hết hạn sau 15 phút):</p>
                <br/>
                <a href="${resetLink}" style="padding: 10px 15px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Đổi Mật Khẩu Ngay</a>
                <br/><br/>
                <p>Nếu nút bấm không hoạt động, hãy copy đường dẫn sau dán vào trình duyệt:</p>
                <p>${resetLink}</p>
                <p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Đã gửi link khôi phục vào email! Vui lòng kiểm tra hộp thư.' });
    } catch (error) {
        console.error('Lỗi khi gửi email:', error);
        res.status(500).json({ message: 'Lỗi server, không thể gửi email lúc này' });
    }
});

module.exports = router;