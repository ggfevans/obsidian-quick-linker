import { App, Editor, EditorPosition, MarkdownView, Modal, Plugin, TFile } from "obsidian";

class QuickLinkerModal extends Modal {
	private editor: Editor;
	private selectedText: string;
	private cursorPosition: EditorPosition;
	private searchInput: HTMLInputElement;
	private resultsContainer: HTMLElement;
	private allFiles: TFile[];

	constructor(app: App, editor: Editor, selectedText: string, cursorPosition: EditorPosition) {
		super(app);
		this.editor = editor;
		this.selectedText = selectedText;
		this.cursorPosition = cursorPosition;
		this.allFiles = this.collectMarkdownFiles();
	}

	private collectMarkdownFiles(): TFile[] {
		return this.app.vault.getMarkdownFiles();
	}

	onOpen() {
		const { contentEl, titleEl } = this;
		
		// Set modal title in the title bar
		titleEl.setText("Quick Link");
		
		// Create search input field
		this.searchInput = contentEl.createEl("input", {
			type: "text",
			placeholder: "Search for a note...",
			cls: "quick-linker-search-input"
		});
		
		// Pre-fill with selected text if any
		if (this.selectedText) {
			this.searchInput.value = this.selectedText;
		}
		
		// Create results container
		this.resultsContainer = contentEl.createEl("div", {
			cls: "quick-linker-results"
		});
		
		// Display all notes initially
		this.displayResults(this.allFiles);
		
		// Add input event listener for search
		this.searchInput.addEventListener("input", () => {
			this.handleSearch();
		});
		
		// Auto-focus the input
		this.searchInput.focus();
	}

	private displayResults(files: TFile[]) {
		// Clear existing results
		this.resultsContainer.empty();
		
		if (files.length === 0) {
			// Display "No results found" message
			const noResultsEl = this.resultsContainer.createEl("div", {
				cls: "quick-linker-no-results"
			});
			noResultsEl.textContent = "No results found";
			return;
		}
		
		// Display each file as a result
		files.forEach(file => {
			const resultEl = this.resultsContainer.createEl("div", {
				cls: "quick-linker-result"
			});
			
			// Extract basename (title) from file
			const title = file.basename;
			resultEl.textContent = title;
			
			// Add click handler
			resultEl.addEventListener("click", () => {
				this.insertLink(file);
			});
		});
	}

	private handleSearch() {
		const query = this.searchInput.value.trim();
		
		if (query === "") {
			// Show all notes when search is empty
			this.displayResults(this.allFiles);
		} else {
			// Filter files using case-insensitive substring matching
			const filteredFiles = this.allFiles.filter(file => 
				file.basename.toLowerCase().includes(query.toLowerCase())
			);
			this.displayResults(filteredFiles);
		}
	}

	private insertLink(file: TFile) {
		const linkText = this.selectedText ? `${file.basename}|${this.selectedText}` : file.basename;
		const link = `[[${linkText}]]`;
		
		// Insert the link at the stored cursor position
		this.editor.replaceRange(link, this.cursorPosition);
		
		// Close the modal
		this.close();
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
