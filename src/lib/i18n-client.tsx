"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

let isInitialized = false;

export function useClientTranslation() {
  const locale = useLocale();
  const [isI18nInitialized, setIsI18nInitialized] = useState(isInitialized);

  useEffect(() => {
    const initI18n = async () => {
      if (!isInitialized) {
        try {
          // 현재 로케일에 맞는 번역 파일 동적 로드
          const resources = {
            ko: {
              common: (await import("../../public/locales/ko/common.json"))
                .default,
            },
            en: {
              common: (await import("../../public/locales/en/common.json"))
                .default,
            },
            ja: {
              common: (await import("../../public/locales/ja/common.json"))
                .default,
            },
            zh: {
              common: (await import("../../public/locales/zh/common.json"))
                .default,
            },
          };

          await i18n.use(initReactI18next).init({
            resources,
            lng: locale,
            fallbackLng: "ko",
            interpolation: {
              escapeValue: false,
            },
            defaultNS: "common",
          });

          isInitialized = true;
          setIsI18nInitialized(true);
        } catch (error) {
          console.error("i18n initialization error:", error);
        }
      }
    };

    initI18n();
  }, [locale]);

  return {
    t: i18n.t.bind(i18n),
    i18n,
    isInitialized: isI18nInitialized,
    locale,
  };
}
