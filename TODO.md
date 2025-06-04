# Quick Linker Development Checklist

## Phase 1: Core Rebrand ✅ Planning Complete
- [ ] Update main.ts class name from `BetterLinkInserterPlugin` to `QuickLinkerPlugin`
- [ ] Update manifest.json
  - [ ] Change id to `obsidian-quick-linker`
  - [ ] Change name to "Quick Linker"
  - [ ] Update description to "Quickly insert and manage internal links with search, filtering, and keyboard-only navigation"
  - [ ] Review and update author information
- [ ] Update package.json
  - [ ] Change name to `obsidian-quick-linker`
  - [ ] Update description to match manifest.json
- [ ] Update command name to "Quick Link: insert an internal link"
- [ ] Clean up README.md (remove duplicate content lines 58-93)
- [ ] Update CLAUDE.md class name reference
- [ ] Test that plugin still loads and functions after rebrand
- [ ] Run `npm run build` to ensure no compilation errors

## Phase 2: Basic Modal Infrastructure
- [ ] Create `QuickLinkerModal` class extending Modal
- [ ] Add modal title "Quick Link"
- [ ] Implement close button (X) in top right
- [ ] Add Escape key handler to close modal
- [ ] Replace direct insertion with modal opening
- [ ] Store selected text when command triggered
- [ ] Maintain cursor position for insertion
- [ ] Test modal opens/closes properly
- [ ] Test that selected text is captured

## Phase 3: Search Input Field
- [ ] Add search input field to modal
- [ ] Auto-focus input on modal open
- [ ] Pre-fill input with selected text (if any)
- [ ] Add placeholder text "Search for a note..."
- [ ] Style input to match Obsidian design
- [ ] Handle empty selection gracefully
- [ ] Test input focus behavior
- [ ] Test pre-fill functionality

## Phase 4: Note Collection & Display
- [ ] Collect all markdown files from vault
- [ ] Extract basenames (titles) from files
- [ ] Create results container below search input
- [ ] Display all notes as list initially
- [ ] Add CSS class "quick-linker-result" to each result
- [ ] Implement click handler for results
- [ ] Insert `[[filename|selected text]]` on click
- [ ] Close modal after insertion
- [ ] Make results scrollable
- [ ] Test with vaults of different sizes

## Phase 5: Basic Search Implementation
- [ ] Add input event listener to search field
- [ ] Implement case-insensitive substring matching
- [ ] Filter results in real-time as user types
- [ ] Show all notes when search is empty
- [ ] Display "No results found" message
- [ ] Limit initial display to 5 results
- [ ] Test search performance
- [ ] Test edge cases (special characters, etc.)

## Phase 6: Keyboard Navigation
- [ ] Track selected result index
- [ ] Implement up/down arrow key navigation
- [ ] Add "is-selected" class for visual highlighting
- [ ] Ensure selected item scrolls into view
- [ ] Implement Enter key to insert selected result
- [ ] Reset selection on search change
- [ ] Prevent arrow keys from moving cursor in input
- [ ] Implement selection wrapping (last to first)
- [ ] Test all keyboard interactions

## Phase 7: Fuzzy Search Implementation
- [ ] Research/implement fuzzy matching algorithm
- [ ] Score matches based on:
  - [ ] Consecutive character matches
  - [ ] Matches at start of words
  - [ ] Shorter results with all matched chars
- [ ] Sort results by match score
- [ ] Break ties with modification date
- [ ] Highlight matched characters in results
- [ ] Test fuzzy matching accuracy
- [ ] Benchmark search performance

## Phase 8: Enhanced Result Display
- [ ] Show note title prominently
- [ ] Add file path in muted text
- [ ] Add relative modification date
- [ ] Format as two-line layout
- [ ] Add appropriate CSS classes
- [ ] Ensure clean, readable design
- [ ] Maintain fuzzy match highlighting
- [ ] Test display with long paths/titles

## Phase 9: Pagination System
- [ ] Show only first 5 results initially
- [ ] Add "Load more" button after results
- [ ] Implement button click to append next 5
- [ ] Update button text with remaining count
- [ ] Hide button when all results shown
- [ ] Ensure keyboard nav works across all pages
- [ ] Reset to first page on new search
- [ ] Style button to match Obsidian
- [ ] Test with large result sets

## Phase 10: Settings Infrastructure
- [ ] Create `QuickLinkerSettings` interface
- [ ] Define default settings object
- [ ] Create `QuickLinkerSettingTab` class
- [ ] Register settings tab with plugin
- [ ] Implement load/save settings
- [ ] Add placeholder content to settings tab
- [ ] Test settings persistence
- [ ] Test settings tab display

## Phase 11: Filter UI Components
- [ ] Add filter section to modal
- [ ] Create collapsible filter area
- [ ] Add "Filters" header with toggle
- [ ] Create three filter sections:
  - [ ] Path filter with text input
  - [ ] Recently modified checkbox
  - [ ] Tags section placeholder
- [ ] Implement Ctrl+F to toggle filters
- [ ] Style to match Obsidian design
- [ ] Test collapse/expand behavior

## Phase 12: Path Filter Implementation
- [ ] Wire path filter input to search
- [ ] Implement case-insensitive path matching
- [ ] Combine with search query filtering
- [ ] Handle empty path filter
- [ ] Update results in real-time
- [ ] Add visual indicator for active filter
- [ ] Test with various path structures
- [ ] Test combined filters

## Phase 13: Recently Modified Feature
- [ ] Get modification dates from file stats
- [ ] Implement sort by date when toggled
- [ ] Maintain fuzzy score sort when off
- [ ] Persist toggle state in session
- [ ] Load default from settings
- [ ] Update visual state of checkbox
- [ ] Test sorting accuracy
- [ ] Test performance impact

## Phase 14: Tag Extraction & Display
- [ ] Access metadata cache for each file
- [ ] Extract frontmatter tags
- [ ] Extract inline tags
- [ ] Display as pills/badges in results
- [ ] Limit to 3 tags per result
- [ ] Style to match Obsidian tags
- [ ] Handle notes without tags
- [ ] Test tag extraction accuracy

## Phase 15: Tag Filter UI
- [ ] Collect all unique tags from vault
- [ ] Display tags in filter section
- [ ] Style as clickable chips
- [ ] Implement multi-select toggle
- [ ] Show selected state visually
- [ ] Add "Clear all" button
- [ ] Sort tags alphabetically
- [ ] Handle scrolling for many tags
- [ ] Test selection behavior

## Phase 16: Tag Filter Logic
- [ ] Implement ANY matching for selected tags
- [ ] Combine with other active filters
- [ ] Update results on tag selection
- [ ] Maintain selection during session
- [ ] Show match count with filters
- [ ] Test multi-filter combinations
- [ ] Test performance with many tags

## Phase 17: Customizable Shortcuts
- [ ] Add hotkey settings to settings tab
- [ ] Configure main command trigger
- [ ] Configure filter toggle (Ctrl+F)
- [ ] Configure navigation keys
- [ ] Validate shortcut conflicts
- [ ] Apply custom shortcuts in modal
- [ ] Add tooltips showing shortcuts
- [ ] Test all custom shortcuts

## Phase 18: Complete Settings Implementation
- [ ] Add default search path setting
  - [ ] Text input with validation
  - [ ] Folder suggestions
- [ ] Add recently modified default toggle
- [ ] Add default tag filters selector
- [ ] Apply defaults on modal open
- [ ] Add "Reset to defaults" button
- [ ] Save settings on change
- [ ] Add helpful descriptions
- [ ] Test all settings

## Phase 19: Theme & Styling Polish
- [ ] Use CSS variables for all colors
- [ ] Test in default light theme
- [ ] Test in default dark theme
- [ ] Test in community themes
- [ ] Ensure proper contrast ratios
- [ ] Add hover states
- [ ] Add focus indicators
- [ ] Polish animations/transitions

## Phase 20: Error Handling & Edge Cases
- [ ] Handle missing/deleted files
- [ ] Handle corrupt metadata
- [ ] Add try-catch blocks
- [ ] Show user-friendly errors
- [ ] Handle very long file names
- [ ] Handle special characters
- [ ] Test with empty vault
- [ ] Test with 1000+ notes

## Phase 21: Performance Optimization
- [ ] Implement search debouncing (200ms)
- [ ] Cache file metadata
- [ ] Optimize fuzzy search algorithm
- [ ] Profile with large vaults
- [ ] Minimize re-renders
- [ ] Lazy load results if needed
- [ ] Test on slower devices
- [ ] Benchmark all operations

## Phase 22: Mobile Compatibility
- [ ] Test on mobile devices
- [ ] Ensure touch-friendly tap targets
- [ ] Test virtual keyboard behavior
- [ ] Adjust modal size for mobile
- [ ] Test gesture navigation
- [ ] Ensure scrolling works properly
- [ ] Test landscape/portrait modes
- [ ] Fix any mobile-specific issues

## Phase 23: Documentation & Release Prep
- [ ] Update README.md with new features
- [ ] Add screenshots/GIFs of new UI
- [ ] Document all keyboard shortcuts
- [ ] Create user guide for filters
- [ ] Update CHANGELOG
- [ ] Update version number
- [ ] Create GitHub release notes
- [ ] Test fresh installation

## Phase 24: Testing & Quality Assurance
- [ ] Manual testing checklist:
  - [ ] Test all keyboard shortcuts
  - [ ] Test all filter combinations
  - [ ] Test with 0, 1, 10, 100, 1000 notes
  - [ ] Test with various file structures
  - [ ] Test settings persistence
  - [ ] Test error scenarios
- [ ] Community beta testing
- [ ] Fix reported issues
- [ ] Performance regression testing

## Phase 25: Future Enhancements (Optional)
- [ ] Add regex search option
- [ ] Add note preview on hover
- [ ] Add recent files section
- [ ] Add favorites/pinned notes
- [ ] Add search history
- [ ] Add bulk link operations
- [ ] Add link format customization
- [ ] Consider unit tests

## Release Checklist
- [ ] All core features implemented
- [ ] All settings working properly
- [ ] No console errors
- [ ] Performance acceptable (< 100ms search)
- [ ] Mobile compatibility confirmed
- [ ] Documentation complete
- [ ] Community plugin PR prepared
- [ ] Version bumped
- [ ] Release notes written
- [ ] Beta testing completed