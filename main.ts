import { App, Editor, MarkdownView, Modal, Plugin } from "obsidian";

class QuickLinkerModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl, titleEl } = this;
		
		// Set modal title in the title bar
		titleEl.setText("Quick Link");
		
		// The modal close button (X) is automatically added by Obsidian in the title bar
		// No need to implement it manually
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

export default class QuickLinkerPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "use-selected-word-as-alias",
			name: "Quick Link: insert an internal link",
			editorCallback: this.insertInternalLinkWithAlias,
		});
	}

	onunload() {}

	private insertInternalLinkWithAlias = (editor: Editor, view: MarkdownView) => {
		const selectedWord = editor.getSelection();
		const hasSelectedWord = selectedWord !== "";

		const linkText = hasSelectedWord ? `|${selectedWord}` : "";
		const cursorOffset = hasSelectedWord ? 3 + selectedWord.length : 2;

		this.replaceSelectionAndMoveCursor(editor, `[[${linkText}]]`, cursorOffset);
	};

	private replaceSelectionAndMoveCursor = (editor: Editor, text: string, cursorOffset: number) => {
		editor.replaceSelection(text);

		const cursorPosition = editor.getCursor();
		cursorPosition.ch -= cursorOffset;

		editor.setCursor(cursorPosition);
	};
}
