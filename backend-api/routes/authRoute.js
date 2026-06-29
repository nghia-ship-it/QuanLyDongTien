const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/Database');
const { JWT_SECRET } = require('../middleware/auth');

router.post('/register', async (req, res) => {
    try {
        const { email, password, soTaiKhoanBank, tenNganHang } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email này đã có người đăng ký!' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ email, password: hashedPassword, soTaiKhoanBank, tenNganHang });
        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công rực rỡ!' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Không tìm thấy tài khoản này!' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Sai mật khẩu rồi ba!' });

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user._id, email: user.email, soTaiKhoanBank: user.soTaiKhoanBank } });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;