import { Attempt, Question, TryoutPackage, TryoutPackageStatus } from "@/types";
import { QUESTION_BANK } from "./questionBank";
import { SUB_ELEMENT_QUESTIONS } from "./subElementQuestions";

// =========================================================================
// BUTIR SOAL RESMI KEMENDIKDASMEN (DARI DOKUMEN ASLI TKA PPLG)
// =========================================================================
export const OFFICIAL_AUTHENTIC_QUESTIONS: Question[] = [
  {
    id: "resmi-01",
    topic: "Teknologi Jaringan Komputer",
    subElementId: "sub-3.1",
    subElementName: "Lingkungan Pengembangan dan Sistem Operasi",
    difficulty: "sedang",
    type: "single",
    stem: "Seorang pengembang aplikasi web sedang menyiapkan proyek pada server lokal untuk keperluan pengujian. Saat aplikasi diakses melalui browser, muncul pesan kesalahan berikut:\n\n```bash\nPermission denied: /var/www/html/index.php\n```\n\nAgar aplikasi web dapat diakses dengan normal, tindakan yang paling tepat adalah ....",
    options: [
      { key: "A", text: "mengaktifkan layanan web server agar dapat memproses file PHP" },
      { key: "B", text: "mengubah hak akses pada file atau direktori proyek" },
      { key: "C", text: "memasang bahasa pemrograman PHP pada sistem server" },
      { key: "D", text: "mengatur ulang port yang digunakan oleh web server" },
      { key: "E", text: "memindahkan file aplikasi ke direktori lain pada sistem" },
    ],
    correctAnswer: ["B"],
    explanation:
      "Pesan kesalahan **'Permission denied'** pada sistem berbasis Linux/Unix secara spesifik mengindikasikan bahwa proses web server (misalnya user `www-data`, `apache`, atau `nginx`) tidak memiliki izin baca (*read*) atau eksekusi (*execute*) pada file/direktori `/var/www/html/index.php`. Solusi yang paling tepat adalah **mengubah hak akses (*file permission*)** atau kepemilikan file tersebut menggunakan perintah `chmod` (misalnya `chmod 644 index.php` atau `chmod 755 /var/www/html`) atau `chown` (misalnya `chown -R www-data:www-data /var/www/html`).",
  },
  {
    id: "resmi-02",
    topic: "Pemrograman Terstruktur",
    subElementId: "sub-4.3",
    subElementName: "Modularisasi Program dan Fungsi",
    difficulty: "sedang",
    type: "single",
    stem: "Perhatikan koding berikut!\n\n```python\ndef hitung(a, b):\n    hasil = a + b\n    return hasil * 2\n\ndef proses(x):\n    return hitung(x, x + 1) - x\n\nnilai = ~\nprint(nilai)\n```\n\nAgar output program menghasilkan angka 11, maka kode yang harus dilengkapi pada baris 8 adalah ...",
    options: [
      { key: "A", text: "nilai = proses(3)" },
      { key: "B", text: "nilai = hitung(5,6)" },
      { key: "C", text: "nilai = proses(11)" },
      { key: "D", text: "nilai = proses(hitung(3,0))" },
      { key: "E", text: "nilai = hitung(11,0)" },
    ],
    correctAnswer: ["A"],
    explanation:
      "Mari lakukan penelusuran matematika (tracing) terhadap alur fungsi:\n1. `hitung(a, b)` mengembalikan `(a + b) * 2`\n2. `proses(x)` memanggil `hitung(x, x + 1) - x` = `((x + x + 1) * 2) - x` = `((2x + 1) * 2) - x` = `(4x + 2) - x` = `3x + 2`\n3. Agar nilai yang dicetak adalah 11, kita selesaikan persamaan linier:\n   `3x + 2 = 11` $\\rightarrow$ `3x = 9` $\\rightarrow$ `x = 3`.\n4. Pembuktian dengan memanggil `proses(3)`:\n   `hitung(3, 4) - 3` = `((3 + 4) * 2) - 3` = `(7 * 2) - 3` = `14 - 3 = 11`.\nMaka kode pada baris 8 yang tepat adalah `nilai = proses(3)`.",
  },
  {
    id: "resmi-03",
    topic: "Teknologi Jaringan Komputer",
    subElementId: "sub-3.3",
    subElementName: "Arsitektur Jaringan dan Protokol TCP/IP",
    difficulty: "sedang",
    type: "single",
    stem: "Cermati topologi infrastruktur aplikasi web berikut:\n\n- File Storage: `192.168.10.2/24` terhubung ke Server App (`192.168.10.1/24`)\n- Server App juga memiliki interface ke-2: `192.168.100.1/24` yang terhubung langsung ke DB Server 1 pada titik A.\n\nTopologi tersebut menggambarkan infrastruktur aplikasi web yang terdiri dari server aplikasi, file storage, dan database server.\nAgar database server dapat berkomunikasi dengan server aplikasi, alamat IP yang paling tepat digunakan pada titik A adalah ...",
    options: [
      { key: "A", text: "192.168.10.100/24" },
      { key: "B", text: "192.168.100.1/24" },
      { key: "C", text: "192.168.10.20/24" },
      { key: "D", text: "192.168.100.100/24" },
      { key: "E", text: "192.168.100.300/24" },
    ],
    correctAnswer: ["D"],
    explanation:
      "Analisis subnetting IPv4:\n1. Server App dan DB Server 1 dihubungkan pada tautan khusus dengan subnet `192.168.100.0/24`. Interface Server App di subnet ini adalah `192.168.100.1/24`.\n2. Titik A harus menggunakan alamat host dalam subnet yang sama (`192.168.100.1` - `192.168.100.254`).\n3. Opsi A dan C (`192.168.10.x`) salah karena berada di subnet File Storage.\n4. Opsi B (`192.168.100.1`) salah karena sudah dipakai oleh Server App (akan terjadi bentrok IP / IP Conflict).\n5. Opsi E (`192.168.100.300`) salah karena angka oktet 300 tidak valid (oktet IPv4 maksimal 255).\n6. Maka alamat IP yang valid dan berada dalam satu subnet komunikasi adalah **`192.168.100.100/24`**.",
  },
  {
    id: "resmi-04",
    topic: "Pemrograman Terstruktur",
    subElementId: "sub-4.2",
    subElementName: "Struktur Kontrol Perulangan dan Percabangan",
    difficulty: "sedang",
    type: "multiple",
    stem: "Perhatikan potongan program Python berikut:\n\n```python\nnilai = [70, 85, 60, 90]\n\njumlah_lulus = 0\n\nfor n in nilai:\n    if n >= 75:\n        jumlah_lulus += 1\n\nprint(jumlah_lulus)\n```\n\nTentukan pernyataan yang BENAR berdasarkan program di atas! (Pilih lebih dari satu jawaban yang benar)",
    options: [
      { key: "A", text: "Perulangan digunakan untuk memeriksa setiap nilai dalam daftar nilai." },
      { key: "B", text: "Nilai 75 masuk kategori Lulus" },
      { key: "C", text: "Pada akhir program, isi variabel jumlah_lulus adalah 3" },
      { key: "D", text: "Nilai yang memenuhi kriteria lulus (>= 75) dalam list adalah 85 dan 90 sehingga jumlah_lulus bernilai 2" },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "- **Pernyataan A Benar:** Perulangan `for n in nilai:` berfungsi mengiterasi setiap elemen di dalam list `nilai` secara sekuensial.\n- **Pernyataan B Benar:** Operator perbandingan `>=` berarti lebih besar atau sama dengan. Maka jika ada nilai 75, nilai tersebut memenuhi kriteria dan masuk kategori Lulus.\n- **Pernyataan C Salah:** Elemen yang memenuhi `>= 75` hanya dua elemen, yaitu 85 dan 90. Nilai 70 dan 60 tidak memenuhi. Maka variabel `jumlah_lulus` berakhir dengan nilai 2, bukan 3.\n- **Pernyataan D Benar:** Menjelaskan secara presisi alasan mengapa hasil akhirnya adalah 2.",
  },
  {
    id: "resmi-05",
    topic: "Pemrograman Berorientasi Objek",
    subElementId: "sub-5.4",
    subElementName: "Polymorphism dan Dynamic Dispatch",
    difficulty: "sulit",
    type: "multiple",
    stem: "Perhatikan kode Python berikut:\n\n```python\nclass A:\n    def xxx(self):\n        return \"\"\"A\"\"\"\n\nclass B(A):\n    def xxx(self):\n        return \"\"\"B\"\"\"\n\nclass C(A):\n    def xxx(self):\n        return \"\"\"C\"\"\"\n\ndef proses(obj):\n    return obj.xxx()\n\ndata = [A(), B(), C()]\n\nfor item in data:\n    print(proses(item))\n```\n\nTentukan pernyataan yang BENAR terkait penerapan konsep polymorphism pada program tersebut! (Pilih lebih dari satu jawaban yang benar)",
    options: [
      { key: "A", text: "Method xxx() pada class B dan C merupakan bentuk method overriding dari class A." },
      { key: "B", text: "Fungsi proses() dapat menerima objek dari class yang berbeda selama memiliki method xxx()." },
      { key: "C", text: "Output program akan selalu sama untuk setiap objek karena menggunakan fungsi yang sama." },
      { key: "D", text: "Pemanggilan obj.xxx() akan menyesuaikan dengan class dari objek yang diproses." },
      { key: "E", text: "Polymorphism pada program hanya dapat terjadi jika semua objek memiliki nilai atribut yang sama." },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "- **Pernyataan A Benar:** Class B dan Class C mewarisi Class A (`inheritance`) dan menimpa implementasi method `xxx()` milik parent class, yang merupakan definisi tepat dari **method overriding**.\n- **Pernyataan B Benar:** Fungsi `proses(obj)` menerapkan polymorphism (khususnya *duck typing* di Python) yang memproses objek apa pun asalkan objek tersebut menyediakan antarmuka method `xxx()`.\n- **Pernyataan C Salah:** Output program berbeda untuk tiap objek, yaitu mencetak berturut-turut string `'A'`, `'B'`, dan `'C'`.\n- **Pernyataan D Benar:** Prinsip polymorphism memastikan bahwa saat `obj.xxx()` dipanggil, Python akan secara dinamis mengeksekusi method milik kelas instans objek yang bersangkutan (*dynamic dispatch*).\n- **Pernyataan E Salah:** Polymorphism tidak mensyaratkan atribut yang sama, melainkan keseragaman method antarmuka (*interface*).",
  },
];

// Kumpulan butir soal pelengkap untuk membangun 10 paket simulasi penuh 5 elemen
const ALL_SUB_ELEMENT_QUESTIONS: Question[] = Object.values(SUB_ELEMENT_QUESTIONS).flat();

// Pengelompokan Bank Soal ke 5 Elemen Utama Resmi Kemendikdasmen:
const ELEMEN_1_POOL: Question[] = [
  ...ALL_SUB_ELEMENT_QUESTIONS.filter(
    (q) =>
      q.topic.includes("Wawasan Dunia Kerja") ||
      q.subElementId === "profesi-kewirausahaan" ||
      q.subElementId === "manajemen-proyek-mutu"
  ),
];

const ELEMEN_2_POOL: Question[] = [
  ...ALL_SUB_ELEMENT_QUESTIONS.filter(
    (q) =>
      q.topic.includes("Kecakapan Kerja") ||
      q.subElementId === "k3lh-budaya-kerja" ||
      q.subElementId === "pengelolaan-aset" ||
      q.subElementId === "pengelolaan-peralatan-tempat-kerja"
  ),
];

const ELEMEN_3_POOL: Question[] = [
  ...OFFICIAL_AUTHENTIC_QUESTIONS.filter((q) => q.topic.includes("Jaringan")),
  ...ALL_SUB_ELEMENT_QUESTIONS.filter(
    (q) =>
      q.topic.includes("Jaringan") ||
      q.subElementId?.startsWith("lingkungan-os") ||
      q.subElementId?.startsWith("infrastruktur") ||
      q.subElementId?.startsWith("arsitektur-tcpip") ||
      q.subElementId === "sub-3.1" ||
      q.subElementId === "sub-3.3"
  ),
  ...QUESTION_BANK.filter(
    (q) => q.topic === "Jaringan Komputer Dasar" || q.topic === "Keamanan Siber Dasar"
  ),
];

const ELEMEN_4_POOL: Question[] = [
  ...OFFICIAL_AUTHENTIC_QUESTIONS.filter((q) => q.topic.includes("Terstruktur")),
  ...ALL_SUB_ELEMENT_QUESTIONS.filter(
    (q) =>
      q.topic.includes("Terstruktur") ||
      q.subElementId?.startsWith("tipe-data") ||
      q.subElementId?.startsWith("perulangan") ||
      q.subElementId?.startsWith("fungsi-modular") ||
      q.subElementId === "sub-4.2" ||
      q.subElementId === "sub-4.3"
  ),
  ...QUESTION_BANK.filter((q) => q.topic === "Pemrograman Dasar" || q.topic === "Pemrograman Web"),
];

const ELEMEN_5_POOL: Question[] = [
  ...OFFICIAL_AUTHENTIC_QUESTIONS.filter((q) => q.topic.includes("Berorientasi Objek")),
  ...ALL_SUB_ELEMENT_QUESTIONS.filter(
    (q) =>
      q.topic.includes("Berorientasi Objek") ||
      q.subElementId?.startsWith("oop") ||
      q.subElementId?.startsWith("enkapsulasi") ||
      q.subElementId?.startsWith("polimorfisme") ||
      q.subElementId?.startsWith("mvc") ||
      q.subElementId === "sub-5.4"
  ),
  ...QUESTION_BANK.filter(
    (q) => q.topic === "Pemrograman Berorientasi Objek" || q.topic === "Basis Data"
  ),
];

/**
 * Membangun 1 paket Tryout berstandar resmi TKA Kemendikdasmen:
 * SETIAP PAKET WAJIB MENGANDUNG LENGKAP 5 ELEMEN:
 * - 4 butir Elemen 1: Wawasan Dunia Kerja & Budaya Mutu PPLG
 * - 4 butir Elemen 2: Kecakapan Kerja Dasar, K3LH, & Budaya 5R
 * - 6 butir Elemen 3: Arsitektur Jaringan, Subnetting, & TCP/IP
 * - 8 butir Elemen 4: Algoritma dan Pemrograman Dasar
 * - 8 butir Elemen 5: PBO (OOP: 4 Pilar) & Arsitektur MVC
 * Total = Tepat 30 Butir Soal per paket dengan rotasi butir soal per nomor paket.
 */
function buildFullComprehensivePackage(packageNum: number): Question[] {
  const result: Question[] = [];
  const existingIds = new Set<string>();

  const pickFromPool = (pool: Question[], count: number, offset: number) => {
    if (pool.length === 0) return;
    for (let i = 0; i < count; i++) {
      const idx = (offset + i) % pool.length;
      const q = pool[idx];
      if (!existingIds.has(q.id)) {
        existingIds.add(q.id);
        result.push(q);
      }
    }
  };

  const offset = (packageNum - 1) * 2;

  // 1. Elemen 1: 4 butir
  pickFromPool(ELEMEN_1_POOL, 4, offset);

  // 2. Elemen 2: 4 butir
  pickFromPool(ELEMEN_2_POOL, 4, offset + 1);

  // 3. Elemen 3: 6 butir
  pickFromPool(ELEMEN_3_POOL, 6, offset * 2);

  // 4. Elemen 4: 8 butir
  pickFromPool(ELEMEN_4_POOL, 8, offset * 3);

  // 5. Elemen 5: 8 butir
  pickFromPool(ELEMEN_5_POOL, 8, offset * 2 + 1);

  // Jika ada duplikasi atau kurang dari 30, lengkapi dari bank soal cadangan
  if (result.length < 30) {
    const backupPool = [
      ...OFFICIAL_AUTHENTIC_QUESTIONS,
      ...ALL_SUB_ELEMENT_QUESTIONS,
      ...QUESTION_BANK,
    ];
    for (const q of backupPool) {
      if (!existingIds.has(q.id)) {
        existingIds.add(q.id);
        result.push(q);
      }
      if (result.length >= 30) break;
    }
  }

  // Berikan ID unik berprefix nomor paket agar tidak bentrok di state jawaban
  return result.slice(0, 30).map((q, idx) => ({
    ...q,
    id: `pkt${packageNum}-${idx + 1}`,
  }));
}

// =========================================================================
// DEFINISI 10 PAKET TRYOUT RESMI CBT-PPLG (SEMUA PAKET = FULL 5 ELEMEN)
// =========================================================================
export const TRYOUT_PACKAGES: TryoutPackage[] = [
  {
    id: 1,
    title: "Paket 1: Simulasi Komprehensif TKA PPLG (Seri A)",
    focusTopics: "Lengkap 5 Elemen: Wawasan Kerja PPLG, K3LH 5R, Jaringan Komputer, Algoritma Dasar, & PBO/MVC",
    description:
      "Simulasi penuh berstandar resmi TKA Kemendikdasmen. Menguji 30 butir soal proporsional dari seluruh 5 Elemen kurikulum PPLG dengan distribusi kesulitan terkalibrasi IRT.",
    badge: "Full 5 Elemen",
    totalQuestions: 30,
    durationMinutes: 50,
    questions: buildFullComprehensivePackage(1),
  },
  {
    id: 2,
    title: "Paket 2: Simulasi Komprehensif TKA PPLG (Seri B)",
    focusTopics: "Lengkap 5 Elemen: Wawasan Kerja PPLG, K3LH 5R, Jaringan Komputer, Algoritma Dasar, & PBO/MVC",
    description:
      "Simulasi komprehensif seri B dengan variasi studi kasus SDLC, ergonomi kerja lab, subnetting CIDR, tracing algoritma, dan 4 pilar PBO.",
    badge: "Full 5 Elemen",
    totalQuestions: 30,
    durationMinutes: 50,
    questions: buildFullComprehensivePackage(2),
  },
  {
    id: 3,
    title: "Paket 3: Simulasi Komprehensif TKA PPLG (Seri C)",
    focusTopics: "Lengkap 5 Elemen: Wawasan Kerja PPLG, K3LH 5R, Jaringan Komputer, Algoritma Dasar, & PBO/MVC",
    description:
      "Simulasi penuh seri C dengan fokus penguatan logika kontrol program, protokol TCP/IP, budaya mutu software, dan relasi class OOP.",
    badge: "Full 5 Elemen",
    totalQuestions: 30,
    durationMinutes: 50,
    questions: buildFullComprehensivePackage(3),
  },
  {
    id: 4,
    title: "Paket 4: Simulasi Komprehensif TKA PPLG (Seri D)",
    focusTopics: "Lengkap 5 Elemen: Wawasan Kerja PPLG, K3LH 5R, Jaringan Komputer, Algoritma Dasar, & PBO/MVC",
    description:
      "Simulasi penuh seri D mencakup tata kelola aset digital Git, pencegahan bahaya kelistrikan lab, subnetting host, looping bersarang, dan pola MVC.",
    badge: "Full 5 Elemen",
    totalQuestions: 30,
    durationMinutes: 50,
    questions: buildFullComprehensivePackage(4),
  },
  {
    id: 5,
    title: "Paket 5: Simulasi Komprehensif TKA PPLG (Seri E)",
    focusTopics: "Lengkap 5 Elemen: Wawasan Kerja PPLG, K3LH 5R, Jaringan Komputer, Algoritma Dasar, & PBO/MVC",
    description:
      "Simulasi penuh seri E tingkat menengah dengan pendalaman analisis fungsi modular, routing jaringan web server, dan dynamic polymorphism.",
    badge: "Full 5 Elemen",
    totalQuestions: 30,
    durationMinutes: 50,
    questions: buildFullComprehensivePackage(5),
  },
  {
    id: 6,
    title: "Paket 6: Simulasi Komprehensif TKA PPLG (Seri F)",
    focusTopics: "Lengkap 5 Elemen: Wawasan Kerja PPLG, K3LH 5R, Jaringan Komputer, Algoritma Dasar, & PBO/MVC",
    description:
      "Simulasi penuh seri F menguji ketelitian perancangan class diagram, protokol transport TCP vs UDP, dan optimalisasi struktur perulangan.",
    badge: "Full 5 Elemen",
    totalQuestions: 30,
    durationMinutes: 50,
    questions: buildFullComprehensivePackage(6),
  },
  {
    id: 7,
    title: "Paket 7: Simulasi Komprehensif TKA PPLG (Seri G)",
    focusTopics: "Lengkap 5 Elemen: Wawasan Kerja PPLG, K3LH 5R, Jaringan Komputer, Algoritma Dasar, & PBO/MVC",
    description:
      "Simulasi penuh seri G dengan penekanan pada penerapan Agile Scrum, standar ergonomi 20-20-20, arsitektur client-server, dan enkapsulasi data.",
    badge: "Full 5 Elemen",
    totalQuestions: 30,
    durationMinutes: 50,
    questions: buildFullComprehensivePackage(7),
  },
  {
    id: 8,
    title: "Paket 8: Simulasi Komprehensif TKA PPLG (Seri H)",
    focusTopics: "Lengkap 5 Elemen: Wawasan Kerja PPLG, K3LH 5R, Jaringan Komputer, Algoritma Dasar, & PBO/MVC",
    description:
      "Simulasi penuh seri H pengayaan berjenjang untuk melatih kecepatan membaca sintaksis kode dan pemecahan masalah jaringan IP.",
    badge: "Full 5 Elemen",
    totalQuestions: 30,
    durationMinutes: 50,
    questions: buildFullComprehensivePackage(8),
  },
  {
    id: 9,
    title: "Paket 9: Simulasi Komprehensif TKA PPLG (Seri I - Pra Ujian)",
    focusTopics: "Lengkap 5 Elemen: Wawasan Kerja PPLG, K3LH 5R, Jaringan Komputer, Algoritma Dasar, & PBO/MVC",
    description:
      "Simulasi pra-ujian utama dengan komposisi soal penalaran tinggi (HOTS) pada seluruh 5 Elemen standar Kemendikdasmen.",
    badge: "Full 5 Elemen",
    totalQuestions: 30,
    durationMinutes: 50,
    questions: buildFullComprehensivePackage(9),
  },
  {
    id: 10,
    title: "Paket 10: Uji Prediksi Kelulusan Nasional TKA PPLG (Final Simulation)",
    focusTopics: "Lengkap 5 Elemen: Wawasan Kerja PPLG, K3LH 5R, Jaringan Komputer, Algoritma Dasar, & PBO/MVC",
    description:
      "Paket puncak simulasi komprehensif 5 elemen dengan bobot butir terkalibrasi IRT standar kelulusan nasional SMK PPLG.",
    badge: "Prediksi Final 5 Elemen",
    totalQuestions: 30,
    durationMinutes: 50,
    questions: buildFullComprehensivePackage(10),
  },
];

// =========================================================================
// HELPER LOGIKA UNLOCK & PROGRESS STATUS
// =========================================================================

/**
 * Menghitung status unlock dan riwayat pengerjaan 10 paket tryout:
 * - Paket 1 selalu terbuka (unlocked)
 * - Paket N (2..10) terbuka HANYA jika Paket N-1 telah diselesaikan (memiliki attempt valid)
 */
export function getTryoutPackagesStatus(attempts: Attempt[]): TryoutPackageStatus[] {
  const simAttempts = attempts.filter((a) => a.mode === "simulation");

  return TRYOUT_PACKAGES.map((pkg) => {
    // Cari attempt yang cocok dengan paket ini
    const pkgAttempts = simAttempts.filter((a) => {
      if (a.packageId === pkg.id) return true;
      // Kompatibilitas dengan attempt lama yang belum ada packageId (dianggap Paket 1)
      if (pkg.id === 1 && !a.packageId) return true;
      return false;
    });

    const isCompleted = pkgAttempts.length > 0;
    const attemptCount = pkgAttempts.length;

    // Hitung skor terbaik dan terbaru
    let bestScore: number | undefined;
    let latestScore: number | undefined;
    let latestAttemptId: string | undefined;
    let lastAttemptAt: string | undefined;

    if (isCompleted) {
      const scores = pkgAttempts.map((a) => a.irtResult?.score || 0);
      bestScore = Math.max(...scores);
      latestScore = pkgAttempts[0].irtResult?.score;
      latestAttemptId = pkgAttempts[0].id;
      lastAttemptAt = pkgAttempts[0].finishedAt;
    }

    // Aturan Unlocking:
    // Paket 1 selalu terbuka.
    // Paket N terbuka jika Paket N-1 sudah selesai (completed).
    let isUnlocked = false;
    if (pkg.id === 1) {
      isUnlocked = true;
    } else {
      const prevPkgId = pkg.id - 1;
      const prevAttempts = simAttempts.filter(
        (a) => a.packageId === prevPkgId || (prevPkgId === 1 && !a.packageId)
      );
      isUnlocked = prevAttempts.length > 0;
    }

    return {
      packageId: pkg.id,
      isUnlocked,
      isCompleted,
      attemptCount,
      bestScore,
      latestScore,
      latestAttemptId,
      lastAttemptAt,
    };
  });
}

export function getPackageById(id: number): TryoutPackage | undefined {
  return TRYOUT_PACKAGES.find((p) => p.id === id);
}
