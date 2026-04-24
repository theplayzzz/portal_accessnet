import { NextRequest, NextResponse } from "next/server";
import { logEvent } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Endpoint best-effort que o modal chama via navigator.sendBeacon quando
 * o submit principal falha todas as tentativas (ex: backend completamente fora).
 */
export async function POST(req: NextRequest) {
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    try {
      const text = await req.text();
      body = { raw: text };
    } catch {
      body = null;
    }
  }

  await logEvent({
    eventType: "lead.submit.client_gave_up",
    direction: "inbound",
    status: "error",
    requestPayload: body,
    errorMessage: "client desistiu após retry",
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
