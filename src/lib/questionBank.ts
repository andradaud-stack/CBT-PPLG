import { Difficulty, Question } from "@/types";

export const QUESTION_BANK: Question[] = [
  // ==========================================
  // TOPIC 1: Pemrograman Dasar
  // ==========================================
  {
    id: "pd-01",
    topic: "Pemrograman Dasar",
    difficulty: "mudah",
    type: "single",
    stem: "Manakah di antara tipe data berikut yang paling tepat digunakan untuk menyimpan status kelulusan siswa yang bernilai True atau False?",
    options: [
      { key: "A", text: "String" },
      { key: "B", text: "Integer" },
      { key: "C", text: "Boolean" },
      { key: "D", text: "Float" },
    ],
    correctAnswer: ["C"],
    explanation: "Tipe data **Boolean** merepresentasikan dua nilai kebenaran logika (*truth values*), yaitu `true` atau `false`. Tipe data ini sangat efisien dan standar dalam semua bahasa pemrograman untuk kondisi percabangan logika seperti status kelulusan.",
  },
  {
    id: "pd-02",
    topic: "Pemrograman Dasar",
    difficulty: "sedang",
    type: "single",
    stem: "Perhatikan cuplikan kode algoritma pencarian berikut:\n\n```javascript\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}\n```\n\nBerapakah kompleksitas waktu (*time complexity*) terbaik dan terburuk dari algoritma Binary Search di atas?",
    options: [
      { key: "A", text: "Terbaik: O(1), Terburuk: O(log n)" },
      { key: "B", text: "Terbaik: O(n), Terburuk: O(n^2)" },
      { key: "C", text: "Terbaik: O(log n), Terburuk: O(n)" },
      { key: "D", text: "Terbaik: O(1), Terburuk: O(n)" },
    ],
    correctAnswer: ["A"],
    explanation: "Pada **Binary Search**, skenario terbaik (*best case*) adalah ketika elemen yang dicari langsung berada di posisi tengah (`mid`) pada iterasi pertama, menghasilkan kompleksitas **O(1)**. Sedangkan skenario terburuk (*worst case*) terjadi saat ruang pencarian dibagi dua secara rekursif hingga tersisa 1 elemen, menghasilkan kompleksitas **O(log n)**.",
  },
  {
    id: "pd-03",
    topic: "Pemrograman Dasar",
    difficulty: "sulit",
    type: "multiple",
    stem: "Terkait struktur data Stack (Tumpukan) dan Queue (Antrean), manakah pernyataan di bawah ini yang BENAR? (Pilih lebih dari satu jawaban yang benar)",
    options: [
      { key: "A", text: "Stack beroperasi menggunakan prinsip LIFO (Last In First Out)" },
      { key: "B", text: "Operasi 'enqueue' dan 'dequeue' merupakan istilah operasi standar pada struktur data Queue" },
      { key: "C", text: "Queue beroperasi menggunakan prinsip LIFO" },
      { key: "D", text: "Fitur 'Undo' pada text editor umumnya diimplementasikan memanfaatkan prinsip Stack" },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation: "- **Opsi A Benar:** Stack berprinsip LIFO (elemen terakhir masuk akan pertama keluar).\n- **Opsi B Benar:** Queue memiliki operasi dasar `enqueue` (menambah di belakang) dan `dequeue` (mengambil dari depan).\n- **Opsi C Salah:** Queue berprinsip FIFO (First In First Out), bukan LIFO.\n- **Opsi D Benar:** Operasi Undo menyimpan riwayat aksi terakhir di puncak stack sehingga aksi terakhir dapat dibatalkan terlebih dahulu.",
  },

  // ==========================================
  // TOPIC 2: Pemrograman Web
  // ==========================================
  {
    id: "pw-01",
    topic: "Pemrograman Web",
    difficulty: "mudah",
    type: "single",
    stem: "Tag semantik HTML5 mana yang paling tepat digunakan untuk menandai bagian navigasi utama suatu situs web?",
    options: [
      { key: "A", text: "<section>" },
      { key: "B", text: "<nav>" },
      { key: "C", text: "<header>" },
      { key: "D", text: "<aside>" },
    ],
    correctAnswer: ["B"],
    explanation: "Tag `<nav>` dalam spesifikasi HTML5 diperuntukkan secara semantik untuk mewadahi tautan navigasi utama situs web. Hal ini mempermudah pembaca layar (*screen reader*) dan mesin pencari (SEO) untuk mengenali struktur navigasi.",
  },
  {
    id: "pw-02",
    topic: "Pemrograman Web",
    difficulty: "sedang",
    type: "single",
    stem: "Perhatikan potongan kode CSS Flexbox berikut:\n\n```css\n.container {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-between;\n  align-items: center;\n}\n```\n\nBagaimana susunan elemen anak (*flex items*) di dalam `.container`?",
    options: [
      { key: "A", text: "Elemen berderet vertikal dengan jarak rapat di tengah" },
      { key: "B", text: "Elemen berderet horizontal, tersebar merata dengan elemen pertama di awal dan terakhir di ujung, serta terpusat vertikal" },
      { key: "C", text: "Elemen bertumpuk secara vertikal dan rata kiri" },
      { key: "D", text: "Elemen berderet horizontal dan semuanya menempel di sebelah kiri" },
    ],
    correctAnswer: ["B"],
    explanation: "`flex-direction: row` membuat arah sumbu utama menjadi horizontal. `justify-content: space-between` menyebarkan item secara merata di sepanjang sumbu utama dengan item pertama di pangkal dan item terakhir di ujung tepi. `align-items: center` menyelaraskan item di tengah sumbu silang (*cross-axis*, vertikal).",
  },
  {
    id: "pw-03",
    topic: "Pemrograman Web",
    difficulty: "sulit",
    type: "multiple",
    stem: "Manakah pernyataan yang tepat mengenai perbedaan antara 'localStorage', 'sessionStorage', dan 'cookies' di browser? (Pilih lebih dari satu jawaban yang benar)",
    options: [
      { key: "A", text: "Data di sessionStorage akan otomatis terhapus saat tab atau jendela browser ditutup" },
      { key: "B", text: "localStorage memiliki batas kapasitas penyimpanan yang umumnya lebih besar (sekitar 5-10MB) dibanding cookies (sekitar 4KB)" },
      { key: "C", text: "Cookies otomatis dikirimkan ke server pada setiap HTTP request jika domain cocok" },
      { key: "D", text: "localStorage otomatis dikirimkan ke server pada setiap HTTP request header" },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation: "- **Opsi A Benar:** Masa hidup `sessionStorage` terbatas pada durasi sesi tab aktif.\n- **Opsi B Benar:** Web Storage API (`localStorage` & `sessionStorage`) memiliki kuota ~5MB per origin, sementara Cookies hanya ~4KB.\n- **Opsi C Benar:** Cookies dikirim otomatis via header `Cookie` di setiap request HTTP ke server.\n- **Opsi D Salah:** `localStorage` murni berada di client dan tidak pernah otomatis dikirimkan ke server melalui HTTP request headers.",
  },

  // ==========================================
  // TOPIC 3: Basis Data
  // ==========================================
  {
    id: "bd-01",
    topic: "Basis Data",
    difficulty: "mudah",
    type: "single",
    stem: "Perintah SQL manakah yang termasuk ke dalam kategori Data Manipulation Language (DML)?",
    options: [
      { key: "A", text: "CREATE TABLE" },
      { key: "B", text: "ALTER TABLE" },
      { key: "C", text: "INSERT INTO" },
      { key: "D", text: "DROP DATABASE" },
    ],
    correctAnswer: ["C"],
    explanation: "**INSERT INTO** adalah perintah DML (Data Manipulation Language) yang digunakan untuk memanipulasi data di dalam tabel (bersama `SELECT`, `UPDATE`, `DELETE`). Perintah seperti `CREATE`, `ALTER`, dan `DROP` termasuk ke dalam DDL (Data Definition Language).",
  },
  {
    id: "bd-02",
    topic: "Basis Data",
    difficulty: "sedang",
    type: "single",
    stem: "Diberikan tabel `siswa` (id, nama, nilai, jurusan). Kueri SQL manakah yang tepat untuk menampilkan nama jurusan beserta rata-rata nilai siswa untuk setiap jurusan yang memiliki rata-rata nilai di atas 80?",
    options: [
      { key: "A", text: "SELECT jurusan, AVG(nilai) FROM siswa WHERE AVG(nilai) > 80 GROUP BY jurusan;" },
      { key: "B", text: "SELECT jurusan, AVG(nilai) FROM siswa GROUP BY jurusan HAVING AVG(nilai) > 80;" },
      { key: "C", text: "SELECT jurusan, SUM(nilai) FROM siswa GROUP BY jurusan WHERE nilai > 80;" },
      { key: "D", text: "SELECT jurusan, AVG(nilai) FROM siswa HAVING AVG(nilai) > 80;" },
    ],
    correctAnswer: ["B"],
    explanation: "Fungsi agregat seperti `AVG(nilai)` tidak dapat digunakan langsung di dalam klausa `WHERE`. Untuk menyaring hasil agregasi setelah pengelompokan (`GROUP BY`), SQL mewajibkan penggunaan klausa **`HAVING`**.",
  },
  {
    id: "bd-03",
    topic: "Basis Data",
    difficulty: "sulit",
    type: "multiple",
    stem: "Sebuah tabel relasional dikatakan memenuhi kriteria Bentuk Normal Ketiga (3NF) jika memenuhi syarat apa saja? (Pilih lebih dari satu jawaban yang benar)",
    options: [
      { key: "A", text: "Tabel telah memenuhi kriteria Bentuk Normal Kedua (2NF)" },
      { key: "B", text: "Tidak ada ketergantungan transitif (transitive dependency) di antara atribut non-kunci utama" },
      { key: "C", text: "Setiap kolom bernilai atomik dan tidak memiliki perulangan grup data (1NF)" },
      { key: "D", text: "Semua kolom non-kunci boleh bergantung pada kolom non-kunci lainnya" },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation: "Sebuah tabel berada dalam **3NF** jika:\n1. Memenuhi 1NF (nilai atomik) dan 2NF (tidak ada ketergantungan parsial).\n2. Tidak memiliki ketergantungan transitif, artinya atribut non-primary key tidak boleh bergantung pada atribut non-primary key lainnya.",
  },

  // ==========================================
  // TOPIC 4: Pemrograman Berorientasi Objek (PBO)
  // ==========================================
  {
    id: "pbo-01",
    topic: "Pemrograman Berorientasi Objek",
    difficulty: "mudah",
    type: "single",
    stem: "Prinsip PBO di mana data dibungkus dan akses langsung terhadap atribut dibatasi dengan menggunakan method getter dan setter disebut:",
    options: [
      { key: "A", text: "Polymorphism" },
      { key: "B", text: "Inheritance" },
      { key: "C", text: "Encapsulation" },
      { key: "D", text: "Abstraction" },
    ],
    correctAnswer: ["C"],
    explanation: "**Encapsulation (Enkapsulasi)** adalah pilar OOP untuk melindungi integritas internal objek dengan menyembunyikan data internal (`private`) dan hanya mengizinkan interaksi melalui method perantara (`public getter/setter`).",
  },
  {
    id: "pbo-02",
    topic: "Pemrograman Berorientasi Objek",
    difficulty: "sedang",
    type: "single",
    stem: "Perhatikan konsep OOP berikut:\nSebuah class `Kendaraan` memiliki method `bergerak()`. Class `Mobil` dan `Perahu` mewarisi `Kendaraan` dan masing-masing mengimplementasikan `bergerak()` dengan cara yang berbeda. Konsep ini merupakan contoh penerapan dari:",
    options: [
      { key: "A", text: "Polymorphism (Method Overriding)" },
      { key: "B", text: "Method Overloading statis" },
      { key: "C", text: "Interface Segregation" },
      { key: "D", text: "Multiple Inheritance" },
    ],
    correctAnswer: ["A"],
    explanation: "**Polymorphism (khususnya Method Overriding)** memungkinkan sub-class memberikan implementasi spesifik terhadap method yang sudah dideklarasikan oleh super-class-nya, sehingga satu nama aksi dapat memiliki banyak bentuk perilaku.",
  },
  {
    id: "pbo-03",
    topic: "Pemrograman Berorientasi Objek",
    difficulty: "sulit",
    type: "multiple",
    stem: "Manakah di antara prinsip SOLID berikut yang didefinisikan dengan benar? (Pilih lebih dari satu jawaban yang benar)",
    options: [
      { key: "A", text: "Single Responsibility Principle (SRP): Sebuah class hanya boleh memiliki satu alasan untuk berubah (satu tanggung jawab spesifik)" },
      { key: "B", text: "Open/Closed Principle (OCP): Entitas perangkat lunak harus terbuka untuk ekstensi, namun tertutup untuk modifikasi" },
      { key: "C", text: "Liskov Substitution Principle (LSP): Sub-class harus dapat menggantikan super-class tanpa merusak kebenaran program" },
      { key: "D", text: "Dependency Inversion Principle (DIP): Modul tingkat tinggi harus bergantung langsung pada detail implementasi tingkat rendah" },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation: "Prinsip SOLID:\n- **SRP:** Satu class, satu tanggung jawab.\n- **OCP:** Open for extension, closed for modification.\n- **LSP:** Objek turunan harus dapat saling menggantikan objek induk tanpa efek samping buruk.\n- **DIP:** Modul tingkat tinggi TIDAK BOLEH bergantung pada modul tingkat rendah, melainkan keduanya harus bergantung pada abstraksi (Opsi D salah).",
  },

  // ==========================================
  // TOPIC 5: Pengembangan Aplikasi Mobile
  // ==========================================
  {
    id: "mob-01",
    topic: "Pengembangan Aplikasi Mobile",
    difficulty: "mudah",
    type: "single",
    stem: "Dalam pengembangan aplikasi Android dengan Android Studio, berkas XML manakah yang digunakan untuk mendaftarkan komponen aplikasi (Activity, Service) dan mendeklarasikan izin (permission)?",
    options: [
      { key: "A", text: "build.gradle" },
      { key: "B", text: "AndroidManifest.xml" },
      { key: "C", text: "strings.xml" },
      { key: "D", text: "activity_main.xml" },
    ],
    correctAnswer: ["B"],
    explanation: "**AndroidManifest.xml** adalah berkas deklarasi konfigurasi fundamental pada aplikasi Android yang memuat metadata penting sistem: package name, komponen aplikasi (Activity, Service, Receiver, Provider), izin akses internet/kamera, dan kompatibilitas SDK minimal.",
  },
  {
    id: "mob-02",
    topic: "Pengembangan Aplikasi Mobile",
    difficulty: "sedang",
    type: "single",
    stem: "Pada Flutter, apa perbedaan mendasar antara 'StatelessWidget' dan 'StatefulWidget'?",
    options: [
      { key: "A", text: "StatelessWidget dapat berubah tampilannya saat runtime, sedangkan StatefulWidget bersifat permanen" },
      { key: "B", text: "StatelessWidget tidak memiliki state internal yang dapat berubah sepanjang waktu hidupnya, sedangkan StatefulWidget dapat mempertahankan data yang dinamis dan memicu re-render melalui setState()" },
      { key: "C", text: "StatelessWidget hanya digunakan untuk rendering teks, StatefulWidget untuk gambar" },
      { key: "D", text: "StatelessWidget tidak dapat menerima parameter constructor" },
    ],
    correctAnswer: ["B"],
    explanation: "**StatelessWidget** bersifat *immutable* (tampilannya statis berdasarkan konfigurasi awal). Sedangkan **StatefulWidget** memiliki objek `State` terpisah yang dapat menyimpan nilai variabel yang berubah saat interaksi pengguna dan memperbarui UI dengan memanggil method `setState()`.",
  },
  {
    id: "mob-03",
    topic: "Pengembangan Aplikasi Mobile",
    difficulty: "sulit",
    type: "multiple",
    stem: "Ketika sebuah Activity di Android berpindah ke background karena pengguna membuka aplikasi lain, urutan lifecycle callback apa saja yang dipanggil oleh sistem? (Pilih lebih dari satu jawaban yang benar)",
    options: [
      { key: "A", text: "onPause() dipanggil saat activity kehilangan fokus interaksi" },
      { key: "B", text: "onStop() dipanggil saat activity sudah tidak terlihat lagi oleh pengguna di layar" },
      { key: "C", text: "onDestroy() selalu langsung dipanggil seketika itu juga" },
      { key: "D", text: "onRestart() akan dipanggil saat pengguna kembali membuka activity tersebut" },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation: "Ketika Activity berpindah ke background, sistem memanggil `onPause()` lalu `onStop()`. Activity tidak langsung di-`onDestroy()` kecuali sistem kekurangan memori atau pengguna menutup paksa aplikasi. Ketika pengguna kembali, siklus berlanjut ke `onRestart()` -> `onStart()` -> `onResume()`.",
  },

  // ==========================================
  // TOPIC 6: Pengembangan Gim
  // ==========================================
  {
    id: "gim-01",
    topic: "Pengembangan Gim",
    difficulty: "mudah",
    type: "single",
    stem: "Siklus pemrosesan utama pada game engine yang berjalan berulang kali untuk memperbarui logika dan menggambar frame visual disebut:",
    options: [
      { key: "A", text: "Event Listener" },
      { key: "B", text: "Game Loop" },
      { key: "C", text: "Garbage Collector" },
      { key: "D", text: "Shader Pipeline" },
    ],
    correctAnswer: ["B"],
    explanation: "**Game Loop** adalah inti pemrosesan berulang (*continuous loop*) yang mengeksekusi tiga fase utama secara berkesinambungan: membaca input pemain -> memperbarui logika dunia gim (`Update`) -> me-render grafik ke layar (`Render`).",
  },
  {
    id: "gim-02",
    topic: "Pengembangan Gim",
    difficulty: "sedang",
    type: "single",
    stem: "Dalam Unity Game Engine, method manakah yang paling tepat digunakan untuk menerapkan gaya fisika (misalnya menambahkan gaya dorong pada Rigidbody) agar sinkron dengan interval simulasi fisika?",
    options: [
      { key: "A", text: "Update()" },
      { key: "B", text: "FixedUpdate()" },
      { key: "C", text: "LateUpdate()" },
      { key: "D", text: "Awake()" },
    ],
    correctAnswer: ["B"],
    explanation: "**FixedUpdate()** dipanggil pada interval waktu konstan (*fixed framerate*) yang independen dari framerate grafik perangkat, menjadikannya tempat yang tepat untuk perhitungan kalkulasi fisika (*Physics engine/Rigidbody*).",
  },
  {
    id: "gim-03",
    topic: "Pengembangan Gim",
    difficulty: "sulit",
    type: "multiple",
    stem: "Dalam deteksi tabrakan (*collision detection*) pada game 2D, manakah teknik yang umum digunakan? (Pilih lebih dari satu jawaban yang benar)",
    options: [
      { key: "A", text: "AABB (Axis-Aligned Bounding Box)" },
      { key: "B", text: "Circle / Radius Collision Detection" },
      { key: "C", text: "SAT (Separating Axis Theorem)" },
      { key: "D", text: "Binary Search Tree Collision" },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation: "- **AABB:** Sangat efisien untuk kotak sejajar sumbu.\n- **Circle Collision:** Membandingkan jarak Euclidean dua pusat lingkaran terhadap jumlah radiusnya.\n- **SAT:** Standar de facto untuk poligon cembung (*convex polygons*) berputar.\n- Opsi D bukan algoritma deteksi geometri tabrakan.",
  },

  // ==========================================
  // TOPIC 7: Jaringan Komputer Dasar
  // ==========================================
  {
    id: "net-01",
    topic: "Jaringan Komputer Dasar",
    difficulty: "mudah",
    type: "single",
    stem: "Protokol pada Transport Layer yang bersifat connection-oriented dan menjamin paket data terkirim secara utuh dan berurutan adalah:",
    options: [
      { key: "A", text: "UDP (User Datagram Protocol)" },
      { key: "B", text: "TCP (Transmission Control Protocol)" },
      { key: "C", text: "IP (Internet Protocol)" },
      { key: "D", text: "ICMP (Internet Control Message Protocol)" },
    ],
    correctAnswer: ["B"],
    explanation: "**TCP (Transmission Control Protocol)** melakukan mekanisme *three-way handshake*, *acknowledgment*, dan pengurutan nomor paket (sequence numbering) untuk menjamin data tiba tanpa cacat dan sesuai urutan pengiriman.",
  },
  {
    id: "net-02",
    topic: "Jaringan Komputer Dasar",
    difficulty: "sedang",
    type: "single",
    stem: "Sebuah jaringan komputer memiliki alamat IP 192.168.10.0 dengan subnet mask /26 (255.255.255.192). Berapakah jumlah host yang dapat dialokasikan (usable host IP) pada setiap subnet tersebut?",
    options: [
      { key: "A", text: "62 host" },
      { key: "B", text: "64 host" },
      { key: "C", text: "30 host" },
      { key: "D", text: "126 host" },
    ],
    correctAnswer: ["A"],
    explanation: "Subnet mask /26 memiliki 32 - 26 = 6 bit host. Total alamat IP = 2^6 = 64. Dua alamat tidak dapat digunakan sebagai host: 1 untuk Network ID dan 1 untuk Broadcast ID. Maka usable host = 64 - 2 = **62 host**.",
  },
  {
    id: "net-03",
    topic: "Jaringan Komputer Dasar",
    difficulty: "sulit",
    type: "multiple",
    stem: "Manakah protokol di bawah ini yang bekerja pada Lapisan Aplikasi (Application Layer) dalam model TCP/IP? (Pilih lebih dari satu jawaban yang benar)",
    options: [
      { key: "A", text: "DNS (Domain Name System)" },
      { key: "B", text: "HTTP / HTTPS" },
      { key: "C", text: "SSH (Secure Shell)" },
      { key: "D", text: "ARP (Address Resolution Protocol)" },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation: "DNS (port 53), HTTP/HTTPS (port 80/443), dan SSH (port 22) adalah protokol lapisan aplikasi. Sementara ARP bekerja pada lapisan Network Access / Data Link untuk memetakan IP address ke MAC address.",
  },

  // ==========================================
  // TOPIC 8: Keamanan Siber Dasar
  // ==========================================
  {
    id: "sec-01",
    topic: "Keamanan Siber Dasar",
    difficulty: "mudah",
    type: "single",
    stem: "Jenis serangan rekayasa sosial di mana penyerang menyamar sebagai pihak tepercaya (seperti bank atau admin sekolah) melalui email palsu untuk mencuri kredensial disebut:",
    options: [
      { key: "A", text: "Phishing" },
      { key: "B", text: "DDoS Attack" },
      { key: "C", text: "SQL Injection" },
      { key: "D", text: "Buffer Overflow" },
    ],
    correctAnswer: ["A"],
    explanation: "**Phishing** adalah teknik kejahatan siber berbasis manipulasi psikologis (*social engineering*) untuk mengelabui korban agar menyerahkan informasi sensitif seperti username, password, dan nomor PIN.",
  },
  {
    id: "sec-02",
    topic: "Keamanan Siber Dasar",
    difficulty: "sedang",
    type: "single",
    stem: "Metode paling efektif bagi programmer web untuk mencegah celah keamanan SQL Injection pada kueri basis data adalah:",
    options: [
      { key: "A", text: "Mengganti port default basis data" },
      { key: "B", text: "Menggunakan Prepared Statements dan Parameterized Queries" },
      { key: "C", text: "Menghapus akun root pada database" },
      { key: "D", text: "Memasang sertifikat SSL/HTTPS saja" },
    ],
    correctAnswer: ["B"],
    explanation: "**Prepared Statements (Parameterized Queries)** memisahkan instruksi kode SQL dari input data pengguna. Database memperlakukan input pengguna murni sebagai data literal bertipe, bukan sebagai kode perintah yang dapat dieksekusi, sehingga injeksi SQL mustahil terjadi.",
  },
  {
    id: "sec-03",
    topic: "Keamanan Siber Dasar",
    difficulty: "sulit",
    type: "multiple",
    stem: "Tiga pilar fundamental keamanan informasi yang dikenal dengan 'CIA Triad' terdiri atas: (Pilih lebih dari satu jawaban yang benar)",
    options: [
      { key: "A", text: "Confidentiality (Kerahasiaan data dari akses pihak yang tidak berhak)" },
      { key: "B", text: "Integrity (Keutuhan dan keaslian data yang terlindungi dari manipulasi)" },
      { key: "C", text: "Availability (Ketersediaan sistem dan data saat dibutuhkan oleh pengguna yang sah)" },
      { key: "D", text: "Authorization (Hak istimewa eksekusi kode tingkat sistem)" },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation: "**CIA Triad** adalah pilar standar keamanan siber dunia:\n1. **Confidentiality:** Hanya pihak berwenang yang dapat membaca data.\n2. **Integrity:** Data tidak dimodifikasi secara ilegal dalam penyimpanan maupun transmisi.\n3. **Availability:** Layanan tetap beroperasi andal saat dibutuhkan.",
  },
];

/**
 * Helper untuk menyaring atau mengacak soal simulasi 30 soal sesuai distribusi TKA
 * Distribusi: 9 Mudah (~30%), 12 Sedang (~40%), 9 Sulit (~30%)
 * Campuran: 22-24 Single PG, 6-8 Multiple PG
 */
export function getSimulationQuestions(): Question[] {
  // Ambil semua soal yang ada
  const pool = [...QUESTION_BANK];

  // Jika bank soal memiliki 24 soal inti, kita duplikasi/perkaya varian dengan ID unik agar genap 30 soal
  const questions: Question[] = [];

  // Salin 24 butir soal inti
  pool.forEach((q) => {
    questions.push({ ...q, id: `sim-${q.id}` });
  });

  // Tambahkan 6 butir variasi soal pelengkap agar tepat 30 soal
  const extraPool: Question[] = [
    {
      id: "sim-extra-01",
      topic: "Pemrograman Dasar",
      difficulty: "sedang",
      type: "single",
      stem: "Perhatikan perulangan rekursif berikut:\n\n```python\ndef faktorial(n):\n    if n <= 1:\n        return 1\n    return n * faktorial(n - 1)\n```\n\nKondisi `if n <= 1: return 1` dalam terminologi pemrograman rekursif disebut:",
      options: [
        { key: "A", text: "Base Case (Kondisi Berhenti)" },
        { key: "B", text: "Recursive Step" },
        { key: "C", text: "Infinite Loop Guard" },
        { key: "D", text: "Stack Overflow Handler" },
      ],
      correctAnswer: ["A"],
      explanation: "**Base Case (Kasus Dasar)** adalah kondisi terminasi di mana pemanggilan rekursif berhenti dan mulai mengembalikan nilai ke tumpukan sebelumnya, mencegah terjadinya `RecursionError` atau stack overflow.",
    },
    {
      id: "sim-extra-02",
      topic: "Pemrograman Web",
      difficulty: "sedang",
      type: "single",
      stem: "Di dalam ekosistem JavaScript modern, metode Array manakah yang mengembalikan array baru berisi hasil pemrosesan setiap elemen tanpa memodifikasi array aslinya (bersifat immutable)?",
      options: [
        { key: "A", text: "Array.prototype.map()" },
        { key: "B", text: "Array.prototype.push()" },
        { key: "C", text: "Array.prototype.splice()" },
        { key: "D", text: "Array.prototype.reverse()" },
      ],
      correctAnswer: ["A"],
      explanation: "`map()` mentransformasi setiap elemen dan mengembalikan array baru tanpa mengubah (*mutate*) array asal, menjadikannya fungsi murni (*pure function*) yang disukai dalam paradigma fungsional.",
    },
    {
      id: "sim-extra-03",
      topic: "Basis Data",
      difficulty: "sulit",
      type: "single",
      stem: "Operasi SQL JOIN manakah yang mengembalikan seluruh baris dari tabel sebelah kiri (tabel pertama), serta baris yang cocok dari tabel sebelah kanan, dan mengisi nilai NULL untuk kolom kanan jika tidak ada kecocokan?",
      options: [
        { key: "A", text: "INNER JOIN" },
        { key: "B", text: "LEFT OUTER JOIN" },
        { key: "C", text: "RIGHT OUTER JOIN" },
        { key: "D", text: "FULL OUTER JOIN" },
      ],
      correctAnswer: ["B"],
      explanation: "**LEFT JOIN (atau LEFT OUTER JOIN)** menjamin bahwa setiap baris pada tabel sisi kiri akan selalu ditampilkan pada set hasil, terlepas dari apakah ada kecocokan relasi pada tabel sisi kanan.",
    },
    {
      id: "sim-extra-04",
      topic: "Pemrograman Berorientasi Objek",
      difficulty: "sedang",
      type: "single",
      stem: "Keyword apa di Java atau TypeScript yang digunakan oleh sub-class untuk memanggil constructor dari class induknya?",
      options: [
        { key: "A", text: "this()" },
        { key: "B", text: "super()" },
        { key: "C", text: "parent()" },
        { key: "D", text: "base()" },
      ],
      correctAnswer: ["B"],
      explanation: "Keyword **`super()`** digunakan di dalam constructor sub-class untuk mengeksekusi constructor milik super-class induk dan menginisialisasi properti turunan.",
    },
    {
      id: "sim-extra-05",
      topic: "Jaringan Komputer Dasar",
      difficulty: "mudah",
      type: "single",
      stem: "Perangkat jaringan fisik layer 3 OSI yang bertugas membaca alamat IP tujuan dan meneruskan paket antar jaringan yang berbeda subnet disebut:",
      options: [
        { key: "A", text: "Hub" },
        { key: "B", text: "Switch Layer 2" },
        { key: "C", text: "Router" },
        { key: "D", text: "Repeater" },
      ],
      correctAnswer: ["C"],
      explanation: "**Router** beroperasi pada Layer 3 (Network Layer) model OSI dan menggunakan routing table berbasis IP address untuk menghubungkan dua atau lebih jaringan komputer dengan subnet berbeda.",
    },
    {
      id: "sim-extra-06",
      topic: "Keamanan Siber Dasar",
      difficulty: "sedang",
      type: "multiple",
      stem: "Manakah praktik di bawah ini yang tergolong sebagai pertahanan keamanan siber yang baik untuk pengembangan aplikasi web? (Pilih lebih dari satu jawaban yang benar)",
      options: [
        { key: "A", text: "Menerapkan hashing password menggunakan algoritma lambat seperti bcrypt atau Argon2, bukan MD5" },
        { key: "B", text: "Menyimpan API Key rahasia di dalam repositori publik GitHub agar mudah diakses tim" },
        { key: "C", text: "Menerapkan HTTP Security Headers seperti Content-Security-Policy (CSP) dan X-Frame-Options" },
        { key: "D", text: "Melakukan validasi dan sanitasi pada seluruh data input dari pengguna di sisi server" },
      ],
      correctAnswer: ["A", "C", "D"],
      explanation: "- **Opsi A Benar:** Algoritma bcrypt/Argon2 dirancang lambat terhadap brute-force, sementara MD5 sudah usang dan rentan.\n- **Opsi B Salah:** Menyimpan secret key di git publik merupakan pelanggaran keamanan fatal.\n- **Opsi C Benar:** Header CSP mencegah serangan Cross-Site Scripting (XSS).\n- **Opsi D Benar:** Validasi server-side adalah benteng pertahanan utama terhadap injeksi dan manipulasi input.",
    },
  ];

  extraPool.forEach((q) => questions.push(q));

  // Tepat 30 butir soal: 9 Mudah, 12 Sedang, 9 Sulit
  return questions;
}

export function getPracticeQuestion(topic: string, difficulty?: Difficulty): Question {
  const matching = QUESTION_BANK.filter((q) => {
    const matchTopic = !topic || q.topic.toLowerCase() === topic.toLowerCase();
    const matchDiff = !difficulty || q.difficulty === difficulty;
    return matchTopic && matchDiff;
  });

  if (matching.length > 0) {
    const randomIndex = Math.floor(Math.random() * matching.length);
    return matching[randomIndex];
  }

  // Fallback to any question in topic
  const topicOnly = QUESTION_BANK.filter((q) => !topic || q.topic.toLowerCase() === topic.toLowerCase());
  if (topicOnly.length > 0) {
    return topicOnly[Math.floor(Math.random() * topicOnly.length)];
  }

  return QUESTION_BANK[0];
}
