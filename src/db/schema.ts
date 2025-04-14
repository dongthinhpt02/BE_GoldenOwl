import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const studentScores = pgTable('student_scores', {
  sbd: varchar('sbd', { length: 20 }).primaryKey().notNull(),
  ma_ngoai_ngu: varchar('ma_ngoai_ngu'), // Chấp nhận null cho ma_ngoai_ngu
  toan: varchar('toan'), // Chấp nhận null cho toan
  ngu_van: varchar('ngu_van'),
  ngoai_ngu: varchar('ngoai_ngu'),
  vat_li: varchar('vat_li'),
  hoa_hoc: varchar('hoa_hoc'),
  sinh_hoc: varchar('sinh_hoc'),
  lich_su: varchar('lich_su'),
  dia_li: varchar('dia_li'),
  gdcd: varchar('gdcd')
});
