import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "../../globals.css";

import { SupportedLanguage } from "@/constant/locales";
import { getLanguage } from "@/languages";
import { cn } from "@/lib/utils";
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


export default function PublicRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(beVietnamPro.variable, "dark:bg-slate-800")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="mx-auto max-w-[1400px]">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
