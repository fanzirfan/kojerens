# Blob Tracker

Visualizer pelacakan blob dan antarmuka cybernetic/geometris 100% di browser tanpa server (client-side).

## Fitur Utama

- **100% Client-Side**: Semua pemrosesan citra dan render overlay berjalan lokal di browser. Data gambar Anda tidak pernah diunggah ke server eksternal.
- **Deteksi & Scoring Berbasis Piksel**: Ukuran lingkaran (radius) menyesuaikan tingkat kecerahan dan kontras gambar di titik koordinat tersebut.
- **Multiple Visual Modes**:
  - **Hero**: Visualisasi lengkap mencakup lingkaran blob, crosshair, garis penghubung, jejak melengkung, dan label koordinat.
  - **Geo Tool**: Tampilan geometris bersih tanpa label teks dan tanpa crosshair.
  - **Studio**: Tampilan titik dan crosshair minimalis tanpa garis koneksi antar-blob.
- **Interaksi Lengkap**:
  - Upload via tombol file picker.
  - Drag and drop langsung ke area canvas.
  - Paste gambar langsung dari clipboard (`Ctrl + V`).
  - Klik pada empty-state area untuk membuka dialog file.
- **High-Resolution Export**: Unduh hasil akhir (PNG) sesuai resolusi asli citra dengan skala garis dan label yang proporsional.
- **Seed & Determinisme**: Kunci seed untuk menghasilkan komposisi yang sama secara konsisten atau acak dengan tombol dadu.

## Cara Menjalankan

Cukup buka file `index.html` langsung di browser favorit Anda, atau jalankan menggunakan local server sederhana:

```bash
# Menggunakan Python
python -m http.server 3000

# Atau menggunakan Node.js npx serve
npx serve .
```
