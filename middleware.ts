import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./src/app/i18n-config";

// 미들웨어는 모든 요청에 대해 실행됩니다
export function middleware(request: NextRequest) {
  // 현재 요청된 경로에서 locale 정보를 확인
  const pathname = request.nextUrl.pathname;
  
  console.log(`Middleware handling path: ${pathname}`);
  
  // 루트 경로인 경우만 기본 언어로 리다이렉트
  if (pathname === "/") {
    console.log("Root path detected, redirecting to default locale");
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  
  // 이미 locale 경로를 가지고 있으면 더 이상 처리하지 않음
  // 이미 locale 경로를 가지고 있는지 확인
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    console.log(`Path already has locale: ${pathname}`);
    return NextResponse.next(); // 이미 locale이 있으면 계속 진행
  }
  
  // locale이 없는 경우에만 추가
  // 정적 파일 및 API 경로는 제외
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname.includes('.')) {
    console.log(`Skipping redirect for resource: ${pathname}`);
    return NextResponse.next();
  }
  
  console.log(`Adding locale to path: ${pathname} -> /${defaultLocale}${pathname}`);
  return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
}

// 특정 경로에 대해서만 미들웨어가 실행되도록 설정
export const config = {
  // 정적 자산(static files)과 API 경로는 제외
  matcher: ["/((?!api|_next/static|_next/image|_next/script|favicon.ico).*)"],
};
