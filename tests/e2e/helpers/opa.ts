import { request as undiciRequest } from "undici";

const BASE = process.env.OPA_BASE_URL!;
const TOKEN = process.env.OPA_TOKEN!;

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  };
}

export async function findContatoByPhone(phoneE164: string) {
  const res = await undiciRequest(`${BASE}/contato/`, {
    method: "GET",
    headers: headers(),
    body: JSON.stringify({ filter: { "fones.numero": phoneE164 } }),
  });
  const json = (await res.body.json()) as {
    data?: Array<{ _id: string }>;
  };
  return Array.isArray(json.data) && json.data.length > 0 ? json.data[0] : null;
}

export async function deleteContato(contatoId: string) {
  const res = await undiciRequest(`${BASE}/contato/${contatoId}`, {
    method: "DELETE",
    headers: headers(),
  });
  return res.statusCode >= 200 && res.statusCode < 300;
}
