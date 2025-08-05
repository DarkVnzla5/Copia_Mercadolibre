import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    languageOptions: { globals: globals.browser },
    rules: {
      "semi": ["error", "always"],
      "no-unused-vars": "error",
      "no-extra-semi": "error",
      "eqeqeq": "error",
      "camelcase": "error"
    }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended
]);
