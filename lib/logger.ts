import { prisma } from "@/lib/db";

export type LogDirection = "inbound" | "outbound" | "internal";
export type LogStatus = "success" | "error" | "info";

export type LogEventInput = {
  eventType: string;
  direction: LogDirection;
  status: LogStatus;
  leadId?: string | null;
  correlationId?: string;
  requestPayload?: unknown;
  responsePayload?: unknown;
  httpStatus?: number;
  durationMs?: number;
  errorMessage?: string;
};

/**
 * Registra um evento no `data_transfer_logs` e também no console (uma linha JSON).
 *
 * Nunca lança. Se a escrita no DB falhar (ex: banco fora), loga no stderr mas
 * segue o fluxo — logging não pode quebrar o caminho feliz.
 */
export async function logEvent(input: LogEventInput): Promise<void> {
  const consoleLine = JSON.stringify({
    ts: new Date().toISOString(),
    ...input,
  });

  if (input.status === "error") {
    console.error(consoleLine);
  } else {
    console.log(consoleLine);
  }

  try {
    await prisma.dataTransferLog.create({
      data: {
        eventType: input.eventType,
        direction: input.direction,
        status: input.status,
        leadId: input.leadId ?? null,
        correlationId: input.correlationId ?? null,
        requestPayload: input.requestPayload as object | undefined,
        responsePayload: input.responsePayload as object | undefined,
        httpStatus: input.httpStatus ?? null,
        durationMs: input.durationMs ?? null,
        errorMessage: input.errorMessage ?? null,
      },
    });
  } catch (err) {
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        eventType: "logger.db.write_failed",
        status: "error",
        underlying: input.eventType,
        error: err instanceof Error ? err.message : String(err),
      })
    );
  }
}
