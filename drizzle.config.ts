import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

// .env.local 파일에서 환경변수 로드
dotenv.config({ path: ".env.local" });

const postgresUrl = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
if (!postgresUrl) {
  throw new Error(
    "POSTGRES_URL 또는 POSTGRES_PRISMA_URL이 환경 변수에 설정되지 않았습니다."
  );
}

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: postgresUrl,
  },
} satisfies Config;
