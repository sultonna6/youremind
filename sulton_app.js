/* =========================================================
   LOGIKA INTERAKTIF YOUREMIND
   Nama     : Sulton Nur Arif (2503010083) - Kelas D
   Konvensi : Seluruh konstanta & fungsi berawalan "sulton"
   ========================================================= */

const SULTON_KEYS = {
  JADWAL: 'sulton_youremind_jadwal_v1',
  TUGAS: 'sulton_youremind_tugas_v1',
  PENGINGAT: 'sulton_youremind_pengingat_v1',
  THEME: 'sulton_theme_v1'
};

const SULTON_HARI_LIST = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// ==================== DATA BAWAAN (SEED DATA) ====================
function sultonBuatSeedJadwal() {
  return [
    { id: 'j1', matkul: 'Pemrograman Web', hari: 'Senin', mulai: '08:00', selesai: '10:30', ruang: 'Lab Komputer 1', dosen: 'Dosen Pemrograman Web' },
    { id: 'j2', matkul: 'Basis Data', hari: 'Selasa', mulai: '09:40', selesai: '12:10', ruang: 'Lab Basis Data', dosen: 'Dosen Basis Data' },
    { id: 'j3', matkul: 'Matematika Diskrit', hari: 'Rabu', mulai: '08:00', selesai: '09:40', ruang: 'Ruang R.204', dosen: 'Dosen Matematika Diskrit' },
    { id: 'j4', matkul: 'Sistem Operasi', hari: 'Kamis', mulai: '10:30', selesai: '12:10', ruang: 'Ruang R.301', dosen: 'Dosen Sistem Operasi' },
    { id: 'j5', matkul: 'Rekayasa Perangkat Lunak', hari: 'Jumat', mulai: '13:00', selesai: '14:40', ruang: 'Ruang R.202', dosen: 'Dosen RPL' }
  ];
}

function sultonOffsetISO(jamOffset) {
  const d = new Date(Date.now() + jamOffset * 3600 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function sultonBuatSeedTugas() {
  return [
    {
      id: 't1',
      matkul: 'Pemrograman Web',
      judul: 'Project Website Pengingat Tugas (UTS)',
      deadline: sultonOffsetISO(14),
      prioritas: 'Tinggi',
      catatan: 'Pastikan 7 halaman terhubung, responsif mobile, dan menggunakan localStorage.',
      selesai: false,
      dibuatPada: Date.now() - 86400000
    },
    {
      id: 't2',
      matkul: 'Basis Data',
      judul: 'Laporan Praktikum ERD & Normalisasi Tabel',
      deadline: sultonOffsetISO(52),
      prioritas: 'Sedang',
      catatan: 'Kumpulkan file PDF diagram ERD sampai bentuk 3NF.',
      selesai: false,
      dibuatPada: Date.now() - 72000000
    },
    {
      id: 't3',
      matkul: 'Matematika Diskrit',
      judul: 'Latihan Soal Graf & Pohon Rentang Minimum',
      deadline: sultonOffsetISO(110),
      prioritas: 'Rendah',
      catatan: 'Kerjakan soal nomor 1 sampai 10 di buku catatan.',
      selesai: false,
      dibuatPada: Date.now() - 36000000
    },
    {
      id: 't4',
      matkul: 'Sistem Operasi',
      judul: 'Resume Penjadwalan Proses CPU (FCFS & Round Robin)',
      deadline: sultonOffsetISO(-18),
      prioritas: 'Sedang',
      catatan: 'Sudah dikumpulkan melalui portal e-learning.',
      selesai: true,
      dibuatPada: Date.now() - 172800000
    }
  ];
}

function sultonGetJadwal() {
  try {
    const raw = localStorage.getItem(SULTON_KEYS.JADWAL);
    if (!raw) {
      const seed = sultonBuatSeedJadwal();
      localStorage.setItem(SULTON_KEYS.JADWAL, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch (e) {
    return sultonBuatSeedJadwal();
  }
}

function sultonSaveJadwal(list) {
  localStorage.setItem(SULTON_KEYS.JADWAL, JSON.stringify(list));
}

function sultonGetTugas() {
  try {
    const raw = localStorage.getItem(SULTON_KEYS.TUGAS);
    if (!raw) {
      const seed = sultonBuatSeedTugas();
      localStorage.setItem(SULTON_KEYS.TUGAS, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch (e) {
    return sultonBuatSeedTugas();
  }
}

function sultonSaveTugas(list) {
  localStorage.setItem(SULTON_KEYS.TUGAS, JSON.stringify(list));
}

function sultonGetPengingat() {
  try {
    const raw = localStorage.getItem(SULTON_KEYS.PENGINGAT);
    if (!raw) {
      const def = { ambangJam: 24, suaraAktif: true };
      localStorage.setItem(SULTON_KEYS.PENGINGAT, JSON.stringify(def));
      return def;
    }
    return JSON.parse(raw);
  } catch (e) {
    return { ambangJam: 24, suaraAktif: true };
  }
}

function sultonSavePengingat(cfg) {
  localStorage.setItem(SULTON_KEYS.PENGINGAT, JSON.stringify(cfg));
}

// ==================== UTILITAS TANGGAL, HTML & TOAST ====================
function sultonEscape(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sultonFormatDeadline(isoStr) {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;
  const hari = SULTON_HARI_LIST[d.getDay()];
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][d.getMonth()];
  const jam = String(d.getHours()).padStart(2, '0');
  const mnt = String(d.getMinutes()).padStart(2, '0');
  return `${hari}, ${d.getDate()} ${bulan} ${d.getFullYear()} • ${jam}:${mnt} WIB`;
}

function sultonSisaWaktuTeks(isoStr) {
  const diff = new Date(isoStr).getTime() - Date.now();
  if (isNaN(diff)) return '';
  if (diff <= 0) {
    const lewatJam = Math.floor(Math.abs(diff) / 3600000);
    return lewatJam < 1 ? 'Baru saja lewat tenggat' : `Terlewat ${lewatJam} jam lalu`;
  }
  const hari = Math.floor(diff / 86400000);
  const jam = Math.floor((diff % 86400000) / 3600000);
  const menit = Math.floor((diff % 3600000) / 60000);
  if (hari > 0) return `${hari} hari ${jam} jam lagi`;
  if (jam > 0) return `${jam} jam ${menit} menit lagi`;
  return `${Math.max(1, menit)} menit lagi`;
}

function sultonIsMendesak(tugas, ambangJam) {
  if (tugas.selesai) return false;
  const diff = new Date(tugas.deadline).getTime() - Date.now();
  return diff <= ambangJam * 3600000;
}

function sultonShowToast(pesan) {
  const toast = document.getElementById('sulton_toast');
  if (!toast) return;
  toast.textContent = pesan;
  toast.classList.add('sulton_toast_show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('sulton_toast_show');
  }, 2800);
}

function sultonSalinTeks(teks, label) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(teks).then(() => {
      sultonShowToast(`${label} berhasil disalin: ${teks}`);
    }).catch(() => {
      sultonShowToast(`${label}: ${teks}`);
    });
  } else {
    sultonShowToast(`${label}: ${teks}`);
  }
}

// ==================== WEB AUDIO API CHIME ====================
function sultonPlayChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [587.33, 880.0]; // D5 -> A5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.16);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + idx * 0.16 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.16 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.16);
      osc.stop(ctx.currentTime + idx * 0.16 + 0.36);
    });
  } catch (e) {}
}

// ==================== THEME SWITCH DENGAN EFEK SLIDE KANAN-KIRI ====================
function sultonInitTheme() {
  const btn = document.getElementById('sulton_theme_toggle');
  const curtain = document.getElementById('sulton_theme_curtain');
  const mainEl = document.getElementById('sulton_main');
  let isAnimating = false;

  const syncAria = (theme) => {
    if (!btn) return;
    const isDark = theme === 'dark';
    btn.setAttribute('aria-checked', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap');
  };

  syncAria(document.documentElement.getAttribute('data-theme') || 'light');

  if (!btn) return;

  btn.addEventListener('click', () => {
    if (isAnimating) return;
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    const toDark = next === 'dark';

    isAnimating = true;

    // Jalankan animasi tirai slide kiri->kanan (ke Dark) atau kanan->kiri (ke Light)
    if (curtain) {
      curtain.classList.remove('sulton_slide_to_dark', 'sulton_slide_to_light');
      void curtain.offsetWidth; // Force reflow agar animasi selalu terpicu ulang
      curtain.classList.add(toDark ? 'sulton_slide_to_dark' : 'sulton_slide_to_light');
    }

    if (mainEl) {
      mainEl.classList.remove('sulton_glide_right', 'sulton_glide_left');
      void mainEl.offsetWidth;
      mainEl.classList.add(toDark ? 'sulton_glide_right' : 'sulton_glide_left');
    }

    // Ubah tema tepat saat tirai menyapu tengah layar (~220ms)
    setTimeout(() => {
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(SULTON_KEYS.THEME, next);
      syncAria(next);
    }, 220);

    setTimeout(() => {
      if (curtain) {
        curtain.classList.remove('sulton_slide_to_dark', 'sulton_slide_to_light');
      }
      if (mainEl) {
        mainEl.classList.remove('sulton_glide_right', 'sulton_glide_left');
      }
      isAnimating = false;
    }, 540);
  });
}

// ==================== MENU HAMBURGER MOBILE (TENTANG & KONTAK) ====================
function sultonInitMobileMenu() {
  const btn = document.getElementById('sulton_mobile_menu_btn');
  const drawer = document.getElementById('sulton_mobile_drawer');
  const header = document.getElementById('sulton_header');
  if (!btn || !drawer) return;

  const setOpen = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Tutup Menu Tentang dan Kontak' : 'Buka Menu Tentang dan Kontak');
    drawer.classList.toggle('sulton_drawer_open', open);
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
  });

  document.addEventListener('click', (e) => {
    if (header && !header.contains(e.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      setOpen(false);
    }
  });
}

function sultonUpdateNavBadge() {
  const badge = document.getElementById('sulton_nav_badge');
  if (!badge) return;
  const tugasList = sultonGetTugas();
  const cfg = sultonGetPengingat();
  const urgentCount = tugasList.filter((t) => sultonIsMendesak(t, cfg.ambangJam)).length;
  if (urgentCount > 0) {
    badge.style.display = 'inline-flex';
    badge.textContent = String(urgentCount);
  } else {
    badge.style.display = 'none';
  }
}

// ==================== ILUSTRASI EMPTY STATE SVG ====================
function sultonRenderEmptyIllustration(judul, deskripsi, ctaHref, ctaText) {
  const ctaHtml = ctaHref && ctaText
    ? `<a href="${ctaHref}" class="sulton_btn sulton_btn_primary sulton_btn_sm">${sultonEscape(ctaText)}</a>`
    : '';
  return `
    <div class="sulton_empty_illustrated">
      <svg width="118" height="96" viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <ellipse cx="70" cy="98" rx="46" ry="7" fill="#bae6fd" fill-opacity="0.45"/>
        <rect x="34" y="18" width="72" height="68" rx="12" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.4"/>
        <path d="M34 30C34 23.3726 39.3726 18 46 18H94C100.627 18 106 23.3726 106 30V35H34V30Z" fill="#0284c7"/>
        <circle cx="52" cy="14" r="4" fill="#38bdf8"/>
        <circle cx="88" cy="14" r="4" fill="#38bdf8"/>
        <path d="M56 58L66 68L86 48" stroke="#0284c7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="112" cy="26" r="12" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
        <path d="M112 20V26L116 28" stroke="#d97706" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <h3>${sultonEscape(judul)}</h3>
      <p>${sultonEscape(deskripsi)}</p>
      ${ctaHtml}
    </div>
  `;
}

// ==================== HALAMAN 1: BERANDA (index.html) ====================
function sultonInitBeranda() {
  const jadwalList = sultonGetJadwal();
  const tugasList = sultonGetTugas();
  const cfg = sultonGetPengingat();

  const aktifList = tugasList
    .filter((t) => !t.selesai)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const selesaiList = tugasList.filter((t) => t.selesai);
  const mendesakList = aktifList.filter((t) => sultonIsMendesak(t, cfg.ambangJam));
  const unikMatkul = [...new Set(jadwalList.map((j) => j.matkul))];

  // Hero chip & countdown
  const heroChip = document.getElementById('sulton_hero_aktif_chip');
  if (heroChip) heroChip.textContent = `${aktifList.length} Aktif`;

  const cdTask = document.getElementById('sulton_cd_task');
  const cdTime = document.getElementById('sulton_cd_time');
  const cdStatus = document.getElementById('sulton_cd_status');
  const terdekat = aktifList[0];

  if (terdekat && cdTask && cdTime) {
    cdTask.textContent = `${terdekat.judul} (${terdekat.matkul})`;
    const updateCd = () => {
      const diff = new Date(terdekat.deadline).getTime() - Date.now();
      if (diff <= 0) {
        cdTime.textContent = '00 Hari : 00 Jam : 00 Menit : 00 Detik (Lewat Tenggat)';
        if (cdStatus) cdStatus.textContent = 'TERLEWAT';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = (n) => String(n).padStart(2, '0');
      cdTime.textContent = `${pad(d)} Hari : ${pad(h)} Jam : ${pad(m)} Menit : ${pad(s)} Detik`;
      if (cdStatus) cdStatus.textContent = sultonIsMendesak(terdekat, cfg.ambangJam) ? 'MENDESAK' : 'AKTIF';
    };
    updateCd();
    setInterval(updateCd, 1000);
  } else if (cdTask && cdTime) {
    cdTask.textContent = 'Semua tugas sudah selesai dikerjakan!';
    cdTime.textContent = 'Tidak ada tenggat aktif saat ini';
    if (cdStatus) cdStatus.textContent = 'AMAN';
  }

  // Mini antrean di Hero
  const miniList = document.getElementById('sulton_hero_mini_list');
  if (miniList) {
    const nextTwo = aktifList.slice(1, 3);
    if (nextTwo.length === 0) {
      miniList.innerHTML = `<div class="sulton_frame_mini_row"><span class="sulton_frame_mini_sub">Tidak ada antrean tugas tambahan.</span></div>`;
    } else {
      miniList.innerHTML = nextTwo.map((t) => {
        const badgeCls = t.prioritas === 'Tinggi' ? 'sulton_badge_danger' : (t.prioritas === 'Sedang' ? 'sulton_badge_warning' : 'sulton_badge_sky');
        return `
          <div class="sulton_frame_mini_row">
            <div>
              <span class="sulton_frame_mini_title">${sultonEscape(t.judul)}</span>
              <span class="sulton_frame_mini_sub">${sultonEscape(t.matkul)} &bull; ${sultonSisaWaktuTeks(t.deadline)}</span>
            </div>
            <span class="sulton_badge ${badgeCls}">${sultonEscape(t.prioritas)}</span>
          </div>
        `;
      }).join('');
    }
  }

  // Agenda hari ini
  const todayIdx = new Date().getDay();
  const hariIni = SULTON_HARI_LIST[todayIdx];
  const todayLabel = document.getElementById('sulton_today_label');
  const todayContainer = document.getElementById('sulton_today_container');
  const jadwalHariIni = jadwalList
    .filter((j) => j.hari === hariIni)
    .sort((a, b) => a.mulai.localeCompare(b.mulai));

  if (todayLabel) {
    todayLabel.textContent = `Hari ${hariIni}: ditemukan ${jadwalHariIni.length} mata kuliah terjadwal.`;
  }

  if (todayContainer) {
    if (jadwalHariIni.length === 0) {
      todayContainer.innerHTML = sultonRenderEmptyIllustration(
        `Tidak Ada Jadwal Kuliah di Hari ${hariIni}`,
        'Manfaatkan waktu luang hari ini untuk mencicil tugas kuliah atau menyiapkan materi pertemuan berikutnya.',
        'jadwal.html',
        'Lihat Jadwal Mingguan'
      );
    } else {
      todayContainer.innerHTML = `
        <div class="sulton_today_grid">
          ${jadwalHariIni.map((j) => `
            <div class="sulton_today_item">
              <div class="sulton_today_time">${sultonEscape(j.mulai)} - ${sultonEscape(j.selesai)} WIB</div>
              <div class="sulton_today_matkul">${sultonEscape(j.matkul)}</div>
              <div class="sulton_today_ruang">${sultonEscape(j.ruang)}${j.dosen ? ' &bull; ' + sultonEscape(j.dosen) : ''}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  // Statistik & Progress
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  };
  setTxt('sulton_stat_aktif', aktifList.length);
  setTxt('sulton_stat_mendesak', mendesakList.length);
  setTxt('sulton_stat_selesai', selesaiList.length);
  setTxt('sulton_stat_matkul', unikMatkul.length);

  const total = tugasList.length;
  const pct = total === 0 ? 0 : Math.round((selesaiList.length / total) * 100);
  setTxt('sulton_progress_pct', `${pct}% (${selesaiList.length} dari ${total} selesai)`);
  const bar = document.getElementById('sulton_progress_bar');
  if (bar) bar.style.width = `${pct}%`;

  // Preview Tugas Mendekati Tenggat
  const prevTugas = document.getElementById('sulton_preview_tugas');
  if (prevTugas) {
    if (aktifList.length === 0) {
      prevTugas.innerHTML = `<p class="sulton_list_meta">Semua tugas sudah selesai. Klik <a href="tambah-tugas.html" style="color:var(--sulton-sky);font-weight:700;">Tambah Tugas</a> jika ada tugas baru.</p>`;
    } else {
      prevTugas.innerHTML = aktifList.slice(0, 4).map((t) => {
        const badgeCls = t.prioritas === 'Tinggi' ? 'sulton_badge_danger' : (t.prioritas === 'Sedang' ? 'sulton_badge_warning' : 'sulton_badge_sky');
        return `
          <div class="sulton_list_item">
            <div>
              <div class="sulton_list_title">${sultonEscape(t.judul)}</div>
              <div class="sulton_list_meta">${sultonEscape(t.matkul)} &bull; ${sultonSisaWaktuTeks(t.deadline)}</div>
            </div>
            <span class="sulton_badge ${badgeCls}">${sultonEscape(t.prioritas)}</span>
          </div>
        `;
      }).join('');
    }
  }

  // Preview Ringkasan Jadwal
  const prevJadwal = document.getElementById('sulton_preview_jadwal');
  if (prevJadwal) {
    if (jadwalList.length === 0) {
      prevJadwal.innerHTML = `<p class="sulton_list_meta">Belum ada jadwal kuliah tersimpan.</p>`;
    } else {
      prevJadwal.innerHTML = jadwalList.slice(0, 4).map((j) => `
        <div class="sulton_list_item">
          <div>
            <div class="sulton_list_title">${sultonEscape(j.matkul)}</div>
            <div class="sulton_list_meta">${sultonEscape(j.hari)}, ${sultonEscape(j.mulai)} - ${sultonEscape(j.selesai)} &bull; ${sultonEscape(j.ruang)}</div>
          </div>
          <span class="sulton_badge sulton_badge_sky">${sultonEscape(j.hari)}</span>
        </div>
      `).join('');
    }
  }
}

// ==================== HALAMAN 2: JADWAL KULIAH (jadwal.html) ====================
function sultonInitJadwal() {
  const form = document.getElementById('sulton_form_jadwal');
  const container = document.getElementById('sulton_jadwal_container');
  const strip = document.getElementById('sulton_hari_strip');
  const btnCard = document.getElementById('sulton_jview_card');
  const btnTable = document.getElementById('sulton_jview_table');
  const btnBatal = document.getElementById('sulton_btn_batal_jadwal');
  const btnReset = document.getElementById('sulton_btn_reset_demo');
  const formTitle = document.getElementById('sulton_jadwal_form_title');

  let filterHari = 'Semua';
  let viewMode = 'card';

  const resetForm = () => {
    form.reset();
    document.getElementById('sulton_jadwal_id').value = '';
    document.getElementById('sulton_j_mulai').value = '08:00';
    document.getElementById('sulton_j_selesai').value = '10:30';
    if (formTitle) formTitle.textContent = 'Tambah Jadwal Kuliah';
    if (btnBatal) btnBatal.style.display = 'none';
  };

  const render = () => {
    const all = sultonGetJadwal();
    const filtered = (filterHari === 'Semua' ? all : all.filter((j) => j.hari === filterHari))
      .sort((a, b) => {
        const idxA = SULTON_HARI_LIST.indexOf(a.hari);
        const idxB = SULTON_HARI_LIST.indexOf(b.hari);
        return idxA !== idxB ? idxA - idxB : a.mulai.localeCompare(b.mulai);
      });

    if (filtered.length === 0) {
      container.innerHTML = sultonRenderEmptyIllustration(
        filterHari === 'Semua' ? 'Belum Ada Jadwal Kuliah' : `Tidak Ada Kuliah di Hari ${filterHari}`,
        'Tambahkan mata kuliah menggunakan formulir di samping agar jadwal mingguanmu tersusun rapi.',
        null,
        null
      );
      return;
    }

    if (viewMode === 'table') {
      container.innerHTML = `
        <div class="sulton_table_wrap">
          <table class="sulton_table">
            <thead>
              <tr>
                <th>Hari</th>
                <th>Waktu</th>
                <th>Mata Kuliah</th>
                <th>Ruangan</th>
                <th>Dosen</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((j) => `
                <tr>
                  <td><span class="sulton_badge sulton_badge_sky">${sultonEscape(j.hari)}</span></td>
                  <td style="font-family:var(--sulton-font-mono);font-size:0.82rem;">${sultonEscape(j.mulai)} - ${sultonEscape(j.selesai)}</td>
                  <td><strong>${sultonEscape(j.matkul)}</strong></td>
                  <td>${sultonEscape(j.ruang)}</td>
                  <td>${sultonEscape(j.dosen || '-')}</td>
                  <td>
                    <div style="display:flex;gap:6px;">
                      <button type="button" class="sulton_btn sulton_btn_secondary sulton_btn_xs" data-edit-j="${j.id}">Edit</button>
                      <button type="button" class="sulton_btn sulton_btn_danger sulton_btn_xs" data-del-j="${j.id}">Hapus</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="sulton_task_grid">
          ${filtered.map((j) => `
            <div class="sulton_task_card">
              <div>
                <div class="sulton_task_top">
                  <div>
                    <div class="sulton_task_course">${sultonEscape(j.hari)} &bull; ${sultonEscape(j.mulai)} - ${sultonEscape(j.selesai)} WIB</div>
                    <h3 class="sulton_task_title">${sultonEscape(j.matkul)}</h3>
                  </div>
                  <span class="sulton_badge sulton_badge_sky">${sultonEscape(j.ruang)}</span>
                </div>
                <p class="sulton_task_note">${j.dosen ? 'Dosen: ' + sultonEscape(j.dosen) : 'Dosen pengampu belum dicatat'}</p>
              </div>
              <div class="sulton_task_meta">
                <a href="tambah-tugas.html" style="color:var(--sulton-sky);font-weight:700;">+ Catat Tugas MK Ini</a>
                <div class="sulton_task_actions">
                  <button type="button" class="sulton_btn sulton_btn_secondary sulton_btn_xs" data-edit-j="${j.id}">Edit</button>
                  <button type="button" class="sulton_btn sulton_btn_danger sulton_btn_xs" data-del-j="${j.id}">Hapus</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    container.querySelectorAll('[data-edit-j]').forEach((b) => {
      b.addEventListener('click', () => {
        const item = sultonGetJadwal().find((x) => x.id === b.dataset.editJ);
        if (!item) return;
        document.getElementById('sulton_jadwal_id').value = item.id;
        document.getElementById('sulton_j_matkul').value = item.matkul;
        document.getElementById('sulton_j_hari').value = item.hari;
        document.getElementById('sulton_j_mulai').value = item.mulai;
        document.getElementById('sulton_j_selesai').value = item.selesai;
        document.getElementById('sulton_j_ruang').value = item.ruang;
        document.getElementById('sulton_j_dosen').value = item.dosen || '';
        if (formTitle) formTitle.textContent = 'Edit Jadwal Kuliah';
        if (btnBatal) btnBatal.style.display = 'inline-flex';
        form.scrollIntoView({ behavior: 'smooth' });
      });
    });

    container.querySelectorAll('[data-del-j]').forEach((b) => {
      b.addEventListener('click', () => {
        const updated = sultonGetJadwal().filter((x) => x.id !== b.dataset.delJ);
        sultonSaveJadwal(updated);
        render();
        sultonShowToast('Jadwal kuliah berhasil dihapus.');
      });
    });
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('sulton_jadwal_id').value;
      const matkul = document.getElementById('sulton_j_matkul').value.trim();
      const hari = document.getElementById('sulton_j_hari').value;
      const mulai = document.getElementById('sulton_j_mulai').value;
      const selesai = document.getElementById('sulton_j_selesai').value;
      const ruang = document.getElementById('sulton_j_ruang').value.trim();
      const dosen = document.getElementById('sulton_j_dosen').value.trim();

      if (selesai <= mulai) {
        sultonShowToast('Jam selesai harus lebih akhir dari jam mulai.');
        return;
      }

      const list = sultonGetJadwal();
      if (id) {
        const idx = list.findIndex((x) => x.id === id);
        if (idx !== -1) list[idx] = { id, matkul, hari, mulai, selesai, ruang, dosen };
        sultonShowToast('Perubahan jadwal berhasil disimpan.');
      } else {
        list.push({ id: 'j' + Date.now(), matkul, hari, mulai, selesai, ruang, dosen });
        sultonShowToast('Jadwal kuliah baru berhasil ditambahkan.');
      }
      sultonSaveJadwal(list);
      resetForm();
      render();
    });
  }

  if (btnBatal) btnBatal.addEventListener('click', resetForm);

  if (strip) {
    strip.querySelectorAll('[data-hari]').forEach((btn) => {
      btn.addEventListener('click', () => {
        filterHari = btn.dataset.hari;
        strip.querySelectorAll('[data-hari]').forEach((x) => x.classList.remove('sulton_seg_active'));
        btn.classList.add('sulton_seg_active');
        render();
      });
    });
  }

  if (btnCard && btnTable) {
    btnCard.addEventListener('click', () => {
      viewMode = 'card';
      btnCard.classList.add('sulton_seg_active');
      btnTable.classList.remove('sulton_seg_active');
      render();
    });
    btnTable.addEventListener('click', () => {
      viewMode = 'table';
      btnTable.classList.add('sulton_seg_active');
      btnCard.classList.remove('sulton_seg_active');
      render();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      sultonSaveJadwal(sultonBuatSeedJadwal());
      sultonSaveTugas(sultonBuatSeedTugas());
      sultonUpdateNavBadge();
      render();
      sultonShowToast('Data contoh jadwal & tugas berhasil dipulihkan.');
    });
  }

  render();
}

// ==================== HALAMAN 3: TAMBAH TUGAS (tambah-tugas.html) ====================
function sultonInitTambahTugas() {
  const form = document.getElementById('sulton_form_tugas');
  const selMatkul = document.getElementById('sulton_t_matkul');
  const inpJudul = document.getElementById('sulton_t_judul');
  const inpDeadline = document.getElementById('sulton_t_deadline');
  const selPrio = document.getElementById('sulton_t_prioritas');
  const inpCatatan = document.getElementById('sulton_t_catatan');
  const previewBox = document.getElementById('sulton_live_preview_tugas');

  // Isi dropdown mata kuliah dari jadwal
  const jadwalList = sultonGetJadwal();
  const matkulUnik = [...new Set(jadwalList.map((j) => j.matkul))];
  if (matkulUnik.length === 0) {
    matkulUnik.push('Pemrograman Web', 'Basis Data', 'Umum');
  }
  selMatkul.innerHTML = matkulUnik.map((m) => `<option value="${sultonEscape(m)}">${sultonEscape(m)}</option>`).join('');

  // Default deadline besok 23:59
  const setPresetDeadline = (jam) => {
    const d = new Date(Date.now() + jam * 3600000);
    d.setHours(23, 59, 0, 0);
    const pad = (n) => String(n).padStart(2, '0');
    inpDeadline.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T23:59`;
  };
  setPresetDeadline(24);

  const renderPreview = () => {
    if (!previewBox) return;
    const mk = selMatkul.value || 'Mata Kuliah';
    const jdl = inpJudul.value.trim() || 'Judul Tugas Kuliah Akan Tampil di Sini';
    const dl = inpDeadline.value;
    const prio = selPrio.value;
    const cat = inpCatatan.value.trim() || 'Catatan atau instruksi pengerjaan tugas.';
    const prioCls = prio === 'Tinggi' ? 'sulton_prio_tinggi' : (prio === 'Sedang' ? 'sulton_prio_sedang' : 'sulton_prio_rendah');
    const badgeCls = prio === 'Tinggi' ? 'sulton_badge_danger' : (prio === 'Sedang' ? 'sulton_badge_warning' : 'sulton_badge_sky');

    previewBox.innerHTML = `
      <div class="sulton_task_card ${prioCls}">
        <div>
          <div class="sulton_task_top">
            <div>
              <div class="sulton_task_course">${sultonEscape(mk)}</div>
              <h3 class="sulton_task_title">${sultonEscape(jdl)}</h3>
            </div>
            <span class="sulton_badge ${badgeCls}">${sultonEscape(prio)}</span>
          </div>
          <p class="sulton_task_note">${sultonEscape(cat)}</p>
        </div>
        <div class="sulton_task_meta">
          <span>${sultonFormatDeadline(dl)}</span>
          <span class="sulton_badge sulton_badge_sky">${sultonSisaWaktuTeks(dl)}</span>
        </div>
      </div>
    `;
  };

  [selMatkul, inpJudul, inpDeadline, selPrio, inpCatatan].forEach((el) => {
    if (el) el.addEventListener('input', renderPreview);
  });

  document.querySelectorAll('[data-preset-judul]').forEach((btn) => {
    btn.addEventListener('click', () => {
      inpJudul.value = `${btn.dataset.presetJudul} - ${selMatkul.value}`;
      renderPreview();
    });
  });

  document.querySelectorAll('[data-preset-jam]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setPresetDeadline(Number(btn.dataset.presetJam));
      renderPreview();
    });
  });

  const btnReset = document.getElementById('sulton_btn_reset_tugas');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      setTimeout(() => {
        setPresetDeadline(24);
        renderPreview();
      }, 10);
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const list = sultonGetTugas();
      list.push({
        id: 't' + Date.now(),
        matkul: selMatkul.value,
        judul: inpJudul.value.trim(),
        deadline: inpDeadline.value,
        prioritas: selPrio.value,
        catatan: inpCatatan.value.trim(),
        selesai: false,
        dibuatPada: Date.now()
      });
      sultonSaveTugas(list);
      sultonUpdateNavBadge();
      sultonShowToast('Tugas baru berhasil disimpan!');
      setTimeout(() => {
        window.location.href = 'daftar-tugas.html';
      }, 650);
    });
  }

  renderPreview();
}

// ==================== HALAMAN 4: DAFTAR TUGAS (daftar-tugas.html) ====================
function sultonInitDaftarTugas() {
  const container = document.getElementById('sulton_tugas_container');
  const tabs = document.getElementById('sulton_status_tabs');
  const inpSearch = document.getElementById('sulton_search_tugas');
  const selMatkul = document.getElementById('sulton_filter_matkul');
  const selPrio = document.getElementById('sulton_filter_prioritas');
  const selSort = document.getElementById('sulton_sort_tugas');
  const btnCard = document.getElementById('sulton_tview_card');
  const btnTable = document.getElementById('sulton_tview_table');
  const btnHapusSelesai = document.getElementById('sulton_btn_hapus_selesai');

  const modal = document.getElementById('sulton_modal_edit');
  const formEdit = document.getElementById('sulton_form_edit_tugas');

  let activeStatus = 'Semua';
  let viewMode = 'card';

  const populateMatkulOptions = () => {
    const tugasList = sultonGetTugas();
    const jadwalList = sultonGetJadwal();
    const allMk = [...new Set([...jadwalList.map((j) => j.matkul), ...tugasList.map((t) => t.matkul)])];
    if (selMatkul) {
      const cur = selMatkul.value;
      selMatkul.innerHTML = `<option value="Semua">Semua Mata Kuliah</option>` +
        allMk.map((m) => `<option value="${sultonEscape(m)}">${sultonEscape(m)}</option>`).join('');
      if (allMk.includes(cur)) selMatkul.value = cur;
    }
    const editMk = document.getElementById('sulton_edit_matkul');
    if (editMk) {
      editMk.innerHTML = allMk.map((m) => `<option value="${sultonEscape(m)}">${sultonEscape(m)}</option>`).join('');
    }
  };

  const render = () => {
    populateMatkulOptions();
    const all = sultonGetTugas();
    const cfg = sultonGetPengingat();

    const aktifAll = all.filter((t) => !t.selesai);
    const mendesakAll = aktifAll.filter((t) => sultonIsMendesak(t, cfg.ambangJam));
    const selesaiAll = all.filter((t) => t.selesai);

    const setCnt = (id, n) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(n);
    };
    setCnt('sulton_tab_cnt_semua', all.length);
    setCnt('sulton_tab_cnt_aktif', aktifAll.length);
    setCnt('sulton_tab_cnt_mendesak', mendesakAll.length);
    setCnt('sulton_tab_cnt_selesai', selesaiAll.length);

    let list = [...all];
    if (activeStatus === 'Aktif') list = list.filter((t) => !t.selesai);
    if (activeStatus === 'Mendesak') list = list.filter((t) => sultonIsMendesak(t, cfg.ambangJam));
    if (activeStatus === 'Selesai') list = list.filter((t) => t.selesai);

    const q = (inpSearch ? inpSearch.value : '').trim().toLowerCase();
    if (q) {
      list = list.filter((t) =>
        t.judul.toLowerCase().includes(q) ||
        t.matkul.toLowerCase().includes(q) ||
        (t.catatan && t.catatan.toLowerCase().includes(q))
      );
    }

    if (selMatkul && selMatkul.value !== 'Semua') {
      list = list.filter((t) => t.matkul === selMatkul.value);
    }

    if (selPrio && selPrio.value !== 'Semua') {
      list = list.filter((t) => t.prioritas === selPrio.value);
    }

    const sortBy = selSort ? selSort.value : 'deadline';
    const prioRank = { Tinggi: 1, Sedang: 2, Rendah: 3 };
    list.sort((a, b) => {
      if (a.selesai !== b.selesai) return a.selesai ? 1 : -1;
      if (sortBy === 'prioritas') return (prioRank[a.prioritas] || 9) - (prioRank[b.prioritas] || 9);
      if (sortBy === 'terbaru') return (b.dibuatPada || 0) - (a.dibuatPada || 0);
      return new Date(a.deadline) - new Date(b.deadline);
    });

    if (list.length === 0) {
      container.innerHTML = sultonRenderEmptyIllustration(
        'Tidak Ada Tugas Ditemukan',
        'Belum ada tugas pada kategori ini atau kata kunci pencarianmu tidak cocok.',
        'tambah-tugas.html',
        '+ Tambah Tugas Baru'
      );
      return;
    }

    if (viewMode === 'table') {
      container.innerHTML = `
        <div class="sulton_table_wrap">
          <table class="sulton_table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Mata Kuliah</th>
                <th>Judul Tugas</th>
                <th>Deadline</th>
                <th>Prioritas</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${list.map((t) => {
                const mendesak = sultonIsMendesak(t, cfg.ambangJam);
                const statusBadge = t.selesai
                  ? '<span class="sulton_badge sulton_badge_success">Selesai</span>'
                  : (mendesak ? '<span class="sulton_badge sulton_badge_danger">Mendesak</span>' : '<span class="sulton_badge sulton_badge_sky">Aktif</span>');
                const prioBadge = t.prioritas === 'Tinggi' ? 'sulton_badge_danger' : (t.prioritas === 'Sedang' ? 'sulton_badge_warning' : 'sulton_badge_sky');
                return `
                  <tr>
                    <td>${statusBadge}</td>
                    <td><strong>${sultonEscape(t.matkul)}</strong></td>
                    <td style="${t.selesai ? 'text-decoration:line-through;opacity:0.7;' : ''}">${sultonEscape(t.judul)}</td>
                    <td>${sultonFormatDeadline(t.deadline)}<br><small style="color:var(--sulton-ink-muted);">${sultonSisaWaktuTeks(t.deadline)}</small></td>
                    <td><span class="sulton_badge ${prioBadge}">${sultonEscape(t.prioritas)}</span></td>
                    <td>
                      <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        <button type="button" class="sulton_btn ${t.selesai ? 'sulton_btn_secondary' : 'sulton_btn_success'} sulton_btn_xs" data-toggle-t="${t.id}">${t.selesai ? 'Batal Selesai' : 'Selesai'}</button>
                        <button type="button" class="sulton_btn sulton_btn_secondary sulton_btn_xs" data-edit-t="${t.id}">Edit</button>
                        <button type="button" class="sulton_btn sulton_btn_danger sulton_btn_xs" data-del-t="${t.id}">Hapus</button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="sulton_task_grid">
          ${list.map((t) => {
            const mendesak = sultonIsMendesak(t, cfg.ambangJam);
            const prioCls = t.selesai ? 'sulton_task_done' : (t.prioritas === 'Tinggi' ? 'sulton_prio_tinggi' : (t.prioritas === 'Sedang' ? 'sulton_prio_sedang' : 'sulton_prio_rendah'));
            const prioBadge = t.prioritas === 'Tinggi' ? 'sulton_badge_danger' : (t.prioritas === 'Sedang' ? 'sulton_badge_warning' : 'sulton_badge_sky');
            return `
              <div class="sulton_task_card ${prioCls}">
                <div>
                  <div class="sulton_task_top">
                    <div>
                      <div class="sulton_task_course">${sultonEscape(t.matkul)}</div>
                      <h3 class="sulton_task_title">${sultonEscape(t.judul)}</h3>
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;">
                      ${t.selesai ? '<span class="sulton_badge sulton_badge_success">Selesai</span>' : (mendesak ? '<span class="sulton_badge sulton_badge_danger">Mendesak</span>' : '')}
                      <span class="sulton_badge ${prioBadge}">${sultonEscape(t.prioritas)}</span>
                    </div>
                  </div>
                  ${t.catatan ? `<p class="sulton_task_note">${sultonEscape(t.catatan)}</p>` : ''}
                </div>

                <div class="sulton_task_meta">
                  <div>
                    <strong>${sultonFormatDeadline(t.deadline)}</strong>
                    <div style="color:var(--sulton-sky);font-weight:600;">${t.selesai ? 'Tugas telah selesai' : sultonSisaWaktuTeks(t.deadline)}</div>
                  </div>
                  <div class="sulton_task_actions">
                    <button type="button" class="sulton_btn ${t.selesai ? 'sulton_btn_secondary' : 'sulton_btn_success'} sulton_btn_xs" data-toggle-t="${t.id}">
                      ${t.selesai ? 'Buka Lagi' : '&#10003; Selesai'}
                    </button>
                    <button type="button" class="sulton_btn sulton_btn_secondary sulton_btn_xs" data-edit-t="${t.id}">Edit</button>
                    <button type="button" class="sulton_btn sulton_btn_danger sulton_btn_xs" data-del-t="${t.id}">Hapus</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // Bind aksi tombol
    container.querySelectorAll('[data-toggle-t]').forEach((b) => {
      b.addEventListener('click', () => {
        const tasks = sultonGetTugas();
        const item = tasks.find((x) => x.id === b.dataset.toggleT);
        if (!item) return;
        item.selesai = !item.selesai;
        sultonSaveTugas(tasks);
        sultonUpdateNavBadge();
        render();
        sultonShowToast(item.selesai ? 'Tugas ditandai selesai!' : 'Tugas dikembalikan ke daftar aktif.');
      });
    });

    container.querySelectorAll('[data-del-t]').forEach((b) => {
      b.addEventListener('click', () => {
        const updated = sultonGetTugas().filter((x) => x.id !== b.dataset.delT);
        sultonSaveTugas(updated);
        sultonUpdateNavBadge();
        render();
        sultonShowToast('Tugas berhasil dihapus.');
      });
    });

    container.querySelectorAll('[data-edit-t]').forEach((b) => {
      b.addEventListener('click', () => {
        const item = sultonGetTugas().find((x) => x.id === b.dataset.editT);
        if (!item || !modal) return;
        document.getElementById('sulton_edit_id').value = item.id;
        document.getElementById('sulton_edit_matkul').value = item.matkul;
        document.getElementById('sulton_edit_judul').value = item.judul;
        document.getElementById('sulton_edit_deadline').value = item.deadline;
        document.getElementById('sulton_edit_prioritas').value = item.prioritas;
        document.getElementById('sulton_edit_catatan').value = item.catatan || '';
        modal.classList.add('sulton_modal_open');
      });
    });
  };

  if (tabs) {
    tabs.querySelectorAll('[data-status]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeStatus = btn.dataset.status;
        tabs.querySelectorAll('[data-status]').forEach((x) => x.classList.remove('sulton_seg_active'));
        btn.classList.add('sulton_seg_active');
        render();
      });
    });
  }

  [inpSearch, selMatkul, selPrio, selSort].forEach((el) => {
    if (el) el.addEventListener('input', render);
  });

  if (btnCard && btnTable) {
    btnCard.addEventListener('click', () => {
      viewMode = 'card';
      btnCard.classList.add('sulton_seg_active');
      btnTable.classList.remove('sulton_seg_active');
      render();
    });
    btnTable.addEventListener('click', () => {
      viewMode = 'table';
      btnTable.classList.add('sulton_seg_active');
      btnCard.classList.remove('sulton_seg_active');
      render();
    });
  }

  if (btnHapusSelesai) {
    btnHapusSelesai.addEventListener('click', () => {
      const remaining = sultonGetTugas().filter((t) => !t.selesai);
      sultonSaveTugas(remaining);
      sultonUpdateNavBadge();
      render();
      sultonShowToast('Seluruh tugas yang sudah selesai berhasil dibersihkan.');
    });
  }

  const closeModal = () => modal && modal.classList.remove('sulton_modal_open');
  const btnClose = document.getElementById('sulton_btn_close_modal');
  const btnBatalModal = document.getElementById('sulton_btn_batal_modal');
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnBatalModal) btnBatalModal.addEventListener('click', closeModal);

  if (formEdit) {
    formEdit.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('sulton_edit_id').value;
      const tasks = sultonGetTugas();
      const idx = tasks.findIndex((x) => x.id === id);
      if (idx !== -1) {
        tasks[idx].matkul = document.getElementById('sulton_edit_matkul').value;
        tasks[idx].judul = document.getElementById('sulton_edit_judul').value.trim();
        tasks[idx].deadline = document.getElementById('sulton_edit_deadline').value;
        tasks[idx].prioritas = document.getElementById('sulton_edit_prioritas').value;
        tasks[idx].catatan = document.getElementById('sulton_edit_catatan').value.trim();
        sultonSaveTugas(tasks);
        sultonUpdateNavBadge();
        render();
        sultonShowToast('Perubahan tugas berhasil disimpan.');
      }
      closeModal();
    });
  }

  render();
}

// ==================== HALAMAN 5: PENGINGAT (pengingat.html) ====================
function sultonInitPengingat() {
  const form = document.getElementById('sulton_form_pengingat');
  const selAmbang = document.getElementById('sulton_p_ambang');
  const chkSuara = document.getElementById('sulton_p_suara');
  const btnTest = document.getElementById('sulton_btn_test_chime');
  const urgentContainer = document.getElementById('sulton_urgent_container');
  const urgentBadge = document.getElementById('sulton_urgent_count_badge');
  const logContainer = document.getElementById('sulton_reminder_log_container');

  const cfg = sultonGetPengingat();
  if (selAmbang) selAmbang.value = String(cfg.ambangJam);
  if (chkSuara) chkSuara.checked = Boolean(cfg.suaraAktif);

  const renderStatus = () => {
    const curCfg = sultonGetPengingat();
    const tasks = sultonGetTugas().sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    const urgents = tasks.filter((t) => sultonIsMendesak(t, curCfg.ambangJam));

    if (urgentBadge) urgentBadge.textContent = `${urgents.length} Mendesak`;

    if (urgentContainer) {
      if (urgents.length === 0) {
        urgentContainer.innerHTML = `
          <div style="text-align:center;padding:20px 10px;">
            <span class="sulton_badge sulton_badge_success" style="margin-bottom:8px;">Semua Aman</span>
            <p class="sulton_list_meta">Tidak ada tugas aktif yang masuk dalam batas H-${curCfg.ambangJam} jam saat ini.</p>
          </div>
        `;
      } else {
        urgentContainer.innerHTML = urgents.map((t) => `
          <div class="sulton_list_item">
            <div>
              <div class="sulton_list_title">${sultonEscape(t.judul)}</div>
              <div class="sulton_list_meta">${sultonEscape(t.matkul)} &bull; ${sultonSisaWaktuTeks(t.deadline)}</div>
            </div>
            <span class="sulton_badge sulton_badge_danger">Mendesak</span>
          </div>
        `).join('');
      }
    }

    if (logContainer) {
      if (tasks.length === 0) {
        logContainer.innerHTML = sultonRenderEmptyIllustration(
          'Belum Ada Tugas untuk Dipantau',
          'Tambahkan tugas kuliah agar sistem dapat menghitung status pengingat secara otomatis.',
          'tambah-tugas.html',
          '+ Tambah Tugas Baru'
        );
      } else {
        logContainer.innerHTML = `
          <div class="sulton_table_wrap">
            <table class="sulton_table">
              <thead>
                <tr>
                  <th>Mata Kuliah</th>
                  <th>Judul Tugas</th>
                  <th>Batas Waktu</th>
                  <th>Sisa Waktu</th>
                  <th>Status Pengingat (H-${curCfg.ambangJam} Jam)</th>
                </tr>
              </thead>
              <tbody>
                ${tasks.map((t) => {
                  const mendesak = sultonIsMendesak(t, curCfg.ambangJam);
                  const st = t.selesai
                    ? '<span class="sulton_badge sulton_badge_success">Selesai</span>'
                    : (mendesak ? '<span class="sulton_badge sulton_badge_danger">Peringatan Aktif</span>' : '<span class="sulton_badge sulton_badge_sky">Terjadwal Aman</span>');
                  return `
                    <tr>
                      <td><strong>${sultonEscape(t.matkul)}</strong></td>
                      <td>${sultonEscape(t.judul)}</td>
                      <td>${sultonFormatDeadline(t.deadline)}</td>
                      <td>${t.selesai ? '-' : sultonSisaWaktuTeks(t.deadline)}</td>
                      <td>${st}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
    }
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ambangJam = Number(selAmbang.value) || 24;
      const suaraAktif = Boolean(chkSuara.checked);
      sultonSavePengingat({ ambangJam, suaraAktif });
      sultonUpdateNavBadge();
      renderStatus();
      if (suaraAktif) sultonPlayChime();
      sultonShowToast(`Ambang peringatan disimpan: H-${ambangJam} Jam.`);
    });
  }

  if (btnTest) {
    btnTest.addEventListener('click', () => {
      sultonPlayChime();
      sultonShowToast('Simulasi nada pengingat YouRemind diputar!');
    });
  }

  renderStatus();
}

// ==================== INISIALISASI GLOBAL ====================
document.addEventListener('DOMContentLoaded', () => {
  sultonInitTheme();
  sultonInitMobileMenu();
  sultonUpdateNavBadge();

  const page = document.body.getAttribute('data-page');
  if (page === 'index.html') sultonInitBeranda();
  if (page === 'jadwal.html') sultonInitJadwal();
  if (page === 'tambah-tugas.html') sultonInitTambahTugas();
  if (page === 'daftar-tugas.html') sultonInitDaftarTugas();
  if (page === 'pengingat.html') sultonInitPengingat();
});