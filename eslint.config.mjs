import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

const baseTypeScriptConfig = {
  files: ["**/*.ts", "**/*.tsx"],
  ignores: [
    "**/dist/**",
    "**/.next/**",
    "**/coverage/**",
    "**/.turbo/**",
    "**/node_modules/**",
    "apps/mobile/.expo/**"
  ],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    globals: {
      ...globals.browser,
      ...globals.node
    }
  },
  plugins: {
    "@typescript-eslint": tseslint
  },
  rules: {
    "no-undef": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
};

export default [
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/coverage/**",
      "**/.turbo/**",
      "**/node_modules/**",
      "apps/mobile/.expo/**"
    ]
  },
  js.configs.recommended,
  baseTypeScriptConfig,
  {
    files: ["apps/mobile/**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.serviceworker
    }
  },
  {
    files: ["**/*.config.{js,cjs,mjs,ts}", "infra/**/*.{ts,js}"],
    languageOptions: {
      globals: globals.node
    }
  }
];
