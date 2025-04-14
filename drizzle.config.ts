import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: 'src/db/schema.ts',
  out: '../drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Đảm bảo rằng DATABASE_URL được định nghĩa trong .env
  },
});
