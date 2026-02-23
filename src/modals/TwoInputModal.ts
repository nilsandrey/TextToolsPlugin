import { App, Modal, Setting } from "obsidian";

/**
 * A two-field input modal (used for regex extract and wrap commands).
 */
export class TwoInputModal extends Modal {
	private value1 = "";
	private value2 = "";
	private onSubmit: (v1: string, v2: string) => void;

	constructor(
		app: App,
		options: {
			title: string;
			label1: string;
			label2: string;
			placeholder1?: string;
			placeholder2?: string;
			default1?: string;
			default2?: string;
			onSubmit: (v1: string, v2: string) => void;
		}
	) {
		super(app);
		this.titleEl.setText(options.title);
		this.value1 = options.default1 ?? "";
		this.value2 = options.default2 ?? "";
		this.onSubmit = options.onSubmit;

		const { contentEl } = this;

		new Setting(contentEl)
			.setName(options.label1)
			.addText((t) => {
				t.setPlaceholder(options.placeholder1 ?? "")
					.setValue(this.value1)
					.onChange((v) => (this.value1 = v));
				setTimeout(() => t.inputEl.focus(), 50);
			});

		new Setting(contentEl)
			.setName(options.label2)
			.addText((t) =>
				t
					.setPlaceholder(options.placeholder2 ?? "")
					.setValue(this.value2)
					.onChange((v) => (this.value2 = v))
			);

		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("OK")
					.setCta()
					.onClick(() => {
						this.close();
						this.onSubmit(this.value1, this.value2);
					})
			)
			.addButton((btn) =>
				btn.setButtonText("Cancel").onClick(() => this.close())
			);
	}

	onClose() {
		this.contentEl.empty();
	}
}
