import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

// .env.local 파일에서 환경변수 로드
dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL이 환경 변수에 설정되지 않았습니다.");
}

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
