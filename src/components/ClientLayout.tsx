"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { LocaleProvider } from "./LocaleContext";

interface ClientLayoutProps {
  locale: string;
  messages: any;
  children: ReactNode;
}

export default function ClientLayout({
  locale,
  messages,
  children,
}: ClientLayoutProps) {
  return (
    <LocaleProvider locale={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleProvider>
  );
}
