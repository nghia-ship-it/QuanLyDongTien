const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
require('dotenv').config();
const { DoanhThu, NguonNhap, DoiTac, CongNo, KhoHang } = require('./models/Database');

const OLD_TARGET_USER_ID = '6a6b32e5c002dd66cfc826e9'; // 0342 test account
const REAL_TARGET_USER_ID = '6a9d33483c955285b02936de'; // maithi account

const dbPath = '../QuanLyDongTien.db';
const db = new sqlite3.Database(dbPath);

async function fixMigration() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. Delete mistakenly migrated records from test account
    await DoanhThu.deleteMany({ userId: OLD_TARGET_USER_ID });
    await NguonNhap.deleteMany({ userId: OLD_TARGET_USER_ID });
    await DoiTac.deleteMany({ userId: OLD_TARGET_USER_ID });
    await CongNo.deleteMany({ userId: OLD_TARGET_USER_ID });
    await KhoHang.deleteMany({ userId: OLD_TARGET_USER_ID });
    console.log('Cleaned up test account records.');

    // 2. Migrate to maithi account
    db.all("SELECT * FROM DoanhThu", async (err, rows) => {
        if (err) console.error(err);
        else if (rows.length > 0) {
            const dataToSave = rows.map(r => ({
                userId: REAL_TARGET_USER_ID,
                ngayNhap: r.NgayNhap,
                tienMat: r.SoTien || 0,
                chuyenKhoan: 0,
                tongCong: r.SoTien || 0,
                ghiChu: (r.GhiChu ? r.GhiChu + ' - ' : '') + 'Migrated: ' + (r.TenNguon || '')
            }));
            await DoanhThu.insertMany(dataToSave);
            console.log(`Migrated ${dataToSave.length} DoanhThu records to maithi`);
        }

        db.all("SELECT * FROM NguonNhap", async (err2, nRows) => {
            if (err2) console.error(err2);
            else if (nRows.length > 0) {
                const dataToSave = nRows.map(r => ({
                    userId: REAL_TARGET_USER_ID,
                    tenNguon: r.TenNguon || 'Chi phí',
                    soTien: r.SoTien || 0,
                    ghiChu: r.GhiChu || '',
                    ngayNhap: r.NgayNhap
                }));
                await NguonNhap.insertMany(dataToSave);
                console.log(`Migrated ${dataToSave.length} NguonNhap records to maithi`);
                
                // Sau khi migrate, đồng bộ lại DoiTac cho maithi
                await syncDoiTac(REAL_TARGET_USER_ID);
            } else {
                await syncDoiTac(REAL_TARGET_USER_ID);
            }
        });
    });
}

async function syncDoiTac(userId) {
    const tenNguonList = await NguonNhap.find({ userId }).distinct('tenNguon');
    let countDaiLy = 0;
    for (let ten of tenNguonList) {
        if (!ten || ten === 'Chi phA-') continue;
        const existing = await DoiTac.findOne({ userId, tenDoiTac: { $regex: new RegExp(`^${ten}$`, 'i') }, loaiDoiTac: 'dai_ly' });
        if (!existing) {
            await DoiTac.create({ userId, tenDoiTac: ten, loaiDoiTac: 'dai_ly' });
            countDaiLy++;
        }
    }
    console.log(`Synced ${countDaiLy} new dai_ly for maithi`);

    const khachHangList = await CongNo.find({ userId }).distinct('tenDoiTac');
    let countKhachHang = 0;
    for (let ten of khachHangList) {
        if (!ten) continue;
        const existing = await DoiTac.findOne({ userId, tenDoiTac: { $regex: new RegExp(`^${ten}$`, 'i') }, loaiDoiTac: 'khach_hang' });
        if (!existing) {
            await DoiTac.create({ userId, tenDoiTac: ten, loaiDoiTac: 'khach_hang' });
            countKhachHang++;
        }
    }
    console.log(`Synced ${countKhachHang} new khach_hang for maithi`);

    console.log('Fix Migration completed!');
    process.exit(0);
}

fixMigration();
