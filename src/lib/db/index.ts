import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// 환경 변수에서 데이터베이스 URL 가져오기
const databaseUrl = process.env.DATABASE_URL;

// 데이터베이스 연결 및 객체 생성 함수
let db: any;

if (!databaseUrl) {
  console.warn(
    "⚠️ 경고: DATABASE_URL 환경 변수가 설정되지 않았습니다. 개발 모드에서 가짜 데이터베이스를 사용합니다."
  );

  // 가짜 데이터베이스 객체 생성 (개발 환경용)
  db = {
    select: () => ({ from: () => ({ where: () => [] }) }),
    insert: () => ({ values: () => Promise.resolve() }),
    update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
    delete: () => ({ where: () => Promise.resolve() }),
  };
} else {
  // 실제 데이터베이스 연결
  const sql = neon(databaseUrl);
  db = drizzle(sql, { schema });
}

// 데이터베이스 객체 내보내기
export { db };

// 타입 내보내기
export type DBType = typeof db;
export * from "./schema";
