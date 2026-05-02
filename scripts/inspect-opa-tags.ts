/**
 * Lista as etiquetas (tags) disponíveis no OPA Suite e checa se os contatos
 * recém-criados via /api/lead têm alguma tag aplicada.
 *
 * Uso: pnpm dlx tsx --env-file=.env.local scripts/inspect-opa-tags.ts
 */

import { opaGet } from "@/lib/opa/client";
import { prisma } from "@/lib/db";

async function listTags() {
  console.log("\n=== ETIQUETAS DISPONÍVEIS NO OPA ===\n");
  const r = await opaGet<unknown>("/etiqueta/", { options: { limit: 500 } });
  console.log("HTTP:", r.httpStatus, "OK:", r.ok);
  if (!r.ok) {
    console.log("Erro:", r.error);
    console.log("Raw:", r.rawText?.slice(0, 600));
    return [];
  }
  const data = (r.body as { data?: unknown }).data;
  if (!Array.isArray(data)) {
    console.log("Resposta inesperada:", JSON.stringify(r.body).slice(0, 500));
    return [];
  }
  console.log(`Total: ${data.length} etiquetas\n`);
  for (const t of data as Array<Record<string, unknown>>) {
    const id = t._id;
    const desc = t.descricao ?? t.nome ?? t.titulo ?? "";
    const cor = t.cor ?? "";
    console.log(`  ${id}  ${cor.toString().padEnd(10)}  ${desc}`);
  }
  return data as Array<Record<string, unknown>>;
}

async function checkContact(contatoId: string, leadName: string) {
  const r = await opaGet<unknown>(`/contato/${contatoId}`);
  console.log(`\n--- ${leadName} (${contatoId}) ---`);
  console.log("HTTP:", r.httpStatus);
  if (!r.ok) {
    console.log("Erro:", r.error);
    return;
  }
  const c = (r.body as { data?: Record<string, unknown> }).data ?? {};
  console.log("nome           :", c.nome);
  console.log("lead           :", c.lead);
  console.log("classificacao  :", c.classificacao);
  console.log("etiquetas      :", JSON.stringify(c.etiquetas ?? c.tags ?? c.etiqueta ?? null));
  console.log("origem         :", c.origem);
  console.log("opt_in_opt_out :", JSON.stringify(c.opt_in_opt_out ?? null));
  console.log("__campos__     :", Object.keys(c).filter(k => /etiq|tag|origem|lead|class/i.test(k)).join(", "));
}

async function main() {
  await listTags();

  console.log("\n=== CONTATOS DOS LEADS RECENTES ===\n");
  const leads = await prisma.lead.findMany({
    where: { opaContatoId: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: { id: true, nome: true, opaContatoId: true },
  });
  for (const l of leads) {
    if (l.opaContatoId) await checkContact(l.opaContatoId, l.nome);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
