/* MTsS DDI LABAE — main.js (vanilla JS, tanpa library) */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Menu mobile */
  var btn = $('#menuBtn');
  var list = $('#navList');
  function setMenu(open) {
    if (!btn || !list) return;
    list.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  }
  if (btn && list) {
    btn.addEventListener('click', function () {
      setMenu(!list.classList.contains('open'));
    });
    $$('a:not(.nav-search-trigger)', list).forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && list.classList.contains('open')) {
        setMenu(false);
        btn.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) setMenu(false);
    });
  }

  /* 2. Header berbayang & tombol kembali ke atas saat scroll */
  var header = $('.hd');
  var topBtn = $('.top');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (topBtn) topBtn.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 3. Menu aktif sesuai bagian yang sedang dibaca */
  var parent = { identitas: 'profil', visi: 'profil', galeri: 'galeri' };
  var links = $$('.nl > li > a[href^="#"]');
  function markActive(id) {
    var target = '#' + (parent[id] || id);
    links.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === target);
      if (a.getAttribute('href') === target) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window) {
    var secs = $$('section[id], footer[id]');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) markActive(en.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { io.observe(s); });
  }

  /* 4. Filter liputan (Semua / 2026 / 2025) untuk section di index.html */
  var tabs = $$('.tabs .tab');
  var cards = $$('.nc');
  if (tabs.length && cards.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var f = tab.getAttribute('data-filter');
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('active', on);
          t.setAttribute('aria-pressed', String(on));
        });
        cards.forEach(function (c) {
          c.classList.toggle('hide', f !== 'all' && !c.classList.contains(f));
        });
      });
    });
  }

  /* 5. Muncul halus saat di-scroll */
  var targets = $$('#profil > div, #visi li, #kegiatan .row > div, #galeri .ph, .nf, #identitas dl, #kontak .w > div, .contact-card-top, .contact-form-box, .contact-map-box, .faq-card, .wali-card');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { el.classList.add('reveal'); ro.observe(el); });
  }

  /* 6. Tahun otomatis di footer */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ==========================================================================
     7. MESIN PENCARIAN PINTAR (Quick Navigation & Keyword Object Search)
     ========================================================================== */
  var NAV_INDEX = [
    {
      title: 'Beranda (Halaman Utama)',
      category: 'Profil',
      badgeClass: 'badge-profil',
      url: 'index.html#beranda',
      keywords: ['beranda', 'home', 'utama', 'selamat datang', 'madrasah', 'mts', 'mtss', 'ddi', 'labae', 'surgaku', 'profil'],
      desc: 'Halaman awal website resmi MTsS DDI Labae, moto sekolah, visi sekilas & profil madrasah.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
    },
    {
      title: 'Identitas & Legalitas Madrasah',
      category: 'Profil',
      badgeClass: 'badge-profil',
      url: 'identitas-madrasah.html',
      keywords: ['identitas', 'legalitas', 'npsn', '69727769', 'nsm', '121273120025', 'akreditasi', 'status', 'swasta', 'sk', 'kemenag', 'pedesaan', 'nomor statistik'],
      desc: 'Data pokok kelembagaan: NPSN 69727769, NSM 121273120025, peringkat akreditasi, binaan Kemenag.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
    },
    {
      title: 'Sambutan Kepala Madrasah (Sukma Asni, S.Pd.I)',
      category: 'Profil',
      badgeClass: 'badge-profil',
      url: 'sambutan-kepala-madrasah.html',
      keywords: ['sambutan', 'kepala madrasah', 'kamad', 'pimpinan', 'amanat', 'pidato', 'pesan', 'arahan', 'kepala sekolah', 'sukma asni', 'sukma'],
      desc: 'Pesan resmi Kepala MTsS DDI Labae Sukma Asni, S.Pd.I untuk santri, orang tua, alumni, dan stakeholder.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
    },
    {
      title: 'Struktur Organisasi MTs. DDI Labae',
      category: 'Akademik',
      badgeClass: 'badge-akademik',
      url: 'tenaga-pendidik.html#struktur-organisasi',
      keywords: ['struktur', 'organisasi', 'struktur organisasi', 'bagan', 'bagan organisasi', 'sukma asni', 'a. suking', 'suking', 'eko ridwan', 'wakamad', 'saniati', 'perpustakaan', 'asni', 'tata usaha', 'samsuria', 'kesiswaan', 'andi hamid', 'sarpras', 'humas', 'komite'],
      desc: 'Bagan resmi susunan organisasi MTs. DDI Labae: Kepala Madrasah, Ketua Komite, Wakamad, Tata Usaha, dan Bidang Urusan.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'
    },
    {
      title: 'Visi, Misi & Tujuan Madrasah',
      category: 'Profil',
      badgeClass: 'badge-profil',
      url: 'index.html#visi',
      keywords: ['visi', 'misi', 'tujuan', 'cita-cita', 'panca cinta', 'berakhlak', 'adaptif', 'life skills', 'akhlak', 'nilai', 'religius'],
      desc: 'Visi lembaga unggul berakhlak & adaptif, 4 misi Panca Cinta, serta 5 tujuan madrasah.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
    },
    {
      title: 'Tenaga Pendidik & Dewan Guru',
      category: 'Akademik',
      badgeClass: 'badge-akademik',
      url: 'tenaga-pendidik.html',
      keywords: ['guru', 'tenaga pendidik', 'kependidikan', 'dewan guru', 'ustadz', 'ustadzah', 'pengajar', 'staf', 'wali kelas', 'satminkal', 'mapel', 'sukma asni', 'eko ridwan', 'asni', 'saniati', 'samsuria', 'andi hamid', 'andi maulidiana', 'vivi suyanti', 'elisa', 'ashar effendi', 'irmayana', 'rasmawati', 'muhammad asriadi', 'matematika', 'ipa', 'ips', 'bahasa inggris', 'bahasa indonesia', 'fikih', 'akidah akhlak', 'al-quran hadist', 'informatika', 'penjas', 'bahasa arab', 'prakarya'],
      desc: 'Daftar dewan guru, wali kelas, dan tenaga pendidik mata pelajaran MTsS DDI Labae.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    },
    {
      title: 'Data Siswa & Statistik Santri',
      category: 'Akademik',
      badgeClass: 'badge-akademik',
      url: 'data-siswa.html',
      keywords: ['data siswa', 'siswa', 'santri', 'peserta didik', 'murid', 'statistik', 'kelas 7', 'kelas 8', 'kelas 9', 'vii', 'viii', 'ix', 'jumlah siswa', 'rekapitulasi', '31 siswa', 'wali kelas'],
      desc: 'Data statistik 31 santri aktif MTsS DDI Labae (Kelas VII: 6, Kelas VIII: 15, Kelas IX: 10 siswa).',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>'
    },
    {
      title: 'SPMB 2026/2027 (Penerimaan Murid Baru)',
      category: 'Akademik',
      badgeClass: 'badge-akademik',
      url: 'index.html#spmb',
      keywords: ['spmb', 'ppdb', 'penerimaan murid baru', 'santri baru', 'pendaftaran', 'brosur', 'syarat', 'seragam gratis', 'atk gratis', 'sukma asni', 'samsuria', 'alur', 'biaya', 'formulir', 'daftar'],
      desc: 'Informasi resmi SPMB 2026/2027: Belajar, Berakhlak, Berprestasi. Gratis seragam & ATK, alur pendaftaran, dan narahubung WhatsApp.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>'
    },
    {
      title: 'Program Kegiatan & 6 Pilar Pembinaan',
      category: 'Kegiatan',
      badgeClass: 'badge-kegiatan',
      url: 'kegiatan-pembinaan.html',
      keywords: ['kegiatan', 'pembinaan', 'karakter', 'program', 'ekstrakurikuler', '6 pilar', 'ibadah', 'pembiasaan', 'pendidikan'],
      desc: 'Enam pilar pembinaan holistik: ibadah harian, adab santri, wawasan kebangsaan, dan tata kelola mutu.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>'
    },
    {
      title: 'MATAMUDA (Masa Ta\'aruf Siswa Baru)',
      category: 'Kegiatan',
      badgeClass: 'badge-kegiatan',
      url: 'kegiatan-pembinaan.html#matamuda',
      keywords: ['matamuda', 'taaruf', 'masa taaruf', 'mpls', 'orientasi', 'mos', 'santri baru', 'adab', 'pembukaan', 'penutupan'],
      desc: 'Masa Ta’aruf Murid Madrasah untuk mengenalkan kultur madrasah, adab kepada guru, dan teman belajar.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z"/></svg>'
    },
    {
      title: 'Salat Duha & Zikir Pagi Bersama',
      category: 'Kegiatan',
      badgeClass: 'badge-kegiatan',
      url: 'kegiatan-pembinaan.html#ibadah',
      keywords: ['salat duha', 'shalat dhuha', 'zikir', 'doa', 'ibadah', 'sunnah', 'spiritual', 'pagi', 'pembiasaan', 'amalan'],
      desc: 'Rutinitas harian salat duha berjemaah dan zikir pagi demi mengawali pembelajaran dengan keberkahan.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
    },
    {
      title: 'Upacara Bendera & Wawasan Kebangsaan',
      category: 'Kegiatan',
      badgeClass: 'badge-kegiatan',
      url: 'kegiatan-pembinaan.html#upacara',
      keywords: ['upacara', 'bendera', 'kesaktian pancasila', 'senin', 'kebangsaan', 'patriotisme', 'nasional', 'cinta tanah air'],
      desc: 'Upacara bendera rutin hari Senin dan peringatan hari besar nasional pembina jiwa patriotisme santri.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/></svg>'
    },
    {
      title: 'Program BRUS KUA Kecamatan Citta',
      category: 'Kegiatan',
      badgeClass: 'badge-kegiatan',
      url: 'kegiatan-pembinaan.html#kua',
      keywords: ['kua', 'brus', 'bimbingan remaja', 'citta', 'penyuluhan', 'etika pergaulan', 'kesehatan mental', 'pernikahan dini'],
      desc: 'Kerjasama Bimbingan Remaja Usia Sekolah dengan KUA Kecamatan Citta membina generasi cerdas dan berakhlak.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/></svg>'
    },
    {
      title: 'Arsip Liputan & Berita Madrasah',
      category: 'Berita',
      badgeClass: 'badge-berita',
      url: 'liputan.html',
      keywords: ['liputan', 'berita', 'kabar', 'warta', 'artikel', 'pengumuman', 'prestasi', 'dokumentasi', 'publikasi'],
      desc: 'Kumpulan berita terkini, dokumentasi agenda madrasah, filter kategori liputan dan arsip kegiatan.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
    },
    {
      title: 'Liputan Upacara Hari Kesaktian Pancasila',
      category: 'Berita',
      badgeClass: 'badge-berita',
      url: 'blog-detail.html',
      keywords: ['upacara kesaktian pancasila', '1 oktober', 'artikel upacara', 'pembina upacara', 'amanat kamad', 'berita upacara'],
      desc: 'Laporan warta pelaksanaan upacara bendera memperingati Hari Kesaktian Pancasila di MTsS DDI Labae.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
    },
    {
      title: 'Semangat Berprestasi, Kontingen MTsS DDI Labae Ikuti OMI 2026',
      category: 'Berita',
      badgeClass: 'badge-berita',
      url: 'liputan-omi-2026.html',
      keywords: ['omi', 'olimpiade madrasah indonesia', 'sains', 'prestasi', 'kompetisi', 'kontingen', 'daya pikir kritis', '2026'],
      desc: 'Kontingen MTsS DDI Labae mengikuti Olimpiade Madrasah Indonesia (OMI) 2026 mengembangkan potensi akademik dan semangat berprestasi.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>'
    },
    {
      title: 'Peringatan Hari Santri 2026: Zikir dan Selawat',
      category: 'Berita',
      badgeClass: 'badge-berita',
      url: 'liputan-hari-santri-2026.html',
      keywords: ['hari santri', 'hsn 2026', 'zikir', 'selawat', 'rasulullah', 'karakter religius', '22 oktober'],
      desc: 'Peringatan Hari Santri Nasional 2026 di MTsS DDI Labae dengan memperbanyak zikir dan selawat bersama santri.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    },
    {
      title: 'Semarak Kemah Bhakti Tsanlab Scout',
      category: 'Berita',
      badgeClass: 'badge-berita',
      url: 'liputan-pramuka-scout.html',
      keywords: ['kemah pramuka', 'tsanlab scout', 'pionering', 'perkemahan', 'bambu', 'pramuka', 'gugus depan', '2026'],
      desc: 'Kemah Bhakti Gugus Depan Tsanlab Scout MTsS DDI Labae membentuk ketangguhan karakter dan kreativitas pionering.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
    },
    {
      title: 'Peringatan Maulid Nabi Muhammad SAW',
      category: 'Berita',
      badgeClass: 'badge-berita',
      url: 'liputan-maulid-nabi.html',
      keywords: ['maulid', 'maulid nabi', 'phbi', 'masjid', 'shalawat', 'santriwati', 'male telur', '2026'],
      desc: 'Peringatan Maulid Nabi Muhammad SAW di masjid dengan khidmat, selawat merdu santriwati dan tausiyah keteladanan Rasulullah.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
    },
    {
      title: 'Kolaborasi Pengabdian Mahasiswa KKN Bersama Guru',
      category: 'Berita',
      badgeClass: 'badge-berita',
      url: 'liputan-kkn-kolaborasi.html',
      keywords: ['kkn', 'mahasiswa', 'kolaborasi', 'pengabdian', 'cenderamata', 'dewan guru', 'kkn 2025'],
      desc: 'Sinergi pengabdian mahasiswa KKN bersama segenap dewan guru MTsS DDI Labae dalam pendampingan belajar santri.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    },
    {
      title: 'Silaturahim Orang Tua Siswa & Komite Madrasah',
      category: 'Berita',
      badgeClass: 'badge-berita',
      url: 'liputan-rapat-komite.html',
      keywords: ['silaturahim', 'komite', 'rapat komite', 'orang tua', 'wali murid', 'sinergi', 'mutu pendidikan'],
      desc: 'Pertemuan silaturahim madrasah bersama orang tua siswa dan pengurus komite MTsS DDI Labae.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    },
    {
      title: 'Pemilihan Ketua OSIM MTsS DDI Labae',
      category: 'Berita',
      badgeClass: 'badge-berita',
      url: 'liputan-pemilihan-osim.html',
      keywords: ['osim', 'ketua osim', 'pemilihan', 'demokrasi', 'kepemimpinan', 'organisasi siswa', 'suara santri'],
      desc: 'Pelaksanaan Pemilihan Ketua OSIM MTsS DDI Labae menanamkan nilai demokrasi dan melatih jiwa kepemimpinan peserta didik.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    },
    {
      title: 'Tanamkan Karakter Religius: Salat Duha & Zikir Bersama',
      category: 'Berita',
      badgeClass: 'badge-berita',
      url: 'liputan-salat-duha.html',
      keywords: ['salat duha', 'duha', 'zikir', 'tadarus', 'karakter religius', 'pembiasaan', 'ibadah sunah'],
      desc: 'Pembiasaan ibadah salat Duha, tadarus Al-Qur’an, dan zikir bersama di MTsS DDI Labae membentuk karakter santri yang berakhlak mulia.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>'
    },
    {
      title: 'Penutupan MATAMUDA 2026: Pembentukan Akhlak',
      category: 'Berita',
      badgeClass: 'badge-berita',
      url: 'liputan-matamuda-2026.html',
      keywords: ['matamuda', 'matamuda 2026', 'taaruf', 'santri baru', 'akhlak', 'karakter', 'kepala madrasah'],
      desc: 'Penutupan Masa Taaruf Murid Madrasah (MATAMUDA) 2026 MTsS DDI Labae dengan penekanan adab dan akhlak mulia.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>'
    },
    {
      title: 'Galeri Foto & Potret Kegiatan',
      category: 'Kegiatan',
      badgeClass: 'badge-kegiatan',
      url: 'index.html#galeri',
      keywords: ['galeri', 'foto', 'dokumentasi', 'album', 'potret', 'gambar', 'visual', 'aktivitas madrasah'],
      desc: 'Album dokumentasi foto kegiatan belajar mengajar, upacara, pembinaan santri dan lingkungan madrasah.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
    },
    {
      title: 'Kontak, Telepon & WhatsApp',
      category: 'Kontak',
      badgeClass: 'badge-kontak',
      url: 'kontak.html',
      keywords: ['kontak', 'telepon', 'whatsapp', 'wa', 'hp', 'nomor', 'call', 'hubungi', 'email', 'surel', '081343520655'],
      desc: 'Layanan informasi madrasah: WhatsApp/Telp 081343520655 & email resmi mtssddilabae@gmail.com.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
    },
    {
      title: 'Peta Lokasi & Rute MTsS DDI Labae',
      category: 'Kontak',
      badgeClass: 'badge-kontak',
      url: 'kontak.html#petaLokasi',
      keywords: ['peta', 'lokasi', 'alamat', 'maps', 'google maps', 'denah', 'jalan', 'poros labae', 'desa labae', 'kecamatan citta', 'soppeng', 'rute', 'koordinat', '-4.436984', '120.059514'],
      desc: 'Peta Google Maps interaktif lokasi madrasah (-4.436984, 120.059514) Jl. Poros Labae–Pajalesang, Kec. Citta, Soppeng.',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>'
    }
  ];

  /* Modal Markup Generator */
  function injectSearchModal() {
    if ($('#searchModalBackdrop')) return;

    var modalHtml = [
      '<div class="search-modal-backdrop" id="searchModalBackdrop" role="dialog" aria-modal="true" aria-label="Pencarian Navigasi Cepat">',
      '  <div class="search-modal-dialog">',
      '    <div class="search-modal-header">',
      '      <div class="search-icon-box">',
      '        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
      '      </div>',
      '      <input type="text" id="modalSearchInput" class="search-input-field" placeholder="Ketik kata kunci navigasi... (contoh: guru, npsn, visi, siswa, sambutan)" autocomplete="off" spellcheck="false" aria-label="Kata kunci pencarian navigasi">',
      '      <button type="button" class="search-clear-btn" id="modalSearchClear" aria-label="Bersihkan pencarian">✕</button>',
      '      <button type="button" class="search-close-btn" id="modalSearchClose" aria-label="Tutup pencarian"><span class="search-kbd">ESC</span> Tutup</button>',
      '    </div>',
      '    <div class="search-filter-pills" role="tablist" aria-label="Filter Kategori">',
      '      <button type="button" class="search-pill-btn active" data-cat="all">Semua</button>',
      '      <button type="button" class="search-pill-btn" data-cat="Profil">Profil</button>',
      '      <button type="button" class="search-pill-btn" data-cat="Akademik">Akademik</button>',
      '      <button type="button" class="search-pill-btn" data-cat="Kegiatan">Kegiatan</button>',
      '      <button type="button" class="search-pill-btn" data-cat="Berita">Berita</button>',
      '      <button type="button" class="search-pill-btn" data-cat="Kontak">Kontak</button>',
      '    </div>',
      '    <ul class="search-results-list" id="modalSearchResults" role="listbox"></ul>',
      '    <div class="search-modal-footer">',
      '      <span>Pencarian Cepat <b>MTsS DDI Labae</b></span>',
      '      <div class="search-footer-shortcuts">',
      '        <span><span class="search-kbd">↑</span> <span class="search-kbd">↓</span> Navigasi</span>',
      '        <span><span class="search-kbd">↵</span> Buka</span>',
      '        <span><span class="search-kbd">ESC</span> Tutup</span>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  /* Escape RegExp for highlighting */
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* Highlight matching words in text */
  function highlightText(text, query) {
    if (!query) return text;
    var words = query.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return text;
    var pattern = new RegExp('(' + words.map(escapeRegex).join('|') + ')', 'gi');
    return text.replace(pattern, '<mark class="search-match">$1</mark>');
  }

  /* Search Modal Engine Controller */
  function initSearchController() {
    injectSearchModal();

    var backdrop = $('#searchModalBackdrop');
    var input = $('#modalSearchInput');
    var clearBtn = $('#modalSearchClear');
    var closeBtn = $('#modalSearchClose');
    var resultsList = $('#modalSearchResults');
    var pillBtns = $$('.search-pill-btn', backdrop);

    var currentCategory = 'all';
    var selectedIndex = 0;
    var currentFilteredItems = [];

    function openModal(defaultQuery) {
      if (!backdrop) return;
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (typeof defaultQuery === 'string') {
        input.value = defaultQuery;
      }
      clearBtn.classList.toggle('visible', !!input.value.trim());
      renderResults();
      setTimeout(function () {
        input.focus();
        input.select();
      }, 50);
    }

    function closeModal() {
      if (!backdrop) return;
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }

    function filterItems(query, category) {
      var q = query.toLowerCase().trim();
      var words = q.split(/\s+/).filter(Boolean);

      var matched = NAV_INDEX.filter(function (item) {
        if (category !== 'all' && item.category !== category) return false;
        if (!words.length) return true;

        var searchable = (
          item.title + ' ' +
          item.category + ' ' +
          item.desc + ' ' +
          item.keywords.join(' ')
        ).toLowerCase();

        // Every typed word must match somewhere in title/desc/keywords
        return words.every(function (w) {
          return searchable.indexOf(w) > -1;
        });
      });

      // Sort matches: items where title matches first, or exact start
      if (words.length) {
        matched.sort(function (a, b) {
          var aInTitle = a.title.toLowerCase().indexOf(words[0]) > -1 ? 2 : 0;
          var bInTitle = b.title.toLowerCase().indexOf(words[0]) > -1 ? 2 : 0;
          return bInTitle - aInTitle;
        });
      }

      return matched;
    }

    function renderResults() {
      var query = input.value;
      currentFilteredItems = filterItems(query, currentCategory);
      selectedIndex = 0;

      if (!currentFilteredItems.length) {
        var cleanQ = query.replace(/[<>&"]/g, '');
        resultsList.innerHTML = [
          '<li class="search-empty-state">',
          '  <svg class="search-empty-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
          '  <p class="search-empty-title">Tidak ada navigasi yang cocok</p>',
          '  <p class="search-empty-text">Kata kunci "<b>' + cleanQ + '</b>" belum ditemukan. Coba kata kunci populer berikut:</p>',
          '  <div class="search-suggestions-wrap">',
          '    <button type="button" class="search-sugg-btn" data-query="guru">Guru & NUPTK</button>',
          '    <button type="button" class="search-sugg-btn" data-query="siswa">Data Siswa</button>',
          '    <button type="button" class="search-sugg-btn" data-query="npsn">NPSN & NSM</button>',
          '    <button type="button" class="search-sugg-btn" data-query="visi">Visi Misi</button>',
          '    <button type="button" class="search-sugg-btn" data-query="sambutan">Sambutan Kamad</button>',
          '    <button type="button" class="search-sugg-btn" data-query="kontak">Kontak & Telepon</button>',
          '  </div>',
          '</li>'
        ].join('');

        $$('.search-sugg-btn', resultsList).forEach(function (sugg) {
          sugg.addEventListener('click', function () {
            input.value = this.getAttribute('data-query');
            clearBtn.classList.add('visible');
            renderResults();
            input.focus();
          });
        });
        return;
      }

      var html = currentFilteredItems.map(function (item, idx) {
        var isSel = idx === selectedIndex;
        var displayTitle = highlightText(item.title, query);
        var displayDesc = highlightText(item.desc, query);

        return [
          '<li role="option" aria-selected="' + String(isSel) + '">',
          '  <a class="search-result-item ' + (isSel ? 'selected' : '') + '" href="' + item.url + '" data-idx="' + idx + '">',
          '    <div class="search-result-icon">' + item.icon + '</div>',
          '    <div class="search-result-body">',
          '      <div class="search-result-header">',
          '        <span class="search-result-title">' + displayTitle + '</span>',
          '        <span class="search-result-badge ' + item.badgeClass + '">' + item.category + '</span>',
          '      </div>',
          '      <p class="search-result-desc">' + displayDesc + '</p>',
          '    </div>',
          '    <div class="search-result-action">',
          '      <span>Buka</span>',
          '      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
          '    </div>',
          '  </a>',
          '</li>'
        ].join('');
      }).join('');

      resultsList.innerHTML = html;

      // Close modal on click result
      $$('.search-result-item', resultsList).forEach(function (el) {
        el.addEventListener('click', function () {
          closeModal();
        });
      });
    }

    function updateSelection(newIdx) {
      if (!currentFilteredItems.length) return;
      var items = $$('.search-result-item', resultsList);
      if (items.length) {
        if (items[selectedIndex]) items[selectedIndex].classList.remove('selected');
        selectedIndex = (newIdx + items.length) % items.length;
        if (items[selectedIndex]) {
          items[selectedIndex].classList.add('selected');
          items[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
      }
    }

    // Input search events
    input.addEventListener('input', function () {
      clearBtn.classList.toggle('visible', !!this.value.trim());
      renderResults();
    });

    clearBtn.addEventListener('click', function () {
      input.value = '';
      clearBtn.classList.remove('visible');
      renderResults();
      input.focus();
    });

    closeBtn.addEventListener('click', closeModal);

    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal();
    });

    // Category pills filter
    pillBtns.forEach(function (pBtn) {
      pBtn.addEventListener('click', function () {
        currentCategory = this.getAttribute('data-cat') || 'all';
        pillBtns.forEach(function (b) {
          b.classList.toggle('active', b === pBtn);
        });
        renderResults();
        input.focus();
      });
    });

    // Keyboard navigation
    backdrop.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        updateSelection(selectedIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        updateSelection(selectedIndex - 1);
      } else if (e.key === 'Enter') {
        var items = $$('.search-result-item', resultsList);
        if (items.length && items[selectedIndex]) {
          e.preventDefault();
          closeModal();
          items[selectedIndex].click();
        }
      }
    });

    // Global keyboard shortcut to open search modal (Ctrl+K, Cmd+K, or '/')
    document.addEventListener('keydown', function (e) {
      var isTyping = ['INPUT', 'TEXTAREA'].indexOf((e.target && e.target.tagName) || '') > -1;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openModal();
      } else if (e.key === '/' && !isTyping) {
        e.preventDefault();
        openModal();
      }
    });

    // Attach click listeners to all search trigger buttons across pages
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('#openSearchBtn, .nav-search-trigger');
      if (trigger) {
        e.preventDefault();
        openModal();
      }
    });
  }

  // Initialize search engine when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchController);
  } else {
    initSearchController();
  }

  /* ==========================================================================
     8. DARK MODE TOGGLE
     ========================================================================== */
  function initThemeToggle() {
    var STORAGE_KEY = 'mtss-ddi-theme';
    var root = document.documentElement;
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    var toggleBtns = $$('.theme-toggle');

    function getPreferred() {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      if (metaTheme) {
        metaTheme.setAttribute('content', theme === 'dark' ? '#0F1A14' : '#064E24');
      }
      toggleBtns.forEach(function (btn) {
        btn.setAttribute('aria-label', theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap');
      });
    }

    // Apply on load
    applyTheme(getPreferred());

    // Toggle on click
    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = root.getAttribute('data-theme') || 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
      });
    });

    // Listen to system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }

  /* ==========================================================================
     9. GALLERY LIGHTBOX
     ========================================================================== */
  function initGalleryLightbox() {
    var overlay = $('#galleryLightbox');
    if (!overlay) return;

    var imgEl = $('#lightboxImg');
    var captionEl = $('#lightboxCaption');
    var counterEl = $('#lightboxCounter');
    var closeBtn = $('#lightboxClose');
    var prevBtn = $('#lightboxPrev');
    var nextBtn = $('#lightboxNext');
    var triggers = $$('.gallery-trigger');
    var currentIndex = 0;

    if (!triggers.length) return;

    function openLightbox(index) {
      currentIndex = index;
      updateLightbox();
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    function updateLightbox() {
      var trigger = triggers[currentIndex];
      if (!trigger) return;
      var src = trigger.getAttribute('data-full') || trigger.getAttribute('src');
      var caption = trigger.getAttribute('data-caption') || trigger.getAttribute('alt') || '';

      // Brief transition for changing image
      imgEl.style.opacity = '0';
      imgEl.style.transform = 'scale(0.96)';
      setTimeout(function () {
        imgEl.setAttribute('src', src);
        imgEl.setAttribute('alt', caption);
        captionEl.textContent = caption;
        counterEl.textContent = (currentIndex + 1) + ' / ' + triggers.length;
        imgEl.style.opacity = '';
        imgEl.style.transform = '';
      }, 150);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + triggers.length) % triggers.length;
      updateLightbox();
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % triggers.length;
      updateLightbox();
    }

    // Click on gallery images
    triggers.forEach(function (trigger, idx) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(idx);
      });
    });

    // Also allow clicking the gallery card itself (not just the img)
    $$('.gallery-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        // Only if the click didn't already hit the trigger
        if (e.target.classList.contains('gallery-trigger')) return;
        var trigger = card.querySelector('.gallery-trigger');
        if (trigger) {
          var idx = triggers.indexOf(trigger);
          if (idx > -1) openLightbox(idx);
        }
      });
    });

    // Close
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });

    // Navigation
    prevBtn.addEventListener('click', function (e) { e.stopPropagation(); showPrev(); });
    nextBtn.addEventListener('click', function (e) { e.stopPropagation(); showNext(); });

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    });

    // Touch swipe support
    var touchStartX = 0;
    var touchEndX = 0;
    overlay.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    overlay.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) showNext();
        else showPrev();
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleryLightbox);
  } else {
    initGalleryLightbox();
  }
})();
