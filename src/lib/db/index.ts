// 서버 전용 모듈인 postgres와 drizzle은 조건부로 가져와야 함
import * as schema from "./schema";

// 가짜 DB 객체 타입 정의
type FakeDB = {
  select: () => { from: () => { where: () => any[] } };
  insert: () => { values: () => Promise<any> };
  update: () => { set: () => { where: () => Promise<any> } };
  delete: () => { where: () => Promise<any> };
};

// 서버 사이드에서만 실행되는 코드를 격리
// eslint-disable-next-line import/no-mutable-exports
let db: any;

// 클라이언트 측에서는 서버 컴포넌트 로직을 건너뜀
if (typeof window !== "undefined") {
  // 클라이언트 측에서 사용할 가짜 DB 객체
  db = {
    select: () => ({ from: () => ({ where: () => [] }) }),
    insert: () => ({ values: () => Promise.resolve() }),
    update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
    delete: () => ({ where: () => Promise.resolve() }),
  };
} else {
  // 서버 측에서만 사용할 실제 DB 연결
  try {
    // 동적으로 필요한 모듈 가져오기 (클라이언트 번들에 포함되지 않음)
    const { drizzle } = require("drizzle-orm/postgres-js");
    const postgres = require("postgres");

    // .env.local에서 정의된 환경 변수 사용
    const postgresUrl =
      process.env.POSTGRES_URL ?? process.env.POSTGRES_PRISMA_URL;

    // 데이터베이스 연결 및 객체 생성 함수
    let db: any;

    if (!postgresUrl) {
      console.warn(
        "⚠️ 경고: POSTGRES_URL 또는 POSTGRES_PRISMA_URL 환경 변수가 설정되지 않았습니다. 개발 모드에서 가짜 데이터베이스를 사용합니다."
      );

      // 환경 변수가 없을 경우 가짜 DB 객체 사용
      db = {
        select: () => ({ from: () => ({ where: () => [] }) }),
        insert: () => ({ values: () => Promise.resolve() }),
        update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
        delete: () => ({ where: () => Promise.resolve() }),
      };
    } else {
      // 실제 데이터베이스 연결
      try {
        const sql = postgres(postgresUrl);
        db = drizzle(sql, { schema });
      } catch (error) {
        console.error("데이터베이스 연결 실패:", error);
        // 연결 실패 시 가짜 DB 반환
        db = {
          select: () => ({ from: () => ({ where: () => [] }) }),
          insert: () => ({ values: () => Promise.resolve() }),
          update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
          delete: () => ({ where: () => Promise.resolve() }),
        };
      }
    }
  } catch (error) {
    console.error("서버 컴포넌트 초기화 오류:", error);
    // 모듈 로드 실패 시 가짜 DB 객체로 폴백
    db = {
      select: () => ({ from: () => ({ where: () => [] }) }),
      insert: () => ({ values: () => Promise.resolve() }),
      update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
      delete: () => ({ where: () => Promise.resolve() }),
    };
  }
}

// 데이터베이스 객체 내보내기
export { db };

// 타입 내보내기
export type DBType = typeof db;
export * from "./schema";
