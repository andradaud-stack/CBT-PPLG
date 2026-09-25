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
      difficulty: "mudah",
      type: "single",
      stem: "Dalam suatu tim pengembang perangkat lunak, profesi yang memiliki tanggung jawab utama meriset kebutuhan pengguna, menyusun arsitektur alur interaksi aplikasi, serta membuat wireframe dan prototipe visual adalah...",
      options: [
        { key: "A", text: "DevOps Engineer" },
        { key: "B", text: "UI/UX Designer" },
        { key: "C", text: "Database Administrator" },
        { key: "D", text: "QA Automation Engineer" },
      ],
      correctAnswer: ["B"],
      explanation:
        "**UI/UX Designer** bertanggung jawab terhadap kenyamanan pengalaman pengguna (*User Experience*) dan keindahan antarmuka grafis (*User Interface*), mulai dari user research, persona, user flow, wireframing, hingga clickable prototype.",
    },
    {
      id: "pk-02",
      topic: "Wawasan Dunia Kerja Bidang PPLG",
      subElementId: "profesi-kewirausahaan",
      subElementName: "Profesi dan Kewirausahaan PPLG",
      difficulty: "sedang",
      type: "single",
      stem: "Seorang technopreneur muda lulusan SMK ingin meluncurkan aplikasi manajemen kasir UMKM. Berdasarkan prinsip Lean Startup, tindakan paling tepat yang harus ia lakukan di fase awal adalah...",
      options: [
        { key: "A", text: "Membangun seluruh 50 fitur lengkap selama 2 tahun sebelum memperkenalkannya ke publik" },
        { key: "B", text: "Membeli lisensi server data center termahal agar kapasitas tidak kehabisan" },
        { key: "C", text: "Meluncurkan Minimum Viable Product (MVP) dengan fitur inti kasir untuk memvalidasi kebutuhan nyata pengguna" },
        { key: "D", text: "Merekrut 20 programmer sekaligus sebelum memiliki satu pun calon pelanggan" },
      ],
      correctAnswer: ["C"],
      explanation:
        "Prinsip dasar technopreneurship modern adalah siklus **Build-Measure-Learn**. Melalui **MVP (Minimum Viable Product)**, produk versi awal dengan fitur paling esensial diluncurkan segera guna menguji hipotesis pasar nyata dengan biaya dan waktu minimal sebelum pengembangan skala besar.",
    },
    {
      id: "pk-03",
      topic: "Wawasan Dunia Kerja Bidang PPLG",
      subElementId: "profesi-kewirausahaan",
      subElementName: "Profesi dan Kewirausahaan PPLG",
      difficulty: "sulit",
      type: "multiple",
      stem: "Manakah pernyataan di bawah ini yang BENAR terkait profesi dan model bisnis dalam industri perangkat lunak dan gim? (Pilih lebih dari satu jawaban yang benar)",
      options: [
        { key: "A", text: "DevOps Engineer bertugas mengotomatisasi alur CI/CD (Continuous Integration / Continuous Deployment)" },
        { key: "B", text: "Model bisnis SaaS (Software as a Service) umumnya menerapkan sistem pembayaran berlangganan berkala (subscription)" },
        { key: "C", text: "Game Designer bertugas menyusun mekanika aturan permainan, alur level, dan keseimbangan ekonomi dalam gim" },
        { key: "D", text: "QA Tester hanya bertugas setelah aplikasi dirilis secara publik ke App Store atau Play Store" },
      ],
      correctAnswer: ["A", "B", "C"],
      explanation:
        "- **Opsi A Benar:** DevOps menjembatani tim Development dan Operations melalui otomasi CI/CD dan monitoring server.\n- **Opsi B Benar:** SaaS (misal: Microsoft 365, Spotify, Canva) memonetisasi software via langganan berulang bulanan/tahunan.\n- **Opsi C Benar:** Game Designer merancang aturan inti, mekanika, dan narasi gim.\n- **Opsi D Salah:** QA Tester menguji software sejak tahap pengembangan dan staging sebelum dirilis ke publik.",
    },
  ],

  "manajemen-proyek-mutu": [
    {
      id: "mp-01",
      topic: "Wawasan Dunia Kerja Bidang PPLG",
      subElementId: "manajemen-proyek-mutu",
      subElementName: "Manajemen Proyek dan Budaya Mutu",
      difficulty: "mudah",
      type: "single",
      stem: "Urutan tahapan yang benar pada siklus hidup pengembangan perangkat lunak (SDLC - Software Development Life Cycle) model klasik adalah...",
      options: [
        { key: "A", text: "Implementasi (Koding) → Analisis Kebutuhan → Desain → Pengujian → Penerapan" },
        { key: "B", text: "Analisis Kebutuhan → Perancangan (Desain) → Implementasi (Koding) → Pengujian (Testing) → Penerapan & Pemeliharaan" },
        { key: "C", text: "Pengujian → Desain → Analisis Kebutuhan → Implementasi → Pemeliharaan" },
        { key: "D", text: "Penerapan → Pengujian → Analisis Kebutuhan → Desain → Implementasi" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Tahapan baku SDLC dimulai dari identifikasi kebutuhan pengguna (*Requirements Analysis*), perancangan arsitektur & antarmuka (*Design*), penulisan baris kode (*Implementation*), verifikasi bug (*Testing*), hingga rilis dan perawatan (*Deployment & Maintenance*).",
    },
    {
      id: "mp-02",
      topic: "Wawasan Dunia Kerja Bidang PPLG",
      subElementId: "manajemen-proyek-mutu",
      subElementName: "Manajemen Proyek dan Budaya Mutu",
      difficulty: "sedang",
      type: "single",
      stem: "Sebuah tim pengembang mengadopsi kerangka kerja Scrum. Setiap hari mereka mengadakan pertemuan berdiri singkat berdurasi 15 menit untuk membahas progres kemarin, target hari ini, dan kendala yang dihadapi. Pertemuan ini disebut...",
      options: [
        { key: "A", text: "Sprint Retrospective" },
        { key: "B", text: "Daily Standup Meeting" },
        { key: "C", text: "Sprint Planning" },
        { key: "D", text: "Backlog Refinement" },
      ],
      correctAnswer: ["B"],
      explanation:
        "**Daily Standup Meeting** (Daily Scrum) adalah sinkronisasi harian 15 menit bagi tim rekayasa untuk menjaga transparansi progres dan mengidentifikasi *blocker* (hambatan kerja) sedini mungkin.",
    },
    {
      id: "mp-03",
      topic: "Wawasan Dunia Kerja Bidang PPLG",
      subElementId: "manajemen-proyek-mutu",
      subElementName: "Manajemen Proyek dan Budaya Mutu",
      difficulty: "sulit",
      type: "single",
      stem: "Dalam mewujudkan budaya mutu rekayasa perangkat lunak (*Software Quality Culture*), praktik di mana seorang pengembang memeriksa dan menguji kode yang ditulis oleh rekannya sebelum digabungkan ke cabang utama (*main branch*) disebut...",
      options: [
        { key: "A", text: "Code Refactoring" },
        { key: "B", text: "Peer Code Review" },
        { key: "C", text: "Load Testing" },
        { key: "D", text: "Hotfix Deployment" },
      ],
      correctAnswer: ["B"],
      explanation:
        "**Peer Code Review** adalah pilar budaya mutu software profesional. Melalui review rekan sejawat via Pull Request (PR), kesalahan logika, kerentanan keamanan, dan ketidaksesuaian standar kode dapat terdeteksi sebelum masuk ke lingkungan produksi.",
    },
  ],

  // =========================================================================
  // ELEMEN 2: Kecakapan kerja dasar, K3, dan budaya kerja
  // =========================================================================
  "k3lh-budaya-kerja": [
    {
      id: "k3-01",
      topic: "Kecakapan Kerja Dasar, K3, & Budaya Kerja",
      subElementId: "k3lh-budaya-kerja",
      subElementName: "K3LH dan Budaya Kerja Profesional",
      difficulty: "mudah",
      type: "single",
      stem: "Berdasarkan prinsip ergonomi kerja di laboratorium komputer/kantor IT, posisi layar monitor komputer yang paling ideal terhadap posisi mata pengguna adalah...",
      options: [
        { key: "A", text: "Jauh di bawah lutut dengan sudut pandang 90 derajat ke bawah" },
        { key: "B", text: "Tepat sejajar atau sedikit di bawah garis horizontal mata dengan jarak sekitar 50–70 cm" },
        { key: "C", text: "Menempel sedekat mungkin ke wajah (kurang dari 20 cm) agar tulisan jelas" },
        { key: "D", text: "Tinggi di atas kepala menghadap ke langit-langit ruangan" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Posisi layar sejajar atau 15-20 derajat di bawah garis horizontal mata dengan jarak 50-70 cm (sepanjang rentangan lengan) mencegah ketegangan otot leher (*cervical strain*) dan kelelahan visual.",
    },
    {
      id: "k3-02",
      topic: "Kecakapan Kerja Dasar, K3, & Budaya Kerja",
      subElementId: "k3lh-budaya-kerja",
      subElementName: "K3LH dan Budaya Kerja Profesional",
      difficulty: "sedang",
      type: "single",
      stem: "Untuk mencegah kelelahan mata (*Computer Vision Syndrome*) akibat menatap layar monitor saat koding berjam-jam, aturan relaksasi '20-20-20' menganjurkan...",
      options: [
        { key: "A", text: "Tidur selama 20 menit setiap koding 20 menit pada suhu 20 derajat" },
        { key: "B", text: "Setiap 20 menit menatap layar, alihkan pandangan ke objek sejauh 20 kaki (6 meter) selama minimal 20 detik" },
        { key: "C", text: "Mengganti resolusi layar monitor sebanyak 20 kali setiap 20 jam" },
        { key: "D", text: "Mengetik 20 baris kode setiap 20 menit tanpa jeda" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Aturan **20-20-20** adalah panduan K3 optometris standar: setiap 20 menit melihat layar monitor, istirahatkan mata dengan melihat objek berjarak minimal 20 kaki (sekitar 6 meter) selama 20 detik untuk merelaksasi otot fokus mata.",
    },
  ],

  "pengelolaan-aset": [
    {
      id: "pa-01",
      topic: "Kecakapan Kerja Dasar, K3, & Budaya Kerja",
      subElementId: "pengelolaan-aset",
      subElementName: "Pengelolaan Aset Fisik dan Digital",
      difficulty: "mudah",
      type: "single",
      stem: "File khusus pada proyek berbasis Git yang berfungsi mengabaikan file sementara, folder dependensi pihak ketiga (misal: node_modules/), dan data kredensial rahasia agar tidak terunggah ke repositori publik adalah...",
      options: [
        { key: "A", text: "package.json" },
        { key: "B", text: "README.md" },
        { key: "C", text: ".gitignore" },
        { key: "D", text: "tsconfig.json" },
      ],
      correctAnswer: ["C"],
      explanation:
        "File **`.gitignore`** berisi daftar pola nama file dan direktori yang diperintahkan kepada Git untuk tidak dilacak dan tidak diunggah ke server remote, sangat krusial dalam tata kelola keamanan aset digital.",
    },
    {
      id: "pa-02",
      topic: "Kecakapan Kerja Dasar, K3, & Budaya Kerja",
      subElementId: "pengelolaan-aset",
      subElementName: "Pengelolaan Aset Fisik dan Digital",
      difficulty: "sedang",
      type: "single",
      stem: "Seorang pengembang perlu menyimpan token API rahasia dan kata sandi basis data proyek. Praktik terbaik (*best practice*) dalam tata kelola keamanan aset digital adalah...",
      options: [
        { key: "A", text: "Menulis langsung token dan password sebagai konstanta string di dalam source code JavaScript" },
        { key: "B", text: "Menyimpan token di dalam file .env lokal dan tidak mengunggahnya ke repositori publik" },
        { key: "C", text: "Mengunggah password ke repositori GitHub publik agar rekan tim bisa melihatnya" },
        { key: "D", text: "Menempelkan catatan password di monitor kerja komputer laboratorium" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Kredensial sensitif wajib dikelola melalui **Environment Variables** (file `.env` lokal) yang diabaikan oleh VCS via `.gitignore`. Meng-hardcode rahasia ke file source code publik adalah sumber utama pelanggaran keamanan data.",
    },
  ],

  // =========================================================================
  // ELEMEN 3: Teknologi jaringan komputer
  // =========================================================================
  "lingkungan-os-dev": [
    {
      id: "os-01",
      topic: "Teknologi Jaringan Komputer",
      subElementId: "lingkungan-os-dev",
      subElementName: "Lingkungan Sistem Operasi untuk Pengembangan",
      difficulty: "mudah",
      type: "single",
      stem: "Pada terminal sistem operasi berbasis Linux/Unix, perintah yang digunakan untuk memberikan izin eksekusi (*executable permission*) pada file script 'deploy.sh' adalah...",
      options: [
        { key: "A", text: "chmod +x deploy.sh" },
        { key: "B", text: "mkdir deploy.sh" },
        { key: "C", text: "rm -f deploy.sh" },
        { key: "D", text: "cat deploy.sh" },
      ],
      correctAnswer: ["A"],
      explanation:
        "Perintah **`chmod +x [nama_file]`** menambahkan bit izin eksekusi (`x`) pada file di lingkungan Unix/Linux sehingga file script dapat dijalankan sebagai program.",
    },
    {
      id: "os-02",
      topic: "Teknologi Jaringan Komputer",
      subElementId: "lingkungan-os-dev",
      subElementName: "Lingkungan Sistem Operasi untuk Pengembangan",
      difficulty: "sedang",
      type: "single",
      stem: "Ketika sebuah perintah executable baru (misal: compiler atau runtime) tidak dapat dijalankan dari terminal dan memunculkan error 'command not found', konfigurasi sistem operasi yang paling mungkin perlu diperbaiki adalah...",
      options: [
        { key: "A", text: "Menghapus seluruh file registry Windows" },
        { key: "B", text: "Menambahkan path direktori bin dari program tersebut ke variabel lingkungan PATH sistem" },
        { key: "C", text: "Mengubah resolusi kartu grafis" },
        { key: "D", text: "Mengganti nama pengguna sistem operasi" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Variabel lingkungan **`PATH`** memberi tahu sistem operasi daftar direktori tempat berkas-berkas program executable berada. Menambahkan direktori bin ke `PATH` memungkinkan program dipanggil secara global dari shell manapun.",
    },
  ],

  "infrastruktur-jaringan-dasar": [
    {
      id: "infr-01",
      topic: "Teknologi Jaringan Komputer",
      subElementId: "infrastruktur-jaringan-dasar",
      subElementName: "Infrastruktur dan Perangkat Jaringan",
      difficulty: "mudah",
      type: "single",
      stem: "Alamat IP loopback standar yang digunakan oleh pengembang perangkat lunak untuk mengakses server lokal yang sedang berjalan di komputer yang sama (localhost) adalah...",
      options: [
        { key: "A", text: "192.168.1.1" },
        { key: "B", text: "127.0.0.1" },
        { key: "C", text: "8.8.8.8" },
        { key: "D", text: "255.255.255.0" },
      ],
      correctAnswer: ["B"],
      explanation:
        "**`127.0.0.1`** adalah alamat IP loopback IPv4 standar yang merepresentasikan antarmuka jaringan lokal (*localhost*) pada mesin yang sedang digunakan.",
    },
    {
      id: "infr-02",
      topic: "Teknologi Jaringan Komputer",
      subElementId: "infrastruktur-jaringan-dasar",
      subElementName: "Infrastruktur dan Perangkat Jaringan",
      difficulty: "sedang",
      type: "single",
      stem: "Perintah CLI jaringan yang paling cepat digunakan untuk menguji ketersediaan koneksi dan mengukur waktu latensi bolak-balik (Round Trip Time) ke server database remote adalah...",
      options: [
        { key: "A", text: "ping" },
        { key: "B", text: "format" },
        { key: "C", text: "copy" },
        { key: "D", text: "kill" },
      ],
      correctAnswer: ["A"],
      explanation:
        "Perintah **`ping`** mengirimkan paket ICMP Echo Request ke host tujuan dan mengukur waktu respons (RTT) serta persentase packet loss untuk menguji konektivitas jaringan dasar.",
    },
  ],

  "arsitektur-tcp-ip": [
    {
      id: "tcp-01",
      topic: "Teknologi Jaringan Komputer",
      subElementId: "arsitektur-tcp-ip",
      subElementName: "Arsitektur dan Mekanisme TCP/IP",
      difficulty: "sedang",
      type: "single",
      stem: "Dalam model protokol komunikasi TCP/IP, perbedaan mendasar antara protokol TCP (Transmission Control Protocol) dan UDP (User Datagram Protocol) adalah...",
      options: [
        { key: "A", text: "TCP bersifat connectionless tanpa jaminan, sedangkan UDP menggunakan 3-way handshake" },
        { key: "B", text: "TCP berorientasi koneksi dan menjamin keutuhan urutan paket data, sedangkan UDP bersifat connectionless dan mengutamakan kecepatan" },
        { key: "C", text: "TCP hanya bekerja pada kabel fiber optik, sedangkan UDP hanya pada satelit" },
        { key: "D", text: "TCP tidak memiliki nomor port, sedangkan UDP memiliki nomor port" },
      ],
      correctAnswer: ["B"],
      explanation:
        "**TCP** adalah protokol *connection-oriented* yang menjamin setiap paket tiba tanpa cacat dan berurutan via acknowledgement dan retransmisi. Sebaliknya, **UDP** bersifat *connectionless* (tanpa handshake) sehingga jauh lebih cepat dan ideal untuk live streaming audio/video dan game multiplayer.",
    },
    {
      id: "tcp-02",
      topic: "Teknologi Jaringan Komputer",
      subElementId: "arsitektur-tcp-ip",
      subElementName: "Arsitektur dan Mekanisme TCP/IP",
      difficulty: "sulit",
      type: "single",
      stem: "Seorang web developer membuat RESTful API. Ketika klien mengirimkan permintaan `GET /api/users/999` namun data dengan ID 999 tidak ada di database, kode status HTTP standar yang wajib dikembalikan adalah...",
      options: [
        { key: "A", text: "200 OK" },
        { key: "B", text: "201 Created" },
        { key: "C", text: "404 Not Found" },
        { key: "D", text: "500 Internal Server Error" },
      ],
      correctAnswer: ["C"],
      explanation:
        "Status **404 Not Found** menandakan bahwa server berhasil menerima request, namun resource atau entitas yang diminta tidak ditemukan di server.",
    },
  ],

  // =========================================================================
  // ELEMEN 4: Pemrograman Terstruktur
  // =========================================================================
  "tipe-struktur-data": [
    {
      id: "tsd-01",
      topic: "Pemrograman Terstruktur",
      subElementId: "tipe-struktur-data",
      subElementName: "Struktur Data dan Tipe Data",
      difficulty: "mudah",
      type: "single",
      stem: "Struktur data linier yang bekerja dengan prinsip LIFO (Last In First Out), di mana elemen yang terakhir kali ditambahkan akan menjadi elemen yang pertama kali diambil, adalah...",
      options: [
        { key: "A", text: "Queue" },
        { key: "B", text: "Stack" },
        { key: "C", text: "Linked List" },
        { key: "D", text: "Binary Tree" },
      ],
      correctAnswer: ["B"],
      explanation:
        "**Stack (Tumpukan)** beroperasi menggunakan prinsip **LIFO** (*Last In First Out*). Operasi utamanya adalah `push` (menumpuk elemen di atas) dan `pop` (mengambil elemen paling atas).",
    },
    {
      id: "tsd-02",
      topic: "Pemrograman Terstruktur",
      subElementId: "tipe-struktur-data",
      subElementName: "Struktur Data dan Tipe Data",
      difficulty: "sedang",
      type: "single",
      stem: "Mengapa pengaksesan elemen array melalui indeks numerik (misal: `data[4]`) memiliki kompleksitas waktu konstan O(1)?",
      options: [
        { key: "A", text: "Karena array memeriksa setiap elemen satu per satu dari awal hingga akhir" },
        { key: "B", text: "Karena elemen array disimpan pada blok memori yang kontigu (berurutan) sehingga alamatnya dapat langsung dikalkulasi secara matematis" },
        { key: "C", text: "Karena array otomatis mengompresi ukuran data menjadi 1 byte" },
        { key: "D", text: "Karena array tidak tersimpan di RAM melainkan di harddisk" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Elemen array disimpan secara berurutan (*contiguous memory blocks*). Alamat memori elemen ke-i dapat dihitung secara instan dengan rumus `Base_Address + (i * ukuran_tipe_data)`, menghasilkan kompleksitas **O(1)**.",
    },
  ],

  "struktur-kontrol-program": [
    {
      id: "skp-01",
      topic: "Pemrograman Terstruktur",
      subElementId: "struktur-kontrol-program",
      subElementName: "Struktur Kontrol Program",
      difficulty: "sedang",
      type: "single",
      stem: "Perhatikan cuplikan logika perulangan berikut:\n\n```javascript\nlet count = 5;\nwhile (count > 0) {\n  console.log(count);\n  // Tidak ada perubahan nilai pada variabel count\n}\n```\n\nMasalah utama yang akan terjadi saat kode di atas dieksekusi adalah...",
      options: [
        { key: "A", text: "Program langsung berhenti tanpa mencetak apa pun" },
        { key: "B", text: "Terjadi Infinite Loop (perulangan tak terhingga) karena kondisi count > 0 selalu bernilai true" },
        { key: "C", text: "Nilai count otomatis menjadi 0 pada iterasi pertama" },
        { key: "D", text: "Syntax error karena while tidak boleh menerima operator perbandingan" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Karena tidak ada operasi dekrementasi (misal: `count--`), nilai `count` akan selalu tetap 5 sehingga kondisi `count > 0` selalu bernilai `true`. Hal ini menyebabkan **Infinite Loop** yang menghabiskan sumber daya CPU.",
    },
    {
      id: "skp-02",
      topic: "Pemrograman Terstruktur",
      subElementId: "struktur-kontrol-program",
      subElementName: "Struktur Kontrol Program",
      difficulty: "mudah",
      type: "single",
      stem: "Perbedaan mendasar antara perulangan `while` dan perulangan `do-while` adalah...",
      options: [
        { key: "A", text: "`do-while` menjamin blok kode dieksekusi minimal satu kali sebelum kondisi diperiksa, sedangkan `while` memeriksa kondisi di awal" },
        { key: "B", text: "`while` hanya bisa berjalan pada bilangan genap" },
        { key: "C", text: "`do-while` tidak memerlukan kondisi terminasi" },
        { key: "D", text: "`while` selalu dieksekusi minimal 10 kali" },
      ],
      correctAnswer: ["A"],
      explanation:
        "Pada perulangan **`do-while`**, blok pernyataan dieksekusi terlebih dahulu baru kemudian kondisinya dievaluasi pada bagian akhir. Sehingga jika kondisinya sejak awal sudah bernilai false, blok pernyataan tetap dieksekusi setidaknya 1 kali.",
    },
  ],

  "modularisasi-program": [
    {
      id: "mp-sub-01",
      topic: "Pemrograman Terstruktur",
      subElementId: "modularisasi-program",
      subElementName: "Modularisasi Program",
      difficulty: "mudah",
      type: "single",
      stem: "Perbedaan konseptual paling mendasar antara 'Fungsi' (*Function*) dan 'Prosedur' (*Procedure*) dalam pemrograman terstruktur adalah...",
      options: [
        { key: "A", text: "Fungsi mengembalikan nilai kembali (return value), sedangkan prosedur tidak mengembalikan nilai" },
        { key: "B", text: "Fungsi tidak boleh memiliki parameter, sedangkan prosedur wajib memiliki parameter" },
        { key: "C", text: "Prosedur ditulis dalam huruf kapital, sedangkan fungsi huruf kecil" },
        { key: "D", text: "Fungsi hanya bisa dipanggil satu kali dalam satu program" },
      ],
      correctAnswer: ["A"],
      explanation:
        "**Fungsi** menghasilkan dan mengembalikan nilai kembali (*return value*) ke pemanggilnya, sedangkan **Prosedur** (sering bertipe `void`) hanya menjalankan rangkaian instruksi tindakan tanpa mengembalikan nilai.",
    },
    {
      id: "mp-sub-02",
      topic: "Pemrograman Terstruktur",
      subElementId: "modularisasi-program",
      subElementName: "Modularisasi Program",
      difficulty: "sedang",
      type: "single",
      stem: "Dalam prinsip arsitektur modularitas perangkat lunak yang berkualitas tinggi, karakteristik desain modul yang diharapkan adalah...",
      options: [
        { key: "A", text: "Low Cohesion dan High Coupling" },
        { key: "B", text: "High Cohesion dan Low Coupling" },
        { key: "C", text: "Tergantung pada seluruh modul lain secara langsung" },
        { key: "D", text: "Menggabungkan seluruh fungsi aplikasi ke dalam satu file besar tanpa modul terpisah" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Desain software yang baik memiliki **High Cohesion** (setiap modul fokus secara utuh pada satu tanggung jawab spesifik) dan **Low Coupling** (tingkat ketergantungan antar-modul diminimalkan agar mudah dimodifikasi secara mandiri).",
    },
  ],

  // =========================================================================
  // ELEMEN 5: Pemrograman Berorientasi Objek (OOP)
  // =========================================================================
  "konsep-dasar-oop": [
    {
      id: "oop-kd-01",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "konsep-dasar-oop",
      subElementName: "Konsep Dasar dan Prinsip OOP",
      difficulty: "mudah",
      type: "single",
      stem: "Dalam pemrograman berorientasi objek (OOP), analogi yang tepat untuk 'Class' dan 'Object' adalah...",
      options: [
        { key: "A", text: "Class adalah mobil yang sedang berjalan, Object adalah cetak biru kertasnya" },
        { key: "B", text: "Class adalah cetak biru (blueprint) atau template, sedangkan Object adalah wujud nyata hasil cetakan (instance) di memori" },
        { key: "C", text: "Class dan Object adalah istilah yang sama persis tanpa perbedaan" },
        { key: "D", text: "Class adalah nama variabel primitif, Object adalah nilainya" },
      ],
      correctAnswer: ["B"],
      explanation:
        "**Class** bertindak sebagai cetak biru (*blueprint*) konseptual yang mendefinisikan atribut dan perilaku. Sedangkan **Object** adalah instansiasi nyata (*concrete instance*) yang dibuat dari class tersebut dan menempati alamat memori.",
    },
    {
      id: "oop-kd-02",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "konsep-dasar-oop",
      subElementName: "Konsep Dasar dan Prinsip OOP",
      difficulty: "sedang",
      type: "single",
      stem: "Method khusus di dalam class yang otomatis dipanggil pada saat sebuah objek baru pertama kali diinstansiasi dengan kata kunci `new` disebut...",
      options: [
        { key: "A", text: "Destructor" },
        { key: "B", text: "Constructor" },
        { key: "C", text: "Getter" },
        { key: "D", text: "Setter" },
      ],
      correctAnswer: ["B"],
      explanation:
        "**Constructor** adalah method spesial yang dijalankan secara otomatis saat inisialisasi objek (`new ClassName()`) untuk mengalokasikan memori dan memberikan nilai awal bagi atribut objek.",
    },
  ],

  "enkapsulasi-access-modifier": [
    {
      id: "oop-enk-01",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "enkapsulasi-access-modifier",
      subElementName: "Enkapsulasi dan Access Modifier",
      difficulty: "sedang",
      type: "single",
      stem: "Perhatikan kebutuhan berikut:\nSebuah atribut `saldo` pada class `RekeningBank` harus bisa diakses oleh class `RekeningBank` itu sendiri dan class turunannya seperti `RekeningTabungan`, tetapi TIDAK boleh diakses langsung secara publik dari luar class. Access modifier yang paling tepat digunakan adalah...",
      options: [
        { key: "A", text: "public" },
        { key: "B", text: "protected" },
        { key: "C", text: "private" },
        { key: "D", text: "static" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Access modifier **`protected`** mengizinkan atribut atau method diakses oleh class yang bersangkutan dan class-class turunannya (*subclass*), tetapi melarang akses dari luar hierarki class.",
    },
    {
      id: "oop-enk-02",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "enkapsulasi-access-modifier",
      subElementName: "Enkapsulasi dan Access Modifier",
      difficulty: "sedang",
      type: "single",
      stem: "Tujuan utama diterapkannya prinsip Enkapsulasi (*Encapsulation*) dan method Setter/Getter pada class adalah...",
      options: [
        { key: "A", text: "Agar seluruh atribut class dapat diedit secara bebas tanpa aturan" },
        { key: "B", text: "Menyembunyikan detail representasi internal data dan menjaga integritas data melalui mekanisme validasi terkontrol" },
        { key: "C", text: "Meningkatkan ukuran file binary program" },
        { key: "D", text: "Mencegah program menggunakan memori komputer" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Enkapsulasi bertujuan melindungi atribut privat dari manipulasi sembarangan dari luar (*data hiding*). Melalui method **Setter**, kita dapat menyematkan logika validasi (misal: saldo tidak boleh negatif) sebelum data disimpan.",
    },
  ],

  "pewarisan-inheritance": [
    {
      id: "oop-pew-01",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "pewarisan-inheritance",
      subElementName: "Pewarisan",
      difficulty: "sedang",
      type: "single",
      stem: "Dalam bahasa pemrograman berbasis OOP seperti Java, TypeScript, atau PHP, kata kunci yang digunakan untuk mendeklarasikan bahwa suatu class merupakan turunan (subclass) dari class lain (superclass) adalah...",
      options: [
        { key: "A", text: "implements" },
        { key: "B", text: "extends" },
        { key: "C", text: "inherits" },
        { key: "D", text: "instanceof" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Kata kunci **`extends`** digunakan untuk membentuk relasi pewarisan (*inheritance*) antar-class konkrit, di mana subclass mewarisi properti dan method dari superclass.",
    },
    {
      id: "oop-pew-02",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "pewarisan-inheritance",
      subElementName: "Pewarisan",
      difficulty: "sulit",
      type: "single",
      stem: "Di dalam constructor sebuah subclass, kata kunci apa yang wajib dipanggil sebelum mengakses properti `this` guna mengeksekusi constructor milik superclass induk?",
      options: [
        { key: "A", text: "parent()" },
        { key: "B", text: "super()" },
        { key: "C", text: "base()" },
        { key: "D", text: "root()" },
      ],
      correctAnswer: ["B"],
      explanation:
        "Fungsi **`super()`** digunakan di dalam constructor subclass untuk meneruskan argumen dan memanggil constructor milik superclass induk agar inisialisasi sifat-sifat dasar induk selesai sebelum subclass menambahkan kustomisasinya.",
    },
  ],

  "polymorphism": [
    {
      id: "oop-poly-01",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "polymorphism",
      subElementName: "Polymorphism",
      difficulty: "sedang",
      type: "single",
      stem: "Sebuah superclass `Bentuk` memiliki method `hitungLuas()`. Subclass `Persegi` dan `Lingkaran` masing-masing menulis ulang implementasi method `hitungLuas()` tersebut dengan rumus matematika spesifiknya sendiri. Konsep OOP ini disebut...",
      options: [
        { key: "A", text: "Method Overriding" },
        { key: "B", text: "Method Overloading" },
        { key: "C", text: "Class Destructor" },
        { key: "D", text: "Static Variable" },
      ],
      correctAnswer: ["A"],
      explanation:
        "**Method Overriding** adalah mekanisme polymorphism saat runtime (*runtime polymorphism*) di mana subclass menulis ulang implementasi method yang diwariskan dari superclass dengan nama, parameter, dan return type yang sama.",
    },
    {
      id: "oop-poly-02",
      topic: "Pemrograman Berorientasi Objek",
      subElementId: "polymorphism",
      subElementName: "Polymorphism",
      difficulty: "sulit",
      type: "single",
      stem: "Perhatikan potongan kode berikut:\n\n```typescript\nconst daftarKendaraan: Kendaraan[] = [\n  new Mobil(),\n  new Pesawat(),\n  new Kapal()\n];\n\ndaftarKendaraan.forEach(k => k.bergerak());\n```\n\nKode di atas dapat mengeksekusi perilaku `bergerak()` yang berbeda secara otomatis untuk setiap objek karena menerapkan prinsip...",
      options: [
        { key: "A", text: "Enkapsulasi" },
        { key: "B", text: "Polimorfisme (Polymorphism)" },
        { key: "C", text: "Serialisasi" },
        { key: "D", text: "Kompilasi JIT" },
      ],
      correctAnswer: ["B"],
      explanation:
        "**Polimorfisme** memungkinkan kumpulan objek dari turunan yang berbeda ditampung dalam tipe referensi umum (`Kendaraan[]`) dan merespons pemanggilan method yang sama (`bergerak()`) dengan perilaku spesifik dari masing-masing tipe konkritnya.",
    },
  ],
};

export function getQuestionsForSubElement(subElementId: string): Question[] {
  return SUB_ELEMENT_QUESTIONS[subElementId] || [];
}
