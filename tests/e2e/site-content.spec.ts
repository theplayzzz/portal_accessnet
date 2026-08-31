import { expect, test } from "@playwright/test";

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
