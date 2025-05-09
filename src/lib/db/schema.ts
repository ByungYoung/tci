import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  json,
  uuid,
  unique,
  varchar,
  primaryKey,
  boolean,
} from "drizzle-orm/pg-core";

// 사용자 테이블
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// TCI 검사 결과 테이블
export const tciResults = pgTable("tci_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  responses: json("responses").notNull(), // TCI 응답 데이터 (문항별 응답)
  scores: json("scores").notNull(), // 계산된 점수
  createdAt: timestamp("created_at").defaultNow().notNull(),
  testLanguage: varchar("test_language", { length: 2 }).notNull().default("ko"),
  isPublic: boolean("is_public").default(false),
  shareToken: uuid("share_token").defaultRandom(),
});

// 국제화 문항 테이블
export const tciItems = pgTable("tci_items", {
  id: serial("id").primaryKey(),
  itemCode: varchar("item_code", { length: 10 }).notNull(),
  category: varchar("category", { length: 10 }).notNull(), // NS, HA, RD, PS, SD, CO, ST
  textKo: text("text_ko").notNull(),
  textEn: text("text_en").notNull(),
  textJa: text("text_ja"),
  textZh: text("text_zh"),
  itemOrder: integer("item_order").notNull(),
});

// 피드백 테이블
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  content: text("content").notNull(),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
