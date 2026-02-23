// ---------------------------------------------------------------------------
// GUID / UUID
// ---------------------------------------------------------------------------

/** Generates a v4 UUID using the Web Crypto API (available in Obsidian). */
function uuid(): string {
	if (
		typeof crypto !== "undefined" &&
		typeof crypto.randomUUID === "function"
	) {
		return crypto.randomUUID();
	}
	// Fallback for environments without randomUUID
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
	});
}

export type GuidFormat = "dashes" | "nodashes" | "braces" | "csharp";

export function generateGuid(format: GuidFormat, uppercase: boolean): string {
	const raw = uuid();
	const u = uppercase ? raw.toUpperCase() : raw.toLowerCase();
	switch (format) {
		case "nodashes":
			return u.replace(/-/g, "");
		case "braces":
			return `{${u}}`;
		case "csharp":
			return `new Guid("${u}")`;
		default:
			return u;
	}
}

// ---------------------------------------------------------------------------
// Random numbers
// ---------------------------------------------------------------------------

export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number, decimals = 4): string {
	return (Math.random() * (max - min) + min).toFixed(decimals);
}

export function randomHex(min: number, max: number, uppercase: boolean): string {
	const n = randomInt(min, max);
	return uppercase ? n.toString(16).toUpperCase() : n.toString(16);
}

// ---------------------------------------------------------------------------
// Lorem ipsum
// ---------------------------------------------------------------------------

const LOREM_WORDS = [
	"lorem", "ipsum", "dolor", "sit", "amet", "consectetur",
	"adipiscing", "elit", "sed", "do", "eiusmod", "tempor",
	"incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua",
	"enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
	"ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
	"consequat", "duis", "aute", "irure", "in", "reprehenderit",
	"voluptate", "velit", "esse", "cillum", "eu", "fugiat", "nulla",
	"pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non",
	"proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit",
	"anim", "id", "est", "laborum",
];

function randomLoremWord(): string {
	return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

export function loremSentence(): string {
	const len = randomInt(8, 16);
	const words: string[] = [];
	for (let i = 0; i < len; i++) words.push(randomLoremWord());
	words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
	return words.join(" ") + ".";
}

export function loremParagraph(): string {
	const count = randomInt(4, 7);
	const sentences: string[] = [];
	for (let i = 0; i < count; i++) sentences.push(loremSentence());
	return sentences.join(" ");
}

// ---------------------------------------------------------------------------
// Sequences
// ---------------------------------------------------------------------------

const UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

const NATO = [
	"Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf",
	"Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November",
	"Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform",
	"Victor", "Whiskey", "X-ray", "Yankee", "Zulu",
];

const MONTHS_LONG = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December",
];

const MONTHS_SHORT = [
	"Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DAYS_LONG = [
	"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type SequenceType =
	| "uppercase-letters"
	| "lowercase-letters"
	| "nato"
	| "months-long"
	| "months-short"
	| "days-long"
	| "days-short";

const SEQUENCES: Record<SequenceType, string[]> = {
	"uppercase-letters": UPPERCASE_LETTERS,
	"lowercase-letters": LOWERCASE_LETTERS,
	"nato": NATO,
	"months-long": MONTHS_LONG,
	"months-short": MONTHS_SHORT,
	"days-long": DAYS_LONG,
	"days-short": DAYS_SHORT,
};

export function getSequenceItem(type: SequenceType, index: number): string {
	const seq = SEQUENCES[type];
	return seq[index % seq.length];
}

export function getSequenceLength(type: SequenceType): number {
	return SEQUENCES[type].length;
}

// ---------------------------------------------------------------------------
// Timestamps
// ---------------------------------------------------------------------------

export function timestampLocal(): string {
	return new Date().toLocaleString();
}

export function timestampUTC(): string {
	return new Date().toISOString();
}

export function timestampUnix(): string {
	return Math.floor(Date.now() / 1000).toString();
}
