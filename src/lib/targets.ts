import { GoalMilestone, LearningGoals, MotivationQuote } from "@/types";
import { getAttempts, getTopicProgress, getUserProfile } from "./storage";

const STORAGE_KEY = "cendekia_learning_goals";

// Format helper YYYY-MM-DD
function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Get Monday of current week
function getMondayOfWeek(d: Date = new Date()): string {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return getLocalDateString(date);
}

// Default 30 days ahead from today
function getDefaultExamDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return getLocalDateString(d);
}

export const MOTIVATION_QUOTES: MotivationQuote[] = [
  {
    quote: "Kualitas bukan suatu kebetulan, melainkan hasil dari usaha cerdas dan latihan konsisten.",
    author: "John Ruskin",
    context: "Budaya Mutu Rekayasa Perangkat Lunak",
  },
  {
    quote: "Programmer hebat bukan mereka yang tidak pernah membuat bug, melainkan mereka yang tekun membedah logika sampai tuntas.",
    author: "Grace Hopper",
    context: "Pionir Ilmu Komputer & Compiler",
  },
  {
    quote: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    context: "Pencipta Linux & Git",
  },
  {
    quote: "Fokuslah pada kemajuan kecil setiap hari. 10 soal yang kamu pahami hari ini adalah pondasi 800 IRT esok hari.",
    author: "Tim Instruktur PPLG",
    context: "Target & Konsistensi TKA",
  },
  {
    quote: "Sederhanakan logika rumit menjadi modular. Langkah demi langkah, algoritma tersulit pun akan terurai.",
    author: "Edsger W. Dijkstra",
    context: "Bapak Algoritma & Modularitas",
  },
  {
    quote: "Teknologi adalah alat, namun ketekunan dan logika berpikir kritismulah yang menciptakan karya luar biasa.",
    author: "Steve Jobs",
    context: "Technopreneur & Desain Produk",
  },
  {
    quote: "Jangan takut salah saat latihan. Soal yang salah adalah petunjuk terbaik tentang apa yang harus kamu kuasai selanjutnya.",
    author: "Cendekia CBT Tutor",
    context: "Metode Spaced Repetition",
  },
];

const DEFAULT_GOALS: LearningGoals = {
  targetIrtScore: 650,
  dailyQuestionsGoal: 10,
  weeklySimulationsGoal: 2,
  examDate: getDefaultExamDate(),
  currentStreak: 1,
  longestStreak: 1,
  lastActiveDate: getLocalDateString(),
  todayDate: getLocalDateString(),
  todayQuestionsAnswered: 0,
  weekSimulationsCompleted: 0,
  weekStartDate: getMondayOfWeek(),
};

function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Mengambil data target belajar saat ini (sekaligus melakukan rekonsiliasi tanggal/streak otomatis)
 */
export function getLearningGoals(): LearningGoals {
  if (!isClient()) return DEFAULT_GOALS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const today = getLocalDateString();
    const currentWeekStart = getMondayOfWeek();

    let goals: LearningGoals = raw ? JSON.parse(raw) : { ...DEFAULT_GOALS };

    // Validasi dan lengkapi atribut yang mungkin undefined dari versi lama
    goals = {
      ...DEFAULT_GOALS,
      ...goals,
    };

    let needsSave = false;

    // 1. Cek reset harian untuk target soal
    if (goals.todayDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = getLocalDateString(yesterday);

      // Hitung streak
      if (goals.lastActiveDate === yesterdayStr) {
        // Kemarin aktif -> streak terjaga
        // Streak akan bertambah saat siswa menjawab soal hari ini
      } else if (goals.lastActiveDate !== today) {
        // Terlewat lebih dari 1 hari -> streak kembali ke 0 / 1
        goals.currentStreak = 1;
        needsSave = true;
      }

      goals.todayDate = today;
      goals.todayQuestionsAnswered = 0;
      needsSave = true;
    }

    // 2. Cek reset mingguan untuk target simulasi
    if (goals.weekStartDate !== currentWeekStart) {
      goals.weekStartDate = currentWeekStart;
      goals.weekSimulationsCompleted = 0;
      needsSave = true;
    }

    if (needsSave || !raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    }

    return goals;
  } catch (err) {
    console.error("Gagal membaca target belajar:", err);
    return DEFAULT_GOALS;
  }
}

/**
 * Memperbarui pengaturan target belajar
 */
export function updateLearningGoals(partial: Partial<LearningGoals>): LearningGoals {
  if (!isClient()) return { ...DEFAULT_GOALS, ...partial };

  try {
    const current = getLearningGoals();
    const updated: LearningGoals = {
      ...current,
      ...partial,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Kirim custom event untuk trigger update reaktif di semua komponen
    window.dispatchEvent(new CustomEvent("cendekia:goals-updated", { detail: updated }));

    return updated;
  } catch (err) {
    console.error("Gagal memperbarui target belajar:", err);
    return DEFAULT_GOALS;
  }
}

/**
 * Mencatat penambahan soal yang dijawab hari ini (misal di latihan bebas atau simulasi)
 */
export function recordQuestionAnsweredToday(count: number = 1): LearningGoals {
  if (!isClient()) return DEFAULT_GOALS;

  try {
    const current = getLearningGoals();
    const today = getLocalDateString();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);

    let nextStreak = current.currentStreak;

    // Jika belum tercatat aktif hari ini
    if (current.lastActiveDate !== today) {
      if (current.lastActiveDate === yesterdayStr) {
        nextStreak = current.currentStreak + 1;
      } else {
        nextStreak = 1;
      }
    }

    const nextLongest = Math.max(current.longestStreak, nextStreak);

    const updated: LearningGoals = {
      ...current,
      todayDate: today,
      lastActiveDate: today,
      currentStreak: nextStreak,
      longestStreak: nextLongest,
      todayQuestionsAnswered: current.todayQuestionsAnswered + count,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("cendekia:goals-updated", { detail: updated }));

    return updated;
  } catch (err) {
    console.error("Gagal mencatat soal hari ini:", err);
    return DEFAULT_GOALS;
  }
}

/**
 * Mencatat simulasi yang selesai dikerjakan minggu ini
 */
export function recordSimulationCompletedThisWeek(): LearningGoals {
  if (!isClient()) return DEFAULT_GOALS;

  try {
    const current = getLearningGoals();
    const updated: LearningGoals = {
      ...current,
      weekSimulationsCompleted: current.weekSimulationsCompleted + 1,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("cendekia:goals-updated", { detail: updated }));

    return updated;
  } catch (err) {
    console.error("Gagal mencatat simulasi minggu ini:", err);
    return DEFAULT_GOALS;
  }
}

/**
 * Menghitung sisa hari menuju ujian TKA
 */
export function getExamCountdown(examDateStr: string): {
  daysLeft: number;
  label: string;
  urgencyColor: "success" | "warning" | "error" | "primary";
} {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(examDateStr);
    targetDate.setHours(0, 0, 0, 0);

    const diffMs = targetDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return {
        daysLeft: 0,
        label: "Ujian Sedang Berlangsung / Selesai",
        urgencyColor: "warning",
      };
    }

    if (daysLeft === 0) {
      return {
        daysLeft: 0,
        label: "Hari Ini adalah Hari Ujian!",
        urgencyColor: "error",
      };
    }

    if (daysLeft <= 3) {
      return {
        daysLeft,
        label: "Fase Akhir & Rileks",
        urgencyColor: "error",
      };
    }

    if (daysLeft <= 7) {
      return {
        daysLeft,
        label: "Fase Tryout Intensif",
        urgencyColor: "warning",
      };
    }

    if (daysLeft <= 14) {
      return {
        daysLeft,
        label: "Fase Pemantapan Soal Sulit",
        urgencyColor: "primary",
      };
    }

    return {
      daysLeft,
      label: "Fase Pondasi Teori & Latihan",
      urgencyColor: "success",
    };
  } catch {
    return {
      daysLeft: 30,
      label: "Persiapan TKA",
      urgencyColor: "primary",
    };
  }
}

/**
 * Menghitung daftar piala & lencana milestone pencapaian target
 */
export function calculateMilestones(goals: LearningGoals): GoalMilestone[] {
  const profile = getUserProfile();
  const currentIrt = profile.latestIrtScore || 0;
  const attempts = getAttempts();
  const topics = getTopicProgress();

  const totalAnsweredAll = topics.reduce((acc, t) => acc + t.totalAnswered, 0);
  const masteredCount = topics.filter((t) => t.masteryLevel === "Dikuasai").length;
  const simulationsCount = attempts.filter((a) => a.mode === "simulation").length;

  return [
    {
      id: "target-score-crusher",
      title: "Penembus Target IRT",
      description: `Mencapai target skor ${goals.targetIrtScore} IRT pada simulasi resmi.`,
      icon: "Target",
      category: "score",
      isUnlocked: currentIrt >= goals.targetIrtScore && currentIrt > 0,
      progressText: `${currentIrt} / ${goals.targetIrtScore} IRT`,
    },
    {
      id: "streak-warrior-3",
      title: "Api Disiplin (Streak 3 Hari)",
      description: "Belajar dan menyelesaikan latihan selama 3 hari berturut-turut.",
      icon: "Flame",
      category: "streak",
      isUnlocked: goals.currentStreak >= 3 || goals.longestStreak >= 3,
      progressText: `${Math.min(3, goals.currentStreak)} / 3 Hari`,
    },
    {
      id: "streak-champion-7",
      title: "Legenda Konsisten (Streak 7 Hari)",
      description: "Mempertahankan rutinitas belajar selama 7 hari tanpa jeda.",
      icon: "Zap",
      category: "streak",
      isUnlocked: goals.currentStreak >= 7 || goals.longestStreak >= 7,
      progressText: `${Math.min(7, goals.currentStreak)} / 7 Hari`,
    },
    {
      id: "daily-goal-crushed",
      title: "Tuntas Harian",
      description: `Menyelesaikan target harian ${goals.dailyQuestionsGoal} butir soal hari ini.`,
      icon: "CheckCircle2",
      category: "practice",
      isUnlocked: goals.todayQuestionsAnswered >= goals.dailyQuestionsGoal,
      progressText: `${Math.min(goals.dailyQuestionsGoal, goals.todayQuestionsAnswered)} / ${goals.dailyQuestionsGoal} Soal`,
    },
    {
      id: "practice-50-questions",
      title: "Pejuang 50 Butir Soal",
      description: "Menjawab total 50 butir soal di latihan bebas dan simulasi.",
      icon: "BookOpen",
      category: "practice",
      isUnlocked: totalAnsweredAll >= 50,
      progressText: `${Math.min(50, totalAnsweredAll)} / 50 Soal`,
    },
    {
      id: "simulation-master-3",
      title: "Penguji Tangguh (3 Simulasi)",
      description: "Menuntaskan minimal 3 paket tryout berstandar resmi TKA.",
      icon: "Award",
      category: "score",
      isUnlocked: simulationsCount >= 3,
      progressText: `${Math.min(3, simulationsCount)} / 3 Paket`,
    },
    {
      id: "mastery-curriculum-5",
      title: "Master 5 Sub-Elemen",
      description: "Mencapai status 'Dikuasai' pada minimal 5 sub-elemen Kemendikdasmen.",
      icon: "ShieldCheck",
      category: "mastery",
      isUnlocked: masteredCount >= 5,
      progressText: `${Math.min(5, masteredCount)} / 5 Sub-elemen`,
    },
  ];
}

/**
 * Mengambil kutipan motivasi harian berdasarkan tanggal
 */
export function getDailyMotivationQuote(): MotivationQuote {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  const index = Math.abs(dayOfYear) % MOTIVATION_QUOTES.length;
  return MOTIVATION_QUOTES[index];
}
