const mongoose = require('mongoose');
require('dotenv').config();
const { DoiTac } = require('./models/Database');
mongoose.connect(process.env.MONGO_URI).then(async () => {
    const query = 'b';
    let filter = {
        userId: '6a6b32e5c002dd66cfc826e9',
        tenDoiTac: { $regex: new RegExp(query, 'i') }
    };
    filter.loaiDoiTac = 'dai_ly';
    const results = await DoiTac.find(filter).limit(10).sort({ tenDoiTac: 1 });
    console.log(results.length);
    process.exit(0);
});
