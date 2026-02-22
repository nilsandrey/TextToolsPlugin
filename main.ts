import {
	App,
	Editor,
	EditorPosition,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

interface TextToolsSettings {
	lineNumberSeparator: string;
	padLineNumbers: boolean;
}

const DEFAULT_SETTINGS: TextToolsSettings = {
	lineNumberSeparator: ". ",
	padLineNumbers: false,
};

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export default class TextToolsPlugin extends Plugin {
	settings: TextToolsSettings;

	async onload() {
		await this.loadSettings();

		// --- Case commands ---------------------------------------------------

		this.addCommand({
			id: "uppercase",
			name: "Upper case",
			editorCallback: (editor: Editor) => {
				this.transformSelections(editor, (text) => text.toUpperCase());
			},
		});

		this.addCommand({
			id: "lowercase",
			name: "Lower case",
			editorCallback: (editor: Editor) => {
				this.transformSelections(editor, (text) => text.toLowerCase());
			},
		});

		this.addCommand({
			id: "dashcase",
			name: "Dash case",
			editorCallback: (editor: Editor) => {
				this.transformSelections(editor, toDashCase);
			},
		});

		this.addCommand({
			id: "snakecase",
			name: "Snake case",
			editorCallback: (editor: Editor) => {
				this.transformSelections(editor, toSnakeCase);
			},
		});

		// --- Line number commands --------------------------------------------

		this.addCommand({
			id: "line-numbers-sequential",
			name: "Insert line numbers (sequential, starting at 1)",
			editorCallback: (editor: Editor) => {
				this.insertLineNumbers(editor, "sequential");
			},
		});

		this.addCommand({
			id: "line-numbers-real",
			name: "Insert line numbers (real file line numbers)",
			editorCallback: (editor: Editor) => {
				this.insertLineNumbers(editor, "real");
			},
		});

		// --- Settings tab ---------------------------------------------------

		this.addSettingTab(new TextToolsSettingTab(this.app, this));
	}

	// -------------------------------------------------------------------------
	// Core helpers
	// -------------------------------------------------------------------------

	/**
	 * Applies `transform` to every non-empty selection range, processing them
	 * in reverse document order so that replacing text in one range does not
	 * shift the character offsets of the remaining ranges.
	 */
	private transformSelections(
		editor: Editor,
		transform: (text: string) => string
	) {
		const selections = editor.listSelections();

		const hasSelection = selections.some(
			(sel) =>
				sel.anchor.line !== sel.head.line ||
				sel.anchor.ch !== sel.head.ch
		);

		if (!hasSelection) {
			new Notice("Select some text first.");
			return;
		}

		for (let i = selections.length - 1; i >= 0; i--) {
			const { from, to } = normalizeRange(
				selections[i].anchor,
				selections[i].head
			);
			if (from.line === to.line && from.ch === to.ch) continue;

			const original = editor.getRange(from, to);
			editor.replaceRange(transform(original), from, to);
		}
	}

	/**
	 * Prepends a line number to every line in each selection.
	 * `style === "sequential"` → numbers restart at 1 for each selection.
	 * `style === "real"`       → numbers reflect actual 1-based file line numbers.
	 */
	private insertLineNumbers(
		editor: Editor,
		style: "sequential" | "real"
	) {
		const selections = editor.listSelections();

		const hasSelection = selections.some(
			(sel) =>
				sel.anchor.line !== sel.head.line ||
				sel.anchor.ch !== sel.head.ch
		);

		if (!hasSelection) {
			new Notice("Select some text first.");
			return;
		}

		// Pre-calculate the widest line number for zero-padding.
		let maxLineNum = 0;
		if (this.settings.padLineNumbers) {
			for (const sel of selections) {
				const { from, to } = normalizeRange(sel.anchor, sel.head);
				if (from.line === to.line && from.ch === to.ch) continue;
				const lineCount = editor
					.getRange(from, to)
					.split("\n").length;
				const last =
					style === "real"
						? from.line + lineCount // 1-based, so no +1 needed here
						: lineCount;
				if (last > maxLineNum) maxLineNum = last;
			}
		}
		const padWidth = this.settings.padLineNumbers
			? String(maxLineNum).length
			: 0;

		// Process in reverse order to preserve earlier positions.
		for (let i = selections.length - 1; i >= 0; i--) {
			const { from, to } = normalizeRange(
				selections[i].anchor,
				selections[i].head
			);
			if (from.line === to.line && from.ch === to.ch) continue;

			const text = editor.getRange(from, to);
			const lines = text.split("\n");

			const numbered = lines.map((line, idx) => {
				const num =
					style === "real"
						? from.line + idx + 1 // Obsidian lines are 0-based internally
						: idx + 1;
				const numStr = this.settings.padLineNumbers
					? String(num).padStart(padWidth, "0")
					: String(num);
				return `${numStr}${this.settings.lineNumberSeparator}${line}`;
			});

			editor.replaceRange(numbered.join("\n"), from, to);
		}
	}

	// -------------------------------------------------------------------------
	// Persistence
	// -------------------------------------------------------------------------

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// ---------------------------------------------------------------------------
// Text transformation functions
// ---------------------------------------------------------------------------

/**
 * Converts text to dash-case (kebab-case): all lowercase, words joined by `-`.
 * Each line in a multi-line selection is processed independently.
 *
 * Examples:
 *   "Hello World"  → "hello-world"
 *   "fooBar Baz"   → "foo-bar-baz"
 *   "some_var"     → "some-var"
 */
function toDashCase(text: string): string {
	return text
		.split("\n")
		.map((line) =>
			line
				// Split camelCase words: "fooBar" → "foo Bar"
				.replace(/([a-z])([A-Z])/g, "$1 $2")
				// Treat underscores as word separators
				.replace(/[_]+/g, " ")
				// Collapse whitespace
				.replace(/\s+/g, " ")
				.trim()
				.toLowerCase()
				.replace(/\s+/g, "-")
				// Remove any character that isn't alphanumeric or a dash
				.replace(/[^a-z0-9-]/g, "")
				// Collapse consecutive dashes
				.replace(/-+/g, "-")
				.replace(/^-+|-+$/g, "")
		)
		.join("\n");
}

/**
 * Converts text to snake_case: all lowercase, words joined by `_`.
 * Each line in a multi-line selection is processed independently.
 *
 * Examples:
 *   "Hello World"  → "hello_world"
 *   "fooBar Baz"   → "foo_bar_baz"
 *   "some-var"     → "some_var"
 */
function toSnakeCase(text: string): string {
	return text
		.split("\n")
		.map((line) =>
			line
				.replace(/([a-z])([A-Z])/g, "$1 $2")
				.replace(/[-]+/g, " ")
				.replace(/\s+/g, " ")
				.trim()
				.toLowerCase()
				.replace(/\s+/g, "_")
				.replace(/[^a-z0-9_]/g, "")
				.replace(/_+/g, "_")
				.replace(/^_+|_+$/g, "")
		)
		.join("\n");
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Returns `from` / `to` such that `from` is always before `to` in the document,
 * regardless of whether the user selected top-to-bottom or bottom-to-top.
 */
function normalizeRange(
	anchor: EditorPosition,
	head: EditorPosition
): { from: EditorPosition; to: EditorPosition } {
	const anchorFirst =
		anchor.line < head.line ||
		(anchor.line === head.line && anchor.ch <= head.ch);
	return {
		from: anchorFirst ? anchor : head,
		to: anchorFirst ? head : anchor,
	};
}

// ---------------------------------------------------------------------------
// Settings tab
// ---------------------------------------------------------------------------

class TextToolsSettingTab extends PluginSettingTab {
	plugin: TextToolsPlugin;

	constructor(app: App, plugin: TextToolsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Text Tools" });

		// --- Line numbers section -------------------------------------------

		containerEl.createEl("h3", { text: "Line numbers" });

		new Setting(containerEl)
			.setName("Separator")
			.setDesc(
				'String placed between the line number and the line text. Default: ". "'
			)
			.addText((text) =>
				text
					.setPlaceholder(". ")
					.setValue(this.plugin.settings.lineNumberSeparator)
					.onChange(async (value) => {
						this.plugin.settings.lineNumberSeparator = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Pad with leading zeros")
			.setDesc(
				"Align line numbers by padding shorter numbers with leading zeros (e.g. 01, 02 … 10)."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.padLineNumbers)
					.onChange(async (value) => {
						this.plugin.settings.padLineNumbers = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
