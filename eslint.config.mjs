import tsparser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";

export default defineConfig([
  ...obsidianmd.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: { project: "./tsconfig.json" },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "obsidianmd/ui/sentence-case": [
        "error",
        {
          // These proper nouns and acronyms are not in the plugin's default list
          ignoreWords: ["UTC", "ISO", "Unix"],
        },
      ],
    },
  },
]);
