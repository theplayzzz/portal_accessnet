"use client";

/**
 * Captura sinais de atribuição (UTMs + click IDs + cookies de pixel) na chegada
 * do usuário, persiste em localStorage com TTL de 90 dias e devolve no submit
 * do lead. 90d casa com a janela do cookie `_gcl_aw` do gtag.js
 * (https://business.safety.google/adscookies/) e a do `_fbp/_fbc` do Meta.
 *
 * Por que não confiar só nos cookies do gtag/pixel?
 *  - ITP (Safari/iOS) apaga cookies first-party em 7 dias.
 *  - Adblock pode impedir o gtag.js de carregar e gravar `_gcl_aw`.
 *  - Sem persistência nossa, perde-se atribuição cross-session em mobile.
 *  - Enhanced Conversions for Leads e Conversions API server-side precisam
 *    do gclid/fbclid armazenado pra disparar conversão pós-fato (CRM).
 */

export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

export type ClickIds = {
  // Google Ads
  gclid?: string;
  gbraid?: string; // iOS web→app (sem ATT)
  wbraid?: string; // iOS app→web (sem ATT)
  gadSource?: string;
  gadCampaignId?: string;
  // Meta
  fbclid?: string;
  fbp?: string; // cookie _fbp do Meta Pixel
  fbc?: string; // cookie _fbc do Meta Pixel
  // Outros (mantidos pra futura ativação)
  msclkid?: string;
  ttclid?: string;
};

export type Tracking = {
  utm?: UtmParams;
  click?: ClickIds;
  landingUrl?: string;
  referrer?: string;
};

const STORAGE_KEY = "accessnet:tracking";
const TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 dias

type Stored = Tracking & { savedAt: number };

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return undefined;
  const value = match.slice(name.length + 1);
  return value ? decodeURIComponent(value) : undefined;
}

/**
 * O cookie _gcl_aw vem no formato `GCL.<timestamp>.<gclid>` — onde o gclid
 * pode conter pontos (raros, mas possíveis). Pega tudo após o segundo ponto.
 */
function extractGclidFromGclAw(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const parts = value.split(".");
  if (parts.length < 3) return undefined;
  const gclid = parts.slice(2).join(".");
  return gclid || undefined;
}

function nonEmpty<T extends Record<string, string | undefined>>(obj: T): T | undefined {
  const filtered: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== "") filtered[k] = v;
  }
  return Object.keys(filtered).length > 0 ? (filtered as T) : undefined;
}

function readUrlAndCookies(): Tracking {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const get = (k: string) => params.get(k) ?? undefined;

  const utm = nonEmpty<UtmParams>({
    source: get("utm_source"),
    medium: get("utm_medium"),
    campaign: get("utm_campaign"),
    term: get("utm_term"),
    content: get("utm_content"),
  });

  // Click IDs — preferimos URL > cookie. Se ambos faltarem, o cookie do gtag
  // ainda atua sozinho no `gtag('event','conversion')`. Persistir é redundância.
  const gclidFromUrl = get("gclid");
  const gclidFromCookie = extractGclidFromGclAw(readCookie("_gcl_aw"));

  const click = nonEmpty<ClickIds>({
    gclid: gclidFromUrl ?? gclidFromCookie,
    gbraid: get("gbraid"),
    wbraid: get("wbraid"),
    gadSource: get("gad_source"),
    gadCampaignId: get("gad_campaignid"),
    fbclid: get("fbclid"),
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
    msclkid: get("msclkid"),
    ttclid: get("ttclid"),
  });

  return {
    utm,
    click,
    landingUrl: window.location.href,
    referrer: document.referrer || undefined,
  };
}

function readStored(): Stored | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
}

function persist(tracking: Tracking): void {
  if (typeof window === "undefined") return;
  try {
    const payload: Stored = { ...tracking, savedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* localStorage indisponível — segue sem persistir */
  }
}

function hasAnySignal(t: Tracking): boolean {
  return Boolean(t.utm || t.click);
}

function hasAnyContext(t: Tracking): boolean {
  return Boolean(t.landingUrl || t.referrer);
}

/**
 * Lê tracking da URL/cookies atuais. Se houver algum sinal novo, persiste.
 * Caso contrário, devolve o último persistido (válido por 90 dias). A primeira
 * visita também persiste landing/referrer para preservar contexto de origem.
 *
 * Estratégia "first-touch wins": uma vez gravado, não sobrescreve com sessão
 * nova vazia — preserva o anúncio que originalmente trouxe o usuário.
 */
export function captureTracking(): Tracking | undefined {
  const fresh = readUrlAndCookies();
  const stored = readStored();

  if (hasAnySignal(fresh)) {
    // Merge: prioriza valores frescos, mas mantém click IDs antigos se
    // a sessão atual não trouxer (ex.: usuário voltou direto, sem gclid na URL).
    const merged: Tracking = {
      utm: fresh.utm ?? stored?.utm,
      click: { ...(stored?.click ?? {}), ...(fresh.click ?? {}) },
      landingUrl: fresh.landingUrl ?? stored?.landingUrl,
      referrer: fresh.referrer ?? stored?.referrer,
    };
    if (merged.click && Object.keys(merged.click).length === 0) merged.click = undefined;
    persist(merged);
    return merged;
  }

  if (stored) {
    const { savedAt: _omit, ...t } = stored;
    return t;
  }

  if (hasAnyContext(fresh)) {
    persist(fresh);
  }

  return hasAnySignal(fresh) || fresh.landingUrl || fresh.referrer ? fresh : undefined;
}

/**
 * @deprecated Use `captureTracking()`. Mantido por compat com código antigo.
 */
export function captureUtms(): UtmParams | undefined {
  return captureTracking()?.utm;
}
