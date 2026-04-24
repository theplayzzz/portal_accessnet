/**
 * Validação de redundância: mesmo com Opa! falhando, o lead é preservado no DB
 * e o usuário vê sucesso.
 *
 * Estratégia: fazer a chamada HTTP direto na rota com um header especial
 * que injeta um token inválido via interceptor — MAS como não temos esse
 * mecanismo, o jeito é testar via API request com payload válido e conferir
 * que, se por qualquer razão Opa! falhar, o lead ficou persistido e o status
 * saiu "failed".
 *
 * Como não queremos de fato quebrar o token em produção, esse spec roda apenas
 * quando E2E_FORCE_OPA_FAIL=1 no ambiente do dev server.
 */
import { test, expect } from "@playwright/test";
import { db, deleteLeadCascade, findLeadByEmail } from "./helpers/db";

test.describe("Lead capture — redundância (Opa! falha)", () => {
  test.skip(
    process.env.E2E_FORCE_OPA_FAIL !== "1",
    "Defina E2E_FORCE_OPA_FAIL=1 (e OPA_TOKEN inválido no .env.local) pra rodar este spec"
  );

  const email = `e2e-fail-${Date.now()}@teste.local`;

  test.afterAll(async () => {
    const lead = await findLeadByEmail(email);
    if (lead) await deleteLeadCascade(lead.id);
    await db.$disconnect();
  });

  test("com Opa! falhando, lead fica com opaStatus=failed mas é salvo", async ({
    request,
  }) => {
    const res = await request.post("/api/lead", {
      data: {
        nome: "Redundancy Test",
        telefone: "+5521977777777",
        email,
        endereco: "Rua Redundancy, 123, Cidade, MA",
        sourceCta: "redundancy-test",
      },
    });
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.leadId).toBeTruthy();

    // Aguarda backend processar Opa!
    let lead = null;
    for (let i = 0; i < 20; i++) {
      lead = await findLeadByEmail(email);
      if (lead && lead.opaStatus && lead.opaStatus !== "pending") break;
      await new Promise((r) => setTimeout(r, 500));
    }

    expect(lead).not.toBeNull();
    expect(lead!.opaStatus).toBe("failed");
    expect(lead!.opaError).toBeTruthy();
  });
});
