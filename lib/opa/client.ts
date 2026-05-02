import { request as undiciRequest } from "undici";
import type { OpaEnvelope } from "./types";

const OPA_BASE_URL = process.env.OPA_BASE_URL;
const OPA_TOKEN = process.env.OPA_TOKEN;

function requireEnv() {
  if (!OPA_BASE_URL) throw new Error("OPA_BASE_URL não configurado");
  if (!OPA_TOKEN) throw new Error("OPA_TOKEN não configurado");
  return { base: OPA_BASE_URL, token: OPA_TOKEN };
}

export type OpaCallResult<T> = {
  ok: boolean;
  httpStatus: number;
  durationMs: number;
  body: OpaEnvelope<T> | null;
  rawText?: string;
  error?: string;
};

/**
 * A API do Opa! aceita filtros via body mesmo em requests GET. O fetch nativo
 * do Node.js 24+ rejeita isso por conformidade com a spec WHATWG ("GET/HEAD
 * cannot have body"). undici.request não tem essa restrição.
 */
async function opaCall<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown
): Promise<OpaCallResult<T>> {
  const { base, token } = requireEnv();
  const url = `${base}${path}`;
  const started = Date.now();

  try {
    const res = await undiciRequest(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headersTimeout: 15_000,
      bodyTimeout: 15_000,
    });
    const durationMs = Date.now() - started;
    const rawText = await res.body.text();
    let parsed: OpaEnvelope<T> | null = null;
    try {
      parsed = rawText ? (JSON.parse(rawText) as OpaEnvelope<T>) : null;
    } catch {
      // payload não é JSON — mantém rawText pra log
    }
    const ok =
      res.statusCode >= 200 && res.statusCode < 300 && parsed?.status === "success";
    return {
      ok,
      httpStatus: res.statusCode,
      durationMs,
      body: parsed,
      rawText: parsed ? undefined : rawText,
    };
  } catch (err) {
    return {
      ok: false,
      httpStatus: 0,
      durationMs: Date.now() - started,
      body: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export function opaGet<T>(path: string, filter?: unknown) {
  // A API do Opa! aceita filtro via body mesmo em GET (padrão validado empiricamente).
  return opaCall<T>("GET", path, filter);
}

export function opaPost<T>(path: string, body: unknown) {
  return opaCall<T>("POST", path, body);
}

export function opaPut<T>(path: string, body: unknown) {
  return opaCall<T>("PUT", path, body);
}

export function opaDelete<T>(path: string) {
  return opaCall<T>("DELETE", path);
}
