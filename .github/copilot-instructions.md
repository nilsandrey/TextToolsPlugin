# Copilot Instructions — Text Tools (Obsidian Plugin)

## Build, Test, Lint

```bash
npm run build          # Type-check (tsc -noEmit) + esbuild production bundle → main.js
npm run dev            # esbuild watch mode (auto-rebuilds on save)
npm run test           # vitest run (all tests)
npm run test -- src/transforms/lines.test.ts                 # single test file
npm run test -- -t "should sort lines alphabetically"        # single test by name
```

No separate lint command exists. Type-checking is part of `npm run build`.

## Architecture

This is an Obsidian plugin (plugin ID: `text-tools`). The entry point is `main.ts`, which defines `TextToolsPlugin` and registers all commands in grouped `register*Commands()` methods.

### Transform pattern

All text transforms are **pure functions** with signature `(text: string) => string`, organized by category in `src/transforms/`:

| File | Category |
|------|----------|
| `case.ts` | Case conversion, word separators, slugify, latinize |
| `lines.ts` | Sort, deduplicate, trim, pad, prefix/suffix, split/join |
| `encode.ts` | URL, HTML, Base64, JSON, hex/decimal encoding |
| `numbers.ts` | Shift all integers in text by a delta |
| `generate.ts` | GUIDs, random numbers, lorem ipsum, sequences, timestamps |

Commands in `main.ts` wire these pure functions to the editor via `transformSelections()` from `src/utils.ts`, which iterates all editor selections in reverse document order and replaces each with the transform result. This reverse iteration preserves character positions during multi-selection edits.

Commands that need user input use `InputModal` or `TwoInputModal` (in `src/modals/`) to collect parameters before applying the transform.

### Key helpers in `src/utils.ts`

- `transformSelections(editor, fn)` — Apply a `string → string` transform to every non-empty selection. Returns `false` if nothing is selected.
- `normalizeRange(anchor, head)` — Normalize selection direction to `{from, to}`.

### Settings

`src/settings.ts` defines `TextToolsSettings` interface and `DEFAULT_SETTINGS`. Settings are persisted by Obsidian's `loadData()`/`saveData()`. The settings tab UI is in `src/settings-tab.ts`.

## Conventions

- **Adding a new transform**: Write the pure function in the appropriate `src/transforms/*.ts` file, then register the command in the corresponding `register*Commands()` method in `main.ts`. If it needs no user input, add it to the `cmds` or `simple` tuple array. If it needs input, use `InputModal` or `TwoInputModal`.
- **Tests are co-located**: Test files live next to their source (e.g., `src/transforms/lines.test.ts`). Vitest discovers `src/**/*.test.ts`.
- **Line operations must normalize CRLF**: Functions in `lines.ts` use `normalizeLineEndings()` / `getLines()` to handle `\r\n` → `\n` before processing. Use these helpers instead of raw `text.split("\n")`.
- **Sorting must preserve trailing newlines**: Use `withPreservedTrailingNewline()` wrapper for sort operations — editors often include a trailing newline when selecting full lines.
- **The `perLine()` helper** in `case.ts` applies a function to each line independently. Use it for per-line transforms that don't need cross-line context.
- **Multi-selection aware**: All commands must work with multiple simultaneous selections. Use `transformSelections()` or iterate `editor.listSelections()` in reverse.
- **Obsidian API is external**: `obsidian`, `electron`, and `@codemirror/*` are externalized by esbuild — never bundle them.
