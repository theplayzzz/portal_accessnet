// Investiga leads e logs de transferência para entender por que conversões
// não chegaram no Meta/Google Ads.
// Roda com: pnpm node --env-file=.env.local scripts/inspect-leads.mjs

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
});

function fmt(d) {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toISOString().replace("T", " ").replace(/\..+/, "Z");
}

async function main() {
  const sinceArg = process.argv[2] || "2026-04-29";

  console.log(`\n========== LEADS desde ${sinceArg} ==========\n`);
  const leads = await pool.query(
    `SELECT id, created_at, nome, email, telefone, endereco,
            utm_source, utm_medium, utm_campaign, utm_term, utm_content,
            source_cta, source_page, referrer, user_agent,
            opa_contato_id, opa_template_sent_id, opa_status, opa_error,
            opa_attempts, opa_last_attempt_at,
            opa_delivered_at, opa_read_at, opa_replied_at, opa_last_webhook_at
       FROM leads
      WHERE created_at >= $1::timestamptz
      ORDER BY created_at ASC`,
    [sinceArg]
  );
  console.log(`Total: ${leads.rows.length} leads`);
  for (const l of leads.rows) {
    console.log("\n--- LEAD ---");
    console.log(`id            : ${l.id}`);
    console.log(`createdAt     : ${fmt(l.created_at)}`);
    console.log(`nome          : ${l.nome}`);
    console.log(`email         : ${l.email}`);
    console.log(`telefone      : ${l.telefone}`);
    console.log(`endereco      : ${l.endereco}`);
    console.log(`utm           : src=${l.utm_source ?? "—"} med=${l.utm_medium ?? "—"} camp=${l.utm_campaign ?? "—"} term=${l.utm_term ?? "—"} content=${l.utm_content ?? "—"}`);
    console.log(`source        : cta=${l.source_cta ?? "—"} page=${l.source_page ?? "—"} ref=${l.referrer ?? "—"}`);
    console.log(`userAgent     : ${(l.user_agent ?? "—").slice(0, 100)}`);
    console.log(`opa           : status=${l.opa_status ?? "—"} attempts=${l.opa_attempts} contato=${l.opa_contato_id ?? "—"} sent=${l.opa_template_sent_id ?? "—"}`);
    console.log(`opa timestamps: lastAttempt=${fmt(l.opa_last_attempt_at)} delivered=${fmt(l.opa_delivered_at)} read=${fmt(l.opa_read_at)} replied=${fmt(l.opa_replied_at)} lastWebhook=${fmt(l.opa_last_webhook_at)}`);
    if (l.opa_error) console.log(`opaError      : ${l.opa_error}`);
  }

  console.log(`\n========== LOGS desde ${sinceArg} (resumo por evento) ==========\n`);
  const summary = await pool.query(
    `SELECT event_type, status, COUNT(*) AS n
       FROM data_transfer_logs
      WHERE created_at >= $1::timestamptz
      GROUP BY event_type, status
      ORDER BY event_type, status`,
    [sinceArg]
  );
  console.table(summary.rows);

  console.log(`\n========== LOGS por LEAD (cronologia) ==========\n`);
  for (const l of leads.rows) {
    console.log(`\n>>> Lead ${l.id} (${l.nome}) — telefone ${l.telefone}`);
    const logs = await pool.query(
      `SELECT created_at, event_type, direction, status, http_status, duration_ms,
              error_message, request_payload, response_payload, correlation_id
         FROM data_transfer_logs
        WHERE lead_id = $1
        ORDER BY created_at ASC`,
      [l.id]
    );
    for (const log of logs.rows) {
      const tag = `[${log.status}]`.padEnd(9);
      console.log(`  ${fmt(log.created_at)} ${tag} ${log.event_type.padEnd(28)} dir=${log.direction.padEnd(8)} http=${log.http_status ?? "—"} dur=${log.duration_ms ?? "—"}ms`);
      if (log.error_message) console.log(`            err: ${log.error_message}`);
      if (log.event_type === "opa.template.send" || log.event_type === "opa.webhook.received") {
        if (log.request_payload) {
          const r = JSON.stringify(log.request_payload);
          console.log(`            req: ${r.slice(0, 280)}${r.length > 280 ? "…" : ""}`);
        }
        if (log.response_payload) {
          const r = JSON.stringify(log.response_payload);
          console.log(`            res: ${r.slice(0, 280)}${r.length > 280 ? "…" : ""}`);
        }
      }
    }
  }

  console.log(`\n========== LOGS sem leadId (ex.: honeypot/desistências) ==========\n`);
  const orphan = await pool.query(
    `SELECT created_at, event_type, status, error_message, request_payload
       FROM data_transfer_logs
      WHERE created_at >= $1::timestamptz AND lead_id IS NULL
      ORDER BY created_at ASC`,
    [sinceArg]
  );
  console.log(`Total: ${orphan.rows.length}`);
  for (const o of orphan.rows.slice(0, 30)) {
    console.log(`  ${fmt(o.created_at)} [${o.status}] ${o.event_type} ${o.error_message ?? ""}`);
    if (o.request_payload) {
      const r = JSON.stringify(o.request_payload);
      console.log(`    req: ${r.slice(0, 220)}`);
    }
  }

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
