# Blob Tracker — Design System & Direction

Dial: ENERGY 2 / RHYTHM 3 / MOTION 1

## 1. Identity & Mood
- **Product**: Blob Tracker (Generative Visual Canvas & Technical Feature Tracker)
- **Author**: Fanz Irfan (`blog.fan.my.id`)
- **Visual Language**: Technical Precision Workbench / Cartographic Instrumentation & HUD Telemetry
- **Purpose**: Transform user imagery into technical vector compositions through client-side computer vision algorithms and generative geometric overlays.

---

## 2. Visual Dials

| Dial | Value | Rationale |
|---|---|---|
| **ENERGY** | **2 (Balanced)** | Functional, neutral workbench UI that recedes into the background so the generative canvas art commands full attention. |
| **RHYTHM** | **3 (Bold / Varied)** | 4 distinct generative engines (Sensor, Telemetry, Topography, Viewfinder), each with unique compositional geometry, density, and coordinate styling. |
| **MOTION** | **1 (Calm)** | Static vector canvas art with zero distracting ambient animations; instantaneous parameter re-rendering via requestAnimationFrame batching. |

---

## 3. Color System & Contrast
- **Sidebar Workbench**:
  - Background: `#fafafa`
  - Borders: `#eaeaea`
  - Text: `#222222`
  - Subtext/Labels: `#777777` (meets WCAG AA > 4.5:1 against `#fafafa`)
  - Range Track: `#c8c8c8` with `#bcbcbc` border (> 3:1 contrast against light background)
  - Range Thumb: `#555555` (> 5:1 contrast against track and background)
- **Canvas Stage**: `#0e0e0e` / `#111111` dark room workspace for maximum color pop and focus.
- **Canvas Visual Themes**: Precision engineering palettes (White/Dark, Blueprint Blue, Amber CRT, Matrix Green, Ivory Editorial).

---

## 4. Typography
- **Workbench UI**: System Sans-Serif (`-apple-system`, `Segoe UI`, `Roboto`) for dense, reliable, compact technical controls.
- **Canvas Vector Overlay**: `Telegraf, system-ui, sans-serif` for technical telemetry stamps, elevation markers, and feature coordinate readouts.

---

## 5. Decision Rationale (R-31)

| Decision | Rationale |
|---|---|
| **Compact 290px Sidebar** | Maximizes canvas viewport area while keeping all controls accessible without deep menus. |
| **Monochrome UI with Dark Stage** | Eliminates visual interference from the interface when evaluating delicate generative graphics. |
| **4 Generative Visual Engines** | Offers 4 distinct aesthetic directions (Blob Tracker, HUD Telemetry, Topographic Map, Editorial Studio). |
| **Interactive Pixelation Zones** | Allows targeted focal point abstraction and technical redaction directly on the canvas. |
| **Local-Only Processing** | 100% privacy, zero latency, and zero server upload dependencies. |
