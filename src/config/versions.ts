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
    version: 'v1.4.0',
    releaseDate: '2026-09-25',
    badgeLabel: 'STUDIO LAB',
    changelog: 'Multi-tool pipeline routing, live HUD telemetry canvas, and unified engine showcase.',
    status: 'ONLINE'
  },

  // Tool 1: Blob Tracker
  blobTracker: {
    id: 'blob-tracker',
    name: 'Blob Tracker',
    version: 'v2.4.0',
    releaseDate: '2026-09-24',
    badgeLabel: 'TRACKER',
    changelog: '4 generative visual engines (Sensor, Telemetry, Topography, Viewfinder) & 40 GRD gradient maps.',
    status: 'STABLE'
  },

  // Tool 2: ASCII Matrix Generator
  asciiGen: {
    id: 'ascii-gen',
    name: 'ASCII Matrix',
    version: 'v1.3.0',
    releaseDate: '2026-09-24',
    badgeLabel: 'ASCII MATRIX',
    changelog: 'Multi-pass electron bloom, Unicode ramp synthesizer, and pure text/PNG export.',
    status: 'STABLE'
  },

  // Tool 3: 1-Bit Dither Matrix
  ditherGen: {
    id: 'dither-gen',
    name: '1-Bit Dither Matrix',
    version: 'v1.2.0',
    releaseDate: '2026-09-24',
    badgeLabel: '1-BIT DITHER',
    changelog: '15 error-diffusion & ordered dithering algorithms, 12 retro palettes, and vector SVG export.',
    status: 'STABLE'
  },

  // Tool 4: Analog CRT Synthesizer
  crtGen: {
    id: 'crt-gen',
    name: 'Analog CRT Synthesizer',
    version: 'v1.0.0',
    releaseDate: '2026-09-24',
    badgeLabel: 'CRT BEAM & GLITCH',
    changelog: 'Trinitron aperture grilles, triad phosphor masks, NTSC chroma bleed, and VHS tracking jitter.',
    status: 'NEW'
  }
} as const;

export type AppVersionKey = keyof typeof APP_VERSIONS;
