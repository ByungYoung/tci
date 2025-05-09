import { TCIResponse, TCICalculatedResult } from "./tci-data";
import { saveTCIResultsAction, getTCIResultByIdAction } from "./actions";

/**
 * TCI 검사 결과 저장 함수
 * 클라이언트 측에서 서버 액션을 호출하는 래퍼
 * @param responses TCI 검사 응답 데이터
 * @param results TCI 검사 결과 데이터
 * @returns 저장된 결과의 고유 ID
 */
export const saveTCIResults = async (
  responses: TCIResponse,
  results: TCICalculatedResult
): Promise<string> => {
  try {
    return await saveTCIResultsAction(responses, results);
  } catch (error) {
    console.error("Error saving TCI results:", error);
    throw new Error("Failed to save TCI results");
  }
};

/**
 * TCI 검사 결과 조회 함수
 * 클라이언트 측에서 서버 액션을 호출하는 래퍼
 * @param resultId 결과 ID
 * @returns 저장된 TCI 검사 결과
 */
export const getTCIResultById = async (resultId: string) => {
  try {
    return await getTCIResultByIdAction(resultId);
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
