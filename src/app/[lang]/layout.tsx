import "@/app/globals.css";
import type { Metadata } from "next";

import { SupportedLanguage } from "@/constant/locales";
import { getLanguage } from "@/languages";
import { Providers } from "@/providers/providers";
import { Be_Vietnam_Pro } from "next/font/google";

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
}: Readonly<{
  children: React.ReactNode;
  params: { lang: SupportedLanguage };
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={beVietnamPro.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
