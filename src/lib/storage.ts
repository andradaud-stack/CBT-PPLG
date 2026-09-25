import {
  Attempt,
  BookmarkedQuestion,
  MasteryLevel,
  PPLGTopic,
  Question,
  QuestionSpeedRecord,
  RemedialQuestion,
  TopicProgress,
  TopicSpeedMetric,
  UserProfile,
} from "@/types";

const STORAGE_KEYS = {
  USER_PROFILE: "cendekia_user_profile",
  ATTEMPTS: "cendekia_attempts",
  TOPIC_PROGRESS: "cendekia_topic_progress",
  RESET_MARKER: "cbt_fresh_clean_accounts_v4",
  REMEDIAL_QUEUE: "cendekia_remedial_queue",
  BOOKMARKS: "cendekia_bookmarked_questions",
  SPEED_LOGS: "cendekia_speed_logs",
  LAST_ACTIVE_TIME: "cendekia_last_active_time",
};

const DEFAULT_USER: UserProfile = {
  id: "",
  name: "Siswa PPLG",
  email: "",
  school: "",
  classGrade: "",
  latestIrtScore: 0, // Awal dari 0
};

// 14 Sub-Elemen Resmi Kemendikdasmen (5 Elemen Kurikulum PPLG)
export const DEFAULT_TOPIC_PROGRESS: TopicProgress[] = [
  // ELEMEN 1: Wawasan Dunia Kerja Bidang PPLG
  {
    topic: "Profesi dan Kewirausahaan PPLG",
    elementId: 1,
    elementName: "Wawasan Dunia Kerja Bidang PPLG",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },
  {
    topic: "Manajemen Proyek dan Budaya Mutu",
    elementId: 1,
    elementName: "Wawasan Dunia Kerja Bidang PPLG",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },

  // ELEMEN 2: Kecakapan Kerja Dasar, K3, dan Budaya Kerja
  {
    topic: "K3LH dan Budaya Kerja Profesional",
    elementId: 2,
    elementName: "Kecakapan Kerja Dasar, K3, dan Budaya Kerja",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },
  {
    topic: "Pengelolaan Aset Fisik dan Digital",
    elementId: 2,
    elementName: "Kecakapan Kerja Dasar, K3, dan Budaya Kerja",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },

  // ELEMEN 3: Teknologi Jaringan Komputer
  {
    topic: "Lingkungan Pengembangan dan Sistem Operasi",
    elementId: 3,
    elementName: "Teknologi Jaringan Komputer",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },
  {
    topic: "Infrastruktur dan Jaringan Dasar",
    elementId: 3,
    elementName: "Teknologi Jaringan Komputer",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },
  {
    topic: "Arsitektur Jaringan dan Protokol TCP/IP",
    elementId: 3,
    elementName: "Teknologi Jaringan Komputer",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },

  // ELEMEN 4: Pemrograman Terstruktur
  {
    topic: "Konsep Struktur Data dan Tipe Data",
    elementId: 4,
    elementName: "Pemrograman Terstruktur",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },
  {
    topic: "Struktur Kontrol Perulangan dan Percabangan",
    elementId: 4,
    elementName: "Pemrograman Terstruktur",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },
  {
    topic: "Modularisasi Program dan Fungsi",
    elementId: 4,
    elementName: "Pemrograman Terstruktur",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },

  // ELEMEN 5: Pemrograman Berorientasi Objek
  {
    topic: "Konsep Dasar dan Objek OOP",
    elementId: 5,
    elementName: "Pemrograman Berorientasi Objek",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },
  {
    topic: "Enkapsulasi dan Access Modifier",
    elementId: 5,
    elementName: "Pemrograman Berorientasi Objek",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },
  {
    topic: "Pewarisan (Inheritance) dan Overriding",
    elementId: 5,
    elementName: "Pemrograman Berorientasi Objek",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },
  {
    topic: "Polymorphism dan Dynamic Dispatch",
    elementId: 5,
    elementName: "Pemrograman Berorientasi Objek",
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    masteryLevel: "Belum Dicoba",
  },
];

// Riwayat awal kosong murni
export const DEFAULT_ATTEMPTS: Attempt[] = [];

function isClient(): boolean {
  return typeof window !== "undefined";
}

const DEPLOY_PRODUCTION_MARKER = "cendekia_deploy_clean_v1";

/**
 * Reset menyeluruh seluruh data lokal client (digunakan saat pertama kali deploy produksi
 * atau saat pengguna/pengawas menekan tombol reset semua data).
 */
export function resetAllApplicationData(): void {
  if (!isClient()) return;
  try {
    // 1. Bersihkan semua kunci storage aplikasi
    localStorage.removeItem("cbt_pplg_registered_users");
    localStorage.removeItem("cbt_pplg_session");
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.TOPIC_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.REMEDIAL_QUEUE);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.SPEED_LOGS);
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE_TIME);
    localStorage.removeItem("cendekia_learning_goals");

    // 2. Inisialisasi ulang dengan kondisi awal bersih
    localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(DEFAULT_TOPIC_PROGRESS));
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER));
    localStorage.setItem(DEPLOY_PRODUCTION_MARKER, "true");

    // Reset data papan peringkat di server jika ada
    fetch("/api/leaderboard", { method: "DELETE" }).catch(() => {});

    // Broadcast event perubahan auth & state
    window.dispatchEvent(new Event("cendekia:auth-changed"));
  } catch (err) {
    console.error("Gagal melakukan reset seluruh data aplikasi:", err);
  }
}

// Inisialisasi otomatis jika marker deploy bersih belum aktif
function purgeLegacyMockData(): void {
  if (!isClient()) return;
  try {
    // Pasang helper di console browser untuk kemudahan pengawas / developer
    if (typeof window !== "undefined") {
      (window as unknown as { resetCBTData?: () => void }).resetCBTData = resetAllApplicationData;
    }

    const hasBeenReset = localStorage.getItem(DEPLOY_PRODUCTION_MARKER);
    if (!hasBeenReset) {
      resetAllApplicationData();
      return;
    }

    // 1. Bersihkan akun demo bawaan jika masih tersisa di daftar registered users
    const rawUsers = localStorage.getItem("cbt_pplg_registered_users");
    if (rawUsers) {
      try {
        const users = JSON.parse(rawUsers);
        if (Array.isArray(users)) {
          const cleaned = users.filter(
            (u: { id?: string; email?: string }) =>
              u.id !== "user-arya-1" &&
              u.id !== "user-nadia-2" &&
              u.email !== "arya.wicaksana@smk.cbt-pplg.sch.id" &&
              u.email !== "nadia.kirana@smk.cbt-pplg.sch.id"
          );
          if (cleaned.length !== users.length) {
            localStorage.setItem("cbt_pplg_registered_users", JSON.stringify(cleaned));
          }
        }
      } catch (err) {
        console.error("Error cleaning registered users:", err);
      }
    }

    // 2. Jika sesi aktif masih milik akun demo lama, hapus sesinya
    const rawSession = localStorage.getItem("cbt_pplg_session");
    if (rawSession) {
      try {
        const session = JSON.parse(rawSession);
        if (
          session?.user?.id === "user-arya-1" ||
          session?.user?.id === "user-nadia-2" ||
          session?.user?.email === "arya.wicaksana@smk.cbt-pplg.sch.id" ||
          session?.user?.email === "nadia.kirana@smk.cbt-pplg.sch.id"
        ) {
          localStorage.removeItem("cbt_pplg_session");
          localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
          localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify([]));
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("cendekia:auth-changed"));
          }
        }
      } catch (err) {
        console.error("Error cleaning session:", err);
      }
    }

    // 3. Pastikan topic progress adalah 14 sub-elemen resmi
    const existingProgress = localStorage.getItem(STORAGE_KEYS.TOPIC_PROGRESS);
    if (!existingProgress) {
      localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(DEFAULT_TOPIC_PROGRESS));
    } else {
      try {
        const parsed = JSON.parse(existingProgress);
        if (
          !Array.isArray(parsed) ||
          parsed.length !== 14 ||
          parsed.some((p) => p.topic === "Pengembangan Gim" || p.topic === "Pengembangan Aplikasi Mobile")
        ) {
          localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(DEFAULT_TOPIC_PROGRESS));
          localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify([]));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(DEFAULT_TOPIC_PROGRESS));
      }
    }

    // 4. Pastikan attempts ada
    const rawAttempts = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (!rawAttempts) {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify([]));
    }

    localStorage.setItem(STORAGE_KEYS.RESET_MARKER, "true");
  } catch (e) {
    console.error("Error updating storage data:", e);
  }
}

export function getUserProfile(): UserProfile {
  if (!isClient()) return DEFAULT_USER;
  purgeLegacyMockData();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) {
      return DEFAULT_USER;
    }
    const profile = JSON.parse(raw);
    if (
      profile.id === "user-arya-1" ||
      profile.id === "user-nadia-2" ||
      profile.id === "user-default-1" ||
      profile.name === "Arya Wicaksana"
    ) {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      return DEFAULT_USER;
    }
    return profile;
  } catch {
    return DEFAULT_USER;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error("Error saving user profile:", err);
  }
}

export function getAttempts(): Attempt[] {
  if (!isClient()) return DEFAULT_ATTEMPTS;
  purgeLegacyMockData();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(DEFAULT_ATTEMPTS));
      return DEFAULT_ATTEMPTS;
    }
    const list: Attempt[] = JSON.parse(raw);
    // Bersihkan jika ada sisa data mock
    const cleaned = list.filter((a) => !a.id.startsWith("attempt-hist-"));
    if (cleaned.length !== list.length) {
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(cleaned));
      return cleaned;
    }
    return list;
  } catch {
    return DEFAULT_ATTEMPTS;
  }
}

export function getAttemptById(id: string): Attempt | null {
  const attempts = getAttempts();
  return attempts.find((a) => a.id === id) || null;
}

export function saveAttempt(attempt: Attempt): void {
  if (!isClient()) return;
  try {
    const attempts = getAttempts();
    const existingIndex = attempts.findIndex((a) => a.id === attempt.id);
    if (existingIndex >= 0) {
      attempts[existingIndex] = attempt;
    } else {
      attempts.unshift(attempt);
    }
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));

    // Update user profile latest IRT score if available
    if (attempt.irtResult?.score) {
      const user = getUserProfile();
      user.latestIrtScore = attempt.irtResult.score;
      saveUserProfile(user);
    }

    // Auto-queue soal yang salah ke Bank Remedial Spaced Repetition
    if (attempt.questions && attempt.answers) {
      attempt.questions.forEach((q) => {
        const ans = attempt.answers[q.id];
        const isCorrect = evaluateAnswer(q, ans);
        if (!isCorrect) {
          addQuestionToRemedial(q, ans?.selectedAnswers || []);
        }
      });
    }

    touchLastActiveTime();
  } catch (err) {
    console.error("Error saving attempt:", err);
  }
}

export function getTopicProgress(): TopicProgress[] {
  if (!isClient()) return DEFAULT_TOPIC_PROGRESS;
  purgeLegacyMockData();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOPIC_PROGRESS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(DEFAULT_TOPIC_PROGRESS));
      return DEFAULT_TOPIC_PROGRESS;
    }
    const list: TopicProgress[] = JSON.parse(raw);
    // Pastikan jika panjangnya bukan 14, kembalikan default 14 sub-elemen
    if (!Array.isArray(list) || list.length !== 14) {
      localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(DEFAULT_TOPIC_PROGRESS));
      return DEFAULT_TOPIC_PROGRESS;
    }
    return list;
  } catch {
    return DEFAULT_TOPIC_PROGRESS;
  }
}

export function updateTopicProgress(topic: PPLGTopic | string, isCorrect: boolean): void {
  if (!isClient()) return;
  try {
    const list = getTopicProgress();
    const item = list.find((t) => t.topic.toLowerCase() === topic.toLowerCase());
    if (item) {
      item.totalAnswered += 1;
      if (isCorrect) item.totalCorrect += 1;
      item.accuracy = Math.round((item.totalCorrect / item.totalAnswered) * 100);
      item.masteryLevel = computeMasteryLevel(item.accuracy, item.totalAnswered);
    } else {
      const newItem: TopicProgress = {
        topic: topic as PPLGTopic,
        totalAnswered: 1,
        totalCorrect: isCorrect ? 1 : 0,
        accuracy: isCorrect ? 100 : 0,
        masteryLevel: isCorrect ? "Dikuasai" : "Perlu Diulang",
      };
      list.push(newItem);
    }
    localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(list));
  } catch (err) {
    console.error("Error updating topic progress:", err);
  }
}

import { evaluateAnswer } from "@/lib/irt";

export function computeMasteryLevel(accuracy: number, totalAnswered: number): MasteryLevel {
  if (totalAnswered === 0) return "Belum Dicoba";
  if (accuracy >= 75) return "Dikuasai";
  return "Perlu Diulang";
}

/**
 * ============================================================================
 * SPACED REPETITION / BANK SOAL SALAH (MISTAKE RETENTION ENGINE)
 * ============================================================================
 */

function calculateNextReviewDate(stage: number): string {
  const intervals = [1, 1, 3, 7, 14]; // hari per stage
  const daysToAdd = intervals[stage] ?? 1;
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
}

export function getRemedialQueue(): RemedialQuestion[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMEDIAL_QUEUE);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addQuestionToRemedial(question: Question, selectedAnswers: string[] = []): void {
  if (!isClient()) return;
  try {
    const queue = getRemedialQueue();
    const existingIndex = queue.findIndex((item) => item.questionId === question.id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const existing = queue[existingIndex];
      existing.wrongCount += 1;
      existing.stage = 1; // Turun kembali ke stage 1 jika salah lagi
      existing.lastAnsweredAt = now;
      existing.nextReviewDate = calculateNextReviewDate(1);
      existing.lastSelectedAnswers = selectedAnswers;
      existing.question = question; // update data soal
    } else {
      queue.unshift({
        questionId: question.id,
        question,
        wrongCount: 1,
        correctCount: 0,
        stage: 1,
        addedAt: now,
        lastAnsweredAt: now,
        nextReviewDate: calculateNextReviewDate(1),
        lastSelectedAnswers: selectedAnswers,
      });
    }

    localStorage.setItem(STORAGE_KEYS.REMEDIAL_QUEUE, JSON.stringify(queue));
  } catch (err) {
    console.error("Error adding to remedial queue:", err);
  }
}

export function resolveRemedialQuestion(questionId: string, isCorrect: boolean): void {
  if (!isClient()) return;
  try {
    const queue = getRemedialQueue();
    const item = queue.find((q) => q.questionId === questionId);
    if (!item) return;

    const now = new Date().toISOString();
    item.lastAnsweredAt = now;

    if (isCorrect) {
      item.correctCount += 1;
      item.stage = Math.min(4, item.stage + 1);
      item.nextReviewDate = calculateNextReviewDate(item.stage);
    } else {
      item.wrongCount += 1;
      item.stage = 1; // reset ke stage 1
      item.nextReviewDate = calculateNextReviewDate(1);
    }

    localStorage.setItem(STORAGE_KEYS.REMEDIAL_QUEUE, JSON.stringify(queue));
  } catch (err) {
    console.error("Error resolving remedial question:", err);
  }
}

export function removeRemedialQuestion(questionId: string): void {
  if (!isClient()) return;
  try {
    const queue = getRemedialQueue();
    const filtered = queue.filter((q) => q.questionId !== questionId);
    localStorage.setItem(STORAGE_KEYS.REMEDIAL_QUEUE, JSON.stringify(filtered));
  } catch (err) {
    console.error("Error removing from remedial queue:", err);
  }
}

/**
 * ============================================================================
 * BOOKMARKS / TANDAI SOAL UNTUK DIREVIEW
 * ============================================================================
 */

export function getBookmarks(): BookmarkedQuestion[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function isQuestionBookmarked(questionId: string): boolean {
  if (!isClient()) return false;
  const list = getBookmarks();
  return list.some((b) => b.questionId === questionId);
}

export function toggleBookmark(question: Question, note?: string): boolean {
  if (!isClient()) return false;
  try {
    const list = getBookmarks();
    const index = list.findIndex((b) => b.questionId === question.id);
    let isNowBookmarked = false;

    if (index >= 0) {
      list.splice(index, 1);
      isNowBookmarked = false;
    } else {
      list.unshift({
        questionId: question.id,
        question,
        savedAt: new Date().toISOString(),
        note: note || undefined,
      });
      isNowBookmarked = true;
    }

    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
    return isNowBookmarked;
  } catch (err) {
    console.error("Error toggling bookmark:", err);
    return false;
  }
}

/**
 * ============================================================================
 * ANALISIS KECEPATAN MENJAWAB (SPEED & EFFICIENCY METRICS)
 * ============================================================================
 */

export function getSpeedRecords(): QuestionSpeedRecord[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SPEED_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordQuestionSpeed(
  questionId: string,
  topic: string,
  seconds: number,
  isCorrect: boolean
): void {
  if (!isClient()) return;
  try {
    const logs = getSpeedRecords();
    logs.push({
      questionId,
      topic,
      seconds: Math.max(1, Math.min(300, seconds)),
      isCorrect,
      timestamp: new Date().toISOString(),
    });
    // Simpan maksimal 300 log terakhir
    const trimmed = logs.slice(-300);
    localStorage.setItem(STORAGE_KEYS.SPEED_LOGS, JSON.stringify(trimmed));
  } catch (err) {
    console.error("Error recording question speed:", err);
  }
}

export function getTopicSpeedMetrics(): TopicSpeedMetric[] {
  const records = getSpeedRecords();
  if (records.length === 0) return [];

  const grouped: Record<string, { totalSec: number; count: number; correctCount: number }> = {};

  records.forEach((r) => {
    if (!grouped[r.topic]) {
      grouped[r.topic] = { totalSec: 0, count: 0, correctCount: 0 };
    }
    grouped[r.topic].totalSec += r.seconds;
    grouped[r.topic].count += 1;
    if (r.isCorrect) grouped[r.topic].correctCount += 1;
  });

  return Object.entries(grouped).map(([topic, val]) => {
    const avgSec = Math.round(val.totalSec / val.count);
    const acc = Math.round((val.correctCount / val.count) * 100);

    let speedCategory: "cepat" | "normal" | "lambat" = "normal";
    if (avgSec <= 45) speedCategory = "cepat";
    else if (avgSec >= 90) speedCategory = "lambat";

    let insight: "paham-cepat" | "paham-lambat" | "belum-paham" | "kurang-teliti" = "paham-cepat";
    if (acc >= 75 && speedCategory === "cepat") {
      insight = "paham-cepat";
    } else if (acc >= 75 && speedCategory === "lambat") {
      insight = "paham-lambat";
    } else if (acc < 60 && speedCategory === "cepat") {
      insight = "kurang-teliti";
    } else {
      insight = "belum-paham";
    }

    return {
      topic,
      totalQuestions: val.count,
      totalSeconds: val.totalSec,
      avgSeconds: avgSec,
      accuracy: acc,
      speedCategory,
      insight,
    };
  });
}

/**
 * ============================================================================
 * GENTLE ACTIVITY REMINDER TRACKING
 * ============================================================================
 */

export function touchLastActiveTime(): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_TIME, new Date().toISOString());
  } catch {}
}

export function getLastActiveTime(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_TIME);
}

export function getDaysSinceLastActive(): number {
  const last = getLastActiveTime();
  if (!last) return 0;
  const diffMs = Date.now() - new Date(last).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Reset total semua data riwayat ujian dan status 14 sub-elemen ke NOL
 */
export function resetAllDataToZero(): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(DEFAULT_TOPIC_PROGRESS));
    localStorage.setItem(STORAGE_KEYS.REMEDIAL_QUEUE, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SPEED_LOGS, JSON.stringify([]));
    const user = getUserProfile();
    user.latestIrtScore = 0;
    saveUserProfile(user);
    localStorage.setItem(STORAGE_KEYS.RESET_MARKER, "true");
  } catch (err) {
    console.error("Error resetting all data to zero:", err);
  }
}
