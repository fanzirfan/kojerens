# AGENTS.md — Glyphtrix

## Project Overview

Glyphtrix is a **client-side only** web application that converts images and videos into ASCII/glyph art directly in the browser. No server, no backend, no cloud processing. The live site is at `glyphtrix.art`.

## Tech Stack

- **Pure HTML/CSS/JS** — no frameworks, no build step, no bundler.
- Single `index.html`, single `script.js` (~4400 lines), single `styles.css`.
- Uses `<canvas>` 2D API for all rendering and pixel manipulation.
- Uses JSZip (loaded via CDN in `index.html`) for PNG sequence ZIP export.
- Hosted via GitHub Pages with custom domain (`CNAME → glyphtrix.art`).

## Architecture

### Files

| File | Purpose |
|------|---------|
| `index.html` | Full UI markup — settings panels, sliders, modals, toolbar |
| `script.js` | All application logic (see section map below) |
| `styles.css` | All styling, responsive layout, dark theme, animations |
| `assets/` | Example image/video for demo, social preview image |
| `CNAME` | GitHub Pages custom domain |

### script.js Section Map

The file is organized into numbered sections (see the Table of Contents comment at the top):

1. **Utility Functions** — spinner SVG, hash generator, helpers
2. **Character Set Configuration** — Unicode character sets (Latin, Cyrillic, Devanagari, Thai, Japanese, Korean, Chinese, Arabic, etc.)
3. **DOM Element References** (3.1–3.6) — all `getElementById` bindings grouped by category
4. **State Management Variables** — `current*` state vars, flags, processing state
5. **Configuration — Fonts & Constants** — font list, default values
6. **History & Undo/Redo System** — snapshot-based undo/redo with debouncing
7. **File Upload & Loading** — image/video/webcam input handling, example files
8. **Image Processing Functions** — brightness, contrast, levels, chroma removal, invert, grayscale quantization
9. **ASCII Rendering Engine** — `drawTextOnCanvas()`, bloom, exposure, character mapping
10. **Video Processing** — frame-by-frame video processing loop, PNG sequence export with JSZip
11. **Export Functions** — PNG download, text export, settings JSON export/import, new-tab preview
12. **UI Event Handlers** — slider/input listeners, `addSettingsChangeListener()`, `addMobileTouchHandling()`, number input sync
13. **Mobile Support** — responsive panel switching, mobile preview, touch handling
14. **Initialization & Event Listeners** — `DOMContentLoaded` setup, glyph randomizer, text direction toggle

### Key Rendering Pipeline

```
User uploads image/video
  → processImageWithCurrentSettings()
    → reads all current* state variables from slider/input values
    → applies image adjustments (brightness, contrast, levels, chroma, invert)
    → quantizes pixels into grid cells based on density
    → maps brightness → character from selected character set
    → calls drawTextOnCanvas(blobMatrix, scaleFactor, colorScheme, fontFamily)
      → renders characters onto <canvas> with font/color
      → applies bloom effect (multi-pass gaussian blur compositing)
      → applies exposure adjustment (photographic 2^x scaling on pixel data)
      → updates mobile preview canvas
```

### Key Patterns

- **State variables**: all rendering parameters are stored in `current*` variables (e.g. `currentBrightness`, `currentOutputBloom`, `currentOutputExposure`). These are read from DOM sliders at the start of `processImageWithCurrentSettings()`.
- **Slider ↔ Number Input sync**: every slider has a paired `<input type="number">` for direct typing. Bidirectional sync is handled by `syncSliderWithNumberInput()`, `syncNumberInputForSlider()`, and `syncAllNumberInputsFromSliders()`.
- **Settings snapshot**: `getCurrentSettingsSnapshot()` serializes all settings to a JSON-compatible object. Used for undo/redo history, export/import, and sequence render cache invalidation.
- **Sequence rendering cache**: `cachedZipBlob` + `sequenceSettingsSnapshot` avoid re-rendering identical sequences. `clearCachedSequence()` invalidates on any setting change.

## Coding Conventions

- **No build step** — all code must work as raw browser JS. No imports, no modules, no TypeScript.
- **All processing is client-side** — never upload user media to any external server or API.
- **Indonesian language** — respond to the user in Indonesian.
- **Git branch**: always commit to `main`.
- **Git remote**: `origin` → `https://github.com/fanzirfan/glyphtrix.git` (private).
- **Preserve existing comments** — the file has a clear section structure with `/* === */` block headers. Keep them intact.
- When adding a new output setting (slider/control):
  1. Add HTML markup in `index.html` inside the appropriate settings panel section.
  2. Add DOM reference (`const ... = document.getElementById(...)`) in section 3 of `script.js`.
  3. Add state variable (`let current... = defaultValue`).
  4. Wire into `getCurrentSettingsSnapshot()` and `restoreSettingsFromSnapshot()`.
  5. Wire into `setDefaultValues()` (reset slider + state var).
  6. Wire into `processImageWithCurrentSettings()` (read slider value into state var).
  7. Wire into `toggleSequenceRenderingUI()` `controlsToDisable` array.
  8. Add `addSettingsChangeListener()` and `addMobileTouchHandling()` calls.
  9. Add to `syncNumberInputForSlider()`, `syncAllNumberInputsFromSliders()`, and `initSliderNumberInputs()`.
  10. Apply the effect in `drawTextOnCanvas()` and in `renderFrame()` for sequence export.

## Testing

- No automated test suite. Verify changes by:
  1. `node -c script.js` — syntax check.
  2. Open `index.html` in browser, load example image, test the changed feature.
  3. Test with transparent background mode, video input, and PNG sequence export if the change affects rendering.
