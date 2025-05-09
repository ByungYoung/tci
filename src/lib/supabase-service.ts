import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { db, tciResults } from "@/lib/db";
import { TCIResponse, TCICalculatedResult } from "./tci-data";

/**
 * TCI 검사 결과 저장 함수
 * @param responses TCI 검사 응답 데이터
 * @param results TCI 검사 결과 데이터
 * @returns 저장된 결과의 고유 ID
 */
export const saveTCIResults = async (
  responses: TCIResponse,
  results: TCICalculatedResult
): Promise<string> => {
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
};

/**
 * TCI 검사 결과 조회 함수
 * @param resultId 결과 ID
 * @returns 저장된 TCI 검사 결과
 */
export const getTCIResultById = async (resultId: string) => {
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
};

/**
 * 결과 공유 URL 생성 함수
 * @param resultId 결과 ID
 * @returns 공유 URL 문자열
 */
export const generateShareUrl = (resultId: string): string => {
  // 현재 window 객체가 있는지 확인 (클라이언트 측에서만 작동)
  if (typeof window !== "undefined") {
    const baseUrl = window.location.origin;
    return `${baseUrl}/results/${resultId}`;
  }
  return "";
};
