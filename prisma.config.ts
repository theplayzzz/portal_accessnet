import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Next.js carrega .env.local automaticamente, mas o Prisma CLI não.
// Ordem de precedência: .env.local > .env (padrão do Next.js).
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ path: ".env", quiet: true });

// Prisma 7 config — url do datasource agora mora aqui, não no schema.
// Usamos DATABASE_URL_UNPOOLED (direct connection do Neon) pra migrations
// porque pooled via pgbouncer tem limitações com prepared statements usados por migrate.
// Em runtime, o PrismaClient lê DATABASE_URL (pooled) automaticamente do env.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL_UNPOOLED"),
  },
});
