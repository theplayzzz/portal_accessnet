import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { prisma } from "@/lib/db";
import { logEvent } from "@/lib/logger";
import { leadSubmitSchema, normalizePhoneBR } from "@/lib/validation/lead";
import { sendLeadTemplate } from "@/lib/opa/sendLeadTemplate";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function getClientIp(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function POST(req: NextRequest) {
  const correlationId = randomUUID();
  const ip = getClientIp(req);
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const rateLimitPerMin = Number(process.env.LEAD_RATE_LIMIT_PER_MIN ?? 10);

  // Primeiro marca o recebimento
  await logEvent({
    eventType: "lead.submit",
    direction: "inbound",
    status: "info",
    correlationId,
    requestPayload: { ip, userAgent },
  });

  // 1. Rate limit por IP
  const rl = checkRateLimit(`lead:${ip}`, rateLimitPerMin);
  if (!rl.allowed) {
    await logEvent({
      eventType: "lead.submit",
      direction: "inbound",
      status: "error",
      correlationId,
      httpStatus: 429,
      errorMessage: `rate_limit_exceeded (retry in ${Math.ceil(rl.retryAfterMs / 1000)}s)`,
    });
    return NextResponse.json(
      { ok: false, error: "rate_limit_exceeded" },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) },
      }
    );
  }

  // 2. Parse body
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    await logEvent({
      eventType: "lead.submit",
      direction: "inbound",
      status: "error",
      correlationId,
      httpStatus: 400,
      errorMessage: "invalid_json_body",
    });
    return NextResponse.json(
      { ok: false, error: "invalid_json_body" },
      { status: 400 }
    );
  }

  // 3. Valida schema
  const parsed = leadSubmitSchema.safeParse(rawBody);
  if (!parsed.success) {
    await logEvent({
      eventType: "lead.submit",
      direction: "inbound",
      status: "error",
      correlationId,
      httpStatus: 400,
      errorMessage: "validation_failed",
      requestPayload: {
        issues: parsed.error.issues,
      },
    });
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const values = parsed.data;

  // 4. Honeypot — bots preenchem o campo `website`
  if (values.website && values.website.length > 0) {
    await logEvent({
      eventType: "lead.honeypot.triggered",
      direction: "inbound",
      status: "info",
      correlationId,
      requestPayload: { ip, userAgent, honeypotValue: values.website.slice(0, 40) },
    });
    // Finge sucesso sem gravar nada
    return NextResponse.json({ ok: true, leadId: null }, { status: 200 });
  }

  // 5. Normaliza telefone
  const telefoneE164 = normalizePhoneBR(values.telefone);

  // 6. INSERT no DB (source of truth)
  let leadId: string;
  try {
    const created = await prisma.lead.create({
      data: {
        nome: values.nome,
        email: values.email,
        telefone: telefoneE164,
        endereco: values.endereco,
        utmSource: values.utm?.source,
        utmMedium: values.utm?.medium,
        utmCampaign: values.utm?.campaign,
        utmTerm: values.utm?.term,
        utmContent: values.utm?.content,
        sourcePage: values.sourcePage,
        sourceCta: values.sourceCta,
        referrer: values.referrer,
        userAgent,
        opaStatus: "pending",
      },
      select: { id: true },
    });
    leadId = created.id;
  } catch (err) {
    await logEvent({
      eventType: "lead.db.insert",
      direction: "internal",
      status: "error",
      correlationId,
      errorMessage: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { ok: false, error: "db_insert_failed" },
      { status: 500 }
    );
  }

  await logEvent({
    eventType: "lead.db.insert",
    direction: "internal",
    status: "success",
    correlationId,
    leadId,
  });

  // 7. Dispara Opa! em "background" (best-effort). Não bloqueia a resposta.
  //    No runtime nodejs do Next.js, o await é permitido após o response,
  //    mas usamos uma promise que não é awaitada para não atrasar o cliente.
  //    Usamos waitUntil-like com Promise.resolve().then(...)
  const opaPromise = (async () => {
    try {
      const result = await sendLeadTemplate({
        leadId,
        correlationId,
        nome: values.nome,
        email: values.email,
        telefoneE164,
        endereco: values.endereco,
        sourceCta: values.sourceCta,
      });

      if (result.status === "sent") {
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            opaStatus: "sent",
            opaContatoId: result.opaContatoId,
            opaTemplateSentId: result.opaTemplateSentId,
            opaAttempts: { increment: 1 },
            opaLastAttemptAt: new Date(),
          },
        });
      } else {
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            opaStatus: "failed",
            opaContatoId: result.opaContatoId ?? null,
            opaError: `${result.failedAt}: ${result.error}`,
            opaAttempts: { increment: 1 },
            opaLastAttemptAt: new Date(),
          },
        });
      }
    } catch (err) {
      // Blindagem: qualquer erro inesperado é logado e segue
      await logEvent({
        eventType: "opa.pipeline.unexpected_error",
        direction: "internal",
        status: "error",
        correlationId,
        leadId,
        errorMessage: err instanceof Error ? err.message : String(err),
      });
      try {
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            opaStatus: "failed",
            opaError: err instanceof Error ? err.message : String(err),
            opaAttempts: { increment: 1 },
            opaLastAttemptAt: new Date(),
          },
        });
      } catch {
        /* ignore */
      }
    }
  })();

  // Em ambiente de teste/E2E aguardamos pra poder verificar os resultados na mesma request.
  // Em produção deixamos o pipeline rodar em background — user já tem 200 na mão.
  if (process.env.E2E_AWAIT_OPA === "1") {
    await opaPromise;
  } else {
    // Fire-and-forget
    opaPromise.catch(() => { /* já logado acima */ });
  }

  return NextResponse.json(
    { ok: true, leadId, correlationId },
    { status: 200 }
  );
}
