import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "./constant/locales";
import { getSession } from "./lib/session";


const publicRoutes = ["/login", "/verify-email", "/reset-password"];

/**
 * Get the locale from the request
 * @param request - The request object
 * @returns The locale
 */
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, locales, defaultLocale);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Skip API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Redirect to the correct locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If the pathname doesn't have a locale, redirect with locale
  const locale = getLocale(request);
  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  const isPublicRoute = locales.some((locale) =>
    publicRoutes.some((route) => pathname.startsWith(`/${locale}${route}`))
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // // Check if this is a reset password request
  // if (
  //   searchParams.get("mode") === "resetPassword" &&
  //   searchParams.has("oobCode") &&
  //   searchParams.has("apiKey")
  // ) {
  //   // This is a reset password request
  //   const oobCode = searchParams.get("oobCode");
  //   const redirectUrl = `/${locale}/verify-email?code=${oobCode}`;
  //   return NextResponse.redirect(new URL(redirectUrl, request.url));
  // }

  
  const session = await getSession();
  if (!session && !pathname.startsWith(`/${locale}/login`)) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }
  if (session && pathname.startsWith(`/${locale}/login`)) {
    return NextResponse.redirect(new URL(`/${locale}/`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
