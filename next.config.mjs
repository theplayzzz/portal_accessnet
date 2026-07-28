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
  // nas páginas/route handlers do site.
  async rewrites() {
    return {
      beforeFiles: [
        // lg.accessnet.com.br → raiz do ManagerPro (o proxy_pass que o
        // fornecedor pediu). A raiz do subdomínio abre direto a ferramenta.
        {
          source: "/",
          has: lookingGlassHost,
          destination: `${lookingGlass.origin}${lookingGlassEmbedPath}`,
        },
        {
          source: "/:path*",
          has: lookingGlassHost,
          destination: `${lookingGlass.origin}/:path*`,
        },
        // accessnet.com.br → espelha os caminhos que o app do LG usa: o
        // documento, os scripts versionados e a API pública da ferramenta.
        {
          source: lookingGlass.document,
          destination: `${lookingGlass.origin}${lookingGlass.document}`,
        },
        {
          source: "/js/:path*",
          destination: `${lookingGlass.origin}/js/:path*`,
        },
        {
          source: "/api/looking-glass/:path*",
          destination: `${lookingGlass.origin}/api/looking-glass/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
