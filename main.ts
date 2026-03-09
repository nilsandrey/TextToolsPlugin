import { Editor, Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, TextToolsSettings } from "./src/settings";
import { TextToolsSettingTab } from "./src/settings-tab";
import { normalizeRange, transformSelections } from "./src/utils";

// Transforms
import {
	toCamelCase, toPascalCase, toConstantCase, toDashCase,
	toSnakeCase, toDotCase, toTitleCase, toSpongeCase, swapCase,
	separateWithSpaces, separateWithSlashes, separateWithBackslashes,
	reverseLines, slugify, latinize,
} from "./src/transforms/case";

import {
	removeDuplicateLines, removeAdjacentDuplicateLines, keepOnlyDuplicateLines,
	removeBlankLines, removeEmptyLines, removeSurplusBlankLines,
	sortLinesCaseSensitive, sortLinesCaseInsensitive, sortLinesByLength,
	sortLinesByWordCount,
	shuffleLines,
	trimLines, trimLinesStart, trimLinesEnd,
	removeWhitespace, replaceNewlinesWithSpace, collapseWhitespace,
	prefixLines, suffixLines, wrapLines,
	splitLines, joinAllLines, joinEveryNLines,
	countLineOccurrences,
	padLinesStart, padLinesEnd,
} from "./src/transforms/lines";

import {
	urlEncode, urlDecode,
	htmlEncode, htmlDecode,
	base64Encode, base64Decode,
	jsonEscape, jsonUnescape,
	decimalToHex, hexToDecimal,
} from "./src/transforms/encode";

import { shiftNumbers } from "./src/transforms/numbers";

import {
	generateGuid, GuidFormat,
	randomInt, randomFloat, randomHex,
	loremSentence, loremParagraph,
	getSequenceItem, SequenceType,
	timestampLocal, timestampUTC, timestampUnix,
} from "./src/transforms/generate";

// Modals
import { InputModal } from "./src/modals/InputModal";
import { TwoInputModal } from "./src/modals/TwoInputModal";

export default class TextToolsPlugin extends Plugin {
	settings: TextToolsSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new TextToolsSettingTab(this.app, this));

		this.registerCaseCommands();
		this.registerLineCommands();
		this.registerFilterCommands();
		this.registerEncodeCommands();
		this.registerNumberCommands();
		this.registerGenerateCommands();
		this.registerAdvancedCommands();
		this.registerLineNumberCommands();
		this.registerTextSlotCommands();
	}

	// =========================================================================
	// Case / format
	// =========================================================================

	private registerCaseCommands() {
		const cmds: Array<[string, string, (t: string) => string]> = [
			["uppercase",          "Upper case",                       (t) => t.toUpperCase()],
			["lowercase",          "Lower case",                       (t) => t.toLowerCase()],
			["camelcase",          "camelCase",                        toCamelCase],
			["pascalcase",         "PascalCase",                       toPascalCase],
			["constantcase",       "CONSTANT_CASE",                    toConstantCase],
			["dashcase",           "Dash case (kebab-case)",           toDashCase],
			["snakecase",          "Snake case",                       toSnakeCase],
			["dotcase",            "Dot case",                         toDotCase],
			["titlecase",          "Title case",                       toTitleCase],
			["spongecase",         "sPoNgE cAsE",                      toSpongeCase],
			["swapcase",           "Swap case",                        swapCase],
			["separate-spaces",    "Separate words with spaces",       separateWithSpaces],
			["separate-slashes",   "Separate words with slashes",      separateWithSlashes],
			["separate-backslash", "Separate words with backslashes",  separateWithBackslashes],
			["reverse-lines",      "Reverse characters on each line",  reverseLines],
			["slugify",            "Slugify",                          slugify],
			["latinize",           "Latinize (remove diacritics)",     latinize],
		];
		for (const [id, name, fn] of cmds) {
			this.addCommand({
				id,
				name,
				editorCallback: (editor) => {
					if (!transformSelections(editor, fn)) {
						new Notice("Select some text first.");
					}
				},
			});
		}
	}

	// =========================================================================
	// Line operations
	// =========================================================================

	private registerLineCommands() {
		// Simple transforms
		const simple: Array<[string, string, (t: string) => string]> = [
			["remove-duplicate-lines",         "Remove duplicate lines",                  removeDuplicateLines],
			["remove-adjacent-duplicate-lines","Remove adjacent duplicate lines",         removeAdjacentDuplicateLines],
			["keep-only-duplicate-lines",      "Keep only duplicate lines",               keepOnlyDuplicateLines],
			["remove-blank-lines",             "Remove blank lines",                      removeBlankLines],
			["remove-empty-lines",             "Remove empty lines",                      removeEmptyLines],
			["remove-surplus-blank-lines",     "Remove surplus blank lines",              removeSurplusBlankLines],
			["shuffle-lines",                  "Shuffle lines",                           shuffleLines],
			["sort-lines-cs-asc",              "Sort lines (case sensitive, A→Z)",        (t) => sortLinesCaseSensitive(t, "asc")],
			["sort-lines-cs-desc",             "Sort lines (case sensitive, Z→A)",        (t) => sortLinesCaseSensitive(t, "desc")],
			["sort-lines-ci-asc",              "Sort lines (case insensitive, A→Z)",      (t) => sortLinesCaseInsensitive(t, "asc")],
			["sort-lines-ci-desc",             "Sort lines (case insensitive, Z→A)",      (t) => sortLinesCaseInsensitive(t, "desc")],
			["sort-lines-length-asc",          "Sort lines by length (shortest first)",   (t) => sortLinesByLength(t, "asc")],
			["sort-lines-length-desc",         "Sort lines by length (longest first)",    (t) => sortLinesByLength(t, "desc")],
			["sort-lines-wordcount-asc",       "Sort lines by word count (fewest first)", (t) => sortLinesByWordCount(t, "asc")],
			["sort-lines-wordcount-desc",      "Sort lines by word count (most first)",   (t) => sortLinesByWordCount(t, "desc")],
			["trim-lines",                     "Trim leading and trailing whitespace",    trimLines],
			["trim-lines-start",               "Trim leading whitespace",                 trimLinesStart],
			["trim-lines-end",                 "Trim trailing whitespace",                trimLinesEnd],
			["remove-whitespace",              "Remove all whitespace characters",        removeWhitespace],
			["replace-newlines-space",         "Replace newlines with a space",           replaceNewlinesWithSpace],
			["collapse-whitespace",            "Collapse whitespace to single space",     collapseWhitespace],
			["count-occurrences",              "Count line occurrences",                  countLineOccurrences],
		];

		for (const [id, name, fn] of simple) {
			this.addCommand({
				id,
				name,
				editorCallback: (editor) => {
					if (!transformSelections(editor, fn)) {
						new Notice("Select some text first.");
					}
				},
			});
		}

		// ---- Commands that require user input ----

		this.addCommand({
			id: "prefix-lines",
			name: "Prefix lines",
			editorCallback: (editor) => {
				new InputModal(this.app, {
					title: "Prefix lines",
					label: "Prefix",
					placeholder: ">> ",
					onSubmit: (prefix) =>
						transformSelections(editor, (t) => prefixLines(t, prefix)),
				}).open();
			},
		});

		this.addCommand({
			id: "suffix-lines",
			name: "Suffix lines",
			editorCallback: (editor) => {
				new InputModal(this.app, {
					title: "Suffix lines",
					label: "Suffix",
					placeholder: ";",
					onSubmit: (suffix) =>
						transformSelections(editor, (t) => suffixLines(t, suffix)),
				}).open();
			},
		});

		this.addCommand({
			id: "wrap-lines",
			name: "Wrap lines",
			editorCallback: (editor) => {
				new TwoInputModal(this.app, {
					title: "Wrap lines",
					label1: "Prefix",
					label2: "Suffix",
					placeholder1: "**",
					placeholder2: "**",
					onSubmit: (p, s) =>
						transformSelections(editor, (t) => wrapLines(t, p, s)),
				}).open();
			},
		});

		this.addCommand({
			id: "split-lines",
			name: "Split lines by delimiter",
			editorCallback: (editor) => {
				new InputModal(this.app, {
					title: "Split lines",
					label: "Delimiter",
					placeholder: ",",
					onSubmit: (delim) => {
						if (delim === "") return;
						transformSelections(editor, (t) => splitLines(t, delim));
					},
				}).open();
			},
		});

		this.addCommand({
			id: "join-lines",
			name: "Join all lines with a glue string",
			editorCallback: (editor) => {
				new InputModal(this.app, {
					title: "Join lines",
					label: "Glue (leave empty to join bare)",
					placeholder: ", ",
					onSubmit: (glue) =>
						transformSelections(editor, (t) => joinAllLines(t, glue)),
				}).open();
			},
		});

		this.addCommand({
			id: "join-n-lines",
			name: "Join every n lines",
			editorCallback: (editor) => {
				new TwoInputModal(this.app, {
					title: "Join every n lines",
					label1: "Number of lines per group",
					label2: "Glue",
					placeholder1: "2",
					placeholder2: " ",
					onSubmit: (nStr, glue) => {
						const n = parseInt(nStr, 10);
						if (!n || n < 1) {
							new Notice("Enter a positive integer.");
							return;
						}
						transformSelections(editor, (t) => joinEveryNLines(t, n, glue));
					},
				}).open();
			},
		});

		this.addCommand({
			id: "pad-start",
			name: "Pad lines at start",
			editorCallback: (editor) => {
				new TwoInputModal(this.app, {
					title: "Pad lines at start",
					label1: "Target length",
					label2: "Pad character",
					placeholder1: "10",
					placeholder2: this.settings.defaultPadString,
					default2: this.settings.defaultPadString,
					onSubmit: (lenStr, padChar) => {
						const len = parseInt(lenStr, 10);
						if (isNaN(len)) { new Notice("Enter a valid number."); return; }
						transformSelections(editor, (t) => padLinesStart(t, len, padChar));
					},
				}).open();
			},
		});

		this.addCommand({
			id: "pad-end",
			name: "Pad lines at end",
			editorCallback: (editor) => {
				new TwoInputModal(this.app, {
					title: "Pad lines at end",
					label1: "Target length",
					label2: "Pad character",
					placeholder1: "10",
					placeholder2: this.settings.defaultPadString,
					default2: this.settings.defaultPadString,
					onSubmit: (lenStr, padChar) => {
						const len = parseInt(lenStr, 10);
						if (isNaN(len)) { new Notice("Enter a valid number."); return; }
						transformSelections(editor, (t) => padLinesEnd(t, len, padChar));
					},
				}).open();
			},
		});
	}

	// =========================================================================
	// Filter lines
	// =========================================================================

	private registerFilterCommands() {
		type FilterMode = "include" | "exclude";
		type MatchMode  = "string" | "regex";

		const runFilter = (
			text: string,
			query: string,
			filterMode: FilterMode,
			matchMode: MatchMode,
			caseSensitive: boolean
		): string => {
			const lines = text.split("\n");
			return lines
				.filter((line) => {
					let matches: boolean;
					if (matchMode === "regex") {
						try {
							const flags = caseSensitive ? "" : "i";
							matches = new RegExp(query, flags).test(line);
						} catch {
							new Notice("Invalid regular expression.");
							matches = false;
						}
					} else {
						matches = caseSensitive
							? line.includes(query)
							: line.toLowerCase().includes(query.toLowerCase());
					}
					return filterMode === "include" ? matches : !matches;
				})
				.join("\n");
		};

		const makeFilterCommand = (
			id: string,
			name: string,
			filterMode: FilterMode,
			matchMode: MatchMode,
			toNewNote: boolean
		) => {
			this.addCommand({
				id,
				name,
				editorCallback: (editor) => {
					const history = this.settings.filterHistory.slice(0, 10);
					new InputModal(this.app, {
						title: name,
						label: matchMode === "regex" ? "Regular expression" : "Filter string",
						placeholder: matchMode === "regex" ? "^error" : "error",
						defaultValue: history[0] ?? "",
						onSubmit: async (query) => {
							if (!query) return;
							// Save to history
							this.settings.filterHistory = [
								query,
								...this.settings.filterHistory.filter((h) => h !== query),
							].slice(0, 10);
							await this.saveSettings();

							const cs = this.settings.caseSensitiveFiltering;

							if (toNewNote) {
								const selections = editor.listSelections();
								const results: string[] = [];
								for (const sel of selections) {
									const { from, to } = normalizeRange(sel.anchor, sel.head);
									if (from.line === to.line && from.ch === to.ch) continue;
									results.push(runFilter(editor.getRange(from, to), query, filterMode, matchMode, cs));
								}
								if (results.length === 0) {
									new Notice("No selection to filter.");
									return;
								}
								const newFile = await this.app.vault.create(
									`Filter result ${Date.now()}.md`,
									results.join("\n\n---\n\n")
								);
								await this.app.workspace.openLinkText(newFile.path, "", true);
							} else {
								transformSelections(editor, (t) =>
									runFilter(t, query, filterMode, matchMode, cs)
								);
							}
						},
					}).open();
				},
			});
		};

		// 4 in-place variants
		makeFilterCommand("filter-include-string",  "Filter lines: keep matching string",         "include", "string", false);
		makeFilterCommand("filter-exclude-string",  "Filter lines: remove matching string",       "exclude", "string", false);
		makeFilterCommand("filter-include-regex",   "Filter lines: keep matching regex",          "include", "regex",  false);
		makeFilterCommand("filter-exclude-regex",   "Filter lines: remove matching regex",        "exclude", "regex",  false);
		// 4 new-note variants
		makeFilterCommand("filter-include-string-new", "Filter lines into new note: keep matching string",  "include", "string", true);
		makeFilterCommand("filter-exclude-string-new", "Filter lines into new note: remove matching string","exclude", "string", true);
		makeFilterCommand("filter-include-regex-new",  "Filter lines into new note: keep matching regex",   "include", "regex",  true);
		makeFilterCommand("filter-exclude-regex-new",  "Filter lines into new note: remove matching regex", "exclude", "regex",  true);
	}

	// =========================================================================
	// Encoding / conversion
	// =========================================================================

	private registerEncodeCommands() {
		const cmds: Array<[string, string, (t: string) => string]> = [
			["url-encode",         "URL encode",               urlEncode],
			["url-decode",         "URL decode",               urlDecode],
			["html-encode",        "HTML entity encode",       htmlEncode],
			["html-decode",        "HTML entity decode",       htmlDecode],
			["base64-encode",      "Base64 encode",            base64Encode],
			["base64-decode",      "Base64 decode",            base64Decode],
			["json-escape",        "JSON escape (to string)",  jsonEscape],
			["json-unescape",      "JSON unescape",            jsonUnescape],
			["decimal-to-hex",     "Convert decimal to hex",   decimalToHex],
			["hex-to-decimal",     "Convert hex to decimal",   hexToDecimal],
		];
		for (const [id, name, fn] of cmds) {
			this.addCommand({
				id,
				name,
				editorCallback: (editor) => {
					if (!transformSelections(editor, fn)) {
						new Notice("Select some text first.");
					}
				},
			});
		}
	}

	// =========================================================================
	// Numbers: increase / decrease
	// =========================================================================

	private registerNumberCommands() {
		this.addCommand({
			id: "increase-numbers",
			name: "Increase numbers by 1",
			editorCallback: (editor) =>
				transformSelections(editor, (t) => shiftNumbers(t, 1)),
		});

		this.addCommand({
			id: "decrease-numbers",
			name: "Decrease numbers by 1",
			editorCallback: (editor) =>
				transformSelections(editor, (t) => shiftNumbers(t, -1)),
		});

		this.addCommand({
			id: "increase-numbers-by",
			name: "Increase numbers by custom step",
			editorCallback: (editor) => {
				new InputModal(this.app, {
					title: "Increase numbers",
					label: "Step",
					placeholder: "10",
					onSubmit: (s) => {
						const n = parseInt(s, 10);
						if (isNaN(n)) { new Notice("Enter a valid integer."); return; }
						transformSelections(editor, (t) => shiftNumbers(t, n));
					},
				}).open();
			},
		});

		this.addCommand({
			id: "decrease-numbers-by",
			name: "Decrease numbers by custom step",
			editorCallback: (editor) => {
				new InputModal(this.app, {
					title: "Decrease numbers",
					label: "Step",
					placeholder: "10",
					onSubmit: (s) => {
						const n = parseInt(s, 10);
						if (isNaN(n)) { new Notice("Enter a valid integer."); return; }
						transformSelections(editor, (t) => shiftNumbers(t, -n));
					},
				}).open();
			},
		});
	}

	// =========================================================================
	// Generate / insert
	// =========================================================================

	private registerGenerateCommands() {
		// --- GUIDs ---
		const guidFormats: Array<[GuidFormat, string]> = [
			["dashes",   "Insert GUID (with dashes)"],
			["nodashes", "Insert GUID (no dashes)"],
			["braces",   "Insert GUID (with braces)"],
			["csharp",   "Insert GUID (C# constructor)"],
		];
		for (const [format, name] of guidFormats) {
			this.addCommand({
				id: `insert-guid-${format}`,
				name,
				editorCallback: (editor) =>
					this.insertAtEachSelection(editor, () =>
						generateGuid(format, this.settings.insertUppercaseGuids)
					),
			});
		}

		// --- Random numbers ---
		this.addCommand({
			id: "random-int",
			name: "Insert random integer from range",
			editorCallback: (editor) => {
				new TwoInputModal(this.app, {
					title: "Random integer",
					label1: "Min",
					label2: "Max",
					placeholder1: "1",
					placeholder2: "100",
					onSubmit: (minS, maxS) => {
						const [min, max] = [parseInt(minS, 10), parseInt(maxS, 10)];
						if (isNaN(min) || isNaN(max)) { new Notice("Enter valid numbers."); return; }
						this.insertAtEachSelection(editor, () => String(randomInt(min, max)));
					},
				}).open();
			},
		});

		this.addCommand({
			id: "random-float",
			name: "Insert random real number from range",
			editorCallback: (editor) => {
				new TwoInputModal(this.app, {
					title: "Random real number",
					label1: "Min",
					label2: "Max",
					placeholder1: "0",
					placeholder2: "1",
					onSubmit: (minS, maxS) => {
						const [min, max] = [parseFloat(minS), parseFloat(maxS)];
						if (isNaN(min) || isNaN(max)) { new Notice("Enter valid numbers."); return; }
						this.insertAtEachSelection(editor, () => randomFloat(min, max));
					},
				}).open();
			},
		});

		this.addCommand({
			id: "random-hex",
			name: "Insert random hexadecimal number from range",
			editorCallback: (editor) => {
				new TwoInputModal(this.app, {
					title: "Random hex number",
					label1: "Min (decimal)",
					label2: "Max (decimal)",
					placeholder1: "0",
					placeholder2: "255",
					onSubmit: (minS, maxS) => {
						const [min, max] = [parseInt(minS, 10), parseInt(maxS, 10)];
						if (isNaN(min) || isNaN(max)) { new Notice("Enter valid numbers."); return; }
						this.insertAtEachSelection(editor, () =>
							randomHex(min, max, this.settings.insertUppercaseGuids)
						);
					},
				}).open();
			},
		});

		// --- Lorem ipsum ---
		this.addCommand({
			id: "lorem-sentence",
			name: "Insert lorem ipsum sentence",
			editorCallback: (editor) =>
				this.insertAtEachSelection(editor, loremSentence),
		});

		this.addCommand({
			id: "lorem-paragraph",
			name: "Insert lorem ipsum paragraph",
			editorCallback: (editor) =>
				this.insertAtEachSelection(editor, loremParagraph),
		});

		// --- Sequences ---
		const sequences: Array<[SequenceType, string]> = [
			["uppercase-letters", "Insert sequence: uppercase letters (A, B, C…)"],
			["lowercase-letters", "Insert sequence: lowercase letters (a, b, c…)"],
			["nato",              "Insert sequence: NATO phonetic alphabet"],
			["months-long",       "Insert sequence: long month names"],
			["months-short",      "Insert sequence: short month names"],
			["days-long",         "Insert sequence: long day names"],
			["days-short",        "Insert sequence: short day names"],
		];
		for (const [type, name] of sequences) {
			this.addCommand({
				id: `sequence-${type}`,
				name,
				editorCallback: (editor) => {
					const sels = editor.listSelections();
					const hasMultiple = sels.filter(
						(s) => s.anchor.line !== s.head.line || s.anchor.ch !== s.head.ch
					).length > 1;

					if (hasMultiple) {
						// Fill each selection with the next item
						let idx = 0;
						for (let i = sels.length - 1; i >= 0; i--) {
							const { from, to } = normalizeRange(sels[i].anchor, sels[i].head);
							if (from.line === to.line && from.ch === to.ch) continue;
							editor.replaceRange(getSequenceItem(type, idx++), from, to);
						}
					} else {
						// Single cursor or single selection — ask how many
						new InputModal(this.app, {
							title: name,
							label: "How many items to insert?",
							placeholder: "5",
							onSubmit: (countStr) => {
								const count = parseInt(countStr, 10);
								if (isNaN(count) || count < 1) {
									new Notice("Enter a positive number.");
									return;
								}
								const items: string[] = [];
								for (let i = 0; i < count; i++) {
									items.push(getSequenceItem(type, i));
								}
								// Insert at cursor (replace any selection)
								const sel = sels[sels.length - 1];
								const { from, to } = normalizeRange(sel.anchor, sel.head);
								editor.replaceRange(items.join("\n"), from, to);
							},
						}).open();
					}
				},
			});
		}

		// --- Timestamps ---
		this.addCommand({
			id: "insert-timestamp-local",
			name: "Insert timestamp (local)",
			editorCallback: (editor) =>
				this.insertAtEachSelection(editor, timestampLocal),
		});
		this.addCommand({
			id: "insert-timestamp-utc",
			name: "Insert timestamp (UTC / ISO 8601)",
			editorCallback: (editor) =>
				this.insertAtEachSelection(editor, timestampUTC),
		});
		this.addCommand({
			id: "insert-timestamp-unix",
			name: "Insert Unix timestamp",
			editorCallback: (editor) =>
				this.insertAtEachSelection(editor, timestampUnix),
		});
	}

	// =========================================================================
	// Advanced: format as table, extract via regex, duplicate
	// =========================================================================

	private registerAdvancedCommands() {
		// --- Format as table ---
		this.addCommand({
			id: "format-as-table",
			name: "Format as table",
			editorCallback: (editor) => {
				new InputModal(this.app, {
					title: "Format as table",
					label: "Column delimiter",
					placeholder: "\\t",
					defaultValue: "\\t",
					onSubmit: (delimRaw) => {
						const delim = delimRaw
							.replace(/\\t/g, "\t")
							.replace(/\\n/g, "\n");
						transformSelections(editor, (text) => formatAsTable(text, delim));
					},
				}).open();
			},
		});

		// --- Extract via regex ---
		this.addCommand({
			id: "extract-regex",
			name: "Extract with regex",
			editorCallback: (editor) => {
				new TwoInputModal(this.app, {
					title: "Extract with regex",
					label1: "Pattern (with capture groups)",
					label2: "Replacement (use $1, $2…)",
					placeholder1: "(\\w+)\\s(\\w+)",
					placeholder2: "$2, $1",
					onSubmit: (pattern, replacement) => {
						let regex: RegExp;
						try {
							regex = new RegExp(pattern, "g");
						} catch {
							new Notice("Invalid regular expression.");
							return;
						}
						transformSelections(editor, (text) =>
							text
								.split("\n")
								.filter((line) => regex.test(line))
								.map((line) => {
									regex.lastIndex = 0;
									return line.replace(regex, replacement.replace(/\\n/g, "\n"));
								})
								.join("\n")
						);
					},
				}).open();
			},
		});

		// --- Duplicate selection ---
		this.addCommand({
			id: "duplicate-selection",
			name: "Duplicate selection",
			editorCallback: (editor) => {
				transformSelections(editor, (t) => t + t);
			},
		});
	}

	// =========================================================================
	// Line numbers (kept from v1)
	// =========================================================================

	private registerLineNumberCommands() {
		const insert = (editor: Editor, style: "sequential" | "real") => {
			const selections = editor.listSelections();
			const hasSelection = selections.some(
				(s) => s.anchor.line !== s.head.line || s.anchor.ch !== s.head.ch
			);
			if (!hasSelection) { new Notice("Select some text first."); return; }

			let maxLineNum = 0;
			if (this.settings.padLineNumbers) {
				for (const sel of selections) {
					const { from, to } = normalizeRange(sel.anchor, sel.head);
					if (from.line === to.line && from.ch === to.ch) continue;
					const lc = editor.getRange(from, to).split("\n").length;
					const last = style === "real" ? from.line + lc : lc;
					if (last > maxLineNum) maxLineNum = last;
				}
			}
			const padWidth = this.settings.padLineNumbers
				? String(maxLineNum).length
				: 0;

			for (let i = selections.length - 1; i >= 0; i--) {
				const { from, to } = normalizeRange(
					selections[i].anchor,
					selections[i].head
				);
				if (from.line === to.line && from.ch === to.ch) continue;
				const lines = editor.getRange(from, to).split("\n");
				const numbered = lines.map((line, idx) => {
					const num = style === "real" ? from.line + idx + 1 : idx + 1;
					const numStr = this.settings.padLineNumbers
						? String(num).padStart(padWidth, "0")
						: String(num);
					return `${numStr}${this.settings.lineNumberSeparator}${line}`;
				});
				editor.replaceRange(numbered.join("\n"), from, to);
			}
		};

		this.addCommand({
			id: "line-numbers-sequential",
			name: "Insert line numbers (sequential, starting at 1)",
			editorCallback: (editor) => insert(editor, "sequential"),
		});
		this.addCommand({
			id: "line-numbers-real",
			name: "Insert line numbers (real file line numbers)",
			editorCallback: (editor) => insert(editor, "real"),
		});
	}

	// =========================================================================
	// Text slots  (5 persistent named clipboard entries)
	// =========================================================================

	private registerTextSlotCommands() {
		for (let i = 1; i <= 5; i++) {
			const idx = i - 1;

			this.addCommand({
				id: `text-slot-set-${i}`,
				name: `Text slot ${i}: set`,
				editorCallback: (editor) => {
					const selections = editor.listSelections();
					const texts: string[] = [];
					for (const sel of selections) {
						const { from, to } = normalizeRange(sel.anchor, sel.head);
						if (from.line === to.line && from.ch === to.ch) continue;
						texts.push(editor.getRange(from, to));
					}
					if (texts.length === 0) {
						new Notice("Select text to store in the slot.");
						return;
					}
					this.settings.textSlots[idx] = texts.join("\n");
					void this.saveSettings().catch((error) => {
						console.error("Text Tools: failed to save settings", error);
					});
					new Notice(`Text slot ${i} set.`);
				},
			});

			this.addCommand({
				id: `text-slot-paste-${i}`,
				name: `Text slot ${i}: paste`,
				editorCallback: (editor) => {
					const content = this.settings.textSlots[idx];
					if (!content) {
						new Notice(`Text slot ${i} is empty.`);
						return;
					}
					this.insertAtEachSelection(editor, () => content);
				},
			});
		}
	}

	// =========================================================================
	// Shared helpers
	// =========================================================================

	/**
	 * Inserts `factory()` at every selection / cursor position.
	 * Each selection is replaced by the generated value; a new independent value
	 * is generated for each selection by calling factory() again.
	 */
	private insertAtEachSelection(
		editor: Editor,
		factory: () => string
	): void {
		const selections = editor.listSelections();
		for (let i = selections.length - 1; i >= 0; i--) {
			const { from, to } = normalizeRange(
				selections[i].anchor,
				selections[i].head
			);
			editor.replaceRange(factory(), from, to);
		}
	}

	// =========================================================================
	// Persistence
	// =========================================================================

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, (await this.loadData()) as Partial<TextToolsSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// ---------------------------------------------------------------------------
// Format as table (lives here because it's a standalone utility)
// ---------------------------------------------------------------------------

function formatAsTable(text: string, delimiter: string): string {
	const rows = text.split("\n").map((line) => line.split(delimiter));
	const colCount = Math.max(...rows.map((r) => r.length));
	const colWidths = Array.from({ length: colCount }, (_, ci) =>
		Math.max(...rows.map((r) => (r[ci] ?? "").length))
	);
	return rows
		.map((row) =>
			row
				.map((cell, ci) => cell.padEnd(colWidths[ci]))
				.join("  ")
				.trimEnd()
		)
		.join("\n");
}
