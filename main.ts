import { Editor, MarkdownView, Plugin } from "obsidian";

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
