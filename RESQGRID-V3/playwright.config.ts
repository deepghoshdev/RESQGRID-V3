import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30000,
  workers: 1,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://terminal.local:4173",
    headless: true,
    screenshot: "only-on-failure",
  },
  reporter: "list",
});
