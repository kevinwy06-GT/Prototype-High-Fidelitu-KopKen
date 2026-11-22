# Prototype High-Fidelity Aplikasi Kopi Kenangan (Kelompok 9 — UX Design)

Repositori ini berisi **2 Prototype High-Fidelity Interaktif** untuk *Comparative A/B Usability Testing* berdasarkan hasil wawancara, User Persona (Laporan Tugas 1), dan materi UX Design (CH1–CH9).

## Struktur Folder
- **`Prototype 1/`** — *Task-First Express Hub* (Google Material Design 3, 5 Tab Bottom Navigation, M3 Bottom Sheets, Mode Sederhana Teks Besar).
- **`Prototype 2/`** — *Minimalist Guided Flow* (Clean Modern HIG, 3 Tab Bottom Navigation, Direct-to-Menu, Dedicated Full-Screen Customizer, Auto-Suggest Best Voucher, Floating Live Queue Pill).

## Cara Menjalankan

### Prototype 1 (Port `5173`)
```bash
cd "Prototype 1"
npm install
npm run dev
```

### Prototype 2 (Port `5174`)
```bash
cd "Prototype 2"
npm install
npm run dev
```

## Fitur Kamera Ketersediaan Tempat (Parkir & Meja)
- Gerai standalone (Siwalankerto, Jemursari) → **Kamera Parkir**; gerai di mall (Petra Square, Tunjungan Plaza 3) → **Kamera Meja**.
- Badge `Tersedia / Terbatas / Penuh` (warna + ikon + teks) muncul di daftar gerai dan di Beranda/Pesan; tombol **Lihat kamera** membuka tampilan kamera.
- Tampilan kamera disimulasikan dari data dummy statis (`space.layout` di `src/data/mockData.js`, X = terisi, O = kosong), bukan video asli. Kode: `CameraScene.jsx`, `SpaceBadge.jsx`, `CameraSheet.jsx` (P1) / `CameraModal.jsx` (P2).
