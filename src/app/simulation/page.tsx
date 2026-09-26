"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { QuestionCard } from "@/components/QuestionCard";
import { NavigatorGrid } from "@/components/NavigatorGrid";
import { ExamTimer } from "@/components/ExamTimer";
import { calculateIRTResult } from "@/lib/irt";
import { getAttempts, saveAttempt, getUserProfile } from "@/lib/storage";
import { getAuthSession } from "@/lib/auth";
import { recordQuestionAnsweredToday, recordSimulationCompletedThisWeek, getLearningGoals } from "@/lib/targets";
import { createExamSignature } from "@/lib/crypto";
import {
  TRYOUT_PACKAGES,
  getTryoutPackagesStatus,
  getPackageById,
} from "@/lib/tryoutPackages";
import { Attempt, Question, StudentAnswer, TryoutPackage, TryoutPackageStatus } from "@/types";
import {
  CheckCircle2,
  AlertTriangle,
  Flag,
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  Menu,
  X,
  RefreshCw,
  Lock,
  Unlock,
  Award,
  Check,
  ShieldCheck,
  ShieldAlert,
  Maximize,
  AlertOctagon,
} from "lucide-react";

export default function SimulationPage() {
  const router = useRouter();

  // State alur: "intro" | "loading" | "error" | "exam" | "submitting"
  const [examState, setExamState] = useState<"intro" | "loading" | "error" | "exam" | "submitting">("intro");
  const [selectedPackageId, setSelectedPackageId] = useState<number>(1);
  const [selectedPackage, setSelectedPackage] = useState<TryoutPackage>(TRYOUT_PACKAGES[0]);
  const [packageStatuses, setPackageStatuses] = useState<TryoutPackageStatus[]>([]);

  // State selama ujian
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});
  const [startedAt, setStartedAt] = useState<string>("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showMobileNavigator, setShowMobileNavigator] = useState(false);

  // State Pengawasan Ujian (Mode Anti-Curang & Proctoring Otomatis Terkunci)
  const isProctoringEnabled = true;
  const [tabSwitchViolations, setTabSwitchViolations] = useState(0);
  const [showTabWarningModal, setShowTabWarningModal] = useState(false);
  const [showDisqualifiedModal, setShowDisqualifiedModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [copyWarningToast, setCopyWarningToast] = useState(false);

  // Filter paket di halaman intro
  const [filterTab, setFilterTab] = useState<"all" | "unlocked" | "locked">("all");

  // Load attempt history dan status 10 paket saat mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loaded = getAttempts();
      setPackageStatuses(getTryoutPackagesStatus(loaded));
    }
  }, []);

  // Sembunyikan & blokir total AI Tutor selama pengerjaan simulasi agar siswa tidak bisa menyontek
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isExam = examState === "exam" || examState === "loading";
      window.dispatchEvent(
        new CustomEvent("cendekia:exam-mode", { detail: { isExam } })
      );
      if (isExam) {
        document.body.setAttribute("data-exam-active", "true");
      } else {
        document.body.removeAttribute("data-exam-active");
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        document.body.removeAttribute("data-exam-active");
        window.dispatchEvent(
          new CustomEvent("cendekia:exam-mode", { detail: { isExam: false } })
        );
      }
    };
  }, [examState]);

  // Ref untuk menghindari dependensi fungsi di useEffect pengawasan
  const finishExamRef = React.useRef<
    (isAutoSubmit?: boolean, forcedIntegrity?: "clean" | "warned" | "disqualified", violationsCount?: number) => void
  >(() => {});

  // Helper Fullscreen Kunci Layar
  const requestFullscreenLock = () => {
    if (typeof document !== "undefined") {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      }
    }
  };

  const exitFullscreenSafe = () => {
    if (typeof document !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Monitor pengawasan anti-curang selama ujian berlangsung
  useEffect(() => {
    if (examState !== "exam" || !isProctoringEnabled) return;

    requestFullscreenLock();

    // 1. Deteksi perubahan Fullscreen
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull) {
        setShowFullscreenWarning(true);
      } else {
        setShowFullscreenWarning(false);
      }
    };

    // 2. Deteksi Perpindahan Tab, Alt+Tab, Window Blur, dan Trackpad Swipe Gesture
    let lastViolationTrigger = 0;
    let isCurrentlyAway = false;

    const recordViolation = () => {
      const now = Date.now();
      if (now - lastViolationTrigger < 1500) return; // Debounce 1.5 detik agar 1 aksi tidak terhitung dobel
      lastViolationTrigger = now;
      isCurrentlyAway = true;

      setTabSwitchViolations((prev) => {
        const nextCount = prev + 1;
        if (nextCount >= 3) {
          setShowDisqualifiedModal(true);
          setTimeout(() => {
            finishExamRef.current(true, "disqualified", nextCount);
          }, 3000);
        }
        return nextCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        recordViolation();
      } else if (document.visibilityState === "visible") {
        if (isCurrentlyAway) {
          isCurrentlyAway = false;
          setTabSwitchViolations((current) => {
            if (current < 3) {
              setShowTabWarningModal(true);
            }
            return current;
          });
        }
      }
    };

    const handleWindowBlur = () => {
      // Menangkap Alt+Tab, gesture 3 jari trackpad, tombol Windows, dan klik jendela lain
      recordViolation();
    };

    const handleWindowFocus = () => {
      if (isCurrentlyAway) {
        isCurrentlyAway = false;
        setTabSwitchViolations((current) => {
          if (current < 3) {
            setShowTabWarningModal(true);
          }
          return current;
        });
      }
    };

    // 3. Blokir shortcut copy-paste / inspect
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        (e.ctrlKey && ["c", "v", "u", "a"].includes(key)) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key))
      ) {
        e.preventDefault();
        setCopyWarningToast(true);
        setTimeout(() => setCopyWarningToast(false), 2500);
      }
    };

    // 4. Blokir klik kanan di lembar ujian
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setCopyWarningToast(true);
      setTimeout(() => setCopyWarningToast(false), 2500);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [examState, isProctoringEnabled]);

  // Mulai Ujian Paket Tertentu
  const handleStartPackageExam = async (pkgId: number) => {
    // Otomatis kunci layar penuh seketika saat tombol Mulai Ujian diklik pengguna
    requestFullscreenLock();

    const pkg = getPackageById(pkgId) || TRYOUT_PACKAGES[0];
    setSelectedPackageId(pkgId);
    setSelectedPackage(pkg);
    setExamState("loading");

    // Reset status pelanggaran untuk sesi baru
    setTabSwitchViolations(0);
    setShowTabWarningModal(false);
    setShowDisqualifiedModal(false);
    setShowFullscreenWarning(false);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "simulation", packageId: pkgId }),
      });

      let examQuestions = pkg.questions;
      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          examQuestions = data.questions;
        }
      }

      setQuestions(examQuestions);

      // Inisialisasi state jawaban siswa
      const initialAnswers: Record<string, StudentAnswer> = {};
      examQuestions.forEach((q: Question) => {
        initialAnswers[q.id] = {
          questionId: q.id,
          selectedAnswers: [],
          isFlagged: false,
          isAnswered: false,
        };
      });

      setAnswers(initialAnswers);
      setCurrentIndex(0);
      setStartedAt(new Date().toISOString());
      setExamState("exam");
    } catch (err) {
      console.error("Gagal memulai simulasi paket:", err);
      // Fallback langsung ke pertanyaan paket lokal
      setQuestions(pkg.questions);
      const initialAnswers: Record<string, StudentAnswer> = {};
      pkg.questions.forEach((q: Question) => {
        initialAnswers[q.id] = {
          questionId: q.id,
          selectedAnswers: [],
          isFlagged: false,
          isAnswered: false,
        };
      });
      setAnswers(initialAnswers);
      setCurrentIndex(0);
      setStartedAt(new Date().toISOString());
      setExamState("exam");
    }
  };

  // Toggle pilihan jawaban (Single vs Multiple)
  const handleSelectOption = (key: string) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setAnswers((prev) => {
      const existing = prev[currentQ.id] || {
        questionId: currentQ.id,
        selectedAnswers: [],
        isFlagged: false,
        isAnswered: false,
      };

      let newSelected: string[] = [];
      if (currentQ.type === "multiple") {
        if (existing.selectedAnswers.includes(key)) {
          newSelected = existing.selectedAnswers.filter((k) => k !== key);
        } else {
          newSelected = [...existing.selectedAnswers, key];
        }
      } else {
        newSelected = [key];
      }

      return {
        ...prev,
        [currentQ.id]: {
          ...existing,
          selectedAnswers: newSelected,
          isAnswered: newSelected.length > 0,
        },
      };
    });
  };

  // Toggle bendera Ragu-ragu
  const handleToggleFlag = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setAnswers((prev) => {
      const existing = prev[currentQ.id] || {
        questionId: currentQ.id,
        selectedAnswers: [],
        isFlagged: false,
        isAnswered: false,
      };
      return {
        ...prev,
        [currentQ.id]: {
          ...existing,
          isFlagged: !existing.isFlagged,
        },
      };
    });
  };

  // Shortcut keyboard R untuk toggle Ragu-ragu saat ujian aktif
  useEffect(() => {
    if (examState !== "exam") return;
    const handleExamKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        showSubmitModal ||
        showTabWarningModal ||
        showDisqualifiedModal
      ) {
        return;
      }
      if ((e.key === "r" || e.key === "R") && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        handleToggleFlag();
      }
    };

    window.addEventListener("keydown", handleExamKeyDown);
    return () => window.removeEventListener("keydown", handleExamKeyDown);
  }, [examState, currentIndex, questions, showSubmitModal, showTabWarningModal, showDisqualifiedModal]);

  // Finalisasi Ujian dan Hitung Skor IRT
  const handleFinishExam = (
    isAutoSubmit = false,
    forcedIntegrity?: "clean" | "warned" | "disqualified",
    violationsCount?: number
  ) => {
    if (!isAutoSubmit && !showSubmitModal) {
      setShowSubmitModal(true);
      return;
    }

    exitFullscreenSafe();
    setExamState("submitting");

    const violations = violationsCount ?? tabSwitchViolations;
    let integrityStatus: "clean" | "warned" | "disqualified" = "clean";
    if (forcedIntegrity) {
      integrityStatus = forcedIntegrity;
    } else if (violations > 0) {
      integrityStatus = "warned";
    }

    // Hitung Skor IRT Model Rasch
    const irtResult = calculateIRTResult(questions, answers);

    const now = new Date();
    const durationSeconds = Math.round((now.getTime() - new Date(startedAt).getTime()) / 1000);

    const newAttempt: Attempt = {
      id: `attempt-${Date.now()}`,
      userId: "user-default-1",
      mode: "simulation",
      packageId: selectedPackageId,
      packageName: selectedPackage.title,
      startedAt,
      finishedAt: now.toISOString(),
      durationSeconds: Math.max(10, durationSeconds),
      questions,
      answers,
      irtResult,
      proctoringMode: isProctoringEnabled,
      tabSwitchCount: violations,
      isFullscreenViolated: showFullscreenWarning,
      integrityStatus,
    };

    saveAttempt(newAttempt);

    // Sync to Shared Global Leaderboard API
    try {
      const user = getAuthSession().user || getUserProfile();
      const goals = getLearningGoals();
      const submissionUserId = user.id || "siswa-" + Date.now();
      const signature = createExamSignature({
        userId: submissionUserId,
        packageId: selectedPackageId,
        totalQuestions: irtResult.totalQuestions,
        totalCorrect: irtResult.totalCorrect,
        score: irtResult.score,
      });

      fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: submissionUserId,
          name: user.name || "Siswa PPLG",
          school: user.school || "SMK",
          classGrade: user.classGrade || "XII PPLG",
          score: irtResult.score,
          theta: irtResult.theta,
          totalQuestions: irtResult.totalQuestions,
          totalCorrect: irtResult.totalCorrect,
          accuracy: irtResult.overallAccuracy,
          durationSeconds: Math.max(10, durationSeconds),
          packageId: selectedPackageId,
          packageName: selectedPackage.title,
          streak: goals.currentStreak || 1,
          signature,
        }),
      }).catch((err) => console.warn("Leaderboard sync error:", err));
    } catch (e) {
      console.warn("Failed to dispatch to leaderboard:", e);
    }

    const completedAnswered = Object.values(answers).filter((a) => a.isAnswered).length;
    recordQuestionAnsweredToday(completedAnswered);
    recordSimulationCompletedThisWeek();

    // Update list status paket lokal
    const updatedAttempts = getAttempts();
    setPackageStatuses(getTryoutPackagesStatus(updatedAttempts));

    // Redirect ke halaman hasil ujian
    router.push(`/simulation/result/${newAttempt.id}`);
  };
  finishExamRef.current = handleFinishExam;

  const answeredCount = Object.values(answers).filter((a) => a.isAnswered).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = Object.values(answers).filter((a) => a.isFlagged).length;
  const currentQ = questions[currentIndex];
  const currentAnswer = currentQ ? answers[currentQ.id] : null;

  // Hitung metrik progres
  const completedPackagesCount = packageStatuses.filter((s) => s.isCompleted).length;
  const completionPercentage = Math.round((completedPackagesCount / 10) * 100);
  const highestIrtScore = Math.max(
    0,
    ...packageStatuses.map((s) => s.bestScore || 0)
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* State 1: Daftar 10 Paket Bertingkat (Intro) */}
      {examState === "intro" && (
        <Sidebar>
          <main className="max-w-6xl mx-auto px-margin py-space-xl w-full space-y-space-lg animate-fadeIn">
            {/* Header & Progres Bar */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-space-lg sm:p-space-xl shadow-elevation-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-label-sm font-semibold font-mono mb-space-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Standar Resmi Kemendikdasmen &bull; 10 Paket Bertingkat
                  </div>
                  <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-surface tracking-tight">
                    Simulasi Tryout TKA PPLG
                  </h1>
                  <p className="text-body-md text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
                    Kerjakan 10 paket simulasi secara bertingkat. Selesaikan Paket 1 terlebih dahulu untuk membuka Paket 2, dan seterusnya. Butir soal terkalibrasi dengan model IRT skala 200–800.
                  </p>
                </div>

                {/* Ringkasan Skor Tertinggi */}
                <div className="flex items-center gap-space-md shrink-0 bg-surface-container-low p-space-md rounded-xl border border-outline-variant">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-container text-primary flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
                      Skor IRT Tertinggi
                    </span>
                    <p className="text-headline-md font-mono font-bold text-primary">
                      {highestIrtScore > 0 ? highestIrtScore : "—"}
                    </p>
                    <span className="text-[11px] text-on-surface-variant">
                      {completedPackagesCount} dari 10 Paket Selesai
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar Penyelesaian Paket */}
              <div className="mt-space-md pt-space-md border-t border-outline-variant space-y-2">
                <div className="flex items-center justify-between text-body-sm font-semibold">
                  <span className="text-on-surface flex items-center gap-2">
                    <span>Progres Kurikulum Tryout</span>
                    <span className="text-body-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {completionPercentage}% Selesai
                    </span>
                  </span>
                  <span className="font-mono text-on-surface-variant">
                    {completedPackagesCount} / 10 Paket
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(5, completionPercentage)}%` }}
                  />
                </div>
              </div>

              {/* Ketentuan Umum Ujian */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mt-space-md pt-space-md border-t border-outline-variant text-center">
                <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant">
                  <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
                    Setiap Paket
                  </span>
                  <p className="font-mono text-title-md font-bold text-on-surface">30 Butir Soal</p>
                  <span className="text-body-xs text-on-surface-variant">PG Tunggal &amp; Kompleks</span>
                </div>
                <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant">
                  <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
                    Waktu Pengerjaan
                  </span>
                  <p className="font-mono text-title-md font-bold text-on-surface">50 Menit</p>
                  <span className="text-body-xs text-on-surface-variant">Auto-submit pada 00:00</span>
                </div>
                <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant">
                  <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
                    Sistem Penilaian
                  </span>
                  <p className="font-mono text-title-md font-bold text-on-surface">IRT Rasch 1-PL</p>
                  <span className="text-body-xs text-on-surface-variant">Skor Terstandar 200–800</span>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-space-sm">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container border border-outline-variant">
                <button
                  type="button"
                  onClick={() => setFilterTab("all")}
                  className={`px-3 py-1.5 rounded-lg text-body-sm font-semibold transition-all ${
                    filterTab === "all"
                      ? "bg-surface-container-lowest text-primary shadow-elevation-1"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Semua Paket (10)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab("unlocked")}
                  className={`px-3 py-1.5 rounded-lg text-body-sm font-semibold transition-all ${
                    filterTab === "unlocked"
                      ? "bg-surface-container-lowest text-primary shadow-elevation-1"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Terbuka &amp; Selesai ({packageStatuses.filter((s) => s.isUnlocked).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab("locked")}
                  className={`px-3 py-1.5 rounded-lg text-body-sm font-semibold transition-all ${
                    filterTab === "locked"
                      ? "bg-surface-container-lowest text-primary shadow-elevation-1"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  Terkunci ({packageStatuses.filter((s) => !s.isUnlocked).length})
                </button>
              </div>

              <span className="text-body-xs text-on-surface-variant font-mono">
                💡 Tip: Selesaikan setiap paket untuk membuka paket selanjutnya
              </span>
            </div>

            {/* Grid 10 Paket Bertingkat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {TRYOUT_PACKAGES.filter((pkg) => {
                const status = packageStatuses.find((s) => s.packageId === pkg.id);
                if (filterTab === "unlocked") return status?.isUnlocked;
                if (filterTab === "locked") return !status?.isUnlocked;
                return true;
              }).map((pkg) => {
                const status = packageStatuses.find((s) => s.packageId === pkg.id) || {
                  packageId: pkg.id,
                  isUnlocked: pkg.id === 1,
                  isCompleted: false,
                  attemptCount: 0,
                };

                const isUnlocked = status.isUnlocked;
                const isCompleted = status.isCompleted;

                return (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl border p-space-lg flex flex-col justify-between transition-all duration-300 ${
                      isCompleted
                        ? "bg-surface-container-lowest border-success/40 shadow-elevation-1 hover:border-success"
                        : isUnlocked
                        ? "bg-surface-container-lowest border-primary/40 shadow-elevation-2 ring-1 ring-primary/20 hover:border-primary"
                        : "bg-surface-container-low/60 border-outline-variant/60 opacity-80"
                    }`}
                  >
                    <div>
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between gap-space-xs mb-space-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-label-sm font-bold px-2.5 py-0.5 rounded-full ${
                              isCompleted
                                ? "bg-success-container text-on-success-container border border-success/30"
                                : isUnlocked
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container text-on-surface-variant"
                            }`}
                          >
                            Paket {String(pkg.id).padStart(2, "0")}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                            {pkg.badge}
                          </span>
                        </div>

                        {/* Status Icon Indicator */}
                        {isCompleted ? (
                          <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-success bg-success-container px-2 py-0.5 rounded-full">
                            <Check className="w-3.5 h-3.5" />
                            Selesai &bull; Skor: {status.bestScore}
                          </span>
                        ) : isUnlocked ? (
                          <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            <Unlock className="w-3.5 h-3.5" />
                            Siap Dikerjakan
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                            <Lock className="w-3.5 h-3.5" />
                            Terkunci
                          </span>
                        )}
                      </div>

                      {/* Judul & Fokus Topik */}
                      <h3 className="font-bold text-title-lg text-on-surface leading-snug">
                        {pkg.title}
                      </h3>
                      <p className="text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                        {pkg.description}
                      </p>

                      <div className="mt-space-sm p-space-xs px-space-sm rounded-lg bg-surface-container-low border border-outline-variant/60 text-[11px] text-on-surface-variant">
                        <strong className="text-on-surface font-semibold">Cakupan Materi:</strong>{" "}
                        {pkg.focusTopics}
                      </div>
                    </div>

                    {/* Footer & Action Buttons */}
                    <div className="mt-space-md pt-space-sm border-t border-outline-variant/60 flex items-center justify-between gap-space-sm">
                      <div className="flex items-center gap-3 text-body-xs font-mono text-on-surface-variant">
                        <span>30 Soal</span>
                        <span>&bull;</span>
                        <span>50 Menit</span>
                        {status.attemptCount > 0 && (
                          <>
                            <span>&bull;</span>
                            <span className="text-primary font-semibold">
                              {status.attemptCount}x Uji
                            </span>
                          </>
                        )}
                      </div>

                      {/* Tombol Aksi */}
                      {isCompleted ? (
                        <div className="flex items-center gap-2">
                          {status.latestAttemptId && (
                            <Link
                              href={`/simulation/result/${status.latestAttemptId}`}
                              className="px-space-md py-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container text-body-xs font-semibold transition-all"
                            >
                              Lihat Hasil
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => handleStartPackageExam(pkg.id)}
                            className="px-space-md py-2 rounded-xl bg-secondary text-on-secondary hover:bg-secondary-container text-body-xs font-bold transition-all flex items-center gap-1.5 shadow-elevation-1"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Ulangi</span>
                          </button>
                        </div>
                      ) : isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => handleStartPackageExam(pkg.id)}
                          className="px-space-lg py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-body-sm font-bold transition-all flex items-center gap-2 shadow-elevation-2 hover:scale-105 active:scale-95"
                        >
                          <span>Mulai Ujian</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-space-md py-2 rounded-xl bg-surface-container text-on-surface-variant/50 border border-outline-variant/60 text-body-xs font-semibold cursor-not-allowed flex items-center gap-1.5"
                          title={`Selesaikan Paket ${pkg.id - 1} terlebih dahulu`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Selesaikan Paket {pkg.id - 1} Dahulu</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </Sidebar>
      )}

      {/* State 2: Loading State Penyiapan Soal */}
      {examState === "loading" && (
        <div className="min-h-screen flex flex-col items-center justify-center p-margin text-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-space-md" />
          <h2 className="text-headline-sm font-bold text-on-surface">
            Menyiapkan Soal {selectedPackage.title}...
          </h2>
          <p className="text-body-md text-on-surface-variant mt-2 max-w-md">
            Mengkalkulasi 30 butir soal terstandar Kemendikdasmen (9 Mudah, 12 Sedang, 9 Sulit) dengan kalibrasi IRT Rasch.
          </p>
        </div>
      )}

      {/* State: Error Penyiapan Soal */}
      {examState === "error" && (
        <div className="min-h-screen flex flex-col items-center justify-center p-margin text-center">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl border border-error/30 p-space-xl shadow-elevation-2 space-y-space-md">
            <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-headline-sm font-bold text-on-surface">
              Gagal Memulai Paket Ujian
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              Terjadi kendala saat memuat paket butir soal. Silakan coba kembali atau periksa koneksi backend.
            </p>
            <div className="flex items-center justify-center gap-space-sm pt-space-xs">
              <button
                type="button"
                onClick={() => handleStartPackageExam(selectedPackageId)}
                className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-bold text-body-md hover:bg-primary-container shadow-elevation-1 transition-all inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Coba Lagi
              </button>
              <button
                type="button"
                onClick={() => setExamState("intro")}
                className="px-space-md py-space-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface text-body-md font-medium hover:bg-surface-container transition-colors"
              >
                Kembali ke Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State 3: Workspace Ujian Dual-Pane Asimetris */}
      {examState === "exam" && currentQ && (
        <div className="min-h-screen flex flex-col">
          {/* Sticky Top Bar Ujian */}
          <header className="sticky top-0 z-30 bg-surface-container-lowest border-b border-outline-variant shadow-elevation-1 px-margin py-2.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="font-bold text-title-md text-on-surface hidden sm:inline">
                  {selectedPackage.title}
                </span>
                <span className="font-mono text-label-sm px-2.5 py-1 rounded bg-surface-container text-on-surface font-semibold">
                  Soal {currentIndex + 1} / {questions.length}
                </span>
              </div>

              <div className="flex items-center gap-space-sm">
                {/* Indikator Status Proctoring & Kunci Layar Penuh */}
                {isProctoringEnabled && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[11px] font-mono font-semibold transition-all ${
                        tabSwitchViolations === 0
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                          : tabSwitchViolations === 1
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                          : "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/40 animate-pulse"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          tabSwitchViolations === 0 ? "bg-emerald-500" : "bg-red-500 animate-ping"
                        }`}
                      />
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>
                        {tabSwitchViolations === 0
                          ? "Terpantau (0 Pindah Tab)"
                          : `Peringatan: ${tabSwitchViolations}/3 Tab`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={requestFullscreenLock}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isFullscreen
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                          : "border-amber-500/50 bg-amber-500/20 text-amber-600 animate-pulse hover:bg-amber-500/30"
                      }`}
                      title={isFullscreen ? "Layar Penuh Terkunci (Mode Pengawasan Aktif)" : "Kunci Layar Penuh (Wajib)"}
                      aria-label="Fullscreen Lock"
                    >
                      {isFullscreen ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <Maximize className="w-4 h-4 text-amber-600" />}
                    </button>
                  </div>
                )}

                {/* 50 Menit Countdown Timer */}
                <ExamTimer initialSeconds={3000} onExpire={() => handleFinishExam(true)} />

                {/* Mobile Navigator Drawer Toggle */}
                <button
                  type="button"
                  onClick={() => setShowMobileNavigator(!showMobileNavigator)}
                  className="lg:hidden p-2 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface"
                  aria-label="Buka navigasi soal"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Banner Peringatan Layar Penuh Dinonaktifkan */}
          {isProctoringEnabled && showFullscreenWarning && (
            <div className="bg-amber-500/20 border-b border-amber-500/40 px-margin py-2 text-amber-900 dark:text-amber-200 text-body-xs font-medium flex items-center justify-between gap-2 animate-fadeIn sticky top-[53px] z-20 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Peringatan Proctoring:</strong> Anda keluar dari mode Layar Penuh (Fullscreen). Mohon kunci kembali layar penuh demi integritas ujian.
                </span>
              </div>
              <button
                type="button"
                onClick={requestFullscreenLock}
                className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 transition-colors shadow-elevation-1"
              >
                Kunci Layar Penuh
              </button>
            </div>
          )}

          {/* Toast Peringatan Copy/Paste/Inspect */}
          {copyWarningToast && (
            <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-4 py-2 rounded-xl shadow-elevation-3 text-body-xs font-bold flex items-center gap-2 animate-bounce">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>Aksi Klik Kanan &amp; Salin-Tempel (Copy-Paste) dinonaktifkan pada Mode Ujian Resmi.</span>
            </div>
          )}

          {/* Main Dual-Pane Container */}
          <div className="max-w-7xl mx-auto w-full px-margin py-space-md flex-1 grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            {/* Left Primary Pane: 70% (~8 cols) */}
            <main className="lg:col-span-8 space-y-space-md flex flex-col justify-between">
              <div>
                <QuestionCard
                  question={currentQ}
                  questionNumber={currentIndex + 1}
                  totalQuestions={questions.length}
                  selectedAnswers={currentAnswer?.selectedAnswers ?? []}
                  isReviewMode={false}
                  onSelectOption={handleSelectOption}
                  isFlagged={currentAnswer?.isFlagged ?? false}
                  onToggleFlag={handleToggleFlag}
                />
              </div>

              {/* Bottom Navigation Toolbar */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant shadow-elevation-1 flex flex-wrap items-center justify-between gap-space-xs mt-space-md">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-space-md py-space-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface text-body-sm font-medium hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                {/* Flag / Ragu-ragu Toggle Button */}
                <button
                  type="button"
                  onClick={handleToggleFlag}
                  className={`px-space-md py-space-sm rounded-lg border text-body-sm font-semibold transition-all flex items-center gap-2 ${
                    currentAnswer?.isFlagged
                      ? "bg-amber-500 text-white border-amber-600 shadow-elevation-1 ring-1 ring-amber-400"
                      : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                  title="Tandai soal ini sebagai ragu-ragu (Shortcut: R)"
                >
                  <Flag className={`w-4 h-4 ${currentAnswer?.isFlagged ? "fill-white text-white" : ""}`} />
                  <span>{currentAnswer?.isFlagged ? "Tandai Ragu-ragu ✓" : "Ragu-ragu"}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    currentAnswer?.isFlagged ? "bg-amber-600 text-white" : "bg-surface-container text-on-surface-variant"
                  }`}>
                    R
                  </span>
                </button>

                <div className="flex items-center gap-space-xs">
                  {currentIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                      className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-bold text-body-sm hover:bg-primary-container shadow-elevation-1 transition-all flex items-center gap-2"
                    >
                      <span>Berikutnya</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(true)}
                      className="px-space-lg py-space-sm rounded-lg bg-success text-on-success font-bold text-body-sm hover:bg-emerald-600 shadow-elevation-1 transition-all flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kumpulkan Ujian</span>
                    </button>
                  )}
                </div>
              </div>
            </main>

            {/* Right Secondary Pane: 30% (~4 cols) Navigator Grid */}
            <aside className="hidden lg:block lg:col-span-4 space-y-space-md">
              <div className="sticky top-20 bg-surface-container-lowest rounded-xl border border-outline-variant p-space-md shadow-elevation-1 space-y-space-md">
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant">
                  <h3 className="font-bold text-title-md text-on-surface">Navigasi Butir Soal</h3>
                  <span className="text-body-xs font-mono text-on-surface-variant">
                    {answeredCount} / {questions.length} Terjawab
                  </span>
                </div>

                <NavigatorGrid
                  totalQuestions={questions.length}
                  currentIndex={currentIndex}
                  answers={answers}
                  questionIds={questions.map((q) => q.id)}
                  onSelectIndex={(idx) => setCurrentIndex(idx)}
                />

                {/* Selesai / Submit Button in Sidebar */}
                <div className="pt-space-xs border-t border-outline-variant">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="w-full py-space-sm rounded-lg bg-primary text-on-primary font-bold text-body-sm hover:bg-primary-container shadow-elevation-1 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Selesai &amp; Kumpulkan</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* Mobile Drawer Navigator */}
          {showMobileNavigator && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowMobileNavigator(false)}
              />
              <div className="relative ml-auto w-80 max-w-[85vw] h-full bg-surface-container-lowest border-l border-outline-variant p-space-md shadow-elevation-3 flex flex-col justify-between z-10 animate-slideIn">
                <div className="space-y-space-md">
                  <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant">
                    <h3 className="font-bold text-title-md text-on-surface">Navigasi Soal</h3>
                    <button
                      type="button"
                      onClick={() => setShowMobileNavigator(false)}
                      className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <NavigatorGrid
                    totalQuestions={questions.length}
                    currentIndex={currentIndex}
                    answers={answers}
                    questionIds={questions.map((q) => q.id)}
                    onSelectIndex={(idx) => {
                      setCurrentIndex(idx);
                      setShowMobileNavigator(false);
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowMobileNavigator(false);
                    setShowSubmitModal(true);
                  }}
                  className="w-full py-space-sm rounded-lg bg-primary text-on-primary font-bold text-body-sm hover:bg-primary-container shadow-elevation-1 transition-all flex items-center justify-center gap-2 mt-space-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Kumpulkan Ujian</span>
                </button>
              </div>
            </div>
          )}

          {/* Konfirmasi Modal Selesai Ujian */}
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-margin bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl border border-outline-variant p-space-lg shadow-elevation-3 space-y-space-md">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-space-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-headline-sm font-bold text-on-surface">
                    Konfirmasi Selesai Ujian
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    Apakah Anda yakin ingin menyelesaikan {selectedPackage.title}?
                  </p>
                </div>

                {/* Status Jawaban */}
                <div className="grid grid-cols-3 gap-space-xs p-space-sm rounded-lg bg-surface-container-low border border-outline-variant font-mono text-center">
                  <div>
                    <span className="text-[11px] text-on-surface-variant uppercase">Terjawab</span>
                    <p className="text-headline-sm font-bold text-success">{answeredCount}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 uppercase font-semibold">Ragu-ragu</span>
                    <p className="text-headline-sm font-bold text-amber-500">{flaggedCount}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-on-surface-variant uppercase">Kosong</span>
                    <p className="text-headline-sm font-bold text-error">{unansweredCount}</p>
                  </div>
                </div>

                {flaggedCount > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-body-sm flex items-start gap-2.5">
                    <Flag className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 fill-amber-500" />
                    <div>
                      <p className="font-semibold text-amber-800 dark:text-amber-200">
                        Masih ada {flaggedCount} soal bertanda Ragu-ragu
                      </p>
                      <p className="text-[12px] text-amber-700/90 dark:text-amber-300/80 mt-0.5 leading-snug">
                        Soal ragu-ragu yang telah dipilih jawabannya tetap dinilai. Anda dapat meninjau nomor soal kuning di panel navigasi.
                      </p>
                    </div>
                  </div>
                )}

                {unansweredCount > 0 && (
                  <p className="text-body-sm text-warning font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    Terdapat {unansweredCount} butir soal yang belum Anda jawab.
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-space-sm pt-space-xs">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-space-sm rounded-lg border border-outline-variant text-on-surface font-medium hover:bg-surface-container-low transition-colors"
                  >
                    Lanjutkan Mengerjakan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFinishExam(true)}
                    className="flex-1 py-space-sm rounded-lg bg-primary text-on-primary font-bold hover:bg-primary-container shadow-elevation-1 transition-all"
                  >
                    Ya, Kumpulkan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Peringatan Deteksi Pindah Tab */}
          {showTabWarningModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-margin bg-black/70 backdrop-blur-md animate-fadeIn">
              <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl border-2 border-red-500/50 p-space-lg shadow-elevation-3 space-y-space-md text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mx-auto mb-2 animate-pulse">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-red-600 font-bold px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                    Pelanggaran Ke-{tabSwitchViolations} dari 3
                  </span>
                  <h3 className="text-headline-sm font-bold text-on-surface mt-2">
                    Deteksi Berpindah Tab / Jendela!
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Sistem CBT mendeteksi bahwa Anda meninggalkan jendela lembar ujian. Aktivitas ini dicatat dalam laporan pengawasan resmi.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant text-[12px] text-left text-on-surface-variant space-y-1">
                  <p className="font-semibold text-on-surface">Aturan Pengawasan CBT:</p>
                  <p>&bull; Jangan membuka tab browser lain, aplikasi chat, atau mesin pencari.</p>
                  <p>&bull; Jika Anda berpindah tab sebanyak <strong>3 kali</strong>, ujian akan dihentikan dan diserahkan secara otomatis.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowTabWarningModal(false);
                    requestFullscreenLock();
                  }}
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-body-sm hover:bg-primary-container shadow-elevation-1 transition-all"
                >
                  Saya Mengerti &amp; Lanjutkan Ujian
                </button>
              </div>
            </div>
          )}

          {/* Modal Diskualifikasi / Batas Pelanggaran Terlampaui */}
          {showDisqualifiedModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-margin bg-black/80 backdrop-blur-md animate-fadeIn">
              <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl border-2 border-red-600 p-space-lg shadow-elevation-3 space-y-space-md text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <ShieldAlert className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-red-600 font-bold px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
                    Batas Maksimal Pelanggaran Terlampaui
                  </span>
                  <h3 className="text-headline-sm font-bold text-on-surface mt-2 text-red-600">
                    Ujian Dihentikan Otomatis
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Anda telah berpindah tab sebanyak <strong>3 kali</strong>. Sesuai standar integritas ujian nasional, lembar jawaban Anda otomatis dikumpulkan untuk dievaluasi oleh sistem pengawas.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-body-xs font-mono text-on-surface-variant">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>Menyerahkan berkas jawaban ke sistem...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
