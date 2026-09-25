"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { ScoreGauge } from "@/components/ScoreGauge";
import { QuestionCard } from "@/components/QuestionCard";
import { AIExplanationCard } from "@/components/AIExplanationCard";
import { NavigatorGrid } from "@/components/NavigatorGrid";
import { AnaliticaReviewStudio } from "@/components/AnaliticaReviewStudio";
import {
  getAttemptById,
  getAttempts,
  getUserProfile,
  isQuestionBookmarked,
  toggleBookmark,
} from "@/lib/storage";
import { evaluateAnswer } from "@/lib/irt";
import { Attempt, Difficulty, UserProfile } from "@/types";
import {
  ArrowLeft,
  RefreshCw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Filter,
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  Printer,
  Clock,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function SimulationResultPage({ params }: { params: { id: string } }) {
  const attemptId = params?.id;
  const [attempt, setAttempt] = useState<Attempt | null>(() => getAttemptById(attemptId) || getAttempts()[0]);
  const [showStudioView, setShowStudioView] = useState(false);
  const [showReviewList, setShowReviewList] = useState(false);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState(0);
  const [filterMode, setFilterMode] = useState<"all" | "correct" | "incorrect">("all");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);

  useEffect(() => {
    setProfile(getUserProfile());
    if (attemptId) {
      const found = getAttemptById(attemptId);
      if (found) {
        setAttempt(found);
      }
    }
  }, [attemptId]);

  if (!attempt) {
    return (
      <Sidebar>
        <main className="max-w-4xl mx-auto px-margin py-space-xl text-center space-y-space-md w-full">
          <h1 className="text-headline-lg font-bold text-on-surface">Data Hasil Ujian Tidak Ditemukan</h1>
          <p className="text-body-md text-on-surface-variant">
            Sesi ujian belum tercatat atau telah dibersihkan dari penyimpanan lokal.
          </p>
          <Link
            href="/simulation"
            className="inline-flex items-center gap-2 px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-medium text-body-md hover:bg-primary-container transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Halaman Simulasi
          </Link>
        </main>
      </Sidebar>
    );
  }

  const irt = attempt.irtResult;
  const questions = attempt.questions;
  const answers = attempt.answers;

  // Evaluasi tiap soal untuk navigator dan filter
  const questionResults = questions.map((q) => {
    const ans = answers[q.id];
    return {
      isCorrect: evaluateAnswer(q, ans),
      isAnswered: Boolean(ans?.isAnswered),
      isFlagged: Boolean(ans?.isFlagged),
    };
  });

  const durationMin = Math.floor(attempt.durationSeconds / 60);
  const durationSec = attempt.durationSeconds % 60;

  const handleFilterClick = (mode: "all" | "correct" | "incorrect") => {
    setFilterMode(mode);
    if (mode === "correct") {
      const firstCorrect = questionResults.findIndex((r) => r.isCorrect);
      if (firstCorrect >= 0) setSelectedReviewIndex(firstCorrect);
    } else if (mode === "incorrect") {
      const firstIncorrect = questionResults.findIndex((r) => !r.isCorrect);
      if (firstIncorrect >= 0) setSelectedReviewIndex(firstIncorrect);
    }
  };

  const currentReviewQ = questions[selectedReviewIndex];
  const currentReviewAns = currentReviewQ ? answers[currentReviewQ.id] : null;
  const currentReviewResult = questionResults[selectedReviewIndex];

  // Perhitungan Analisis Kecepatan Menjawab (Speed & Efficiency)
  const totalQCount = irt?.totalQuestions ?? 30;
  const avgSecondsPerQ = Math.round(attempt.durationSeconds / totalQCount);
  const avgMin = Math.floor(avgSecondsPerQ / 60);
  const avgSecRem = avgSecondsPerQ % 60;
  const formattedAvgTime = avgMin > 0 ? `${avgMin}m ${avgSecRem}s` : `${avgSecRem}s`;

  let speedCategory: "Cepat" | "Ideal" | "Lambat" = "Ideal";
  if (avgSecondsPerQ < 50) speedCategory = "Cepat";
  else if (avgSecondsPerQ > 90) speedCategory = "Lambat";

  let speedInsight = "Kecepatan dan akurasi seimbang. Ritme pengerjaan sangat teratur dan stabil.";
  if ((irt?.overallAccuracy ?? 0) >= 75 && speedCategory === "Cepat") {
    speedInsight = "⚡ Paham & Cepat: Penguasaan konsep sangat solid dengan daya respon tangkas!";
  } else if ((irt?.overallAccuracy ?? 0) >= 75 && speedCategory === "Lambat") {
    speedInsight = "⏳ Tepat tapi Lambat: Akurasi sangat tinggi, namun latih efisiensi waktu agar tidak terburu-buru.";
  } else if ((irt?.overallAccuracy ?? 0) < 60 && speedCategory === "Cepat") {
    speedInsight = "💨 Cepat tapi Kurang Teliti: Pengerjaan sangat cepat, namun perhatikan jebakan kata kunci pada opsi.";
  } else if ((irt?.overallAccuracy ?? 0) < 60) {
    speedInsight = "⚠️ Butuh Pendalaman: Pelajari kembali soal-soal ini di menu Bank Remedial Spaced Repetition.";
  }

  return (
    <Sidebar>
      <main className="max-w-6xl mx-auto px-margin py-space-xl space-y-space-xl animate-fadeIn w-full">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-2 mb-space-xs">
              <span className="text-label-sm font-mono text-primary font-semibold px-3 py-1 rounded-full bg-primary/10">
                Laporan Hasil Evaluasi Ujian
              </span>
              {attempt.packageName && (
                <span className="text-label-sm font-mono text-success font-semibold px-3 py-1 rounded-full bg-success-container border border-success/30">
                  {attempt.packageName}
                </span>
              )}
            </div>
            <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-surface tracking-tight mt-space-xs">
              Hasil Simulasi TKA PPLG
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1">
              Waktu pengerjaan: {durationMin} menit {durationSec} detik &bull; {new Date(attempt.finishedAt).toLocaleString("id-ID")}
            </p>
          </div>

          <div className="flex items-center gap-space-sm self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-space-md py-2.5 rounded-xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary font-bold text-body-sm shadow-elevation-1 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh Rapor PDF</span>
            </button>
          </div>
        </div>

        {/* Unlocked Next Package Banner */}
        {attempt.packageId && attempt.packageId < 10 && (
          <div className="bg-gradient-to-r from-emerald-500/10 via-primary/10 to-teal-500/10 border border-success/40 rounded-2xl p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md shadow-elevation-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success text-on-success flex items-center justify-center shrink-0 shadow-elevation-1">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-title-md text-on-surface">
                  Selamat! Paket {attempt.packageId + 1} Kini Telah Terbuka! 🚀
                </h4>
                <p className="text-body-sm text-on-surface-variant">
                  Anda telah sukses menyelesaikan {attempt.packageName || `Paket ${attempt.packageId}`}. Lanjutkan perjalanan belajar ke paket berikutnya.
                </p>
              </div>
            </div>
            <Link
              href="/simulation"
              className="px-space-lg py-2.5 rounded-xl bg-primary text-on-primary font-bold text-body-sm hover:bg-primary-container shadow-elevation-2 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <span>Buka Paket {attempt.packageId + 1}</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        )}

        {/* Laporan Integritas Pengawasan (CBT Proctoring Report) */}
        {attempt.proctoringMode ? (
          <div
            className={`p-space-md rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-elevation-1 animate-fadeIn ${
              attempt.integrityStatus === "disqualified" || (attempt.tabSwitchCount ?? 0) >= 3
                ? "bg-red-500/10 border-red-500/40 text-red-900 dark:text-red-200"
                : (attempt.tabSwitchCount ?? 0) > 0
                ? "bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200"
                : "bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-elevation-1 ${
                  attempt.integrityStatus === "disqualified" || (attempt.tabSwitchCount ?? 0) >= 3
                    ? "bg-red-600 text-white"
                    : (attempt.tabSwitchCount ?? 0) > 0
                    ? "bg-amber-600 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {attempt.integrityStatus === "disqualified" || (attempt.tabSwitchCount ?? 0) >= 3 ? (
                  <AlertOctagon className="w-5 h-5" />
                ) : (attempt.tabSwitchCount ?? 0) > 0 ? (
                  <ShieldAlert className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-title-md">
                    {attempt.integrityStatus === "disqualified" || (attempt.tabSwitchCount ?? 0) >= 3
                      ? "Laporan Pengawasan: Ujian Dihentikan Otomatis (Diskualifikasi)"
                      : (attempt.tabSwitchCount ?? 0) > 0
                      ? "Laporan Pengawasan: Terpantau dengan Catatan"
                      : "Laporan Pengawasan: Integritas Sempurna (100% Bersih)"}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase border bg-surface/50 border-current">
                    CBT Anti-Cheat Aktif
                  </span>
                </div>
                <p className="text-body-xs opacity-90 mt-0.5">
                  {attempt.integrityStatus === "disqualified" || (attempt.tabSwitchCount ?? 0) >= 3
                    ? `Peserta terdeteksi meninggalkan tab ujian sebanyak ${attempt.tabSwitchCount} kali (melebihi batas maksimal 3x), sehingga ujian diserahkan paksa.`
                    : (attempt.tabSwitchCount ?? 0) > 0
                    ? `Peserta tercatat meninggalkan tab ujian sebanyak ${attempt.tabSwitchCount} kali dari toleransi 3 kali. Tetap tervalidasi dengan catatan.`
                    : "Peserta mengerjakan seluruh soal dalam mode layar penuh (fullscreen) terkunci tanpa pernah berpindah tab atau aplikasi."}
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-[11px] shrink-0 self-end sm:self-auto">
              <span>Pelanggaran Tab: </span>
              <strong className="text-body-sm font-bold">
                {attempt.tabSwitchCount ?? 0} / 3
              </strong>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl border border-outline-variant bg-surface-container-low text-body-xs text-on-surface-variant flex items-center gap-2">
            <span className="font-semibold text-on-surface font-mono">Mode Ujian:</span>
            <span>Simulasi dikerjakan dalam Mode Latihan Santai (Tanpa penguncian layar penuh &amp; anti-curang).</span>
          </div>
        )}

        {/* Section 1: Main Score Gauge & Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          {/* Left: Concentric IRT Gauge (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg shadow-elevation-1 flex flex-col items-center justify-center">
            <ScoreGauge score={irt?.score ?? 500} size={220} label="Estimasi Skor Akhir IRT" />
            <div className="mt-space-sm pt-space-sm border-t border-outline-variant w-full flex items-center justify-around text-center font-mono">
              <div>
                <span className="text-[11px] text-on-surface-variant block uppercase">Kemampuan (Theta)</span>
                <span className="font-bold text-body-lg text-primary">{irt?.theta.toFixed(2)} logit</span>
              </div>
              <div className="h-8 w-px bg-outline-variant" />
              <div>
                <span className="text-[11px] text-on-surface-variant block uppercase">Akurasi Total</span>
                <span className="font-bold text-body-lg text-on-surface">{irt?.overallAccuracy}%</span>
              </div>
            </div>
          </div>

          {/* Right: Difficulty & Metric Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-space-md">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-3 gap-space-sm">
              <div className="p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant text-center shadow-elevation-1">
                <span className="text-[11px] font-mono text-on-surface-variant uppercase font-semibold">Total Soal</span>
                <p className="text-headline-sm font-mono font-bold text-on-surface mt-1">{irt?.totalQuestions ?? 30}</p>
                <span className="text-[12px] text-on-surface-variant">30 Soal Ujian</span>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant text-center shadow-elevation-1">
                <span className="text-[11px] font-mono text-on-surface-variant uppercase font-semibold">Benar</span>
                <p className="text-headline-sm font-mono font-bold text-success mt-1">{irt?.totalCorrect ?? 0}</p>
                <span className="text-[12px] text-success">Tepat Menjawab</span>
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant text-center shadow-elevation-1">
                <span className="text-[11px] font-mono text-on-surface-variant uppercase font-semibold">Salah / Kosong</span>
                <p className="text-headline-sm font-mono font-bold text-error mt-1">
                  {(irt?.totalQuestions ?? 30) - (irt?.totalCorrect ?? 0)}
                </p>
                <span className="text-[12px] text-error">Perlu Dipelajari</span>
              </div>
            </div>

            {/* Breakdown per Difficulty Scale */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-md shadow-elevation-1 space-y-space-sm">
              <h3 className="font-semibold text-title-md text-on-surface">Akurasi per Tingkat Kesulitan</h3>

              {(["mudah", "sedang", "sulit"] as Difficulty[]).map((diff) => {
                const data = irt?.byDifficulty[diff];
                const pct = data?.percentage ?? 0;
                const barColor = diff === "mudah" ? "bg-success" : diff === "sedang" ? "bg-warning" : "bg-error";

                return (
                  <div key={diff} className="space-y-1">
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="font-medium text-on-surface capitalize">{diff}</span>
                      <span className="font-mono text-label-sm text-on-surface-variant">
                        {data?.correct ?? 0} / {data?.total ?? 0} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-outline-variant overflow-hidden">
                      <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{ width: `${Math.max(5, pct)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Speed & Answer Efficiency Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-md shadow-elevation-1 space-y-space-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-title-md text-on-surface">Efisiensi &amp; Kecepatan Menjawab</h3>
                </div>
                <span className="font-mono text-label-sm font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                  {formattedAvgTime} / soal
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant font-medium pt-1">
                {speedInsight}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono text-on-surface-variant border-t border-outline-variant/60">
                <div>
                  <span>Kategori Kecepatan: </span>
                  <strong className="text-on-surface">{speedCategory}</strong>
                </div>
                <div className="text-right">
                  <span>Total Durasi: </span>
                  <strong className="text-on-surface">{durationMin}m {durationSec}s / 50m</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Topic Breakdown Grid */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg shadow-elevation-1">
          <h3 className="font-semibold text-headline-sm text-on-surface mb-space-md">
            Analisis Penguasaan per Sub-Topik
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {Object.entries(irt?.byTopic ?? {}).map(([topic, data]) => {
              const isGood = data.percentage >= 70;
              return (
                <div key={topic} className="p-space-md rounded-lg bg-surface-container-low border border-outline-variant">
                  <span className="text-body-sm font-semibold text-on-surface block truncate" title={topic}>
                    {topic}
                  </span>
                  <div className="mt-space-xs flex items-center justify-between font-mono text-label-sm">
                    <span className="text-on-surface-variant">
                      {data.correct}/{data.total}
                    </span>
                    <span className={`font-bold ${isGood ? "text-success" : "text-warning"}`}>
                      {data.percentage}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-outline-variant overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isGood ? "bg-success" : "bg-warning"}`}
                      style={{ width: `${Math.max(5, data.percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Studio Pembahasan Interaktif & Mode Daftar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-space-sm pt-space-sm">
          <button
            type="button"
            onClick={() => setShowStudioView(true)}
            className="w-full sm:w-auto px-space-xl py-space-md rounded-2xl bg-gradient-to-r from-primary via-indigo-600 to-tertiary text-on-primary font-bold text-title-md hover:opacity-95 shadow-elevation-2 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>Buka Studio Pembahasan Soal</span>
          </button>

          <button
            type="button"
            onClick={() => setShowReviewList(!showReviewList)}
            className="w-full sm:w-auto px-space-lg py-space-md rounded-2xl border border-outline-variant bg-surface-container-low text-on-surface font-semibold text-body-md hover:bg-surface-container transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-primary" />
            <span>{showReviewList ? "Tutup Mode Daftar" : "Mode Daftar Ringkas"}</span>
            {showReviewList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Section 4: Full Review Mode */}
        {showReviewList && (
          <div className="pt-space-md border-t border-outline-variant space-y-space-lg animate-fadeIn">
            {/* Review Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant shadow-elevation-1">
              <div className="flex items-center gap-space-xs">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-body-sm font-semibold text-on-surface">Filter Pembahasan:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-label-sm">
                {(["all", "correct", "incorrect"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleFilterClick(mode)}
                    className={`px-3 py-1 rounded-full border transition-all ${
                      filterMode === mode
                        ? "bg-primary text-on-primary border-primary font-bold shadow-elevation-1"
                        : "bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary/40"
                    }`}
                  >
                    {mode === "all" ? "Semua (30)" : mode === "correct" ? "Hanya Benar" : "Hanya Salah"}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Review View: Navigator Grid + Question Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Navigator on Left / Top */}
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  <NavigatorGrid
                    totalQuestions={questions.length}
                    currentIndex={selectedReviewIndex}
                    answers={answers}
                    questionIds={questions.map((q) => q.id)}
                    onSelectIndex={(idx) => setSelectedReviewIndex(idx)}
                    isReviewMode={true}
                    questionResults={questionResults}
                  />
                </div>
              </div>

              {/* Question & AI Explanation on Right */}
              <div className="lg:col-span-8 space-y-space-md">
                {currentReviewQ && (
                  <>
                    {bookmarkToast && (
                      <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant text-body-xs font-mono text-on-surface flex items-center gap-2 animate-fadeIn">
                        <span>{bookmarkToast}</span>
                      </div>
                    )}

                    <QuestionCard
                      question={currentReviewQ}
                      questionNumber={selectedReviewIndex + 1}
                      totalQuestions={questions.length}
                      selectedAnswers={currentReviewAns?.selectedAnswers ?? []}
                      isReviewMode={true}
                      onSelectOption={() => {}}
                      isBookmarked={isQuestionBookmarked(currentReviewQ.id)}
                      onToggleBookmark={() => {
                        const isSaved = toggleBookmark(currentReviewQ);
                        setBookmarkToast(isSaved ? "⭐ Soal disimpan ke Bookmark pribadi!" : "🗑️ Soal dihapus dari Bookmark");
                        setTimeout(() => setBookmarkToast(null), 2500);
                      }}
                    />

                    {/* Pembahasan AI & Studio CTA */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/20">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-body-xs font-bold text-on-surface">Lihat analisis lengkap tiap butir opsi?</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowStudioView(true)}
                          className="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-bold text-body-xs transition-all flex items-center gap-1.5 shadow-elevation-1"
                        >
                          <span>Buka Studio Pembahasan</span>
                          <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                        </button>
                      </div>

                      <AIExplanationCard
                        explanation={currentReviewQ.explanation}
                        correctAnswerText={currentReviewQ.options
                          .filter((o) => currentReviewQ.correctAnswer.includes(o.key))
                          .map((o) => `${o.key}. ${o.text}`)
                          .join("; ")}
                        isCorrect={currentReviewResult?.isCorrect ?? false}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PRINTABLE OFFICIAL REPORT SHEET (RAPOR RESMI CETAK A4)             */}
        {/* =================================================================== */}
        <div className="hidden print:block w-full text-slate-900 font-sans space-y-6 pt-4">
          {/* Kop Surat Resmi */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <h2 className="text-sm font-bold tracking-wider uppercase">
              Kementerian Pendidikan Dasar dan Menengah Republik Indonesia
            </h2>
            <h1 className="text-xl font-extrabold tracking-tight uppercase">
              Rapor Hasil Ujian Kemampuan Akademik (TKA) Kejuruan PPLG
            </h1>
            <p className="text-xs text-slate-600">
              Sistem CBT Terstandar Item Response Theory (IRT) &bull; Kurikulum Merdeka SMK
            </p>
          </div>

          {/* Identitas Peserta & Ujian */}
          <div className="grid grid-cols-2 gap-4 text-xs border border-slate-300 p-4 rounded">
            <div className="space-y-1">
              <div><span className="font-semibold text-slate-600">Nama Siswa:</span> <strong className="text-sm">{profile?.name || "Siswa PPLG"}</strong></div>
              <div><span className="font-semibold text-slate-600">Asal Sekolah:</span> <span>{profile?.school || "SMK Negeri / Swasta"}</span></div>
              <div><span className="font-semibold text-slate-600">Kelas / Jurusan:</span> <span>{profile?.classGrade || "XII PPLG"}</span></div>
              <div><span className="font-semibold text-slate-600">Email Akun:</span> <span>{profile?.email || "siswa@pplg.sch.id"}</span></div>
            </div>
            <div className="space-y-1 text-right">
              <div><span className="font-semibold text-slate-600">Paket Soal:</span> <strong>{attempt.packageName || "Paket Tryout TKA"}</strong></div>
              <div><span className="font-semibold text-slate-600">Tanggal Selesai:</span> <span>{new Date(attempt.finishedAt).toLocaleString("id-ID")}</span></div>
              <div><span className="font-semibold text-slate-600">Durasi Pengerjaan:</span> <span>{durationMin} Menit {durationSec} Detik</span></div>
              <div><span className="font-semibold text-slate-600">Status Integritas:</span> <strong className="text-emerald-700">{attempt.integrityStatus === "clean" ? "100% Bersih & Jujur" : "Terpantau dengan Catatan"}</strong></div>
            </div>
          </div>

          {/* Rekap Nilai Utama */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="border border-slate-300 p-3 rounded">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Skor Akhir IRT</span>
              <span className="text-2xl font-bold text-indigo-900">{irt?.score ?? 500}</span>
              <span className="text-[10px] text-slate-500 block">Skala 200 – 800</span>
            </div>
            <div className="border border-slate-300 p-3 rounded">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Nilai Skala 100</span>
              <span className="text-2xl font-bold text-slate-800">{Math.round(((irt?.score ?? 500) / 800) * 100)}</span>
              <span className="text-[10px] text-slate-500 block">Persentil Konversi</span>
            </div>
            <div className="border border-slate-300 p-3 rounded">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Akurasi Jawaban</span>
              <span className="text-2xl font-bold text-emerald-700">{irt?.overallAccuracy}%</span>
              <span className="text-[10px] text-slate-500 block">{irt?.totalCorrect} Benar dari {irt?.totalQuestions} Soal</span>
            </div>
            <div className="border border-slate-300 p-3 rounded">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Rata-rata Waktu</span>
              <span className="text-2xl font-bold text-slate-800">{formattedAvgTime}</span>
              <span className="text-[10px] text-slate-500 block">per Butir Soal ({speedCategory})</span>
            </div>
          </div>

          {/* Tabel Detail Capaian per Sub-Topik */}
          <div>
            <h3 className="text-xs font-bold uppercase mb-2">Rincian Capaian Kompetensi Kejuruan PPLG:</h3>
            <table className="w-full text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="border border-slate-300 p-2">No</th>
                  <th className="border border-slate-300 p-2">Sub-Topik Kejuruan</th>
                  <th className="border border-slate-300 p-2 text-center">Soal Diuji</th>
                  <th className="border border-slate-300 p-2 text-center">Jawaban Benar</th>
                  <th className="border border-slate-300 p-2 text-center">Akurasi (%)</th>
                  <th className="border border-slate-300 p-2 text-center">Predikat</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(irt?.byTopic ?? {}).map(([topic, data], idx) => (
                  <tr key={topic}>
                    <td className="border border-slate-300 p-2 text-center font-mono">{idx + 1}</td>
                    <td className="border border-slate-300 p-2 font-medium">{topic}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono">{data.total}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono">{data.correct}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono font-bold">{data.percentage}%</td>
                    <td className="border border-slate-300 p-2 text-center font-semibold">
                      {data.percentage >= 75 ? "Sangat Baik" : data.percentage >= 60 ? "Kompeten" : "Perlu Bimbingan"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kolom Tanda Tangan Resmi */}
          <div className="grid grid-cols-2 gap-12 pt-8 text-center text-xs">
            <div>
              <p className="mb-14">Guru Pembimbing / Asesor Kejuruan,</p>
              <div className="w-44 border-b border-slate-800 mx-auto" />
              <p className="mt-1 font-semibold text-slate-700">NIP. ........................................</p>
            </div>
            <div>
              <p className="mb-14">Mengetahui, Kepala Sekolah / Penguji,</p>
              <div className="w-44 border-b border-slate-800 mx-auto" />
              <p className="mt-1 font-semibold text-slate-700">NIP. ........................................</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-lg border-t border-outline-variant">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-space-md py-space-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low font-medium text-body-sm transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Dashboard
            </Link>

            <Link
              href="/remedial"
              className="px-space-md py-space-sm rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary font-semibold text-body-sm transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Buka Bank Remedial
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-space-md py-space-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container font-semibold text-body-sm transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-primary" />
              <span>Cetak Rapor</span>
            </button>

            <Link
              href="/simulation"
              className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-bold text-body-sm hover:bg-primary-container shadow-elevation-1 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Simulasi Lagi
            </Link>
          </div>
        </div>
      </main>

      {/* Studio Pembahasan & Tanya AI Interaktif (Ala Analitica) */}
      {showStudioView && (
        <AnaliticaReviewStudio
          questions={questions}
          answers={answers}
          initialIndex={selectedReviewIndex}
          packageTitle={attempt.packageName || "Simulasi TKA PPLG"}
          onClose={() => setShowStudioView(false)}
        />
      )}
    </Sidebar>
  );
}
