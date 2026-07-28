import { locales } from "./lib/i18n";
import { lookingGlass } from "./config/looking-glass.mjs";

import { NextRequest } from "next/server";

const allowedPaths = ["/rede-movel", lookingGlass.page];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Subdomínio do Looking Glass: a raiz é a ferramenta (rewrite em
  // next.config.mjs) e os assets/API não chegam aqui, ficam fora do matcher.
  // Qualquer outro caminho volta pra ferramenta em vez de cair no `[lang]` e
  // renderizar a landing page inteira sob o subdomínio.
  if (request.headers.get("host") === lookingGlass.subdomain) {
    if (pathname === "/") return;
    request.nextUrl.pathname = `/`;
    return Response.redirect(request.nextUrl);
  }

  // /lg.html só existe como documento do Looking Glass, e só com a nossa chave
  // (o rewrite também exige). Sem a chave certa não é uma rota do site: volta
  // pra home em vez de cair no `[lang]`, que casa qualquer segmento único.
  if (pathname === lookingGlass.document) {
    if (request.nextUrl.searchParams.get("key") === lookingGlass.key) return;
    request.nextUrl.pathname = `/`;
    request.nextUrl.search = "";
    return Response.redirect(request.nextUrl);
  }

  if (allowedPaths.includes(pathname)) return;

  const isExit = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (isExit) return;

  request.nextUrl.pathname = `/`;
  return Response.redirect(request.nextUrl);
}

// `js/` fica fora do middleware porque é caminho de asset do proxy do Looking
// Glass: a lista de extensões abaixo não cobre .mjs/.wasm/sem extensão, e um
// asset novo do fornecedor viraria redirect pra `/` só no nosso domínio.
// `lg.html` continua passando aqui de propósito, pela checagem de chave acima.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|terms|js/|.*\\.(?:txt|xml|ico|png|jpg|jpeg|svg|gif|webp|js|css|woff|woff2|ttf|eot)).*)'
  ]
};
