/**
 * Rate limit in-memory por IP — suficiente pra single-instance / dev.
 * Em produção escalada, substituir por Upstash Redis (mesma interface).
 *
 * Não tenta ser preciso em nanosegundos — usa uma janela "sliding" simples
 * baseada em fila de timestamps.
 */

type Bucket = number[]; // lista de timestamps (ms)

const buckets = new Map<string, Bucket>();

/** Remove os timestamps fora da janela. */
function prune(bucket: Bucket, windowMs: number, now: number) {
  const cutoff = now - windowMs;
  while (bucket.length && bucket[0] < cutoff) {
    bucket.shift();
  }
}

/**
 * Retorna `true` se a requisição está dentro do limite e pode seguir.
 * `false` se excedeu.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs = 60_000
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = [];
    buckets.set(key, bucket);
  }
  prune(bucket, windowMs, now);
  if (bucket.length >= limit) {
    const oldest = bucket[0];
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, oldest + windowMs - now),
    };
  }
  bucket.push(now);
  return {
    allowed: true,
    remaining: limit - bucket.length,
    retryAfterMs: 0,
  };
}

/**
 * Cleanup periódico pra não vazar memória em long-running processes
 * (dev server). Executa a cada 5 minutos.
 */
if (typeof globalThis !== "undefined") {
  const gk = "__accessnet_ratelimit_cleanup__";
  const g = globalThis as unknown as Record<string, unknown>;
  if (!g[gk]) {
    g[gk] = setInterval(() => {
      const now = Date.now();
      for (const [k, v] of buckets.entries()) {
        prune(v, 60_000, now);
        if (v.length === 0) buckets.delete(k);
      }
    }, 5 * 60_000);
  }
}
