import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, defaultLocale } from "../i18n-config";

// 서버 컴포넌트에서 messages를 동기적으로 불러옵니다
async function getMessages(locale: string) {
  try {
    console.log(`Loading messages for locale in layout: ${locale}`);
    // 서버 측에서는 직접 파일 시스템에서 불러옵니다
    const messages = (
      await import(`../../../public/locales/${locale}/common.json`)
    ).default;

    // common 네임스페이스로 메시지 반환
    return {
      common: messages,
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return { common: {} };
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

// 레이아웃을 클라이언트 컴포넌트로 변경
export default function LocaleLayout({ children, params }: LayoutProps) {
  // 서버에서 접근할 수 있는 정적 값으로 기본 로케일 사용
  const locale = params?.locale || defaultLocale;

  // 지원되지 않는 언어는 404 페이지로
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  // 서버 컴포넌트로 메시지 로딩 로직을 분리
  const IntlProvider = async () => {
    const messages = await getMessages(locale);

    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    );
  };

  return (
    <html lang={locale}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <IntlProvider />
      </body>
    </html>
  );
}
