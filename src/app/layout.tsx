import "./globals.css";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // [locale]/layout.tsx가 실제 HTML 구조를 처리하므로 여기서는 그냥 자식 컴포넌트 반환
  return children;
}
