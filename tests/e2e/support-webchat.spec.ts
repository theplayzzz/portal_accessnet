import { expect, test } from "@playwright/test";

// Não inicia atendimento nem envia mensagens; a conexão OPA é bloqueada.
test.beforeEach(async ({ page }) => {
  await page.route("**/opa.accessnet.com.br/**", (route) => route.abort());
  await page.route(/google-analytics|googletagmanager|vercel-insights|va\.vercel/, (route) => route.abort());
});

test("isola o piloto, carrega o chat por ação e mantém o contato da home", async ({ page }) => {
  let opaRequests = 0;
  page.on("request", (request) => { if (request.url().includes("opa.accessnet.com.br")) opaRequests++; });
  await page.goto("/suporte");
  await expect(page.getByRole("heading", { name: "Sua conexão merece atenção." })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.getByTestId("whatsapp-floating")).toHaveCount(0);
  expect(opaRequests).toBe(0);
  await page.getByRole("button", { name: "Abrir chat de suporte" }).click();
  await expect(page.locator("iframe")).toHaveAttribute("src", "/suporte/chat");
  await expect(page.getByRole("alert").filter({ hasText: "Não conseguimos conectar o chat" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Falar pelo WhatsApp", exact: true })).toHaveAttribute("href", /wa\.me\/5508004491021/);
  await page.goto("/");
  await expect(page.getByTestId("whatsapp-floating")).toHaveAttribute("href", /wa\.me\/5508004491021/);
  await expect(page.locator('iframe[src="/suporte/chat"]')).toHaveCount(0);
});

test("ignora mensagens de janelas externas e permite tentar de novo após falha", async ({ page }) => {
  await page.goto("/suporte");
  await page.getByRole("button", { name: "Abrir chat de suporte" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Não conseguimos conectar o chat" })).toBeVisible();
  await page.evaluate(() => window.postMessage({ type: "accessnet:webchat", state: "ready" }, window.location.origin));
  await expect(page.getByRole("alert").filter({ hasText: "Não conseguimos conectar o chat" })).toBeVisible();
  const before = await page.locator("iframe").elementHandle();
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Não conseguimos conectar o chat" })).toBeVisible();
  expect(await before?.evaluate((element) => element.isConnected)).toBe(false);
});

test("serve o documento isolado e adapta o painel em telas pequenas", async ({ page, request }) => {
  const response = await request.get("/suporte/chat");
  expect(response.status()).toBe(200);
  expect(response.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
  expect(await response.text()).toContain('data-opa-channel="6ad9fe0aad352e01088e690a"');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/suporte");
    await expect(page.getByRole("button", { name: "Abrir chat de suporte" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});
