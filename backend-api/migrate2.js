const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
require('dotenv').config();
const { DoanhThu, NguonNhap } = require('./models/Database');

const TARGET_USER_ID = '6a6b32e5c002dd66cfc826e9'; // admin user

const dbPath = '../QuanLyDongTien.db';
const db = new sqlite3.Database(dbPath);

async function migrate() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. DoanhThu
    db.all("SELECT * FROM DoanhThu", async (err, rows) => {
        if (err) console.error(err);
        else if (rows.length > 0) {
            const dataToSave = rows.map(r => ({
                userId: TARGET_USER_ID,
                ngayNhap: r.NgayNhap,
                tienMat: r.SoTien || 0,
                chuyenKhoan: 0,
                tongCong: r.SoTien || 0,
                ghiChu: (r.GhiChu ? r.GhiChu + ' - ' : '') + 'Migrated: ' + (r.TenNguon || '')
            }));
            await DoanhThu.insertMany(dataToSave);
            console.log(`Migrated ${dataToSave.length} DoanhThu records`);
        }

        // 2. NguonNhap
        db.all("SELECT * FROM NguonNhap", async (err2, nRows) => {
            if (err2) console.error(err2);
            else if (nRows.length > 0) {
                const dataToSave = nRows.map(r => ({
                    userId: TARGET_USER_ID,
                    tenNguon: r.TenNguon || 'Chi phí',
                    soTien: r.SoTien || 0,
                    ghiChu: r.GhiChu || '',
                    ngayNhap: r.NgayNhap
                }));
                await NguonNhap.insertMany(dataToSave);
                console.log(`Migrated ${dataToSave.length} NguonNhap records`);
            }

            console.log('Migration completed!');
            process.exit(0);
        });
    });
}

migrate();
