import { redirect } from 'next/navigation';
import { defaultLocale } from './i18n-config';

// 루트 경로는 기본 로케일로 리디렉션
export default function Home() {
  redirect(`/${defaultLocale}`);
}
