import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**", "public/**", "**/*.html"],
  },
  tseslint.configs.recommended,
  importPlugin.flatConfigs.errors,
  importPlugin.flatConfigs.typescript,
  {
    rules: {
      "import/no-unresolved": "off",
      "arrow-body-style": ["error", "as-needed"],
      "import/order": [
        "error",
        {
          groups: [["builtin", "external", "internal"]],
          "newlines-between": "always-and-inside-groups",
        },
      ],
    },
  },
  {
    files: ["demo/**/*.js", "rollup.config.js"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
  eslintConfigPrettier,
);
