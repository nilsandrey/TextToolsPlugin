import { Editor, EditorPosition, Notice } from "obsidian";

export interface Range {
	from: EditorPosition;
	to: EditorPosition;
}

export function normalizeRange(
	anchor: EditorPosition,
	head: EditorPosition
): Range {
	const anchorFirst =
		anchor.line < head.line ||
		(anchor.line === head.line && anchor.ch <= head.ch);
	return {
		from: anchorFirst ? anchor : head,
		to: anchorFirst ? head : anchor,
	};
}

/**
 * Applies `transform` to every non-empty selection, in reverse document order
 * to preserve character positions during replacement.
 * Returns false (and shows a Notice) if there is no selection.
 */
export function transformSelections(
	editor: Editor,
	transform: (text: string) => string
): boolean {
	const selections = editor.listSelections();
	const hasSelection = selections.some(
		(s) => s.anchor.line !== s.head.line || s.anchor.ch !== s.head.ch
	);
	if (!hasSelection) {
		new Notice("Select some text first.");
		return false;
	}
	for (let i = selections.length - 1; i >= 0; i--) {
		const { from, to } = normalizeRange(
			selections[i].anchor,
			selections[i].head
		);
		if (from.line === to.line && from.ch === to.ch) continue;
		editor.replaceRange(transform(editor.getRange(from, to)), from, to);
	}
	return true;
}

/**
 * Like transformSelections but also works on a cursor position (no selection):
 * transforms the full current line when nothing is selected.
 */
export function transformSelectionsOrLines(
	editor: Editor,
	transform: (text: string) => string
): void {
	const selections = editor.listSelections();
	for (let i = selections.length - 1; i >= 0; i--) {
		const { from, to } = normalizeRange(
			selections[i].anchor,
			selections[i].head
		);
		if (from.line === to.line && from.ch === to.ch) {
			// No selection — operate on the whole line
			const lineText = editor.getLine(from.line);
			editor.replaceRange(
				transform(lineText),
				{ line: from.line, ch: 0 },
				{ line: from.line, ch: lineText.length }
			);
		} else {
			editor.replaceRange(
				transform(editor.getRange(from, to)),
				from,
				to
			);
		}
	}
}
