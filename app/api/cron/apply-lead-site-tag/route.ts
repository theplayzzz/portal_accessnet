/**
 * Cron job: aplica a tag "LEAD SITE" em atendimentos que tenham nascido a
 * partir de leads do site mas que ainda não foram tagueados.
 *
 * Estratégia: pega leads `opaStatus=sent` com `opaTagAppliedAt=null` enviados
 * nos últimos 30 dias, casa com atendimentos do OPA na mesma janela e aplica
 * a tag idempotentemente.
 *
 * Auth: header `Authorization: Bearer ${CRON_SECRET}`. A Vercel injeta esse
 * header automaticamente quando o endpoint é invocado pelo agendador da
 * plataforma (ver vercel.json → crons).
 *
 * Schedule: 1x ao dia às 22:00 UTC = 19:00 BRT (vercel.json crons), limitação
 * do plano Hobby da Vercel. Para polling mais frequente: (a) plano Pro libera
 * sub-diário, (b) cron externo (ex: cron-job.org) batendo neste endpoint com
 * o Bearer token, (c) trigger manual via curl quando o time quiser.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logEvent } from "@/lib/logger";
import { applyLeadSiteTagToLeads } from "@/lib/opa/leadSiteTag";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }
  const auth = req.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${expected}`) return unauthorized();

  // Pega leads com template enviado mas tag ainda não aplicada (últimos 30d)
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const leads = await prisma.lead.findMany({
    where: {
      opaStatus: { in: ["sent", "delivered", "read", "replied"] },
      opaTagAppliedAt: null,
      opaContatoId: { not: null },
      createdAt: { gte: since },
    },
    select: { id: true, telefone: true, opaContatoId: true },
    orderBy: { createdAt: "asc" },
    take: 500,
  });

  if (leads.length === 0) {
    return NextResponse.json({
      ok: true,
      message: "no leads to process",
      leadsScanned: 0,
    });
  }

  const result = await applyLeadSiteTagToLeads(leads, { windowDays: 30 });

  // Persiste opaTagAppliedAt nos leads que ganharam tag em ao menos 1 atendimento
  if (result.taggedLeadIds.length > 0) {
    await prisma.lead.updateMany({
      where: { id: { in: result.taggedLeadIds } },
      data: { opaTagAppliedAt: new Date() },
    });
  }

  await logEvent({
    eventType: "opa.tag.cron.run",
    direction: "internal",
    status: result.failed > 0 ? "error" : "success",
    requestPayload: {
      leadsScanned: result.leadsScanned,
      windowDays: 30,
    },
    responsePayload: result,
  });

  return NextResponse.json({ ok: true, ...result });
}
