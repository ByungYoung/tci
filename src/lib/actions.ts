"use server";

import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { tciResults } from "@/lib/db/schema";
import { TCIResponse, TCICalculatedResult } from "./tci-data";

/**
 * TCI 검사 결과 저장 함수 (서버 액션)
 * @param responses TCI 검사 응답 데이터
 * @param results TCI 검사 결과 데이터
 * @returns 저장된 결과의 고유 ID
 */
export async function saveTCIResultsAction(
  responses: TCIResponse,
  results: TCICalculatedResult
): Promise<string> {
  try {
    // 고유 ID 생성
    const resultId = uuidv4();

    // Drizzle ORM으로 결과 저장
    await db.insert(tciResults).values({
      id: resultId,
      responses,
      results,
      createdAt: new Date(),
    });

    return resultId;
  } catch (error) {
    console.error("Error saving TCI results:", error);
    throw new Error("Failed to save TCI results");
  }
}

/**
 * TCI 검사 결과 조회 함수 (서버 액션)
 * @param resultId 결과 ID
 * @returns 저장된 TCI 검사 결과
 */
export async function getTCIResultByIdAction(resultId: string) {
  try {
    // Drizzle ORM으로 결과 조회
    const results = await db
      .select()
      .from(tciResults)
      .where(eq(tciResults.id, resultId));

    return results[0] || null;
  } catch (error) {
    console.error("Error fetching TCI result:", error);
    throw new Error("Failed to fetch TCI result");
  }
}
