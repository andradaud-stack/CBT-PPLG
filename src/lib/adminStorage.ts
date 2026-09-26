import {
  AdminUserRecord,
  CurriculumElementWeight,
  LearningModuleItem,
  ProctoringLogEntry,
  QuestionModerationItem,
  SimulationConfig,
  SystemAnnouncement,
  UserRole,
} from "@/types/admin";
import { Question } from "@/types";
import { getAttempts, getUserProfile } from "./storage";
import { getRegisteredUsers, saveRegisteredUsers } from "./auth";
import { QUESTION_BANK } from "./questionBank";
import { SUB_ELEMENT_QUESTIONS } from "./subElementQuestions";
import { OFFICIAL_AUTHENTIC_QUESTIONS } from "./tryoutPackages";

const ADMIN_KEYS = {
  SIM_CONFIG: "cbt_admin_sim_config",
  ANNOUNCEMENT: "cbt_admin_announcement",
  CURRICULUM_WEIGHTS: "cbt_admin_curriculum_weights",
  LEARNING_MODULES: "cbt_admin_learning_modules",
  MODERATION_QUEUE: "cbt_admin_moderation_queue",
  CUSTOM_QUESTIONS: "cbt_admin_custom_questions",
  PROCTORING_LOGS: "cbt_admin_proctoring_logs",
  ADMIN_ROLE_PIN: "cbt_admin_role_pin",
};

// 1. Konfigurasi Simulasi Default
export const DEFAULT_SIM_CONFIG: SimulationConfig = {
  totalQuestions: 30,
  durationMinutes: 50,
  easyPercentage: 30,
  mediumPercentage: 50,
  hardPercentage: 20,
  kkmThreshold: 500,
  irtMinScore: 200,
  irtMaxScore: 800,
  strictProctoring: true,
};

// 2. Pengumuman Default
export const DEFAULT_ANNOUNCEMENT: SystemAnnouncement = {
  enabled: true,
  title: "Simulasi Uji Kompetensi Keahlian TKA PPLG 2026/2027",
  message:
    "Selamat datang di Cendekia PPLG Studio. Seluruh paket tryout menerapkan standar pengawasan resmi layar penuh (fullscreen lock) dan IRT parameter 2-PL.",
  type: "info",
  updatedAt: new Date().toISOString(),
};

// 3. Bobot Kurikulum 5 Elemen Kemendikdasmen Default
export const DEFAULT_CURRICULUM_WEIGHTS: CurriculumElementWeight[] = [
  {
    elementId: 1,
    elementName: "Wawasan Dunia Kerja Bidang PPLG",
    weightPercentage: 15,
    subElements: [
      { id: "sub-1.1", name: "Profesi dan Kewirausahaan PPLG", topic: "Profesi dan Kewirausahaan PPLG", targetCount: 2 },
      { id: "sub-1.2", name: "Manajemen Proyek dan Budaya Mutu", topic: "Manajemen Proyek dan Budaya Mutu", targetCount: 2 },
    ],
  },
  {
    elementId: 2,
    elementName: "Kecakapan Kerja Dasar, K3, dan Budaya Kerja",
    weightPercentage: 15,
    subElements: [
      { id: "sub-2.1", name: "K3LH dan Budaya Kerja Profesional", topic: "K3LH dan Budaya Kerja Profesional", targetCount: 2 },
      { id: "sub-2.2", name: "Pengelolaan Aset Fisik dan Digital", topic: "Pengelolaan Aset Fisik dan Digital", targetCount: 2 },
    ],
  },
  {
    elementId: 3,
    elementName: "Teknologi Jaringan Komputer",
    weightPercentage: 20,
    subElements: [
      { id: "sub-3.1", name: "Lingkungan Pengembangan dan Sistem Operasi", topic: "Lingkungan Pengembangan dan Sistem Operasi", targetCount: 2 },
      { id: "sub-3.2", name: "Infrastruktur dan Jaringan Dasar", topic: "Infrastruktur dan Jaringan Dasar", targetCount: 2 },
      { id: "sub-3.3", name: "Arsitektur Jaringan dan Protokol TCP/IP", topic: "Arsitektur Jaringan dan Protokol TCP/IP", targetCount: 2 },
    ],
  },
  {
    elementId: 4,
    elementName: "Pemrograman Terstruktur",
    weightPercentage: 25,
    subElements: [
      { id: "sub-4.1", name: "Konsep Struktur Data dan Tipe Data", topic: "Konsep Struktur Data dan Tipe Data", targetCount: 2 },
      { id: "sub-4.2", name: "Struktur Kontrol Perulangan dan Percabangan", topic: "Struktur Kontrol Perulangan dan Percabangan", targetCount: 3 },
      { id: "sub-4.3", name: "Modularisasi Program dan Fungsi", topic: "Modularisasi Program dan Fungsi", targetCount: 3 },
    ],
  },
  {
    elementId: 5,
    elementName: "Pemrograman Berorientasi Objek (OOP)",
    weightPercentage: 25,
    subElements: [
      { id: "sub-5.1", name: "Konsep Dasar dan Objek OOP", topic: "Konsep Dasar dan Objek OOP", targetCount: 2 },
      { id: "sub-5.2", name: "Enkapsulasi dan Access Modifier", topic: "Enkapsulasi dan Access Modifier", targetCount: 2 },
      { id: "sub-5.3", name: "Pewarisan (Inheritance) dan Overriding", topic: "Pewarisan (Inheritance) dan Overriding", targetCount: 2 },
      { id: "sub-5.4", name: "Polymorphism dan Dynamic Dispatch", topic: "Polymorphism dan Dynamic Dispatch", targetCount: 2 },
    ],
  },
];

// 4. Modul Belajar Silabus Default
export const DEFAULT_LEARNING_MODULES: LearningModuleItem[] = [
  {
    id: "mod-1",
    elementId: 4,
    title: "Panduan Algoritma Rekursif & Modularisasi Fungsi",
    summary: "Konsep fungsi matematis, call-stack tracing, base-case rekursif, dan parameter passing di Python/JavaScript.",
    contentMarkdown: "### Modularisasi Fungsi\nFungsi memecah problem kompleks menjadi sub-rutin kecil. Aturan utama: pastikan memiliki return value jelas dan hindari efek samping (side effects) pada variabel global.",
    order: 1,
    published: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-20T10:00:00Z",
  },
  {
    id: "mod-2",
    elementId: 5,
    title: "Pilar OOP: Inheritance, Polymorphism, & Enkapsulasi",
    summary: "Prinsip reusability kode melalui pewarisan class, dynamic dispatch, overriding method, dan proteksi hak akses private/protected.",
    contentMarkdown: "### 4 Pilar OOP\n1. **Enkapsulasi**: Menyembunyikan state internal objek.\n2. **Abstraksi**: Menyajikan interface esensial.\n3. **Inheritance**: Menurunkan sifat class induk.\n4. **Polymorphism**: Satu interface dengan berbagai implementasi.",
    order: 2,
    published: true,
    createdAt: "2026-09-02T08:00:00Z",
    updatedAt: "2026-09-21T10:00:00Z",
  },
  {
    id: "mod-3",
    elementId: 3,
    title: "Arsitektur Client-Server & Subnetting TCP/IP",
    summary: "Pemetaan IP address classful & CIDR, port protokol standar (HTTP 80, HTTPS 443, MySQL 3306), dan izin berkas web server.",
    contentMarkdown: "### Topologi & Subnetting\n- Prefix `/24` menyediakan 254 host aktif (`256 - 2`).\n- Permission web server Linux default berkas web: `644` untuk file dan `755` untuk direktori.",
    order: 3,
    published: true,
    createdAt: "2026-09-05T08:00:00Z",
    updatedAt: "2026-09-22T11:00:00Z",
  },
];

function isClient(): boolean {
  return typeof window !== "undefined";
}

// ==========================================
// 1. MANAJEMEN PENGGUNA (STUDENTS & USERS)
// ==========================================
const DELETED_USERS_KEY = "cbt_pplg_deleted_user_ids";

function getDeletedUserIds(): Set<string> {
  if (!isClient()) return new Set();
  try {
    const raw = localStorage.getItem(DELETED_USERS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markUserAsDeleted(idOrEmail: string): void {
  if (!isClient()) return;
  try {
    const deleted = getDeletedUserIds();
    deleted.add(idOrEmail);
    localStorage.setItem(DELETED_USERS_KEY, JSON.stringify(Array.from(deleted)));
  } catch (err) {
    console.error("Error marking user as deleted:", err);
  }
}

function unmarkUserAsDeleted(idOrEmail: string): void {
  if (!isClient()) return;
  try {
    const deleted = getDeletedUserIds();
    deleted.delete(idOrEmail);
    localStorage.setItem(DELETED_USERS_KEY, JSON.stringify(Array.from(deleted)));
  } catch (err) {
    console.error("Error unmarking user as deleted:", err);
  }
}

export function getAdminUsers(): AdminUserRecord[] {
  if (!isClient()) return [];
  const registered = getRegisteredUsers();
  const attempts = getAttempts();
  const deletedSet = getDeletedUserIds();

  // Gabungkan dengan data sesi jika belum ada
  const current = getUserProfile();
  const allUsersMap = new Map<string, AdminUserRecord>();

  // Masukkan registered users (lewati yang sudah dihapus)
  registered.forEach((u) => {
    const key = u.id || u.email;
    if (deletedSet.has(u.id) || deletedSet.has(u.email) || deletedSet.has(key)) {
      return;
    }
    allUsersMap.set(key, {
      ...u,
      role: (u as AdminUserRecord).role || (u.email.includes("admin") || u.email.includes("guru") ? "teacher" : "student"),
      status: (u as AdminUserRecord).status || "active",
      createdAt: (u as AdminUserRecord).createdAt || new Date().toISOString(),
    });
  });

  // Masukkan current profile jika belum masuk dan TIDAK dalam daftar yang dihapus
  if (current.id || current.email) {
    const key = current.id || current.email;
    if (!deletedSet.has(current.id) && !deletedSet.has(current.email) && !deletedSet.has(key) && !allUsersMap.has(key)) {
      allUsersMap.set(key, {
        ...current,
        role: "student",
        status: "active",
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Hitung metrik per user berdasarkan attempts
  const result: AdminUserRecord[] = Array.from(allUsersMap.values()).map((user) => {
    const userAttempts = attempts.filter((a) => a.userId === user.id || a.userId === "user-default-1");
    const scores = userAttempts.map((a) => a.irtResult?.score || 0).filter((s) => s > 0);
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const bestScore = scores.length ? Math.max(...scores) : 0;

    return {
      ...user,
      totalAttempts: userAttempts.length,
      averageIrtScore: avgScore,
      bestIrtScore: bestScore,
      lastLoginAt: userAttempts[0]?.finishedAt || user.createdAt,
    };
  });

  return result;
}

export function saveAdminUser(user: AdminUserRecord): void {
  if (!isClient()) return;
  unmarkUserAsDeleted(user.id);
  if (user.email) unmarkUserAsDeleted(user.email);

  const users = getRegisteredUsers();
  const index = users.findIndex((u) => u.id === user.id || u.email === user.email);
  if (index >= 0) {
    users[index] = { ...users[index], ...user };
  } else {
    users.unshift(user);
  }
  saveRegisteredUsers(users);

  // Sync ke database TiDB Cloud di background
  try {
    fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }).catch(() => {});
  } catch {
    // Offline fallback
  }

  window.dispatchEvent(new Event("cendekia:users-updated"));
}

export function deleteAdminUser(userId: string): void {
  if (!isClient()) return;
  // 1. Tandai ID agar tidak dimunculkan lagi oleh storage profile
  markUserAsDeleted(userId);

  // 2. Hapus dari daftar akun terdaftar lokal
  const users = getRegisteredUsers().filter((u) => u.id !== userId && u.email !== userId);
  saveRegisteredUsers(users);

  // 3. Jika user yang dihapus adalah user yang sedang login di sesi lokal, bersihkan sesi
  const current = getUserProfile();
  if (current.id === userId || current.email === userId) {
    localStorage.removeItem("cendekia_user_profile");
    localStorage.removeItem("cbt_pplg_session");
  }

  // 4. Hapus dari database TiDB Serverless via API backend
  try {
    fetch(`/api/admin/users?id=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    }).catch(() => {});
  } catch {
    // Local offline fallback
  }

  window.dispatchEvent(new Event("cendekia:users-updated"));
}

export function toggleUserStatus(userId: string): void {
  if (!isClient()) return;
  const users = getRegisteredUsers();
  const target = users.find((u) => u.id === userId);
  if (target) {
    const current = (target as AdminUserRecord).status || "active";
    (target as AdminUserRecord).status = current === "active" ? "suspended" : "active";
    saveRegisteredUsers(users);
    window.dispatchEvent(new Event("cendekia:users-updated"));
  }
}

export function bulkImportUsers(csvText: string): { successCount: number; errors: string[] } {
  if (!isClient()) return { successCount: 0, errors: [] };
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return { successCount: 0, errors: ["Berkas CSV kosong atau tidak memiliki baris data."] };

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));
  const nameIdx = headers.findIndex((h) => h.includes("nama") || h.includes("name"));
  const emailIdx = headers.findIndex((h) => h.includes("email") || h.includes("mail"));
  const classIdx = headers.findIndex((h) => h.includes("kelas") || h.includes("rombel") || h.includes("class"));
  const schoolIdx = headers.findIndex((h) => h.includes("sekolah") || h.includes("school"));
  const roleIdx = headers.findIndex((h) => h.includes("role") || h.includes("peran"));

  if (nameIdx === -1 || emailIdx === -1) {
    return { successCount: 0, errors: ["Format CSV wajib memiliki kolom 'Nama' dan 'Email'."] };
  }

  const existingUsers = getRegisteredUsers();
  let successCount = 0;
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
    if (row.length <= nameIdx || !row[nameIdx]) continue;

    const name = row[nameIdx];
    const email = row[emailIdx] || `siswa${Date.now() + i}@smk.sch.id`;
    const classGrade = classIdx !== -1 && row[classIdx] ? row[classIdx] : "XII PPLG 1";
    const school = schoolIdx !== -1 && row[schoolIdx] ? row[schoolIdx] : "SMKN 2 Semarang";
    const role: UserRole = roleIdx !== -1 && row[roleIdx]?.toLowerCase() === "teacher" ? "teacher" : "student";

    const exists = existingUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      errors.push(`Baris ${i + 1}: Email ${email} sudah terdaftar, dilewati.`);
      continue;
    }

    const newUser: AdminUserRecord = {
      id: `user-import-${Date.now()}-${i}`,
      name,
      email,
      school,
      classGrade,
      role,
      status: "active",
      createdAt: new Date().toISOString(),
      password: "password123", // default password
      latestIrtScore: 0,
    };

    existingUsers.push(newUser);
    successCount++;
  }

  saveRegisteredUsers(existingUsers);
  window.dispatchEvent(new Event("cendekia:users-updated"));
  return { successCount, errors };
}

// ==========================================
// 2. MANAJEMEN BANK SOAL (ITEM BANK)
// ==========================================
export function getAllQuestionBank(): Question[] {
  if (!isClient()) return [...OFFICIAL_AUTHENTIC_QUESTIONS, ...QUESTION_BANK];
  try {
    const customRaw = localStorage.getItem(ADMIN_KEYS.CUSTOM_QUESTIONS);
    const customQuestions: Question[] = customRaw ? JSON.parse(customRaw) : [];

    // Gabungkan seluruh sumber soal: Resmi, Sub-Element, Standar, dan Custom Admin
    const combined = [
      ...customQuestions,
      ...OFFICIAL_AUTHENTIC_QUESTIONS,
      ...Object.values(SUB_ELEMENT_QUESTIONS).flat(),
      ...QUESTION_BANK,
    ];

    // Buang duplikasi ID jika ada
    const seen = new Set<string>();
    return combined.filter((q) => {
      if (seen.has(q.id)) return false;
      seen.add(q.id);
      return true;
    });
  } catch {
    return [...OFFICIAL_AUTHENTIC_QUESTIONS, ...QUESTION_BANK];
  }
}

export function saveCustomQuestion(question: Question): void {
  if (!isClient()) return;
  try {
    const customRaw = localStorage.getItem(ADMIN_KEYS.CUSTOM_QUESTIONS);
    const list: Question[] = customRaw ? JSON.parse(customRaw) : [];
    const index = list.findIndex((q) => q.id === question.id);
    if (index >= 0) {
      list[index] = question;
    } else {
      list.unshift(question);
    }
    localStorage.setItem(ADMIN_KEYS.CUSTOM_QUESTIONS, JSON.stringify(list));
    window.dispatchEvent(new Event("cendekia:questions-updated"));
  } catch (err) {
    console.error("Error saving custom question:", err);
  }
}

export function deleteCustomQuestion(questionId: string): void {
  if (!isClient()) return;
  try {
    const customRaw = localStorage.getItem(ADMIN_KEYS.CUSTOM_QUESTIONS);
    const list: Question[] = customRaw ? JSON.parse(customRaw) : [];
    const filtered = list.filter((q) => q.id !== questionId);
    localStorage.setItem(ADMIN_KEYS.CUSTOM_QUESTIONS, JSON.stringify(filtered));
    window.dispatchEvent(new Event("cendekia:questions-updated"));
  } catch (err) {
    console.error("Error deleting custom question:", err);
  }
}

// ==========================================
// 3. PENGATURAN SIMULASI & BANNER
// ==========================================
export function getSimulationConfig(): SimulationConfig {
  if (!isClient()) return DEFAULT_SIM_CONFIG;
  try {
    const raw = localStorage.getItem(ADMIN_KEYS.SIM_CONFIG);
    return raw ? { ...DEFAULT_SIM_CONFIG, ...JSON.parse(raw) } : DEFAULT_SIM_CONFIG;
  } catch {
    return DEFAULT_SIM_CONFIG;
  }
}

export function saveSimulationConfig(config: SimulationConfig): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(ADMIN_KEYS.SIM_CONFIG, JSON.stringify(config));
    window.dispatchEvent(new Event("cendekia:config-updated"));
  } catch (err) {
    console.error("Error saving sim config:", err);
  }
}

export function getSystemAnnouncement(): SystemAnnouncement {
  if (!isClient()) return DEFAULT_ANNOUNCEMENT;
  try {
    const raw = localStorage.getItem(ADMIN_KEYS.ANNOUNCEMENT);
    return raw ? { ...DEFAULT_ANNOUNCEMENT, ...JSON.parse(raw) } : DEFAULT_ANNOUNCEMENT;
  } catch {
    return DEFAULT_ANNOUNCEMENT;
  }
}

export function saveSystemAnnouncement(announcement: SystemAnnouncement): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(ADMIN_KEYS.ANNOUNCEMENT, JSON.stringify(announcement));
    window.dispatchEvent(new Event("cendekia:announcement-updated"));
  } catch (err) {
    console.error("Error saving announcement:", err);
  }
}

// ==========================================
// 4. KURIKULUM & BOBOT KISI-KISI
// ==========================================
export function getCurriculumWeights(): CurriculumElementWeight[] {
  if (!isClient()) return DEFAULT_CURRICULUM_WEIGHTS;
  try {
    const raw = localStorage.getItem(ADMIN_KEYS.CURRICULUM_WEIGHTS);
    return raw ? JSON.parse(raw) : DEFAULT_CURRICULUM_WEIGHTS;
  } catch {
    return DEFAULT_CURRICULUM_WEIGHTS;
  }
}

export function saveCurriculumWeights(weights: CurriculumElementWeight[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(ADMIN_KEYS.CURRICULUM_WEIGHTS, JSON.stringify(weights));
    window.dispatchEvent(new Event("cendekia:curriculum-updated"));
  } catch (err) {
    console.error("Error saving curriculum weights:", err);
  }
}

// ==========================================
// 5. MODUL PEMBELAJARAN
// ==========================================
export function getLearningModules(): LearningModuleItem[] {
  if (!isClient()) return DEFAULT_LEARNING_MODULES;
  try {
    const raw = localStorage.getItem(ADMIN_KEYS.LEARNING_MODULES);
    return raw ? JSON.parse(raw) : DEFAULT_LEARNING_MODULES;
  } catch {
    return DEFAULT_LEARNING_MODULES;
  }
}

export function saveLearningModule(mod: LearningModuleItem): void {
  if (!isClient()) return;
  try {
    const list = getLearningModules();
    const index = list.findIndex((m) => m.id === mod.id);
    if (index >= 0) {
      list[index] = { ...mod, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...mod, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(ADMIN_KEYS.LEARNING_MODULES, JSON.stringify(list));
    window.dispatchEvent(new Event("cendekia:modules-updated"));
  } catch (err) {
    console.error("Error saving learning module:", err);
  }
}

export function deleteLearningModule(modId: string): void {
  if (!isClient()) return;
  try {
    const list = getLearningModules().filter((m) => m.id !== modId);
    localStorage.setItem(ADMIN_KEYS.LEARNING_MODULES, JSON.stringify(list));
    window.dispatchEvent(new Event("cendekia:modules-updated"));
  } catch (err) {
    console.error("Error deleting learning module:", err);
  }
}

// ==========================================
// 6. MODERASI & LAPORAN SOAL BERMASALAH
// ==========================================
export function getModerationQueue(): QuestionModerationItem[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(ADMIN_KEYS.MODERATION_QUEUE);
    if (raw) return JSON.parse(raw);

    // Initial dummy / seeded report
    const initialReports: QuestionModerationItem[] = [
      {
        id: "rep-1",
        questionId: "resmi-01",
        stemSnippet: "Permission denied: /var/www/html/index.php...",
        topic: "Teknologi Jaringan Komputer",
        difficulty: "sedang",
        reportedBy: "Siswa Kelas XII",
        reportReason: "Klarifikasi penjelasan opsi chmod vs chown untuk direktori",
        reportedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: "pending",
        ratingScore: -1,
      },
    ];
    localStorage.setItem(ADMIN_KEYS.MODERATION_QUEUE, JSON.stringify(initialReports));
    return initialReports;
  } catch {
    return [];
  }
}

export function updateModerationStatus(reportId: string, status: "pending" | "resolved" | "dismissed"): void {
  if (!isClient()) return;
  try {
    const queue = getModerationQueue();
    const target = queue.find((r) => r.id === reportId);
    if (target) {
      target.status = status;
      localStorage.setItem(ADMIN_KEYS.MODERATION_QUEUE, JSON.stringify(queue));
      window.dispatchEvent(new Event("cendekia:moderation-updated"));
    }
  } catch (err) {
    console.error("Error updating moderation status:", err);
  }
}

// ==========================================
// 7. MONITORING PENGAWASAN (PROCTORING LOGS)
// ==========================================
export function getProctoringLogs(): ProctoringLogEntry[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(ADMIN_KEYS.PROCTORING_LOGS);
    if (raw) return JSON.parse(raw);

    // Generate log otomatis dari attempts yang memiliki violations
    const attempts = getAttempts();
    const autoLogs: ProctoringLogEntry[] = [];

    attempts.forEach((a) => {
      if ((a.tabSwitchCount && a.tabSwitchCount > 0) || a.integrityStatus !== "clean") {
        autoLogs.push({
          id: `proc-log-${a.id}`,
          attemptId: a.id,
          studentName: "Peserta Ujian " + a.userId.slice(-4),
          className: "XII PPLG",
          packageTitle: a.packageName || "Paket Tryout",
          timestamp: a.finishedAt || a.startedAt,
          eventType: a.integrityStatus === "disqualified" ? "disqualified" : "tab_switch",
          severity: a.integrityStatus === "disqualified" ? "critical" : "medium",
          description: `Terdeteksi ${a.tabSwitchCount || 1}x perpindahan tab/jendela selama pengerjaan ujian.`,
        });
      }
    });

    if (autoLogs.length) {
      localStorage.setItem(ADMIN_KEYS.PROCTORING_LOGS, JSON.stringify(autoLogs));
      return autoLogs;
    }

    return [];
  } catch {
    return [];
  }
}
