import { test, expect } from "@playwright/test";
import {
  db,
  findLeadByEmail,
  findLogsByLead,
  deleteLeadCascade,
} from "./helpers/db";
import { findContatoByPhone, deleteContato } from "./helpers/opa";

test.describe("Lead capture — fluxo completo", () => {
  const phone = process.env.E2E_TEST_PHONE ?? "+5521993792571";
  // Gera email único pra cada run
  const uniqueSuffix = Date.now();
  const email = `e2e-${uniqueSuffix}@teste.accessnet.local`;
  const nome = `E2E Teste ${uniqueSuffix}`;
  const endereco = "Rua Teste E2E, 123, Bairro Teste, Cidade Teste-MA";

  let createdLeadId: string | null = null;
  let createdOpaContatoId: string | null = null;

  test.afterAll(async () => {
    // Cleanup: remove o lead criado (limpa logs via updateMany) e o contato no Opa!
    if (createdLeadId) {
      await deleteLeadCascade(createdLeadId);
    }
    if (createdOpaContatoId) {
      await deleteContato(createdOpaContatoId);
    }
    await db.$disconnect();
  });

  test("abre modal, submete, persiste no DB, registra logs e chama Opa!", async ({
    page,
  }) => {
    // 1. Abre a home e clica no botão flutuante
    await page.goto("/pt");
    await page
      .locator('[data-testid="whatsapp-floating"]')
      .click({ timeout: 5000 });

    // 2. Modal abriu
    const modal = page.locator('[data-testid="lead-modal"]');
    await expect(modal).toBeVisible();

    // 3. Preenche campos
    await page.locator('[data-testid="lead-field-nome"]').fill(nome);
    await page.locator('[data-testid="lead-field-telefone"]').fill(phone);
    await page.locator('[data-testid="lead-field-email"]').fill(email);
    await page.locator('[data-testid="lead-field-endereco"]').fill(endereco);

    // 4. Submete
    await page.locator('[data-testid="lead-submit"]').click();

    // 5. Aguarda estado de sucesso ("Tudo certo" ou "Cadastro recebido")
    await expect(page.getByText(/tudo certo/i)).toBeVisible({ timeout: 20_000 });

    // 6. Valida DB: lead gravado
    // Espera até 5s pro backend persistir e atualizar opaStatus (é síncrono com E2E_AWAIT_OPA=1)
    let lead = null;
    for (let i = 0; i < 10; i++) {
      lead = await findLeadByEmail(email);
      if (lead && lead.opaStatus && lead.opaStatus !== "pending") break;
      await new Promise((r) => setTimeout(r, 500));
    }

    expect(lead, "lead deveria estar no DB").not.toBeNull();
    expect(lead!.nome).toBe(nome);
    expect(lead!.email).toBe(email);
    expect(lead!.endereco).toBe(endereco);
    expect(lead!.telefone).toMatch(/^\+55\d{10,11}$/);
    expect(lead!.sourceCta).toBe("floating");
    expect(lead!.sourcePage).toBeTruthy();

    createdLeadId = lead!.id;

    // 7. Valida status Opa!
    expect(
      ["sent", "failed"].includes(lead!.opaStatus!),
      `opaStatus deveria ser "sent" ou "failed", veio: ${lead!.opaStatus} (erro: ${lead!.opaError})`
    ).toBe(true);
    expect(lead!.opaAttempts).toBeGreaterThan(0);

    // Em sucesso, Opa! retorna contatoId + templateSentId
    if (lead!.opaStatus === "sent") {
      expect(lead!.opaContatoId, "opaContatoId preenchido").toBeTruthy();
      expect(
        lead!.opaTemplateSentId,
        "opaTemplateSentId preenchido"
      ).toBeTruthy();
      createdOpaContatoId = lead!.opaContatoId;
    }

    // 8. Valida logs
    const logs = await findLogsByLead(lead!.id);
    const eventTypes = logs.map((l) => l.eventType);

    expect(eventTypes).toContain("lead.db.insert");
    expect(eventTypes).toContain("opa.contato.search");
    expect(eventTypes).toContain("opa.template.send");

    // Todos os logs do mesmo lead devem compartilhar correlationId
    const correlationIds = new Set(
      logs.map((l) => l.correlationId).filter(Boolean)
    );
    expect(
      correlationIds.size,
      "todos os logs devem ter o mesmo correlationId"
    ).toBe(1);

    // 9. Valida no Opa! via API direto (se status=sent)
    if (lead!.opaStatus === "sent") {
      const contato = await findContatoByPhone(phone);
      expect(contato, "contato encontrado no Opa!").not.toBeNull();
    }
  });
});
