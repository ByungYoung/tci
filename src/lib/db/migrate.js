// migrate.js
require("dotenv").config({ path: ".env.local" });
const { drizzle } = require("drizzle-orm/postgres-js");
const { migrate } = require("drizzle-orm/postgres-js/migrator");
const postgres = require("postgres");

const runMigration = async () => {
  const postgresUrl =
    process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
  if (!postgresUrl) {
    throw new Error(
      "POSTGRES_URL 또는 POSTGRES_PRISMA_URL이 환경변수에 설정되지 않았습니다."
    );
  }

  // SQL 연결
  const sql = postgres(postgresUrl, { max: 1 });
  const db = drizzle(sql);

  // 마이그레이션 실행
  console.log("마이그레이션을 시작합니다...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("마이그레이션이 완료되었습니다!");

  // 연결 종료
  await sql.end();
  process.exit(0);
};

runMigration().catch((err) => {
  console.error("마이그레이션 오류:", err);
  process.exit(1);
});
