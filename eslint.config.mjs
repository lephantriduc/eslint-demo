import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintPluginLocal from "./custom-rules/eslint-plugin.js";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: { local: eslintPluginLocal },
    rules: {
      "no-console": "error",
      semi: "error",
      eqeqeq: "error",
      "keyword-spacing": "error",
      "local/enforce-file-comment": "error",
    },
  },
]);
