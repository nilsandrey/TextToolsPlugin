# Local Text Tools

**Local Text Manipulation Tools Plugin for Obsidian**

A powerful Obsidian plugin that provides ~80 text manipulation commands accessible from the Command Palette with the prefix **`Text Tools:`**. Inspired by the [Text Power Tools](https://marketplace.visualstudio.com/items?itemName=qcz.text-power-tools) plugin for Visual Studio Code by [Dániel Tar](https://github.com/qcz).

## Commands Overview

| Category | Representative Commands |
|---|---|
| **Case / Format** | Upper case, Lower case, camelCase, PascalCase, CONSTANT_CASE, dash-case, snake_case, dot.case, Title Case, sPoNgE cAsE, Swap case, Slugify, Latinize |
| **Line Operations** | Sort (6 modes), Shuffle, Remove/keep duplicates, Trim, Prefix/Suffix/Wrap lines, Split/Join lines, Pad start/end, Count occurrences |
| **Filter Lines** | Keep or remove lines matching a string or regex — in-place or into a new note (8 commands) |
| **Encoding** | URL encode/decode, HTML entity encode/decode, Base64 encode/decode, JSON escape/unescape, Decimal ↔ Hex |
| **Numbers** | Increase/decrease all integers by 1 or a custom step |
| **Generate** | 4 GUID formats, random int/float/hex, Lorem ipsum, 7 sequences (letters, NATO, months, days), 3 timestamp formats |
| **Advanced** | Format as table, Extract with regex (capture groups), Duplicate selection |
| **Text Slots** | 5 persistent named clipboard entries (set / paste) |
| **Line Numbers** | Sequential (1, 2, 3…) or real file line numbers |

---

## Installation

1. Open **Obsidian Settings** → **Community Plugins** → **Browse**.
2. Search for **"Local Text Tools"** and click **Install**.
3. Enable the plugin under **Settings → Community Plugins**.
4. Optionally configure plugin parameters via **Settings → Local Text Tools**.

> **Manual install:** Download `main.js` and `manifest.json` from the [latest release](../../releases/latest) and copy them into `<vault>/.obsidian/plugins/text-tools/`.

---

## Usage

1. Open the **Command Palette** (`Ctrl/Cmd + P`).
2. Type **`Text Tools:`** followed by the command name (e.g. `Text Tools: Upper case`).
3. The command is applied to each active selection. If nothing is selected, you will be prompted to select text first.

Some commands open a small modal to collect additional input (e.g. the delimiter for *Split lines*, or the range for *Insert random integer*).

---

## Features

### Case / Format
| Command | Description |
|---|---|
| Upper case | Convert selected text to UPPERCASE |
| Lower case | Convert selected text to lowercase |
| camelCase | Convert to camelCase |
| PascalCase | Convert to PascalCase |
| CONSTANT_CASE | Convert to CONSTANT_CASE |
| Dash case (kebab-case) | Convert to dash-case |
| Snake case | Convert to snake_case |
| Dot case | Convert to dot.case |
| Title case | Convert to Title Case |
| sPoNgE cAsE | Convert to alternating sPoNgE cAsE |
| Swap case | Swap the case of each character |
| Separate words with spaces | Remove separators, join with spaces |
| Separate words with slashes | Remove separators, join with `/` |
| Separate words with backslashes | Remove separators, join with `\` |
| Reverse characters on each line | Reverse the character order per line |
| Slugify | Convert to URL-friendly slug |
| Latinize (remove diacritics) | Strip accents and diacritical marks |

### Line Operations
| Command | Description |
|---|---|
| Sort lines (case sensitive / insensitive, A→Z / Z→A) | 4 alphabetical sort variants |
| Sort lines by length (shortest / longest first) | 2 length sort variants |
| Sort lines by word count (fewest / most first) | 2 word-count sort variants |
| Shuffle lines | Randomise line order |
| Remove duplicate lines | Keep only the first occurrence of each line |
| Remove adjacent duplicate lines | Deduplicate consecutive identical lines |
| Keep only duplicate lines | Keep only lines that appear more than once |
| Remove blank lines | Remove lines that contain only whitespace |
| Remove empty lines | Remove completely empty lines |
| Remove surplus blank lines | Collapse multiple blank lines to one |
| Trim leading and trailing whitespace | Trim both ends of each line |
| Trim leading whitespace | Trim the start of each line |
| Trim trailing whitespace | Trim the end of each line |
| Remove all whitespace characters | Strip every whitespace character |
| Replace newlines with a space | Join lines with a space |
| Collapse whitespace to single space | Reduce all runs of whitespace to one space |
| Count line occurrences | Prefix each unique line with its count |
| Prefix lines | Add a string before every line |
| Suffix lines | Add a string after every line |
| Wrap lines | Add a prefix and suffix to every line |
| Split lines by delimiter | Split each line at a delimiter into multiple lines |
| Join all lines with a glue string | Join all lines using a glue string |
| Join every N lines | Group lines into blocks of N and join each block |
| Pad lines at start | Left-pad each line to a target length |
| Pad lines at end | Right-pad each line to a target length |

### Filter Lines
| Command | Description |
|---|---|
| Filter lines: keep matching string | Keep only lines containing a string |
| Filter lines: remove matching string | Remove lines containing a string |
| Filter lines: keep matching regex | Keep only lines matching a regex |
| Filter lines: remove matching regex | Remove lines matching a regex |
| Filter lines into new note: keep matching string | Same as above, output to a new note |
| Filter lines into new note: remove matching string | Same as above, output to a new note |
| Filter lines into new note: keep matching regex | Same as above, output to a new note |
| Filter lines into new note: remove matching regex | Same as above, output to a new note |

> Filter commands remember the last 10 queries used.

### Encoding
| Command | Description |
|---|---|
| URL encode | Percent-encode special characters |
| URL decode | Decode percent-encoded characters |
| HTML entity encode | Encode `<`, `>`, `&`, `"`, `'` as HTML entities |
| HTML entity decode | Decode HTML entities |
| Base64 encode | Encode to Base64 |
| Base64 decode | Decode from Base64 |
| JSON escape (to string) | Escape text as a JSON string literal |
| JSON unescape | Unescape a JSON string literal |
| Convert decimal to hex | Convert each decimal integer to hexadecimal |
| Convert hex to decimal | Convert each hexadecimal value to decimal |

### Numbers
| Command | Description |
|---|---|
| Increase numbers by 1 | Increment every integer in the selection |
| Decrease numbers by 1 | Decrement every integer in the selection |
| Increase numbers by custom step | Increment by a specified amount |
| Decrease numbers by custom step | Decrement by a specified amount |

### Generate / Insert
| Command | Description |
|---|---|
| Insert GUID (with dashes) | Insert a UUID v4 `xxxxxxxx-xxxx-…` |
| Insert GUID (no dashes) | Insert a UUID v4 without dashes |
| Insert GUID (with braces) | Insert a UUID v4 `{xxxxxxxx-…}` |
| Insert GUID (C# constructor) | Insert `new Guid("…")` |
| Insert random integer from range | Random integer between min and max |
| Insert random real number from range | Random floating-point number |
| Insert random hexadecimal number from range | Random hex value |
| Insert lorem ipsum sentence | Insert a single Lorem Ipsum sentence |
| Insert lorem ipsum paragraph | Insert a Lorem Ipsum paragraph |
| Insert sequence: uppercase letters | A, B, C… |
| Insert sequence: lowercase letters | a, b, c… |
| Insert sequence: NATO phonetic alphabet | Alpha, Bravo, Charlie… |
| Insert sequence: long month names | January, February… |
| Insert sequence: short month names | Jan, Feb… |
| Insert sequence: long day names | Monday, Tuesday… |
| Insert sequence: short day names | Mon, Tue… |
| Insert timestamp (local) | Current date/time in local time |
| Insert timestamp (UTC / ISO 8601) | Current date/time in UTC |
| Insert Unix timestamp | Current Unix epoch seconds |

### Advanced
| Command | Description |
|---|---|
| Format as table | Align columns using a configurable delimiter |
| Extract with regex | Extract and reformat lines using capture groups |
| Duplicate selection | Duplicate each selected block |

### Text Slots
| Command | Description |
|---|---|
| Text slot 1–5: set | Store the current selection in a named slot |
| Text slot 1–5: paste | Insert the stored slot content at the cursor |

### Line Numbers
| Command | Description |
|---|---|
| Insert line numbers (sequential) | Prefix lines 1, 2, 3… |
| Insert line numbers (real) | Prefix lines with their actual file line number |

---

## Contributing

Contributions are welcome and appreciated! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of changes.

---

## Acknowledgements

- Inspired by [Text Power Tools](https://marketplace.visualstudio.com/items?itemName=qcz.text-power-tools) for Visual Studio Code by [Dániel Tar](https://github.com/qcz).
- Built with the [Obsidian Plugin API](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin).

---

## Roadmap

- [ ] Settings-driven default values for more commands
- [ ] Regex history persistence across sessions
- [ ] Additional sequence types (Roman numerals, fibonacci, …)
- [ ] Community-requested transforms

> Have an idea? [Open a feature request](../../issues/new?template=feature_request.md).
