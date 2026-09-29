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
      stem: "Sebuah startup software house di Indonesia sedang merancang strategi pengembangan dan monetisasi produk perangkat lunak mereka. Mereka mempertimbangkan model bisnis SaaS (Software as a Service) berbasis cloud versus model On-Premise tradisional.\n\nBerdasarkan karakteristik model bisnis industri perangkat lunak, tentukan apakah setiap pernyataan berikut **Benar** atau **Salah**!",
      options: [
        { key: "A", text: "Model SaaS memonetisasi aplikasi melalui skema langganan berkala (subscription) dan infrastruktur server dikelola terpusat oleh penyedia layanan (cloud provider)." },
        { key: "B", text: "Pada model SaaS, pengguna akhir (klien) diwajibkan membeli lisensi kepemilikan software permanen sekali bayar dan bertanggung jawab penuh melakukan instalasi server lokal mandiri." },
        { key: "C", text: "Model On-Premise memberikan kontrol privasi data internal yang lebih independen kepada perusahaan klien dibandingkan SaaS publik, namun memerlukan biaya belanja modal (Capex) infrastruktur yang lebih tinggi di awal." },
      ],
      correctAnswer: ["A:benar", "B:salah", "C:benar"],
      explanation:
        "Analisis setiap pernyataan:\n- **Pernyataan A (Benar):** SaaS menggunakan model *recurring subscription* dan infrastruktur cloud diurus provider.\n- **Pernyataan B (Salah):** Pembelian lisensi permanen dan instalasi di server mandiri adalah karakteristik model *on-premise*, bukan SaaS.\n- **Pernyataan C (Benar):** On-premise memberikan kontrol penuh data internal, namun biaya investasi server/hardware awal (Capex) jauh lebih tinggi.",
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
      stem: "Dalam rangka meningkatkan kedisiplinan dan efisiensi ruang kerja laboratorium komputer serta ruang server, tim IT SMK PPLG menerapkan metodologi 5R/5S (Ringkas, Rapi, Resik, Rawat, Rajin) dan standar keselamatan K3LH.\n\nTentukan apakah setiap pernyataan berikut terkait penerapan 5R/5S dan K3LH adalah **Benar** atau **Salah**!",
      options: [
        { key: "A", text: "Prinsip 'Seiri' (Ringkas) menginstruksikan teknisi untuk memisahkan barang yang masih terpakai dengan yang tidak terpakai, lalu menyingkirkan barang rusak/afkir dari area kerja." },
        { key: "B", text: "Prinsip 'Seiton' (Rapi) memperbolehkan peletakan kabel daya dan kabel UTP LAN secara acak di lantai lorong selama kabel tersebut masih berfungsi mengalirkan data." },
        { key: "C", text: "Penerapan ergonomi kerja seperti mengatur posisi monitor sejajar garis pandang mata dan ketinggian kursi yang menopang punggung bertujuan mencegah gangguan muskuloskeletal (RSI)." },
      ],
      correctAnswer: ["A:benar", "B:salah", "C:benar"],
      explanation:
        "Analisis setiap pernyataan:\n- **Pernyataan A (Benar):** Seiri (Ringkas) fokus pada eliminasi barang yang tidak berguna agar area kerja bersih dan tertata.\n- **Pernyataan B (Salah):** Seiton (Rapi) mewajibkan penataan teratur dan manajemen kabel (cable management) demi keselamatan kerja (mencegah tersandung dan bahaya korsleting listrik).\n- **Pernyataan C (Benar):** Ergonomi monitor dan postur duduk menjaga kesehatan jangka panjang teknisi/programmer dari cedera *Repetitive Strain Injury* (RSI).",
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
      stem: "Ruang server utama sekolah mengalami fluktuasi tegangan listrik mendadak dari PLN yang berisiko menyebabkan kerusakan perangkat keras dan kehilangan integritas data database transaksi.\n\nTentukan apakah setiap pernyataan mengenai pengamanan perangkat keras dan penanganan kelistrikan server berikut **Benar** atau **Salah**!",
      options: [
        { key: "A", text: "Perangkat UPS (Uninterruptible Power Supply) berfungsi memberikan daya listrik baterai darurat agar server memiliki jendela waktu untuk shutdown secara teratur (graceful shutdown)." },
        { key: "B", text: "Gelang antistatis (ESD wrist strap) tidak diperlukan saat membongkar modul RAM atau motherboard server karena listrik statis tubuh manusia tidak mampu merusak komponen mikroelektronika." },
        { key: "C", text: "Penggunaan stabilizer (AVR) bersama UPS bertujuan menstabilkan tegangan voltase listrik yang masuk ke catu daya server agar tetap konstan pada tegangan nominal 220V." },
      ],
      correctAnswer: ["A:benar", "B:salah", "C:benar"],
      explanation:
        "Analisis setiap pernyataan:\n- **Pernyataan A (Benar):** UPS memberikan daya cadangan sementara agar sistem operasi dan database server tidak mati mendadak yang memicu kerusakan file sistem.\n- **Pernyataan B (Salah):** Muatan listrik statis pada tubuh manusia (ESD) ribuan volt dapat merusak sirkuit IC/chip mikroelektronika sensitif secara permanen jika tidak di-grounding.\n- **Pernyataan C (Benar):** AVR menstabilkan voltase input dari fluktuasi undervoltage atau overvoltage PLN.",
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
      stem: "Seorang administrator server Linux Debian bertugas mengatur izin akses (permission) dan kepemilikan direktori root aplikasi web `/var/www/html` demi menjaga keamanan sistem dari akses ilegal.\n\nTentukan apakah setiap pernyataan berikut mengenai perintah administrasi file dan user Linux adalah **Benar** atau **Salah**!",
      options: [
        { key: "A", text: "Perintah `chmod` digunakan untuk memodifikasi hak izin akses baca (read), tulis (write), dan eksekusi (execute) pada suatu file atau direktori." },
        { key: "B", text: "Perintah `chown` digunakan untuk mengganti kepemilikan user (owner) dan group dari suatu file atau direktori." },
        { key: "C", text: "Memberikan nilai izin `chmod 777` pada seluruh direktori produksi web adalah praktik keamanan terbaik (best practice) yang direkomendasikan industri." },
      ],
      correctAnswer: ["A:benar", "B:benar", "C:salah"],
      explanation:
        "Analisis setiap pernyataan:\n- **Pernyataan A (Benar):** `chmod` (*change mode*) mengontrol octal/symbolic permission (rwx).\n- **Pernyataan B (Benar):** `chown` (*change owner*) mengubah kepemilikan user dan grup (misal `chown www-data:www-data`).\n- **Pernyataan C (Salah):** `chmod 777` memberikan hak penuh (rwx) kepada *everyone* (publik), yang sangat berbahaya dan menciptakan celah kerentanan eksploitasi web shell.",
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
      stem: "Perhatikan perilaku tipe data dan operator pembanding pada bahasa pemrograman JavaScript modern berikut:\n```javascript\nlet a = 10;\nlet b = '10';\nlet c = true;\n```\nTentukan apakah setiap pernyataan evaluasi logika dan tipe data berikut **Benar** atau **Salah**!",
      options: [
        { key: "A", text: "Ekspresi perbandingan longgar `a == b` bernilai `true` karena JavaScript melakukan konversi tipe data otomatis (type coercion) sebelum membandingkan nilainya." },
        { key: "B", text: "Ekspresi perbandingan ketat `a === b` bernilai `true` karena angka 10 dan string '10' memiliki bobot representasi nilai yang setara." },
        { key: "C", text: "Operator logika `typeof a` menghasilkan string `'number'`, sedangkan `typeof b` menghasilkan string `'string'`." },
      ],
      correctAnswer: ["A:benar", "B:salah", "C:benar"],
      explanation:
        "Analisis setiap pernyataan:\n- **Pernyataan A (Benar):** `==` melakukan *type coercion*, mengubah string '10' menjadi number 10, sehingga `10 == 10` bernilai `true`.\n- **Pernyataan B (Salah):** `===` (strict equality) membandingkan nilai dan tipe data tanpa konversi. Karena number !== string, hasilnya adalah `false`.\n- **Pernyataan C (Benar):** Nilai `10` bertipe number primitif dan `'10'` bertipe string primitif.",
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
      stem: "Dalam paradigma Pemrograman Berorientasi Objek (OOP), Class dan Object merupakan fondasi utama penyusunan struktur program dan alokasi memori.\n\nTentukan apakah setiap pernyataan mengenai siklus hidup objek dan struktur class berikut **Benar** atau **Salah**!",
      options: [
        { key: "A", text: "Constructor adalah metode khusus dalam sebuah class yang dieksekusi secara otomatis saat instansiasi objek baru dilakukan menggunakan keyword `new`." },
        { key: "B", text: "Sebuah class hanya dapat memiliki satu instans objek saja di dalam memori selama program aplikasi berjalan." },
        { key: "C", text: "Variabel dengan modifier `static` (class variable) nilainya dibagikan (shared) ke seluruh objek turunan dari class yang sama, bukan dibuat ulang per instans." },
      ],
      correctAnswer: ["A:benar", "B:salah", "C:benar"],
      explanation:
        "Analisis setiap pernyataan:\n- **Pernyataan A (Benar):** Constructor menginisialisasi atribut objek saat pembuatan instans (`new ClassName()`).\n- **Pernyataan B (Salah):** Dari satu class blueprint, developer dapat menginstansiasi banyak objek independen (*multiple instances*).\n- **Pernyataan C (Benar):** Variabel *static* melekat pada class itu sendiri di memori, bukan terisolasi pada tiap objek instans.",
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
      stem: "Seorang programmer sedang mendesain class `RekeningBank` dengan menerapkan prinsip Enkapsulasi untuk melindungi data saldo nasabah dari manipulasi ilegal di luar class.\n\nTentukan apakah setiap pernyataan mengenai penerapan enkapsulasi berikut **Benar** atau **Salah**!",
      options: [
        { key: "A", text: "Atribut `saldo` dideklarasikan dengan access modifier `private` agar tidak dapat diakses atau diubah secara langsung dari luar class." },
        { key: "B", text: "Metode setter untuk mengubah saldo sebaiknya dilengkapi logika validasi, misalnya menolak nilai deposit jika bernilai negatif atau nol." },
        { key: "C", text: "Tujuan utama enkapsulasi adalah memperbolehkan seluruh kode eksternal membaca dan menimpa variabel internal class secara bebas tanpa batasan." },
      ],
      correctAnswer: ["A:benar", "B:benar", "C:salah"],
      explanation:
        "Analisis setiap pernyataan:\n- **Pernyataan A (Benar):** Modifier `private` menyembunyikan data internal (*data hiding*).\n- **Pernyataan B (Benar):** Metode *setter* bertindak sebagai gerbang pengontrol (*gatekeeper*) validitas data sebelum nilai disimpan ke atribut.\n- **Pernyataan C (Salah):** Enkapsulasi justru membatasi akses langsung dan menyembunyikan kompleksitas internal agar integritas data terjaga.",
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
      stem: "Konsep Polimorfisme (Polymorphism) memungkinkan antarmuka yang seragam untuk mengontrol berbagai macam bentuk perilaku objek yang berbeda dalam hierarki pewarisan (inheritance).\n\nTentukan apakah setiap pernyataan mengenai konsep polimorfisme berikut **Benar** atau **Salah**!",
      options: [
        { key: "A", text: "Polimorfisme dinamis (runtime polymorphism) diwujudkan melalui mekanisme method overriding pada subclass yang menimpa method superclass." },
        { key: "B", text: "Method overloading (dua method dengan nama sama namun parameter berbeda dalam satu class) merupakan contoh polimorfisme statis (compile-time polymorphism)." },
        { key: "C", text: "Subclass yang menerapkan polimorfisme tidak diperbolehkan memiliki implementasi logika yang berbeda dengan method yang ada di parent class." },
      ],
      correctAnswer: ["A:benar", "B:benar", "C:salah"],
      explanation:
        "Analisis setiap pernyataan:\n- **Pernyataan A (Benar):** *Method overriding* diputuskan pada saat runtime sesuai instans konkret objek yang dipanggil (*dynamic dispatch*).\n- **Pernyataan B (Benar):** *Method overloading* diselesaikan saat kompilasi berdasarkan signature daftar parameter argumen.\n- **Pernyataan C (Salah):** Esensi polimorfisme justru memberikan kebebasan bagi subclass untuk mengimplementasikan perilaku method yang spesifik dan unik bagi dirinya.",
    },
  ],
};

export function getQuestionsForSubElement(subElementId: string): Question[] {
  return SUB_ELEMENT_QUESTIONS[subElementId] || [];
}
