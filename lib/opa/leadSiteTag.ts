/**
 * Aplica a etiqueta "LEAD SITE" no(s) atendimento(s) do Opa! Suite que
 * pertencem a um conjunto de leads. Idempotente: pula atendimentos que já
 * possuem a tag.
 *
 * Limitação inerente da API pública do OPA:
 *   - `GET /atendimento` não filtra por contato/cliente — só por janela de
 *     data de abertura/encerramento. Por isso paginamos a janela inteira e
 *     casamos com nossos leads em memória pelo `canal_cliente` (telefone).
 *   - `POST /atendimento/:id/etiqueta` aceita apenas `{ tagId }` (singular)
 *     — uma chamada por tag. Multi-tag exige loop.
 */

import { opaGet, opaPost } from "./client";

export const LEAD_SITE_TAG_ID = "69efb0958a18ecfccb5387a1";

export type Atendimento = {
  _id: string;
  status?: string;
  date?: string;
  fim?: string;
  canal_cliente?: string;
  id_cliente?: string | { _id?: string };
  tags?: Array<{ id_tag?: string }>;
};

export type TaggableLead = {
  id: string;
  telefone: string; // E.164: +55...
  opaContatoId?: string | null;
};

export type TagResult = {
  leadsScanned: number;
  atendimentosFetched: number;
  matched: number;
  alreadyTagged: number;
  newlyTagged: number;
  failed: number;
  taggedLeadIds: string[]; // leads que receberam tag em ao menos 1 atendimento
};

function normalizePhone(s: string): string {
  return s.replace(/[^\d]/g, "");
}

async function fetchAtendimentosByDate(
  start: Date,
  end: Date,
  pageSize = 1000,
  maxPages = 50
): Promise<Atendimento[]> {
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const all: Atendimento[] = [];
  let skip = 0;
  for (let p = 0; p < maxPages; p++) {
    const r = await opaGet<unknown>("/atendimento", {
      filter: { dataInicialAbertura: fmt(start), dataFinalAbertura: fmt(end) },
      options: { limit: pageSize, skip },
    });
    if (!r.ok) break;
    const page = ((r.body as { data?: unknown }).data as Atendimento[]) ?? [];
    all.push(...page);
    if (page.length < pageSize) break;
    skip += pageSize;
  }
  return all;
}

async function tagAtendimento(atendimentoId: string): Promise<boolean> {
  const r = await opaPost<unknown>(
    `/atendimento/${atendimentoId}/etiqueta`,
    { tagId: LEAD_SITE_TAG_ID }
  );
  return r.ok;
}

export async function applyLeadSiteTagToLeads(
  leads: TaggableLead[],
  opts: { windowDays?: number } = {}
): Promise<TagResult> {
  const result: TagResult = {
    leadsScanned: leads.length,
    atendimentosFetched: 0,
    matched: 0,
    alreadyTagged: 0,
    newlyTagged: 0,
    failed: 0,
    taggedLeadIds: [],
  };

  if (leads.length === 0) return result;

  const phoneToLead = new Map<string, TaggableLead>();
  const contatoToLead = new Map<string, TaggableLead>();
  for (const l of leads) {
    phoneToLead.set(normalizePhone(l.telefone), l);
    if (l.opaContatoId) contatoToLead.set(l.opaContatoId, l);
  }

  const days = opts.windowDays ?? 30;
  const today = new Date();
  const start = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
  const atendimentos = await fetchAtendimentosByDate(start, today);
  result.atendimentosFetched = atendimentos.length;

  const taggedSet = new Set<string>();

  for (const a of atendimentos) {
    const canalCliente = normalizePhone(a.canal_cliente ?? "");
    const idCli =
      typeof a.id_cliente === "string" ? a.id_cliente : a.id_cliente?._id;

    const lead =
      (canalCliente && phoneToLead.get(canalCliente)) ||
      (idCli && contatoToLead.get(idCli));
    if (!lead) continue;
    result.matched++;

    const hasTag = (a.tags ?? []).some((t) => t.id_tag === LEAD_SITE_TAG_ID);
    if (hasTag) {
      result.alreadyTagged++;
      taggedSet.add(lead.id);
      continue;
    }

    const ok = await tagAtendimento(a._id);
    if (ok) {
      result.newlyTagged++;
      taggedSet.add(lead.id);
    } else {
      result.failed++;
    }
    // Pequeno espaçamento contra rate limit do OPA
    await new Promise((r) => setTimeout(r, 200));
  }

  result.taggedLeadIds = [...taggedSet];
  return result;
}
