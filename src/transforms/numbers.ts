/**
 * Finds all integers in `text` and shifts each one by `delta`.
 * Works on decimal numbers only.
 */
export function shiftNumbers(text: string, delta: number): string {
	return text.replace(/-?\d+/g, (n) => String(parseInt(n, 10) + delta));
}
