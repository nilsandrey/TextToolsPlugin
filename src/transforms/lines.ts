// ---------------------------------------------------------------------------
// Line-level operations
// ---------------------------------------------------------------------------

/**
 * Detects the line ending style used in the text.
 * Returns "\r\n" for Windows, "\n" for Unix/Mac.
 */
function detectLineEnding(text: string): string {
	// Check for Windows-style line endings first
	if (text.includes("\r\n")) {
		return "\r\n";
	}
	return "\n";
}

/**
 * Splits text into lines, handling both Windows (\r\n) and Unix (\n) line endings.
 */
function getLines(text: string): string[] {
	return text.split(/\r?\n/);
}

/**
 * Joins lines using the specified line ending (defaults to "\n").
 */
function joinLines(lines: string[], lineEnding: string = "\n"): string {
	return lines.join(lineEnding);
}

/**
 * Processes text line-by-line while preserving the original line ending style.
 * @param text - The input text
 * @param fn - A function that takes an array of lines and returns processed lines
 * @returns The processed text with original line endings preserved
 */
function processLines(text: string, fn: (lines: string[]) => string[]): string {
	const lineEnding = detectLineEnding(text);
	const lines = getLines(text);
	const result = fn(lines);
	return joinLines(result, lineEnding);
}

// ---------------------------------------------------------------------------
// Deduplication
// ---------------------------------------------------------------------------

export function removeDuplicateLines(text: string): string {
	return processLines(text, (lines) => {
		const seen = new Set<string>();
		return lines.filter((line) => {
			if (seen.has(line)) return false;
			seen.add(line);
			return true;
		});
	});
}

export function removeAdjacentDuplicateLines(text: string): string {
	return processLines(text, (lines) =>
		lines.filter((line, i, arr) => i === 0 || line !== arr[i - 1])
	);
}

export function keepOnlyDuplicateLines(text: string): string {
	const lineEnding = detectLineEnding(text);
	const lines = getLines(text);
	const counts = new Map<string, number>();
	for (const line of lines) {
		counts.set(line, (counts.get(line) ?? 0) + 1);
	}
	const seen = new Set<string>();
	return joinLines(
		lines.filter((line) => {
			if ((counts.get(line) ?? 0) > 1 && !seen.has(line)) {
				seen.add(line);
				return true;
			}
			return false;
		}),
		lineEnding
	);
}

// ---------------------------------------------------------------------------
// Blank / empty line removal
// ---------------------------------------------------------------------------

/** Removes lines that are entirely whitespace */
export function removeBlankLines(text: string): string {
	return processLines(text, (lines) => lines.filter((line) => line.trim() !== ""));
}

/** Removes lines that are completely empty (zero length) */
export function removeEmptyLines(text: string): string {
	return processLines(text, (lines) => lines.filter((line) => line.length > 0));
}

/** Collapses consecutive blank lines into a single blank line */
export function removeSurplusBlankLines(text: string): string {
	return processLines(text, (lines) => {
		const result: string[] = [];
		let prevBlank = false;
		for (const line of lines) {
			const isBlank = line.trim() === "";
			if (isBlank && prevBlank) continue;
			result.push(line);
			prevBlank = isBlank;
		}
		return result;
	});
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

type SortDir = "asc" | "desc";

function sorted(lines: string[], dir: SortDir, key: (l: string) => string | number = (l) => l): string[] {
	return [...lines].sort((a, b) => {
		const ka = key(a);
		const kb = key(b);
		const cmp = ka < kb ? -1 : ka > kb ? 1 : 0;
		return dir === "asc" ? cmp : -cmp;
	});
}

export function sortLinesCaseSensitive(text: string, dir: SortDir): string {
	return processLines(text, (lines) => sorted(lines, dir));
}

export function sortLinesCaseInsensitive(text: string, dir: SortDir): string {
	return processLines(text, (lines) => sorted(lines, dir, (l) => l.toLowerCase()));
}

export function sortLinesByLength(text: string, dir: SortDir): string {
	return processLines(text, (lines) => sorted(lines, dir, (l) => l.length));
}

export function sortLinesByWordCount(text: string, dir: SortDir): string {
	return processLines(text, (lines) =>
		sorted(lines, dir, (l) => l.trim().split(/\s+/).filter(Boolean).length)
	);
}

export function sortLinesByLastWord(text: string, dir: SortDir): string {
	return processLines(text, (lines) =>
		sorted(lines, dir, (l) => {
			const words = l.trim().split(/\s+/);
			return words[words.length - 1]?.toLowerCase() ?? "";
		})
	);
}

// ---------------------------------------------------------------------------
// Shuffle
// ---------------------------------------------------------------------------

export function shuffleLines(text: string): string {
	return processLines(text, (lines) => {
		for (let i = lines.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[lines[i], lines[j]] = [lines[j], lines[i]];
		}
		return lines;
	});
}

// ---------------------------------------------------------------------------
// Whitespace / newline cleanup
// ---------------------------------------------------------------------------

export function trimLines(text: string): string {
	return processLines(text, (lines) => lines.map((l) => l.trim()));
}

export function trimLinesStart(text: string): string {
	return processLines(text, (lines) => lines.map((l) => l.trimStart()));
}

export function trimLinesEnd(text: string): string {
	return processLines(text, (lines) => lines.map((l) => l.trimEnd()));
}

export function removeWhitespace(text: string): string {
	return text.replace(/\s/g, "");
}

export function replaceNewlinesWithSpace(text: string): string {
	// Handle both Windows (\r\n) and Unix (\n) line endings
	return text.replace(/\r?\n/g, " ");
}

export function collapseWhitespace(text: string): string {
	return processLines(text, (lines) =>
		lines.map((l) => l.replace(/\s+/g, " ").trim())
	);
}

// ---------------------------------------------------------------------------
// Prefix / suffix / wrap
// ---------------------------------------------------------------------------

export function prefixLines(text: string, prefix: string): string {
	return processLines(text, (lines) => lines.map((l) => prefix + l));
}

export function suffixLines(text: string, suffix: string): string {
	return processLines(text, (lines) => lines.map((l) => l + suffix));
}

export function wrapLines(text: string, prefix: string, suffix: string): string {
	return processLines(text, (lines) => lines.map((l) => prefix + l + suffix));
}

// ---------------------------------------------------------------------------
// Split / join
// ---------------------------------------------------------------------------

export function splitLines(text: string, delimiter: string): string {
	return processLines(text, (lines) => lines.flatMap((l) => l.split(delimiter)));
}

export function joinAllLines(text: string, glue: string): string {
	return getLines(text).join(glue);
}

export function joinEveryNLines(text: string, n: number, glue: string): string {
	const lineEnding = detectLineEnding(text);
	const lines = getLines(text);
	const chunks: string[] = [];
	for (let i = 0; i < lines.length; i += n) {
		chunks.push(lines.slice(i, i + n).join(glue));
	}
	return joinLines(chunks, lineEnding);
}

// ---------------------------------------------------------------------------
// Count occurrences
// ---------------------------------------------------------------------------

export function countLineOccurrences(text: string): string {
	const lineEnding = detectLineEnding(text);
	const lines = getLines(text);
	const counts = new Map<string, number>();
	const order: string[] = [];
	for (const line of lines) {
		if (!counts.has(line)) order.push(line);
		counts.set(line, (counts.get(line) ?? 0) + 1);
	}
	return joinLines(
		order
			.sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0))
			.map((line) => `${counts.get(line)}\t${line}`),
		lineEnding
	);
}

// ---------------------------------------------------------------------------
// Pad
// ---------------------------------------------------------------------------

export function padLinesStart(text: string, length: number, padChar: string): string {
	return processLines(text, (lines) =>
		lines.map((l) => l.padStart(length, padChar || " "))
	);
}

export function padLinesEnd(text: string, length: number, padChar: string): string {
	return processLines(text, (lines) =>
		lines.map((l) => l.padEnd(length, padChar || " "))
	);
}
