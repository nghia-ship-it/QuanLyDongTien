const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ message: 'Không tìm thấy vé thông hành (Access Denied)' });

    try {
        const secret = process.env.TOKEN_SECRET;
        if (!secret) throw new Error('TOKEN_SECRET not configured');
        const verified = jwt.verify(token, secret);
        req.user = verified;
        next(); 
    } catch (err) {
        res.status(400).json({ message: 'Vé thông hành không hợp lệ (Invalid Token)' });
    }
};

module.exports = { verifyToken };