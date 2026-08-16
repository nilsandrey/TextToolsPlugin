import { App, PluginSettingTab, SettingDefinitionItem } from "obsidian";
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
}
