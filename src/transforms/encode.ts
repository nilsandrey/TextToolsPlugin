// ---------------------------------------------------------------------------
// URL encoding
// ---------------------------------------------------------------------------

export function urlEncode(text: string): string {
	return encodeURIComponent(text);
}

export function urlDecode(text: string): string {
	try {
		return decodeURIComponent(text);
	} catch {
		return text; // malformed — return as-is
	}
}

// ---------------------------------------------------------------------------
// HTML entities
// ---------------------------------------------------------------------------

const HTML_ENCODE_MAP: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

const HTML_DECODE_MAP: Record<string, string> = Object.fromEntries(
	Object.entries(HTML_ENCODE_MAP).map(([k, v]) => [v, k])
);

export function htmlEncode(text: string): string {
	return text.replace(/[&<>"']/g, (ch) => HTML_ENCODE_MAP[ch] ?? ch);
}

export function htmlDecode(text: string): string {
	return text.replace(
		/&(?:amp|lt|gt|quot|#39);/g,
		(entity) => HTML_DECODE_MAP[entity] ?? entity
	);
}

// ---------------------------------------------------------------------------
// Base64
// ---------------------------------------------------------------------------

export function base64Encode(text: string): string {
	return btoa(unescape(encodeURIComponent(text)));
}

export function base64Decode(text: string): string {
	try {
		return decodeURIComponent(escape(atob(text.trim())));
	} catch {
		return text;
	}
}

// ---------------------------------------------------------------------------
// JSON string escape / unescape
// ---------------------------------------------------------------------------

export function jsonEscape(text: string): string {
	return JSON.stringify(text);
}

export function jsonUnescape(text: string): string {
	try {
		const parsed = JSON.parse(text);
		if (typeof parsed === "string") return parsed;
		return text;
	} catch {
		return text;
	}
}

// ---------------------------------------------------------------------------
// Decimal ↔ Hexadecimal (per token)
// ---------------------------------------------------------------------------

export function decimalToHex(text: string): string {
	return text.replace(/\b\d+\b/g, (n) => parseInt(n, 10).toString(16).toUpperCase());
}

export function hexToDecimal(text: string): string {
	return text.replace(/\b(?:0x)?([0-9a-fA-F]+)\b/g, (_, hex) =>
		parseInt(hex, 16).toString(10)
	);
}
