# Quick Linker Plugin Implementation Blueprint

## Overview
This blueprint provides a phased approach to transforming the "Better Internal Link Inserter" plugin into "Quick Linker" with enhanced search and filtering capabilities. Each phase builds upon the previous one, ensuring a stable progression from simple rebrand to complex functionality.

## Phase 1: Core Rebrand (Day 1)
**Goal**: Complete all naming and identity changes without breaking existing functionality

### Tasks:
1. **Update main.ts**
   - Rename class `BetterLinkInserterPlugin` → `QuickLinkerPlugin`
   - Update command ID: `use-selected-word-as-alias` → `quick-link-insert`
   - Update command name: "Quick Link: insert an internal link"

2. **Update manifest.json**
   - Change id to `obsidian-quick-linker`
   - Update name to "Quick Linker"
   - Update description to new marketing copy

3. **Update package.json**
   - Update name and description to match manifest

4. **Clean up documentation**
   - Remove duplicate content from README.md (lines 58-93)
   - Update CLAUDE.md class reference

### Verification:
- Plugin loads successfully
- Command appears with new name
- Existing link insertion functionality works

## Phase 2: Basic Modal Infrastructure (Day 2-3)
**Goal**: Replace direct insertion with a modal interface while maintaining current behavior

### Architecture:
```typescript
// New file structure
main.ts              // Plugin entry point
src/
  modal.ts          // QuickLinkModal class
  types.ts          // Interface definitions
  utils.ts          // Utility functions
```

### Key Components:

1. **QuickLinkModal Class**
   ```typescript
   class QuickLinkModal extends Modal {
     private searchInput: HTMLInputElement;
     private resultsContainer: HTMLElement;
     private selectedText: string;
     private editor: Editor;
     
     constructor(app: App, editor: Editor, selectedText: string);
     onOpen(): void;
     onClose(): void;
     private insertLink(notePath: string): void;
   }
   ```

2. **Update Plugin Command**
   - Command now opens modal instead of direct insertion
   - Pass selected text to modal
   - Handle link insertion callback

### Implementation Steps:
1. Create basic modal with search input
2. Add simple list of all notes (no search yet)
3. Implement click-to-insert functionality
4. Ensure selected text becomes alias

### Verification:
- Modal opens on command trigger
- Can see list of notes
- Clicking note inserts link with proper format

## Phase 3: Search Functionality (Day 4-5)
**Goal**: Implement fuzzy search with proper ranking

### Components:

1. **Search Engine**
   ```typescript
   interface SearchResult {
     file: TFile;
     score: number;
     matches: SearchMatch[];
   }
   
   class SearchEngine {
     constructor(app: App);
     search(query: string, options?: SearchOptions): SearchResult[];
     private fuzzyMatch(query: string, target: string): MatchResult;
   }
   ```

2. **Result Rendering**
   - Display note title with match highlighting
   - Show file path
   - Add modification date
   - Implement theme-aware highlighting

### Implementation Steps:
1. Integrate Obsidian's fuzzy search if available (fall back to custom)
2. Implement search-as-you-type with debouncing
3. Add result ranking (score + modification date)
4. Style results with proper highlighting

### Verification:
- Search returns relevant results
- Results update as user types
- Match highlighting works correctly

## Phase 4: Keyboard Navigation (Day 6)
**Goal**: Full keyboard control of the modal

### Key Bindings:
- `ArrowUp/ArrowDown`: Navigate results
- `Enter`: Select current result
- `Escape`: Close modal
- `Tab`: Focus search input

### Implementation:
1. **Navigation State Manager**
   ```typescript
   class NavigationManager {
     private currentIndex: number = 0;
     private maxIndex: number;
     
     navigateUp(): void;
     navigateDown(): void;
     selectCurrent(): void;
     updateHighlight(): void;
   }
   ```

2. **Visual Feedback**
   - Selected item gets both background and foreground highlighting
   - Smooth scrolling to keep selected item visible
   - Clear visual distinction from hover state

### Verification:
- Can navigate entire result list with keyboard
- Selection state persists during navigation
- Enter key inserts correct link

## Phase 5: Pagination System (Day 7)
**Goal**: Performance optimization for large vaults

### Components:
1. **Paginated Results**
   ```typescript
   class PaginatedResults {
     private allResults: SearchResult[];
     private displayedCount: number = 5;
     
     getDisplayedResults(): SearchResult[];
     loadMore(): void;
     hasMore(): boolean;
   }
   ```

2. **UI Elements**
   - "Load more" button at bottom
   - Result count indicator
   - Loading state for search operations

### Implementation:
1. Initial display limited to 5 results
2. "Load more" appends next 5
3. Virtual scrolling for 100+ results
4. Maintain keyboard navigation across pages

### Verification:
- Large vaults don't freeze UI
- Load more works smoothly
- Navigation works across page boundaries

## Phase 6: Filtering System (Day 8-9)
**Goal**: Add folder, tag, and date filtering

### Filter Types:

1. **Folder Filter**
   ```typescript
   interface FolderFilter {
     enabled: boolean;
     path: string;
     includeSubfolders: boolean;
   }
   ```

2. **Tag Filter**
   ```typescript
   interface TagFilter {
     enabled: boolean;
     tags: string[];
     mode: 'any' | 'all';
   }
   ```

3. **Date Filter**
   ```typescript
   interface DateFilter {
     enabled: boolean;
     sortByDate: boolean;
   }
   ```

### UI Components:
1. Filter toggle bar below search input
2. Folder selector dropdown
3. Tag multi-select
4. Recently modified toggle

### Implementation:
1. Create filter state manager
2. Add UI controls for each filter
3. Integrate filters with search engine
4. Update results reactively

### Verification:
- Each filter works independently
- Filters can be combined
- Performance remains good with filters

## Phase 7: Settings & Persistence (Day 10)
**Goal**: Make the plugin configurable

### Settings Structure:
```typescript
interface QuickLinkerSettings {
  defaultFolder: string;
  defaultFilters: {
    recentlyModified: boolean;
    tags: string[];
  };
  keyboardShortcuts: {
    toggleFilters: string;
    navigateUp: string;
    navigateDown: string;
  };
  resultsPerPage: number;
}
```

### Implementation:
1. Create settings tab
2. Add all configurable options
3. Persist filter states between sessions
4. Allow shortcut customization

### Verification:
- Settings persist across reloads
- Shortcuts can be customized
- Default values work correctly

## Phase 8: Performance & Polish (Day 11-12)
**Goal**: Optimize and refine the user experience

### Optimizations:
1. **Caching**
   - Cache search results
   - Cache file metadata
   - Invalidate on file changes

2. **Debouncing**
   - Search input (200ms)
   - Filter changes (100ms)

3. **Mobile Support**
   - Touch-friendly UI
   - Responsive design
   - Virtual keyboard handling

### Polish:
1. Loading states
2. Empty state messages
3. Error handling
4. Smooth animations

### Verification:
- Performance testing with 1000+ notes
- Mobile testing
- Theme compatibility testing

## Phase 9: Advanced Features (Optional)
**Goal**: Additional enhancements if time permits

### Potential Features:
1. **Smart Suggestions**
   - Recently linked notes
   - Contextual suggestions based on current note

2. **Preview on Hover**
   - Show note preview on long hover
   - Configurable delay

3. **Quick Actions**
   - Create new note from search
   - Open note in new pane (Ctrl+Click)

## Testing Strategy

### Unit Tests:
- Search algorithm
- Filter logic
- Keyboard navigation

### Integration Tests:
- Modal lifecycle
- Link insertion
- Settings persistence

### Manual Testing:
- Various vault sizes
- Different themes
- Mobile devices
- Edge cases (empty vault, special characters)

## Migration Notes

### For Existing Users:
1. Command will have new name (provide migration notice)
2. Existing functionality preserved
3. New features are opt-in through settings

### Breaking Changes:
- Command ID change (users may need to update hotkeys)
- Plugin ID change (may affect some workflows)

## Success Metrics

1. **Performance**: Modal opens in <100ms
2. **Search**: Results appear in <200ms for 1000 notes
3. **Usability**: Complete keyboard-only workflow
4. **Compatibility**: Works on all platforms and themes

## Risk Mitigation

1. **Backup Current State**: Tag release before changes
2. **Feature Flags**: Add settings to disable new features
3. **Gradual Rollout**: Release phases as beta versions
4. **Fallback**: Keep simple mode for compatibility

## Development Schedule

- **Week 1**: Phases 1-4 (Core functionality)
- **Week 2**: Phases 5-7 (Enhancement features)
- **Week 3**: Phase 8 + Testing (Polish and release)

This blueprint provides a clear path from the current simple plugin to a feature-rich Quick Linker while maintaining stability at each phase.