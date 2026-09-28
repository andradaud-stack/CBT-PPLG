# 📱 CBT-PPLG Mobile: Arsitektur & Desain Sistem Flutter

Dokumen spesifikasi teknis dan panduan migrasi dari web **CBT-PPLG** (Next.js 14) ke aplikasi mobile **Flutter** (Android & iOS).

---

## 📑 Daftar Isi
1. [Ringkasan & Filosofi Desain](#1-ringkasan--filosofi-desain)
2. [Design Tokens & Sistem Tema Flutter](#2-design-tokens--sistem-tema-flutter)
3. [Arsitektur Aplikasi & State Management](#3-arsitektur-aplikasi--state-management)
4. [Daftar Layar & Spesifikasi UI/UX](#4-daftar-layar--spesifikasi-uiux)
5. [Skema Data & Strategi Offline-First](#5-skema-data--strategi-offline-first)
6. [Integrasi Backend API](#6-integrasi-backend-api)
7. [Fitur Keamanan Ujian (Anti-Curang / Kiosk)](#7-fitur-keamanan-ujian-anti-curang--kiosk)
8. [Spesifikasi `pubspec.yaml`](#8-spesifikasi-pubspecyaml)
9. [Prompt Generator Migrasi ke Flutter](#9-prompt-generator-migrasi-ke-flutter)

---

## 1. Ringkasan & Filosofi Desain

CBT-PPLG Mobile adalah aplikasi belajar mandiri dan simulasi ujian kejuruan berstandar **Kurikulum Kemendikdasmen RI** untuk siswa SMK program keahlian Pengembangan Perangkat Lunak dan Gim (PPLG).

### Prinsip Utama:
- **Offline-First**: Seluruh bank soal, simulasi CBT, rumus IRT, dan riwayat belajar dapat berjalan 100% tanpa internet. Sinkronisasi ke cloud berjalan otomatis di latar belakang saat online.
- **Konsistensi Visual (Material 3 + Indigo Studio)**: Mengikuti estetika web CBT-PPLG dengan warna dasar Indigo `#4338CA`, permukaan modern, dan micro-interactions yang halus.
- **Fokus Ujian Nyaman & Aman**: Layar ujian bebas distraksi dengan dukungan anti-screenshot dan deteksi keluar aplikasi.

---

## 2. Design Tokens & Sistem Tema Flutter

### A. Palet Warna (Color Palette)

```dart
import 'package:flutter/material.dart';

class AppColors {
  // Brand Primary
  static const Color primary = Color(0xFF4338CA);
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color primaryContainer = Color(0xFF3730A3);
  static const Color onPrimaryContainer = Color(0xFFC1BEFF);

  // Surface & Canvas (Light)
  static const Color surfaceLight = Color(0xFFFAFAFB);
  static const Color surfaceContainerLowestLight = Color(0xFFFFFFFF);
  static const Color surfaceContainerLowLight = Color(0xFFF8FAFC);
  static const Color surfaceContainerLight = Color(0xFFF1F5F9);
  static const Color onSurfaceLight = Color(0xFF0F172A);
  static const Color onSurfaceVariantLight = Color(0xFF464554);
  static const Color outlineLight = Color(0xFFE2E8F0);

  // Surface & Canvas (Dark)
  static const Color surfaceDark = Color(0xFF0B132B);
  static const Color surfaceContainerLowestDark = Color(0xFF111C44);
  static const Color surfaceContainerLowDark = Color(0xFF162354);
  static const Color surfaceContainerDark = Color(0xFF1B2A6B);
  static const Color onSurfaceDark = Color(0xFFF8FAFC);
  static const Color onSurfaceVariantDark = Color(0xFF94A3B8);
  static const Color outlineDark = Color(0xFF1E293B);

  // Tertiary / AI Studio
  static const Color tertiary = Color(0xFF6366F1);
  static const Color tertiaryContainer = Color(0xFFEEF2FF);
  static const Color onTertiaryContainer = Color(0xFF3730A3);

  // Semantic Feedback
  static const Color success = Color(0xFF10B981);
  static const Color successContainer = Color(0xFFECFDF5);
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningContainer = Color(0xFFFFFBEB);
  static const Color error = Color(0xFFEF4444);
  static const Color errorContainer = Color(0xFFFEF2F2);
}
```

### B. Tipografi
- **Headings & Body**: `GoogleFonts.poppins()`
- **Code / Monospace / Token**: `GoogleFonts.jetbrainsMono()`

---

## 3. Arsitektur Aplikasi & State Management

Direkomendasikan menggunakan arsitektur **Feature-First / Clean Architecture** dengan **Riverpod** atau **Bloc**:

```
lib/
├── core/
│   ├── constants/
│   ├── network/ (Dio client, interceptors, offline detector)
│   ├── theme/ (AppColors, AppTheme)
│   └── utils/ (IRT calculation, date formatters)
├── data/
│   ├── datasources/
│   │   ├── local/ (Hive / SQLite database)
│   │   └── remote/ (Vercel API endpoints)
│   ├── models/ (QuestionModel, AttemptModel, UserModel, ChatSessionModel)
│   └── repositories/
├── domain/
│   ├── entities/
│   └── repositories/
├── presentation/
│   ├── providers/ / blocs/
│   ├── widgets/ (AppButton, AppCard, ScoreGaugeWidget, CodeViewerWidget)
│   └── screens/
│       ├── auth/ (LoginScreen, RegisterScreen)
│       ├── main_nav/ (MainShellScreen)
│       ├── dashboard/ (DashboardScreen)
│       ├── practice/ (PracticeScreen, PracticeSessionScreen)
│       ├── simulation/ (SimulationScreen, SimulationResultScreen)
│       ├── remedial/ (RemedialScreen)
│       ├── ai_tutor/ (AiTutorScreen, ChatSessionDrawer)
│       ├── history/ (HistoryScreen)
│       ├── leaderboard/ (LeaderboardScreen)
│       └── profile/ (ProfileScreen)
└── main.dart
```

---

## 4. Daftar Layar & Spesifikasi UI/UX

### 1. Splash & Auth (Login & Register)
- **Visual**: Ilustrasi logo CBT-PPLG gradient, input email dan password dengan **fitur intip kata sandi (toggle eye visibility)**.
- **Offline Auth**: Jika perangkat offline, user tetap bisa login menggunakan kredensial yang pernah tersimpan di cache lokal.

### 2. Main Navigation Shell
- **Tampilan Mobile**: Bottom Navigation Bar (`Dashboard`, `Latihan`, `Simulasi`, `AI Tutor`, `Profil`).
- **Tampilan Tablet/Landscape**: Collapsible Navigation Rail di samping kiri.

### 3. Dashboard
- **Komponen Utama**:
  - Banner sapaan siswa + badge streak harian 🔥.
  - Kartu target skor IRT (Target Gauge & persentase tercapai).
  - Quick action: Mulai Simulasi Cepat & Bank Remedial.
  - Ringkasan riwayat 3 ujian terakhir.

### 4. Latihan Bebas (Practice Mode)
- Filter topik (Pemrograman Dasar, OOP, Basis Data, Jaringan, K3LH).
- Filter tingkat kesulitan (Mudah, Sedang, Sulit).
- Tampilan interaktif: pilihan ganda, umpan balik langsung (hijau jika benar, merah jika salah), beserta **kotak pembahasan kurikulum komprehensif**.

### 5. Simulasi CBT TKA (Exam Mode)
- **Timer Countdown**: Berjalan secara akurat di latar belakang.
- **Lembar Soal**: Navigasi soal grid (1–40), tombol "Ragu-ragu / Tandai", prev/next.
- **Kalkulasi IRT (Item Response Theory)**:
  - Skor dihitung secara otomatis dengan bobot kesulitan soal (Mudah: 1.0, Sedang: 1.5, Sulit: 2.2).
- **Anti-Cheat (Opsional)**: Peringatan jika siswa keluar dari aplikasi / minimize layar saat ujian berjalan.

### 6. Bank Remedial
- Antrian soal yang pernah dijawab salah oleh siswa.
- Menggunakan konsep *Spaced Repetition*: Soal yang berhasil dijawab benar 2 kali berturut-turut akan lulus dari antrian remedial.

### 7. AI Tutor Studio (ChatGPT-Style)
- **Drawer Riwayat Sesi**:
  - Tombol `+ Obrolan Baru`.
  - Riwayat percakapan dikelompokkan (*Hari Ini*, *Kemarin*, *7 Hari Terakhir*).
  - Rename dan delete sesi.
- **Chat Stream**:
  - Bubble chat siswa & AI.
  - Markdown rendering (teks tebal, list, quote).
  - Code Block berlatar gelap (`#0F172A`) dengan tombol **"Salin Kode" (Copy)**.
  - Quick prompt chip saran materi PPLG.
  - Penanganan offline: menampilkan pesan bahwa pembuatan jawaban baru memerlukan internet, tetapi riwayat lama tetap bisa dibuka.

### 8. Riwayat & Analisis
- Grafik akurasi per elemen kompetensi.
- Riwayat skor simulasi dari waktu ke waktu.
- Detail pembahasan tiap simulasi yang telah diselesaikan.

### 9. Papan Peringkat (Leaderboard)
- Daftar 50 skor IRT tertinggi se-angkatan.
- Highlight posisi akun siswa saat ini.

---

## 5. Skema Data & Strategi Offline-First

Penyimpanan offline menggunakan **Hive** atau **Isar** (NoSQL super cepat untuk Flutter):

### 1. `QuestionBox`
- Menyimpan bank soal bawaan dari `assets/questions.json` yang di-load saat instalasi pertama.
- Model fields: `id`, `topic`, `difficulty`, `type`, `stem`, `options`, `correctAnswer`, `explanation`.

### 2. `AttemptBox`
- Menyimpan riwayat pengerjaan simulasi & latihan.
- Status: `isSynced` (boolean). Jika `false`, sync service akan mengirimkannya ke server saat internet tersambung (`ConnectivityResult.mobile` / `wifi`).

### 3. `ChatSessionBox`
- Menyimpan riwayat chat AI: `id`, `title`, `messages: [{role, content, timestamp}]`, `createdAt`.

---

## 6. Integrasi Backend API

Aplikasi mobile terhubung ke backend server yang sudah ada di Vercel:

| Endpoint | Method | Fungsi | Fallback Offline |
| :--- | :---: | :--- | :--- |
| `https://cbt-pplg.vercel.app/api/auth/login` | POST | Login siswa/admin | Validasi via hash lokal |
| `https://cbt-pplg.vercel.app/api/auth/register` | POST | Pendaftaran akun baru | Disimpan di queue lokal |
| `https://cbt-pplg.vercel.app/api/ai/chat` | POST | Streaming / respon AI Tutor | Menampilkan notif butuh internet |
| `https://cbt-pplg.vercel.app/api/attempts/sync` | POST | Sinkronisasi skor & riwayat | Disimpan lokal, sync saat online |
| `https://cbt-pplg.vercel.app/api/leaderboard` | GET | Ambil papan peringkat global | Tampilkan cache terakhir |

---

## 7. Fitur Keamanan Ujian (Anti-Curang / Kiosk)

Untuk mensimulasikan lingkungan CBT resmi di HP:
1. **Disable Screenshot & Screen Record**: Menggunakan plugin `flutter_windowmanager`.
2. **App Lifecycle Observer**: Mendeteksi saat aplikasi masuk ke state `paused` (siswa keluar membuka WhatsApp / Google) dan memberikan peringatan atau pengurangan poin otomatis.
3. **Lock Task / Pinning (Kiosk Mode)**: Mengunci aplikasi agar siswa tidak bisa menekan tombol Home atau Recent Apps selama durasi ujian berlangsung.

---

## 8. Spesifikasi `pubspec.yaml`

```yaml
name: cbt_pplg_mobile
description: "Aplikasi Belajar & Simulasi CBT TKA PPLG SMK"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter

  # UI & Styling
  google_fonts: ^6.1.0
  lucide_icons: ^0.257.0
  flutter_svg: ^2.0.9
  percent_indicator: ^4.2.3
  fl_chart: ^0.66.0
  flutter_markdown: ^0.6.18+2
  flutter_highlight: ^0.7.0

  # State Management & Routing
  flutter_riverpod: ^2.5.1
  go_router: ^13.2.0

  # Offline Storage (Local Database)
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  shared_preferences: ^2.2.2

  # Networking & Connectivity
  dio: ^5.4.1
  connectivity_plus: ^5.0.2

  # Utilities
  intl: ^0.19.0
  uuid: ^4.3.3
  flutter_windowmanager: ^0.2.0 # Anti-screenshot untuk ujian

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  hive_generator: ^2.0.1
  build_runner: ^2.4.8

flutter:
  uses-material-design: true
  assets:
    - assets/questions.json
    - assets/icons/
```

---

## 9. Prompt Generator Migrasi ke Flutter

Gunakan prompt terstruktur di bawah ini ke AI (Claude, Antigravity, atau Cursor) untuk membangun aplikasi Flutter secara bertahap:

### 🔹 PROMPT 1: Setup Proyek & Arsitektur Utama
```text
Saya ingin membuat aplikasi mobile CBT-PPLG menggunakan Flutter dengan arsitektur Clean Architecture + Flutter Riverpod.
Aplikasi ini adalah platform ujian dan latihan kejuruan SMK PPLG dengan tema warna:
- Primary: #4338CA
- Surface Light: #FAFAFB, Surface Dark: #0B132B
- Font: Poppins (Google Fonts)

Tolong buatkan:
1. Konfigurasi theme lengkap (AppTheme light & dark mode) di lib/core/theme/.
2. Setup main navigation shell dengan BottomNavigationBar (Dashboard, Latihan, Simulasi, AI Tutor, Profil) menggunakan go_router.
3. Inisialisasi Hive database lokal untuk penyimpanan offline (profil siswa, bank soal, dan riwayat).
```

### 🔹 PROMPT 2: Bank Soal & Mesin Ujian (CBT & IRT)
```text
Berdasarkan proyek CBT-PPLG, buatkan modul Simulasi Ujian TKA di Flutter:
1. Buat Model Question & Attempt yang mendukung parsing dari JSON offline (assets/questions.json).
2. Buat SimulationScreen dengan fitur:
   - Countdown timer ujian (durasi 60 menit).
   - Indikator nomor soal & navigasi grid drawer/modal nomor soal.
   - Pilihan ganda interaktif (A, B, C, D) dengan tombol "Tandai Ragu-ragu".
   - Konfirmasi submit ujian.
3. Implementasikan fungsi penilaian IRT (Item Response Theory) lokal berdasarkan bobot tingkat kesulitan (mudah, sedang, sulit).
4. Layar SimulationResultScreen yang menampilkan skor IRT, akurasi, dan tombol pembahasan.
```

### 🔹 PROMPT 3: AI Tutor Studio ala ChatGPT di Flutter
```text
Buatkan modul AI Tutor Studio di Flutter yang menyerupai ChatGPT:
1. Layar AiTutorScreen dengan drawer riwayat percakapan di sebelah kiri (+ Obrolan Baru, pencarian percakapan, rename, dan delete obrolan).
2. Bubble percakapan dengan rendering Markdown lengkap (flutter_markdown) dan blok kode program dengan syntax highlighting serta tombol "Salin Kode".
3. State management menggunakan Riverpod yang menyimpan seluruh percakapan ke database lokal Hive (ChatSessionBox) sehingga riwayat lama bisa dibuka offline.
4. Hubungkan pengiriman pertanyaan ke API endpoint POST https://cbt-pplg.vercel.app/api/ai/chat menggunakan Dio, dengan fallback pesan error yang rapi jika koneksi internet mati.
```

### 🔹 PROMPT 4: Fitur Keamanan Ujian Anti-Curang
```text
Tambahkan fitur proteksi ujian CBT ke dalam Flutter:
1. Cegah screenshot dan screen recording saat berada di SimulationScreen menggunakan flutter_windowmanager.
2. Pasang WidgetsBindingObserver untuk mendeteksi saat siswa meminimalkan aplikasi atau berpindah aplikasi (AppLifecycleState.paused / inactive).
3. Berikan peringatan popup dengan batas maksimal 3 kali pelanggaran sebelum ujian disubmit secara otomatis.
```
