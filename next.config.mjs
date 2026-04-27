/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prisma 7 + pnpm: bundlar @prisma/client quebra a resolução de transitivos
  // (@prisma/client-runtime-utils) no serverless da Vercel. Marcando como external,
  // o Node resolve pelo node_modules em runtime usando hoisting do pnpm.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
};

export default nextConfig;
