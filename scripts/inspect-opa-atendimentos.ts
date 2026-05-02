/**
 * Para cada lead com opaContatoId, busca atendimentos no OPA — abertos e
 * fechados. Mostra status e quais etiquetas (tags) estão aplicadas em cada
 * atendimento.
 *
 * Uso: pnpm dlx tsx --env-file=.env.local scripts/inspect-opa-atendimentos.ts
 */

import { opaGet } from "@/lib/opa/client";
import { prisma } from "@/lib/db";

async function main() {
  // Map de telefone (sem +) -> lead
  const leads = await prisma.lead.findMany({
    where: { opaContatoId: { not: null } },
    orderBy: { createdAt: "desc" },
    select: { id: true, nome: true, telefone: true, opaContatoId: true, opaTemplateSentId: true, createdAt: true },
  });
  const byContato = new Map(leads.map((l) => [l.opaContatoId!, l]));
  const byCanalCliente = new Map(leads.map((l) => [l.telefone.replace(/^\+/, ""), l]));

  // GET /atendimento com janela de data + paginação manual via skip
  const today = new Date();
  const start = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000);
  const fmtDate = (d: Date) => d.toISOString().slice(0, 10);
  console.log(`Listando atendimentos abertos entre ${fmtDate(start)} e ${fmtDate(today)} (com paginação)\n`);

  const all: Array<Record<string, unknown>> = [];
  let skip = 0;
  const PAGE = 1000;
  while (true) {
    const r = await opaGet<unknown>("/atendimento", {
      filter: {
        dataInicialAbertura: fmtDate(start),
        dataFinalAbertura: fmtDate(today),
      },
      options: { limit: PAGE, skip },
    });
    if (!r.ok) {
      console.log("HTTP:", r.httpStatus, "Erro:", r.error);
      break;
    }
    const page = ((r.body as { data?: unknown }).data as Array<Record<string, unknown>>) ?? [];
    all.push(...page);
    console.log(`  page skip=${skip} -> ${page.length} (total acumulado ${all.length})`);
    if (page.length < PAGE) break;
    skip += PAGE;
    if (skip > 10000) {
      console.log("  abortando paginação por segurança (>10k)");
      break;
    }
  }
  console.log(`Total: ${all.length}\n`);

  // Casa com nossos leads via id_cliente._id (ou string), canal_cliente, telefone
  const matches: Array<{ atendimento: Record<string, unknown>; lead: typeof leads[0] }> = [];
  for (const a of all) {
    const idCli = a.id_cliente;
    const idCliStr = typeof idCli === "string" ? idCli : (idCli as Record<string, unknown>)?._id as string | undefined;
    const canalCli = (a.canal_cliente as string | undefined) ?? "";
    const canalCliClean = canalCli.replace(/^\+/, "").replace(/\D/g, "");

    let lead = (idCliStr && byContato.get(idCliStr)) || byCanalCliente.get(canalCliClean);
    if (lead) matches.push({ atendimento: a, lead });
  }

  if (matches.length === 0) {
    console.log("Nenhum atendimento bate com os contatos dos nossos leads.");
    console.log("Amostra dos primeiros 5 atendimentos retornados:");
    for (const a of all.slice(0, 5)) {
      const idCli = a.id_cliente;
      const idCliStr = typeof idCli === "string" ? idCli : (idCli as Record<string, unknown>)?._id;
      console.log(`  • ${a._id} id_cliente=${idCliStr} canal_cliente=${a.canal_cliente} status=${a.status} date=${a.date}`);
    }
  } else {
    console.log(`MATCHES: ${matches.length}\n`);
    for (const m of matches) {
      const a = m.atendimento;
      const tags = (a.tags as unknown[]) ?? [];
      console.log(
        `  ✓ atendimento ${a._id} status=${a.status} canal=${a.canal} date=${a.date} fim=${a.fim ?? "—"} tags=${JSON.stringify(tags)}`
      );
      console.log(`    └ lead: ${m.lead.nome} (${m.lead.telefone}) opaContatoId=${m.lead.opaContatoId}`);
    }
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
