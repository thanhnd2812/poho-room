import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "../../globals.css";

import { verifySession } from "@/actions/verify-session-action";
import { SupportedLanguage } from "@/constant/locales";
import { getLanguage } from "@/languages";
import { Be_Vietnam_Pro } from "next/font/google";
import { redirect } from "next/navigation";

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
  const { lang } = params;

  const isAuthenticated = await verifySession();

  if (!isAuthenticated) {
    redirect(`/${lang}/login`);
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={beVietnamPro.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
