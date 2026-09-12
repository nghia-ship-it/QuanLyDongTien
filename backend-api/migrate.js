const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
require('dotenv').config();
const { DoanhThu, NguonNhap, CongNo, KhoHang, DoiTac } = require('./models/Database');

const TARGET_USER_ID = '6a6b32e5c002dd66cfc826e9'; // admin user

const dbPath = '../QuanLyDongTien.db';
const db = new sqlite3.Database(dbPath);

async function migrate() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // 1. DoanhThu
    db.all("SELECT * FROM doanh_thu", async (err, rows) => {
        if (err) console.error(err);
        else if (rows.length > 0) {
            const dataToSave = rows.map(r => ({
                userId: TARGET_USER_ID,
                ngayNhap: r.ngay_nhap,
                tienMat: r.tien_mat || 0,
                chuyenKhoan: r.chuyen_khoan || 0,
                tongCong: r.tong_cong || ((r.tien_mat || 0) + (r.chuyen_khoan || 0)),
                ghiChu: r.ghi_chu || ''
            }));
            await DoanhThu.insertMany(dataToSave);
            console.log(`Migrated ${dataToSave.length} DoanhThu records`);
        }

        // 2. NguonNhap
        db.all("SELECT * FROM chi_phi", async (err, cRows) => {
            if (err) {
                // maybe table is called nguon_nhap?
                db.all("SELECT * FROM nguon_nhap", async (err2, nRows) => {
                    if (!err2 && nRows.length > 0) processNguonNhap(nRows);
                });
            } else if (cRows && cRows.length > 0) {
                processNguonNhap(cRows);
            }
        });
    });

    async function processNguonNhap(rows) {
        const dataToSave = rows.map(r => ({
            userId: TARGET_USER_ID,
            tenNguon: r.ten_nguon || r.ten_chi_phi || 'Chi phí',
            soTien: r.so_tien || 0,
            ghiChu: r.ghi_chu || '',
            ngayNhap: r.ngay_nhap
        }));
        await NguonNhap.insertMany(dataToSave);
        console.log(`Migrated ${dataToSave.length} NguonNhap records`);
        
        // 3. CongNo
        db.all("SELECT * FROM cong_no", async (err, cnRows) => {
            if (!err && cnRows.length > 0) {
                const cnToSave = cnRows.map(r => ({
                    userId: TARGET_USER_ID,
                    loaiCongNo: 'khach_no',
                    tenDoiTac: r.ten_khach_hang || 'Khách',
                    soTienNo: r.so_tien_no || 0,
                    soTienDaTra: r.so_tien_da_tra || 0,
                    trangThai: r.trang_thai || 'Đang nợ'
                }));
                await CongNo.insertMany(cnToSave);
                console.log(`Migrated ${cnToSave.length} CongNo records`);
            }

            // 4. KhoHang
            db.all("SELECT * FROM kho_hang", async (err, khRows) => {
                if (!err && khRows.length > 0) {
                    const khToSave = khRows.map(r => ({
                        userId: TARGET_USER_ID,
                        tenHang: r.ten_hang,
                        soLuongTon: r.so_luong_ton || 0,
                        donVi: r.don_vi || 'cái',
                        giaNhap: r.gia_nhap || 0,
                        giaBan: r.gia_ban || 0,
                        ghiChu: r.ghi_chu || ''
                    }));
                    await KhoHang.insertMany(khToSave);
                    console.log(`Migrated ${khToSave.length} KhoHang records`);
                }

                console.log('Migration completed!');
                process.exit(0);
            });
        });
    }
}

migrate();
