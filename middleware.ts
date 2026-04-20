import { locales } from "./lib/i18n";

import { NextRequest } from "next/server";

const allowedPaths = ["/rede-movel"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (allowedPaths.includes(pathname)) return;

  const isExit = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (isExit) return;

  request.nextUrl.pathname = `/`;
  return Response.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|terms|.*\\.(?:txt|xml|ico|png|jpg|jpeg|svg|gif|webp|js|css|woff|woff2|ttf|eot)).*)'
  ]
};