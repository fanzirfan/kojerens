# Blob Tracker — Developer & Agent Guidelines

## Overview
Blob Tracker is a high-performance generative visual canvas application built with vanilla web technologies (HTML5 Canvas, CSS3, ES5/ES6 JavaScript). It analyzes images for luminance contrast and physical feature centroids, generating technical vector overlays across 4 distinct generative visual engines:
- **Sensor** (`circles`): Responsive blob and feature tracker with dynamic radius weighting, constellation connections, and coordinate readouts.
- **Telemetry** (`hero`): High-impact sci-fi HUD display with radial dial ticks, technical perspective grid, corner brackets, and crosshairs.
- **Topography** (`geo`): Precision geodetic contour mapping with 14 elevation levels and radial bearing spokes.
- **Viewfinder** (`studio`): Minimalist editorial framing with rule-of-thirds compositional guides and studio telemetry typography.

---

## Core Rules & Constraints

1. **Attribution & Author Identity**:
   - Always attribute to **Fanz Irfan** (never use Yordan Stoyanov or any other name).
   - Default 4-corner frame texts:
     - Top Left: `Design & Strategy`
     - Top Right: `Fanz Irfan`
     - Bottom Left: `blog.fan.my.id`
     - Bottom Right: `Indonesia`

2. **File Export Conventions**:
   - Exported PNG files must strictly use the filename prefix `tracker-...` (format: `tracker-[format]-[timestamp].png`). Never use `brand-asset-...`.

3. **Performance & Architecture**:
   - 100% client-side in-browser processing with zero external server dependencies.
   - Use reusable offscreen canvas buffers with `{ willReadFrequently: true }` for pixel reading.
   - Use hardware-accelerated scratch canvas scaling for pixelation zones.
   - Batch DOM and canvas calculations with `requestAnimationFrame` (`scheduleUpdate`).
   - Image analysis results must be cached by image reference and parameters to guarantee 60fps/120fps slider responsiveness.

4. **Security & Sandbox Isolation**:
   - Do not auto-load local image assets with relative paths on startup that could taint the canvas under the `file:///` origin security model.
   - Keep the clean empty state on startup until an image is explicitly imported or dragged by the user.

---

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `antislop.md` (core) and then the skill for the task:
- UI / visual: `skills/antislop-ui/SKILL.md`
- Copy & text: `skills/antislop-copywriting/SKILL.md`
- People: `skills/antislop-human/SKILL.md`
- Mobile / responsive: `skills/antislop-layoutmobile/SKILL.md`
- Code comments: `skills/antislop-code/SKILL.md`
Before starting, ask the user when antislop applies: during the work, or after it is done.
<!-- antislop:end -->
