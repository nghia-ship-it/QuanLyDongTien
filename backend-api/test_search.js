const mongoose = require('mongoose');
require('dotenv').config();
const { DoiTac } = require('./models/Database');
mongoose.connect(process.env.MONGO_URI).then(async () => {
    const res = await DoiTac.find({ userId: '6a6b32e5c002dd66cfc826e9', loaiDoiTac: 'dai_ly', tenDoiTac: { $regex: new RegExp('', 'i') } });
    console.log(res.length);
    process.exit(0);
});
