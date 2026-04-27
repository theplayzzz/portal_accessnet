import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { prisma } from "@/lib/db";
import { logEvent } from "@/lib/logger";
import {
  classifyEvent,
  extractCorrelationId,
  extractLeadId,
  extractMessageSentId,
} from "@/lib/opa/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook receiver do Opa! Suite.
 *
 * Configuração no painel do Opa! (UI):
 *   URL:      https://<dominio>/api/webhook/opa
 *   Header:   x-opa-webhook-secret: <valor de OPA_WEBHOOK_SECRET>
 *   Eventos:  todos relacionados a template e atendimento
 *
 * Comportamento:
 * - Sempre retorna 200 (mesmo em payloads malformados ou não identificados).
 *   Webhooks que retornam erro são tipicamente reentregues, e a gente prefere
 *   gravar o que chegou e seguir, do que entrar em loop de retry.
 * - Sempre loga o payload bruto em `data_transfer_logs` com
 *   `event_type='opa.webhook.received'`. Isso preserva qualquer evento
 *   inesperado pra análise posterior.
 * - Tenta atualizar o `lead.opa_status` quando consegue identificar o evento
 *   (delivered/read/replied/failed) e localizar o lead via `metadata.leadId`
 *   ou `messageSentId`.
 */
export async function POST(req: NextRequest) {
  const correlationIdLocal = randomUUID();

  // 1. Auth — header secret é mandatório
  const secret = process.env.OPA_WEBHOOK_SECRET;
  if (!secret) {
    // Se a env var nem foi configurada, o webhook está desativado por segurança.
    await logEvent({
      eventType: "opa.webhook.received",
      direction: "inbound",
      status: "error",
      correlationId: correlationIdLocal,
      errorMessage: "OPA_WEBHOOK_SECRET não configurado — webhook desativado",
      httpStatus: 503,
    });
    return NextResponse.json({ ok: false, error: "webhook_disabled" }, { status: 503 });
  }

  const provided =
    req.headers.get("x-opa-webhook-secret") ??
    req.nextUrl.searchParams.get("secret");
  if (provided !== secret) {
    await logEvent({
      eventType: "opa.webhook.received",
      direction: "inbound",
      status: "error",
      correlationId: correlationIdLocal,
      errorMessage: "secret inválido",
      httpStatus: 401,
    });
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // 2. Parse body — best-effort; nunca falha por JSON ruim
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    const text = await req.text().catch(() => "");
    body = { __raw: text };
  }

  // 3. Identificação do evento + lead
  const messageSentId = extractMessageSentId(body);
  const metaLeadId = extractLeadId(body);
  const incomingCorrelation = extractCorrelationId(body) ?? correlationIdLocal;
  const classification = classifyEvent(body);

  // Resolve o lead: por leadId direto (do metadata que nós mandamos) ou por
  // messageSentId (que gravamos em opa_template_sent_id).
  let lead: { id: string } | null = null;
  if (metaLeadId) {
    lead = await prisma.lead
      .findUnique({ where: { id: metaLeadId }, select: { id: true } })
      .catch(() => null);
  }
  if (!lead && messageSentId) {
    lead = await prisma.lead
      .findFirst({
        where: { opaTemplateSentId: messageSentId },
        select: { id: true },
      })
      .catch(() => null);
  }

  // 4. Log bruto sempre
  await logEvent({
    eventType: "opa.webhook.received",
    direction: "inbound",
    status: classification.newStatus === "failed" ? "error" : "info",
    leadId: lead?.id,
    correlationId: incomingCorrelation,
    requestPayload: { body, headers: { ua: req.headers.get("user-agent") } },
    responsePayload: {
      classification,
      identified: { leadId: lead?.id, messageSentId, metaLeadId },
    },
    errorMessage: classification.errorMessage,
  });

  // 5. Atualiza o lead (best-effort)
  if (lead && classification.newStatus) {
    const data: Record<string, unknown> = {
      opaStatus: classification.newStatus,
      opaLastWebhookAt: new Date(),
    };
    if (classification.newStatus === "delivered") {
      data.opaDeliveredAt = classification.eventAt;
    } else if (classification.newStatus === "read") {
      data.opaReadAt = classification.eventAt;
    } else if (classification.newStatus === "replied") {
      data.opaRepliedAt = classification.eventAt;
    } else if (classification.newStatus === "failed") {
      data.opaError = classification.errorMessage ?? classification.rawEventType;
    }
    try {
      await prisma.lead.update({ where: { id: lead.id }, data });
    } catch (err) {
      await logEvent({
        eventType: "opa.webhook.update_failed",
        direction: "internal",
        status: "error",
        leadId: lead.id,
        correlationId: incomingCorrelation,
        errorMessage: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

// Alguns sistemas testam o endpoint com GET antes de configurar o POST.
export async function GET() {
  return NextResponse.json(
    { ok: true, info: "Opa! webhook receiver — POST only" },
    { status: 200 }
  );
}
