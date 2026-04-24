import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Singleton pros helpers de teste — evita múltiplas conexões ao Neon quando a
// suite roda muitos asserts em sequência.
const g = globalThis as unknown as { __e2eDb?: PrismaClient };

function make(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL não configurada");
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter, log: ["error", "warn"] });
}

export const db = g.__e2eDb ?? make();
if (!g.__e2eDb) g.__e2eDb = db;

export async function findLeadByEmail(email: string) {
  return db.lead.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });
}

export async function findLogsByLead(leadId: string) {
  return db.dataTransferLog.findMany({
    where: { leadId },
    orderBy: { createdAt: "asc" },
  });
}

export async function findLogsByCorrelation(correlationId: string) {
  return db.dataTransferLog.findMany({
    where: { correlationId },
    orderBy: { createdAt: "asc" },
  });
}

export async function deleteLeadCascade(leadId: string) {
  // Libera FK antes de apagar o lead
  await db.dataTransferLog.updateMany({
    where: { leadId },
    data: { leadId: null },
  });
  await db.lead.delete({ where: { id: leadId } }).catch(() => {
    /* lead já removido */
  });
}
