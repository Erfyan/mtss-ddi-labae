# Website MTsS DDI LABAE (Front End)

Landing page statis: **HTML + CSS + JavaScript** (tanpa framework, tanpa build).

## Identitas Madrasah
- **Nama Satuan Pendidikan**: MTsS DDI Labae (Madrasah Tsanawiyah Swasta DDI Labae)
- **NPSN**: 69727769
- **NSM**: 121273120025
- **Jenjang**: Madrasah Tsanawiyah (MTs / Tingkat Menengah Pertama)
- **Alamat**: Jl. Poros Labae–Pajalesang, Desa Labae, Kecamatan Citta, Kabupaten Soppeng, Sulawesi Selatan 90871
- **Status**: Swasta di bawah naungan Darud Da'wah Wal-Irsyad (DDI) & Kementerian Agama RI

## Fitur Utama
1. **Fitur Navigasi Pintar & Pencarian Cepat (Quick Search Modal)**:
   - Pencarian real-time berdasarkan kata kunci objek data/navigasi (guru, siswa, akreditasi, npsn, nsm, visi, sambutan, upacara, ppdb, kontak, dsb.).
   - Shortcut keyboard instan: tekan `/` atau `Ctrl + K` atau klik tombol **Cari** di header navigasi.
   - Navigasi keyboard (panah atas/bawah, Enter, Esc).
2. **Navigasi Responsif**: Menu dropdown untuk Profil dan Akademik, mobile drawer dengan animasi halus.
3. **Desain Terpadu DDI**: Palet resmi DDI (Hijau Da'wah `#01923F`, Hijau Tua `#064E24`, Kuning Emas `#FAC601`).

## Struktur Berkas
```
ma-ddi-citta/
├── index.html                    # Halaman utama (Home) MTsS DDI Labae
├── identitas-madrasah.html       # Legalitas, NPSN 69727769, NSM 121273120025, akreditasi
├── sambutan-kepala-madrasah.html # Sambutan pimpinan madrasah MTsS DDI Labae
├── tenaga-pendidik.html          # Daftar dewan guru & staf tenaga kependidikan
├── data-siswa.html               # Statistik santri per kelas (VII, VIII, IX)
├── kegiatan-pembinaan.html       # 6 pilar pembinaan karakter, ibadah & kebangsaan
├── liputan.html                  # Arsip liputan, dokumentasi & filter berita
├── blog-detail.html              # Halaman detail warta & kegiatan madrasah
├── css/                          # Direktori Stylesheet Modular
│   ├── style.css                 # Master bundler (@import semua modul)
│   ├── variables.css             # Desain token, warna DDI, reset & utilitas
│   ├── navbar.css                # Topbar kontak, sticky header & menu mobile
│   ├── components.css            # Tabel, kartu data, peta, CTA & footer
│   ├── home.css                  # Seksi khusus beranda index.html
│   ├── pages.css                 # Layout sambutan, liputan & artikel warta
│   ├── org-chart.css             # Bagan resmi Struktur Organisasi MTs. DDI Labae
│   └── search-modal.css          # Dialog & animasi modal pencarian pintar
├── js/main.js                    # Mesin pencari navigasi, menu mobile, active nav, scroll
└── assets/img/                   # Logo resmi DDI dan aset gambar
```

## Cara Pakai
Buka `index.html` di browser, atau jalankan server lokal:
`python3 -m http.server 8000` lalu buka http://localhost:8000
