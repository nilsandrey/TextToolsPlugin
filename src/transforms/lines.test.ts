import { describe, it, expect } from "vitest";
import {
	removeDuplicateLines,
	removeAdjacentDuplicateLines,
	keepOnlyDuplicateLines,
	removeBlankLines,
	removeEmptyLines,
	removeSurplusBlankLines,
	sortLinesCaseSensitive,
	sortLinesCaseInsensitive,
	sortLinesByLength,
	sortLinesByWordCount,
	sortLinesByLastWord,
	shuffleLines,
	trimLines,
	trimLinesStart,
	trimLinesEnd,
	removeWhitespace,
	replaceNewlinesWithSpace,
	collapseWhitespace,
	prefixLines,
	suffixLines,
	wrapLines,
	splitLines,
	joinAllLines,
	joinEveryNLines,
	countLineOccurrences,
	padLinesStart,
	padLinesEnd,
} from "./lines";

// Helper to create test cases for both line ending styles
const UNIX = "\n";
const WINDOWS = "\r\n";

describe("Cross-platform line ending support", () => {
	describe("detectLineEnding and line ending preservation", () => {
		it("should preserve Unix line endings in output", () => {
			const input = `apple${UNIX}banana${UNIX}cherry`;
			const result = sortLinesCaseSensitive(input, "asc");
			expect(result).toBe(`apple${UNIX}banana${UNIX}cherry`);
			expect(result).not.toContain("\r");
		});

		it("should preserve Windows line endings in output", () => {
			const input = `cherry${WINDOWS}banana${WINDOWS}apple`;
			const result = sortLinesCaseSensitive(input, "asc");
			expect(result).toBe(`apple${WINDOWS}banana${WINDOWS}cherry`);
			expect(result).toContain("\r\n");
		});

		it("should handle mixed content but treat as Windows if CRLF present", () => {
			// If \r\n is present anywhere, it's considered Windows-style
			const input = `a${WINDOWS}b${UNIX}c`;
			const result = removeDuplicateLines(input);
			// After split on /\r?\n/, we get ["a", "b", "c"]
			// Since input contains \r\n, it's detected as Windows
			expect(result).toBe(`a${WINDOWS}b${WINDOWS}c`);
		});
	});

	describe("Deduplication functions", () => {
		describe("removeDuplicateLines", () => {
			it("should work with Unix line endings", () => {
				const input = `a${UNIX}b${UNIX}a${UNIX}c${UNIX}b`;
				const result = removeDuplicateLines(input);
				expect(result).toBe(`a${UNIX}b${UNIX}c`);
			});

			it("should work with Windows line endings", () => {
				const input = `a${WINDOWS}b${WINDOWS}a${WINDOWS}c${WINDOWS}b`;
				const result = removeDuplicateLines(input);
				expect(result).toBe(`a${WINDOWS}b${WINDOWS}c`);
			});

			it("should NOT treat 'line' and 'line\\r' as duplicates (no trailing CR)", () => {
				// With proper line splitting, there should be no trailing \r
				const input = `apple${WINDOWS}apple${WINDOWS}banana`;
				const result = removeDuplicateLines(input);
				expect(result).toBe(`apple${WINDOWS}banana`);
			});
		});

		describe("removeAdjacentDuplicateLines", () => {
			it("should work with Unix line endings", () => {
				const input = `a${UNIX}a${UNIX}b${UNIX}b${UNIX}a`;
				const result = removeAdjacentDuplicateLines(input);
				expect(result).toBe(`a${UNIX}b${UNIX}a`);
			});

			it("should work with Windows line endings", () => {
				const input = `a${WINDOWS}a${WINDOWS}b${WINDOWS}b${WINDOWS}a`;
				const result = removeAdjacentDuplicateLines(input);
				expect(result).toBe(`a${WINDOWS}b${WINDOWS}a`);
			});
		});

		describe("keepOnlyDuplicateLines", () => {
			it("should work with Unix line endings", () => {
				const input = `a${UNIX}b${UNIX}a${UNIX}c`;
				const result = keepOnlyDuplicateLines(input);
				expect(result).toBe("a");
			});

			it("should work with Windows line endings", () => {
				const input = `a${WINDOWS}b${WINDOWS}a${WINDOWS}c`;
				const result = keepOnlyDuplicateLines(input);
				expect(result).toBe("a");
			});
		});
	});

	describe("Sorting functions", () => {
		describe("sortLinesCaseSensitive", () => {
			it("should sort correctly with Unix line endings (ascending)", () => {
				const input = `cherry${UNIX}Apple${UNIX}banana`;
				const result = sortLinesCaseSensitive(input, "asc");
				expect(result).toBe(`Apple${UNIX}banana${UNIX}cherry`);
			});

			it("should sort correctly with Windows line endings (ascending)", () => {
				const input = `cherry${WINDOWS}Apple${WINDOWS}banana`;
				const result = sortLinesCaseSensitive(input, "asc");
				expect(result).toBe(`Apple${WINDOWS}banana${WINDOWS}cherry`);
			});

			it("should sort correctly with Windows line endings (descending)", () => {
				const input = `Apple${WINDOWS}banana${WINDOWS}cherry`;
				const result = sortLinesCaseSensitive(input, "desc");
				expect(result).toBe(`cherry${WINDOWS}banana${WINDOWS}Apple`);
			});
		});

		describe("sortLinesCaseInsensitive", () => {
			it("should sort correctly with Unix line endings", () => {
				const input = `cherry${UNIX}Apple${UNIX}Banana`;
				const result = sortLinesCaseInsensitive(input, "asc");
				expect(result).toBe(`Apple${UNIX}Banana${UNIX}cherry`);
			});

			it("should sort correctly with Windows line endings", () => {
				const input = `cherry${WINDOWS}Apple${WINDOWS}Banana`;
				const result = sortLinesCaseInsensitive(input, "asc");
				expect(result).toBe(`Apple${WINDOWS}Banana${WINDOWS}cherry`);
			});
		});

		describe("sortLinesByLength", () => {
			it("should sort correctly with Unix line endings", () => {
				const input = `aaa${UNIX}a${UNIX}aa`;
				const result = sortLinesByLength(input, "asc");
				expect(result).toBe(`a${UNIX}aa${UNIX}aaa`);
			});

			it("should sort correctly with Windows line endings", () => {
				const input = `aaa${WINDOWS}a${WINDOWS}aa`;
				const result = sortLinesByLength(input, "asc");
				expect(result).toBe(`a${WINDOWS}aa${WINDOWS}aaa`);
			});
		});

		describe("sortLinesByWordCount", () => {
			it("should sort correctly with Unix line endings", () => {
				const input = `one two three${UNIX}one${UNIX}one two`;
				const result = sortLinesByWordCount(input, "asc");
				expect(result).toBe(`one${UNIX}one two${UNIX}one two three`);
			});

			it("should sort correctly with Windows line endings", () => {
				const input = `one two three${WINDOWS}one${WINDOWS}one two`;
				const result = sortLinesByWordCount(input, "asc");
				expect(result).toBe(`one${WINDOWS}one two${WINDOWS}one two three`);
			});
		});

		describe("sortLinesByLastWord", () => {
			it("should sort correctly with Unix line endings", () => {
				const input = `hello world${UNIX}hello apple${UNIX}hello banana`;
				const result = sortLinesByLastWord(input, "asc");
				expect(result).toBe(`hello apple${UNIX}hello banana${UNIX}hello world`);
			});

			it("should sort correctly with Windows line endings", () => {
				const input = `hello world${WINDOWS}hello apple${WINDOWS}hello banana`;
				const result = sortLinesByLastWord(input, "asc");
				expect(result).toBe(`hello apple${WINDOWS}hello banana${WINDOWS}hello world`);
			});
		});
	});

	describe("Blank/Empty line removal", () => {
		describe("removeBlankLines", () => {
			it("should work with Unix line endings", () => {
				const input = `a${UNIX}${UNIX}b${UNIX}   ${UNIX}c`;
				const result = removeBlankLines(input);
				expect(result).toBe(`a${UNIX}b${UNIX}c`);
			});

			it("should work with Windows line endings", () => {
				const input = `a${WINDOWS}${WINDOWS}b${WINDOWS}   ${WINDOWS}c`;
				const result = removeBlankLines(input);
				expect(result).toBe(`a${WINDOWS}b${WINDOWS}c`);
			});
		});

		describe("removeEmptyLines", () => {
			it("should work with Unix line endings", () => {
				const input = `a${UNIX}${UNIX}b${UNIX}c`;
				const result = removeEmptyLines(input);
				expect(result).toBe(`a${UNIX}b${UNIX}c`);
			});

			it("should work with Windows line endings", () => {
				const input = `a${WINDOWS}${WINDOWS}b${WINDOWS}c`;
				const result = removeEmptyLines(input);
				expect(result).toBe(`a${WINDOWS}b${WINDOWS}c`);
			});
		});

		describe("removeSurplusBlankLines", () => {
			it("should work with Unix line endings", () => {
				const input = `a${UNIX}${UNIX}${UNIX}b${UNIX}c`;
				const result = removeSurplusBlankLines(input);
				expect(result).toBe(`a${UNIX}${UNIX}b${UNIX}c`);
			});

			it("should work with Windows line endings", () => {
				const input = `a${WINDOWS}${WINDOWS}${WINDOWS}b${WINDOWS}c`;
				const result = removeSurplusBlankLines(input);
				expect(result).toBe(`a${WINDOWS}${WINDOWS}b${WINDOWS}c`);
			});
		});
	});

	describe("Shuffle", () => {
		it("should preserve Unix line endings", () => {
			const input = `a${UNIX}b${UNIX}c`;
			const result = shuffleLines(input);
			expect(result).not.toContain("\r");
			expect(result.split(UNIX).length).toBe(3);
		});

		it("should preserve Windows line endings", () => {
			const input = `a${WINDOWS}b${WINDOWS}c`;
			const result = shuffleLines(input);
			expect(result).toContain("\r\n");
			expect(result.split(WINDOWS).length).toBe(3);
		});
	});

	describe("Trim functions", () => {
		describe("trimLines", () => {
			it("should work with Unix line endings", () => {
				const input = `  a  ${UNIX}  b  ${UNIX}  c  `;
				const result = trimLines(input);
				expect(result).toBe(`a${UNIX}b${UNIX}c`);
			});

			it("should work with Windows line endings", () => {
				const input = `  a  ${WINDOWS}  b  ${WINDOWS}  c  `;
				const result = trimLines(input);
				expect(result).toBe(`a${WINDOWS}b${WINDOWS}c`);
			});
		});

		describe("trimLinesStart", () => {
			it("should work with Unix line endings", () => {
				const input = `  a  ${UNIX}  b  `;
				const result = trimLinesStart(input);
				expect(result).toBe(`a  ${UNIX}b  `);
			});

			it("should work with Windows line endings", () => {
				const input = `  a  ${WINDOWS}  b  `;
				const result = trimLinesStart(input);
				expect(result).toBe(`a  ${WINDOWS}b  `);
			});
		});

		describe("trimLinesEnd", () => {
			it("should work with Unix line endings", () => {
				const input = `  a  ${UNIX}  b  `;
				const result = trimLinesEnd(input);
				expect(result).toBe(`  a${UNIX}  b`);
			});

			it("should work with Windows line endings", () => {
				const input = `  a  ${WINDOWS}  b  `;
				const result = trimLinesEnd(input);
				expect(result).toBe(`  a${WINDOWS}  b`);
			});
		});
	});

	describe("Newline handling", () => {
		describe("replaceNewlinesWithSpace", () => {
			it("should replace Unix line endings with space", () => {
				const input = `a${UNIX}b${UNIX}c`;
				const result = replaceNewlinesWithSpace(input);
				expect(result).toBe("a b c");
			});

			it("should replace Windows line endings with space", () => {
				const input = `a${WINDOWS}b${WINDOWS}c`;
				const result = replaceNewlinesWithSpace(input);
				expect(result).toBe("a b c");
			});
		});

		describe("removeWhitespace", () => {
			it("should remove all whitespace including newlines", () => {
				const input = `a b${UNIX}c d`;
				const result = removeWhitespace(input);
				expect(result).toBe("abcd");
			});

			it("should remove Windows line endings completely", () => {
				const input = `a b${WINDOWS}c d`;
				const result = removeWhitespace(input);
				expect(result).toBe("abcd");
			});
		});

		describe("collapseWhitespace", () => {
			it("should work with Unix line endings", () => {
				const input = `a   b${UNIX}c   d`;
				const result = collapseWhitespace(input);
				expect(result).toBe(`a b${UNIX}c d`);
			});

			it("should work with Windows line endings", () => {
				const input = `a   b${WINDOWS}c   d`;
				const result = collapseWhitespace(input);
				expect(result).toBe(`a b${WINDOWS}c d`);
			});
		});
	});

	describe("Prefix/Suffix/Wrap", () => {
		describe("prefixLines", () => {
			it("should work with Unix line endings", () => {
				const input = `a${UNIX}b${UNIX}c`;
				const result = prefixLines(input, "> ");
				expect(result).toBe(`> a${UNIX}> b${UNIX}> c`);
			});

			it("should work with Windows line endings", () => {
				const input = `a${WINDOWS}b${WINDOWS}c`;
				const result = prefixLines(input, "> ");
				expect(result).toBe(`> a${WINDOWS}> b${WINDOWS}> c`);
			});
		});

		describe("suffixLines", () => {
			it("should work with Unix line endings", () => {
				const input = `a${UNIX}b${UNIX}c`;
				const result = suffixLines(input, ";");
				expect(result).toBe(`a;${UNIX}b;${UNIX}c;`);
			});

			it("should work with Windows line endings", () => {
				const input = `a${WINDOWS}b${WINDOWS}c`;
				const result = suffixLines(input, ";");
				expect(result).toBe(`a;${WINDOWS}b;${WINDOWS}c;`);
			});
		});

		describe("wrapLines", () => {
			it("should work with Unix line endings", () => {
				const input = `a${UNIX}b${UNIX}c`;
				const result = wrapLines(input, "[", "]");
				expect(result).toBe(`[a]${UNIX}[b]${UNIX}[c]`);
			});

			it("should work with Windows line endings", () => {
				const input = `a${WINDOWS}b${WINDOWS}c`;
				const result = wrapLines(input, "[", "]");
				expect(result).toBe(`[a]${WINDOWS}[b]${WINDOWS}[c]`);
			});
		});
	});

	describe("Split/Join", () => {
		describe("splitLines", () => {
			it("should work with Unix line endings", () => {
				const input = `a,b${UNIX}c,d`;
				const result = splitLines(input, ",");
				expect(result).toBe(`a${UNIX}b${UNIX}c${UNIX}d`);
			});

			it("should work with Windows line endings", () => {
				const input = `a,b${WINDOWS}c,d`;
				const result = splitLines(input, ",");
				expect(result).toBe(`a${WINDOWS}b${WINDOWS}c${WINDOWS}d`);
			});
		});

		describe("joinAllLines", () => {
			it("should work with Unix line endings", () => {
				const input = `a${UNIX}b${UNIX}c`;
				const result = joinAllLines(input, ", ");
				expect(result).toBe("a, b, c");
			});

			it("should work with Windows line endings", () => {
				const input = `a${WINDOWS}b${WINDOWS}c`;
				const result = joinAllLines(input, ", ");
				expect(result).toBe("a, b, c");
			});
		});

		describe("joinEveryNLines", () => {
			it("should work with Unix line endings", () => {
				const input = `a${UNIX}b${UNIX}c${UNIX}d`;
				const result = joinEveryNLines(input, 2, ", ");
				expect(result).toBe(`a, b${UNIX}c, d`);
			});

			it("should work with Windows line endings", () => {
				const input = `a${WINDOWS}b${WINDOWS}c${WINDOWS}d`;
				const result = joinEveryNLines(input, 2, ", ");
				expect(result).toBe(`a, b${WINDOWS}c, d`);
			});
		});
	});

	describe("Count occurrences", () => {
		it("should work with Unix line endings", () => {
			const input = `a${UNIX}b${UNIX}a${UNIX}a`;
			const result = countLineOccurrences(input);
			expect(result).toBe(`3\ta${UNIX}1\tb`);
		});

		it("should work with Windows line endings", () => {
			const input = `a${WINDOWS}b${WINDOWS}a${WINDOWS}a`;
			const result = countLineOccurrences(input);
			expect(result).toBe(`3\ta${WINDOWS}1\tb`);
		});
	});

	describe("Padding", () => {
		describe("padLinesStart", () => {
			it("should work with Unix line endings", () => {
				const input = `a${UNIX}bb${UNIX}ccc`;
				const result = padLinesStart(input, 5, "-");
				expect(result).toBe(`----a${UNIX}---bb${UNIX}--ccc`);
			});

			it("should work with Windows line endings", () => {
				const input = `a${WINDOWS}bb${WINDOWS}ccc`;
				const result = padLinesStart(input, 5, "-");
				expect(result).toBe(`----a${WINDOWS}---bb${WINDOWS}--ccc`);
			});
		});

		describe("padLinesEnd", () => {
			it("should work with Unix line endings", () => {
				const input = `a${UNIX}bb${UNIX}ccc`;
				const result = padLinesEnd(input, 5, "-");
				expect(result).toBe(`a----${UNIX}bb---${UNIX}ccc--`);
			});

			it("should work with Windows line endings", () => {
				const input = `a${WINDOWS}bb${WINDOWS}ccc`;
				const result = padLinesEnd(input, 5, "-");
				expect(result).toBe(`a----${WINDOWS}bb---${WINDOWS}ccc--`);
			});
		});
	});
});

describe("Edge cases", () => {
	it("should handle single line (no line endings)", () => {
		const input = "single line";
		expect(sortLinesCaseSensitive(input, "asc")).toBe("single line");
		expect(removeDuplicateLines(input)).toBe("single line");
	});

	it("should handle empty string", () => {
		const input = "";
		expect(sortLinesCaseSensitive(input, "asc")).toBe("");
		expect(removeDuplicateLines(input)).toBe("");
	});

	it("should handle text ending with newline", () => {
		const inputUnix = `a${UNIX}b${UNIX}`;
		const inputWindows = `a${WINDOWS}b${WINDOWS}`;

		// With trailing newline, we get an empty last line
		expect(sortLinesCaseSensitive(inputUnix, "asc")).toBe(`${UNIX}a${UNIX}b`);
		expect(sortLinesCaseSensitive(inputWindows, "asc")).toBe(`${WINDOWS}a${WINDOWS}b`);
	});
});
