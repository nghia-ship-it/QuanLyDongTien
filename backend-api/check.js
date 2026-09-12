const mongoose = require('mongoose');
require('dotenv').config();
const { NguonNhap } = require('./models/Database');
mongoose.connect(process.env.MONGO_URI).then(async () => {
    const res = await NguonNhap.aggregate([{ $group: { _id: '$userId', count: { $sum: 1 } } }]);
    console.log(res);
    process.exit(0);
});
