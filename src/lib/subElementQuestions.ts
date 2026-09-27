import { Question } from "@/types";

export const SUB_ELEMENT_QUESTIONS: Record<string, Question[]> = {
  // =========================================================================
  // ELEMEN 1: Wawasan dunia kerja bidang PPLG
  // =========================================================================
  "profesi-kewirausahaan": [
    {
      id: "pk-01",
      topic: "Wawasan Dunia Kerja Bidang PPLG",
      subElementId: "profesi-kewirausahaan",
      subElementName: "Profesi dan Kewirausahaan PPLG",
      difficulty: "sedang",
      type: "single",
      stem: "Dalam suatu tim pengembang perangkat lunak skala enterprise, profesi yang memegang tanggung jawab utama menyusun user flow, wireframe low-fidelity, interaksi prototipe clickable, dan memvalidasi kemudahan navigasi bagi pengguna akhir adalah...",
      options: [
        { key: "A", text: "DevOps Engineer yang mengelola otomatisasi pipeline deployment" },
        { key: "B", text: "UI/UX Designer yang merancang arsitektur antarmuka dan pengalaman pengguna" },
        { key: "C", text: "Database Administrator yang mengoptimalkan query dan indexing tabel" },
        { key: "D", text: "Quality Assurance Engineer yang menulis skrip automated regression testing" },
        { key: "E", text: "Scrum Master yang memfasilitasi kelancaran komunikasi harian tim developer" },
      ],
      correctAnswer: ["B"],
      explanation:
        "**UI/UX Designer** bertanggung jawab menyeluruh terhadap kenyamanan interaksi (*User Experience*) dan keindahan visual antarmuka (*User Interface*), mulai dari user research, persona, wireframing, hingga pembuatan prototipe interaktif.",
    },
    {
      id: "pk-02",
      topic: "Wawasan Dunia Kerja Bidang PPLG",
      subElementId: "profesi-kewirausahaan",
      subElementName: "Profesi dan Kewirausahaan PPLG",
      difficulty: "sulit",
      type: "single",
      stem: "Seorang technopreneur muda lulusan SMK ingin merilis platform kasir digital UMKM. Berdasarkan prinsip metodologi Lean Startup, tindakan awal yang paling tepat untuk meminimalkan risiko kegagalan produk adalah...",
      options: [
        { key: "A", text: "Membangun seluruh 60 fitur modul lengkap selama 18 bulan sebelum rilis publik" },
        { key: "B", text: "Membeli lisensi server bare-metal termahal demi mengantisipasi jutaan pengguna" },
        { key: "C", text: "Meluncurkan Minimum Viable Product (MVP) dengan fitur inti untuk validasi pasar riil" },
        { key: "D", text: "Merekrut 25 programmer tetap sebelum memiliki satu pun calon pengguna aktif" },
        { key: "E", text: "Membeli iklan media promosi besar-besaran sebelum aplikasi selesai diuji coba" },
      ],
      correctAnswer: ["C"],
      explanation:
        "Prinsip dasar **Lean Startup** berakar pada siklus iteratif *Build-Measure-Learn*. Melalui **MVP (Minimum Viable Product)**, produk versi awal dengan fitur paling esensial diluncurkan segera guna menguji hipotesis pasar nyata dengan efisiensi biaya sebelum ekspansi besar-besaran.",
    },
    {
      id: "pk-03",
      topic: "Wawasan Dunia Kerja Bidang PPLG",
      subElementId: "profesi-kewirausahaan",
      subElementName: "Profesi dan Kewirausahaan PPLG",
      difficulty: "mudah",
      type: "boolean",
      stem: "Model bisnis perangkat lunak berbasis SaaS (Software as a Service) umumnya memonetisasi aplikasi melalui skema pembayaran sewa berlangganan berkala (subscription bulanan/tahunan) dan seluruh infrastruktur di-hosting pada cloud provider.\n\nTentukan apakah pernyataan di atas Benar atau Salah!",
      options: [
        { key: "A", text: "Benar" },
        { key: "B", text: "Salah" },
      ],
      correctAnswer: ["A"],
      explanation:
        "Pernyataan tersebut **BENAR**. SaaS (seperti Google Workspace, Canva, Microsoft 365) menyediakan software siap pakai via cloud di mana pengguna membayar biaya sewa berlangganan berkala tanpa harus mengelola server sendiri.",
    },
  ],

  "manajemen-proyek-mutu": [
    {
      id: "mp-01",
      topic: "Wawasan Dunia Kerja Bidang PPLG",
      subElementId: "manajemen-proyek-mutu",
      subElementName: "Manajemen Proyek dan Jaminan Mutu",
      difficulty: "sedang",
      type: "single",
      stem: "Ketika sebuah tim pengembang perangkat lunak menghadapi situasi di mana kebutuhan klien sering berubah secara dinamis setiap 2 minggu, kerangka kerja (framework) manajemen proyek manakah yang paling adaptif dan tepat diterapkan?",
      options: [
        { key: "A", text: "Metodologi Waterfall Tradisional dengan dokumentasi spesifikasi beku di awal" },
        { key: "B", text: "Agile Scrum dengan siklus sprint 1-2 pekan dan evaluasi backlog berkala" },
        { key: "C", text: "Model V-Model Sekuensial dengan pengujian kaku di akhir tahapan coding" },
        { key: "D", text: "Model Big Bang tanpa perencanaan bertahap dan pengujian formal" },
        { key: "E", text: "Model Linier Sequential Cleanroom yang melarang perubahan spesifikasi kode" },
      ],
      correctAnswer: ["B"],
      explanation:
        "**Agile Scrum** dirancang khusus untuk proyek dengan tingkat ketidakpastian tinggi dan kebutuhan yang dinamis. Melalui siklus sprint pendek (1–2 minggu) dan backlog refinement, tim mampu merespons perubahan secara gesit dan memberikan produk bernilai secara inkremental.",
    },
    {
      id: "mp-02",
      topic: "Wawasan Dunia Kerja Bidang PPLG",
      subElementId: "manajemen-proyek-mutu",
      subElementName: "Manajemen Proyek dan Jaminan Mutu",
      difficulty: "sulit",
      type: "multiple",
      stem: "Dalam pengujian perangkat lunak (Software Quality Assurance), manakah pasangan tingkatan pengujian dan tujuannya yang BENAR? (Pilih lebih dari satu)",
      options: [
        { key: "A", text: "Unit Testing menguji fungsi, metode, atau modul individual terkecil secara terisolasi" },
        { key: "B", text: "Integration Testing menguji interaksi dan pertukaran data antar modul yang digabungkan" },
        { key: "C", text: "Regression Testing memastikan bahwa kode perbaikan bug baru tidak merusak fitur lama" },
        { key: "D", text: "User Acceptance Testing (UAT) dilakukan oleh developer internal tanpa melibatkan klien" },
        { key: "E", text: "Stress Testing bertujuan mengukur batas kekuatan sistem saat menerima beban trafik ekstrem" },
      ],
      correctAnswer: ["A", "B", "C", "E"],
      explanation:
        "- Opsi A, B, C, dan E Benar sesuai standar pengujian perangkat lunak ISTQB.\n- Opsi D Salah karena UAT (User Acceptance Testing) justru wajib dilakukan langsung oleh end-user atau klien untuk memvalidasi kelayakan produk sebelum serah terima.",
    },
  ],

  // =========================================================================
  // ELEMEN 2: Kecakapan Kerja Dasar dan K3LH
  // =========================================================================
  "k3lh-budaya-kerja": [
    {
      id: "k3-01",
      topic: "Kecakapan Kerja Dasar dan K3LH",
      subElementId: "k3lh-budaya-kerja",
      subElementName: "K3LH dan Budaya Kerja 5R",
      difficulty: "sedang",
      type: "single",
      stem: "Seorang programmer yang bekerja di depan layar monitor komputer selama 8 jam sehari sering mengeluhkan mata lelah, nyeri leher, dan tegang pada punggung bawah. Manakah penataan ergonomis tempat kerja yang paling tepat untuk mencegah Computer Vision Syndrome (CVS) dan gangguan muskuloskeletal?",
      options: [
        { key: "A", text: "Mengatur jarak monitor 20 cm dari mata dengan pencahayaan ruangan gelap pekat" },
        { key: "B", text: "Mengatur tepi atas layar sejajar mata, jarak layar 50-70 cm, dan jeda aturan 20-20-20" },
        { key: "C", text: "Memasang kecerahan layar pada level 100% konstan tanpa istirahat selama bekerja" },
        { key: "D", text: "Menggunakan kursi tanpa sandaran pinggang agar otot tulang punggung tetap aktif" },
        { key: "E", text: "Memposisikan keyboard lebih tinggi dari siku agar pergelangan tangan menekuk ke atas" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Standar ergonomis kerja komputer: tepi atas layar sejajar garis mata, jarak pandang 50–70 cm, siku membentuk sudut 90 derajat, serta menerapkan aturan 20-20-20 (setiap 20 menit, pandang objek sejauh 20 kaki / 6 meter selama 20 detik) untuk mengistirahatkan otot mata.",
    },
    {
      id: "k3-02",
      topic: "Kecakapan Kerja Dasar dan K3LH",
      subElementId: "k3lh-budaya-kerja",
      subElementName: "K3LH dan Budaya Kerja 5R",
      difficulty: "mudah",
      type: "boolean",
      stem: "Dalam budaya kerja industri 5R/5S Jepang, konsep 'Seiri' (Ringkas) bermakna memisahkan benda yang masih diperlukan dengan benda yang sudah tidak diperlukan, lalu menyingkirkan benda yang tidak berguna dari area kerja.\n\nTentukan apakah pernyataan di atas Benar atau Salah!",
      options: [
        { key: "A", text: "Benar" },
        { key: "B", text: "Salah" },
      ],
      correctAnswer: ["A"],
      explanation:
        "Pernyataan tersebut **BENAR**. Seiri (Ringkas/Sort) adalah langkah pertama 5R yang berfokus memilah dan membuang barang atau berkas yang tidak terpakai sehingga area kerja bebas dari penumpukan benda tidak bernilai.",
    },
  ],

  "pengelolaan-aset": [
    {
      id: "pa-01",
      topic: "Kecakapan Kerja Dasar dan K3LH",
      subElementId: "pengelolaan-aset",
      subElementName: "Pengelolaan Aset Perangkat Lunak dan Lisensi",
      difficulty: "sedang",
      type: "single",
      stem: "Perusahaan perangkat lunak ingin memanfaatkan pustaka pihak ketiga berlisensi open source ke dalam produk komersial tertutup (proprietary) tanpa kewajiban merilis ulang source code milik perusahaan ke publik. Lisensi open source manakah yang paling aman digunakan?",
      options: [
        { key: "A", text: "GNU General Public License v3 (GPL-3.0) yang menganut asas copyleft kuat" },
        { key: "B", text: "Affero General Public License (AGPL) yang mencakup layanan berbasis network" },
        { key: "C", text: "MIT License atau Apache 2.0 yang bersifat permisif dan ramah produk komersial" },
        { key: "D", text: "Creative Commons Non-Commercial (CC BY-NC) yang melarang tujuan profit" },
        { key: "E", text: "Open Software License (OSL) dengan ketentuan reciprocal disclosure penuh" },
      ],
      correctAnswer: ["C"],
      explanation:
        "Lisensi permisif seperti **MIT** dan **Apache 2.0** mengizinkan penggunaan, modifikasi, dan distribusi perangkat lunak untuk keperluan komersial tanpa mewajibkan pembukaan source code turunan (berbeda dari GPL/AGPL yang mewajibkan open source balik / copyleft).",
    },
    {
      id: "pa-02",
      topic: "Kecakapan Kerja Dasar dan K3LH",
      subElementId: "pengelolaan-aset",
      subElementName: "Pengelolaan Aset Perangkat Lunak dan Lisensi",
      difficulty: "sulit",
      type: "multiple",
      stem: "Sistem Version Control Git digunakan untuk mengelola riwayat aset source code bersama. Manakah tindakan teknis yang BENAR dalam alur kolaborasi tim pengembang? (Pilih lebih dari satu)",
      options: [
        { key: "A", text: "Membuat branch fitur baru yang terisolasi saat mengerjakan modul pekerjaan baru" },
        { key: "B", text: "Menyertakan file rahasia (.env) dan folder `node_modules` ke dalam file .gitignore" },
        { key: "C", text: "Menjalankan git push --force ke branch utama `main` yang sedang dipakai developer lain" },
        { key: "D", text: "Melakukan Pull Request (PR) dan Code Review sebelum branch fitur digabung ke main" },
        { key: "E", text: "Menulis commit message yang deskriptif dan mencerminkan perubahan logika program" },
      ],
      correctAnswer: ["A", "B", "D", "E"],
      explanation:
        "- Opsi A, B, D, dan E merupakan best practice standar Git.\n- Opsi C Salah karena `git push --force` ke branch bersama dapat menimpa dan menghilangkan commit hasil kerja rekan kerja lainnya (sangat berbahaya).",
    },
  ],

  "pengelolaan-peralatan-tempat-kerja": [
    {
      id: "pp-01",
      topic: "Kecakapan Kerja Dasar dan K3LH",
      subElementId: "pengelolaan-peralatan-tempat-kerja",
      subElementName: "Pengelolaan Peralatan Tempat Kerja",
      difficulty: "sedang",
      type: "single",
      stem: "Di ruang server data center sekolah, terjadi korsleting listrik yang memicu percikan api pada salah satu rak server aktif. Jenis Alat Pemadam Api Ringan (APAR) manakah yang paling aman digunakan untuk memadamkan kebakaran peralatan elektronik tersebut tanpa merusak komponen sirkuit?",
      options: [
        { key: "A", text: "APAR tipe Air (Water based extinguisher) dengan tekanan air terpusat" },
        { key: "B", text: "APAR tipe Busa (AFFF Foam) yang membentuk lapisan cairan konduktif" },
        { key: "C", text: "APAR Gas Karbon Dioksida (CO2) atau Clean Agent yang tidak meninggalkan residu" },
        { key: "D", text: "APAR Serbuk Kimia Basah (Wet Chemical) yang berbasis garam kalium" },
        { key: "E", text: "Penyiraman manual menggunakan pasir basah dan kain terpal lembab" },
      ],
      correctAnswer: ["C"],
      explanation:
        "Kebakaran peralatan listrik bertegangan (Kelas C/E) harus dipadamkan dengan media non-konduktif dan bebas residu. **APAR Gas Karbon Dioksida ($CO_2$) atau Clean Agent (seperti FM-200 / Novec)** bekerja dengan mengeliminasi oksigen dan mendinginkan tanpa meninggalkan residu cairan korosif yang merusak motherboard server.",
    },
    {
      id: "pp-02",
      topic: "Kecakapan Kerja Dasar dan K3LH",
      subElementId: "pengelolaan-peralatan-tempat-kerja",
      subElementName: "Pengelolaan Peralatan Tempat Kerja",
      difficulty: "mudah",
      type: "boolean",
      stem: "Perangkat Uninterruptible Power Supply (UPS) pada server berfungsi menjaga pasokan daya listrik cadangan saat listrik PLN padam seketika, sehingga administrator memiliki waktu untuk mematikan server secara aman (graceful shutdown) tanpa merusak file system disk.\n\nTentukan apakah pernyataan di atas Benar atau Salah!",
      options: [
        { key: "A", text: "Benar" },
        { key: "B", text: "Salah" },
      ],
      correctAnswer: ["A"],
      explanation:
        "Pernyataan tersebut **BENAR**. UPS memberikan daya listrik transisi dari baterai internal saat sumber listrik utama terputus mendadak, mencegah kerusakan hardware, dan mencegah korupsi data pada partisi disk basis data.",
    },
  ],

  // =========================================================================
  // ELEMEN 3: Pemrograman dan Infrastruktur Jaringan
  // =========================================================================
  "lingkungan-os-cli": [
    {
      id: "os-01",
      topic: "Pemrograman dan Infrastruktur Jaringan",
      subElementId: "lingkungan-os-cli",
      subElementName: "Lingkungan OS dan CLI",
      difficulty: "sedang",
      type: "single",
      stem: "Seorang administrator server Linux ingin memeriksa layanan web server Nginx yang sedang aktif beserta nomor port TCP yang sedang mendengarkan (listening). Perintah CLI terminal manakah yang paling akurat?",
      options: [
        { key: "A", text: "ls -la /var/www/html/ | grep index" },
        { key: "B", text: "ss -tulpn | grep nginx atau netstat -tulpn | grep nginx" },
        { key: "C", text: "cat /etc/passwd | cut -d: -f1" },
        { key: "D", text: "chmod 777 /usr/sbin/nginx -R" },
        { key: "E", text: "traceroute -n 127.0.0.1" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Perintah `ss -tulpn` (atau `netstat -tulpn`) menampilkan soket TCP (`-t`), UDP (`-u`), status listening (`-l`), informasi proses (`-p`), dan nomor numerik port (`-n`). Menyaringnya dengan `grep nginx` akan memperlihatkan port 80/443 yang digunakan Nginx.",
    },
    {
      id: "os-02",
      topic: "Pemrograman dan Infrastruktur Jaringan",
      subElementId: "lingkungan-os-cli",
      subElementName: "Lingkungan OS dan CLI",
      difficulty: "sulit",
      type: "single",
      stem: "Perhatikan hak akses file berikut pada terminal Linux:\n\n```bash\n-rwxr-xr-- 1 developer webdev 4096 Sep 27 08:00 backup.sh\n```\n\nBerdasarkan representasi izin tersebut, hak akses apa sajakah yang dimiliki oleh user anggota grup `webdev` terhadap file `backup.sh`?",
      options: [
        { key: "A", text: "Dapat membaca (Read), menulis (Write), dan mengeksekusi (Execute) file" },
        { key: "B", text: "Hanya dapat membaca (Read) dan mengeksekusi (Execute) file, tetapi tidak dapat menulis" },
        { key: "C", text: "Hanya dapat menulis (Write) file tanpa izin membaca dan mengeksekusi" },
        { key: "D", text: "Tidak memiliki hak akses apa pun terhadap file tersebut" },
        { key: "E", text: "Dapat menghapus file tetapi dilarang membaca isi script" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Notasi hak akses terbagi menjadi tiga triplet: Owner (`rwx`), Group (`r-x`), Other (`r--`). Bagian Group adalah `r-x`, yang berarti anggota grup memiliki izin **Read** (baca) dan **Execute** (eksekusi), namun tidak memiliki izin **Write** (tulis).",
    },
    {
      id: "os-03",
      topic: "Pemrograman dan Infrastruktur Jaringan",
      subElementId: "lingkungan-os-cli",
      subElementName: "Lingkungan OS dan CLI",
      difficulty: "mudah",
      type: "boolean",
      stem: "Di sistem operasi Linux, perintah `chown` digunakan untuk mengganti izin baca/tulis/eksekusi suatu file, sedangkan perintah `chmod` digunakan untuk mengubah pemilik (owner) dan kepemilikan grup dari suatu file atau direktori.\n\nTentukan apakah pernyataan di atas Benar atau Salah!",
      options: [
        { key: "A", text: "Benar" },
        { key: "B", text: "Salah" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Pernyataan tersebut **SALAH** (terbalik).\n- `chown` (*change owner*) digunakan untuk mengganti pemilik dan grup.\n- `chmod` (*change mode*) digunakan untuk mengubah hak izin akses (read, write, execute).",
    },
  ],

  "infrastruktur-jaringan": [
    {
      id: "net-01",
      topic: "Pemrograman dan Infrastruktur Jaringan",
      subElementId: "infrastruktur-jaringan",
      subElementName: "Infrastruktur Jaringan dan Perangkat Keras",
      difficulty: "sedang",
      type: "single",
      stem: "Dalam topologi jaringan komputer sekolah, perangkat Switch Layer 2 bekerja dengan membaca informasi header frame data. Informasi pengalamatan apakah yang digunakan Switch Layer 2 untuk meneruskan lalu lintas data antar port?",
      options: [
        { key: "A", text: "Alamat IP Logika (Logical IP Address) Layer 3" },
        { key: "B", text: "Alamat Fisik Perangkat Keras (MAC Address) Layer 2" },
        { key: "C", text: "Nomor Port Protokol TCP/UDP Layer 4" },
        { key: "D", text: "Nama Domain DNS (Uniform Resource Locator) Layer 7" },
        { key: "E", text: "Nomor Urut Sequence Number Paket Transmisi" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Switch Layer 2 beroperasi pada Data Link Layer (Layer 2 model OSI). Switch membangun tabel MAC Address (*forwarding table*) untuk mencocokkan port fisik dengan alamat hardware (MAC Address) dari kartu jaringan masing-masing perangkat.",
    },
    {
      id: "net-02",
      topic: "Pemrograman dan Infrastruktur Jaringan",
      subElementId: "infrastruktur-jaringan",
      subElementName: "Infrastruktur Jaringan dan Perangkat Keras",
      difficulty: "sulit",
      type: "multiple",
      stem: "Sebuah server web ditempatkan di dalam zona Demilitarized Zone (DMZ) di balik Firewall. Tentukan konfigurasi dan karakteristik jaringan yang BENAR untuk skenario tersebut! (Pilih lebih dari satu)",
      options: [
        { key: "A", text: "Zona DMZ mengisolasi server publik dari jaringan lokal (LAN) internal sekolah" },
        { key: "B", text: "Jika server di DMZ diretas, penyerang tidak dapat langsung mengakses database internal secara bebas" },
        { key: "C", text: "Port forwarding (DNAT) memetakan IP Publik router ke IP Privat server web di DMZ" },
        { key: "D", text: "Server di DMZ wajib diberikan akses tanpa batas (any-to-any) ke seluruh subnet workstation admin" },
        { key: "E", text: "Firewall memfilter paket yang masuk hanya pada port layanan resmi (port 80 HTTP dan 443 HTTPS)" },
      ],
      correctAnswer: ["A", "B", "C", "E"],
      explanation:
        "- Opsi A, B, C, dan E Benar sesuai konsep perancangan arsitektur keamanan DMZ.\n- Opsi D Salah karena server di DMZ justru harus dibatasi ketat agar tidak memiliki akses langsung ke jaringan internal sekolah.",
    },
  ],

  "arsitektur-tcpip": [
    {
      id: "tcp-01",
      topic: "Pemrograman dan Infrastruktur Jaringan",
      subElementId: "arsitektur-tcpip",
      subElementName: "Arsitektur Jaringan dan Protokol TCP/IP",
      difficulty: "sedang",
      type: "single",
      stem: "Sebelum komputer klien dapat mengirimkan request HTTP ke server melalui protokol TCP, kedua belah pihak harus membentuk koneksi terlebih dahulu melalui mekanisme 3-Way Handshake. Urutan sinyal kontrol yang benar adalah...",
      options: [
        { key: "A", text: "ACK -> SYN -> SYN-ACK" },
        { key: "B", text: "SYN -> SYN-ACK -> ACK" },
        { key: "C", text: "FIN -> ACK -> RST" },
        { key: "D", text: "SYN -> ACK -> DATA" },
        { key: "E", text: "PING -> PONG -> CONNECT" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Proses pembentukan koneksi TCP 3-Way Handshake:\n1. Klien mengirim paket kontrol **SYN** (Synchronize) ke server.\n2. Server merespons dengan paket **SYN-ACK** (Synchronize-Acknowledgment).\n3. Klien membalas dengan paket **ACK** (Acknowledgment). Setelah ini, koneksi terbuka dan transfer data dapat berlangsung.",
    },
    {
      id: "tcp-02",
      topic: "Pemrograman dan Infrastruktur Jaringan",
      subElementId: "arsitektur-tcpip",
      subElementName: "Arsitektur Jaringan dan Protokol TCP/IP",
      difficulty: "sulit",
      type: "single",
      stem: "Diberikan alamat IP `172.16.10.130/28`. Berapakah subnet mask dalam notasi desimal bertitik, dan berapakah alamat network ID dari subnet tersebut?",
      options: [
        { key: "A", text: "Subnet Mask: 255.255.255.240, Network ID: 172.16.10.128" },
        { key: "B", text: "Subnet Mask: 255.255.255.224, Network ID: 172.16.10.128" },
        { key: "C", text: "Subnet Mask: 255.255.255.240, Network ID: 172.16.10.130" },
        { key: "D", text: "Subnet Mask: 255.255.255.192, Network ID: 172.16.10.0" },
        { key: "E", text: "Subnet Mask: 255.255.255.248, Network ID: 172.16.10.120" },
      ],
      correctAnswer: ["A"],
      explanation:
        "Perhitungan CIDR `/28`:\n- Subnet mask: 28 bit bernilai 1 $\\rightarrow$ `255.255.255.240`.\n- Jumlah IP per blok = $2^{(32-28)} = 2^4 = 16$ IP.\n- Blok subnet: 0, 16, 32, ..., 112, 128, 144.\n- Angka 130 berada di antara 128 dan 143. Maka Network ID adalah **`172.16.10.128`** (dengan broadcast `172.16.10.143`).",
    },
  ],

  // =========================================================================
  // ELEMEN 4: Pemrograman Terstruktur
  // =========================================================================
  "tipe-data-variabel": [
    {
      id: "td-01",
      topic: "Pemrograman Terstruktur",
      subElementId: "tipe-data-variabel",
      subElementName: "Tipe Data, Variabel, dan Operator",
      difficulty: "sedang",
      type: "single",
      stem: "Perhatikan potongan kode Python berikut:\n\n```python\na = 10\nb = 3\nc = a // b\nd = a % b\nprint(c ** d)\n```\n\nBerapakah nilai yang dicetak pada output terminal?",
      options: [
        { key: "A", text: "Output bernilai 1" },
        { key: "B", text: "Output bernilai 3" },
        { key: "C", text: "Output bernilai 9" },
        { key: "D", text: "Output bernilai 27" },
        { key: "E", text: "Output bernilai 0" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Tracing operasi matematika Python:\n- `c = a // b = 10 // 3 = 3` (pembagian bulat/floor division).\n- `d = a % b = 10 % 3 = 1` (sisa bagi/modulo).\n- `c ** d = 3 ** 1 = 3` (pangkat).\nMaka output terminal adalah **3**.",
    },
    {
      id: "td-02",
      topic: "Pemrograman Terstruktur",
      subElementId: "tipe-data-variabel",
      subElementName: "Tipe Data, Variabel, dan Operator",
      difficulty: "mudah",
      type: "boolean",
      stem: "Dalam bahasa pemrograman JavaScript, operator kesetaraan ketat `===` membandingkan nilai sekaligus tipe data kedua operan, sehingga ekspresi `5 === '5'` akan menghasilkan nilai boolean `false`.\n\nTentukan apakah pernyataan di atas Benar atau Salah!",
      options: [
        { key: "A", text: "Benar" },
        { key: "B", text: "Salah" },
      ],
      correctAnswer: ["A"],
      explanation:
        "Pernyataan tersebut **BENAR**. Operator `===` (*strict equality*) memeriksa kecocokan nilai dan tipe data tanpa melakukan konversi tipe implisit (*type coercion*). Karena angka `5` berbeda tipe dengan string `'5'`, hasilnya adalah `false`.",
    },
  ],

  "perulangan-percabangan": [
    {
      id: "loop-01",
      topic: "Pemrograman Terstruktur",
      subElementId: "perulangan-percabangan",
      subElementName: "Struktur Kontrol Perulangan dan Percabangan",
      difficulty: "sedang",
      type: "single",
      stem: "Perhatikan potongan kode program JavaScript berikut:\n\n```javascript\nlet total = 0;\nfor (let i = 1; i <= 6; i++) {\n  if (i % 2 === 0) continue;\n  if (i > 4) break;\n  total += i;\n}\nconsole.log(total);\n```\n\nBerapakah nilai akhir variabel `total` yang dicetak di konsol?",
      options: [
        { key: "A", text: "Nilai variabel total adalah 1" },
        { key: "B", text: "Nilai variabel total adalah 4" },
        { key: "C", text: "Nilai variabel total adalah 9" },
        { key: "D", text: "Nilai variabel total adalah 12" },
        { key: "E", text: "Nilai variabel total adalah 0" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Penelusuran loop iterasi demi iterasi:\n- `i = 1`: `1 % 2 !== 0`, `1 > 4` false $\\rightarrow$ `total = 0 + 1 = 1`.\n- `i = 2`: `2 % 2 === 0` (genap) $\\rightarrow$ dieksekusi `continue`, iterasi melompat langsung ke i=3.\n- `i = 3`: `3 % 2 !== 0`, `3 > 4` false $\\rightarrow$ `total = 1 + 3 = 4`.\n- `i = 4`: `4 % 2 === 0` $\\rightarrow$ `continue`.\n- `i = 5`: `5 % 2 !== 0`, tetapi `5 > 4` bernilai true $\\rightarrow$ dieksekusi `break`, seluruh perulangan terhenti seketika.\nMaka nilai akhir `total` adalah **4**.",
    },
    {
      id: "loop-02",
      topic: "Pemrograman Terstruktur",
      subElementId: "perulangan-percabangan",
      subElementName: "Struktur Kontrol Perulangan dan Percabangan",
      difficulty: "sulit",
      type: "multiple",
      stem: "Manakah pernyataan yang BENAR mengenai perbedaan perulangan 'while' dan 'do-while'? (Pilih lebih dari satu)",
      options: [
        { key: "A", text: "Perulangan do-while dijamin mengeksekusi blok kode minimal 1 kali meskipun kondisi awal bernilai false" },
        { key: "B", text: "Perulangan while mengevaluasi kondisi terminasi di awal sebelum blok kode pertama kali dieksekusi" },
        { key: "C", text: "Perulangan while dapat tidak dieksekusi sama sekali jika kondisi awal bernilai false" },
        { key: "D", text: "Perulangan do-while hanya dapat digunakan jika jumlah perulangan sudah diketahui pasti sejak awal" },
        { key: "E", text: "Kata kunci 'break' dapat digunakan untuk menghentikan paksa kedua jenis perulangan tersebut" },
      ],
      correctAnswer: ["A", "B", "C", "E"],
      explanation:
        "- Opsi A, B, C, dan E Benar: `do-while` mengevaluasi kondisi di akhir sehingga minimal 1 kali dieksekusi, sedangkan `while` mengevaluasi di awal.\n- Opsi D Salah: Perulangan yang jumlah iterasinya sudah pasti biasanya menggunakan `for`, sedangkan `do-while` sering dipakai untuk input berulang yang kondisional.",
    },
  ],

  "fungsi-modular": [
    {
      id: "fn-01",
      topic: "Pemrograman Terstruktur",
      subElementId: "fungsi-modular",
      subElementName: "Modularisasi Program dan Fungsi",
      difficulty: "sedang",
      type: "single",
      stem: "Perhatikan fungsi rekursif Python berikut:\n\n```python\ndef misteri(n):\n    if n <= 1:\n        return n\n    return n + misteri(n - 2)\n\nprint(misteri(7))\n```\n\nBerapakah nilai yang dihasilkan saat fungsi tersebut dipanggil?",
      options: [
        { key: "A", text: "Hasil keluaran adalah 12" },
        { key: "B", text: "Hasil keluaran adalah 15" },
        { key: "C", text: "Hasil keluaran adalah 16" },
        { key: "D", text: "Hasil keluaran adalah 28" },
        { key: "E", text: "Hasil keluaran mengalami RecursionError tanpa henti" },
      ],
      correctAnswer: ["C"],
      explanation:
        "Tracing pemanggilan rekursif:\n- `misteri(7) = 7 + misteri(5)`\n- `misteri(5) = 5 + misteri(3)`\n- `misteri(3) = 3 + misteri(1)`\n- `misteri(1) = 1` (karena $n \\le 1$ terpenuhi, mengembalikan nilai 1).\nMaka substitusi balik:\n`misteri(3) = 3 + 1 = 4`\n`misteri(5) = 5 + 4 = 9`\n`misteri(7) = 7 + 9 = 16`.",
    },
    {
      id: "fn-02",
      topic: "Pemrograman Terstruktur",
      subElementId: "fungsi-modular",
      subElementName: "Modularisasi Program dan Fungsi",
      difficulty: "sulit",
      type: "single",
      stem: "Seorang programmer memisahkan kode menjadi beberapa modul mandiri (modularitas). Manakah karakteristik desain modul yang PALING BAIK dalam arsitektur software?",
      options: [
        { key: "A", text: "High Coupling dan Low Cohesion (saling ketergantungan erat antar modul dengan tugas acak)" },
        { key: "B", text: "High Cohesion dan Low Coupling (fokus pada satu tanggung jawab jelas dengan ketergantungan minim)" },
        { key: "C", text: "Semua fungsi digabung ke dalam satu modul raksasa tanpa parameter" },
        { key: "D", text: "Setiap fungsi memanipulasi variabel global yang sama tanpa nilai return" },
        { key: "E", text: "Modul-modul saling mengimpor satu sama lain secara melingkar (circular dependency)" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Kaidah fundamental rekayasa perangkat lunak adalah **High Cohesion** (elemen dalam satu modul bekerja sama erat untuk satu tujuan fungsional yang spesifik) dan **Low Coupling** (modul seminimal mungkin bergantung pada detail implementasi modul lain), sehingga memudahkan pengujian, pemeliharaan, dan refactoring.",
    },
  ],

  // =========================================================================
  // ELEMEN 5: Pemrograman Berorientasi Objek (OOP)
  // =========================================================================
  "oop-dasar-class-object": [
    {
      id: "oop-01",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "oop-dasar-class-object",
      subElementName: "Konsep Dasar Class dan Object",
      difficulty: "sedang",
      type: "single",
      stem: "Perhatikan pernyataan berikut:\n'Class adalah cetak biru (blueprint) atau templat yang mendefinisikan struktur atribut dan metode, sedangkan Object adalah wujud nyata hasil cetakan (instansiasi) di dalam memori komputer saat program berjalan.'\n\nManakah contoh analogi dunia nyata yang paling mencerminkan hubungan Class dan Object?",
      options: [
        { key: "A", text: "Class adalah mobil Avanza bernomor polisi B 1234 CD, Object adalah gambar denah pabrik" },
        { key: "B", text: "Class adalah gambar cetak biru arsitektur rumah, Object adalah fisik bangunan rumah yang berdiri di lokasi" },
        { key: "C", text: "Class adalah roda mobil, Object adalah setir mobil" },
        { key: "D", text: "Class adalah garasi penyimpanan, Object adalah bahan bakar bensin" },
        { key: "E", text: "Class dan Object adalah dua istilah yang sepenuhnya identik tanpa perbedaan konsep" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Analogi paling tepat: **Class** adalah cetak biru (*blueprint*) desain rumah di atas kertas, sedangkan **Object** adalah rumah fisik nyata yang dibangun berdasarkan cetak biru tersebut dan menempati ruang nyata di memori (*instansiasi*).",
    },
    {
      id: "oop-02",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "oop-dasar-class-object",
      subElementName: "Konsep Dasar Class dan Object",
      difficulty: "mudah",
      type: "boolean",
      stem: "Constructor adalah metode khusus dalam sebuah class yang secara otomatis dieksekusi oleh runtime saat objek baru diinstansiasi menggunakan operator `new`, dan umumnya digunakan untuk menginisialisasi nilai atribut awal objek.\n\nTentukan apakah pernyataan di atas Benar atau Salah!",
      options: [
        { key: "A", text: "Benar" },
        { key: "B", text: "Salah" },
      ],
      correctAnswer: ["A"],
      explanation:
        "Pernyataan tersebut **BENAR**. Constructor berjalan otomatis pada saat instansiasi objek (`new ClassName()`) dan fungsi intinya adalah menyiapkan kondisi awal (*state initialization*) atribut objek tersebut.",
    },
  ],

  "oop-inheritance": [
    {
      id: "inh-01",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "oop-inheritance",
      subElementName: "Pewarisan (Inheritance)",
      difficulty: "sedang",
      type: "single",
      stem: "Perhatikan hierarki class berikut di Java atau TypeScript:\n\n```typescript\nclass Karyawan {\n  constructor(public nama: string, public gaji: number) {}\n}\nclass Manager extends Karyawan {\n  constructor(nama: string, gaji: number, public tunjangan: number) {\n    // Titik pemanggilan konstruktor induk\n  }\n}\n```\n\nInstruksi apakah yang harus dituliskan di dalam constructor `Manager` untuk memanggil constructor class induk `Karyawan` secara sah?",
      options: [
        { key: "A", text: "this(nama, gaji);" },
        { key: "B", text: "super(nama, gaji);" },
        { key: "C", text: "parent(nama, gaji);" },
        { key: "D", text: "base(nama, gaji);" },
        { key: "E", text: "Karyawan.constructor(nama, gaji);" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Kata kunci **`super(...)`** wajib dipanggil di baris awal constructor subclass sebelum mengakses referensi `this`, guna meneruskan argumen inisialisasi ke constructor superclass induk.",
    },
    {
      id: "inh-02",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "oop-inheritance",
      subElementName: "Pewarisan (Inheritance)",
      difficulty: "sulit",
      type: "multiple",
      stem: "Terkait pewarisan (Inheritance) pada bahasa pemrograman berorientasi objek modern (seperti Java atau C#), manakah pernyataan yang BENAR? (Pilih lebih dari satu)",
      options: [
        { key: "A", text: "Java tidak mendukung Multiple Inheritance antar-class secara langsung untuk menghindari masalah Diamond Problem" },
        { key: "B", text: "Sebuah class dapat mengimplementasikan lebih dari satu interface secara bersamaan" },
        { key: "C", text: "Subclass mewarisi seluruh anggota (fields dan methods) berakses private secara langsung tanpa getter" },
        { key: "D", text: "Class turunan dapat menambahkan atribut dan method spesifik yang tidak dimiliki oleh class induk" },
        { key: "E", text: "Class yang dideklarasikan dengan kata kunci 'final' dilarang untuk dijadikan class induk pewarisan" },
      ],
      correctAnswer: ["A", "B", "D", "E"],
      explanation:
        "- Opsi A, B, D, dan E Benar sesuai aturan inheritance standar Java/C#.\n- Opsi C Salah karena atribut `private` di class induk tidak dapat diakses langsung oleh subclass (harus melalui method `protected` atau `public getter/setter`).",
    },
  ],

  "oop-enkapsulasi": [
    {
      id: "enk-01",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "oop-enkapsulasi",
      subElementName: "Enkapsulasi dan Access Modifier",
      difficulty: "sedang",
      type: "single",
      stem: "Seorang programmer ingin mendeklarasikan suatu variabel atribut agar hanya dapat diakses oleh class itu sendiri dan seluruh subclass turunannya, namun tertutup bagi class luar dari package yang berbeda. Access modifier apakah yang paling tepat?",
      options: [
        { key: "A", text: "public" },
        { key: "B", text: "private" },
        { key: "C", text: "protected" },
        { key: "D", text: "default / package-private" },
        { key: "E", text: "static readonly" },
      ],
      correctAnswer: ["C"],
      explanation:
        "Tingkat visibilitas access modifier:\n- `public`: dapat diakses dari mana saja.\n- `protected`: dapat diakses oleh class itu sendiri dan subclass turunannya.\n- `private`: hanya dapat diakses di dalam class itu sendiri.\nMaka pilihan yang tepat adalah **`protected`**.",
    },
    {
      id: "enk-02",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "oop-enkapsulasi",
      subElementName: "Enkapsulasi dan Access Modifier",
      difficulty: "mudah",
      type: "boolean",
      stem: "Dengan menerapkan prinsip Enkapsulasi, atribut internal suatu class dapat disembunyikan menggunakan modifier `private` dan modifikasi nilai dilakukan melalui method `setter` yang memuat logika validasi data (misalnya mencegah saldo bernilai negatif).\n\nTentukan apakah pernyataan di atas Benar atau Salah!",
      options: [
        { key: "A", text: "Benar" },
        { key: "B", text: "Salah" },
      ],
      correctAnswer: ["A"],
      explanation:
        "Pernyataan tersebut **BENAR**. Esensi utama enkapsulasi adalah menyembunyikan data internal (*data hiding*) dan memastikan setiap mutasi data tervalidasi melalui method interface (getter/setter) yang aman.",
    },
  ],

  "polymorphism": [
    {
      id: "poly-01",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "polymorphism",
      subElementName: "Polymorphism dan Dynamic Dispatch",
      difficulty: "sedang",
      type: "single",
      stem: "Perhatikan potongan kode program polymorphism berikut:\n\n```typescript\ninterface Notifikasi {\n  kirim(pesan: string): void;\n}\nclass EmailNotif implements Notifikasi {\n  kirim(pesan: string) { console.log(\"Kirim Email: \" + pesan); }\n}\nclass SMSNotif implements Notifikasi {\n  kirim(pesan: string) { console.log(\"Kirim SMS: \" + pesan); }\n}\n\nfunction broadcast(channel: Notifikasi, msg: string) {\n  channel.kirim(msg);\n}\n```\n\nKeuntungan utama perancangan kode di atas berdasarkan prinsip polimorfisme adalah...",
      options: [
        { key: "A", text: "Program berjalan lebih cepat karena tidak membutuhkan alokasi memori heap" },
        { key: "B", text: "Fungsi broadcast dapat menerima jenis notifikasi baru (seperti WhatsApp) tanpa mengubah implementasi fungsi broadcast itu sendiri" },
        { key: "C", text: "Seluruh class secara otomatis mewarisi sifat static tanpa perlu instansiasi" },
        { key: "D", text: "Memaksa compiler mengabaikan pemeriksaan tipe data saat kompilasi" },
        { key: "E", text: "Menjamin bahwa class SMSNotif dan EmailNotif berbagi variabel memori yang identik" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Polimorfisme memungkinkan fungsi `broadcast` bergantung pada abstraksi interface `Notifikasi`. Jika di kemudian hari ada saluran baru (misalnya `WhatsAppNotif`), kita cukup membuat class baru yang mengimplementasikan `Notifikasi` tanpa perlu membongkar kode fungsi `broadcast` (Open/Closed Principle).",
    },
    {
      id: "poly-02",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "polymorphism",
      subElementName: "Polymorphism dan Dynamic Dispatch",
      difficulty: "sulit",
      type: "multiple",
      stem: "Terkait perbedaan antara 'Method Overriding' dan 'Method Overloading', manakah pernyataan yang BENAR? (Pilih lebih dari satu)",
      options: [
        { key: "A", text: "Method Overriding terjadi pada hubungan pewarisan antar class (superclass dan subclass)" },
        { key: "B", text: "Method Overloading terjadi pada class yang sama dengan nama method sama namun daftar parameter berbeda" },
        { key: "C", text: "Method Overriding ditentukan secara dinamis pada saat runtime (runtime polymorphism)" },
        { key: "D", text: "Method Overloading diselesaikan oleh compiler pada saat compile time (compile-time polymorphism)" },
        { key: "E", text: "Method Overriding mewajibkan tipe data parameter dan jumlah parameter diubah secara bebas" },
      ],
      correctAnswer: ["A", "B", "C", "D"],
      explanation:
        "- Opsi A, B, C, dan D Benar.\n- Opsi E Salah karena Method Overriding wajib mempertahankan signature (nama method, tipe dan jumlah parameter) yang sama persis dengan yang ada pada superclass.",
    },
    {
      id: "poly-03",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "polymorphism",
      subElementName: "Polymorphism dan Dynamic Dispatch",
      difficulty: "mudah",
      type: "boolean",
      stem: "Konsep Polymorphism (banyak bentuk) memungkinkan objek dari berbagai subclass turunan yang berbeda diperlakukan sebagai instans dari superclass umum yang sama, dan mengeksekusi metode spesifik subclass masing-masing secara dinamis.\n\nTentukan apakah pernyataan di atas Benar atau Salah!",
      options: [
        { key: "A", text: "Benar" },
        { key: "B", text: "Salah" },
      ],
      correctAnswer: ["A"],
      explanation:
        "Pernyataan tersebut **BENAR**. Polimorfisme memungkinkan pemanggilan method yang seragam pada kumpulan objek turunan dengan perilaku implementasi yang dinamis sesuai tipe konkrit masing-masing.",
    },
  ],
};

export function getQuestionsForSubElement(subElementId: string): Question[] {
  return SUB_ELEMENT_QUESTIONS[subElementId] || [];
}
