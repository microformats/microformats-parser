import eslintConfigPrettier from "eslint-config-prettier";
import pluginJs from "@eslint/js";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  {
    ignores: ["dist/**", "public/**", "**/*.html", "coverage/**"],
  },
  pluginJs.configs.recommended,
  tsEslint.configs.recommended,
  {
    rules: {
      "arrow-body-style": ["error", "as-needed"],
    },
  },
  {
    files: ["demo/**/*.js", "rollup.config.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
  eslintConfigPrettier,
);
