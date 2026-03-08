# Contributing to Local Text Tools

Thank you for your interest in contributing! Contributions of all kinds are welcome — bug reports, feature suggestions, documentation improvements, and code changes.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Reporting Issues](#reporting-issues)
- [Requesting Features](#requesting-features)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Coding Standards](#coding-standards)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating you agree to abide by its terms. Please be respectful and constructive in all interactions.

---

## Reporting Issues

1. Search [existing issues](../../issues) first to avoid duplicates.
2. Use the [Bug Report template](../../issues/new?template=bug_report.md) and fill in all sections.
3. Include Obsidian version, plugin version, OS, and clear reproduction steps.

---

## Requesting Features

1. Search [existing issues](../../issues) for similar requests.
2. Use the [Feature Request template](../../issues/new?template=feature_request.md).
3. Describe the problem you are solving, not just the solution.

---

## Development Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Steps

```bash
# Clone the repository
git clone https://github.com/nilsandrey/TextToolsPlugin.git
cd TextToolsPlugin

# Install dependencies
npm install

# Build (type-check + bundle)
npm run build

# Watch mode (auto-rebuild on save)
npm run dev

# Run tests
npm test
```

To test the plugin in Obsidian, copy `main.js` and `manifest.json` into your vault's plugin directory:

```
<vault>/.obsidian/plugins/text-tools/
```

---

## Making Changes

### Adding a new transform

1. Write a pure function `(text: string) => string` in the appropriate `src/transforms/*.ts` file.
2. Register the command in the corresponding `register*Commands()` method in `main.ts`.
3. Add tests in the co-located `*.test.ts` file.
4. Update the Features table in `README.md`.

### Key conventions

- **CRLF normalisation**: Use `normalizeLineEndings()` / `getLines()` helpers in `lines.ts` — never raw `text.split("\n")`.
- **Trailing newline preservation**: Wrap sort/filter operations with `withPreservedTrailingNewline()`.
- **Multi-selection aware**: All transforms must work when multiple selections are active. Use `transformSelections()`.
- **No UI in transform functions**: Keep transform functions pure; put all Obsidian UI code in `main.ts`.

---

## Submitting a Pull Request

1. Fork the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes and add/update tests.
3. Ensure the build passes:
   ```bash
   npm run build && npm test
   ```
4. Push your branch and open a Pull Request against `main`.
5. Fill in the [PR template](.github/PULL_REQUEST_TEMPLATE.md) completely, including the version-bump checkbox.
6. A maintainer will review your PR. Please respond to any review comments promptly.

### Commit style

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add reverse-words transform
fix: preserve trailing newline in sort
docs: update README command table
chore: bump vitest to 2.x
```

---

## Coding Standards

- **Language**: TypeScript (strict mode).
- **Formatting**: The project does not yet enforce a formatter; match the surrounding style.
- **Tests**: Co-locate tests next to source (`src/transforms/foo.test.ts`). Use Vitest.
- **Imports**: Use named imports; avoid default imports from transform modules.
- **Security**: Never introduce `eval` or dynamic code execution.

---

Thank you for helping make Local Text Tools better!
