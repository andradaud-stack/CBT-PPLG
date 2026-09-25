export type Difficulty = "mudah" | "sedang" | "sulit";

export type QuestionType = "single" | "multiple";

export type PPLGTopic =
  | "Pemrograman Dasar"
  | "Pemrograman Web"
  | "Basis Data"
  | "Pemrograman Berorientasi Objek"
  | "Pengembangan Aplikasi Mobile"
  | "Pengembangan Gim"
  | "Jaringan Komputer Dasar"
  | "Keamanan Siber Dasar";

export const PPLG_TOPICS: PPLGTopic[] = [
  "Pemrograman Dasar",
  "Pemrograman Web",
  "Basis Data",
  "Pemrograman Berorientasi Objek",
  "Pengembangan Aplikasi Mobile",
  "Pengembangan Gim",
  "Jaringan Komputer Dasar",
  "Keamanan Siber Dasar",
];

export interface QuestionOption {
  key: "A" | "B" | "C" | "D" | "E";
  text: string;
}

export interface Question {
  id: string;
  topic: PPLGTopic | string;
  subElementId?: string;
  subElementName?: string;
  difficulty: Difficulty;
  type: QuestionType;
  stem: string;
  options: QuestionOption[];
  correctAnswer: string[]; // Array of option keys, e.g. ["A"] or ["A", "C"]
  explanation: string;
}

export interface StudentAnswer {
  questionId: string;
  selectedAnswers: string[]; // Array of keys, e.g. ["A"] or ["A", "C"]
  isFlagged: boolean; // Ragu-ragu
  isAnswered: boolean;
  isCorrect?: boolean;
}

export interface IRTAccuracyBreakdown {
  total: number;
  correct: number;
  percentage: number;
}

export interface IRTResult {
  score: number; // 200 - 800
  theta: number; // ability estimate in logit [-3.0, +3.0]
  totalQuestions: number;
  totalAnswered: number;
  totalCorrect: number;
  overallAccuracy: number; // percentage
  byDifficulty: Record<Difficulty, IRTAccuracyBreakdown>;
  byTopic: Record<string, IRTAccuracyBreakdown>;
}

export type AttemptMode = "practice" | "simulation";

export interface Attempt {
  id: string;
  userId: string;
  mode: AttemptMode;
  packageId?: number; // 1 to 10
  packageName?: string; // e.g. "Paket Tryout 1: Pondasi Kompetensi"
  topic?: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  questions: Question[];
  answers: Record<string, StudentAnswer>;
  irtResult?: IRTResult;
  proctoringMode?: boolean;
  tabSwitchCount?: number;
  isFullscreenViolated?: boolean;
  integrityStatus?: "clean" | "warned" | "disqualified";
}

export interface TryoutPackage {
  id: number; // 1 to 10
  title: string;
  focusTopics: string;
  description: string;
  badge: string;
  totalQuestions: number;
  durationMinutes: number;
  questions: Question[];
}

export interface TryoutPackageStatus {
  packageId: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  attemptCount: number;
  bestScore?: number;
  latestScore?: number;
  latestAttemptId?: string;
  lastAttemptAt?: string;
}

export type MasteryLevel = "Dikuasai" | "Perlu Diulang" | "Belum Dicoba";

export interface TopicProgress {
  topic: PPLGTopic | string;
  elementId?: number;
  elementName?: string;
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number; // percentage
  masteryLevel: MasteryLevel;
}

export interface SubElementProgress {
  id: string;
  name: string;
  elementId: number;
  elementName: string;
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  masteryLevel: MasteryLevel;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  school: string;
  classGrade: string;
  latestIrtScore: number;
}

export interface RemedialQuestion {
  questionId: string;
  question: Question;
  wrongCount: number;
  correctCount: number;
  stage: number; // Leitner stage: 1 = Harian (tiap 1 hari), 2 = Interval 3 Hari, 3 = Interval 7 Hari, 4 = Dikuasai
  addedAt: string;
  lastAnsweredAt: string;
  nextReviewDate: string; // YYYY-MM-DD
  lastSelectedAnswers: string[];
}

export interface BookmarkedQuestion {
  questionId: string;
  question: Question;
  savedAt: string;
  note?: string;
}

export interface QuestionSpeedRecord {
  questionId: string;
  topic: string;
  seconds: number;
  isCorrect: boolean;
  timestamp: string;
}

export interface TopicSpeedMetric {
  topic: string;
  totalQuestions: number;
  totalSeconds: number;
  avgSeconds: number;
  accuracy: number;
  speedCategory: "cepat" | "normal" | "lambat";
  insight: "paham-cepat" | "paham-lambat" | "belum-paham" | "kurang-teliti";
}

export interface LearningGoals {
  targetIrtScore: number; // default: 650 (200 - 800)
  dailyQuestionsGoal: number; // default: 10
  weeklySimulationsGoal: number; // default: 2
  examDate: string; // YYYY-MM-DD
  currentStreak: number; // continuous active days
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  todayDate: string; // YYYY-MM-DD
  todayQuestionsAnswered: number;
  weekSimulationsCompleted: number;
  weekStartDate: string; // YYYY-MM-DD
}

export interface MotivationQuote {
  quote: string;
  author: string;
  context: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "streak" | "score" | "practice" | "mastery";
  isUnlocked: boolean;
  unlockedAt?: string;
  progressText: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  school: string;
  classGrade: string;
  score: number; // IRT score 200 - 800
  theta: number; // logit ability
  totalQuestions: number;
  totalCorrect: number;
  accuracy: number; // percentage
  durationSeconds: number;
  packageId: number;
  packageName: string;
  streak?: number;
  submittedAt: string; // ISO date string
}

