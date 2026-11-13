import { expect, test } from "@playwright/test";

// Não inicia atendimento nem envia mensagens; a conexão OPA é bloqueada.
test.beforeEach(async ({ page }) => {
  await page.route("**/opa.accessnet.com.br/**", (route) => route.abort());
  await page.route(/google-analytics|googletagmanager|vercel-insights|va\.vercel/, (route) => route.abort());
});

test("abre somente o chat no piloto e mantém a navegação comercial na home", async ({ page }) => {
  await page.goto("/suporte");
  await expect(page.locator("header, footer, h1")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByTestId("whatsapp-floating")).toHaveCount(0);
  await expect(page.locator("iframe")).toHaveAttribute("src", "/suporte/chat");
  await expect(page.getByRole("button", { name: "Abrir chat de suporte" })).toHaveCount(0);
  await expect(page.getByRole("alert").filter({ hasText: "Não conseguimos conectar o chat" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Falar pelo WhatsApp", exact: true })).toHaveAttribute("href", /wa\.me\/5508004491021/);
  await page.goto("/");
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
  await expect(page.getByTestId("whatsapp-floating")).toHaveAttribute("href", /wa\.me\/5508004491021/);
  await expect(page.locator('iframe[src="/suporte/chat"]')).toHaveCount(0);
});

test("ignora mensagens de janelas externas e permite tentar de novo após falha", async ({ page }) => {
  await page.goto("/suporte");
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
  for (const [width, height] of [[320, 640], [390, 844], [768, 1024], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/suporte");
    const chat = page.locator('iframe[src="/suporte/chat"]');
    await expect(chat).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth && document.documentElement.scrollHeight <= window.innerHeight)).toBe(true);
    if (width < 1024) {
      await expect(page.getByRole("complementary", { name: "Informações do suporte" })).toBeHidden();
      expect(await chat.boundingBox()).toEqual({ x: 0, y: 0, width, height });
    } else {
      await expect(page.getByRole("complementary", { name: "Informações do suporte" })).toBeVisible();
    }
  }
});
