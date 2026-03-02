import { describe, it, expect, vi } from "vitest";
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

// ---------------------------------------------------------------------------
// Cross-platform line ending tests (CRLF vs LF)
// ---------------------------------------------------------------------------

describe("CRLF line ending support", () => {
	describe("removeDuplicateLines with CRLF", () => {
		it("should handle Windows-style CRLF line endings", () => {
			const input = "apple\r\nbanana\r\napple\r\ncherry";
			const expected = "apple\nbanana\ncherry";
			expect(removeDuplicateLines(input)).toBe(expected);
		});

		it("should treat same content with different line endings as duplicates", () => {
			const input = "hello\r\nhello";
			expect(removeDuplicateLines(input)).toBe("hello");
		});
	});

	describe("sortLinesCaseSensitive with CRLF", () => {
		it("should sort CRLF lines correctly ascending", () => {
			const input = "banana\r\napple\r\ncherry";
			expect(sortLinesCaseSensitive(input, "asc")).toBe("apple\nbanana\ncherry");
		});

		it("should sort CRLF lines correctly descending", () => {
			const input = "banana\r\napple\r\ncherry";
			expect(sortLinesCaseSensitive(input, "desc")).toBe("cherry\nbanana\napple");
		});
	});

	describe("sortLinesCaseInsensitive with CRLF", () => {
		it("should sort CRLF lines case-insensitively", () => {
			const input = "Banana\r\napple\r\nCherry";
			expect(sortLinesCaseInsensitive(input, "asc")).toBe("apple\nBanana\nCherry");
		});
	});

	describe("sortLinesByLength with CRLF", () => {
		it("should sort CRLF lines by length correctly", () => {
			const input = "aaa\r\na\r\naa";
			expect(sortLinesByLength(input, "asc")).toBe("a\naa\naaa");
		});
	});

	describe("sortLinesByWordCount with CRLF", () => {
		it("should sort CRLF lines by word count correctly", () => {
			const input = "one two three\r\none\r\none two";
			expect(sortLinesByWordCount(input, "asc")).toBe("one\none two\none two three");
		});
	});


	describe("removeBlankLines with CRLF", () => {
		it("should handle CRLF blank lines", () => {
			const input = "a\r\n\r\nb\r\n   \r\nc";
			expect(removeBlankLines(input)).toBe("a\nb\nc");
		});
	});

	describe("removeEmptyLines with CRLF", () => {
		it("should handle CRLF empty lines", () => {
			const input = "a\r\n\r\nb";
			expect(removeEmptyLines(input)).toBe("a\nb");
		});
	});

	describe("removeSurplusBlankLines with CRLF", () => {
		it("should collapse multiple CRLF blank lines", () => {
			const input = "a\r\n\r\n\r\nb";
			expect(removeSurplusBlankLines(input)).toBe("a\n\nb");
		});
	});

	describe("trimLines with CRLF", () => {
		it("should trim CRLF lines correctly", () => {
			const input = "  hello  \r\n  world  ";
			expect(trimLines(input)).toBe("hello\nworld");
		});
	});

	describe("prefixLines with CRLF", () => {
		it("should prefix CRLF lines correctly", () => {
			const input = "hello\r\nworld";
			expect(prefixLines(input, "> ")).toBe("> hello\n> world");
		});
	});

	describe("suffixLines with CRLF", () => {
		it("should suffix CRLF lines correctly", () => {
			const input = "hello\r\nworld";
			expect(suffixLines(input, "!")).toBe("hello!\nworld!");
		});
	});

	describe("joinAllLines with CRLF", () => {
		it("should join CRLF lines correctly", () => {
			const input = "a\r\nb\r\nc";
			expect(joinAllLines(input, ", ")).toBe("a, b, c");
		});
	});

	describe("countLineOccurrences with CRLF", () => {
		it("should count CRLF line occurrences correctly", () => {
			const input = "a\r\nb\r\na\r\na";
			expect(countLineOccurrences(input)).toBe("3\ta\n1\tb");
		});
	});

	describe("padLinesStart with CRLF", () => {
		it("should pad CRLF lines correctly", () => {
			const input = "a\r\nab";
			expect(padLinesStart(input, 3, "0")).toBe("00a\n0ab");
		});
	});

	describe("shuffleLines with CRLF", () => {
		it("should preserve all lines when shuffling CRLF input", () => {
			const input = "a\r\nb\r\nc";
			const result = shuffleLines(input);
			const resultLines = result.split("\n").sort();
			expect(resultLines).toEqual(["a", "b", "c"]);
		});
	});

	describe("mixed LF and CRLF", () => {
		it("should handle mixed line endings in sorting", () => {
			const input = "cherry\r\napple\nbanana";
			expect(sortLinesCaseSensitive(input, "asc")).toBe("apple\nbanana\ncherry");
		});

		it("should handle mixed line endings in deduplication", () => {
			const input = "hello\r\nhello\nhello";
			expect(removeDuplicateLines(input)).toBe("hello");
		});
	});
});

// ---------------------------------------------------------------------------
// Deduplication tests
// ---------------------------------------------------------------------------

describe("removeDuplicateLines", () => {
	it("should remove duplicate lines keeping first occurrence", () => {
		const input = "apple\nbanana\napple\ncherry\nbanana";
		const expected = "apple\nbanana\ncherry";
		expect(removeDuplicateLines(input)).toBe(expected);
	});

	it("should handle empty input", () => {
		expect(removeDuplicateLines("")).toBe("");
	});

	it("should handle single line", () => {
		expect(removeDuplicateLines("hello")).toBe("hello");
	});

	it("should handle all unique lines", () => {
		const input = "a\nb\nc";
		expect(removeDuplicateLines(input)).toBe(input);
	});

	it("should handle all duplicate lines", () => {
		const input = "same\nsame\nsame";
		expect(removeDuplicateLines(input)).toBe("same");
	});

	it("should treat lines with different whitespace as different", () => {
		const input = "hello\n hello\nhello ";
		expect(removeDuplicateLines(input)).toBe("hello\n hello\nhello ");
	});

	it("should handle empty lines as duplicates", () => {
		const input = "a\n\nb\n\nc";
		expect(removeDuplicateLines(input)).toBe("a\n\nb\nc");
	});
});

describe("removeAdjacentDuplicateLines", () => {
	it("should remove only adjacent duplicate lines", () => {
		const input = "a\na\nb\nc\nc\nc";
		expect(removeAdjacentDuplicateLines(input)).toBe("a\nb\nc");
	});

	it("should keep non-adjacent duplicates", () => {
		const input = "a\nb\na\nb";
		expect(removeAdjacentDuplicateLines(input)).toBe("a\nb\na\nb");
	});

	it("should handle empty input", () => {
		expect(removeAdjacentDuplicateLines("")).toBe("");
	});

	it("should handle single line", () => {
		expect(removeAdjacentDuplicateLines("hello")).toBe("hello");
	});

	it("should handle adjacent empty lines", () => {
		const input = "a\n\n\nb";
		expect(removeAdjacentDuplicateLines(input)).toBe("a\n\nb");
	});
});

describe("keepOnlyDuplicateLines", () => {
	it("should keep only lines that appear more than once", () => {
		const input = "a\nb\na\nc\nb\nd";
		expect(keepOnlyDuplicateLines(input)).toBe("a\nb");
	});

	it("should return empty for all unique lines", () => {
		const input = "a\nb\nc";
		expect(keepOnlyDuplicateLines(input)).toBe("");
	});

	it("should handle empty input", () => {
		expect(keepOnlyDuplicateLines("")).toBe("");
	});

	it("should keep only first occurrence of each duplicate", () => {
		const input = "x\nx\nx\ny\ny";
		expect(keepOnlyDuplicateLines(input)).toBe("x\ny");
	});

	it("should handle empty lines as duplicates", () => {
		const input = "a\n\nb\n";
		expect(keepOnlyDuplicateLines(input)).toBe("");
	});
});

// ---------------------------------------------------------------------------
// Blank / empty line removal tests
// ---------------------------------------------------------------------------

describe("removeBlankLines", () => {
	it("should remove lines with only whitespace", () => {
		const input = "a\n   \nb\n\t\nc";
		expect(removeBlankLines(input)).toBe("a\nb\nc");
	});

	it("should remove completely empty lines", () => {
		const input = "a\n\nb\n\nc";
		expect(removeBlankLines(input)).toBe("a\nb\nc");
	});

	it("should handle empty input", () => {
		expect(removeBlankLines("")).toBe("");
	});

	it("should handle input with only blank lines", () => {
		expect(removeBlankLines("   \n\t\n")).toBe("");
	});

	it("should preserve lines with content", () => {
		const input = "  hello  \n world ";
		expect(removeBlankLines(input)).toBe("  hello  \n world ");
	});
});

describe("removeEmptyLines", () => {
	it("should only remove completely empty lines", () => {
		const input = "a\n\nb\n   \nc";
		expect(removeEmptyLines(input)).toBe("a\nb\n   \nc");
	});

	it("should handle empty input", () => {
		expect(removeEmptyLines("")).toBe("");
	});

	it("should preserve whitespace-only lines", () => {
		const input = "a\n   \nb";
		expect(removeEmptyLines(input)).toBe(input);
	});
});

describe("removeSurplusBlankLines", () => {
	it("should collapse multiple blank lines into one", () => {
		const input = "a\n\n\n\nb";
		expect(removeSurplusBlankLines(input)).toBe("a\n\nb");
	});

	it("should handle whitespace-only lines", () => {
		const input = "a\n   \n\t\nb";
		expect(removeSurplusBlankLines(input)).toBe("a\n   \nb");
	});

	it("should handle empty input", () => {
		expect(removeSurplusBlankLines("")).toBe("");
	});

	it("should handle single blank line", () => {
		const input = "a\n\nb";
		expect(removeSurplusBlankLines(input)).toBe("a\n\nb");
	});

	it("should handle leading blank lines", () => {
		const input = "\n\n\na";
		expect(removeSurplusBlankLines(input)).toBe("\na");
	});

	it("should handle trailing blank lines", () => {
		const input = "a\n\n\n";
		expect(removeSurplusBlankLines(input)).toBe("a\n");
	});
});

// ---------------------------------------------------------------------------
// Sorting tests
// ---------------------------------------------------------------------------

describe("sortLinesCaseSensitive", () => {
	it("should sort lines alphabetically ascending", () => {
		const input = "banana\napple\ncherry";
		expect(sortLinesCaseSensitive(input, "asc")).toBe("apple\nbanana\ncherry");
	});

	it("should sort lines alphabetically descending", () => {
		const input = "banana\napple\ncherry";
		expect(sortLinesCaseSensitive(input, "desc")).toBe("cherry\nbanana\napple");
	});

	it("should be case sensitive (uppercase before lowercase)", () => {
		const input = "banana\nApple\ncherry";
		expect(sortLinesCaseSensitive(input, "asc")).toBe("Apple\nbanana\ncherry");
	});

	it("should handle empty input", () => {
		expect(sortLinesCaseSensitive("", "asc")).toBe("");
	});

	it("should handle single line", () => {
		expect(sortLinesCaseSensitive("hello", "asc")).toBe("hello");
	});

	it("should handle lines with numbers", () => {
		const input = "10\n2\n1";
		expect(sortLinesCaseSensitive(input, "asc")).toBe("1\n10\n2");
	});

	it("should handle trailing newline (full line selection)", () => {
		// When selecting full lines, editors often include a trailing newline
		const input = "banana\napple\ncherry\n";
		expect(sortLinesCaseSensitive(input, "asc")).toBe("apple\nbanana\ncherry\n");
	});

	it("should not add empty line at start when sorting with trailing newline", () => {
		const input = "cherry\napple\nbanana\n";
		const result = sortLinesCaseSensitive(input, "asc");
		expect(result.startsWith("apple")).toBe(true);
		expect(result).toBe("apple\nbanana\ncherry\n");
	});
});

describe("sortLinesCaseInsensitive", () => {
	it("should sort lines case-insensitively ascending", () => {
		const input = "Banana\napple\nCherry";
		expect(sortLinesCaseInsensitive(input, "asc")).toBe("apple\nBanana\nCherry");
	});

	it("should sort lines case-insensitively descending", () => {
		const input = "Banana\napple\nCherry";
		expect(sortLinesCaseInsensitive(input, "desc")).toBe("Cherry\nBanana\napple");
	});

	it("should handle empty input", () => {
		expect(sortLinesCaseInsensitive("", "asc")).toBe("");
	});

	it("should handle mixed case duplicates", () => {
		const input = "Apple\napple\nAPPLE";
		const result = sortLinesCaseInsensitive(input, "asc");
		expect(result.split("\n")).toHaveLength(3);
	});

	it("should handle trailing newline", () => {
		const input = "Cherry\napple\nBanana\n";
		expect(sortLinesCaseInsensitive(input, "asc")).toBe("apple\nBanana\nCherry\n");
	});
});

describe("sortLinesByLength", () => {
	it("should sort by length ascending", () => {
		const input = "aaa\na\naa";
		expect(sortLinesByLength(input, "asc")).toBe("a\naa\naaa");
	});

	it("should sort by length descending", () => {
		const input = "aaa\na\naa";
		expect(sortLinesByLength(input, "desc")).toBe("aaa\naa\na");
	});

	it("should handle empty input", () => {
		expect(sortLinesByLength("", "asc")).toBe("");
	});

	it("should handle equal length lines", () => {
		const input = "abc\nxyz\nmno";
		const result = sortLinesByLength(input, "asc");
		expect(result.split("\n")).toHaveLength(3);
	});

	it("should count spaces in length", () => {
		const input = "ab\na b c";
		expect(sortLinesByLength(input, "asc")).toBe("ab\na b c");
	});

	it("should handle trailing newline", () => {
		const input = "aaa\na\naa\n";
		expect(sortLinesByLength(input, "asc")).toBe("a\naa\naaa\n");
	});
});

describe("sortLinesByWordCount", () => {
	it("should sort by word count ascending", () => {
		const input = "one two three\none\none two";
		expect(sortLinesByWordCount(input, "asc")).toBe("one\none two\none two three");
	});

	it("should sort by word count descending", () => {
		const input = "one two three\none\none two";
		expect(sortLinesByWordCount(input, "desc")).toBe("one two three\none two\none");
	});

	it("should handle empty input", () => {
		expect(sortLinesByWordCount("", "asc")).toBe("");
	});

	it("should handle multiple spaces between words", () => {
		const input = "a  b  c\na b";
		expect(sortLinesByWordCount(input, "asc")).toBe("a b\na  b  c");
	});

	it("should handle empty lines (0 words)", () => {
		const input = "one\n\ntwo words";
		expect(sortLinesByWordCount(input, "asc")).toBe("\none\ntwo words");
	});

	it("should handle lines with only whitespace", () => {
		const input = "one\n   \ntwo words";
		expect(sortLinesByWordCount(input, "asc")).toBe("   \none\ntwo words");
	});

	it("should handle trailing newline", () => {
		const input = "one two three\none\none two\n";
		expect(sortLinesByWordCount(input, "asc")).toBe("one\none two\none two three\n");
	});
});


// ---------------------------------------------------------------------------
// Shuffle tests
// ---------------------------------------------------------------------------

describe("shuffleLines", () => {
	it("should return all original lines", () => {
		const input = "a\nb\nc\nd\ne";
		const result = shuffleLines(input);
		const originalLines = input.split("\n").sort();
		const resultLines = result.split("\n").sort();
		expect(resultLines).toEqual(originalLines);
	});

	it("should handle empty input", () => {
		expect(shuffleLines("")).toBe("");
	});

	it("should handle single line", () => {
		expect(shuffleLines("hello")).toBe("hello");
	});

	it("should preserve line content", () => {
		const input = "line with spaces\nline\twith\ttabs";
		const result = shuffleLines(input);
		expect(result.includes("line with spaces")).toBe(true);
		expect(result.includes("line\twith\ttabs")).toBe(true);
	});

	it("should eventually produce different orders", () => {
		const input = "a\nb\nc\nd\ne\nf\ng\nh";
		const results = new Set<string>();
		for (let i = 0; i < 100; i++) {
			results.add(shuffleLines(input));
		}
		expect(results.size).toBeGreaterThan(1);
	});

	it("should handle trailing newline", () => {
		const input = "a\nb\nc\n";
		const result = shuffleLines(input);
		// Should preserve trailing newline and contain all original lines
		expect(result.endsWith("\n")).toBe(true);
		const resultLines = result.slice(0, -1).split("\n").sort();
		expect(resultLines).toEqual(["a", "b", "c"]);
	});
});

// ---------------------------------------------------------------------------
// Whitespace / newline cleanup tests
// ---------------------------------------------------------------------------

describe("trimLines", () => {
	it("should trim both ends of each line", () => {
		const input = "  hello  \n  world  ";
		expect(trimLines(input)).toBe("hello\nworld");
	});

	it("should handle empty input", () => {
		expect(trimLines("")).toBe("");
	});

	it("should handle lines with only whitespace", () => {
		const input = "   \n\t\t";
		expect(trimLines(input)).toBe("\n");
	});
});

describe("trimLinesStart", () => {
	it("should trim only start of each line", () => {
		const input = "  hello  \n  world  ";
		expect(trimLinesStart(input)).toBe("hello  \nworld  ");
	});

	it("should handle empty input", () => {
		expect(trimLinesStart("")).toBe("");
	});
});

describe("trimLinesEnd", () => {
	it("should trim only end of each line", () => {
		const input = "  hello  \n  world  ";
		expect(trimLinesEnd(input)).toBe("  hello\n  world");
	});

	it("should handle empty input", () => {
		expect(trimLinesEnd("")).toBe("");
	});
});

describe("removeWhitespace", () => {
	it("should remove all whitespace characters", () => {
		const input = "hello world\n\tfoo bar";
		expect(removeWhitespace(input)).toBe("helloworldfoobar");
	});

	it("should handle empty input", () => {
		expect(removeWhitespace("")).toBe("");
	});
});

describe("replaceNewlinesWithSpace", () => {
	it("should replace newlines with spaces", () => {
		const input = "hello\nworld\nfoo";
		expect(replaceNewlinesWithSpace(input)).toBe("hello world foo");
	});

	it("should handle empty input", () => {
		expect(replaceNewlinesWithSpace("")).toBe("");
	});

	it("should handle consecutive newlines", () => {
		const input = "a\n\n\nb";
		expect(replaceNewlinesWithSpace(input)).toBe("a   b");
	});
});

describe("collapseWhitespace", () => {
	it("should collapse multiple spaces to one and trim", () => {
		const input = "  hello   world  \n  foo    bar  ";
		expect(collapseWhitespace(input)).toBe("hello world\nfoo bar");
	});

	it("should handle empty input", () => {
		expect(collapseWhitespace("")).toBe("");
	});

	it("should handle tabs and mixed whitespace", () => {
		const input = "a\t\t  b";
		expect(collapseWhitespace(input)).toBe("a b");
	});
});

// ---------------------------------------------------------------------------
// Prefix / suffix / wrap tests
// ---------------------------------------------------------------------------

describe("prefixLines", () => {
	it("should add prefix to each line", () => {
		const input = "hello\nworld";
		expect(prefixLines(input, "> ")).toBe("> hello\n> world");
	});

	it("should handle empty input", () => {
		expect(prefixLines("", "> ")).toBe("> ");
	});

	it("should handle empty prefix", () => {
		const input = "hello\nworld";
		expect(prefixLines(input, "")).toBe(input);
	});

	it("should prefix empty lines too", () => {
		const input = "a\n\nb";
		expect(prefixLines(input, "x")).toBe("xa\nx\nxb");
	});
});

describe("suffixLines", () => {
	it("should add suffix to each line", () => {
		const input = "hello\nworld";
		expect(suffixLines(input, "!")).toBe("hello!\nworld!");
	});

	it("should handle empty input", () => {
		expect(suffixLines("", "!")).toBe("!");
	});

	it("should handle empty suffix", () => {
		const input = "hello\nworld";
		expect(suffixLines(input, "")).toBe(input);
	});
});

describe("wrapLines", () => {
	it("should wrap each line with prefix and suffix", () => {
		const input = "hello\nworld";
		expect(wrapLines(input, "[", "]")).toBe("[hello]\n[world]");
	});

	it("should handle empty input", () => {
		expect(wrapLines("", "<", ">")).toBe("<>");
	});

	it("should handle empty prefix and suffix", () => {
		const input = "hello";
		expect(wrapLines(input, "", "")).toBe("hello");
	});
});

// ---------------------------------------------------------------------------
// Split / join tests
// ---------------------------------------------------------------------------

describe("splitLines", () => {
	it("should split each line by delimiter", () => {
		const input = "a,b,c\nd,e,f";
		expect(splitLines(input, ",")).toBe("a\nb\nc\nd\ne\nf");
	});

	it("should handle empty input", () => {
		expect(splitLines("", ",")).toBe("");
	});

	it("should handle delimiter not found", () => {
		const input = "hello\nworld";
		expect(splitLines(input, ",")).toBe("hello\nworld");
	});

	it("should handle multi-character delimiter", () => {
		const input = "a::b::c";
		expect(splitLines(input, "::")).toBe("a\nb\nc");
	});
});

describe("joinAllLines", () => {
	it("should join all lines with glue", () => {
		const input = "a\nb\nc";
		expect(joinAllLines(input, ", ")).toBe("a, b, c");
	});

	it("should handle empty input", () => {
		expect(joinAllLines("", ", ")).toBe("");
	});

	it("should handle single line", () => {
		expect(joinAllLines("hello", ", ")).toBe("hello");
	});

	it("should handle empty glue", () => {
		const input = "a\nb\nc";
		expect(joinAllLines(input, "")).toBe("abc");
	});
});

describe("joinEveryNLines", () => {
	it("should join every N lines", () => {
		const input = "a\nb\nc\nd\ne\nf";
		expect(joinEveryNLines(input, 2, "-")).toBe("a-b\nc-d\ne-f");
	});

	it("should handle partial last group", () => {
		const input = "a\nb\nc\nd\ne";
		expect(joinEveryNLines(input, 2, "-")).toBe("a-b\nc-d\ne");
	});

	it("should handle empty input", () => {
		expect(joinEveryNLines("", 2, "-")).toBe("");
	});

	it("should handle n larger than line count", () => {
		const input = "a\nb\nc";
		expect(joinEveryNLines(input, 10, "-")).toBe("a-b-c");
	});

	it("should handle n=1 (no joining)", () => {
		const input = "a\nb\nc";
		expect(joinEveryNLines(input, 1, "-")).toBe("a\nb\nc");
	});
});

// ---------------------------------------------------------------------------
// Count occurrences tests
// ---------------------------------------------------------------------------

describe("countLineOccurrences", () => {
	it("should count and sort by frequency descending", () => {
		const input = "a\nb\na\na\nb\nc";
		const result = countLineOccurrences(input);
		expect(result).toBe("3\ta\n2\tb\n1\tc");
	});

	it("should handle empty input", () => {
		expect(countLineOccurrences("")).toBe("1\t");
	});

	it("should handle all unique lines", () => {
		const input = "a\nb\nc";
		const result = countLineOccurrences(input);
		expect(result).toBe("1\ta\n1\tb\n1\tc");
	});

	it("should handle all same lines", () => {
		const input = "x\nx\nx";
		expect(countLineOccurrences(input)).toBe("3\tx");
	});

	it("should preserve original first occurrence order for same count", () => {
		const input = "a\nb\nc";
		const result = countLineOccurrences(input);
		const lines = result.split("\n");
		expect(lines).toHaveLength(3);
	});
});

// ---------------------------------------------------------------------------
// Pad tests
// ---------------------------------------------------------------------------

describe("padLinesStart", () => {
	it("should pad lines at start to specified length", () => {
		const input = "a\nab\nabc";
		expect(padLinesStart(input, 5, " ")).toBe("    a\n   ab\n  abc");
	});

	it("should handle empty input", () => {
		expect(padLinesStart("", 5, " ")).toBe("     ");
	});

	it("should handle custom pad character", () => {
		const input = "1\n12";
		expect(padLinesStart(input, 3, "0")).toBe("001\n012");
	});

	it("should not truncate lines longer than length", () => {
		const input = "hello";
		expect(padLinesStart(input, 3, " ")).toBe("hello");
	});

	it("should default to space when padChar is empty", () => {
		const input = "a";
		expect(padLinesStart(input, 3, "")).toBe("  a");
	});
});

describe("padLinesEnd", () => {
	it("should pad lines at end to specified length", () => {
		const input = "a\nab\nabc";
		expect(padLinesEnd(input, 5, " ")).toBe("a    \nab   \nabc  ");
	});

	it("should handle empty input", () => {
		expect(padLinesEnd("", 5, " ")).toBe("     ");
	});

	it("should handle custom pad character", () => {
		const input = "1\n12";
		expect(padLinesEnd(input, 3, "0")).toBe("100\n120");
	});

	it("should not truncate lines longer than length", () => {
		const input = "hello";
		expect(padLinesEnd(input, 3, " ")).toBe("hello");
	});

	it("should default to space when padChar is empty", () => {
		const input = "a";
		expect(padLinesEnd(input, 3, "")).toBe("a  ");
	});
});
