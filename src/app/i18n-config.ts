// 지원하는 언어 목록
export const locales = ["ko", "en", "ja", "zh"] as const;

// 기본 언어 설정
export const defaultLocale = "ko" as const;

// 언어 타입 정의
export type Locale = (typeof locales)[number];
