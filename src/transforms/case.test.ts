import { describe, it, expect } from "vitest";
import { latinize, slugify, toTitleCase } from "./case";

describe("unicode case handling", () => {
	it("should title-case words with Polish diacritics without mangling letters", () => {
		const input = "Weryfikacja reżimu podatkowego";
		expect(toTitleCase(input)).toBe("Weryfikacja Reżimu Podatkowego");
	});

	it("should strip combining marks while preserving letters, numbers, whitespace, and underscores", () => {
		expect(latinize("Reżym 123_test")).toBe("Rezym 123_test");
	});

	it("should slugify Unicode words into a URL-friendly string", () => {
		expect(slugify("Weryfikacja reżimu podatkowego")).toBe(
			"weryfikacja-rezimu-podatkowego"
		);
	});
});
