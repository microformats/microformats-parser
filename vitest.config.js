import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    coverage: {
      all: true,
      include: ["src/**/*.ts"],
      provider: "v8",
      thresholds: {
        lines: 98.9,
        functions: 100,
        branches: 97.9,
        statements: 99,
      },
    },
  },
});
