import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  // locale이 undefined일 경우 'ko'를 기본값으로 사용
  const localeToUse = locale || 'ko';
  
  try {
    console.log(`Loading messages for locale: ${localeToUse}`);
    // 메시지 파일 로드
    const messages = (await import(`../public/locales/${localeToUse}/common.json`))
      .default;
    
    return {
      locale: localeToUse,
      messages: {
        // 메시지를 common 네임스페이스로 명시적으로 포함
        common: messages
      },
      timeZone: 'Asia/Seoul',
    };
  } catch (error) {
    console.error(`Error loading messages for locale: ${localeToUse}`, error);
    // 기본 메시지 반환
    return {
      locale: localeToUse,
      messages: {
        common: {}
      },
      timeZone: 'Asia/Seoul',
    };
  }
});
