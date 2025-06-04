# Quick Linker Plugin Specification

## Overview
Quick Linker is a rebranded and enhanced version of "Better Internal Link Inserter" that provides a fast, keyboard-driven interface for inserting internal links in Obsidian.

## Core Rebrand Changes

### Identity
- **Plugin ID**: `obsidian-quick-linker`
- **Display Name**: Quick Linker
- **Command Name**: "Quick Link: insert an internal link"
- **Description**: "Quickly insert and manage internal links with search, filtering, and keyboard-only navigation"
- **Main Class**: `QuickLinkerPlugin`

### File Updates Required
1. **main.ts**
   - Change class name: `BetterLinkInserterPlugin` → `QuickLinkerPlugin`
   - Update command name to: "Quick Link: insert an internal link"

2. **manifest.json**
   - id: `obsidian-quick-linker`
   - name: "Quick Linker"
   - description: "Quickly insert and manage internal links with search, filtering, and keyboard-only navigation"

3. **package.json**
   - name: `obsidian-quick-linker`
   - description: Match manifest.json

4. **README.md**
   - Remove duplicate content (lines 58-93)

5. **CLAUDE.md**
   - Update class name reference

## New Feature Specifications

### Search Modal Interface
When the command is triggered:
1. Opens a modal popup (similar to Quick Switcher)
2. Contains a search input box at the top
3. If text was selected, it appears as the initial search query
4. Displays search results below the input

### Search Functionality
- **Scope**: Search through note titles/filenames only
- **Algorithm**: Fuzzy matching
- **Ranking**: Sort by match score, then by modification date for ties
- **Performance**: Initial display of 5 results with "Load more" button

### Search Results Display
Each result shows:
- Note title
- Full file path
- Tags
- Modification date
- Selected item has both foreground and background highlighting (theme-aware colors)

### Filtering System

#### 1. Folder/Path Filtering
- Default folder setting in plugin settings
- Type path prefix in search (e.g., "folder/search term")
- Dropdown/toggle in modal to select folders

#### 2. Recently Modified Filter
- Toggle that sorts all results by modification date (newest first)
- Activated via UI toggle or keyboard shortcut

#### 3. Tag Filtering
- Select multiple tags
- Shows notes that have ANY of the selected tags
- UI element for tag selection

### Keyboard Navigation
- **Move up/down**: Arrow keys
- **Select result**: Enter
- **Close modal**: Escape
- **Toggle filters**: Ctrl+F
- All shortcuts are customizable in settings

### Link Insertion Behavior
- Maintains current behavior: `[[note|selected text]]`
- If text was selected and used as search query, it becomes the alias
- If no text selected, inserts just `[[note]]`

### Pagination
- Shows 5 results initially
- "Load more" button at bottom appends next 5 results
- Virtual scrolling for performance with large result sets

## Plugin Settings

### Configurable Options
1. **Default starting path**
   - Default: empty (search all notes)
   - Can be overridden during search

2. **Default filter states**
   - Recently modified filter: Default OFF
   - Tag filter: Default OFF (no pre-selected tags)

3. **Keyboard shortcuts**
   - All modal shortcuts customizable
   - Main command trigger customizable
   - Defaults: Arrow keys, Enter, Escape, Ctrl+F

## Technical Implementation Notes
- Maintain backward compatibility with existing link insertion
- Use Obsidian's fuzzy search library if available
- Implement efficient caching for search results
- Follow Obsidian's UI/UX patterns for consistency
- Ensure mobile compatibility

## Testing Requirements
1. Verify all rebrand changes applied correctly
2. Test search with various note counts (10, 100, 1000+ notes)
3. Verify all keyboard shortcuts work
4. Test all filter combinations
5. Ensure selected text behavior works correctly
6. Test on both desktop and mobile
7. Verify theme compatibility for highlighting