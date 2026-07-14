const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ message: 'Không tìm thấy vé thông hành (Access Denied)' });

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET || 'BiMatCuaTao');
        req.user = verified;
        next(); 
    } catch (err) {
        res.status(400).json({ message: 'Vé thông hành không hợp lệ (Invalid Token)' });
    }
};

module.exports = { verifyToken };