"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Target,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Settings2,
  Award,
  TrendingUp,
  X,
  Zap,
  BookOpen,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import {
  getLearningGoals,
  updateLearningGoals,
  calculateMilestones,
  getDailyMotivationQuote,
  getExamCountdown,
} from "@/lib/targets";
import { GoalMilestone, LearningGoals, MotivationQuote, UserProfile } from "@/types";

interface LearningTargetsCardProps {
  profile: UserProfile | null;
}

export function LearningTargetsCard({ profile }: LearningTargetsCardProps) {
  const [goals, setGoals] = useState<LearningGoals>(getLearningGoals());
  const [quote, setQuote] = useState<MotivationQuote>(getDailyMotivationQuote());
  const [milestones, setMilestones] = useState<GoalMilestone[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMilestonesModalOpen, setIsMilestonesModalOpen] = useState(false);

  // Form edit state
  const [targetIrt, setTargetIrt] = useState(650);
  const [dailyQuestions, setDailyQuestions] = useState(10);
  const [weeklySimulations, setWeeklySimulations] = useState(2);
  const [examDate, setExamDate] = useState("");

  const refreshData = React.useCallback(() => {
    const current = getLearningGoals();
    setGoals(current);
    setMilestones(calculateMilestones(current));
    setTargetIrt(current.targetIrtScore);
    setDailyQuestions(current.dailyQuestionsGoal);
    setWeeklySimulations(current.weeklySimulationsGoal);
    setExamDate(current.examDate);
  }, []);

  useEffect(() => {
    refreshData();
    setQuote(getDailyMotivationQuote());

    const handleGoalsUpdated = () => {
      refreshData();
    };

    window.addEventListener("cendekia:goals-updated", handleGoalsUpdated);
    return () => {
      window.removeEventListener("cendekia:goals-updated", handleGoalsUpdated);
    };
  }, [refreshData]);

  const currentScore = profile?.latestIrtScore || 0;
  const scoreProgress = Math.min(
    100,
    Math.round((currentScore / Math.max(1, goals.targetIrtScore)) * 100)
  );
  const scoreDiff = goals.targetIrtScore - currentScore;

  const dailyProgress = Math.min(
    100,
    Math.round((goals.todayQuestionsAnswered / Math.max(1, goals.dailyQuestionsGoal)) * 100)
  );
  const isDailyCompleted = goals.todayQuestionsAnswered >= goals.dailyQuestionsGoal;

  const countdown = getExamCountdown(goals.examDate);
  const unlockedMilestonesCount = milestones.filter((m) => m.isUnlocked).length;

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    updateLearningGoals({
      targetIrtScore: targetIrt,
      dailyQuestionsGoal: dailyQuestions,
      weeklySimulationsGoal: weeklySimulations,
      examDate: examDate || goals.examDate,
    });
    setIsEditModalOpen(false);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Flame":
        return <Flame className="w-4 h-4 text-amber-500" />;
      case "Target":
        return <Target className="w-4 h-4 text-primary" />;
      case "Zap":
        return <Zap className="w-4 h-4 text-purple-500" />;
      case "BookOpen":
        return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      case "Award":
        return <Award className="w-4 h-4 text-amber-500" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <>
      <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-space-lg shadow-elevation-1 space-y-space-md relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/5 via-tertiary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Header: Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-space-sm border-b border-outline-variant relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-elevation-1">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-title-lg font-bold text-on-surface flex items-center gap-2">
                Pusat Target & Semangat TKA
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-mono font-semibold">
                  Personal Goal
                </span>
              </h2>
              <p className="text-body-xs text-on-surface-variant">
                Pantau progres harian, pertahankan streak belajar, dan capai target kelulusanmu.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsMilestonesModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-body-xs font-semibold border border-outline-variant flex items-center gap-1.5 transition-all shadow-elevation-1 active:scale-95"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Lencana ({unlockedMilestonesCount}/{milestones.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-body-xs font-semibold border border-primary/20 flex items-center gap-1.5 transition-all shadow-elevation-1 active:scale-95"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Atur Target</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive Target Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm relative z-10">
          {/* Card 1: Target Skor IRT */}
          <div className="p-space-md rounded-xl bg-surface-container-low/70 border border-outline-variant/80 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
                  Target Skor IRT
                </span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>

              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-mono text-headline-md font-bold text-on-surface">
                  {currentScore}
                </span>
                <span className="font-mono text-body-sm text-on-surface-variant">
                  / {goals.targetIrtScore}
                </span>
              </div>

              <div className="mt-2.5 space-y-1">
                <div className="h-2 w-full rounded-full bg-outline-variant overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      currentScore >= goals.targetIrtScore
                        ? "bg-success"
                        : "bg-gradient-to-r from-primary to-tertiary"
                    }`}
                    style={{ width: `${Math.max(4, scoreProgress)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
                  <span>{scoreProgress}% Tercapai</span>
                  <span>{currentScore >= goals.targetIrtScore ? "🎉 Target Tembus!" : `Kurang ${scoreDiff} poin`}</span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-on-surface-variant leading-tight">
              {currentScore >= goals.targetIrtScore
                ? "Luar biasa! Skor simulasi kamu sudah melampaui target."
                : "Tingkatkan akurasi di soal kategori Sedang & Sulit."}
            </p>
          </div>

          {/* Card 2: Target Soal Hari Ini */}
          <div className="p-space-md rounded-xl bg-surface-container-low/70 border border-outline-variant/80 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
                  Target Hari Ini
                </span>
                <CheckCircle2
                  className={`w-4 h-4 ${
                    isDailyCompleted ? "text-success" : "text-on-surface-variant"
                  }`}
                />
              </div>

              <div className="mt-2 flex items-baseline gap-1.5">
                <span
                  className={`font-mono text-headline-md font-bold ${
                    isDailyCompleted ? "text-success" : "text-on-surface"
                  }`}
                >
                  {goals.todayQuestionsAnswered}
                </span>
                <span className="font-mono text-body-sm text-on-surface-variant">
                  / {goals.dailyQuestionsGoal} Soal
                </span>
              </div>

              <div className="mt-2.5 space-y-1">
                <div className="h-2 w-full rounded-full bg-outline-variant overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isDailyCompleted ? "bg-success" : "bg-primary"
                    }`}
                    style={{ width: `${Math.max(4, dailyProgress)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
                  <span>{dailyProgress}% Hari Ini</span>
                  <span>
                    {isDailyCompleted
                      ? "Tuntas! 🏆"
                      : `Sisa ${Math.max(0, goals.dailyQuestionsGoal - goals.todayQuestionsAnswered)} soal`}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant">
                {isDailyCompleted ? "Target harian beres!" : "Yuk cicil beberapa butir lagi:"}
              </span>
              <Link
                href="/practice"
                className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center"
              >
                Latihan &rarr;
              </Link>
            </div>
          </div>

          {/* Card 3: Streak Belajar Harian */}
          <div className="p-space-md rounded-xl bg-surface-container-low/70 border border-outline-variant/80 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
                  Streak Belajar
                </span>
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>

              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-mono text-headline-md font-bold text-amber-500 flex items-center gap-1">
                  {goals.currentStreak}
                  <span className="text-body-sm font-sans font-semibold text-on-surface">Hari</span>
                </span>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((dayIdx) => {
                  const isPassed = dayIdx <= ((goals.currentStreak - 1) % 7) + 1;
                  return (
                    <div
                      key={dayIdx}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        isPassed
                          ? "bg-amber-500 shadow-sm"
                          : "bg-outline-variant"
                      }`}
                      title={`Hari ${dayIdx}`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>Rekor: <strong>{goals.longestStreak} Hari</strong></span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold font-mono text-[10px]">
                🔥 Tetap Membara
              </span>
            </div>
          </div>

          {/* Card 4: Hitung Mundur Ujian TKA */}
          <div className="p-space-md rounded-xl bg-surface-container-low/70 border border-outline-variant/80 flex flex-col justify-between hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
                  Menuju Ujian TKA
                </span>
                <Calendar className="w-4 h-4 text-tertiary" />
              </div>

              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-mono text-headline-md font-bold text-primary">
                  {countdown.daysLeft}
                </span>
                <span className="font-mono text-body-sm text-on-surface-variant">Hari Lagi</span>
              </div>

              <div className="mt-2.5">
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono ${
                    countdown.urgencyColor === "error"
                      ? "bg-error-container text-on-error-container"
                      : countdown.urgencyColor === "warning"
                      ? "bg-warning-container text-on-warning-container"
                      : "bg-tertiary-container text-on-tertiary-container"
                  }`}
                >
                  {countdown.label}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>Target: <strong>{new Date(goals.examDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</strong></span>
              <Link
                href="/simulation"
                className="font-semibold text-primary hover:underline inline-flex items-center"
              >
                Tryout &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Motivational Banner / Quote of the Day */}
        <div className="bg-gradient-to-r from-primary/5 via-tertiary/10 to-surface-container-low p-space-sm rounded-xl border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-body-sm relative z-10">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary text-on-primary shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-medium text-on-surface italic text-[13px] leading-relaxed">
                &ldquo;{quote.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
                <span className="font-semibold text-primary">&mdash; {quote.author}</span>
                <span>&bull;</span>
                <span className="font-mono text-[10px]">{quote.context}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setQuote(getDailyMotivationQuote())}
            title="Ganti Kutipan Inspiratif"
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors self-end sm:self-auto shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Modal: Atur Target Belajar */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-space-lg shadow-elevation-3 space-y-space-md animate-scaleUp">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-title-md text-on-surface">
                  Sesuaikan Target Belajar
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoals} className="space-y-space-md">
              {/* Target Skor IRT */}
              <div className="space-y-1.5">
                <label className="text-body-sm font-semibold text-on-surface flex items-center justify-between">
                  <span>Target Skor IRT (Skala 200–800)</span>
                  <span className="font-mono text-primary font-bold">{targetIrt} IRT</span>
                </label>
                <input
                  type="range"
                  min="400"
                  max="800"
                  step="10"
                  value={targetIrt}
                  onChange={(e) => setTargetIrt(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between gap-1 text-[11px] font-mono text-on-surface-variant">
                  <button
                    type="button"
                    onClick={() => setTargetIrt(550)}
                    className="px-2 py-0.5 rounded bg-surface-container hover:bg-primary/20 hover:text-primary transition-colors"
                  >
                    550
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetIrt(650)}
                    className="px-2 py-0.5 rounded bg-surface-container hover:bg-primary/20 hover:text-primary transition-colors"
                  >
                    650 (Ideal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetIrt(700)}
                    className="px-2 py-0.5 rounded bg-surface-container hover:bg-primary/20 hover:text-primary transition-colors"
                  >
                    700 (Tinggi)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetIrt(780)}
                    className="px-2 py-0.5 rounded bg-surface-container hover:bg-primary/20 hover:text-primary transition-colors"
                  >
                    780 (Top Tier)
                  </button>
                </div>
              </div>

              {/* Target Soal Harian */}
              <div className="space-y-1.5">
                <label className="text-body-sm font-semibold text-on-surface flex items-center justify-between">
                  <span>Target Latihan Harian</span>
                  <span className="font-mono text-primary font-bold">{dailyQuestions} Soal / Hari</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setDailyQuestions(count)}
                      className={`py-2 rounded-xl text-body-sm font-mono font-semibold transition-all border ${
                        dailyQuestions === count
                          ? "bg-primary text-on-primary border-primary shadow-elevation-1"
                          : "bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high"
                      }`}
                    >
                      {count} Soal
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Simulasi Mingguan */}
              <div className="space-y-1.5">
                <label className="text-body-sm font-semibold text-on-surface flex items-center justify-between">
                  <span>Target Tryout per Minggu</span>
                  <span className="font-mono text-primary font-bold">{weeklySimulations} Paket</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setWeeklySimulations(count)}
                      className={`py-2 rounded-xl text-body-sm font-mono font-semibold transition-all border ${
                        weeklySimulations === count
                          ? "bg-primary text-on-primary border-primary shadow-elevation-1"
                          : "bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high"
                      }`}
                    >
                      {count} Paket
                    </button>
                  ))}
                </div>
              </div>

              {/* Tanggal Ujian TKA */}
              <div className="space-y-1.5">
                <label className="text-body-sm font-semibold text-on-surface">
                  Estimasi Tanggal Ujian TKA
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-space-sm py-2 rounded-xl bg-surface-container border border-outline-variant text-on-surface text-body-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="pt-space-xs flex justify-end gap-2 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-space-md py-2 rounded-xl text-body-sm text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-semibold text-body-sm hover:bg-primary-container shadow-elevation-1 transition-all"
                >
                  Simpan Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Lencana & Milestones Pencapaian */}
      {isMilestonesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-space-lg shadow-elevation-3 space-y-space-md animate-scaleUp max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-title-md text-on-surface">
                    Lencana Pencapaian Target
                  </h3>
                  <p className="text-[11px] font-mono text-on-surface-variant">
                    {unlockedMilestonesCount} dari {milestones.length} lencana telah terbuka
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMilestonesModalOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-space-xs overflow-y-auto flex-1 pr-1">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className={`p-space-sm rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    m.isUnlocked
                      ? "bg-amber-500/5 border-amber-500/30 text-on-surface"
                      : "bg-surface-container-low/50 border-outline-variant/60 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        m.isUnlocked
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-elevation-1"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {getCategoryIcon(m.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-body-sm text-on-surface leading-tight">
                          {m.title}
                        </h4>
                        {m.isUnlocked && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold">
                            TERBUKA
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-[11px] font-semibold text-primary block">
                      {m.progressText}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-space-xs border-t border-outline-variant shrink-0 flex justify-end">
              <button
                type="button"
                onClick={() => setIsMilestonesModalOpen(false)}
                className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-semibold text-body-sm hover:bg-primary-container shadow-elevation-1 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
