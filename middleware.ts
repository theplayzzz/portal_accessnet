import { locales } from "./lib/i18n";
import { lookingGlass } from "./config/looking-glass.mjs";

import { NextRequest } from "next/server";

const allowedPaths = ["/rede-movel", lookingGlass.page, lookingGlass.document];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Subdomínio do Looking Glass: tudo ali é proxy reverso (ver rewrites em
  // next.config.mjs), não passa pelo roteamento de locale do site.
  if (request.headers.get("host") === lookingGlass.subdomain) return;

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
