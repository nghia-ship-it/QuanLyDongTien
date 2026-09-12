const mongoose = require('mongoose');
require('dotenv').config();
const { NguonNhap, CongNo, DoiTac, User } = require('./models/Database');

async function syncAll() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const users = await User.find({});
    for (let u of users) {
        let TARGET_USER_ID = u._id;
        console.log('Syncing for user', TARGET_USER_ID, u.username);

        const tenNguonList = await NguonNhap.find({ userId: TARGET_USER_ID }).distinct('tenNguon');
        let countDaiLy = 0;
        for (let ten of tenNguonList) {
            if (!ten || ten === 'Chi phA-') continue;
            const existing = await DoiTac.findOne({ userId: TARGET_USER_ID, tenDoiTac: { $regex: new RegExp(`^${ten}$`, 'i') }, loaiDoiTac: 'dai_ly' });
            if (!existing) {
                await DoiTac.create({ userId: TARGET_USER_ID, tenDoiTac: ten, loaiDoiTac: 'dai_ly' });
                countDaiLy++;
            }
        }
        console.log(`Synced ${countDaiLy} new dai_ly`);

        const khachHangList = await CongNo.find({ userId: TARGET_USER_ID }).distinct('tenDoiTac');
        let countKhachHang = 0;
        for (let ten of khachHangList) {
            if (!ten) continue;
            const existing = await DoiTac.findOne({ userId: TARGET_USER_ID, tenDoiTac: { $regex: new RegExp(`^${ten}$`, 'i') }, loaiDoiTac: 'khach_hang' });
            if (!existing) {
                await DoiTac.create({ userId: TARGET_USER_ID, tenDoiTac: ten, loaiDoiTac: 'khach_hang' });
                countKhachHang++;
            }
        }
        console.log(`Synced ${countKhachHang} new khach_hang`);
    }
    
    console.log('Done!');
    process.exit(0);
}

syncAll();
