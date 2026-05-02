/**
 * Sonda empírica: testa se PUT /contato/:id aceita o campo `etiquetas` mesmo
 * sem estar documentado na collection Postman. Cria um contato dummy, tenta
 * setar a tag, lê de volta, e deleta.
 *
 * Uso: pnpm dlx tsx --env-file=.env.local scripts/probe-opa-contato-tag.ts
 */

import { opaGet, opaPost, opaPut, opaDelete } from "@/lib/opa/client";

const LEAD_SITE_TAG_ID = "69efb0958a18ecfccb5387a1";
const DUMMY_PHONE = "+5511987654321";

async function main() {
  const stamp = Date.now().toString(36);

  console.log("\n[1] criando contato dummy");
  const create = await opaPost<unknown>("/contato/", {
    nome: `_PROBE_TAG_${stamp}`,
    email_principal: `probe-${stamp}@invalid.test`,
    username: `probe_${stamp}`,
    celularCompleto: DUMMY_PHONE,
    WhatsappCompleto: DUMMY_PHONE,
    requerAutenticacaoSempre: false,
    habilitarAlerta: false,
    lead: "true",
    historico_email: false,
    senha: `Lp9!xyzABCxyz123@7!`,
    repetirSenha: `Lp9!xyzABCxyz123@7!`,
  });
  console.log("HTTP:", create.httpStatus, "OK:", create.ok);
  if (!create.ok) {
    console.log("Body:", JSON.stringify(create.body).slice(0, 500));
    return;
  }
  const id = (create.body as { data?: { _id?: string } }).data?._id;
  if (!id) {
    console.log("sem _id no response");
    return;
  }
  console.log("created id:", id);

  async function putContato(payload: Record<string, unknown>) {
    return opaPut<unknown>(`/contato/${id}`, payload);
  }

  console.log("\n[2] tentando PUT /contato/:id com etiquetas=[LEAD SITE]");
  const put1 = await putContato({
    nome: `_PROBE_TAG_${stamp}`,
    celularCompleto: DUMMY_PHONE,
    requerAutenticacaoSempre: false,
    habilitarAlerta: false,
    lead: "true",
    historico_email: false,
    etiquetas: [LEAD_SITE_TAG_ID],
  });
  console.log("HTTP:", put1.httpStatus, "OK:", put1.ok);
  if (!put1.ok) console.log("Body:", JSON.stringify(put1.body).slice(0, 400));

  console.log("\n[3] GET /contato/:id pra ver se persistiu");
  const get1 = await opaGet<Record<string, unknown>>(`/contato/${id}`);
  const c = (get1.body as { data?: Record<string, unknown> }).data ?? {};
  console.log("etiquetas:", JSON.stringify(c.etiquetas ?? null));
  console.log("tags:", JSON.stringify(c.tags ?? null));
  console.log("etiquetas (root response):", JSON.stringify((get1.body as Record<string, unknown>).etiquetas ?? null));
  console.log("response keys:", Object.keys(c).join(", "));

  console.log("\n[4] testando alias 'tags' em PUT");
  const put2 = await putContato({
    nome: `_PROBE_TAG_${stamp}`,
    celularCompleto: DUMMY_PHONE,
    requerAutenticacaoSempre: false,
    habilitarAlerta: false,
    lead: "true",
    historico_email: false,
    tags: [LEAD_SITE_TAG_ID],
  });
  console.log("HTTP:", put2.httpStatus, "OK:", put2.ok);

  const get2 = await opaGet<Record<string, unknown>>(`/contato/${id}`);
  const c2 = (get2.body as { data?: Record<string, unknown> }).data ?? {};
  console.log("etiquetas:", JSON.stringify(c2.etiquetas ?? null));
  console.log("tags:", JSON.stringify(c2.tags ?? null));

  console.log("\n[5] limpando — DELETE contato dummy");
  const del = await opaDelete(`/contato/${id}`);
  console.log("HTTP:", del.httpStatus, "OK:", del.ok);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
