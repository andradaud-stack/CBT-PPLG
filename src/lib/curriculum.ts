export interface SubElement {
  id: string;
  name: string;
  elementId: number;
  elementName: string;
  competency: string;
  scope: string;
  summary: {
    overview: string;
    keyPoints: string[];
    deepDive: string;
    codeExample?: string;
    realWorldAnalogy?: string;
  };
}

export interface CurriculumElement {
  id: number;
  name: string;
  description: string;
  icon: string;
  subElements: SubElement[];
}

export const OFFICIAL_CURRICULUM: CurriculumElement[] = [
  // =========================================================================
  // ELEMEN 1: Wawasan dunia kerja bidang pengembangan perangkat lunak dan gim
  // =========================================================================
  {
    id: 1,
    name: "Wawasan Dunia Kerja Bidang PPLG",
    description: "Pemahaman profesi, kewirausahaan technopreneur, manajemen proyek perangkat lunak, dan budaya mutu.",
    icon: "Briefcase",
    subElements: [
      {
        id: "profesi-kewirausahaan",
        name: "Profesi dan Kewirausahaan PPLG",
        elementId: 1,
        elementName: "Wawasan dunia kerja bidang pengembangan perangkat lunak dan gim",
        competency:
          "Mengidentifikasi jenis-jenis profesi dalam bidang PPLG beserta tugas utamanya, serta menjelaskan prinsip dasar kewirausahaan di bidang pengembangan perangkat lunak dan gim.",
        scope:
          "Jenis-jenis profesi bidang PPLG, tugas utama profesi, peluang usaha, dan prinsip dasar kewirausahaan/technopreneurship di bidang perangkat lunak dan gim.",
        summary: {
          overview:
            "Industri perangkat lunak dan gim memiliki ekosistem peran profesional yang spesifik dan terintegrasi, serta peluang besar bagi technopreneur yang mampu menciptakan solusi digital bernilai tambah.",
          keyPoints: [
            "**Software Engineer / Developer:** Merancang, menulis kode, dan memelihara aplikasi (Frontend, Backend, Fullstack, Mobile).",
            "**Game Developer & Game Designer:** Merancang gameplay loop, mekanika permainan, scripting engine (Unity, Unreal, Godot), dan asset integration.",
            "**UI/UX Designer:** Meriset kebutuhan pengguna (UX Research), menyusun arsitektur informasi, wireframing, prototyping, dan desain visual antarmuka.",
            "**QA Engineer / Software Tester:** Memastikan perangkat lunak bebas bug dan memenuhi spesifikasi melalui manual & automated testing.",
            "**DevOps Engineer:** Mengelola integrasi berkelanjutan (CI/CD), orkestrasi server, dan stabilitas deployment perangkat lunak.",
            "**Technopreneurship PPLG:** Kewirausahaan berbasis inovasi teknologi; mencakup validasi masalah pasar (problem-solution fit), Business Model Canvas (BMC), Minimum Viable Product (MVP), dan perlindungan HaKI (Hak Cipta software).",
          ],
          deepDive:
            "Dalam technopreneurship perangkat lunak, siklus pengembangan modern umumnya mengadopsi metodologi **Lean Startup**: *Build - Measure - Learn*. Seorang technopreneur tidak langsung menghabiskan waktu membangun produk raksasa, melainkan meluncurkan **MVP (Minimum Viable Product)** sesegera mungkin untuk memvalidasi hipotesis kebutuhan pasar nyata.",
          realWorldAnalogy:
            "Membangun startup software seperti membuka warung makan: alih-alih langsung menyewa ruko besar 3 lantai, kamu tes dulu menu andalanmu di gerobak kecil (MVP) untuk melihat apakah orang menyukai rasanya.",
        },
      },
      {
        id: "manajemen-proyek-mutu",
        name: "Manajemen Proyek dan Budaya Mutu",
        elementId: 1,
        elementName: "Wawasan dunia kerja bidang pengembangan perangkat lunak dan gim",
        competency:
          "Mengidentifikasi tahapan dasar manajemen proyek perangkat lunak dan gim serta menjelaskan prinsip budaya mutu dalam pengembangan perangkat lunak dan gim.",
        scope:
          "Tahapan dasar manajemen proyek, proses bisnis pengembangan perangkat lunak/gim, dan prinsip budaya mutu.",
        summary: {
          overview:
            "Manajemen proyek perangkat lunak memastikan produk selesai tepat waktu, sesuai anggaran, dan memenuhi standar kualitas menggunakan metodologi Agile/Scrum atau Waterfall.",
          keyPoints: [
            "**Tahapan SDLC (Software Development Life Cycle):** Analisis Kebutuhan → Perancangan (Desain) → Implementasi (Koding) → Pengujian (Testing) → Penerapan (Deployment) → Pemeliharaan (Maintenance).",
            "**Metodologi Agile & Scrum:** Pendekatan iteratif dengan siklus pendek (Sprint 1-4 minggu), Daily Standup, Sprint Planning, dan Retrospective.",
            "**Metodologi Waterfall:** Pendekatan sekuensial linear tradisional, cocok untuk proyek dengan spesifikasi tetap sejak awal.",
            "**Budaya Mutu (Quality Assurance):** Penerapan Clean Code, Code Review antar rekan kerja, Continuous Integration (CI), dan otomatisasi unit test untuk mencegah regresi bug.",
            "**Manajemen Risiko:** Mengidentifikasi potensi keterlambatan (scope creep), keterbatasan resource, dan risiko teknis sejak fase awal.",
          ],
          deepDive:
            "Budaya mutu bukan hanya tanggung jawab tim QA, melainkan seluruh anggota tim rekayasa. Prinsip **Shift-Left Testing** menekankan bahwa pengujian dan pengawasan kualitas harus dilakukan sedini mungkin sejak analisis kebutuhan dan penulisan baris kode pertama, bukan ditumpuk di akhir proyek.",
          realWorldAnalogy:
            "Memperbaiki cacat di cetak biru rumah jauh lebih murah daripada memperbaiki tembok pondasi yang sudah berdiri 2 lantai.",
        },
      },
    ],
  },

  // =========================================================================
  // ELEMEN 2: Kecakapan kerja dasar (basic job skills), K3, dan budaya kerja
  // =========================================================================
  {
    id: 2,
    name: "Kecakapan Kerja Dasar, K3, & Budaya Kerja",
    description: "Penerapan keselamatan kerja ergonomis, budaya kerja profesional IT, dan tata kelola aset fisik serta digital.",
    icon: "ShieldCheck",
    subElements: [
      {
        id: "k3lh-budaya-kerja",
        name: "K3LH dan Budaya Kerja Profesional",
        elementId: 2,
        elementName: "Kecakapan kerja dasar (basic job skills), K3, dan budaya kerja",
        competency:
          "Menjelaskan prinsip dasar K3LH dalam lingkungan kerja teknologi informasi serta karakteristik budaya kerja profesional di industri pengembangan perangkat lunak dan gim.",
        scope:
          "Prinsip dasar K3LH, etika kerja, budaya kerja profesional, dan lingkungan kerja PPLG.",
        summary: {
          overview:
            "K3LH di industri perangkat lunak berfokus pada kesehatan ergonomis kerja komputer, keselamatan fasilitas listrik, dan pembiasaan budaya kerja kolaboratif beretika tinggi.",
          keyPoints: [
            "**Ergonomi Kerja:** Posisi monitor sejajar dengan mata (jarak 50-70 cm), sudut siku dan lutut 90 derajat, pencahayaan ruang cukup (hindari glare), serta aturan 20-20-20 untuk relaksasi mata.",
            "**Keselamatan Kelistrikan:** Manajemen kabel rapi (cable management), pencegahan beban berlebih pada stop kontak, dan ketersediaan APAR di laboratorium komputer.",
            "**Budaya Kerja 5R/5S:** Ringkas, Rapi, Resik, Rawat, Rajin diterapkan pada ruang kerja fisik dan struktur file kerja.",
            "**Etika Profesional:** Menghormati privasi data (NDA - Non-Disclosure Agreement), integritas kode, tidak melakukan plagiarisme/pembajakan software, dan komunikasi asertif dalam tim.",
          ],
          deepDive:
            "Sindrom *Repetitive Strain Injury (RSI)* dan *Carpal Tunnel Syndrome* adalah risiko kesehatan terbesar bagi software developer akibat pengetikan berkepanjangan tanpa posisi pergelangan tangan netral. Penggunaan keyboard ergonomis dan istirahat berkala adalah bagian dari kepatuhan K3 modern.",
        },
      },
      {
        id: "pengelolaan-aset",
        name: "Pengelolaan Aset Fisik dan Digital",
        elementId: 2,
        elementName: "Kecakapan kerja dasar (basic job skills), K3, dan budaya kerja",
        competency:
          "Menjelaskan dan menerapkan prinsip dasar pengelolaan aset fisik dan aset digital dalam lingkungan kerja teknologi informasi dan menerapkan prosedur pengelolaan aset fisik dan aset digital dalam suatu skenario lingkungan kerja atau proyek pengembangan perangkat lunak dan gim.",
        scope:
          "Pengelolaan perangkat kerja, file proyek, direktori, aset digital, source code, media, database, dan dokumentasi proyek.",
        summary: {
          overview:
            "Aset perangkat lunak mencakup perangkat keras komputer kerja dan aset digital (source code, skema basis data, aset media, API key). Pengelolaannya wajib terstruktur dan aman.",
          keyPoints: [
            "**Version Control System (VCS - Git):** Pengelolaan riwayat source code, branching strategy (Git Flow: main, develop, feature branches), commit message standar.",
            "**Struktur Direktori Proyek:** Pemisahan folder source code (`/src`), aset visual (`/assets` atau `/public`), konfigurasi (`/config`), dan dokumentasi (`/docs`).",
            "**Keamanan Aset Digital:** Melarang keras *hardcode* credentials/API key di repository publik; wajib memanfaatkan environment variables (`.env`).",
            "**Strategi Backup 3-2-1:** Menyimpan minimal 3 salinan data, pada 2 media berbeda, dengan 1 salinan berada di lokasi off-site / cloud terenkripsi.",
            "**Inventarisasi Perangkat Keras:** Pencatatan spesifikasi, serial number, status maintenance, dan hak akses perangkat workstation tim.",
          ],
          deepDive:
            "Insiden kebocoran data di perusahaan rintisan sering berakar dari ketidaksengajaan mengunggah file kredensial ke Git publik. Penggunaan file `.gitignore` dan scanning otomatis seperti *git-secrets* merupakan prosedur standar tata kelola aset digital.",
          codeExample: `# .gitignore contoh standar pengelolaan aset
node_modules/
.env
.env.local
*.log
dist/
build/
.DS_Store`,
        },
      },
    ],
  },

  // =========================================================================
  // ELEMEN 3: Teknologi jaringan komputer
  // =========================================================================
  {
    id: 3,
    name: "Teknologi Jaringan Komputer",
    description: "Sistem operasi pengembang, konfigurasi jaringan lokal/server, arsitektur TCP/IP, dan protokol aplikasi.",
    icon: "Network",
    subElements: [
      {
        id: "lingkungan-os-dev",
        name: "Lingkungan Sistem Operasi untuk Pengembangan",
        elementId: 3,
        elementName: "Teknologi jaringan komputer",
        competency:
          "Menerapkan pengelolaan file dan direktori proyek pada sistem operasi dan menerapkan konfigurasi dasar lingkungan pengembangan pada sistem operasi.",
        scope:
          "Pengelolaan file dan direktori proyek pada sistem operasi, dan Konfigurasi dasar lingkungan pengembangan pada sistem operasi.",
        summary: {
          overview:
            "Seorang developer harus menguasai Command Line Interface (CLI), manajemen izin akses file (file permissions), environment variables, dan runtime environment pada OS (Linux, Windows, macOS).",
          keyPoints: [
            "**Perintah Dasar CLI Linux/Unix:** `cd`, `ls -la`, `mkdir`, `rm -rf`, `cp`, `mv`, `chmod`, `chown`, `grep`, `cat`.",
            "**File Permission Unix (rwx):** Mode numerik (contoh: 755 = rwxr-xr-x; 644 = rw-r--r--) untuk mengamankan script eksekusi dan file web.",
            "**Environment Variables & PATH:** Mengatur variabel sistem agar runtime (Node.js, Python, Java, PHP) dapat dipanggil secara global dari terminal manapun.",
            "**Package Manager:** Pengelolaan pustaka dependensi (`npm`, `pip`, `composer`, `apt`).",
          ],
          deepDive:
            "Variabel `PATH` adalah daftar direktori yang dicari oleh sistem operasi ketika sebuah perintah diketikkan di terminal. Jika executable tidak berada di dalam salah satu direktori `PATH`, sistem akan menampilkan error *command not found*.",
          codeExample: `# Cek permission file dan ubah hak akses
ls -l script.sh
chmod +x script.sh   # Memberikan izin execute
./script.sh`,
        },
      },
      {
        id: "infrastruktur-jaringan-dasar",
        name: "Infrastruktur dan Perangkat Jaringan",
        elementId: 3,
        elementName: "Teknologi jaringan komputer",
        competency:
          "Mengimplementasikan konfigurasi jaringan dasar untuk memastikan konektivitas sistem dalam lingkungan pengembangan.",
        scope:
          "Konfigurasi jaringan dasar untuk memastikan konektivitas sistem dalam lingkungan pengembangan.",
        summary: {
          overview:
            "Pengembang software perlu memastikan workstation terhubung dengan server lokal/cloud, repositori remote, dan database server melalui konfigurasi IP, subnetting, dan gateway.",
          keyPoints: [
            "**Pengalamatan IP (IPv4):** Format desimal 32-bit (contoh: 192.168.1.100), Subnet Mask (`255.255.255.0` atau `/24`), dan Default Gateway.",
            "**IP Private vs IP Public:** Rentang IP lokal (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) yang tidak dapat dirouting langsung di internet global tanpa NAT.",
            "**Localhost / Loopback Address:** Alamat `127.0.0.1` digunakan aplikasi untuk berkomunikasi dengan layanan lokal pada mesin yang sama.",
            "**Diagnosa Konektivitas CLI:** Menggunakan `ping` (uji round-trip), `traceroute` / `tracert`, `nslookup` (cek DNS), dan `netstat` / `ss` (cek open port).",
          ],
          deepDive:
            "Dalam pengembangan web dan mobile, developer sering kali perlu menguji API lokal di handphone fisik. Ini memerlukan konfigurasi binding IP ke `0.0.0.0` (semua interface) dan memastikan firewall mengizinkan port aplikasi (misal: port 3000 atau 8080).",
        },
      },
      {
        id: "arsitektur-tcp-ip",
        name: "Arsitektur dan Mekanisme TCP/IP",
        elementId: 3,
        elementName: "Teknologi jaringan komputer",
        competency:
          "Mengimplementasikan dan menganalisis konsep layer TCP/IP dalam menentukan fungsi protokol pada proses komunikasi jaringan dan menganalisis mekanisme komunikasi jaringan berbasis TCP/IP.",
        scope:
          "Konsep layer TCP/IP dalam menentukan fungsi protokol pada proses komunikasi jaringan, dan Mekanisme komunikasi jaringan berbasis TCP/IP.",
        summary: {
          overview:
            "Model 4-Layer TCP/IP (Application, Transport, Internet, Network Access) adalah fondasi komunikasi internet dan pertukaran data API RESTful maupun WebSocket.",
          keyPoints: [
            "**4 Layer TCP/IP:**\n  1. *Application:* HTTP/HTTPS, DNS, FTP, SSH, WebSocket.\n  2. *Transport:* TCP (connection-oriented, reliabel, 3-way handshake) vs UDP (connectionless, cepat, streaming/gim).\n  3. *Internet:* IP, ICMP, ARP.\n  4. *Network Access / Link:* Ethernet, Wi-Fi, MAC Address.",
            "**TCP Three-Way Handshake:** Proses inisialisasi koneksi `SYN` → `SYN-ACK` → `ACK` untuk memastikan kedua pihak siap bertukar paket data.",
            "**Port Komunikasi Standar:** Port 80 (HTTP), 443 (HTTPS), 22 (SSH), 3306 (MySQL), 5432 (PostgreSQL).",
            "**HTTP Request-Response Cycle:** Komponen request (Method: GET/POST/PUT/DELETE, Headers, Body) dan status code (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error).",
          ],
          deepDive:
            "Dalam pengembangan game online multiplayer real-time, protokol **UDP** lebih banyak digunakan dibanding TCP karena tidak membutuhkan overhead acknowledgement (ACK); hilangnya satu paket koordinat posisi pemain lebih baik diabaikan daripada permainan menjadi patah-patah (*lag*).",
        },
      },
    ],
  },

  // =========================================================================
  // ELEMEN 4: Pemrograman Terstruktur
  // =========================================================================
  {
    id: 4,
    name: "Pemrograman Terstruktur",
    description: "Tipe data, struktur data dasar, logika percabangan, perulangan, dan modularisasi fungsi/prosedur.",
    icon: "FileCode",
    subElements: [
      {
        id: "tipe-struktur-data",
        name: "Struktur Data dan Tipe Data",
        elementId: 4,
        elementName: "Pemrograman Terstruktur",
        competency:
          "Menganalisis penggunaan tipe data dan struktur data dalam potongan program atau skenario penyelesaian masalah berbasis algoritma.",
        scope:
          "Penggunaan tipe data, struktur data, dan penerapannya dalam penyelesaian masalah program perangkat lunak atau gim.",
        summary: {
          overview:
            "Pemilihan tipe data primitif dan struktur data yang tepat secara langsung mempengaruhi efisiensi memori dan kecepatan eksekusi algoritma.",
          keyPoints: [
            "**Tipe Data Primitif:** Integer (bilangan bulat), Float/Double (pecahan desimal), Boolean (`true`/`false`), Char (karakter tunggal), String (kumpulan karakter).",
            "**Array:** Struktur data linier berukuran tetap yang menyimpan elemen dengan tipe data sejenis, diakses melalui indeks berbasis nol (*zero-based indexing*).",
            "**List / Dynamic Array:** Kumpulan data linier dinamis yang ukurannya dapat bertambah secara otomatis.",
            "**Stack (Tumpukan):** Prinsip LIFO (*Last In First Out*), operasi utama `push()` dan `pop()`. Digunakan pada pemanggilan fungsi (call stack) dan fitur Undo.",
            "**Queue (Antrean):** Prinsip FIFO (*First In First Out*), operasi utama `enqueue()` dan `dequeue()`. Digunakan pada antrean cetak printer dan task scheduler.",
          ],
          deepDive:
            "Pengaksesan elemen array berdasarkan indeks membutuhkan kompleksitas waktu konstan **O(1)** karena lokasi memori dihitung secara langsung: `alamat = base_address + (index * ukuran_tipe)`. Namun pencarian elemen pada array yang belum terurut membutuhkan waktu linier **O(n)**.",
          codeExample: `// Contoh implementasi Stack sederhana di TypeScript/JS
const stack: number[] = [];
stack.push(10); // Menambah elemen
stack.push(20);
const topItem = stack.pop(); // Mengambil elemen teratas -> bernilai 20`,
        },
      },
      {
        id: "struktur-kontrol-program",
        name: "Struktur Kontrol Program",
        elementId: 4,
        elementName: "Pemrograman Terstruktur",
        competency:
          "Menganalisis alur logika program yang menggunakan struktur kontrol percabangan atau perulangan serta mengevaluasi efektivitas penggunaannya dalam penyelesaian masalah.",
        scope:
          "Percabangan, perulangan, alur logika program, dan efektivitas struktur kontrol.",
        summary: {
          overview:
            "Struktur kontrol mengatur alur eksekusi baris kode berdasarkan kondisi logika (percabangan) atau mengeksekusi instruksi secara berulang (perulangan).",
          keyPoints: [
            "**Percabangan `if-else` & `else if`:** Mengevaluasi ekspresi boolean untuk menentukan blok kode mana yang akan dieksekusi.",
            "**Percabangan `switch-case`:** Percabangan multi-arah yang efisien saat mencocokkan satu nilai variabel diskrit dengan beberapa konstanta kasus.",
            "**Perulangan `for`:** Digunakan ketika jumlah iterasi sudah diketahui secara pasti sejak awal.",
            "**Perulangan `while` & `do-while`:** `while` mengecek kondisi sebelum iterasi; `do-while` menjamin blok kode dieksekusi minimal satu kali sebelum kondisi diperiksa.",
            "**Pernyataan `break` dan `continue`:** `break` menghentikan loop seketika; `continue` melompati sisa blok dan langsung ke iterasi berikutnya.",
          ],
          deepDive:
            "Bahaya paling umum dalam perulangan adalah **infinite loop** (perulangan tanpa henti) yang terjadi saat variabel counter atau kondisi terminasi tidak pernah mencapai status false, menyebabkan sistem crash atau konsumsi CPU 100%.",
          codeExample: `// Contoh efektivitas switch-case dibanding if-else bertingkat
switch (httpStatus) {
  case 200:
    console.log("Berhasil");
    break;
  case 404:
    console.log("Tidak Ditemukan");
    break;
  default:
    console.log("Status Tidak Dikenal");
}`,
        },
      },
      {
        id: "modularisasi-program",
        name: "Modularisasi Program",
        elementId: 4,
        elementName: "Pemrograman Terstruktur",
        competency:
          "Menganalisis pembagian fungsi atau prosedur dalam program terstruktur serta mengevaluasi efektivitas desain modular dalam penyelesaian masalah pada perangkat lunak dan gim.",
        scope:
          "Fungsi, prosedur, modularisasi program, dan efektivitas desain modular.",
        summary: {
          overview:
            "Modularisasi memecah program besar dan rumit menjadi bagian-bagian kecil (sub-program) yang independen, mudah dipahami, dapat diuji secara terpisah, dan dapat digunakan kembali (*reusable*).",
          keyPoints: [
            "**Fungsi vs Prosedur:** Fungsi mengembalikan suatu nilai (*return value*), sedangkan prosedur hanya menjalankan serangkaian instruksi tanpa mengembalikan nilai.",
            "**Parameter dan Argumen:** Parameter adalah variabel pada definisi fungsi; argumen adalah nilai aktual yang dikirimkan saat pemanggilan.",
            "**Prinsip DRY (Don't Repeat Yourself):** Mencegah penulisan kode duplikat dengan membungkus logika berulang ke dalam satu fungsi terpusat.",
            "**Scope Variabel (Lokal vs Global):** Variabel lokal hanya dikenal di dalam blok fungsi tempat ia dideklarasikan; variabel global dapat diakses di seluruh file.",
            "**Pure Function:** Fungsi yang untuk input yang sama selalu menghasilkan output yang sama tanpa menimbulkan *side effect* (efek samping) ke variabel luar.",
          ],
          deepDive:
            "Desain modular yang baik memiliki derajat **High Cohesion** (setiap fungsi fokus mengerjakan satu tugas spesifik secara mendalam) dan **Low Coupling** (ketergantungan antar-modul minimal sehingga perubahan pada satu modul tidak merusak modul lainnya).",
        },
      },
    ],
  },

  // =========================================================================
  // ELEMEN 5: Pemrograman Berorientasi Objek
  // =========================================================================
  {
    id: 5,
    name: "Pemrograman Berorientasi Objek (OOP)",
    description: "Konsep class/object, 4 pilar OOP: Enkapsulasi, Pewarisan, Polimorfisme, dan Abstraksi.",
    icon: "Boxes",
    subElements: [
      {
        id: "konsep-dasar-oop",
        name: "Konsep Dasar dan Prinsip OOP",
        elementId: 5,
        elementName: "Pemrograman Berorientasi Objek",
        competency:
          "Menerapkan konsep class dan object serta prinsip dasar OOP dalam perancangan struktur program pada perangkat lunak dan gim.",
        scope:
          "Class, object, atribut, method, dan prinsip dasar OOP.",
        summary: {
          overview:
            "OOP adalah paradigma pemrograman yang memodelkan entitas dunia nyata ke dalam struktur kode yang terdiri dari data (atribut) dan perilaku (method).",
          keyPoints: [
            "**Class:** Cetak biru (*blueprint*) atau template yang mendefinisikan atribut dan method yang akan dimiliki oleh objek.",
            "**Object:** Perwujudan nyata (*instance*) dari sebuah class yang dialokasikan di dalam memori saat runtime (menggunakan kata kunci `new`).",
            "**Atribut / State:** Variabel yang melekat pada class yang menyimpan informasi status dari objek.",
            "**Method / Behavior:** Fungsi yang ada di dalam class yang mendefinisikan aksi atau tindakan yang dapat dilakukan oleh objek.",
            "**Constructor:** Method khusus yang otomatis dieksekusi saat objek pertama kali dibuat untuk menginisialisasi atribut awal.",
          ],
          deepDive:
            "Sebuah class dapat memiliki banyak instance objek dengan nilai atribut yang berbeda-beda di memori, namun semuanya berbagi method dan perilaku yang sama sesuai definisi class asalnya.",
          codeExample: `// Contoh Class & Object di TypeScript
class KarakterGim {
  nama: string;
  darah: number;

  constructor(nama: string, darah: number) {
    this.nama = nama;
    this.darah = darah;
  }

  serang(): void {
    console.log(\`\${this.nama} melancarkan serangan!\`);
  }
}

// Instansiasi Object
const pahlawan = new KarakterGim("Arjuna", 100);
pahlawan.serang();`,
        },
      },
      {
        id: "enkapsulasi-access-modifier",
        name: "Enkapsulasi dan Access Modifier",
        elementId: 5,
        elementName: "Pemrograman Berorientasi Objek",
        competency:
          "Menerapkan ketepatan penggunaan access modifier dan enkapsulasi dalam deklarasi atribut dan method pada suatu class.",
        scope:
          "Access modifier, enkapsulasi, accessor, mutator/getter-setter, atribut, dan method.",
        summary: {
          overview:
            "Enkapsulasi membungkus data atribut dan method dalam satu unit tertutup serta menyembunyikan detail implementasi internal dari akses luar yang tidak sah (*information hiding*).",
          keyPoints: [
            "**Private (`private` / `#`):** Hanya dapat diakses dari dalam class yang sama tempat ia dideklarasikan.",
            "**Protected (`protected`):** Dapat diakses dari dalam class itu sendiri dan class turunannya (*subclass*).",
            "**Public (`public`):** Dapat diakses secara bebas dari mana saja di luar class.",
            "**Getter (Accessor):** Method publik untuk membaca nilai atribut privat secara terkontrol.",
            "**Setter (Mutator):** Method publik untuk memvalidasi dan mengubah nilai atribut privat sebelum disimpan ke memori.",
          ],
          deepDive:
            "Keuntungan utama enkapsulasi adalah integritas data. Contohnya, pada class `RekeningBank`, atribut `saldo` dideklarasikan private agar tidak bisa diubah sembarangan menjadi nilai negatif dari luar tanpa melalui method setter yang berisi validasi saldo.",
          codeExample: `class RekeningBank {
  private _saldo: number = 0;

  // Setter dengan validasi
  set saldo(nilai: number) {
    if (nilai < 0) throw new Error("Saldo tidak boleh negatif");
    this._saldo = nilai;
  }

  // Getter
  get saldo(): number {
    return this._saldo;
  }
}`,
        },
      },
      {
        id: "pewarisan-inheritance",
        name: "Pewarisan (Inheritance)",
        elementId: 5,
        elementName: "Pemrograman Berorientasi Objek",
        competency:
          "Menerapkan relasi pewarisan antar-class menggunakan mekanisme inheritance yang sesuai dalam rancangan program.",
        scope:
          "Relasi pewarisan antar-class, superclass, subclass, dan mekanisme inheritance.",
        summary: {
          overview:
            "Pewarisan memungkinkan suatu class baru (*subclass / child class*) mengadopsi dan memperluas atribut serta method dari class yang sudah ada (*superclass / parent class*) menggunakan kata kunci `extends`.",
          keyPoints: [
            "**Superclass (Parent):** Class induk yang menurunkan atribut dan method umum.",
            "**Subclass (Child):** Class anak yang mewarisi sifat induk dan dapat menambahkan atribut/method baru yang lebih spesifik.",
            "**Keyword `extends`:** Digunakan saat mendeklarasikan subclass untuk menyatakan relasi pewarisan (*is-a relationship*).",
            "**Keyword `super()`:** Digunakan di constructor subclass untuk memanggil constructor superclass induk.",
            "**Keuntungan:** Mengurangi duplikasi kode dan mempermudah pemeliharaan hierarki model sistem.",
          ],
          deepDive:
            "Relasi pewarisan wajib mengikuti prinsip *is-a* (adalah seorang/sebuah). Contohnya: `Mobil extends Kendaraan` valid karena Mobil *adalah sebuah* Kendaraan. Jika relasinya adalah kepemilikan (*has-a*, misal Mobil memiliki Mesin), gunakan komposisi bukan pewarisan.",
          codeExample: `class Kendaraan {
  protected merk: string;
  constructor(merk: string) { this.merk = merk; }
}

class Mobil extends Kendaraan {
  private jumlahPintu: number;
  constructor(merk: string, jumlahPintu: number) {
    super(merk); // Panggil constructor induk
    this.jumlahPintu = jumlahPintu;
  }
}`,
        },
      },
      {
        id: "polymorphism",
        name: "Polymorphism",
        elementId: 5,
        elementName: "Pemrograman Berorientasi Objek",
        competency:
          "Mengimplementasikan mekanisme polymorphism melalui method overriding atau penggunaan referensi superclass terhadap objek subclass.",
        scope:
          "Polymorphism, method overriding, superclass, subclass, dan referensi objek.",
        summary: {
          overview:
            "Polimorfisme (banyak bentuk) memungkinkan objek-objek dari berbagai subclass yang berbeda diperlakukan sebagai objek dari satu superclass yang sama, namun masing-masing mengeksekusi perilaku spesifiknya sendiri.",
          keyPoints: [
            "**Method Overriding (Runtime Polymorphism):** Subclass menulis ulang implementasi method yang sudah ada di superclass dengan nama, parameter, dan return type yang sama.",
            "**Method Overloading (Compile-time Polymorphism):** Mendefinisikan beberapa method dengan nama yang sama di satu class tetapi memiliki parameter (tipe atau jumlah) yang berbeda.",
            "**Referensi Superclass ke Objek Subclass:** Variabel bertipe superclass dapat menampung instance dari subclass manapun secara fleksibel.",
            "**Class Abstrak & Interface:** Kontrak metode yang mewajibkan subclass untuk menyediakan implementasi konkrit.",
          ],
          deepDive:
            "Kekuatan polimorfisme terlihat saat mengelola kumpulan objek dalam loop: daftar `Hewan[]` dapat berisi instance `Kucing`, `Anjing`, dan `Burung`. Saat method `hewan.bersuara()` dipanggil, program otomatis mengeksekusi suara spesifik dari masing-masing hewan tanpa perlu switch-case manual.",
          codeExample: `class Hewan {
  bersuara(): void { console.log("Bunyi umum hewan"); }
}

class Kucing extends Hewan {
  override bersuara(): void { console.log("Meong!"); }
}

class Anjing extends Hewan {
  override bersuara(): void { console.log("Guk guk!"); }
}

const daftarHewan: Hewan[] = [new Kucing(), new Anjing()];
daftarHewan.forEach(h => h.bersuara()); // Output: "Meong!", lalu "Guk guk!"`,
        },
      },
    ],
  },
];

export function getAllSubElements(): SubElement[] {
  return OFFICIAL_CURRICULUM.flatMap((el) => el.subElements);
}

export function getSubElementById(id: string): SubElement | undefined {
  return getAllSubElements().find((sub) => sub.id === id);
}
