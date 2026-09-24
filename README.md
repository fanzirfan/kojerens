# KOJERENS

> Generative Visual & Computational Design Studio  
> **Author**: Fanz Irfan | **URL**: [manji.eu.org](https://manji.eu.org)

KOJERENS adalah laboratorium visual generatif dan komputasi grafis berbasis browser (*client-side*) dengan teknologi web murni (HTML5 Canvas, CSS3, ES6 JavaScript). Seluruh kalkulasi citra dan visualisasi berjalan langsung di perangkat pengguna secara lokal tanpa ketergantungan server luar.

---

## Modul & Alat Desain

### 1. Blob Tracker (`/blob-tracker/`)
Alat analisis kontras dan detektor fitur citra dengan 4 mesin generatif visual:

- **Mesin Sensor (`circles`)**: Pelacak titik fitur dan blob dinamis dengan pembobotan radius adaptif, konstelasi garis penghubung (*constellation vectors*), dan pembacaan koordinat teknis.
- **Mesin Telemetry (`hero`)**: Tampilan HUD fiksi ilmiah berdampak tinggi dengan dial lingkaran terkalibrasi (*tick marks*), kisi perspektif teknis, sudut pembidik (*corner brackets*), dan crosshair.
- **Mesin Topography (`geo`)**: Pemetaan kontur geodetik presisi tinggi menggunakan algoritma *Marching Squares* untuk visualisasi elevasi berjenjang serta garis bearing radial.
- **Mesin Viewfinder (`studio`)**: Komposisi editorial minimalis dengan panduan *rule-of-thirds* dan tipografi telemetri studio.

**Fitur Pendukung Blob Tracker**:
- **40 Kurasi Gradient Map**: Spektrum warna monokrom, neon cybernetic, duotone editorial, hingga thermal infrared.
- **Template Ukuran Canvas Fleksibel**:
  - *Portrait*: 3:4, 9:16, 2:3
  - *Landscape*: 4:3, 16:9, 3:2
  - *Square*: 1:1 (1200 x 1200)
  - *Original*: Menggunakan resolusi asli foto 1:1 tanpa crop
  - *Custom*: Kustomisasi lebar (W) dan tinggi (H) piksel secara bebas
- **Ekspor Resolusi Penuh**: Unduh hasil akhir PNG resolusi tinggi (`tracker-...png`) dan mode *Overlay Only* berlatar transparan.
- **Mobile First Experience**: Tampilan preview gambar berada di atas (*pinned preview*) yang responsif saat mengubah parameter di bawahnya.

---

### 2. ASCII Matrix Generator (`/ascii-gen/`)
Sintesis karakter Unicode dan seni ASCII interaktif secara *real-time*:

- **Image Input**: Mendukung berbagai format citra raster maupun vektor (*PNG, JPG, WebP, SVG, GIF, AVIF*).
- **Rangkaian Efek Visual**:
  - *Optical Bloom*: Efek pendaran cahaya lensa pada karakter terang.
  - *Exposure & Contrast Tuning*: Penyesuaian kompensasi eksposur dan kontras secara presisi.
  - *Kuantisasi Warna & Inversi*: Pengaturan palet monokrom, phosphor green, amber CRT, hingga mode full-color.
- **Kontrol Glif & Kepadatan**: Modulasi kepadatan matriks karakter, faktor skala resolusi, dan pemilihan set glif Unicode khusus.
- **Format Ekspor Komprehensif**:
  - Berkas gambar beresolusi tinggi (PNG).
  - Teks mentah (.txt) untuk salin ke terminal atau dokumen.
  - Salin teks ASCII langsung ke clipboard (*One-click copy*).

---

### 3. 1-Bit Dither Matrix (`/dither-gen/`)
Sintesis grafis bitmap 1-bit retro dan error-diffusion kuantisasi tingkat tinggi langsung di peramban:

- **15 Algoritma Dithering Komprehensif**:
  - *Error Diffusion*: Atkinson (klasik Apple Mac OS 1984), Floyd-Steinberg, Sierra-3, Sierra Lite, Stucki, Burkes, Jarvis-Judice-Ninke (JJN).
  - *Ordered / Matrix*: Bayer 8x8, Bayer 4x4, Bayer 2x2.
  - *Halftone Screens*: Halftone Dot Screen (raster percetakan koran), Halftone Line Screen (garis scanline litografi).
  - *Noise & Threshold*: Blue Noise, Random Stochastic, Pure Threshold.
- **12 Palet Warna Retro Terkalibrasi**:
  - Macintosh 1984, Game Boy Original/Pocket, Phosphor Green CRT, Amber Terminal, Cyberpunk Neon, Blueprint Cyan, Solarized Dark, Tokyo Neon, Newsprint Vintage, Thermal Camera, Commodore 64, ZX Spectrum.
  - Mode custom 2 warna bebas dengan dukungan inversi palet.
- **Kontrol Citra & Penskalaan Piksel**:
  - Penskalaan piksel integer murni (1x, 2x, 3x, 4x, 6x, 8x).
  - Optimasi level: Brightness, Contrast, Gamma Correction, Threshold Bias, Sobel Edge Boost, dan Serpentine scanning toggle.
- **Tipografi Telemetri 4 Sudut**:
  - Watermark teknis di setiap sudut kanvas dengan ukuran font adaptif dan label kustom.
- **Ekspor Vektor & Raster Multi-Format**:
  - Unduh PNG resolusi tinggi (`tracker-dither-...png`).
  - Mode transparan (*Overlay Dots Only*).
  - Ekspor vektor SVG murni (`tracker-dither-...svg`) dengan kompresi run-length horizontal untuk software CAD/Illustrator/Figma.
- **Mobile Split-Pane Fixed Layout**:
  - Tampilan kanvas preview selalu terpancang (*pinned stage*) di bagian atas layar dengan kontrol drawer di bawahnya, bebas tumpang tindih.

---

### 4. Analog CRT Beam & Glitch Synthesizer (`/crt-gen/`)
Sintesis tabung sinar katoda (CRT) fisik dan prosesor analog video glitch langsung di peramban:

- **Fisika Tabung & Geometri Layar**:
  - *Barrel Curvature*: Distorsi cembung bola kaca tabung katoda realistis.
  - *Chassis Corner Rounding & Vignette*: Masking sudut sasis monitor serta penggelapan tepi radiasi elektron.
  - *Glass Specular Reflection*: Pendaran pantulan cahaya ambient pada permukaan luar tabung.
- **Dinamika Berkas Elektron & Scanlines**:
  - Pengaturan kerapatan scanline (120 hingga 640 baris raster) dan intensitas jurang raster.
  - *Beam Bloom (Halation)*: Pendaran cahaya elektron menyebar pada piksel berintensitas tinggi.
  - Simulasi *Interlacing*: Medan pemindaian genap/ganjil (*Even/Odd fields*) atau progresif.
- **Matriks Masker Fosfor RGB**:
  - *Aperture Grille*: Garis vertikal fosfor RGB (Sony Trinitron PVM).
  - *Shadow Mask*: Matriks delta titik triad (TV konsumen era 90-an).
  - *Slot Mask*: Susunan bata vertikal (Arcade Cromaclear).
  - *Micro-Mesh*: Kisi-kisi mikro terminal halus.
- **Glitch Analog & Degradasi Sinyal**:
  - *Chromatic Aberration (RGB Split)*: Pemisahan berkas tembakan pistol elektron merah dan biru.
  - *NTSC Chroma Bleed*: Pelebaran dan distorsi warna komposit horizontal.
  - *Horizontal Sync Jitter*: Ketidakstabilan time-base dan robekan scanline acak.
  - *VHS Tracking Noise Bar*: Garis noise statis putih khas pita magnetik VHS yang hilang tracking.
  - *RF Snow & Multipath Ghosting*: Derau statis antena frekuensi tinggi dan bayangan sinyal pantul ganda.
- **8 Preset Siap Pakai**:
  - *Trinitron PVM*, *Consumer 90s*, *P1 Emerald Phosphor*, *P3 Amber Phosphor*, *VHS Tape Glitch*, *Cyber Fringes*, *Arcade 240p*, dan *Lo-Fi Broadcast*.
- **OSD Telemetry & SMPTE Calibration**:
  - Grafis On-Screen Display siaran hijau/putih dengan indikator REC dan timecode.
  - Badge kalibrasi 8 bilah warna standar SMPTE.
- **Format Ekspor Komprehensif**:
  - Unduh citra penuh (`tracker-crt-...png`).
  - Unduh *Transparent Scanline Overlay* (hanya garis scanline, masker, dan lengkungan tabung berlatar transparan untuk overlay video di software editing seperti Premiere Pro atau After Effects).

---

## Prinsip & Arsitektur

1. **Privasi & Keamanan Penuh**: 100% berjalan *in-browser*. Tidak ada data citra atau teks pengguna yang dikirim ke server.
2. **Kinerja Tinggi**:
   - Memanfaatkan *offscreen canvas buffer* yang dapat digunakan kembali dengan flag `{ willReadFrequently: true }`.
   - Pipeline rendering dibatch secara halus menggunakan `requestAnimationFrame` untuk menjamin responsivitas 60fps/120fps.
3. **Desain Terpadu**: Estetika *Cathedral Frosted Glass* bertema gelap (*midnight canvas*), aksen *Void Violet*, serta tipografi teknis dot-matrix yang presisi.
4. **Studio Pipeline & Ekosistem Terpadu**:
   - *Cross-Tool Interop*: Routing visual instan antar 4 mesin (Blob Tracker ↔ ASCII Matrix ↔ 1-Bit Dither ↔ CRT Synthesizer) melalui IndexedDB tanpa perlu unduh/unggah manual.
   - *Global Clipboard Paste*: Dukungan `Ctrl + V` langsung di seluruh canvas alat.
   - *Preset Share*: Berbagi resep parameter desain melalui URL hash.
   - *Progressive Web App (PWA)*: Caching *Service Worker* statis untuk akses 100% *offline* di desktop maupun perangkat seluler.

---

## Teknologi & Arsitektur

- **Framework**: [Astro v5](https://astro.build/) (Static Site Generation / `output: 'static'`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite` dengan CSS-first `@theme` tokens
- **Package Manager & Runtime**: [Bun](https://bun.sh/)
- **Hosting & Edge**: Cloudflare Pages / Workers Static Assets via [`wrangler.jsonc`](wrangler.jsonc)
- **Komputasi Grafis**: HTML5 Canvas2D dengan *offscreen buffer pools* dan akselerasi hardware

### Struktur Proyek

```
blob-tracker/
├── src/
│   ├── pages/           # Route Astro (/, /blob-tracker, /ascii-gen, /dither-gen, /crt-gen)
│   └── styles/          # Tailwind CSS v4 global.css & tool-specific stylesheets
├── public/              # Skrip visual engine, web worker, icon, dan aset statis
├── wrangler.jsonc       # Konfigurasi Cloudflare Pages (serving ./dist)
├── astro.config.mjs     # Konfigurasi Astro SSG & Vite Tailwind plugin
└── package.json
```

---

## Menjalankan Secara Lokal & Build

Workspace ini ditenagai oleh **Astro** dan **Bun**:

```bash
# Instalasi dependensi
bun install

# Menjalankan development server
bun run dev

# Membangun output statis untuk Cloudflare Pages
bun run build

# Menjalankan preview lokal hasil build
bun run preview
```

Output build akan tersimpan di direktori `./dist` dan siap dideploy langsung ke Cloudflare Pages.
Buka peramban di `http://localhost:4321`.

---

## Roadmap Pengembangan Studio

Berikut adalah daftar rencana fitur dan modul baru yang dijadwalkan untuk pengembangan selanjutnya:

### 1. Peningkatan Modul yang Sudah Ada
- **Export Vektor SVG untuk Blob Tracker**: Ekspor kurva kontur *Marching Squares* (Topography) dan garis *Sensor Constellation* ke berkas SVG murni untuk kebutuhan Figma, Adobe Illustrator, atau mesin *pen-plotter* (AxiDraw).
- **Live Webcam & Perekaman Animasi di 1-Bit Dither**: Dukungan siaran kamera langsung secara *real-time* (estetika Game Boy Camera) serta perekaman klip looping 3-5 detik berformat GIF / WebP.
- **Preset Standar Cetak (300 DPI)**: Template resolusi tinggi siap cetak untuk ukuran A4 (2480 x 3508 piksel), A3, dan format poster editorial.

### 2. Rencana Modul Generatif Baru
- **Voronoi & Weighted Stippling Matrix (`/stipple-gen/`)**: Konversi citra menjadi sebaran titik stippling berbobot kepadatan cahaya (*density-weighted stippling*), triangulasi Delaunay, dan *Travelling Salesperson (TSP)* single-line vector art.
- **Slit-Scan & Time-Displacement Synthesizer (`/scan-gen/`)**: Efek distorsi *slit-scan* temporal dan displacement celah horizontal/vertikal untuk eksperimen foto dan video.
- **Turing Reaction-Diffusion Laboratory (`/turing-gen/`)**: Model morfogenesis biologis Gray-Scott untuk menghasilkan pola labirin dan tekstur organik yang bereaksi terhadap kontras gambar.

---

## Lisensi & Atribusi

- **Konsep, Desain & Pengembangan**: **Fanz Irfan**
- **Website**: [manji.eu.org](https://manji.eu.org)
