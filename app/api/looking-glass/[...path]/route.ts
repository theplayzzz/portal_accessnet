import { NextRequest } from "next/server";

import { lookingGlass } from "@/config/looking-glass.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// O traceroute do fornecedor tem teto proprio de ~30s (medido: durationMs 30014).
// Damos folga pra atravessar isso sem a funcao ser cortada antes da origem responder.
export const maxDuration = 60;

/**
 * Proxy da API do Looking Glass.
 *
 * Isto existe como Route Handler, e nao como rewrite do next.config.mjs, por um
 * motivo especifico: a API do fornecedor responde **HTTP 500 pra qualquer
 * requisicao que chegue com um header `Origin` fora da allowlist dela** — e o
 * navegador anexa `Origin` em todo POST, inclusive same-origin. Como a pagina e
 * servida pelo nosso dominio, toda consulta de usuario real saia com
 * `Origin: https://accessnet.com.br` e voltava 500, enquanto qualquer teste por
 * curl (que nao manda Origin) passava.
 *
 * Verificado, com metodo constante, em POST /api/looking-glass/public/<key>/naoexiste:
 *   sem Origin                                 -> 401
 *   Origin: https://accessnet.com.br           -> 500 {"error":"Erro interno do servidor"}
 *   Origin: https://managerpro.gsolutions...   -> 401
 *
 * A correcao definitiva e do fornecedor (incluir os nossos dominios na allowlist
 * de CORS e nao estourar excecao no callback do cors()). Enquanto isso, repassamos
 * a chamada sem o `Origin` — e de quebra sem os nossos cookies first-party, que
 * nao tem por que chegar no Apache deles.
 */

/** Headers que nao repassamos pra origem. */
const STRIP_REQUEST = new Set([
  "origin", // a causa do 500 (ver acima)
  "cookie", // cookies first-party nossos (GA/Ads) nao vao pro fornecedor
  "host",
  "connection",
  "content-length",
  "accept-encoding", // deixa o fetch negociar e entregar o corpo ja decodificado
]);

/** Headers da resposta que nao repassamos adiante. */
const STRIP_RESPONSE = new Set([
  "content-encoding", // o corpo chega aqui ja decodificado
  "content-length",
  "transfer-encoding",
  "connection",
  "keep-alive",
  "set-cookie", // sessao do fornecedor nao vira cookie do accessnet.com.br
]);

async function proxy(request: NextRequest, path: string[]) {
  // Amarra o proxy na nossa chave: o dominio nao serve de relay pra outros
  // tenants do ManagerPro.
  if (path[0] !== "public" || path[1] !== lookingGlass.key) {
    return new Response("Not found", { status: 404 });
  }

  const target = new URL(
    `${lookingGlass.origin}/api/looking-glass/${path.map(encodeURIComponent).join("/")}`
  );
  target.search = request.nextUrl.search;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!STRIP_REQUEST.has(key.toLowerCase())) headers.set(key, value);
  });

  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: "manual",
      signal: AbortSignal.timeout(55_000),
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return Response.json(
      {
        success: false,
        message: timedOut
          ? "A consulta demorou demais e foi interrompida. Tente novamente."
          : "Nao foi possivel falar com o Looking Glass agora.",
      },
      { status: timedOut ? 504 : 502, headers: { "cache-control": "no-store" } }
    );
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!STRIP_RESPONSE.has(key.toLowerCase())) responseHeaders.set(key, value);
  });
  // Consulta em roteador nunca deve ser servida de cache.
  responseHeaders.set("cache-control", "no-store");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

type Context = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, { params }: Context) {
  return proxy(request, (await params).path);
}

export async function POST(request: NextRequest, { params }: Context) {
  return proxy(request, (await params).path);
}
