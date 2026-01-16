import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["./app/tests/testContainer.ts"],
  },
});
