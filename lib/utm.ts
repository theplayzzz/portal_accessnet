"use client";

export type UtmParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

const STORAGE_KEY = "leadUtms";

/**
 * Lê UTMs da URL atual. Se não houver, retorna undefined.
 * Tem efeito colateral: persiste em sessionStorage pra recuperar mais tarde.
 */
export function captureUtms(): UtmParams | undefined {
  if (typeof window === "undefined") return undefined;

  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};
  const keys: Array<keyof UtmParams> = [
    "source",
    "medium",
    "campaign",
    "term",
    "content",
  ];

  for (const k of keys) {
    const v = params.get(`utm_${k}`);
    if (v) utm[k] = v;
  }

  const hasAny = Object.keys(utm).length > 0;
  if (hasAny) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    } catch {
      // sessionStorage indisponível (privado, cookies desativados) — tudo bem
    }
    return utm;
  }

  // Sem UTMs na URL — tenta recuperar o último capturado na sessão
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as UtmParams;
  } catch {
    /* ignore */
  }

  return undefined;
}
