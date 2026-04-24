import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js carrega .env.local automaticamente, mas o Prisma CLI não.
// Ordem de precedência: .env.local > .env (padrão do Next.js).
// Ambos os loads são best-effort — se o arquivo não existir (Vercel build),
// nada é lançado.
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ path: ".env", quiet: true });

// Em migrations usamos DATABASE_URL_UNPOOLED (direct connection do Neon,
// sem pgbouncer — evita bugs com prepared statements). Em runtime o
// PrismaClient lê DATABASE_URL (pooled) automaticamente via o adapter
// configurado em lib/db.ts.
//
// Usamos process.env direto em vez do helper env() do prisma/config porque
// esse helper LANÇA se a var estiver undefined no momento do load do config,
// quebrando `prisma generate` em ambientes onde só o client é gerado e a
// migration não roda (ex: build do Vercel, onde DATABASE_URL_UNPOOLED pode
// não estar exposto no ambiente de install).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:
      process.env.DATABASE_URL_UNPOOLED ??
      process.env.DATABASE_URL ??
      "",
  },
});
