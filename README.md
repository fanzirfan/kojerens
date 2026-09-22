# KOJERENS

> Generative Visual & Computational Design Studio  
> **Author**: Fanz Irfan | **URL**: [manji.eu.org](https://manji.eu.org)

KOJERENS adalah laboratorium visual generatif dan komputasi grafis berbasis browser (*client-side*) dengan teknologi web murni (HTML5 Canvas, CSS3, ES6 JavaScript). Seluruh kalkulasi gambar, pemrosesan video, dan visualisasi berjalan langsung di perangkat pengguna secara lokal tanpa ketergantungan server luar.

---

## 🛠️ Modul & Alat Desain

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

- **Multi-Media Input**: Mendukung berkas gambar (*PNG/JPG/WebP*), berkas video (*MP4/WebM*), serta siaran kamera langsung (*live webcam*).
- **Rangkaian Efek Visual**:
  - *Optical Bloom*: Efek pendaran cahaya lensa pada karakter terang.
  - *Exposure & Contrast Tuning*: Penyesuaian kompensasi eksposur dan kontras secara presisi.
  - *Kuantisasi Warna & Inversi*: Pengaturan palet monokrom, phosphor green, amber CRT, hingga mode full-color.
- **Kontrol Glif & Kepadatan**: Modulasi kepadatan matriks karakter, faktor skala resolusi, dan pemilihan set glif Unicode khusus.
- **Format Ekspor Komprehensif**:
  - Berkas gambar beresolusi tinggi (PNG).
  - Teks mentah (.txt) untuk salin ke terminal atau dokumen.
  - Urutan frame gambar (.zip) untuk rekaman video/animasi ASCII.

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

## ⚡ Prinsip & Arsitektur

1. **Privasi & Keamanan Penuh**: 100% berjalan *in-browser*. Tidak ada data citra, video, atau teks pengguna yang dikirim ke server.
2. **Kinerja Tinggi**:
   - Memanfaatkan *offscreen canvas buffer* yang dapat digunakan kembali dengan flag `{ willReadFrequently: true }`.
   - Pipeline rendering dibatch secara halus menggunakan `requestAnimationFrame` untuk menjamin responsivitas 60fps/120fps.
3. **Desain Terpadu**: Estetika *Cathedral Frosted Glass* bertema gelap (*midnight canvas*), aksen *Void Violet*, serta tipografi teknis dot-matrix yang presisi.
4. **Studio Pipeline & Ekosistem Terpadu**:
   - *Cross-Tool Interop*: Routing visual instan antar 3 mesin (Blob Tracker ↔ ASCII Matrix ↔ 1-Bit Dither) melalui IndexedDB tanpa perlu unduh/unggah manual.
   - *Global Clipboard Paste*: Dukungan `Ctrl + V` langsung di seluruh canvas alat.
   - *Preset Share*: Berbagi resep parameter desain melalui URL hash.
   - *Progressive Web App (PWA)*: Caching *Service Worker* statis untuk akses 100% *offline* di desktop maupun perangkat seluler.

---

## 🚀 Menjalankan Secara Lokal

Karena dibangun dengan web standar tanpa dependensi bundler atau npm, Anda dapat langsung membukanya di browser atau menggunakan server lokal sederhana:

```bash
# Menggunakan Python 3
python -m http.server 3000

# Atau menggunakan Node.js npx serve
npx serve .
```

Buka peramban di `http://localhost:3000`.

---

## 📜 Lisensi & Atribusi

- **Konsep, Desain & Pengembangan**: **Fanz Irfan**
- **Website**: [manji.eu.org](https://manji.eu.org)
