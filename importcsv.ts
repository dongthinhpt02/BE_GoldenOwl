import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { db } from '../GoldenOwl/src/db/index'; // Đảm bảo db được khởi tạo đúng
import { studentScores } from '../GoldenOwl/src/db/schema'; // Đảm bảo đường dẫn đúng

const filePath = path.resolve(__dirname, 'data/diem_thi_thpt_2024.csv'); // Đường dẫn đến file CSV

// Chức năng để chèn vào bảng theo từng batch
async function insertBatch(data: any[]) {
  const batchSize = 1000; // Kích thước batch
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await db.insert(studentScores).values(batch);
    console.log(`Batch ${Math.floor(i / batchSize) + 1} đã được chèn`);
  }
}

// Đọc và xử lý dữ liệu từ CSV
const processCSV = () => {
  const studentData: any[] = [];
  
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const sbd = row['sbd']?.trim();
      if (!sbd) return; // Bỏ qua nếu không có SBD

      // Tạo đối tượng dữ liệu để chèn vào bảng
      const studentRecord = {
        sbd: sbd,
        ma_ngoai_ngu: row['ma_ngoai_ngu']?.trim() || null,
        toan: row['toan']?.trim() || null,
        ngu_van: row['ngu_van']?.trim() || null,
        ngoai_ngu: row['ngoai_ngu']?.trim() || null,
        vat_li: row['vat_li']?.trim() || null,
        hoa_hoc: row['hoa_hoc']?.trim() || null,
        sinh_hoc: row['sinh_hoc']?.trim() || null,
        lich_su: row['lich_su']?.trim() || null,
        dia_li: row['dia_li']?.trim() || null,
        gdcd: row['gdcd']?.trim() || null,
      };

      studentData.push(studentRecord);
    })
    .on('end', async () => {
      console.log(`Đọc xong file CSV. Tổng số bản ghi: ${studentData.length}`);
      await insertBatch(studentData);
      console.log('Chèn dữ liệu hoàn tất!');
    })
    .on('error', (err) => {
      console.error('Lỗi khi xử lý CSV:', err);
    });
};

processCSV();
