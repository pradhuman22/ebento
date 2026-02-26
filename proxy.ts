import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PROTECTED_ROUTES = [
  "/events",
  "/dashboard",
  "/create",
  "/settings",
  "/billing",
] as const;

const AUTH_ROUTES = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
] as const;

const API_AUTH_PREFIX = "/api/auth";

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const sessionCookie = getSessionCookie(req);

  const isLoggedIn = Boolean(sessionCookie);
  const pathname = nextUrl.pathname;

  const isApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX);
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  const isAuthRoute = AUTH_ROUTES.includes(
    pathname as (typeof AUTH_ROUTES)[number]
  );
  if (isAuthRoute) {
    return isLoggedIn
      ? NextResponse.redirect(new URL("/dashboard", nextUrl))
      : NextResponse.next();
  }

  if (pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isProtectedRoute = PROTECTED_ROUTES.includes(
    pathname as (typeof PROTECTED_ROUTES)[number]
  );

  if (isProtectedRoute && !isLoggedIn) {
    // Build a safe internal callback URL for post-login redirect
    let callbackUrl = pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return NextResponse.redirect(
      new URL(`/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
