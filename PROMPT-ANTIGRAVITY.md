# Prompt untuk Google Antigravity — Cendekia PPLG Studio

Salin seluruh isi di bawah ini sebagai prompt pertama ke agent Antigravity kamu (pastikan `DESIGN.md` sudah ada di root project sebelum menjalankan ini, karena Antigravity akan membacanya otomatis).

---

## 1. Ringkasan Proyek

Bangun aplikasi web pembelajaran bernama **Cendekia PPLG Studio** — platform belajar dan latihan soal untuk siswa SMK jurusan PPLG (Pengembangan Perangkat Lunak dan Gim) yang sedang mempersiapkan diri untuk TKA (Tes Kemampuan Akademik). Soal dan pembahasan dibuat secara dinamis menggunakan AI, mengikuti kisi-kisi resmi Kemendikdasmen untuk mapel PPLG.

Ikuti `DESIGN.md` di root project untuk seluruh warna, tipografi, spacing, radius, shadow, dan pola komponen. Jangan gunakan warna atau font di luar yang didefinisikan di sana. Style keseluruhan: modern, elegan, akademik-minimalis, tenang, tidak gamified, cocok untuk sesi belajar dan ujian yang membutuhkan fokus tinggi.

Aplikasi punya **dua mode utama**:
1. **Latihan bebas** — belajar santai per topik, tanpa timer, pembahasan AI muncul langsung setelah tiap soal dijawab.
2. **Simulasi TKA** — ujian terstruktur: 30 soal, 50 menit, hasil dan pembahasan baru muncul di akhir, skor dihitung dengan pendekatan IRT (skala 200–800).

## 2. Tech Stack yang Disarankan

Gunakan stack berikut kecuali kamu punya rekomendasi lebih baik untuk kebutuhan ini (jelaskan alasannya jika berbeda):
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **State management:** React Context/hooks untuk state lokal ujian (timer, jawaban, navigasi soal)
- **Backend/DB:** Supabase (Postgres + Auth) — atau alternatif setara jika lebih sesuai
- **AI generation:** panggilan ke Claude API (model `claude-sonnet-4-6`) via endpoint `/v1/messages`, dipanggil dari server-side route (bukan client-side, agar API key aman) untuk generate soal dan pembahasan
- **Charting:** Recharts untuk grafik skor & progres

## 3. Alur Aplikasi (User Flow)

### 3.1 Alur Akses Awal
1. **Login/Registrasi** — siswa membuat akun atau login dengan email & password.
2. **Dashboard** — menampilkan: sapaan nama siswa, skor IRT terakhir (skala 200–800) dengan grafik tren kecil, progress bar penguasaan per sub-topik, riwayat percobaan sebelumnya, dan dua kartu pintu masuk besar: "Latihan Bebas" dan "Simulasi TKA".
3. **Pilih topik/kisi-kisi** — sebelum latihan bebas dimulai, siswa memilih sub-topik PPLG yang ingin dipelajari (lihat daftar topik di bagian 6).

### 3.2 Alur Mode Latihan Bebas
1. Siswa memilih sub-topik dari grid kartu topik.
2. Sistem memanggil AI untuk generate **satu soal** sesuai topik dan level kesulitan yang dipilih (atau acak jika tidak dipilih).
3. Soal ditampilkan satu per satu, tanpa timer. Tag kesulitan (mudah/sedang/sulit) tampil sebagai badge di soal.
4. Siswa menjawab (pilihan ganda biasa atau kompleks — lihat bagian 5), klik "Cek Jawaban".
5. Panel pembahasan AI langsung muncul di bawah soal (expand animation halus), berlabel "Dijelaskan oleh AI", menjelaskan kenapa jawaban benar/salah, termasuk highlight konsep atau syntax jika relevan.
6. Tombol "Soal Berikutnya" memanggil AI generate soal baru pada topik yang sama.
7. Siswa bisa keluar kapan saja kembali ke dashboard; progres topik (jumlah soal dikerjakan, akurasi) tersimpan otomatis.

### 3.3 Alur Mode Simulasi TKA
1. **Halaman info pra-ujian** — menampilkan aturan: 30 soal, 50 menit, campuran tipe soal, distribusi kesulitan, tombol "Mulai Ujian" dengan modal konfirmasi.
2. Saat "Mulai Ujian" dikonfirmasi, sistem memanggil AI untuk generate **30 soal sekaligus** sesuai distribusi kesulitan (lihat bagian 6), lalu memulai timer 50 menit.
3. **Halaman ujian**:
   - Top bar: countdown timer (format MM:SS, berubah merah di bawah 5 menit) dan indikator progres ("Soal 12 dari 30").
   - Sidebar navigator soal (grid 5 kolom desktop, drawer di tablet, bottom sheet di mobile): tiap nomor soal berwarna sesuai status (terjawab/belum/ditandai ragu-ragu), soal aktif diberi outline khusus.
   - Panel utama: satu soal ditampilkan dengan badge kesulitan, teks stem, dan pilihan jawaban (radio untuk PG biasa, checkbox untuk PG kompleks).
   - Navigasi bawah: "Sebelumnya", "Ragu-ragu" (flag/toggle), "Selanjutnya", "Selesai Ujian".
   - **Tidak ada pembahasan yang tampil selama mode ini berlangsung.**
4. Saat siswa klik "Selesai Ujian" (atau waktu habis — auto-submit), muncul modal konfirmasi menampilkan jumlah soal terjawab vs belum terjawab (khusus klik manual; auto-submit langsung submit tanpa modal).
5. Sistem menghitung skor IRT (lihat bagian 7), menyimpan hasil ke database.
6. **Halaman hasil**: skor IRT ditampilkan besar dengan gauge/arc chart, breakdown akurasi per level kesulitan, breakdown per sub-topik, tombol "Lihat Pembahasan".
7. **Halaman pembahasan**: daftar 30 soal (expandable/collapsible), tiap soal menampilkan jawaban siswa, jawaban benar, indikator benar/salah, dan pembahasan AI dalam callout khusus.

### 3.4 Alur Riwayat & Progres
- Halaman terpisah menampilkan grafik skor IRT dari waktu ke waktu (multi-attempt), serta level penguasaan per sub-topik (dari data latihan bebas): "Dikuasai" / "Perlu Diulang" / "Belum Dicoba".

## 4. Fungsi-Fungsi Utama (Functional Requirements)

1. **Autentikasi** — signup, login, logout, proteksi rute (redirect ke login jika belum autentikasi).
2. **Generate soal via AI**:
   - Endpoint server-side yang menerima parameter: topik, level kesulitan, tipe soal (PG biasa/kompleks).
   - Prompt ke AI harus secara eksplisit meminta output terstruktur JSON (stem soal, opsi jawaban dengan key A/B/C/D/E, jawaban benar — array untuk PG kompleks, penjelasan pembahasan, level kesulitan, sub-topik).
   - Validasi hasil JSON sebelum ditampilkan (jangan tampilkan mentah-mentah jika parsing gagal — retry generate).
3. **Timer ujian** — countdown akurat 50 menit dari saat soal pertama sukses digenerate, auto-submit saat mencapai 0, warning visual di 5 menit terakhir (top bar berubah merah, opsional toast peringatan).
4. **Navigator soal** — update real-time saat siswa menjawab/menandai ragu-ragu/pindah soal, mendukung lompat langsung ke nomor soal manapun.
5. **Dua tipe jawaban**:
   - PG biasa: radio button, satu jawaban benar.
   - PG kompleks: checkbox, label eksplisit "Pilih lebih dari satu jawaban yang benar", validasi jawaban benar jika seluruh opsi yang dicentang siswa cocok persis dengan kunci jawaban (partial credit opsional, sebutkan asumsi yang dipakai).
6. **Perhitungan skor IRT** — lihat detail di bagian 7, hasil disimpan bersama breakdown per soal.
7. **Penyimpanan riwayat** — setiap attempt (baik latihan bebas maupun simulasi) tersimpan di database dengan timestamp, topik, jawaban, skor, durasi pengerjaan.
8. **Progress tracking per topik** — dihitung dari akurasi jawaban di mode latihan bebas, ditampilkan sebagai persentase penguasaan.
9. **Dark mode** — toggle di pengaturan, mengikuti token warna dark mode dari `DESIGN.md` (jika belum ada varian dark di file itu, buat secara konsisten dengan prinsip yang sama).
10. **Responsive** — desktop dual-pane (70/30), tablet drawer navigator, mobile bottom sheet navigator, sesuai breakpoint yang sudah didefinisikan di `DESIGN.md`.

## 5. Struktur Data Soal

Setiap soal yang digenerate AI harus mengikuti struktur berikut (gunakan sebagai skema TypeScript/JSON):

```
{
  "id": "string (uuid)",
  "topic": "string (sub-topik PPLG)",
  "difficulty": "mudah | sedang | sulit",
  "type": "single | multiple",
  "stem": "string (teks soal, bisa mengandung code block)",
  "options": [
    { "key": "A", "text": "string" },
    { "key": "B", "text": "string" },
    { "key": "C", "text": "string" },
    { "key": "D", "text": "string" }
  ],
  "correctAnswer": ["A"]  // array walau single, agar konsisten dengan tipe "multiple"
  "explanation": "string (pembahasan AI, boleh markdown untuk code block)"
}
```

## 6. Cakupan Topik PPLG (Sub-topik untuk Generate Soal)

Gunakan daftar sub-topik berikut sebagai default kisi-kisi (silakan sesuaikan/tambahkan bila ada daftar resmi dari Kemendikdasmen yang lebih spesifik):
- Pemrograman Dasar (struktur data, algoritma, logika pemrograman)
- Pemrograman Web (HTML/CSS/JavaScript, framework dasar)
- Basis Data (SQL, normalisasi, ERD)
- Pemrograman Berorientasi Objek
- Pengembangan Aplikasi Mobile
- Pengembangan Gim (game design dasar, engine, scripting gim)
- Jaringan Komputer Dasar
- Keamanan Siber Dasar

**Distribusi soal simulasi TKA (total 30 soal):**
- Sebar merata ke seluruh sub-topik di atas (proporsi bisa disesuaikan sesuai bobot resmi jika ada).
- Distribusi kesulitan yang disarankan: 30% mudah (~9 soal), 40% sedang (~12 soal), 30% sulit (~9 soal).
- Campuran tipe soal: mayoritas PG biasa, sisipkan 20–30% PG kompleks tersebar di semua level kesulitan.

## 7. Logika Perhitungan Skor IRT (200–800)

Implementasikan pendekatan IRT sederhana (1-parameter/Rasch atau 2-parameter jika memungkinkan) dengan tahapan berikut:

1. Setiap soal punya parameter kesulitan (`b`) yang dipetakan dari label mudah/sedang/sulit ke nilai numerik, misalnya: mudah = -1, sedang = 0, sulit = +1 (skala logit).
2. Estimasi kemampuan siswa (`theta`) menggunakan Maximum Likelihood Estimation (MLE) sederhana berdasarkan pola jawaban benar/salah terhadap parameter kesulitan tiap soal — atau sebagai pendekatan awal, gunakan rumus weighted-scoring berbasis kesulitan (soal sulit yang dijawab benar bernilai lebih tinggi dari soal mudah).
3. Konversi `theta` (biasanya berskala -3 hingga +3 dalam logit) ke skala akhir 200–800 dengan rumus linear:
   ```
   skorAkhir = 500 + (theta * 100)
   ```
   Sesuaikan konstanta ini agar median berada di sekitar 500 dan rentang realistis 200–800.
4. Simpan juga breakdown akurasi per level kesulitan dan per topik untuk ditampilkan di halaman hasil.
5. Jelaskan di komentar kode bahwa ini adalah pendekatan IRT yang disederhanakan untuk konteks aplikasi latihan, bukan kalibrasi psikometrik resmi — beri catatan agar mudah diaudit atau disempurnakan nanti.

## 8. Model Data (Database Schema)

Rancang skema database minimal berikut:
- `users` (id, name, email, password_hash, created_at)
- `attempts` (id, user_id, mode [`practice` | `simulation`], started_at, finished_at, score_irt, status)
- `attempt_questions` (id, attempt_id, question_json, student_answer, is_correct, difficulty, topic, order_index)
- `topic_progress` (id, user_id, topic, total_answered, total_correct, mastery_level)

## 9. Non-Fungsional & Kualitas Kode

- Ikuti seluruh token dan komponen dari `DESIGN.md` secara ketat — jangan improvisasi warna baru.

### 9.1 Aturan Wajib Penegakan Design Token (baca sebelum mulai coding)

Ini poin paling penting untuk mencegah hasil UI melenceng dari `DESIGN.md`:

1. **Wiring token di satu tempat dulu.** Sebelum bangun screen apapun, tulis seluruh token warna/tipografi/radius/spacing dari `DESIGN.md` sebagai CSS variable atau `theme.extend` di `tailwind.config` — satu kali, satu sumber. Jangan biarkan tiap komponen menebak sendiri.
2. **Dilarang keras hardcode hex/nilai mentah di dalam komponen.** Setiap warna, ukuran font, radius, dan spacing yang dipakai di mana pun harus merujuk nama token (`primary`, `success-container`, `space-md`, `rounded-lg`), bukan angka/hex literal yang diketik langsung.
3. Kalau ada kebutuhan visual yang belum ada tokennya di `DESIGN.md`, **berhenti dan tambahkan token itu ke `DESIGN.md` dulu** (dengan format yang sama seperti token lain), baru dipakai — jangan bikin nilai one-off di komponen.
4. **Setelah membangun atau mengedit screen apapun, ambil screenshot via built-in browser Antigravity, lalu cocokkan secara eksplisit dengan tabel token di `DESIGN.md`.** Sebagai bagian dari laporan penyelesaian task, sebutkan token mana yang dipakai untuk elemen visual utama (background, tombol utama, badge, border) — bukan cuma bilang "sudah selesai".
5. Kalau saya minta perbaikan visual di kemudian hari, jangan langsung menambal tampilan — cek dulu apakah root cause-nya ada di langkah 1-3 (token belum di-wiring dengan benar / masih ada hardcode), perbaiki dari situ, baru re-render screen yang terdampak.
- Gunakan komponen React yang reusable (`QuestionCard`, `AnswerOption`, `Timer`, `NavigatorGrid`, `AIExplanationCard`, `ScoreGauge`, `DifficultyBadge`).
- Tangani error dengan baik: jika AI gagal generate soal (timeout/JSON invalid), tampilkan state error yang elegan dengan tombol "Coba Lagi", jangan biarkan halaman kosong/crash.
- Tambahkan loading state yang jelas (skeleton loader) saat AI sedang generate soal, terutama saat generate 30 soal sekaligus untuk simulasi (bisa ditampilkan sebagai progress "Menyiapkan soal 15 dari 30...").
- Pastikan aksesibilitas dasar: kontras warna sesuai `DESIGN.md`, elemen interaktif bisa diakses keyboard, label ARIA pada navigator soal dan timer.

## 10. Urutan Pengerjaan yang Disarankan

Bangun secara bertahap, dan tunjukkan hasil tiap tahap sebelum lanjut:
1. Setup project + integrasi `DESIGN.md` sebagai design token (Tailwind config/CSS variables).
2. Halaman Login & Dashboard (dengan data dummy dulu jika backend belum siap).
3. Mode Latihan Bebas end-to-end (termasuk pemanggilan AI generate soal + pembahasan instan).
4. Mode Simulasi TKA end-to-end (generate 30 soal, timer, navigator, submit).
5. Perhitungan skor IRT + halaman hasil & pembahasan.
6. Halaman riwayat & progres dengan grafik.
7. Polish: dark mode, responsive check di 3 breakpoint, error handling, loading states.

---

Setelah membaca prompt ini, buatkan rencana implementasi (plan) terlebih dahulu sebelum mulai coding, supaya saya bisa review urutan kerja dan asumsi yang kamu ambil (terutama soal rumus IRT dan daftar topik) sebelum eksekusi penuh dimulai.
