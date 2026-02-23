import { App, PluginSettingTab, Setting } from "obsidian";
import TextToolsPlugin from "../main";

export class TextToolsSettingTab extends PluginSettingTab {
	plugin: TextToolsPlugin;

	constructor(app: App, plugin: TextToolsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "Text Tools" });

		// ------------------------------------------------------------------ //
		// Line numbers
		// ------------------------------------------------------------------ //
		containerEl.createEl("h3", { text: "Line numbers" });

		new Setting(containerEl)
			.setName("Separator")
			.setDesc('String between the line number and the line text. Default: ". "')
			.addText((t) =>
				t
					.setPlaceholder(". ")
					.setValue(this.plugin.settings.lineNumberSeparator)
					.onChange(async (v) => {
						this.plugin.settings.lineNumberSeparator = v;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Pad with leading zeros")
			.setDesc("Align numbers with leading zeros (01, 02 … 10).")
			.addToggle((t) =>
				t
					.setValue(this.plugin.settings.padLineNumbers)
					.onChange(async (v) => {
						this.plugin.settings.padLineNumbers = v;
						await this.plugin.saveSettings();
					})
			);

		// ------------------------------------------------------------------ //
		// Filtering
		// ------------------------------------------------------------------ //
		containerEl.createEl("h3", { text: "Filter lines" });

		new Setting(containerEl)
			.setName("Case-sensitive filtering")
			.setDesc("When on, filter commands match case exactly.")
			.addToggle((t) =>
				t
					.setValue(this.plugin.settings.caseSensitiveFiltering)
					.onChange(async (v) => {
						this.plugin.settings.caseSensitiveFiltering = v;
						await this.plugin.saveSettings();
					})
			);

		// ------------------------------------------------------------------ //
		// GUIDs
		// ------------------------------------------------------------------ //
		containerEl.createEl("h3", { text: "GUIDs" });

		new Setting(containerEl)
			.setName("Uppercase hex digits")
			.setDesc("Insert GUIDs with uppercase hex characters (e.g. A1B2… vs a1b2…).")
			.addToggle((t) =>
				t
					.setValue(this.plugin.settings.insertUppercaseGuids)
					.onChange(async (v) => {
						this.plugin.settings.insertUppercaseGuids = v;
						await this.plugin.saveSettings();
					})
			);

		// ------------------------------------------------------------------ //
		// Padding
		// ------------------------------------------------------------------ //
		containerEl.createEl("h3", { text: "Padding" });

		new Setting(containerEl)
			.setName("Default pad character")
			.setDesc("Character used when padding lines (default: space).")
			.addText((t) =>
				t
					.setPlaceholder(" ")
					.setValue(this.plugin.settings.defaultPadString)
					.onChange(async (v) => {
						this.plugin.settings.defaultPadString = v || " ";
						await this.plugin.saveSettings();
					})
			);
	}
}
