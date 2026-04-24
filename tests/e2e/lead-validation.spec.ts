import { test, expect } from "@playwright/test";
import { db } from "./helpers/db";

test.describe("Lead capture — validação e honeypot", () => {
  test.afterAll(async () => {
    await db.$disconnect();
  });

  test("bloqueia submit com campos vazios (client-side)", async ({ page }) => {
    await page.goto("/pt");
    await page.locator('[data-testid="whatsapp-floating"]').click();
    await expect(page.locator('[data-testid="lead-modal"]')).toBeVisible();

    // Clica sem preencher
    await page.locator('[data-testid="lead-submit"]').click();

    // Espera aparecer pelo menos 1 mensagem de erro inline
    const alerts = page.getByRole("alert");
    await expect(alerts.first()).toBeVisible({ timeout: 3_000 });
    const count = await alerts.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("bloqueia email inválido", async ({ page }) => {
    await page.goto("/pt");
    await page.locator('[data-testid="whatsapp-floating"]').click();

    await page.locator('[data-testid="lead-field-nome"]').fill("Fulano Teste");
    await page.locator('[data-testid="lead-field-telefone"]').fill("+5521999999999");
    await page.locator('[data-testid="lead-field-email"]').fill("nao-eh-email");
    await page
      .locator('[data-testid="lead-field-endereco"]')
      .fill("Rua Qualquer, 123, Cidade, MA");

    await page.locator('[data-testid="lead-submit"]').click();

    // Deve mostrar erro no campo email especificamente
    await expect(page.getByText(/email inválido/i)).toBeVisible();
  });

  test("honeypot: marca bot como sucesso mas NÃO persiste no DB", async ({
    request,
  }) => {
    const uniqueEmail = `bot-${Date.now()}@teste.local`;
    const res = await request.post("/api/lead", {
      data: {
        nome: "Bot Fake",
        telefone: "+5521988888888",
        email: uniqueEmail,
        endereco: "Rua Bot, 123",
        website: "https://bot-filled-this.com", // honeypot!
        sourceCta: "bot-test",
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.leadId).toBeNull();

    // DB não deve ter row
    const lead = await db.lead.findFirst({ where: { email: uniqueEmail } });
    expect(lead, "honeypot não pode persistir lead").toBeNull();

    // Deve ter log do tipo lead.honeypot.triggered
    const logs = await db.dataTransferLog.findMany({
      where: { eventType: "lead.honeypot.triggered" },
      orderBy: { createdAt: "desc" },
      take: 1,
    });
    expect(logs.length).toBeGreaterThan(0);
  });

  test("rejeita JSON malformado", async ({ request }) => {
    const res = await request.post("/api/lead", {
      data: "{ isso não é json válido",
      headers: { "Content-Type": "application/json" },
    });
    // Fetch já serializa como string, então pode ser 400 por invalid_json ou 400 por validation
    expect([400]).toContain(res.status());
  });
});
