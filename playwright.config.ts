import { defineConfig, devices } from "@playwright/test";

/**
 * Browser acceptance always exercises the production build. Keeping this
 * narrow and Chromium-only makes the gate practical in CI while leaving the
 * broader assistive-technology review explicitly outside its claim boundary.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm exec vinext start --port 4173",
    url: "http://127.0.0.1:4173",
    // A reused local server can be serving an older asset manifest after a
    // production build, which turns dynamic-import failures into misleading
    // browser-test results. Require the checked build to start a fresh server.
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
