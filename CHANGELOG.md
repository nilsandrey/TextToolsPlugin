# Changelog

All notable changes to **Local Text Tools** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.2] – 2026-03-08

### Changed

Remove "v" prefix from release tags and titles, switching version tag format from `v#.#.#` to `#.#.#` across the release pipeline and changelog. (PR #7)

[1.0.2]: https://github.com/nilsandrey/TextToolsPlugin/releases/tag/1.0.2

## [1.0.1] – 2026-03-08

### Changed

Fix release workflow bump detection: correct broken regex (`\[xX\]` → `\[[xX]\]`), use temp file + `awk` markers for reliable multiline PR body handling, replace `echo | grep` with here-strings, and fall back to full-body scan when markers are missing. (PR #6)

[1.0.1]: https://github.com/nilsandrey/TextToolsPlugin/releases/tag/1.0.1

## [1.0.0] – 2024-01-01

### Added

- **Case / Format** commands: Upper case, Lower case, camelCase, PascalCase, CONSTANT\_CASE, dash-case (kebab-case), snake\_case, dot.case, Title Case, sPoNgE cAsE, Swap case, Separate with spaces/slashes/backslashes, Reverse characters on each line, Slugify, Latinize (remove diacritics).
- **Line Operations**: Sort lines (case-sensitive/insensitive × ascending/descending, by length, by word count), Shuffle lines, Remove/keep duplicate lines, Remove adjacent duplicate lines, Remove/keep blank and empty lines, Remove surplus blank lines, Trim lines (both ends, start, end), Remove all whitespace, Replace newlines with space, Collapse whitespace to single space, Prefix/Suffix/Wrap lines, Split lines by delimiter, Join all lines, Join every N lines, Count line occurrences, Pad lines at start/end.
- **Filter Lines**: Keep or remove lines matching a string or regex — 4 in-place variants and 4 "output to new note" variants. Filter history (last 10 queries persisted).
- **Encoding**: URL encode/decode, HTML entity encode/decode, Base64 encode/decode, JSON escape/unescape, Decimal ↔ Hex conversion.
- **Numbers**: Increase/decrease all integers by 1 or a custom step.
- **Generate / Insert**: 4 GUID formats (with/without dashes, with braces, C# constructor), random integer/float/hex from range, Lorem ipsum sentence and paragraph, 7 sequence types (uppercase letters, lowercase letters, NATO phonetic alphabet, long/short month names, long/short day names), 3 timestamp formats (local, UTC/ISO 8601, Unix epoch).
- **Advanced**: Format as table (configurable delimiter), Extract with regex (capture groups + replacement), Duplicate selection.
- **Text Slots**: 5 persistent named clipboard entries (set / paste).
- **Line Numbers**: Sequential (starting at 1) and real file line numbers; optional zero-padding; configurable separator.
- Settings UI for default pad character, line-number separator, pad toggle, GUID casing, case-sensitive filtering, filter history, and text slots.
- Full multi-selection support: all commands operate on every active editor selection independently.

[1.0.0]: https://github.com/nilsandrey/TextToolsPlugin/releases/tag/1.0.0
