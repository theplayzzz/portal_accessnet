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
};

export default nextConfig;
