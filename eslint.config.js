// Flat ESLint config for Svelte + TypeScript + Prettier
import js from "@eslint/js";
import globals from "globals";
import svelte from "eslint-plugin-svelte";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-config-prettier";

export default [
  // Ignore paths (replacement for .eslintignore)
  {
    ignores: [
      ".svelte-kit/**",
      "build/**",
      "dist/**",
      "node_modules/**",
      ".venv/**",
      "data/**",
    ],
  },
  // Base JS rules
  js.configs.recommended,
  // Svelte recommended config
  ...svelte.configs["flat/recommended"],
  // TypeScript support for .ts files
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
      },
      globals: globals.node,
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs["recommended"].rules,
    },
  },
  // Ensure Svelte <script lang="ts"> uses TS parser for script content
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
      globals: globals.browser,
    },
    rules: {},
  },
  // Disable ESLint rules conflicting with Prettier
  prettier,
];
