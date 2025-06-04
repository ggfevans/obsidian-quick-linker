# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Obsidian plugin called "Quick Linker" (formerly "Better Internal Link Inserter") that enhances the link insertion experience in Obsidian. The plugin allows users to quickly insert internal links using selected text as an alias.

## Development Commands

- `npm run dev` - Start development mode with auto-rebuild on file changes
- `npm run build` - Build for production (runs TypeScript type checking first)
- `npm run version` - Bump version in manifest.json and versions.json

## Architecture

The plugin is a simple single-file Obsidian plugin:

- **main.ts** - Contains the entire plugin logic in a single class `BetterLinkInserterPlugin`
- The plugin registers one command: "Insert an internal link (using selected word as alias if possible)"
- When triggered, it wraps selected text in `[[|selected text]]` format, or just `[[]]` if no text is selected
- Uses esbuild for bundling with watch mode in development

## Technical Details

- Built with TypeScript targeting ES6
- Uses Obsidian's Plugin API
- Minimal dependencies - only development dependencies for building
- Compatible with Obsidian v0.12.0 and higher
- Works on both desktop and mobile