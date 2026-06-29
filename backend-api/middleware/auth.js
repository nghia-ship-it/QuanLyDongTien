const jwt = require('jsonwebtoken');
const JWT_SECRET = 'chuoibimatcuanghia123!@#'; // Chìa khóa tạo vé thông hành

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ message: 'Truy cập bị từ chối! Vui lòng đăng nhập.' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified; // Trả về thông tin của user
        next(); // Cho đi tiếp
    } catch (err) {
        res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
    }
};

module.exports = { verifyToken, JWT_SECRET };