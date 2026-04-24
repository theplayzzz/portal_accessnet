import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

// Carrega .env.local antes dos testes (DATABASE_URL, OPA_*, etc.)
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ path: ".env", quiet: true });

// Também exporta a flag E2E_AWAIT_OPA pro dev server
// (Route Handler aguarda o pipeline Opa! antes de responder quando essa var é "1")
process.env.E2E_AWAIT_OPA = process.env.E2E_AWAIT_OPA ?? "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],
  outputDir: "test-results",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      // Garante que o dev server aguarda o Opa! pra facilitar asserts de E2E
      E2E_AWAIT_OPA: "1",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
