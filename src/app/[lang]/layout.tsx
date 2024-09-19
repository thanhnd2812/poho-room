import "@/app/globals.css";
import type { Metadata } from "next";

import { SupportedLanguage } from "@/constant/locales";
import { getLanguage } from "@/languages";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers/providers";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { NextIntlClientProvider } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { Be_Vietnam_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import "stream-chat-react/dist/css/v2/index.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-beVietnamPro",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: { lang: SupportedLanguage };
}): Promise<Metadata> {
  const lang = params.lang as SupportedLanguage;
  const language = await getLanguage(lang);
  return {
    title: language.welcome.title,
    description: language.welcome.description,
  };
}

export default async function ProtectedRootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: SupportedLanguage };
}>) {
  unstable_setRequestLocale(params.lang);

  let messages;
  try {
    messages = (await import(`../../languages/${params.lang}.json`)).default;
  } catch (error) {
    notFound();
  }
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body className={cn(beVietnamPro.variable, "dark:bg-slate-800")}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
