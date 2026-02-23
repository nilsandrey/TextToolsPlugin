export interface TextToolsSettings {
	// Line numbers
	lineNumberSeparator: string;
	padLineNumbers: boolean;
	// Filtering
	caseSensitiveFiltering: boolean;
	filterHistory: string[];
	// GUIDs
	insertUppercaseGuids: boolean;
	// Padding
	defaultPadString: string;
	// Text slots
	textSlots: string[];
}

export const DEFAULT_SETTINGS: TextToolsSettings = {
	lineNumberSeparator: ". ",
	padLineNumbers: false,
	caseSensitiveFiltering: false,
	filterHistory: [],
	insertUppercaseGuids: false,
	defaultPadString: " ",
	textSlots: ["", "", "", "", ""],
};
