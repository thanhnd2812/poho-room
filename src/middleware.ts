import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "./constant/locales";
import { routing } from "./i18n/routing";

const publicRoutes = ["/login", "/verify-email", "/reset-password", "/email-signup"];
const intlMiddleware = createIntlMiddleware(routing);

/**
 * Get the locale from the request
 * @param request - The request object
 * @returns The locale
 */
function getLocale(request: NextRequest): string {
  try {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const languages = new Negotiator({
      headers: negotiatorHeaders,
    }).languages();
    // Filter out any invalid language tags
    const validLanguages = languages.filter((lang) =>
      /^[a-zA-Z-]+$/.test(lang)
    );

    if (validLanguages.length === 0) {
      console.warn(
        "No valid languages found in request, falling back to default locale"
      );
      return defaultLocale;
    }

    return match(validLanguages, locales, defaultLocale);
  } catch (error) {
    console.error("Error in getLocale:", error);
    return defaultLocale;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // check if the request is for email verification, including mode=verifyEmail, oobCode=xxx

  const isEmailVerification =
    request.url.includes("mode=verifyEmail") && request.url.includes("oobCode=");
  if (isEmailVerification) {
    // redirect to the verify-email page
    const oobCode = request.url.split("oobCode=")[1];
    console.log("oobCode", oobCode);

    return NextResponse.redirect(new URL(`/verify-email?oobCode=${oobCode}`, request.url));
  }

  // Handle internationalization first
  const response = await intlMiddleware(request);

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  const isPublicRoute = locales.some((locale) =>
    publicRoutes.some((route) => pathname.startsWith(`/${locale}${route}`))
  );

  if (isPublicRoute) {
    return response;
  }

  // // Check for session cookie
  // const sessionCookie = request.cookies.get('session');
  // if (!sessionCookie && !pathname.includes('/login')) {
  //   const locale = getLocale(request);
  //   return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  // }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
