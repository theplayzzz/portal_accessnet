import { defineConfig, devices } from "@playwright/test";

// Somente conteúdo/navegação. Não carrega credenciais nem a suíte de envios OPA.
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "site-content.spec.ts",
  workers: 1,
  retries: 0,
  reporter: "list",
  outputDir: "test-results/content",
  use: {
    ...devices["Desktop Chrome"],
    channel: "chrome",
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    screenshot: "only-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: "pnpm exec next start --port 3000",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
