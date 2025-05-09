/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  // 지원하는 언어 목록
  i18n: {
    defaultLocale: "ko",
    locales: ["ko", "en", "ja", "zh"],
    localeDetection: true,
  },
  /**
   * 각 페이지에서 사용할 네임스페이스를 지정합니다.
   * 여러 페이지에서 공통으로 사용하는 번역은 common 파일에 있습니다.
   */
  ns: ["common"],
  defaultNS: "common",

  // 번역 파일 경로 설정
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",
};
