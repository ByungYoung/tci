"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { defaultLocale, locales } from "@/app/i18n-config";

// 컨텍스트 타입 정의
type LocaleContextType = {
  locale: string;
};

// 기본값으로 defaultLocale 사용
const LocaleContext = createContext<LocaleContextType>({
  locale: defaultLocale,
});

// LocaleProvider props 타입 정의
type LocaleProviderProps = {
  locale: string;
  children: ReactNode;
};

// LocaleProvider 컴포넌트
export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  // 유효한 locale 확인
  const validLocale = locales.includes(locale as any) ? locale : defaultLocale;

  return (
    <LocaleContext.Provider value={{ locale: validLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

// useLocale 훅
export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
