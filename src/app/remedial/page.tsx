"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { QuestionCard } from "@/components/QuestionCard";
import { AIExplanationCard } from "@/components/AIExplanationCard";
import { evaluateAnswer } from "@/lib/irt";
import {
  getRemedialQueue,
  resolveRemedialQuestion,
  removeRemedialQuestion,
  getBookmarks,
  toggleBookmark,
  isQuestionBookmarked,
  recordQuestionSpeed,
  touchLastActiveTime,
} from "@/lib/storage";
import { recordQuestionAnsweredToday } from "@/lib/targets";
import { RemedialQuestion, BookmarkedQuestion, Question, StudentAnswer } from "@/types";
import {
  RotateCcw,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Flame,
  Trash2,
  BookOpen,
  Check,
} from "lucide-react";

export default function RemedialSpacedRepetitionPage() {
  const [activeTab, setActiveTab] = useState<"remedial" | "bookmarks">("remedial");
  const [remedialQueue, setRemedialQueue] = useState<RemedialQuestion[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>([]);
  const [filterStage, setFilterStage] = useState<number | "all">("all");

  // State untuk Mode Latihan Remedial Aktif
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [remedialFeedbackToast, setRemedialFeedbackToast] = useState<string | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setRemedialQueue(getRemedialQueue());
    setBookmarks(getBookmarks());
  };

  // Filter soal remedial berdasarkan stage Leitner
  const filteredRemedial = remedialQueue.filter((item) => {
    if (filterStage === "all") return true;
    return item.stage === filterStage;
  });

  // Hitung jumlah soal yang siap diulang (due for review)
  const todayStr = new Date().toISOString().split("T")[0];
  const dueTodayCount = remedialQueue.filter((item) => item.nextReviewDate <= todayStr).length;
  const masteredCount = remedialQueue.filter((item) => item.stage >= 4).length;

  // Memulai Latihan Remedial
  const startRemedialPractice = (questionsList: Question[]) => {
    if (questionsList.length === 0) return;
    setPracticeQuestions(questionsList);
    setPracticeIndex(0);
    setSelectedAnswers([]);
    setHasCheckedAnswer(false);
    setIsAnswerCorrect(null);
    setQuestionStartTime(Date.now());
    setIsPracticing(true);
  };

  // Toggle pilihan jawaban dalam latihan remedial
  const handleOptionToggle = (key: string) => {
    if (hasCheckedAnswer) return;
    const currentQ = practiceQuestions[practiceIndex];
    if (!currentQ) return;

    if (currentQ.type === "multiple") {
      if (selectedAnswers.includes(key)) {
        setSelectedAnswers(selectedAnswers.filter((k) => k !== key));
      } else {
        setSelectedAnswers([...selectedAnswers, key]);
      }
    } else {
      setSelectedAnswers([key]);
    }
  };

  // Evaluasi jawaban remedial
  const handleCheckRemedialAnswer = () => {
    const currentQ = practiceQuestions[practiceIndex];
    if (!currentQ || selectedAnswers.length === 0) return;

    const studentAnswer: StudentAnswer = {
      questionId: currentQ.id,
      selectedAnswers,
      isFlagged: false,
      isAnswered: true,
    };

    const isCorrect = evaluateAnswer(currentQ, studentAnswer);
    setIsAnswerCorrect(isCorrect);
    setHasCheckedAnswer(true);

    const elapsedSec = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    recordQuestionSpeed(currentQ.id, currentQ.topic, elapsedSec, isCorrect);
    recordQuestionAnsweredToday(1);
    touchLastActiveTime();

    // Update status Spaced Repetition Leitner Box
    resolveRemedialQuestion(currentQ.id, isCorrect);
    refreshData();

    if (isCorrect) {
      setRemedialFeedbackToast("🎉 Luar biasa! Soal berhasil dijawab benar dan naik stage interval pengulangan!");
    } else {
      setRemedialFeedbackToast("⚠️ Masih belum tepat. Soal akan dijadwalkan ulang besok untuk kamu coba lagi.");
    }
    setTimeout(() => setRemedialFeedbackToast(null), 4000);
  };

  const handleNextRemedial = () => {
    if (practiceIndex < practiceQuestions.length - 1) {
      setPracticeIndex((prev) => prev + 1);
      setSelectedAnswers([]);
      setHasCheckedAnswer(false);
      setIsAnswerCorrect(null);
      setQuestionStartTime(Date.now());
    } else {
      setIsPracticing(false);
    }
  };

  const currentPracticeQ = practiceQuestions[practiceIndex];

  return (
    <Sidebar>
      <main className="max-w-6xl mx-auto px-margin py-space-xl space-y-space-xl animate-fadeIn w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-label-sm font-mono mb-space-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sistem Retensi Memori &bull; Spaced Repetition</span>
            </div>
            <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-surface tracking-tight">
              Bank Remedial &amp; Soal Tersimpan
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1 max-w-3xl">
              Soal-soal yang pernah kamu jawab salah secara otomatis dimasukkan ke antrean berjenjang (Leitner Box) agar tidak terlupakan sampai benar-benar kamu kuasai.
            </p>
          </div>

          {!isPracticing && remedialQueue.length > 0 && (
            <button
              type="button"
              onClick={() => startRemedialPractice(remedialQueue.map((r) => r.question))}
              className="px-space-xl py-3 rounded-xl bg-primary text-on-primary font-bold text-body-md hover:bg-primary-container shadow-elevation-2 transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
            >
              <Flame className="w-5 h-5 text-amber-300" />
              <span>Latihan Semua Soal Salah ({remedialQueue.length})</span>
            </button>
          )}
        </div>

        {/* =================================================================== */}
        {/* MODE 1: LATIHAN REMEDIAL INTERAKTIF AKTIF                           */}
        {/* =================================================================== */}
        {isPracticing && currentPracticeQ ? (
          <div className="space-y-space-md animate-fadeIn">
            {/* Header Latihan */}
            <div className="flex items-center justify-between bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant shadow-elevation-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-label-md font-bold text-primary">
                  Sesi Remedial: Soal {practiceIndex + 1} dari {practiceQuestions.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPracticing(false)}
                className="px-3 py-1.5 rounded-lg border border-outline-variant text-body-sm font-semibold hover:bg-surface-container transition-all"
              >
                Selesai / Keluar
              </button>
            </div>

            {remedialFeedbackToast && (
              <div
                className={`p-3.5 rounded-xl border text-body-sm font-semibold flex items-center gap-2 animate-fadeIn shadow-elevation-1 ${
                  isAnswerCorrect
                    ? "bg-success-container border-success/40 text-on-success-container"
                    : "bg-warning-container border-warning/40 text-on-warning-container"
                }`}
              >
                {isAnswerCorrect ? <CheckCircle2 className="w-5 h-5 text-success shrink-0" /> : <AlertTriangle className="w-5 h-5 text-warning shrink-0" />}
                <span>{remedialFeedbackToast}</span>
              </div>
            )}

            {/* Question Card */}
            <QuestionCard
              question={currentPracticeQ}
              questionNumber={practiceIndex + 1}
              totalQuestions={practiceQuestions.length}
              selectedAnswers={selectedAnswers}
              isReviewMode={hasCheckedAnswer}
              onSelectOption={handleOptionToggle}
              isBookmarked={isQuestionBookmarked(currentPracticeQ.id)}
              onToggleBookmark={() => {
                toggleBookmark(currentPracticeQ);
                refreshData();
              }}
            />

            {/* AI Explanation Card */}
            {hasCheckedAnswer && (
              <AIExplanationCard
                question={currentPracticeQ}
                userAnswer={selectedAnswers}
                explanation={currentPracticeQ.explanation}
                correctAnswerText={currentPracticeQ.options
                  .filter((o) => currentPracticeQ.correctAnswer.includes(o.key))
                  .map((o) => `${o.key}. ${o.text}`)
                  .join("; ")}
                isCorrect={isAnswerCorrect ?? false}
              />
            )}

            {/* Bottom Actions */}
            <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-elevation-1 flex items-center justify-between">
              <div>
                <span className="text-[12px] font-mono text-on-surface-variant">
                  {hasCheckedAnswer
                    ? isAnswerCorrect
                      ? "✅ Jawaban tepat! Stage pengulangan diperbarui."
                      : "❌ Masih keliru. Pelajari pembahasan di atas."
                    : "Pilih jawaban lalu periksa."}
                </span>
              </div>

              {!hasCheckedAnswer ? (
                <button
                  type="button"
                  onClick={handleCheckRemedialAnswer}
                  disabled={selectedAnswers.length === 0}
                  className={`px-space-xl py-2.5 rounded-xl font-bold text-body-sm transition-all flex items-center gap-2 ${
                    selectedAnswers.length > 0
                      ? "bg-primary text-on-primary hover:bg-primary-container shadow-elevation-2"
                      : "bg-surface-container text-on-surface-variant/40 border border-outline-variant cursor-not-allowed"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Periksa Jawaban</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextRemedial}
                  className="px-space-xl py-2.5 rounded-xl bg-success text-on-success font-bold text-body-sm hover:bg-emerald-600 shadow-elevation-2 transition-all flex items-center gap-2"
                >
                  <span>{practiceIndex < practiceQuestions.length - 1 ? "Soal Remedial Berikutnya" : "Selesai Sesi Remedial"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* MODE 2: DASHBOARD ANTREAN REMEDIAL & BOOKMARKS                     */
          /* =================================================================== */
          <div className="space-y-space-lg">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-elevation-1 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
                    Total Soal Perlu Diulang
                  </span>
                  <p className="text-headline-md font-mono font-bold text-on-surface">
                    {remedialQueue.length} Butir
                  </p>
                  <span className="text-[11px] text-on-surface-variant">Dari Latihan &amp; Simulasi</span>
                </div>
              </div>

              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-elevation-1 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
                    Jadwal Ulang Hari Ini
                  </span>
                  <p className="text-headline-md font-mono font-bold text-amber-600">
                    {dueTodayCount} Soal
                  </p>
                  <span className="text-[11px] text-on-surface-variant">Berdasarkan Interval Spaced</span>
                </div>
              </div>

              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-elevation-1 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-success-container text-success flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-on-surface-variant font-semibold">
                    Sudah Dikuasai (Stage 4)
                  </span>
                  <p className="text-headline-md font-mono font-bold text-success">
                    {masteredCount} Soal
                  </p>
                  <span className="text-[11px] text-success">Retensi Memori Aman</span>
                </div>
              </div>
            </div>

            {/* Tab Nav: Bank Remedial vs Bookmarks */}
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("remedial")}
                  className={`px-4 py-2 rounded-xl font-bold text-body-sm transition-all flex items-center gap-2 ${
                    activeTab === "remedial"
                      ? "bg-primary text-on-primary shadow-elevation-1"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Antrean Remedial ({remedialQueue.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("bookmarks")}
                  className={`px-4 py-2 rounded-xl font-bold text-body-sm transition-all flex items-center gap-2 ${
                    activeTab === "bookmarks"
                      ? "bg-primary text-on-primary shadow-elevation-1"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Soal Tersimpan / Bookmarks ({bookmarks.length})</span>
                </button>
              </div>

              {activeTab === "remedial" && remedialQueue.length > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="text-on-surface-variant mr-1">Filter Stage:</span>
                  {(["all", 1, 2, 3, 4] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFilterStage(st)}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        filterStage === st
                          ? "bg-surface-container text-primary font-bold border-primary"
                          : "border-outline-variant text-on-surface-variant hover:border-primary/40"
                      }`}
                    >
                      {st === "all" ? "Semua" : `Stage ${st}`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* TAB 1: DAFTAR SOAL REMEDIAL */}
            {activeTab === "remedial" && (
              <div className="space-y-space-md">
                {filteredRemedial.length > 0 ? (
                  <div className="space-y-space-md">
                    {filteredRemedial.map((item) => {
                      const stageLabel =
                        item.stage === 1
                          ? "Stage 1 (Diulang Tiap 1 Hari)"
                          : item.stage === 2
                          ? "Stage 2 (Interval 3 Hari)"
                          : item.stage === 3
                          ? "Stage 3 (Interval 7 Hari)"
                          : "Stage 4 (Dikuasai Penuh)";

                      const isDue = item.nextReviewDate <= todayStr;

                      return (
                        <div
                          key={item.questionId}
                          className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant shadow-elevation-1 space-y-space-sm"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-outline-variant">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-mono font-bold bg-error-container text-error">
                                Salah {item.wrongCount}x
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-label-sm font-mono bg-surface-container text-on-surface-variant">
                                {stageLabel}
                              </span>
                              {isDue && (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
                                  ⏰ Siap Diulang Hari Ini
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => startRemedialPractice([item.question])}
                                className="px-3 py-1 rounded-lg bg-primary text-on-primary font-semibold text-body-xs hover:bg-primary-container shadow-elevation-1 transition-all flex items-center gap-1"
                              >
                                <span>Latih Soal Ini</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  removeRemedialQuestion(item.questionId);
                                  refreshData();
                                }}
                                title="Hapus dari antrean remedial"
                                className="p-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-error hover:border-error/40 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="text-body-md text-on-surface line-clamp-3">
                            <p className="font-semibold text-primary text-body-xs font-mono uppercase mb-1">
                              {item.question.topic} &bull; {item.question.difficulty}
                            </p>
                            {item.question.stem}
                          </div>

                          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                            <span>Ditambahkan: {new Date(item.addedAt).toLocaleDateString("id-ID")}</span>
                            <span>Review Berikutnya: {item.nextReviewDate}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-space-xl text-center bg-surface-container-lowest rounded-2xl border border-outline-variant p-space-lg space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-success-container text-success flex items-center justify-center mx-auto">
                      <Check className="w-7 h-7" />
                    </div>
                    <h3 className="text-title-lg font-bold text-on-surface">
                      Tidak Ada Soal yang Perlu Diulang!
                    </h3>
                    <p className="text-body-sm text-on-surface-variant max-w-md mx-auto">
                      Semua soal yang pernah kamu kerjakan sudah terjawab benar atau belum ada sesi latihan yang kamu selesaikan.
                    </p>
                    <Link
                      href="/practice"
                      className="inline-flex items-center gap-2 px-space-lg py-2.5 rounded-xl bg-primary text-on-primary font-bold text-body-sm hover:bg-primary-container shadow-elevation-1 transition-all"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Mulai Latihan Bebas</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DAFTAR SOAL BOOKMARKS */}
            {activeTab === "bookmarks" && (
              <div className="space-y-space-md">
                {bookmarks.length > 0 ? (
                  <div className="space-y-space-md">
                    {bookmarks.map((bm) => (
                      <div
                        key={bm.questionId}
                        className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant shadow-elevation-1 space-y-space-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-outline-variant">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-mono font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30 flex items-center gap-1">
                              <Bookmark className="w-3 h-3 fill-current" />
                              Tersimpan
                            </span>
                            <span className="text-[11px] font-mono text-on-surface-variant">
                              Disimpan pada {new Date(bm.savedAt).toLocaleDateString("id-ID")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startRemedialPractice([bm.question])}
                              className="px-3 py-1 rounded-lg bg-primary text-on-primary font-semibold text-body-xs hover:bg-primary-container shadow-elevation-1 transition-all flex items-center gap-1"
                            >
                              <span>Buka &amp; Latih</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                toggleBookmark(bm.question);
                                refreshData();
                              }}
                              title="Hapus bookmark"
                              className="p-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-error hover:border-error/40 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-body-md text-on-surface">
                          <p className="font-semibold text-primary text-body-xs font-mono uppercase mb-1">
                            {bm.question.topic} &bull; {bm.question.difficulty}
                          </p>
                          {bm.question.stem}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-space-xl text-center bg-surface-container-lowest rounded-2xl border border-outline-variant p-space-lg space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                      <Bookmark className="w-7 h-7" />
                    </div>
                    <h3 className="text-title-lg font-bold text-on-surface">
                      Belum Ada Soal yang Ditandai
                    </h3>
                    <p className="text-body-sm text-on-surface-variant max-w-md mx-auto">
                      Kamu bisa menandai soal-soal menarik atau menantang di menu Latihan Bebas maupun Pembahasan Tryout dengan menekan tombol bintang/tandai.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </Sidebar>
  );
}
