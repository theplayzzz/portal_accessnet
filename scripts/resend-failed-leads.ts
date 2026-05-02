/**
 * Reenvia template do Opa! para leads que falharam com erro `132018`
 * (newline/tab/4+ espaços nos parâmetros). A sanitização agora vive em
 * `sendLeadTemplate.ts`, então basta re-disparar.
 *
 * Uso:
 *   pnpm dlx tsx --env-file=.env.local scripts/resend-failed-leads.ts
 *   # ou para um lead específico:
 *   pnpm dlx tsx --env-file=.env.local scripts/resend-failed-leads.ts <leadId>
 *
 * Sai com código não-zero se algum reenvio falhar.
 */

import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { sendLeadTemplate } from "@/lib/opa/sendLeadTemplate";

type FailureReason = "stale" | "send_failed" | "unexpected";

async function resendOne(leadId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    console.error(`[${leadId}] not found`);
    return { ok: false, reason: "stale" satisfies FailureReason };
  }

  console.log(
    `[${leadId}] ${lead.nome} ${lead.telefone} — endereco=${JSON.stringify(lead.endereco)}`
  );

  const correlationId = randomUUID();
  const result = await sendLeadTemplate({
    leadId: lead.id,
    correlationId,
    nome: lead.nome,
    email: lead.email,
    telefoneE164: lead.telefone,
    endereco: lead.endereco,
    sourceCta: lead.sourceCta ?? "resend-script",
  });

  if (result.status === "sent") {
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        opaStatus: "sent",
        opaContatoId: result.opaContatoId,
        opaTemplateSentId: result.opaTemplateSentId,
        opaError: null,
        opaAttempts: { increment: 1 },
        opaLastAttemptAt: new Date(),
      },
    });
    console.log(`[${leadId}] ✅ sent — messageSentId=${result.opaTemplateSentId}`);
    return { ok: true };
  }

  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      opaStatus: "failed",
      opaContatoId: result.opaContatoId ?? lead.opaContatoId,
      opaError: `${result.failedAt}: ${result.error}`,
      opaAttempts: { increment: 1 },
      opaLastAttemptAt: new Date(),
    },
  });
  console.error(`[${leadId}] ❌ ${result.failedAt}: ${result.error}`);
  return { ok: false, reason: "send_failed" satisfies FailureReason };
}

async function main() {
  const explicitId = process.argv[2];

  let targets: string[];
  if (explicitId) {
    targets = [explicitId];
  } else {
    const failed = await prisma.lead.findMany({
      where: {
        opaStatus: "failed",
        OR: [
          { opaError: { contains: "Bad request" } },
          { opaError: { contains: "132018" } },
        ],
      },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });
    targets = failed.map((l) => l.id);
  }

  console.log(`Reenviando ${targets.length} lead(s)...\n`);

  let okCount = 0;
  let failCount = 0;
  for (const id of targets) {
    try {
      const r = await resendOne(id);
      if (r.ok) okCount++;
      else failCount++;
    } catch (err) {
      failCount++;
      console.error(`[${id}] 💥 unexpected:`, err);
    }
    // Pequeno espaçamento entre envios pra não trombar com rate limits
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log(`\n— Resumo —\nok:    ${okCount}\nfalha: ${failCount}`);
  await prisma.$disconnect();
  process.exit(failCount > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("fatal:", err);
  process.exit(2);
});
