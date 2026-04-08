import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import AuthContext from "@/components/AuthContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'ar'];

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Study Planner | Elevate Your Learning",
  description: "AI-powered study time management application with Pomodoro timer, statistics, and daily planning.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className="dark">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <AuthContext>
            <div className="min-h-screen flex flex-col items-center">
                {children}
            </div>
          </AuthContext>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
