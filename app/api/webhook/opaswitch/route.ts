import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { logEvent } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

async function readPayload(req: NextRequest) {
  const raw = await req.text().catch(() => "");

  if (!raw) {
    return { body: null, rawBody: null, parseError: null };
  }

  try {
    return { body: JSON.parse(raw) as unknown, rawBody: raw, parseError: null };
  } catch (err) {
    return {
      body: { __raw: raw },
      rawBody: raw,
      parseError: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Receiver bruto para webhooks do OpaSwitch/Opa! Suite.
 *
 * Por enquanto o contrato é deliberadamente simples:
 * - recebe qualquer POST;
 * - grava payload e metadados básicos em `data_transfer_logs`;
 * - responde 200 com `{ ok: true }`.
 *
 * A análise/classificação do formato fica para depois, quando tivermos exemplos
 * reais de payload gravados no banco.
 */
export async function POST(req: NextRequest) {
  const correlationId = randomUUID();
  const startedAt = Date.now();
  const { body, rawBody, parseError } = await readPayload(req);

  await logEvent({
    eventType: "opaswitch.webhook.received",
    direction: "inbound",
    status: parseError ? "error" : "info",
    correlationId,
    requestPayload: {
      body,
      rawBody,
      parseError,
      headers: {
        contentType: req.headers.get("content-type"),
        userAgent: req.headers.get("user-agent"),
        opaEvent: req.headers.get("x-opa-event"),
        opaswitchEvent: req.headers.get("x-opaswitch-event"),
      },
      ip: getClientIp(req),
      url: req.nextUrl.pathname,
      query: Object.fromEntries(req.nextUrl.searchParams.entries()),
    },
    responsePayload: { ok: true },
    httpStatus: 200,
    durationMs: Date.now() - startedAt,
    errorMessage: parseError ?? undefined,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json(
    { ok: true, info: "OpaSwitch webhook receiver - POST only" },
    { status: 200 }
  );
}
