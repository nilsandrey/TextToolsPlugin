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
- **Pull request descriptions must use the required changelog markup**: PR descriptions must contain the expected sections for the Release pipeline used to update changelog and release notes. See the following "Pull request description content" section.

### Pull request description content
PR descriptions must contain the expected sections for the Release pipeline used to update the changelog and release notes. Follow the [PULL_REQUEST_TEMPLATE.md](./PULL_REQUEST_TEMPLATE.md) template and fill in the description and type of change (major, minor, patch). Note that the markup comment tags (`<!--changelog-description-start-->`, `<!--changelog-description-end-->`, `<!--changelog-type-start-->`, and `<!--changelog-type-end-->`) are required for the pipeline to identify the sections. The description should be concise but informative, as it will be used in the changelog and release notes. **Exactly one** of the Major/Minor/Patch checkboxes must be checked — the release workflow picks the first matching checked box (Major → Minor → Patch) and will fail to create a release if none are checked.

Sample:

```md
## Description

<!--changelog-description-start-->
Fix code quality issues: sentence case, promise handling, deprecated functions, settings headings
<!--changelog-description-end-->

## Type of Change

<!--changelog-type-start-->

- [ ] **Major** – Breaking change (requires a new major version bump)
- [ ] **Minor** – New feature, backward-compatible (requires a new minor version bump)
- [x] **Patch** – Bug fix or internal improvement, backward-compatible (requires a new patch version bump)

<!--changelog-type-end-->
```
