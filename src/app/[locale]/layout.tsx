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

// 메시지 제공자 컴포넌트 분리
async function IntlProviderWrapper({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

// 레이아웃을 서버 컴포넌트로 사용
export default async function LocaleLayout({ children, params }: LayoutProps) {
  // params는 이미 해결된 객체이므로 직접 접근
  const locale = params.locale ?? defaultLocale;

  // 지원되지 않는 언어는 404 페이지로
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <IntlProviderWrapper locale={locale}>{children}</IntlProviderWrapper>
      </body>
    </html>
  );
}
