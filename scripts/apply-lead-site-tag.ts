/**
 * Aplica a etiqueta LEAD SITE retroativamente em todos os atendimentos do OPA
 * que pertencem a contatos referenciados pelos nossos leads (DB).
 *
 * - Janela: últimos 30 dias (configurável via DAYS env)
 * - Match: pelo `canal_cliente` (telefone normalizado, case `xxxxx@c.us` ou cru)
 * - Idempotente: pula atendimentos que já têm a tag
 * - Funciona em atendimentos abertos (EA), aguardando (AG) e fechados (F)
 *
 * Uso:
 *   pnpm dlx tsx --env-file=.env.local scripts/apply-lead-site-tag.ts
 *   DAYS=60 pnpm dlx tsx --env-file=.env.local scripts/apply-lead-site-tag.ts  # janela maior
 *   DRY_RUN=1 pnpm dlx tsx --env-file=.env.local scripts/apply-lead-site-tag.ts  # só simula
 */

import { opaGet, opaPost } from "@/lib/opa/client";
import { prisma } from "@/lib/db";

const LEAD_SITE_TAG_ID = "69efb0958a18ecfccb5387a1";
const DAYS = Number(process.env.DAYS ?? 30);
const DRY_RUN = process.env.DRY_RUN === "1";

type Atendimento = {
  _id: string;
  status?: string;
  date?: string;
  canal_cliente?: string;
  id_cliente?: string | { _id?: string };
  tags?: Array<{ id_tag?: string }>;
};

function normalizePhone(s: string): string {
  return s.replace(/[^\d]/g, "");
}

async function fetchAllAtendimentos(days: number): Promise<Atendimento[]> {
  const today = new Date();
  const start = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const all: Atendimento[] = [];
  let skip = 0;
  const PAGE = 1000;

  console.log(`Listando atendimentos OPA entre ${fmt(start)} e ${fmt(today)}...`);
  while (true) {
    const r = await opaGet<unknown>("/atendimento", {
      filter: { dataInicialAbertura: fmt(start), dataFinalAbertura: fmt(today) },
      options: { limit: PAGE, skip },
    });
    if (!r.ok) {
      console.error(`  page skip=${skip} HTTP=${r.httpStatus} err=${r.error}`);
      break;
    }
    const page = ((r.body as { data?: unknown }).data as Atendimento[]) ?? [];
    all.push(...page);
    process.stdout.write(`  skip=${skip} +${page.length} (total ${all.length})\n`);
    if (page.length < PAGE) break;
    skip += PAGE;
    if (skip > 50_000) {
      console.error("  abortando paginação por segurança");
      break;
    }
  }
  return all;
}

async function applyTag(atendimentoId: string): Promise<boolean> {
  if (DRY_RUN) return true;
  const r = await opaPost<unknown>(
    `/atendimento/${atendimentoId}/etiqueta`,
    { tagId: LEAD_SITE_TAG_ID }
  );
  return r.ok;
}

async function main() {
  console.log(`\n=== APLY LEAD SITE TAG ${DRY_RUN ? "(DRY-RUN)" : ""} ===\n`);

  const leads = await prisma.lead.findMany({
    where: { opaContatoId: { not: null } },
    select: { id: true, nome: true, telefone: true, opaContatoId: true },
  });
  console.log(`Leads em DB com opaContatoId: ${leads.length}`);

  // Index por telefone normalizado e por opaContatoId
  const phoneToLead = new Map<string, typeof leads[0]>();
  const contatoToLead = new Map<string, typeof leads[0]>();
  for (const l of leads) {
    phoneToLead.set(normalizePhone(l.telefone), l);
    if (l.opaContatoId) contatoToLead.set(l.opaContatoId, l);
  }

  const atendimentos = await fetchAllAtendimentos(DAYS);

  // Estatísticas
  let matched = 0;
  let alreadyTagged = 0;
  let toTag: Array<{ atendimento: Atendimento; lead: typeof leads[0] }> = [];

  for (const a of atendimentos) {
    const canalCliente = normalizePhone(a.canal_cliente ?? "");
    const idCli =
      typeof a.id_cliente === "string"
        ? a.id_cliente
        : a.id_cliente?._id;
    const lead =
      (canalCliente && phoneToLead.get(canalCliente)) ||
      (idCli && contatoToLead.get(idCli));
    if (!lead) continue;
    matched++;

    const hasTag = (a.tags ?? []).some((t) => t.id_tag === LEAD_SITE_TAG_ID);
    if (hasTag) {
      alreadyTagged++;
      continue;
    }
    toTag.push({ atendimento: a, lead });
  }

  console.log(`\nResumo do match:`);
  console.log(`  atendimentos casados com leads: ${matched}`);
  console.log(`  já têm tag LEAD SITE:          ${alreadyTagged}`);
  console.log(`  precisam tag (vão ser tratados): ${toTag.length}\n`);

  if (toTag.length === 0) {
    console.log("Nada a fazer.");
    await prisma.$disconnect();
    return;
  }

  let ok = 0;
  let fail = 0;
  for (const { atendimento, lead } of toTag) {
    const status = atendimento.status ?? "?";
    const tagged = await applyTag(atendimento._id);
    if (tagged) {
      ok++;
      console.log(
        `  ✅ ${atendimento._id} status=${status} ${lead.nome} (${lead.telefone})`
      );
    } else {
      fail++;
      console.log(
        `  ❌ ${atendimento._id} status=${status} ${lead.nome} (${lead.telefone})`
      );
    }
    // Pequeno espaçamento pra não trombar com rate limit do OPA
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`\n— Resumo final —\nok:    ${ok}\nfalha: ${fail}`);
  await prisma.$disconnect();
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(2);
});
