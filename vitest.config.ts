import { defineConfig } from "vitest/config";
import { plugins } from "./vite.config";

export default defineConfig({
  plugins,
  test: {
    environment: 'jsdom',
    browser: {
      name: "chromium",
      enabled: true,
      headless: true,
      provider: "playwright",
    },
  },
});
