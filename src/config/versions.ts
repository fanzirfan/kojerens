/**
 * KOJERENS Studio - Centralized Page Version Configuration
 * 
 * Single source of truth for all tools and page version numbers.
 * Update version strings here whenever a tool or page is enhanced.
 * The numbers are automatically reflected on the respective tool topbar
 * and the landing page showcase cards.
 * 
 * Versioning format: Independent Semantic Versioning (vMAJOR.MINOR.PATCH)
 * - MAJOR: Architectural leaps, new core engines, or breaking workflow changes.
 * - MINOR: New algorithms, visual filters, palettes, or export formats.
 * - PATCH: Performance optimizations, 60/120fps tuning, bug fixes, mobile UI hotfixes.
 */

export interface ToolVersionInfo {
  id: string;
  name: string;
  version: string;
  releaseDate: string;
  badgeLabel: string;
  changelog: string;
  status?: string;
}

export const APP_VERSIONS = {
  // Main Hub & Landing Page
  hub: {
    id: 'hub',
    name: 'KOJERENS Studio Hub',
    version: 'v2.3.5',
    releaseDate: '2026-09-29',
    badgeLabel: 'BROADSIDE LAB',
    changelog: 'Streamlined editorial footer: removed redundant Generative Engines and Architecture link columns, migrated to clean 2-column studio identity layout.',
    status: 'ONLINE'
  },

  // Tool 1: Blob Tracker
  blobTracker: {
    id: 'blob-tracker',
    name: 'Blob Tracker',
    version: 'v2.5.2',
    releaseDate: '2026-09-26',
    badgeLabel: 'TRACKER',
    changelog: 'Harmonized 100% warm monochrome broadside layout across stage and sidebars, fixed empty-state text contrast, unified 100vh viewport, bidirectional dark/light mode toggle with themechange events, and mobile-only desktop advisory toast.',
    status: 'STABLE'
  },

  // Tool 2: ASCII Matrix Generator
  asciiGen: {
    id: 'ascii-gen',
    name: 'ASCII Matrix',
    version: 'v1.4.2',
    releaseDate: '2026-09-26',
    badgeLabel: 'ASCII MATRIX',
    changelog: 'Harmonized broadside split workspace and inspector panel backgrounds, unified light/dark color variables, removed cramped mastheads, live theme synchronization, and mobile-only desktop advisory toast.',
    status: 'STABLE'
  },

  // Tool 3: 1-Bit Dither Matrix
  ditherGen: {
    id: 'dither-gen',
    name: '1-Bit Dither Matrix',
    version: 'v1.3.2',
    releaseDate: '2026-09-26',
    badgeLabel: '1-BIT DITHER',
    changelog: 'Harmonized stage, sidebar, and presets styling to match Broadside editorial paper ground with live theme synchronization and mobile-only desktop advisory toast.',
    status: 'STABLE'
  },

  // Tool 4: Analog CRT Synthesizer
  crtGen: {
    id: 'crt-gen',
    name: 'Analog CRT Synthesizer',
    version: 'v1.1.2',
    releaseDate: '2026-09-26',
    badgeLabel: 'CRT BEAM & GLITCH',
    changelog: 'Harmonized stage, presets, and empty-state styling with shadowless Broadside architecture, themechange listeners, and mobile-only desktop advisory toast.',
    status: 'STABLE'
  }
} as const;

export type AppVersionKey = keyof typeof APP_VERSIONS;
