import { expect, test } from "@playwright/test";

const whatsappUrl = "https://wa.me/5508004491021?text=" +
  encodeURIComponent("Olá, vim pelo site, quero mais informações.");

test.beforeEach(async ({ context }) => {
  await context.route(/https:\/\/[^/]*(googletagmanager|google-analytics|googleadservices|doubleclick|vercel-scripts)[^/]*\//,
    (route) => route.abort());
});

test.describe("Contato direto e compartilhamento", () => {
  for (const [path, cta] of [
    ["/", "hero-fibra-cta"],
    ["/rede-movel", "pricing-mobile-m20"],
    ["/access-tv", "access-tv-hero"],
  ]) {
    test(`abre o WhatsApp sem cadastro em ${path}`, async ({ page, context }) => {
      let leadRequests = 0;
      await context.route("**/api/lead", async (route) => {
        leadRequests++;
        await route.abort();
      });
      // Intercepta a navegação: o teste nunca acessa ou envia mensagens ao WhatsApp.
      await context.route("https://wa.me/**", (route) =>
        route.fulfill({ contentType: "text/html", body: "<p>Destino conferido</p>" })
      );
      await page.goto(path);
      const links = page.locator("[data-lead-cta]");
      expect(await links.count()).toBeGreaterThan(5);
      for (const link of await links.all()) {
        await expect(link).toHaveAttribute("href", whatsappUrl);
        await expect(link).toHaveAttribute("target", "_blank");
      }
      await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
      const popupPromise = page.waitForEvent("popup");
      const primary = path === "/access-tv"
        ? page.locator(`[data-lead-cta="${cta}"]`)
        : page.getByTestId(cta);
      await primary.click();
      const popup = await popupPromise;
      await expect(popup).toHaveURL(whatsappUrl);
      await popup.close();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator("form")).toHaveCount(0);
      expect(leadRequests).toBe(0);
    });
  }

  test("mantém o telefone e os CTAs acessíveis no menu mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByTestId("header-mobile-cta")).toHaveAttribute("href", whatsappUrl);
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    const phone = page.locator('[data-lead-cta="header-mobile-phone"]');
    await expect(phone).toBeVisible();
    await expect(phone).toHaveAttribute("href", whatsappUrl);
    await expect(page.getByTestId("header-mobile-menu-cta")).toHaveAttribute("href", whatsappUrl);
  });

  test("publica uma imagem real da home para prévias sociais", async ({ page, request }) => {
    await page.goto("/");
    const imagePath = "/og-home-2026-10-21.png";
    for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      await expect(page.locator(selector)).toHaveAttribute("content", `https://accessnet.com.br${imagePath}`);
    }
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /Home da AccessNet/);
    const response = await request.get(imagePath);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
    const png = await response.body();
    expect(png.toString("ascii", 1, 4)).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
    expect(png.length).toBeLessThan(1_000_000);
  });
});

test.describe("Atualização comercial AccessNet", () => {
  test("exibe os novos planos móveis de 20, 30 e 40 GB", async ({ page }) => {
    await page.goto("/rede-movel");

    await expect(page.getByTestId("pricing-mobile-m20")).toBeVisible();
    await expect(page.getByTestId("pricing-mobile-m30")).toBeVisible();
    await expect(page.getByTestId("pricing-mobile-m40")).toBeVisible();
    await expect(page.getByTestId("pricing-mobile-m16")).toHaveCount(0);
    await expect(page.getByTestId("pricing-mobile-m21")).toHaveCount(0);
    await expect(page.getByTestId("pricing-mobile-m26")).toHaveCount(0);
  });

  test("publica o Access TV em uma página própria", async ({ page }) => {
    await page.goto("/access-tv");

    await expect(page).toHaveURL(/\/access-tv$/);
    await expect(
      page.getByRole("heading", {
        name: /sua internet também pode ser seu melhor entretenimento/i,
      })
    ).toBeVisible();
    await expect(page.getByText(/mais de 200 canais/i).first()).toBeVisible();
    await expect(page.getByText(/plataforma regularizada/i).first()).toBeVisible();
    await expect(page.getByText(/sem custo adicional/i).first()).toBeVisible();
  });

  test("informa o Access TV em todos os planos residenciais", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByText("Access TV incluso sem custo adicional", { exact: true })
    ).toHaveCount(4);

    const detailsLink = page.getByRole("link", {
      name: "Confira como funciona o Access TV.",
    });
    await expect(detailsLink).toBeVisible();
    await expect(detailsLink).toHaveAttribute("href", "/access-tv");
  });

  test("leva da chamada na home para a página do Access TV", async ({
    page,
  }) => {
    await page.goto("/");

    const link = page.getByRole("link", { name: "Conhecer o Access TV" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/access-tv");
  });

  test("oferece Home e Access TV no header", async ({ page }) => {
    await page.goto("/");

    const header = page.locator("header");
    await expect(
      header.getByRole("link", { name: "Home", exact: true })
    ).toHaveAttribute("href", "/");
    await expect(
      header.getByRole("link", { name: "Access TV", exact: true })
    ).toHaveAttribute("href", "/access-tv");
    await expect(
      header.getByRole("link", { name: "Planos", exact: true })
    ).toHaveCount(0);
    await expect(
      header.getByRole("link", { name: "Cobertura", exact: true })
    ).toHaveCount(0);
  });

  test("mantém uma hierarquia coerente de raios nos benefícios", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 403, height: 1280 });
    await page.goto("/");

    await expect(page.getByTestId("benefits-panel")).toHaveCSS(
      "border-radius",
      "24px"
    );
    await expect(page.getByTestId("benefit-card").first()).toHaveCSS(
      "border-radius",
      "16px"
    );
  });
});
