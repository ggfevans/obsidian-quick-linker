import { App, Editor, EditorPosition, MarkdownView, Modal, Plugin } from "obsidian";

class QuickLinkerModal extends Modal {
	private editor: Editor;
	private selectedText: string;
	private cursorPosition: EditorPosition;

	constructor(app: App, editor: Editor, selectedText: string, cursorPosition: EditorPosition) {
		super(app);
		this.editor = editor;
		this.selectedText = selectedText;
		this.cursorPosition = cursorPosition;
	}

	onOpen() {
		const { contentEl, titleEl } = this;
		
		// Set modal title in the title bar
		titleEl.setText("Quick Link");
		
		// The modal close button (X) is automatically added by Obsidian in the title bar
		// Escape key handler is also automatically provided by the Modal class
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
		const selectedText = editor.getSelection();
		// Store cursor position - if there's a selection, getCursor returns the start position
		const cursorPosition = editor.getCursor();
		
		// Open the modal instead of directly inserting
		const modal = new QuickLinkerModal(this.app, editor, selectedText, cursorPosition);
		modal.open();
	};

	private replaceSelectionAndMoveCursor = (editor: Editor, text: string, cursorOffset: number) => {
		editor.replaceSelection(text);

		const cursorPosition = editor.getCursor();
		cursorPosition.ch -= cursorOffset;

		editor.setCursor(cursorPosition);
	};
}
