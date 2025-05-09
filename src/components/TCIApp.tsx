"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "@/styles/tci.module.css";
import { TCIResponse, tciItems } from "@/lib/tci-data";
import TCITest from "@/components/TCITest";
import TCIResult from "@/components/TCIResult";
import { locales } from "@/app/i18n-config";

export default function TCIApp() {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [responses, setResponses] = useState<TCIResponse>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>(locale);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(tciItems.length / itemsPerPage);

  // 언어 변경 처리 - 강화된 버전
  const changeLanguage = (lang: string) => {
    // 유효한 로케일인지 확인
    if (!locales.includes(lang as (typeof locales)[number])) {
      console.error(`Invalid locale: ${lang}`);
      return;
    }

    console.log(`Changing language to: ${lang}`);
    setLanguage(lang);

    // Next.js App Router에서는 강제 새로고침이 더 확실하게 작동합니다
    if (typeof window !== "undefined") {
      // 현재 경로에서 로케일 부분만 바꾸기
      const segments = pathname.split("/");
      if (segments.length > 1) {
        segments[1] = lang;
        const newPath = segments.join("/");

        // 쿼리 파라미터 유지
        const params = new URLSearchParams(searchParams.toString());
        const queryString = params.toString() ? `?${params.toString()}` : "";

        const newUrl = `${newPath}${queryString}`;
        console.log(`Navigating to: ${newUrl}`);

        // 페이지를 강제로 새로고침하여 언어 변경을 확실하게 적용
        window.location.href = newUrl;
      }
    }
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 로케일이 변경되었다면 UI 상태 동기화
    if (locale && locale !== language) {
      console.log(`Syncing UI with locale: ${locale}`);
      setLanguage(locale);
    }

    // URL에서 언어 설정 확인
    const langParam = searchParams.get("lang");
    if (
      langParam &&
      locales.includes(langParam as (typeof locales)[number]) &&
      langParam !== language
    ) {
      changeLanguage(langParam);
    }
  }, [locale, searchParams]);

  // 현재 페이지의 문항들
  const currentItems = tciItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 응답 업데이트 핸들러
  const handleResponseChange = (questionId: number, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // 다음 페이지로 이동
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    } else {
      // 마지막 페이지에서 완료
      setIsCompleted(true);
    }
  };

  // 이전 페이지로 이동
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  // 현재 페이지의 모든 문항이 응답되었는지 확인
  const isCurrentPageComplete = () => {
    return currentItems.every((item) => responses[item.id] !== undefined);
  };

  // 테스트 다시 시작
  const restartTest = () => {
    setResponses({});
    setCurrentPage(1);
    setIsCompleted(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.languageSelector}>
        <button
          onClick={() => changeLanguage("ko")}
          className={`${styles.langButton} ${
            language === "ko" ? styles.active : ""
          }`}
        >
          한국어
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className={`${styles.langButton} ${
            language === "en" ? styles.active : ""
          }`}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage("ja")}
          className={`${styles.langButton} ${
            language === "ja" ? styles.active : ""
          }`}
        >
          日本語
        </button>
        <button
          onClick={() => changeLanguage("zh")}
          className={`${styles.langButton} ${
            language === "zh" ? styles.active : ""
          }`}
        >
          中文
        </button>
      </div>

      {!isCompleted ? (
        <TCITest
          currentItems={currentItems}
          responses={responses}
          onResponseChange={handleResponseChange}
          onNext={goToNextPage}
          onPrev={goToPrevPage}
          currentPage={currentPage}
          totalPages={totalPages}
          isCurrentPageComplete={isCurrentPageComplete()}
        />
      ) : (
        <TCIResult responses={responses} onRestart={restartTest} />
      )}
    </div>
  );
}
