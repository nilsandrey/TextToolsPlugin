import { App, PluginSettingTab, Setting, SettingDefinitionItem } from "obsidian";
import TextToolsPlugin from "../main";
import { TextToolsSettings } from "./settings";

export class TextToolsSettingTab extends PluginSettingTab {
	plugin: TextToolsPlugin;

	constructor(app: App, plugin: TextToolsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	// Obsidian 1.13.0+ renders from these definitions, which also makes the
	// settings appear in Obsidian's global settings search.
	getSettingDefinitions(): SettingDefinitionItem<keyof TextToolsSettings>[] {
		return [
			{
				type: "group",
				heading: "Line numbers",
				items: [
					{
						name: "Separator",
						desc: 'String between the line number and the line text. Default: ". "',
						control: {
							type: "text",
							key: "lineNumberSeparator",
							placeholder: ". ",
						},
					},
					{
						name: "Pad with leading zeros",
						desc: "Align numbers with leading zeros (01, 02 … 10).",
						control: {
							type: "toggle",
							key: "padLineNumbers",
						},
					},
				],
			},
			{
				type: "group",
				heading: "Filter lines",
				items: [
					{
						name: "Case-sensitive filtering",
						desc: "When on, filter commands match case exactly.",
						control: {
							type: "toggle",
							key: "caseSensitiveFiltering",
						},
					},
				],
			},
			{
				type: "group",
				heading: "Guids",
				items: [
					{
						name: "Uppercase hex digits",
						desc: "Insert guids using uppercase hex digits.",
						control: {
							type: "toggle",
							key: "insertUppercaseGuids",
						},
					},
				],
			},
			{
				type: "group",
				heading: "Padding",
				items: [
					{
						name: "Default pad character",
						desc: "Character used when padding lines (default: space).",
						control: {
							type: "text",
							key: "defaultPadString",
							placeholder: " ",
							validate: (value: string) =>
								value.length > 0 ? undefined : "Enter a pad character.",
						},
					},
				],
			},
		];
	}

	// Fallback for Obsidian versions older than 1.13.0, which do not support
	// getSettingDefinitions().
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
		new Setting(containerEl).setName("Guids").setHeading();

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
