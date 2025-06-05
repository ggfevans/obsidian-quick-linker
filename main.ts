import { App, Editor, EditorPosition, MarkdownView, Modal, Plugin, TFile } from "obsidian";

class QuickLinkerModal extends Modal {
	private editor: Editor;
	private selectedText: string;
	private cursorPosition: EditorPosition;
	private searchInput: HTMLInputElement;
	private resultsContainer: HTMLElement;
	private allFiles: TFile[];
	private currentResults: TFile[];
	private selectedIndex: number;

	constructor(app: App, editor: Editor, selectedText: string, cursorPosition: EditorPosition) {
		super(app);
		this.editor = editor;
		this.selectedText = selectedText;
		this.cursorPosition = cursorPosition;
		this.allFiles = this.collectMarkdownFiles();
		this.currentResults = this.allFiles;
		this.selectedIndex = 0;
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
		
		// Add keyboard navigation
		this.searchInput.addEventListener("keydown", (e) => {
			this.handleKeydown(e);
		});
		
		// Auto-focus the input
		this.searchInput.focus();
	}

	private displayResults(files: TFile[]) {
		// Store current results for keyboard navigation
		this.currentResults = files;
		this.selectedIndex = 0; // Reset selection
		
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
		
		// Limit initial display to 5 results
		const resultsToShow = files.slice(0, 5);
		
		// Display each file as a result
		resultsToShow.forEach((file, index) => {
			const resultEl = this.resultsContainer.createEl("div", {
				cls: `quick-linker-result ${index === 0 ? 'is-selected' : ''}`
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

	private handleKeydown(e: KeyboardEvent) {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			this.navigateDown();
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			this.navigateUp();
		} else if (e.key === "Enter") {
			e.preventDefault();
			this.selectCurrent();
		}
	}

	private navigateDown() {
		const maxIndex = Math.min(this.currentResults.length - 1, 4); // Limited to 5 results
		if (this.selectedIndex < maxIndex) {
			this.updateSelection(this.selectedIndex + 1);
		} else {
			this.updateSelection(0); // Wrap to first
		}
	}

	private navigateUp() {
		const maxIndex = Math.min(this.currentResults.length - 1, 4); // Limited to 5 results
		if (this.selectedIndex > 0) {
			this.updateSelection(this.selectedIndex - 1);
		} else {
			this.updateSelection(maxIndex); // Wrap to last
		}
	}

	private updateSelection(newIndex: number) {
		// Remove selection from current item
		const currentEl = this.resultsContainer.children[this.selectedIndex] as HTMLElement;
		if (currentEl) {
			currentEl.removeClass("is-selected");
		}
		
		// Add selection to new item
		this.selectedIndex = newIndex;
		const newEl = this.resultsContainer.children[this.selectedIndex] as HTMLElement;
		if (newEl) {
			newEl.addClass("is-selected");
			newEl.scrollIntoView({ block: "nearest" });
		}
	}

	private selectCurrent() {
		if (this.currentResults.length > 0 && this.selectedIndex < this.currentResults.length) {
			const selectedFile = this.currentResults[this.selectedIndex];
			this.insertLink(selectedFile);
		}
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
