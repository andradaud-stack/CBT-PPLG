import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, detectPromptInjection, sanitizeInput } from "@/lib/security";

const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
  context: z
    .object({
      questionStem: z.string().optional(),
      topic: z.string().optional(),
      explanation: z.string().optional(),
      options: z
        .array(
          z.object({
            key: z.string(),
            text: z.string(),
          })
        )
        .optional(),
      userAnswer: z.array(z.string()).optional(),
      correctAnswer: z.array(z.string()).optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Protection (Anti-Spam & DoS)
    const rateCheck = checkRateLimit(req, { keyPrefix: "ai-chat", limit: 25, windowMs: 60000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Batas interaksi terlampaui. Silakan tunggu ${rateCheck.resetInSec} detik sebelum mengirim pesan kembali demi kenyamanan server.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = ChatRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Format pesan tidak valid" },
        { status: 400 }
      );
    }

    const { messages, context } = parseResult.data;
    const rawUserMessage = messages[messages.length - 1]?.content || "";

    // 2. Prompt Injection & Jailbreak Defense (Cybersecurity Shield)
    const injectionCheck = detectPromptInjection(rawUserMessage);
    if (injectionCheck.isSuspicious) {
      return NextResponse.json({
        success: true,
        reply:
          "🛡️ **Peringatan Keamanan Sistem CBT**: Sistem mendeteksi upaya bypass atau manipulasi instruksi terproteksi.\n\nSebagai asisten belajar resmi SMK PPLG, saya diprogram untuk menjaga integritas akademik. Saya tetap siap membimbingmu memahami logika pemrograman, arsitektur OOP, jaringan komputer, atau materi TKA lainnya secara etis dan mendalam. Apa konsep yang ingin kamu bahas?",
      });
    }

    const lastUserMessage = sanitizeInput(rawUserMessage);

    // Konfigurasi 9Router / Groq Cloud
    const routerBase = process.env.ROUTER_API_BASE || "http://localhost:20128/v1";
    const routerKey = process.env.ROUTER_API_KEY || "sk-fdec9f6ad9f84ba4-6svwwa-1b77b208";
    const routerModel = process.env.ROUTER_MODEL || "openai/gpt-oss-120b";

    let systemPrompt = `Kamu adalah CBT-PPLG AI Tutor, asisten pengajar cerdas, ramah, dan interaktif untuk siswa SMK jurusan PPLG (Pengembangan Perangkat Lunak dan Gim) yang sedang bersiap menghadapi Tes Kemampuan Akademik (TKA) Standar Resmi Kemendikdasmen.

Kurikulum acuan terdiri dari 5 Elemen Utama & 14 Sub-elemen:
1. Wawasan Dunia Kerja Bidang PPLG (Profesi IT, Technopreneurship, SDLC Agile/Scrum/Waterfall, Budaya Mutu & Testing).
2. Kecakapan Kerja Dasar, K3, dan Budaya Kerja (K3LH ergonomis, postur duduk, mitigasi bahaya kelistrikan, Budaya Kerja 5R/5S: Ringkas, Rapi, Resik, Rawat, Rajin).
3. Jaringan Komputer Dasar (Model OSI 7 Layer, Protokol TCP/IP, Pengalamatan IPv4 & Perhitungan Subnetting CIDR /24-/30, Topologi Jaringan).
4. Algoritma dan Pemrograman Dasar (Tipe data primitif & komposit, percabangan if-else/switch-case, perulangan for/while/do-while, array 1D/2D, fungsi modular & parameter passing).
5. Pemrograman Berorientasi Objek & Rekayasa Lanjut (Konsep Class/Object, 4 Pilar PBO: Enkapsulasi [access modifier], Pewarisan [extends], Polimorfisme [overloading/overriding], Abstraksi [abstract class & interface], serta Arsitektur MVC: Model-View-Controller).

Pedoman format tampilan (SANGAT PENTING):
1. JANGAN PERNAH gunakan diagram pohon ASCII atau karakter ranting seperti '├──', '└──', atau '|'. Gunakan daftar poin biasa yang bersih.
2. JANGAN PERNAH gunakan pemisah garis kasar seperti '---', '***', atau garis strip berulang.
3. JANGAN gunakan komentar SQL '--' di luar blok kode.
4. Hindari penggunaan tanda pagar (#, ##, ###) berlebihan. Gunakan teks tebal seperti **1. Konsep Utama** untuk sub-bagian agar nyaman dibaca di antarmuka chat.
5. Jika ada contoh potongan program, SELALU bungkus rapi dengan blok kode:
\`\`\`nama_bahasa
// kode di sini
\`\`\`
6. Jelaskan konsep dengan gaya mengajar yang jelas, to the point, menggunakan analogi dunia nyata yang mudah dipahami siswa SMK.
7. Selalu gunakan Bahasa Indonesia yang ramah, memotivasi, dan profesional.`;

    if (context?.questionStem) {
      systemPrompt += `\n\n[KONTEKS SOAL YANG SEDANG DITELAAH SISWA]
Topik: ${context.topic || "PPLG"}
Pertanyaan: ${context.questionStem}
${context.options && context.options.length > 0 ? `Pilihan Opsi:\n${context.options.map((o) => `- Opsi ${o.key}: ${o.text}`).join("\n")}` : ""}
${context.userAnswer && context.userAnswer.length > 0 ? `Pilihan Siswa: Opsi ${context.userAnswer.join(", ")}` : "Pilihan Siswa: Belum Dijawab"}
${context.correctAnswer && context.correctAnswer.length > 0 ? `Kunci Jawaban Benar: Opsi ${context.correctAnswer.join(", ")}` : ""}
${context.explanation ? `Pembahasan Resmi: ${context.explanation}` : ""}

Instruksi Tambahan untuk Pembahasan Soal:
- Siswa sedang menelaah soal ini secara mendalam. Jika siswa bertanya kenapa jawabannya salah, bedah alasan kekeliruannya dan bandingkan dengan kunci jawaban.
- Jika siswa meminta penjelasan konsep dasar atau contoh implementasi, berikan step-by-step yang mudah dipahami.`;
    }

    // 1. Panggil 9Router OpenAI-compatible endpoint
    try {
      const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ];

      const res = await fetch(`${routerBase}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${routerKey}`,
        },
        body: JSON.stringify({
          model: routerModel,
          messages: formattedMessages,
          max_tokens: 1500,
          stream: false,
        }),
        signal: AbortSignal.timeout(18000),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText =
          data?.choices?.[0]?.message?.content ||
          data?.choices?.[0]?.message?.reasoning_content;
        if (replyText) {
          return NextResponse.json({
            success: true,
            source: routerModel,
            reply: replyText,
          });
        }
      } else {
        const errText = await res.text();
        console.warn("AI Router non-ok response:", res.status, errText);
      }
    } catch (routerErr) {
      console.warn("AI Router call error, falling back to local pedagogical engine:", routerErr);
    }

    // 2. Fallback: Pedagogical Engine lokal terstandarisasi Kemendikdasmen
    const fallbackReply = generatePedagogicalResponse(lastUserMessage, context);

    return NextResponse.json({
      success: true,
      source: "cendekia-tutor-engine",
      reply: fallbackReply,
    });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pesan AI Tutor" },
      { status: 500 }
    );
  }
}

function generatePedagogicalResponse(
  query: string,
  context?: { questionStem?: string; topic?: string; explanation?: string }
): string {
  const q = query.toLowerCase();

  if (context?.questionStem && (q.includes("soal") || q.includes("kenapa") || q.includes("jelasin"))) {
    return `Tentu, mari kita bedah soal ini bersama-sama! 💡

**Topik:** ${context.topic || "PPLG"}
**Pertanyaan:**
${context.questionStem}

**Analisis Konsep:**
${context.explanation || "Perhatikan pola logika dan kata kunci utama pada pertanyaan di atas."}

Ada istilah atau sintaksis yang ingin kamu tanyakan lebih detail?`;
  }

  // Elemen 1: Wawasan Dunia Kerja & SDLC / Scrum
  if (q.includes("sdlc") || q.includes("scrum") || q.includes("waterfall") || q.includes("wawasan dunia kerja")) {
    return `Mari pelajari **Tahapan SDLC & Metodologi Scrum** (Elemen 1 Kemendikdasmen): 🚀

**1. Tahapan Utama SDLC (Software Development Life Cycle)**
* **Requirement Analysis:** Mengumpulkan dan memvalidasi kebutuhan klien/pengguna.
* **Design / Perancangan:** Menyusun wireframe, database schema, dan arsitektur sistem.
* **Implementation / Coding:** Menulis kode program sesuai spesifikasi.
* **Testing:** Memverifikasi fungsionalitas dan mencari bug (QA/Tester).
* **Deployment:** Meluncurkan aplikasi ke server produksi.
* **Maintenance:** Pemeliharaan rutin, perbaikan bug, dan rilis fitur baru.

**2. Metodologi Agile & Scrum**
* **Sprint:** Siklus pengembangan berulang dalam durasi 1–4 minggu.
* **Sprint Planning:** Menentukan item *Product Backlog* yang akan dikerjakan selama sprint.
* **Daily Standup:** Rapat harian 15 menit membahas apa yang sudah selesai, rencana hari ini, dan kendala.
* **Sprint Review & Retrospective:** Evaluasi hasil kerja produk dan evaluasi proses kerja tim.

**Perbedaan Kunci dengan Waterfall:**
Waterfall bersifat sekuensial linear (tahap baru dimulai setelah tahap sebelumnya tuntas), sedangkan Scrum bersifat iteratif dan adaptif terhadap perubahan cepat kebutuhan pasar.`;
  }

  // Elemen 2: K3LH & 5R / 5S
  if (q.includes("k3") || q.includes("5r") || q.includes("ergonomis") || q.includes("budaya kerja")) {
    return `Berikut rangkuman standar **K3LH & Budaya Kerja 5R/5S** (Elemen 2 Kemendikdasmen): 🛡️

**1. Prinsip Ergonomi di Lab Komputer**
* **Posisi Duduk:** Punggung tegak bersandar (90°–100°), paha sejajar lantai, dan kaki menapak rata di lantai atau footrest.
* **Jarak Pandang Layar:** 50–70 cm dari mata, dengan bagian atas monitor sejajar atau sedikit di bawah tinggi mata.
* **Aturan 20-20-20:** Setiap 20 menit menatap layar, istirahatkan mata dengan melihat objek berjarak 20 kaki (6 meter) selama 20 detik guna mencegah *Computer Vision Syndrome (CVS)*.

**2. Budaya Kerja 5R (Seiri, Seiton, Seiso, Seiketsu, Shitsuke)**
* **Ringkas (Seiri):** Memisahkan aset/berkas penting dari yang tidak terpakai, buang yang tidak diperlukan.
* **Rapi (Seiton):** Menata kabel, perangkat keras, dan folder digital agar mudah ditemukan seketika.
* **Resik (Seiso):** Membersihkan debu CPU, keyboard, layar, dan meja kerja secara rutin.
* **Rawat (Seiketsu):** Memelihara standar kebersihan dan keteraturan secara konsisten melalui SOP.
* **Rajin (Shitsuke):** Membiasakan kedisiplinan diri untuk mematuhi semua aturan K3LH tanpa perlu diawasi.`;
  }

  // Elemen 3: Subnetting IP & TCP/IP
  if (q.includes("subnet") || q.includes("tcp/ip") || q.includes("osi") || q.includes("jaringan") || q.includes("ip address")) {
    return `Mari kita pahami **Subnetting IPv4 & Protokol Jaringan** (Elemen 3 Kemendikdasmen): 🌐

**1. Rumus Cepat Subnetting CIDR**
* Prefix **/24:** Subnet mask \`255.255.255.0\` → Total 256 IP, Host valid = **254** (dikurangi Network ID & Broadcast).
* Prefix **/28:** Rentang blok = 2^(32-28) = 2^4 = **16 IP**.
  * Host valid = 16 - 2 = **14 host**.
* Prefix **/29:** Rentang blok = 2^(32-29) = 2^3 = **8 IP** (Host valid = **6**).
* Prefix **/30:** Rentang blok = 2^(32-30) = 2^2 = **4 IP** (Host valid = **2**, ideal untuk koneksi point-to-point antar router).

**2. Hubungan TCP/IP vs Model OSI 7 Layer**
* **Application (Layer 7):** HTTP, HTTPS, DNS, SSH, FTP.
* **Transport (Layer 4):** TCP (handshake 3 arah, andal, berorientasi koneksi) & UDP (cepat, tanpa konfirmasi, streaming/game real-time).
* **Network / Internet (Layer 3):** IP (IPv4/IPv6), ICMP (Ping), routing paket antar jaringan.
* **Network Interface / Data Link & Physical (Layer 2 & 1):** Frame Ethernet, MAC Address, kabel UTP, Wi-Fi.`;
  }

  // Elemen 4: Algoritma & Looping
  if (q.includes("loop") || q.includes("perulangan") || q.includes("while") || q.includes("for") || q.includes("algoritma")) {
    return `Berikut perbandingan **Struktur Perulangan (Looping)** (Elemen 4 Kemendikdasmen): ⚙️

**1. Perulangan For (Counted Loop)**
Digunakan saat jumlah iterasi sudah diketahui secara pasti sejak awal.
\`\`\`javascript
// Menghitung angka 1 sampai 5
for (let i = 1; i <= 5; i++) {
  console.log("Iterasi ke: " + i);
}
\`\`\`

**2. Perulangan While (Uncounted Loop / Pre-test)**
Kondisi diuji di **awal**. Jika kondisi dari awal sudah bernilai \`false\`, blok perulangan **tidak akan pernah dieksekusi sama sekali (0 kali)**.
\`\`\`javascript
let balance = 100;
while (balance > 0) {
  balance -= 25;
}
\`\`\`

**3. Perulangan Do-While (Post-test)**
Kondisi diuji di **akhir**. Blok kode dijamin akan dieksekusi **minimal 1 kali**, meskipun kondisi langsung bernilai false.
\`\`\`javascript
let input;
do {
  input = prompt("Ketik 'YA' untuk melanjutkan:");
} while (input !== "YA");
\`\`\``;
  }

  // Elemen 5: PBO / 4 Pilar & MVC
  if (q.includes("oop") || q.includes("pbo") || q.includes("pilar") || q.includes("enkapsulasi") || q.includes("polimorfisme") || q.includes("inheritance")) {
    return `Berikut ringkasan **4 Pilar Pemrograman Berorientasi Objek (PBO)** (Elemen 5 Kemendikdasmen): 🏛️

**1. Enkapsulasi (Encapsulation)**
Membungkus data (atribut) dan metode ke dalam satu unit (class), serta menyembunyikan detail internal dengan modifier \`private\`. Akses dari luar dikontrol via *getter* dan *setter*.

**2. Pewarisan (Inheritance)**
Mekanisme di mana kelas turunan (*child class*) mewarisi atribut dan metode dari kelas induk (*parent class*) menggunakan kata kunci \`extends\`. Memudahkan *reusability* kode.

**3. Polimorfisme (Polymorphism)**
Kemampuan satu nama metode untuk memiliki banyak bentuk implementasi berbeda:
* **Overloading (Compile-time):** Metode dengan nama sama tetapi parameter berbeda dalam satu kelas.
* **Overriding (Runtime):** Kelas anak menulis ulang isi metode yang diwarisi dari kelas induk menggunakan anotasi \`@Override\`.

**4. Abstraksi (Abstraction)**
Menyembunyikan detail implementasi kompleks dan hanya menampilkan antarmuka fungsional utama melalui \`abstract class\` atau \`interface\`.`;
  }

  if (q.includes("mvc") || q.includes("desain arsitektur")) {
    return `Berikut penjelasan **Arsitektur MVC (Model - View - Controller)** (Elemen 5 Kemendikdasmen): 🧩

**1. Model**
Bertanggung jawab atas data dan logika bisnis aplikasi. Berinteraksi langsung dengan database (membaca, menyimpan, memvalidasi data). Tidak tahu apa-apa tentang tampilan layar.

**2. View**
Bertanggung jawab menampilkan antarmuka (UI) kepada pengguna (HTML/CSS/komponen visual). Hanya menampilkan data yang dikirim oleh Controller.

**3. Controller**
Berperan sebagai perantara dan otak lalu lintas aplikasi. Menerima request/input dari user (lewat View atau route URL), memanggil proses di Model, lalu memilih View mana yang akan ditampilkan ke pengguna.

**Analogi Restoran:**
* **View:** Buku menu dan piring makanan yang disajikan ke pelanggan.
* **Controller:** Pelayan yang mencatat pesanan dari pelanggan lalu membawanya ke dapur.
* **Model:** Koki dan lemari bahan makanan di dapur yang mengolah makanan sesuai pesanan.`;
  }

  return `Halo! Saya **CBT-PPLG AI Tutor**, siap membantumu menguasai materi ujian TKA Kejuruan PPLG sesuai standar resmi **Kemendikdasmen**. 🚀

Kamu bisa menanyakan konsep apa saja seputar 5 Elemen Utama Kisi-Kisi:
* **Elemen 1: Wawasan Dunia Kerja PPLG** — Tahapan SDLC (Scrum & Waterfall), peran profesi IT, technopreneurship, dan budaya mutu (Clean Code & QA).
* **Elemen 2: K3LH & Budaya Kerja 5R** — Ergonomi kerja di depan komputer (aturan 20-20-20), K3 kelistrikan, dan penerapan 5R/5S (Ringkas, Rapi, Resik, Rawat, Rajin).
* **Elemen 3: Jaringan Komputer Dasar** — Model OSI 7 Layer, protokol TCP/IP, rumus perhitungan subnetting IPv4 (CIDR /24 - /30), dan topologi jaringan.
* **Elemen 4: Algoritma & Pemrograman Dasar** — Tipe data primitif/komposit, percabangan IF-ELSE/SWITCH, perbedaan perulangan For vs While vs Do-While, array, dan fungsi modular.
* **Elemen 5: PBO (OOP) & Arsitektur MVC** — 4 Pilar PBO (Enkapsulasi, Pewarisan, Polimorfisme, Abstraksi), relasi class, pengujian unit test, dan pola desain MVC.

Pilih topik cepat di tombol bawah atau ketik pertanyaan spesifikmu!`;
}
