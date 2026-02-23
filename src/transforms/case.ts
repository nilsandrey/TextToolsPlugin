// ---------------------------------------------------------------------------
// Shared word-splitter
// Understands camelCase, PascalCase, snake_case, dash-case, dot.case, etc.
// ---------------------------------------------------------------------------
function splitWords(line: string): string[] {
	return line
		.replace(/([a-z\d])([A-Z])/g, "$1 $2") // camelCase → camel Case
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // XMLParser → XML Parser
		.replace(/[-_./\\]+/g, " ") // separators → space
		.split(/\s+/)
		.filter((w) => w.length > 0);
}

function perLine(
	text: string,
	fn: (line: string) => string
): string {
	return text.split("\n").map(fn).join("\n");
}

// ---------------------------------------------------------------------------
// Case transforms
// ---------------------------------------------------------------------------

export function toCamelCase(text: string): string {
	return perLine(text, (line) => {
		const words = splitWords(line);
		if (words.length === 0) return line;
		return (
			words[0].toLowerCase() +
			words
				.slice(1)
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
				.join("")
		);
	});
}

export function toPascalCase(text: string): string {
	return perLine(text, (line) =>
		splitWords(line)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join("")
	);
}

export function toConstantCase(text: string): string {
	return perLine(text, (line) =>
		splitWords(line)
			.map((w) => w.toUpperCase())
			.join("_")
	);
}

export function toDashCase(text: string): string {
	return perLine(text, (line) =>
		splitWords(line)
			.map((w) => w.toLowerCase())
			.join("-")
	);
}

export function toSnakeCase(text: string): string {
	return perLine(text, (line) =>
		splitWords(line)
			.map((w) => w.toLowerCase())
			.join("_")
	);
}

export function toDotCase(text: string): string {
	return perLine(text, (line) =>
		splitWords(line)
			.map((w) => w.toLowerCase())
			.join(".")
	);
}

export function toTitleCase(text: string): string {
	return perLine(text, (line) =>
		line.replace(
			/\b\w+/g,
			(w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
		)
	);
}

export function toSpongeCase(text: string): string {
	let upper = false;
	return text
		.split("")
		.map((char) => {
			if (char === " " || char === "\n" || char === "\t") return char;
			const result = upper ? char.toUpperCase() : char.toLowerCase();
			upper = !upper;
			return result;
		})
		.join("");
}

export function swapCase(text: string): string {
	return text
		.split("")
		.map((char) =>
			char === char.toUpperCase()
				? char.toLowerCase()
				: char.toUpperCase()
		)
		.join("");
}

// ---------------------------------------------------------------------------
// Word separators
// ---------------------------------------------------------------------------

export function separateWithSpaces(text: string): string {
	return perLine(text, (line) => splitWords(line).join(" "));
}

export function separateWithSlashes(text: string): string {
	return perLine(text, (line) => splitWords(line).join("/"));
}

export function separateWithBackslashes(text: string): string {
	return perLine(text, (line) => splitWords(line).join("\\"));
}

// ---------------------------------------------------------------------------
// Reverse / slugify / latinize
// ---------------------------------------------------------------------------

export function reverseLines(text: string): string {
	return perLine(text, (line) => line.split("").reverse().join(""));
}

/** Removes diacritic marks — e.g. "café" → "cafe", "Ñoño" → "Nono" */
export function latinize(text: string): string {
	return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** URL-friendly slug: lowercase, ASCII, spaces→dashes */
export function slugify(text: string): string {
	return perLine(text, (line) =>
		latinize(line)
			.toLowerCase()
			.replace(/[^\w\s-]/g, "")
			.replace(/[\s_]+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-+|-+$/g, "")
	);
}
