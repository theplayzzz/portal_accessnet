import { expect, test } from "@playwright/test";

test("adapta o rodapé ao recolher o teclado com o campo ainda focado", async ({ page }) => {
  // Estado de conversa local. As classes do campo e dos horários são as do OPA.
  await page.route("**/opa.accessnet.com.br/js/opa.js", route => route.fulfill({
    contentType: "text/javascript",
    body: `window.opa = {
      socket: { connected: true, on() {}, disconnect() {} },
      init() {
        const launcher = document.createElement("button");
        launcher.className = "opa_ico";
        launcher.onclick = () => document.body.insertAdjacentHTML("beforeend",
          '<div class="opa_chat" style="display:flex;flex-direction:column"><div class="opa_corpo"><div class="opa_ballon enviada">Olá<div class="time">Visitante · 10:15</div></div></div><div class="opa_rodape"><input class="opa_rodape_input"></div></div>');
        document.body.append(launcher);
      }
    };`
  }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/suporte");
  const widget = page.frameLocator('iframe[src="/suporte/chat"]');
  const input = widget.getByRole("textbox");
  const footer = widget.locator(".opa_rodape");
  await expect(footer).toHaveCSS("padding-bottom", "16px");
  await expect(widget.locator(".enviada .time")).toHaveCSS("color", "rgb(238, 237, 255)");
  await input.focus();
  await page.setViewportSize({ width: 390, height: 392 });
  await expect(footer).toHaveCSS("padding-bottom", "4px");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(input).toBeFocused();
  await expect(footer).toHaveCSS("padding-bottom", "16px");
});

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
