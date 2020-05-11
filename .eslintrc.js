module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/typescript",
    "prettier",
  ],
  ignorePatterns: ["node_modules/", "dist/"],
  settings: {
    "import/resolver": {
      node: { extensions: [".ts"] },
    },
  },
  rules: {
    "arrow-body-style": ["error", "as-needed"],
    "import/order": [
      "error",
      {
        groups: [["builtin", "external", "internal"]],
        "newlines-between": "always-and-inside-groups",
      },
    ],
  },
};
