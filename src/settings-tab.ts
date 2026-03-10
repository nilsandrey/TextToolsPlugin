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

		// ------------------------------------------------------------------ //
		// Line numbers
		// ------------------------------------------------------------------ //
		new Setting(containerEl).setName("Line numbers").setHeading();

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
		new Setting(containerEl).setName("Filter lines").setHeading();

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
		new Setting(containerEl).setName("GUIDs").setHeading();

		new Setting(containerEl)
			.setName("Uppercase hex digits")
			.setDesc("Insert guids using uppercase hex digits.")
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
		new Setting(containerEl).setName("Padding").setHeading();

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
