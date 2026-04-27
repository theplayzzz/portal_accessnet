/**
 * Helpers pra parsing e classificação de eventos do webhook do Opa! Suite.
 *
 * O formato exato dos eventos não está documentado no Postman público da Opa! e
 * a wiki foi descontinuada. Estratégia: aceitar qualquer payload, logar cru, e
 * tentar identificar campos comuns usados por plataformas de mensagem (status,
 * event, type, messageSentId, contato, metadata.leadId, etc.).
 *
 * Se a Opa! mandar um payload com formato inesperado, ele ainda é gravado em
 * data_transfer_logs e a gente afina a heurística depois sem perder evento.
 */

export type OpaWebhookClassification = {
  /** Status que mapeia pro `lead.opa_status`. Null se não conseguimos classificar. */
  newStatus: "delivered" | "read" | "replied" | "failed" | null;
  /** Data do evento (se vier no payload, senão "agora"). */
  eventAt: Date;
  /** Mensagem de erro/falha do webhook (quando aplicável). */
  errorMessage?: string;
  /** Tipo bruto do evento como veio do Opa! (pra log). */
  rawEventType: string;
};

/**
 * Tenta extrair `messageSentId` (= `lead.opa_template_sent_id`) do payload.
 * Olha em vários paths comuns.
 */
export function extractMessageSentId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;

  const candidates = [
    p.messageSentId,
    p.message_sent_id,
    (p.message as Record<string, unknown> | undefined)?.sentId,
    (p.message as Record<string, unknown> | undefined)?._id,
    (p.message as Record<string, unknown> | undefined)?.id,
    (p.data as Record<string, unknown> | undefined)?.messageSentId,
    (p.data as Record<string, unknown> | undefined)?.message_sent_id,
    p.id,
    p._id,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0) return c;
  }
  return null;
}

/**
 * Tenta extrair `leadId` do `metadata` do template/send (que nós mesmos
 * passamos no payload) ou de qualquer paths comuns de webhook.
 */
export function extractLeadId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;

  const candidates = [
    (p.metadata as Record<string, unknown> | undefined)?.leadId,
    (p.metadata as Record<string, unknown> | undefined)?.lead_id,
    (p.data as Record<string, unknown> | undefined)?.metadata
      ? ((p.data as Record<string, unknown>).metadata as Record<string, unknown>).leadId
      : undefined,
    p.leadId,
    p.lead_id,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0) return c;
  }
  return null;
}

/**
 * Tenta extrair `correlationId` similar ao leadId.
 */
export function extractCorrelationId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;

  const candidates = [
    (p.metadata as Record<string, unknown> | undefined)?.correlationId,
    (p.metadata as Record<string, unknown> | undefined)?.correlation_id,
    p.correlationId,
    p.correlation_id,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0) return c;
  }
  return null;
}

/**
 * Heurística pra classificar o evento. Olha em campos `event`, `type`,
 * `status`, `eventType` e bate contra padrões conhecidos de plataformas
 * de WhatsApp Business.
 */
export function classifyEvent(payload: unknown): OpaWebhookClassification {
  const now = new Date();

  if (!payload || typeof payload !== "object") {
    return { newStatus: null, eventAt: now, rawEventType: "unknown" };
  }
  const p = payload as Record<string, unknown>;

  // Coleta strings que podem indicar o tipo
  const indicators = [
    p.event,
    p.eventType,
    p.event_type,
    p.type,
    p.status,
    (p.data as Record<string, unknown> | undefined)?.status,
    (p.message as Record<string, unknown> | undefined)?.status,
  ]
    .filter((v): v is string => typeof v === "string")
    .map((s) => s.toLowerCase());

  const raw = indicators.join("|") || "unknown";

  // Timestamp do evento (se vier)
  let eventAt = now;
  const tsCandidate = p.timestamp ?? p.eventAt ?? p.event_at ?? p.createdAt;
  if (typeof tsCandidate === "string" || typeof tsCandidate === "number") {
    const parsed = new Date(tsCandidate);
    if (!Number.isNaN(parsed.getTime())) eventAt = parsed;
  }

  // Erro/falha
  if (indicators.some((s) => /fail|error|reject|undeliver/.test(s))) {
    const errMsg =
      (p.error as string | undefined) ??
      (p.errorMessage as string | undefined) ??
      (p.message as string | undefined) ??
      raw;
    return { newStatus: "failed", eventAt, rawEventType: raw, errorMessage: errMsg };
  }

  // Lead respondeu (mensagem inbound do contato)
  if (
    indicators.some((s) =>
      /repli|response|inbound|received|incoming|customer.*service.*open|atendimento.*abert/.test(s)
    )
  ) {
    return { newStatus: "replied", eventAt, rawEventType: raw };
  }

  // Lida
  if (indicators.some((s) => /\bread\b|seen|lida/.test(s))) {
    return { newStatus: "read", eventAt, rawEventType: raw };
  }

  // Entregue
  if (indicators.some((s) => /deliver|entreg|sent_to_device/.test(s))) {
    return { newStatus: "delivered", eventAt, rawEventType: raw };
  }

  return { newStatus: null, eventAt, rawEventType: raw };
}
