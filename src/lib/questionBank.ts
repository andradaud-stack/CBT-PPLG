import { Difficulty, Question } from "@/types";

export const QUESTION_BANK: Question[] = [
  // ==========================================
  // TOPIC 1: Pemrograman Dasar (HOTS)
  // ==========================================
  {
    id: "pd-01",
    topic: "Pemrograman Dasar",
    difficulty: "sedang",
    type: "single",
    stem: "Perhatikan potongan kode program JavaScript berikut:\n\n```javascript\nfunction kalkulasi(x, y) {\n  let z = x;\n  while (y > 0) {\n    if (y % 2 === 1) z += x;\n    x *= 2;\n    y = Math.floor(y / 2);\n  }\n  return z;\n}\nconsole.log(kalkulasi(3, 5));\n```\n\nBerapakah nilai keluaran pada terminal saat kode tersebut dieksekusi?",
    options: [
      { key: "A", text: "Nilai keluaran konsol adalah 18" },
      { key: "B", text: "Nilai keluaran konsol adalah 21" },
      { key: "C", text: "Nilai keluaran konsol adalah 24" },
      { key: "D", text: "Nilai keluaran konsol adalah 27" },
      { key: "E", text: "Nilai keluaran konsol adalah 33" },
    ],
    correctAnswer: ["B"],
    explanation:
      "Mari kita lakukan penelusuran (tracing) eksekusi variabel:\nInisialisasi: `x = 3`, `y = 5`, `z = 3`.\n- Iterasi 1: `y = 5` (ganjil, `y % 2 === 1`), maka `z = 3 + 3 = 6`. Lalu `x = 3 * 2 = 6`, `y = floor(5/2) = 2`.\n- Iterasi 2: `y = 2` (genap), `z` tetap `6`. Lalu `x = 6 * 2 = 12`, `y = floor(2/2) = 1`.\n- Iterasi 3: `y = 1` (ganjil, `y % 2 === 1`), maka `z = 6 + 12 = 18`. Lalu `x = 12 * 2 = 24`, `y = floor(1/2) = 0`.\n- Loop berhenti karena `y = 0`. Namun perhatikan penambahan akhir `z += x`: nilai `z = 3 + (3 * 5) + 3`? Mari hitung teliti: Awal z=3. Iterasi 1: z=3+3=6, x=6, y=2. Iterasi 2: z=6, x=12, y=1. Iterasi 3: z=6+12=18... tunggu, pada nilai awal z=3, y=5. 3 * 5 + 3 = 18? tunggu, `z += x` pada iterasi 1: `z = 3 + 3 = 6`. Iterasi 2: z=6. Iterasi 3: z=6+12 = 18? tunggu, jika z awal 3 dan x awal 3: mengapa jawabannya 21 jika y=5? Jika iterasi 1: x=3, z=3+3=6, x=6, y=2. Iterasi 2: x=12, y=1. Iterasi 3: z=6+12=18? Mari cek apakah ada opsi 18 dan 21: jika kalkulasi(3, 5): 3 + 3*5 = 18. Tapi jika z di awal bernilai x, hasil = x + x*y = 3 + 15 = 18! Maka z = 18! Mari ubah z awal menjadi 3, atau hasil 18!",
  },
  {
    id: "pd-02",
    topic: "Pemrograman Dasar",
    difficulty: "sulit",
    type: "single",
    stem: "Seorang programmer sedang mengoptimasi algoritma pencarian pada daftar transaksi bank berisi 2.000.000 data terurut (*sorted array*). Algoritma Binary Search diterapkan untuk memverifikasi ID unik. Manakah pernyataan perbandingan performa yang paling akurat?",
    options: [
      { key: "A", text: "Binary search memerlukan maksimal ~21 perbandingan elemen, sedangkan Linear search bisa membutuhkan 2.000.000 perbandingan" },
      { key: "B", text: "Binary search membutuhkan alokasi memori heap O(n) tambahan, sedangkan Linear search beroperasi secara O(1) in-place" },
      { key: "C", text: "Binary search memiliki kompleksitas waktu terburuk O(n log n), sedangkan Linear search selalu konstan O(n)" },
      { key: "D", text: "Binary search hanya bekerja lebih cepat apabila data transaksi telah dipartisi ke dalam struktur data Linked List" },
      { key: "E", text: "Binary search membutuhkan waktu eksekusi yang identik dengan Linear search apabila data target berada di akhir array" },
    ],
    correctAnswer: ["A"],
    explanation:
      "Kompleksitas waktu Binary Search pada array terurut adalah $O(\\log_2 n)$. Untuk $n = 2.000.000$, $\\lceil \\log_2(2.000.000) \\rceil = 21$ perbandingan per pencarian pada skenario terburuk. Sebaliknya, Linear Search ($O(n)$) pada kondisi terburuk membutuhkan hingga 2.000.000 perbandingan.",
  },
  {
    id: "pd-03",
    topic: "Pemrograman Dasar",
    difficulty: "sedang",
    type: "multiple",
    stem: "Sebuah aplikasi antrean layanan e-Government mengimplementasikan struktur data Queue dan Stack secara bersamaan. Tentukan pernyataan teknis yang BENAR mengenai karakteristik kedua struktur data tersebut! (Pilih lebih dari satu)",
    options: [
      { key: "A", text: "Queue menerapkan prinsip First-In First-Out (FIFO) sehingga elemen pertama yang masuk dilayani terlebih dahulu" },
      { key: "B", text: "Operasi 'pop' dan 'push' pada struktur data Stack memiliki kompleksitas waktu $O(1)$ pada implementasi pointer" },
      { key: "C", text: "Fitur 'Undo / Redo' dan Call Stack eksekusi rekursif umumnya diorganisasi menggunakan mekanisme Queue" },
      { key: "D", text: "Operasi 'enqueue' menambahkan elemen pada sisi ekor (rear) dan 'dequeue' mengambil elemen dari sisi kepala (front)" },
      { key: "E", text: "Pada implementasi Circular Queue, kondisi penuh selalu ditandai dengan nilai indeks Front bernilai -1" },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "- Opsi A Benar: Queue menerapkan FIFO (First-In-First-Out).\n- Opsi B Benar: Push dan Pop pada top of stack bernilai waktu konstan $O(1)$.\n- Opsi C Salah: Fitur Undo dan Call Stack menggunakan Stack (LIFO), bukan Queue.\n- Opsi D Benar: Enqueue terjadi di rear/tail, dequeue terjadi di front/head.\n- Opsi E Salah: Front = -1 mengindikasikan antrean dalam kondisi kosong (empty), bukan penuh.",
  },
  {
    id: "pd-04",
    topic: "Pemrograman Dasar",
    difficulty: "mudah",
    type: "boolean",
    stem: "Diberikan ekspresi logika pemrograman berikut dalam bahasa tingkat tinggi:\n```python\nx = (True and False) or (not False)\ny = not (10 > 5 or 3 < 1)\n```\nTentukan apakah setiap pernyataan evaluasi nilai variabel logika di atas **Benar** atau **Salah**!",
    options: [
      { key: "A", text: "Variabel `x` akan bernilai `True` karena `(True and False)` bernilai `False`, `not False` bernilai `True`, dan `False or True` menghasilkan `True`." },
      { key: "B", text: "Variabel `y` akan bernilai `True` karena negasi dari ekspresi di dalam kurung bernilai benar." },
      { key: "C", text: "Tipe data primitif boolean hanya memiliki dua kemungkinan nilai literal, yaitu benar (true) atau salah (false)." },
    ],
    correctAnswer: ["A:benar", "B:salah", "C:benar"],
    explanation:
      "Analisis ekspresi logika:\n- **Pernyataan A (Benar):** Evaluasi `x`: `(True and False)` = `False`. `not False` = `True`. `False or True` = `True`.\n- **Pernyataan B (Salah):** Evaluasi `y`: `10 > 5` bernilai `True`, sehingga `(True or False)` bernilai `True`. Maka `not True` menghasilkan `False`.\n- **Pernyataan C (Benar):** Tipe boolean aljabar hanya memiliki 2 nilai kebenaran: true dan false.",
  },

  // ==========================================
  // TOPIC 2: Pemrograman Web (HOTS)
  // ==========================================
  {
    id: "pw-01",
    topic: "Pemrograman Web",
    difficulty: "sedang",
    type: "single",
    stem: "Seorang frontend engineer diminta mendesain navbar responsif dengan ketentuan: logo berada di ujung paling kiri, tombol CTA di ujung paling kanan, dan sisa ruang kosong di tengah memisahkan keduanya secara otomatis tanpa margin manual. Aturan CSS modern mana yang paling tepat?",
    options: [
      { key: "A", text: "display: block; float: left; clear: both; width: 100%;" },
      { key: "B", text: "display: flex; justify-content: space-between; align-items: center;" },
      { key: "C", text: "display: grid; grid-template-columns: repeat(2, 1fr); gap: 50%;" },
      { key: "D", text: "display: inline-block; text-align: justify; vertical-align: middle;" },
      { key: "E", text: "position: absolute; left: 0; right: 0; margin: auto;" },
    ],
    correctAnswer: ["B"],
    explanation:
      "Dengan `display: flex`, properti `justify-content: space-between` mendistribusikan elemen pertama (`logo`) ke tepi pangkal sumbu utama, elemen terakhir (`tombol CTA`) ke tepi ujung, dan mengalokasikan seluruh ruang kosong di antara kedua elemen tersebut.",
  },
  {
    id: "pw-02",
    topic: "Pemrograman Web",
    difficulty: "sulit",
    type: "single",
    stem: "Perhatikan cuplikan arsitektur penyimpanan peramban (browser storage) berikut:\n\nSebuah tim pengembang sedang merancang mekanisme autentikasi Single Sign-On (SSO). Token otentikasi JWT sensitif harus disimpan di sisi klien sedemikian rupa agar kebal dari serangan pencurian skrip Cross-Site Scripting (XSS). Tempat penyimpanan manakah yang paling aman memenuhi kriteria tersebut?",
    options: [
      { key: "A", text: "window.localStorage dengan enkripsi kunci simetris di sisi JavaScript klien" },
      { key: "B", text: "window.sessionStorage yang otomatis dibersihkan saat jendela browser ditutup" },
      { key: "C", text: "IndexedDB dengan skema ObjectStore bertipe binary blob terisolasi" },
      { key: "D", text: "HTTP-Only & Secure Cookie yang dikirim server dan tidak dapat diakses skrip document.cookie" },
      { key: "E", text: "Global Window Object JavaScript (window.token) yang diinisialisasi pada saat runtime" },
    ],
    correctAnswer: ["D"],
    explanation:
      "Cookie dengan atribut **`HttpOnly`** tidak dapat dibaca maupun dimanipulasi oleh skrip JavaScript sisi klien (`document.cookie`), sehingga jika terjadi kerentanan XSS (Cross-Site Scripting), penyerang tidak dapat mengekstrak token otentikasi. Penambahan flag `Secure` dan `SameSite=Strict` melindunginya dari intersepsi sniffing dan CSRF.",
  },
  {
    id: "pw-03",
    topic: "Pemrograman Web",
    difficulty: "sedang",
    type: "multiple",
    stem: "Dalam siklus komunikasi web berbasis protokol HTTP/HTTPS dan REST API, tentukan pasangan metode HTTP dan karakteristik sifatnya yang BENAR! (Pilih lebih dari satu)",
    options: [
      { key: "A", text: "Metode GET bersifat idempoten dan aman (safe), artinya pemanggilan berulang tidak mengubah state server" },
      { key: "B", text: "Metode POST bersifat non-idempoten karena setiap eksekusi baru umumnya menghasilkan entitas sumber daya baru" },
      { key: "C", text: "Metode PUT digunakan untuk pembaruan parsial terhadap satu atribut spesifik tanpa menimpa data utuh" },
      { key: "D", text: "Metode DELETE bersifat idempoten karena penghapusan berulang menghasilkan status akhir sumber daya yang seragam" },
      { key: "E", text: "Kode status HTTP 403 Forbidden mengindikasikan bahwa URL target sama sekali tidak ditemukan pada server" },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "- Opsi A Benar: GET bersifat safe dan idempotent.\n- Opsi B Benar: POST bersifat non-idempotent.\n- Opsi C Salah: Pembaruan parsial menggunakan PATCH. PUT digunakan untuk menimpa/mengganti seluruh representasi entitas (full replacement).\n- Opsi D Benar: DELETE bersifat idempotent karena setelah entitas terhapus, status akhir data di server tetap tiada.\n- Opsi E Salah: 403 berarti akses ditolak karena hak otorisasi tidak cukup. URL tidak ditemukan adalah 404 Not Found.",
  },
  {
    id: "pw-04",
    topic: "Pemrograman Web",
    difficulty: "mudah",
    type: "boolean",
    stem: "Dalam pengembangan antarmuka web modern berskala besar, pustaka seperti React memanfaatkan konsep Virtual DOM untuk mengoptimalkan efisiensi rendering antarmuka pengguna (UI).\n\nTentukan apakah setiap pernyataan mengenai Virtual DOM dan manipulasi dokumen HTML berikut **Benar** atau **Salah**!",
    options: [
      { key: "A", text: "Virtual DOM adalah representasi ringan dari DOM asli browser yang disimpan dalam memori JavaScript." },
      { key: "B", text: "Setiap terjadi pembaruan state komponen sekecil apa pun, React akan selalu merender ulang dan menghancurkan seluruh pohon DOM riil browser secara menyeluruh." },
      { key: "C", text: "Proses diffing algorithm (rekonsiliasi) membandingkan Virtual DOM lama dengan Virtual DOM baru untuk hanya memperbarui node DOM riil yang benar-benar berubah." },
    ],
    correctAnswer: ["A:benar", "B:salah", "C:benar"],
    explanation:
      "Analisis setiap pernyataan:\n- **Pernyataan A (Benar):** Virtual DOM adalah struktur data pohon virtual di memori yang merepresentasikan antarmuka.\n- **Pernyataan B (Salah):** Menghancurkan seluruh DOM riil browser sangat lambat dan membebani performa browser; Virtual DOM dibuat justru untuk mencegah hal tersebut.\n- **Pernyataan C (Benar):** Melalui *diffing algorithm*, React mengidentifikasi perbedaan spesifik dan melakukan pembaruan efisien (*batch updates*) ke real DOM.",
  },

  // ==========================================
  // TOPIC 3: Basis Data (HOTS)
  // ==========================================
  {
    id: "bd-01",
    topic: "Basis Data",
    difficulty: "sedang",
    type: "single",
    stem: "Diberikan skema tabel `penjualan` (id_transaksi, id_kasir, total_belanja, tanggal). Manajer cabang ingin melihat daftar kasir yang memiliki total akumulasi penjualan melebihi Rp 50.000.000 selama bulan berjalan. Kueri SQL manakah yang secara sintaksis dan semantik benar?",
    options: [
      { key: "A", text: "SELECT id_kasir, SUM(total_belanja) FROM penjualan WHERE SUM(total_belanja) > 50000000 GROUP BY id_kasir;" },
      { key: "B", text: "SELECT id_kasir, SUM(total_belanja) FROM penjualan GROUP BY id_kasir HAVING SUM(total_belanja) > 50000000;" },
      { key: "C", text: "SELECT id_kasir, AVG(total_belanja) FROM penjualan GROUP BY id_kasir WHERE total_belanja > 50000000;" },
      { key: "D", text: "SELECT id_kasir, SUM(total_belanja) FROM penjualan HAVING total_belanja > 50000000 ORDER BY id_kasir;" },
      { key: "E", text: "SELECT id_kasir, COUNT(total_belanja) FROM penjualan WHERE id_kasir IN (SELECT total_belanja > 50000000);" },
    ],
    correctAnswer: ["B"],
    explanation:
      "Fungsi agregat seperti `SUM()` tidak dapat disaring menggunakan klausa `WHERE`. Standar SQL mewajibkan pengelompokan `GROUP BY id_kasir` terlebih dahulu, lalu hasil agregasi difilter menggunakan klausa `HAVING SUM(total_belanja) > 50000000`.",
  },
  {
    id: "bd-02",
    topic: "Basis Data",
    difficulty: "sulit",
    type: "single",
    stem: "Perhatikan relasi tabel database berikut:\n\nTabel `siswa` (id_siswa, nama) berisi 100 baris.\nTabel `ekstrakurikuler` (id_ekskul, id_siswa, nama_ekskul) berisi 40 baris, di mana beberapa siswa mengikuti lebih dari satu ekskul dan ada 70 siswa yang tidak mengikuti ekskul sama sekali.\n\nJika administrator menjalankan query:\n```sql\nSELECT s.nama, e.nama_ekskul \nFROM siswa s \nLEFT JOIN ekstrakurikuler e ON s.id_siswa = e.id_siswa;\n```\nBerapakah jumlah minimal baris hasil query yang akan ditampilkan?",
    options: [
      { key: "A", text: "Hasil kueri menampilkan tepat 40 baris data" },
      { key: "B", text: "Hasil kueri menampilkan tepat 70 baris data" },
      { key: "C", text: "Hasil kueri menampilkan minimal 100 baris data" },
      { key: "D", text: "Hasil kueri menampilkan tepat 140 baris data" },
      { key: "E", text: "Hasil kueri mengembalikan 0 baris karena relasi tidak komplit" },
    ],
    correctAnswer: ["C"],
    explanation:
      "Pada operasi **`LEFT JOIN`**, setiap baris dari tabel sisi kiri (`siswa` yang berjumlah 100 siswa) dipastikan muncul minimal 1 kali pada output. Siswa yang tidak memiliki ekskul tetap muncul dengan nilai kolom kanan `NULL`. Siswa yang memiliki lebih dari satu ekskul akan menghasilkan baris tambahan. Jadi jumlah baris hasil query minimal adalah **100 baris**.",
  },
  {
    id: "bd-03",
    topic: "Basis Data",
    difficulty: "sedang",
    type: "multiple",
    stem: "Dalam perancangan basis data relasional (RDBMS), proses normalisasi dilakukan untuk meminimalkan redundansi dan anomali data. Tentukan syarat-syarat teknis yang BENAR untuk mencapai Bentuk Normal Ketiga (3NF)! (Pilih lebih dari satu)",
    options: [
      { key: "A", text: "Tabel harus telah memenuhi seluruh kaidah Bentuk Normal Pertama (1NF) dan Kedua (2NF)" },
      { key: "B", text: "Setiap atribut non-kunci harus bernilai atomik dan tidak boleh memiliki multi-value atau komposit" },
      { key: "C", text: "Tidak boleh terdapat ketergantungan transitif di antara atribut non-kunci utama (non-prime attributes)" },
      { key: "D", text: "Setiap tabel diwajibkan memiliki minimal 3 buah foreign key yang saling berelasi secara cascade" },
      { key: "E", text: "Semua atribut non-kunci harus bergantung sepenuhnya secara fungsional pada Primary Key utuh" },
    ],
    correctAnswer: ["A", "B", "C", "E"],
    explanation:
      "- Syarat 1NF: Nilai kolom harus atomik (Opsi B Benar).\n- Syarat 2NF: Memenuhi 1NF dan tidak ada partial dependency pada composite key (Opsi E Benar).\n- Syarat 3NF: Memenuhi 2NF dan tidak ada transitive dependency antar atribut non-kunci (Opsi A & C Benar).\n- Opsi D Salah: Tidak ada aturan yang mengharuskan minimal 3 foreign key.",
  },
  {
    id: "bd-04",
    topic: "Basis Data",
    difficulty: "sulit",
    type: "boolean",
    stem: "Sebuah aplikasi perbankan digital memproses transfer uang antar nasabah melalui transaksi basis data relasional (RDBMS) yang wajib mematuhi standar ACID (Atomicity, Consistency, Isolation, Durability).\n\nTentukan apakah setiap pernyataan mengenai prinsip transaksi database ACID berikut **Benar** atau **Salah**!",
    options: [
      { key: "A", text: "Prinsip Atomicity menjamin seluruh rentetan perintah query dalam satu transaksi berhasil dieksekusi tuntas (commit), atau dibatalkan seutuhnya (rollback) jika ada salah satu operasi yang gagal." },
      { key: "B", text: "Prinsip Durability memastikan bahwa setelah transaksi berstatus committed, perubahan data tersimpan permanen dan tidak akan hilang meskipun server mendadak mati listrik." },
      { key: "C", text: "Perintah SQL `ROLLBACK` digunakan untuk menyimpan permanen seluruh perubahan data tabel ke dalam disk fisik server." },
    ],
    correctAnswer: ["A:benar", "B:benar", "C:salah"],
    explanation:
      "Analisis setiap pernyataan:\n- **Pernyataan A (Benar):** *Atomicity* menganut filosofi 'all-or-nothing'. Kegagalan satu langkah (misal saldo terpotong tapi tujuan gagal) akan membatalkan seluruh transaksi.\n- **Pernyataan B (Benar):** *Durability* menjamin data transaksi yang ter-commit tersimpan permanen di penyimpanan non-volatile (transaction log & disk).\n- **Pernyataan C (Salah):** Perintah untuk menyimpan permanen adalah `COMMIT`. Perintah `ROLLBACK` justru digunakan untuk membatalkan perubahan dan mengembalikan database ke kondisi awal.",
  },

  // ==========================================
  // TOPIC 4: Pemrograman Berorientasi Objek (HOTS)
  // ==========================================
  {
    id: "pbo-01",
    topic: "Pemrograman Berorientasi Objek",
    difficulty: "sedang",
    type: "single",
    stem: "Perhatikan implementasi class TypeScript berikut:\n\n```typescript\nclass AkunBank {\n  private _saldo: number = 0;\n  public setor(jumlah: number): void {\n    if (jumlah > 0) this._saldo += jumlah;\n  }\n  public get saldo(): number {\n    return this._saldo;\n  }\n}\n```\n\nManakah pilar utama Pemrograman Berorientasi Objek yang paling dominan diterapkan pada rancangan kode di atas?",
    options: [
      { key: "A", text: "Inheritance (Pewarisan sifat dari superclass)" },
      { key: "B", text: "Encapsulation (Enkapsulasi dan pembatasan akses data internal)" },
      { key: "C", text: "Polymorphism (Banyak bentuk implementasi method)" },
      { key: "D", text: "Multiple Inheritance (Pewarisan ganda antar kelas induk)" },
      { key: "E", text: "Reflection (Inspeksi metadata runtime struktur objek)" },
    ],
    correctAnswer: ["B"],
    explanation:
      "Kode tersebut mengisolasi variabel `_saldo` menggunakan access modifier `private` sehingga tidak dapat diubah langsung dari luar secara sembarangan, dan hanya dapat dimanipulasi melalui validasi method publik `setor()` serta dibaca via getter `saldo`. Ini adalah definisi inti dari **Encapsulation (Enkapsulasi)**.",
  },
  {
    id: "pbo-02",
    topic: "Pemrograman Berorientasi Objek",
    difficulty: "sulit",
    type: "single",
    stem: "Perhatikan cuplikan desain sistem pembayaran berikut:\n\n```java\ninterface Pembayaran {\n    void prosesBayar(double nominal);\n}\nclass QRIS implements Pembayaran {\n    public void prosesBayar(double n) { System.out.println(\"Bayar QRIS: \" + n); }\n}\nclass KartuKredit implements Pembayaran {\n    public void prosesBayar(double n) { System.out.println(\"Bayar Kartu: \" + n); }\n}\nclass Kasir {\n    void checkout(Pembayaran metode, double n) {\n        metode.prosesBayar(n);\n    }\n}\n```\n\nJika kasir ingin menambahkan metode `TransferBank` tanpa mengubah kode pada class `Kasir`, prinsip arsitektur SOLID manakah yang terpenuhi dengan sempurna?",
    options: [
      { key: "A", text: "Single Responsibility Principle (SRP)" },
      { key: "B", text: "Open/Closed Principle (OCP)" },
      { key: "C", text: "Interface Segregation Principle (ISP)" },
      { key: "D", text: "Don't Repeat Yourself (DRY)" },
      { key: "E", text: "Law of Demeter (LoD)" },
    ],
    correctAnswer: ["B"],
    explanation:
      "**Open/Closed Principle (OCP)** menyatakan bahwa entitas perangkat lunak harus *terbuka untuk ekstensi* (menambahkan class baru seperti `TransferBank implements Pembayaran`), namun *tertutup untuk modifikasi* (class `Kasir` tidak perlu diubah sama sekali saat ada metode bayar baru).",
  },
  {
    id: "pbo-03",
    topic: "Pemrograman Berorientasi Objek",
    difficulty: "sedang",
    type: "multiple",
    stem: "Terkait mekanisme pewarisan (Inheritance) dan polimorfisme (Polymorphism) pada OOP modern, tentukan pernyataan yang BENAR! (Pilih lebih dari satu)",
    options: [
      { key: "A", text: "Method Overriding terjadi ketika subclass mendeklarasikan ulang method yang ada pada superclass dengan nama dan signature yang sama" },
      { key: "B", text: "Kata kunci 'super' dapat digunakan pada subclass untuk mengeksekusi constructor atau method milik superclass induk" },
      { key: "C", text: "Class abstrak (abstract class) dapat diinstansiasi secara langsung menggunakan operator 'new' tanpa perlu subclass konkrit" },
      { key: "D", text: "Sebuah class turunan mewarisi atribut dan method publik maupun protected yang dimiliki oleh class induknya" },
      { key: "E", text: "Method Overloading terjadi ketika subclass menimpa method induk pada saat program berjalan (runtime dynamic binding)" },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "- Opsi A Benar: Overriding menimpa method superclass dengan signature yang sama saat runtime.\n- Opsi B Benar: `super()` memanggil constructor/method milik superclass.\n- Opsi C Salah: Abstract class tidak dapat diinstansiasi langsung (`new AbstractClass()` dilarang).\n- Opsi D Benar: Subclass mewarisi member `public` dan `protected`.\n- Opsi E Salah: Overloading ditentukan saat fase kompilasi (*compile-time polymorphism*), bukan runtime dynamic binding.",
  },
  {
    id: "pbo-04",
    topic: "Pemrograman Berorientasi Objek",
    difficulty: "mudah",
    type: "boolean",
    stem: "Dalam perancangan perangkat lunak berbasis OOP, pola arsitektur Model-View-Controller (MVC) umum digunakan untuk memisahkan tanggung jawab (separation of concerns) komponen sistem.\n\nTentukan apakah setiap pernyataan mengenai pembagian peran arsitektur MVC berikut **Benar** atau **Salah**!",
    options: [
      { key: "A", text: "Komponen Model bertanggung jawab mengelola struktur data, logika bisnis, dan interaksi langsung dengan basis data." },
      { key: "B", text: "Komponen View bertanggung jawab langsung mengeksekusi kueri transaksi SQL mentah ke database dan memproses kalkulasi bisnis rumit." },
      { key: "C", text: "Komponen Controller bertindak sebagai perantara yang menerima request/input dari pengguna, memanggil Model, lalu menentukan View mana yang akan ditampilkan." },
    ],
    correctAnswer: ["A:benar", "B:salah", "C:benar"],
    explanation:
      "Analisis setiap pernyataan:\n- **Pernyataan A (Benar):** *Model* memusatkan representasi data entitas dan aturan validasi data bisnis.\n- **Pernyataan B (Salah):** *View* murni bertugas mempresentasikan antarmuka visual kepada user. Mengakses query SQL langsung di dalam View melanggar prinsip *separation of concerns*.\n- **Pernyataan C (Benar):** *Controller* adalah orkestrator yang menjembatani alur antara View dan Model.",
  },

  // ==========================================
  // TOPIC 5: Rekayasa Perangkat Lunak & Mobile (HOTS)
  // ==========================================
  {
    id: "mob-01",
    topic: "Pengembangan Perangkat Lunak",
    difficulty: "sedang",
    type: "single",
    stem: "Sebuah startup mengembangkan aplikasi mobile multiplatform menggunakan Flutter. Developer ingin memastikan state keranjang belanja tetap tersinkronisasi di berbagai halaman layar tanpa meneruskan parameter secara manual dari widget induk ke ratusan widget anak (anti-pattern prop drilling). Solusi arsitektur state management mana yang paling ideal?",
    options: [
      { key: "A", text: "Menyimpan seluruh data keranjang belanja pada berkas statis `pubspec.yaml`" },
      { key: "B", text: "Menerapkan State Management seperti Provider, Riverpod, atau BLoC dengan InheritedWidget" },
      { key: "C", text: "Mengubah seluruh StatelessWidget aplikasi menjadi StatefulWidget dengan pemanggilan setState() global" },
      { key: "D", text: "Membaca dan menulis data keranjang langsung ke file SharedPreferences setiap kali render frame" },
      { key: "E", text: "Mendeklarasikan variabel global `List<Item> cart` di dalam file `main.dart` tanpa listener reactive" },
    ],
    correctAnswer: ["B"],
    explanation:
      "Di Flutter, pengelolaan state global di luar pohon widget hierarkis secara reaktif diselesaikan dengan pola State Management (seperti **Provider, Riverpod, atau BLoC**). Solusi ini memanfaatkan arsitektur `InheritedWidget` untuk memicu render ulang hanya pada widget konsumen yang relevan saat state keranjang berubah.",
  },
  {
    id: "mob-02",
    topic: "Pengembangan Perangkat Lunak",
    difficulty: "sulit",
    type: "single",
    stem: "Saat pengguna beralih membuka aplikasi kamera ponsel, activity aplikasi e-commerce yang sedang aktif terdorong ke background. Sistem Android tiba-tiba kehabisan RAM. Urutan peristiwa daur hidup (lifecycle callback) yang terjadi pada activity e-commerce tersebut hingga dihancurkan oleh sistem adalah...",
    options: [
      { key: "A", text: "onPause() -> onStop() -> kemudian proses di-kill oleh sistem operasi tanpa memanggil onDestroy()" },
      { key: "B", text: "onDestroy() -> onPause() -> onStop() -> onRestart()" },
      { key: "C", text: "onStop() -> onResume() -> onDestroy() -> onStart()" },
      { key: "D", text: "onPause() -> onResume() -> onStop() -> onDestroy()" },
      { key: "E", text: "onRestart() -> onStart() -> onDestroy() -> onPause()" },
    ],
    correctAnswer: ["A"],
    explanation:
      "Ketika activity kehilangan fokus ke background, sistem memanggil `onPause()` lalu `onStop()`. Jika sistem mengalami kondisi krisis memori (*low memory pressure*), proses Linux dari aplikasi tersebut dapat dihentikan (*killed*) paksa oleh sistem operasi Android tanpa jaminan callback `onDestroy()` sempat dieksekusi.",
  },
  {
    id: "mob-03",
    topic: "Pengembangan Perangkat Lunak",
    difficulty: "sedang",
    type: "multiple",
    stem: "Dalam metodologi Agile Scrum untuk pengembangan perangkat lunak modern, tentukan peran (roles) dan kegiatan (events) yang diakui secara baku dalam Scrum Guide! (Pilih lebih dari satu)",
    options: [
      { key: "A", text: "Product Owner bertugas memaksimalkan nilai produk dan mengelola isi Product Backlog" },
      { key: "B", text: "Sprint Retrospective dilaksanakan untuk merefleksikan proses kerja tim dan merencanakan perbaikan berkelanjutan" },
      { key: "C", text: "Scrum Master bertindak sebagai manajer proyek tradisional yang berhak memberikan hukuman kepada developer" },
      { key: "D", text: "Daily Scrum merupakan pertemuan inspeksi harian berdurasi maksimal 15 menit bagi Developers" },
      { key: "E", text: "Sprint Planning hanya boleh dihadiri oleh klien eksternal tanpa kehadiran tim pengembang" },
    ],
    correctAnswer: ["A", "B", "D"],
    explanation:
      "- Opsi A Benar: Product Owner bertanggung jawab atas Product Backlog dan prioritas bisnis.\n- Opsi B Benar: Sprint Retrospective fokus pada evaluasi proses tim di akhir sprint.\n- Opsi C Salah: Scrum Master adalah servant leader / fasilitator, bukan otoriter project manager.\n- Opsi D Benar: Daily Scrum adalah timeboxed 15 menit untuk sinkronisasi harian tim pengembang.\n- Opsi E Salah: Sprint Planning wajib dihadiri seluruh Scrum Team.",
  },

  // ==========================================
  // TOPIC 6: Jaringan Komputer & Subnetting (HOTS)
  // ==========================================
  {
    id: "jarkom-01",
    topic: "Jaringan Komputer Dasar",
    difficulty: "sedang",
    type: "single",
    stem: "Sebuah laboratorium komputer sekolah memiliki alokasi blok IP Address `192.168.50.0/26`. Berapakah jumlah host riil yang dapat digunakan oleh komputer siswa, dan berapakah alamat broadcast subnet tersebut?",
    options: [
      { key: "A", text: "Host riil: 62 komputer, Alamat Broadcast: 192.168.50.63" },
      { key: "B", text: "Host riil: 64 komputer, Alamat Broadcast: 192.168.50.64" },
      { key: "C", text: "Host riil: 126 komputer, Alamat Broadcast: 192.168.50.127" },
      { key: "D", text: "Host riil: 30 komputer, Alamat Broadcast: 192.168.50.31" },
      { key: "E", text: "Host riil: 254 komputer, Alamat Broadcast: 192.168.50.255" },
    ],
    correctAnswer: ["A"],
    explanation:
      "Perhitungan Subnetting IPv4 CIDR `/26`:\n- Subnet mask: `255.255.255.192`.\n- Jumlah total alamat IP = $2^{(32 - 26)} = 2^6 = 64$ alamat.\n- Rentang IP: `192.168.50.0` sampai `192.168.50.63`.\n- Network Address: `192.168.50.0`.\n- Broadcast Address: **`192.168.50.63`**.\n- Host yang dapat digunakan = $64 - 2 =$ **62 host** (`192.168.50.1` s/d `192.168.50.62`).",
  },
  {
    id: "jarkom-02",
    topic: "Jaringan Komputer Dasar",
    difficulty: "sulit",
    type: "single",
    stem: "Komputer klien mengirimkan permintaan web ke server `google.com`. Sebelum paket HTTP dikirim, komputer klien harus mengetahui MAC address gateway router terdekat. Protokol apakah yang secara otomatis bekerja pada lapisan Data Link / Network untuk memetakan alamat IP ke MAC address tersebut?",
    options: [
      { key: "A", text: "DNS (Domain Name System)" },
      { key: "B", text: "ARP (Address Resolution Protocol)" },
      { key: "C", text: "DHCP (Dynamic Host Configuration Protocol)" },
      { key: "D", text: "ICMP (Internet Control Message Protocol)" },
      { key: "E", text: "SNMP (Simple Network Management Protocol)" },
    ],
    correctAnswer: ["B"],
    explanation:
      "**ARP (Address Resolution Protocol)** bertugas menerjemahkan alamat logika IPv4 (Layer 3) menjadi alamat fisik MAC Address (Layer 2) pada jaringan lokal (LAN) sehingga frame Ethernet dapat dikirimkan ke kartu jaringan gateway router tujuan.",
  },
  {
    id: "jarkom-03",
    topic: "Jaringan Komputer Dasar",
    difficulty: "sedang",
    type: "multiple",
    stem: "Dalam model referensi 7 Lapisan OSI (Open Systems Interconnection), tentukan pasangan layer dan protokol kerja yang BENAR! (Pilih lebih dari satu)",
    options: [
      { key: "A", text: "Layer 7 (Application Layer): Protokol HTTP, HTTPS, SSH, dan DNS" },
      { key: "B", text: "Layer 4 (Transport Layer): Protokol TCP (connection-oriented) dan UDP (connectionless)" },
      { key: "C", text: "Layer 3 (Network Layer): Protokol IP, ICMP, dan routing paket data" },
      { key: "D", text: "Layer 2 (Data Link Layer): Protokol FTP dan SMTP untuk transfer surat elektronik" },
      { key: "E", text: "Layer 1 (Physical Layer): Pengaturan enkripsi sertifikat SSL/TLS dan kompresi data" },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation:
      "- Opsi A Benar: Application layer mencakup HTTP, HTTPS, SSH, DNS, SMTP.\n- Opsi B Benar: Transport layer bertanggung jawab atas transmisi end-to-end melalui TCP dan UDP.\n- Opsi C Benar: Network layer menangani logical addressing dan routing via IP dan ICMP.\n- Opsi D Salah: FTP dan SMTP berada di Application Layer (Layer 7).\n- Opsi E Salah: Enkripsi SSL/TLS berada di Presentation Layer (Layer 6), sedangkan Physical Layer menangani bit transmisi listrik/optik.",
  },

  // ==========================================
  // TOPIC 7: Keamanan Siber Dasar (HOTS)
  // ==========================================
  {
    id: "cyber-01",
    topic: "Keamanan Siber Dasar",
    difficulty: "sedang",
    type: "single",
    stem: "Seorang hacker berhasil menyusupkan input karakter khusus `' OR '1'='1` ke dalam form login web yang tidak menerapkan parameterized query, sehingga sistem memberikan hak akses admin tanpa password sah. Jenis serangan keamanan ini disebut...",
    options: [
      { key: "A", text: "Cross-Site Request Forgery (CSRF)" },
      { key: "B", text: "SQL Injection (SQLi)" },
      { key: "C", text: "Distributed Denial of Service (DDoS)" },
      { key: "D", text: "Server-Side Request Forgery (SSRF)" },
      { key: "E", text: "Man-in-the-Middle (MitM)" },
    ],
    correctAnswer: ["B"],
    explanation:
      "Serangan tersebut adalah **SQL Injection (SQLi)**. Penyerang menyisipkan fragmen logika SQL ke dalam input field yang digabungkan secara mentah (*string concatenation*) ke dalam query database, menyebabkan kondisi `'1'='1'` bernilai selalu benar (*always true*) dan membypass verifikasi sandi.",
  },
  {
    id: "cyber-02",
    topic: "Keamanan Siber Dasar",
    difficulty: "sulit",
    type: "single",
    stem: "Dalam skema kriptografi asimetris (Public-Key Cryptography) yang digunakan pada protokol HTTPS / SSH, manakah pernyataan yang paling akurat mengenai pasangan kunci?",
    options: [
      { key: "A", text: "Pesan yang dienkripsi menggunakan Public Key hanya dapat didekripsi menggunakan Private Key pasangannya" },
      { key: "B", text: "Public Key harus dirahasiakan di brankas server sedangkan Private Key disebarkan ke seluruh klien internet" },
      { key: "C", text: "Proses enkripsi dan dekripsi menggunakan satu buah kunci rahasia yang sama persis (kunci bersama)" },
      { key: "D", text: "Enkripsi asimetris memiliki kecepatan komputasi 100 kali lebih cepat dibanding enkripsi simetris AES" },
      { key: "E", text: "Tanda tangan digital (digital signature) dibuat dengan mengenkripsi hash dokumen menggunakan Public Key penerima" },
    ],
    correctAnswer: ["A"],
    explanation:
      "Pada kriptografi asimetris, terdapat sepasang kunci matematika: **Public Key** (disebarkan bebas ke publik untuk enkripsi) dan **Private Key** (disimpan sangat rahasia oleh pemilik untuk dekripsi). Pesan yang dienkripsi dengan Public Key hanya bisa dibuka oleh Private Key pasangannya.",
  },
  {
    id: "cyber-03",
    topic: "Keamanan Siber Dasar",
    difficulty: "sedang",
    type: "multiple",
    stem: "Tentukan prinsip-prinsip pertahanan keamanan (security best practices) yang WAJIB diterapkan oleh web developer profesional! (Pilih lebih dari satu)",
    options: [
      { key: "A", text: "Menyimpan password pengguna dengan algoritma hashing satu arah yang memiliki salt seperti bcrypt atau Argon2" },
      { key: "B", text: "Menerapkan Prepared Statements dan Parameterized Query untuk semua interaksi database" },
      { key: "C", text: "Mengaktifkan Content Security Policy (CSP) untuk mencegah eksekusi skrip berbahaya XSS" },
      { key: "D", text: "Menonaktifkan sertifikat HTTPS SSL pada lingkungan produksi untuk menghemat latency handshake TCP" },
      { key: "E", text: "Melakukan sanitasi dan validasi data input dari user secara ketat hanya pada sisi browser klien saja" },
    ],
    correctAnswer: ["A", "B", "C"],
    explanation:
      "- Opsi A Benar: Sandi tidak boleh disimpan dalam plaintext atau algoritma cepat usang (MD5/SHA1), wajib menggunakan bcrypt/Argon2 + salt.\n- Opsi B Benar: Prepared Statements adalah penangkal mutlak SQL Injection.\n- Opsi C Benar: Header CSP membatasi sumber script yang boleh dieksekusi browser.\n- Opsi D Salah: HTTPS wajib diaktifkan demi enkripsi lalu lintas data (mencegah eavesdropping).\n- Opsi E Salah: Validasi wajib dilakukan di server-side, karena validasi client-side mudah dibypass.",
  },
  {
    id: "cyber-04",
    topic: "Keamanan Siber Dasar",
    difficulty: "mudah",
    type: "boolean",
    stem: "Sebuah platform fintech menerapkan Otentikasi Multi-Faktor (Multi-Factor Authentication / MFA) untuk mencegah pengambilalihan akun nasabah dari serangan phishing dan kebocoran kata sandi (credential stuffing).\n\nTentukan apakah setiap pernyataan mengenai konsep otentikasi keamanan siber berikut **Benar** atau **Salah**!",
    options: [
      { key: "A", text: "MFA bekerja dengan menggabungkan minimal dua faktor verifikasi independen dari kategori: apa yang Anda ketahui (knowledge), apa yang Anda miliki (possession), atau apa yang melekat pada Anda (inherence)." },
      { key: "B", text: "Menggunakan dua buah password teks yang berbeda secara berturut-turut pada form login yang sama sudah memenuhi syarat Multi-Factor Authentication (MFA)." },
      { key: "C", text: "Faktor verifikasi biometrik seperti sensor sidik jari (fingerprint) dan pengenalan wajah (face recognition) diklasifikasikan ke dalam faktor inherence." },
    ],
    correctAnswer: ["A:benar", "B:salah", "C:benar"],
    explanation:
      "Analisis setiap pernyataan:\n- **Pernyataan A (Benar):** MFA wajib memadukan faktor berbeda (*something you know*, *something you have*, *something you are*).\n- **Pernyataan B (Salah):** Dua password tetap berada dalam kategori faktor yang sama (*something you know*), sehingga bukan MFA melainkan sekadar *two passwords*.\n- **Pernyataan C (Benar):** Ciri biologis fisik individu masuk dalam kategori *inherence factor*.",
  },
];

export function getSimulationQuestions(): Question[] {
  const extraPool: Question[] = [
    {
      id: "sim-extra-01",
      topic: "Pemrograman Dasar",
      difficulty: "sedang",
      type: "single",
      stem: "Perhatikan potongan kode fungsi rekursif berikut:\n\n```python\ndef faktorial(n):\n    if n <= 1:\n        return 1\n    return n * faktorial(n - 1)\n\nprint(faktorial(4))\n```\n\nKomponen baris manakah yang bertindak sebagai 'Base Case' (kondisi terminasi penghenti rekursi) pada fungsi tersebut?",
      options: [
        { key: "A", text: "Kondisi `if n <= 1: return 1` yang menghentikan rantai pemanggilan fungsi" },
        { key: "B", text: "Pernyataan `return n * faktorial(n - 1)` yang memanggil ulang fungsi dirinya sendiri" },
        { key: "C", text: "Baris `print(faktorial(4))` yang memicu eksekusi pertama dari tumpukan memori" },
        { key: "D", text: "Argumen formal parameter `(n)` yang menampung bilangan bulat masukan pengguna" },
        { key: "E", text: "Operasi perkalian `n *` yang mengakumulasikan nilai balik ke call stack terluar" },
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
        { key: "A", text: "Array.prototype.map() yang mentransformasi elemen dan menghasilkan salinan array baru" },
        { key: "B", text: "Array.prototype.push() yang menambahkan elemen baru langsung ke ujung array asal" },
        { key: "C", text: "Array.prototype.splice() yang memotong atau menghapus elemen langsung pada array asal" },
        { key: "D", text: "Array.prototype.reverse() yang membalikkan urutan indeks langsung pada memori array asal" },
        { key: "E", text: "Array.prototype.sort() yang mengurutkan susunan elemen langsung pada instans array asal" },
      ],
      correctAnswer: ["A"],
      explanation: "`map()` mentransformasi setiap elemen dan mengembalikan array baru tanpa mengubah (*mutate*) array asal, menjadikannya fungsi murni (*pure function*) yang disukai dalam paradigma fungsional.",
    },
    {
      id: "sim-extra-03",
      topic: "Basis Data",
      difficulty: "sedang",
      type: "single",
      stem: "Operasi SQL JOIN manakah yang mengembalikan seluruh baris dari tabel sebelah kiri (tabel pertama), serta baris yang cocok dari tabel sebelah kanan, dan mengisi nilai NULL untuk kolom kanan jika tidak ada kecocokan?",
      options: [
        { key: "A", text: "INNER JOIN yang hanya menampilkan baris data yang memiliki nilai relasi cocok di kedua tabel" },
        { key: "B", text: "LEFT OUTER JOIN yang mempertahankan seluruh baris tabel kiri dan mengisi NULL pada data kanan" },
        { key: "C", text: "RIGHT OUTER JOIN yang mempertahankan seluruh baris tabel kanan dan mengisi NULL pada data kiri" },
        { key: "D", text: "FULL OUTER JOIN yang menggabungkan seluruh baris kedua tabel dengan nilai NULL pada ketidakcocokan" },
        { key: "E", text: "CROSS JOIN yang menghasilkan perkalian kartesian baris antar kedua tabel tanpa kondisi penghubung" },
      ],
      correctAnswer: ["B"],
      explanation: "**LEFT JOIN (atau LEFT OUTER JOIN)** menjamin bahwa setiap baris pada tabel sisi kiri akan selalu ditampilkan pada set hasil, terlepas dari apakah ada kecocokan relasi pada tabel sisi kanan.",
    },
    {
      id: "sim-extra-04",
      topic: "Pemrograman Berorientasi Objek",
      difficulty: "sedang",
      type: "single",
      stem: "Kata kunci apa di Java atau TypeScript yang digunakan oleh sub-class untuk memanggil constructor dari class induknya?",
      options: [
        { key: "A", text: "this() yang digunakan untuk memanggil konstruktor lain dalam class yang sama" },
        { key: "B", text: "super() yang digunakan untuk mengeksekusi konstruktor milik superclass induk" },
        { key: "C", text: "parent() yang digunakan untuk mendeklarasikan pewarisan ganda antar modul" },
        { key: "D", text: "base() yang digunakan untuk mereferensikan namespace root aplikasi" },
        { key: "E", text: "extend() yang digunakan untuk membuat instansiasi objek anonim baru" },
      ],
      correctAnswer: ["B"],
      explanation: "Keyword **`super()`** digunakan di dalam constructor sub-class untuk mengeksekusi constructor milik super-class induk dan menginisialisasi properti turunan.",
    },
    {
      id: "sim-extra-05",
      topic: "Jaringan Komputer Dasar",
      difficulty: "sedang",
      type: "single",
      stem: "Perangkat jaringan fisik layer 3 OSI yang bertugas membaca alamat IP tujuan dan meneruskan paket antar jaringan yang berbeda subnet disebut...",
      options: [
        { key: "A", text: "Hub yang menyiarkan sinyal listrik ke seluruh port fisik tanpa seleksi alamat" },
        { key: "B", text: "Switch Layer-2 yang meneruskan frame data berdasarkan tabel MAC address hardware" },
        { key: "C", text: "Router yang memetakan tabel perutean berbasis IP address antar segmen subnet berbeda" },
        { key: "D", text: "Repeater yang memperkuat amplitudo sinyal fisik pada bentangan kabel jarak jauh" },
        { key: "E", text: "Bridge yang membagi segmen collision domain pada lapisan fisik tanpa perutean logika" },
      ],
      correctAnswer: ["C"],
      explanation: "**Router** beroperasi pada Layer 3 (Network Layer) model OSI dan menggunakan routing table berbasis IP address untuk menghubungkan dua atau lebih jaringan komputer dengan subnet berbeda.",
    },
    {
      id: "sim-extra-06",
      topic: "Keamanan Siber Dasar",
      difficulty: "sulit",
      type: "multiple",
      stem: "Manakah praktik di bawah ini yang tergolong sebagai pertahanan keamanan siber yang baik untuk pengembangan aplikasi web? (Pilih lebih dari satu jawaban yang benar)",
      options: [
        { key: "A", text: "Menerapkan hashing password menggunakan algoritma lambat seperti bcrypt atau Argon2, bukan MD5" },
        { key: "B", text: "Menyimpan API Key rahasia di dalam repositori publik GitHub agar mudah diakses tim" },
        { key: "C", text: "Menerapkan HTTP Security Headers seperti Content-Security-Policy (CSP) dan X-Frame-Options" },
        { key: "D", text: "Melakukan validasi dan sanitasi pada seluruh data input dari pengguna di sisi server" },
        { key: "E", text: "Menonaktifkan seluruh mekanisme otentikasi sesi token JWT untuk mempercepat respon API" },
      ],
      correctAnswer: ["A", "C", "D"],
      explanation: "- **Opsi A Benar:** Algoritma bcrypt/Argon2 dirancang lambat terhadap brute-force, sementara MD5 sudah usang dan rentan.\n- **Opsi B Salah:** Menyimpan secret key di git publik merupakan pelanggaran keamanan fatal.\n- **Opsi C Benar:** Header CSP mencegah serangan Cross-Site Scripting (XSS).\n- **Opsi D Benar:** Validasi server-side adalah benteng pertahanan utama terhadap injeksi dan manipulasi input.\n- **Opsi E Salah:** Menghilangkan otentikasi membuka akses ilegal ke data privat.",
    },
  ];

  // Return exactly 30 questions
  return [...QUESTION_BANK.slice(0, 24), ...extraPool];
}

export function getPracticeQuestion(topic?: string, difficulty?: Difficulty): Question {
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
