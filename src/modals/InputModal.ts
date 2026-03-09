import { App, Modal, Notice, Setting } from "obsidian";

/**
 * A single-input modal that resolves to a string (or null if cancelled).
 */
export class InputModal extends Modal {
	private value = "";
	private onSubmit: (value: string) => unknown;
	private onCancel: () => void;
	private label: string;
	private placeholder: string;
	private defaultValue: string;

	constructor(
		app: App,
		options: {
			title: string;
			label: string;
			placeholder?: string;
			defaultValue?: string;
			onSubmit: (value: string) => unknown;
			onCancel?: () => void;
		}
	) {
		super(app);
		this.titleEl.setText(options.title);
		this.label = options.label;
		this.placeholder = options.placeholder ?? "";
		this.defaultValue = options.defaultValue ?? "";
		this.onSubmit = options.onSubmit;
		this.onCancel = options.onCancel ?? (() => {});
	}

	private submitAndCatch(value: string): void {
		const result = this.onSubmit(value);
		if (result instanceof Promise) {
			result.catch((error: unknown) => {
				console.error("Text Tools: error in submit handler", error);
				new Notice("An error occurred. See the developer console for details.");
			});
		}
	}

	onOpen() {
		const { contentEl } = this;
		this.value = this.defaultValue;

		new Setting(contentEl)
			.setName(this.label)
			.addText((text) => {
				text.setPlaceholder(this.placeholder)
					.setValue(this.defaultValue)
					.onChange((v) => {
						this.value = v;
					});
				// Submit on Enter
				text.inputEl.addEventListener("keydown", (e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						this.close();
						this.submitAndCatch(this.value);
					}
					if (e.key === "Escape") {
						e.preventDefault();
						this.close();
						this.onCancel();
					}
				});
				// Auto-focus
				setTimeout(() => text.inputEl.focus(), 50);
			});

		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("OK")
					.setCta()
					.onClick(() => {
						this.close();
						this.submitAndCatch(this.value);
					})
			)
			.addButton((btn) =>
				btn.setButtonText("Cancel").onClick(() => {
					this.close();
					this.onCancel();
				})
			);
	}

	onClose() {
		this.contentEl.empty();
	}
}
