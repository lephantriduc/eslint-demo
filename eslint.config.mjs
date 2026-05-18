import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { 
        sourceType: "module",
        globals: {
            ...globals.browser,
            ...globals.node
        }
    },
    rules: {
      "no-console": "error",
      "semi": "error",
      "eqeqeq": "error",
      "keyword-spacing": "error",
    },
  }
]);
