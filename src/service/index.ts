// src/service/index.ts

import { db, studentScores } from '../db';
import { eq } from 'drizzle-orm';

const SUBJECTS = [
    'toan',
    'ngu_van',
    'ngoai_ngu',
    'vat_li',
    'hoa_hoc',
    'sinh_hoc',
    'lich_su',
    'dia_li',
    'gdcd'
];



export async function findAllScoresBySBD(sbd: string) {
    // Tìm kiếm thông tin học sinh
    const student = await db.query.studentScores.findFirst({
        where: eq(studentScores.sbd, sbd)
    });

    if (!student) return null; // Trả về null nếu không tìm thấy học sinh

    // Tạo đối tượng chứa điểm cho mỗi môn
    const scoreMap: Record<string, string | null> = {
        toan: student.toan ?? null,
        ngu_van: student.ngu_van ?? null,
        ngoai_ngu: student.ngoai_ngu ?? null,
        vat_li: student.vat_li ?? null,
        hoa_hoc: student.hoa_hoc ?? null,
        sinh_hoc: student.sinh_hoc ?? null,
        lich_su: student.lich_su ?? null,
        dia_li: student.dia_li ?? null,
        gdcd: student.gdcd ?? null,
    };

    // Trả về kết quả
    return {
        sbd: student.sbd,
        ma_ngoai_ngu: student.ma_ngoai_ngu,
        scores: scoreMap,
    };
}
// Hàm phân loại điểm của học sinh vào các mức
function categorizeScore(score: any): string {
    if (score >= good_grade) return 'Good';
    if (score >= average_grade) return 'Quite';
    if (score >= bad_grade) return 'Average';
    return 'Poor';
}

// Dịch vụ để lấy điểm và phân loại cho tất cả học sinh theo từng môn học
// Các mức điểm để phân loại
const good_grade = 8;    // Mức điểm "Good"
const average_grade = 6; // Mức điểm "Quite"
const bad_grade = 4;     // Mức điểm "Average"

// Phân loại điểm
export async function categorizeAllScores() {
    const allScores = await db.query.studentScores.findMany();

    if (!allScores || allScores.length === 0) {
        return null;
    }

    // Khởi tạo đối tượng chứa kết quả phân loại điểm cho từng môn học
    const scoreSummary: Record<string, { [key: string]: number }> = {};

    // Các môn học, có thể lấy từ schema của bạn hoặc định nghĩa cố định
    const SUBJECTS = ['toan', 'ngu_van', 'ngoai_ngu', 'vat_li', 'hoa_hoc', 'sinh_hoc', 'lich_su', 'dia_li', 'gdcd'];

    SUBJECTS.forEach(subject => {
        scoreSummary[subject] = {
            Good: 0,
            Quite: 0,
            Average: 0,
            Poor: 0
        };
    });

    // Phân loại và đếm số học sinh ở từng mức điểm cho mỗi môn
    allScores.forEach((scoreRecord) => {
        SUBJECTS.forEach(subject => {
            const score = (scoreRecord as Record<string, string | null>)[subject] ? (scoreRecord as Record<string, string | null>)[subject]!.toString().trim() : null;
            const category = categorizeScore(score);

            if (scoreSummary[subject]) {
                scoreSummary[subject][category]++;
            }
        });
    });

    return scoreSummary;
}

// Các môn Toán, Lý, Hóa
const targetSubjects = ['toan', 'vat_li', 'hoa_hoc'];

export async function findTop10StudentsByTotalScore() {
    const allScores = await db.query.studentScores.findMany();

    if (!allScores || allScores.length === 0) {
        return null; // Nếu không có dữ liệu, trả về null
    }

    // Khởi tạo đối tượng để lưu điểm tổng cho mỗi học sinh
    const studentTotalScores: Record<string, number> = {};

    allScores.forEach((scoreRecord) => {
        let totalScore = 0;
        
        // Kiểm tra và tính tổng điểm cho các môn Toán, Lý, Hóa
        targetSubjects.forEach(subject => {
            const score = (scoreRecord as Record<typeof targetSubjects[number], string | null>)[subject] 
                ? parseFloat((scoreRecord as Record<typeof targetSubjects[number], string | null>)[subject]!) 
                : 0; // Nếu điểm null, mặc định là 0
            totalScore += score; // Cộng điểm cho tổng điểm
        });

        // Lưu tổng điểm của học sinh vào đối tượng studentTotalScores
        studentTotalScores[scoreRecord.sbd] = totalScore;
    });

    // Sắp xếp học sinh theo tổng điểm giảm dần và lấy 10 học sinh có tổng điểm cao nhất
    const top10Students = Object.entries(studentTotalScores)
        .map(([sbd, totalScore]) => ({ sbd, totalScore }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10);

    return top10Students;
}
