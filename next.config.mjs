import {
  lookingGlass,
  lookingGlassEmbedPath,
} from "./config/looking-glass.mjs";

/** Requisições que chegam pelo subdomínio dedicado do Looking Glass. */
const lookingGlassHost = [{ type: "host", value: lookingGlass.subdomain }];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prisma 7 + pnpm: bundlar @prisma/client quebra a resolução de transitivos
  // (@prisma/client-runtime-utils) no serverless da Vercel. Marcando como external,
  // o Node resolve pelo node_modules em runtime usando hoisting do pnpm.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
  // Imagens servidas cruas do Vercel Blob (via /api/blob-img), já dimensionadas na
  // origem. Desliga o otimizador da Vercel para não gastar transformações cobradas —
  // este site não precisa de redimensionamento/AVIF on-the-fly.
  images: { unoptimized: true },
  // Proxy reverso do Looking Glass (ver config/looking-glass.mjs). `beforeFiles`
  // roda antes do roteamento do App Router, então nenhuma dessas rotas encosta
  // nas páginas do site.
  //
  // Só o conteúdo estático passa por aqui. A API fica no Route Handler
  // app/api/looking-glass/[...path]/route.ts, que precisa remover o header
  // `Origin` antes de repassar — a API do fornecedor devolve 500 quando ele vem.
  //
  // Todas as regras são explícitas de propósito: um `/:path*` no host do LG
  // espelharia o painel inteiro do ManagerPro (inclusive a tela de login do NOC)
  // sob o nosso domínio, e um `/js/:path*` entregaria o namespace /js/ inteiro
  // do accessnet.com.br pro fornecedor. Se eles publicarem um asset novo, ele
  // precisa ser adicionado aqui — falha visível é melhor que espelho aberto.
  async rewrites() {
    return {
      beforeFiles: [
        // lg.accessnet.com.br → a raiz do subdomínio abre direto a ferramenta.
        {
          source: "/",
          has: lookingGlassHost,
          destination: `${lookingGlass.origin}${lookingGlassEmbedPath}`,
        },
        // Documento do LG, só com a nossa chave: o domínio não serve de relay
        // pra outros tenants do ManagerPro.
        {
          source: lookingGlass.document,
          has: [{ type: "query", key: "key", value: lookingGlass.key }],
          destination: `${lookingGlass.origin}${lookingGlass.document}`,
        },
        // Assets do LG (versionados por querystring pelo fornecedor).
        {
          source: "/js/lg.js",
          destination: `${lookingGlass.origin}/js/lg.js`,
        },
        {
          source: "/js/lg-graph.js",
          destination: `${lookingGlass.origin}/js/lg-graph.js`,
        },
      ],
    };
  },
};

export default nextConfig;
