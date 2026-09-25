"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { QuestionCard } from "@/components/QuestionCard";
import { AIExplanationCard } from "@/components/AIExplanationCard";
import { evaluateAnswer } from "@/lib/irt";
import {
  updateTopicProgress,
  addQuestionToRemedial,
  isQuestionBookmarked,
  toggleBookmark,
  recordQuestionSpeed,
  touchLastActiveTime,
} from "@/lib/storage";
import { recordQuestionAnsweredToday } from "@/lib/targets";
import { Question, StudentAnswer, PPLGTopic } from "@/types";
import {
  OFFICIAL_CURRICULUM,
  SubElement,
  CurriculumElement,
} from "@/lib/curriculum";
import { getQuestionsForSubElement } from "@/lib/subElementQuestions";
import {
  Briefcase,
  ShieldCheck,
  Network,
  FileCode,
  Boxes,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Brain,
  ChevronRight,
  Layers,
  GraduationCap,
  Lightbulb,
  Code,
  HelpCircle,
  Flame,
  Clock,
} from "lucide-react";

const ELEMENT_ICONS: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Briefcase,
  2: ShieldCheck,
  3: Network,
  4: FileCode,
  5: Boxes,
};

export default function PracticePage() {
  const [selectedSubElement, setSelectedSubElement] = useState<SubElement | null>(null);
  const [activeTab, setActiveTab] = useState<"material" | "questions">("material");

  // Questions state for current sub-element
  const [subQuestions, setSubQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [scoreCount, setScoreCount] = useState({ correct: 0, total: 0 });

  // Adaptive Difficulty & Speed Tracking & Bookmark State
  const [adaptiveStreak, setAdaptiveStreak] = useState(0);
  const [adaptiveToast, setAdaptiveToast] = useState<string | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);

  // Handle choosing a sub-element
  const handleSelectSubElement = (sub: SubElement) => {
    setSelectedSubElement(sub);
    setActiveTab("material");

    // Load curated questions for this sub-element
    const questions = getQuestionsForSubElement(sub.id);
    setSubQuestions(questions);
    setCurrentQIndex(0);
    setSelectedAnswers([]);
    setHasCheckedAnswer(false);
    setIsAnswerCorrect(null);
    setScoreCount({ correct: 0, total: 0 });
  };

  // Back to catalog
  const handleBackToCatalog = () => {
    setSelectedSubElement(null);
    setSubQuestions([]);
    setSelectedAnswers([]);
    setHasCheckedAnswer(false);
  };

  // Handle answer selection
  const handleOptionToggle = (key: string) => {
    if (hasCheckedAnswer) return;
    const currentQ = subQuestions[currentQIndex];
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

  // Check answer
  const handleCheckAnswer = () => {
    const currentQ = subQuestions[currentQIndex];
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

    // 1. Catat Kecepatan Menjawab
    const elapsedSec = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    recordQuestionSpeed(currentQ.id, currentQ.topic, elapsedSec, isCorrect);
    recordQuestionAnsweredToday(1);
    touchLastActiveTime();

    setScoreCount((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    // 2. Adaptive Difficulty Feedback
    if (isCorrect) {
      const nextStreak = adaptiveStreak + 1;
      setAdaptiveStreak(nextStreak);
      if (nextStreak === 2 && currentQ.difficulty === "mudah") {
        setAdaptiveToast("🔥 Streak 2x Benar! Kesulitan otomatis naik ke level SEDANG.");
        setTimeout(() => setAdaptiveToast(null), 4000);
      } else if (nextStreak >= 3 && currentQ.difficulty === "sedang") {
        setAdaptiveToast("🚀 Luar biasa! Streak 3x Benar! Kamu siap untuk level SULIT.");
        setTimeout(() => setAdaptiveToast(null), 4000);
      }
    } else {
      setAdaptiveStreak(0);
      // 3. Masukkan ke Bank Remedial Spaced Repetition secara otomatis
      addQuestionToRemedial(currentQ, selectedAnswers);
    }

    // Update progress in local storage
    if (currentQ.topic) {
      updateTopicProgress(currentQ.topic as PPLGTopic, isCorrect);
    }
  };

  // Next question
  const handleNextQuestion = () => {
    if (currentQIndex < subQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswers([]);
      setHasCheckedAnswer(false);
      setIsAnswerCorrect(null);
      setQuestionStartTime(Date.now());
    }
  };

  // Toggle bookmark current question
  const handleToggleBookmarkCurrent = () => {
    const currentQ = subQuestions[currentQIndex];
    if (!currentQ) return;
    const isSaved = toggleBookmark(currentQ);
    setBookmarkToast(isSaved ? "⭐ Soal disimpan ke Bookmark pribadi!" : "🗑️ Soal dihapus dari Bookmark");
    setTimeout(() => setBookmarkToast(null), 2500);
  };

  // Ask AI about this sub-element concept
  const handleAskAIAboutMaterial = (sub: SubElement) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cendekia:ask-ai", {
          detail: {
            prompt: `Halo AI Tutor, tolong jelaskan materi resmi TKA PPLG untuk sub-elemen "${sub.name}" (${sub.elementName}).\n\nKompetensi yang diuji: ${sub.competency}\nBatasan: ${sub.scope}\n\nBisakah berikan penjelasan konsep praktis dan contoh penerapannya di industri?`,
          },
        })
      );
    }
  };

  const currentQ = subQuestions[currentQIndex];
  const isCurrentQBookmarked = currentQ ? isQuestionBookmarked(currentQ.id) : false;

  return (
    <Sidebar>
      <main className="max-w-5xl mx-auto px-margin py-space-lg w-full space-y-space-lg pb-36">
        {/* =================================================================== */}
        {/* STATE 1: KATALOG RESMI 5 ELEMEN & 14 SUB-ELEMEN                    */}
        {/* =================================================================== */}
        {!selectedSubElement && (
          <div className="space-y-space-lg animate-fadeIn">
            {/* Header Banner */}
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant shadow-elevation-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container border border-primary/20 text-label-sm font-mono mb-space-xs">
                <Sparkles className="w-3.5 h-3.5 text-tertiary" />
                <span>Kisi-kisi Resmi Kemendikdasmen &bull; Mapel PPLG</span>
              </div>
              <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-surface tracking-tight">
                Materi &amp; Latihan Sub-Elemen
              </h1>
              <p className="text-body-md text-on-surface-variant mt-1 max-w-3xl">
                Pilih sub-elemen kejuruan di bawah ini untuk mempelajari rangkuman materi resmi, penjelasan konsep kunci, serta latihan soal mandiri.
              </p>
            </div>

            {/* Elements & Sub-Elements List */}
            <div className="space-y-space-xl">
              {OFFICIAL_CURRICULUM.map((elem: CurriculumElement) => {
                const IconComponent = ELEMENT_ICONS[elem.id] || BookOpen;

                return (
                  <section
                    key={elem.id}
                    className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-space-md md:p-space-lg shadow-elevation-1 space-y-space-md"
                  >
                    {/* Element Title */}
                    <div className="flex items-start gap-space-sm border-b border-outline-variant/60 pb-space-sm">
                      <div className="w-10 h-10 rounded-xl bg-tertiary-container text-primary flex items-center justify-center font-bold text-title-md shrink-0 shadow-elevation-1">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-label-sm text-primary font-bold">
                            Elemen {elem.id}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                            {elem.subElements.length} Sub-Elemen
                          </span>
                        </div>
                        <h2 className="text-headline-sm font-bold text-on-surface tracking-tight mt-0.5">
                          {elem.name}
                        </h2>
                        <p className="text-body-sm text-on-surface-variant mt-0.5">
                          {elem.description}
                        </p>
                      </div>
                    </div>

                    {/* Sub-elements Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                      {elem.subElements.map((sub: SubElement) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSelectSubElement(sub)}
                          className="group p-space-md rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container-lowest hover:border-primary/40 hover:shadow-elevation-2 transition-all text-left flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-[11px] font-mono text-tertiary font-semibold uppercase tracking-wider">
                                Sub-Elemen
                              </span>
                              <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                              {sub.name}
                            </h3>
                            <p className="text-body-sm text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">
                              {sub.competency}
                            </p>
                          </div>

                          <div className="mt-space-md pt-space-xs border-t border-outline-variant/60 flex items-center justify-between text-label-sm font-mono text-on-surface-variant">
                            <span className="truncate max-w-[220px]">
                              {sub.scope.slice(0, 32)}...
                            </span>
                            <span className="text-primary font-semibold group-hover:underline">
                              Pelajari &rarr;
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STATE 2: DETAIL MATERI & KUIS SUB-ELEMEN TERPILIH                   */}
        {/* =================================================================== */}
        {selectedSubElement && (
          <div className="space-y-space-md animate-fadeIn">
            {/* Top Navigation Back Bar */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-lowest p-space-sm md:p-space-md rounded-xl border border-outline-variant shadow-elevation-1">
              <button
                type="button"
                onClick={handleBackToCatalog}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface text-body-sm font-semibold hover:bg-surface-container transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Pilih Sub-Elemen Lain</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAskAIAboutMaterial(selectedSubElement)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tertiary-container text-primary border border-primary/20 text-label-sm font-bold hover:bg-primary hover:text-on-primary shadow-elevation-1 transition-all"
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span>Tanya AI Materi Ini 💬</span>
                </button>
              </div>
            </div>

            {/* Sub-Element Header Information */}
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant shadow-elevation-1 space-y-space-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full font-mono text-label-sm bg-primary/10 text-primary font-bold">
                  Elemen {selectedSubElement.elementId}
                </span>
                <span className="text-body-sm text-on-surface-variant font-medium">
                  {selectedSubElement.elementName}
                </span>
              </div>

              <h1 className="text-headline-lg md:text-display-lg font-bold text-on-surface tracking-tight">
                {selectedSubElement.name}
              </h1>

              {/* Official Competency & Scope Callout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-space-xs">
                <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold flex items-center gap-1 mb-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Target Kompetensi Resmi
                  </span>
                  <p className="text-body-sm text-on-surface leading-relaxed">
                    {selectedSubElement.competency}
                  </p>
                </div>

                <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-secondary font-bold flex items-center gap-1 mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    Batasan &amp; Catatan Materi
                  </span>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    {selectedSubElement.scope}
                  </p>
                </div>
              </div>
            </div>

            {/* Mode Switcher Tabs: Rangkuman Materi vs Latihan Soal */}
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-surface-container border border-outline-variant text-body-md font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("material")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                  activeTab === "material"
                    ? "bg-surface-container-lowest text-primary shadow-elevation-1 font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>1. Rangkuman &amp; Penjelasan Materi</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("questions")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                  activeTab === "questions"
                    ? "bg-surface-container-lowest text-primary shadow-elevation-1 font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>2. Kuis &amp; Latihan Soal ({subQuestions.length} Soal)</span>
              </button>
            </div>

            {/* =============================================================== */}
            {/* TAB CONTENT A: RANGKUMAN MATERI                                 */}
            {/* =============================================================== */}
            {activeTab === "material" && (
              <div className="space-y-space-md animate-fadeIn">
                {/* Overview Card */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant shadow-elevation-1 space-y-space-sm">
                  <div className="flex items-center gap-2 text-primary font-bold font-mono text-label-md">
                    <Lightbulb className="w-4 h-4 text-tertiary" />
                    <span>Intisari Konsep</span>
                  </div>
                  <p className="text-body-lg text-on-surface leading-relaxed">
                    {selectedSubElement.summary.overview}
                  </p>
                </div>

                {/* Key Points */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant shadow-elevation-1 space-y-space-md">
                  <h3 className="text-title-md font-bold text-on-surface flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Poin-Poin Kunci yang Wajib Dipahami</span>
                  </h3>

                  <ul className="space-y-space-sm">
                    {selectedSubElement.summary.keyPoints.map((point, idx) => (
                      <li
                        key={idx}
                        className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant text-body-md text-on-surface leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: point.replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong class="font-semibold text-primary">$1</strong>'
                          ),
                        }}
                      />
                    ))}
                  </ul>
                </div>

                {/* Deep Dive & Analogy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant shadow-elevation-1 space-y-space-xs">
                    <span className="font-mono text-label-sm uppercase tracking-wider text-primary font-bold block">
                      💡 Pembahasan Mendalam (Deep Dive)
                    </span>
                    <p className="text-body-md text-on-surface-variant leading-relaxed">
                      {selectedSubElement.summary.deepDive}
                    </p>
                  </div>

                  {selectedSubElement.summary.realWorldAnalogy && (
                    <div className="bg-tertiary-container/50 p-space-md rounded-2xl border border-primary/20 shadow-elevation-1 space-y-space-xs">
                      <span className="font-mono text-label-sm uppercase tracking-wider text-tertiary font-bold block">
                        🚗 Analogi Dunia Nyata
                      </span>
                      <p className="text-body-md text-on-tertiary-container leading-relaxed">
                        {selectedSubElement.summary.realWorldAnalogy}
                      </p>
                    </div>
                  )}
                </div>

                {/* Code Example if present */}
                {selectedSubElement.summary.codeExample && (
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant shadow-elevation-1 space-y-space-xs">
                    <div className="flex items-center gap-2 text-on-surface font-mono text-label-md font-bold">
                      <Code className="w-4 h-4 text-primary" />
                      <span>Contoh Implementasi Kode Program</span>
                    </div>
                    <div className="p-space-md rounded-xl bg-on-surface text-outline-variant font-mono text-code-block overflow-x-auto shadow-elevation-1">
                      <code>{selectedSubElement.summary.codeExample}</code>
                    </div>
                  </div>
                )}

                {/* Action to switch to questions */}
                <div className="p-space-lg rounded-2xl bg-gradient-to-r from-tertiary-container to-surface-container-lowest border border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md shadow-elevation-1">
                  <div>
                    <h4 className="font-bold text-title-md text-on-surface">
                      Sudah memahami materi ini?
                    </h4>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">
                      Uji tingkat pemahamanmu dengan latihan soal mandiri berbobot TKA.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("questions")}
                    className="px-space-lg py-space-sm rounded-xl bg-primary text-on-primary font-bold text-body-md hover:bg-primary-container shadow-elevation-1 transition-all flex items-center gap-2 shrink-0"
                  >
                    <span>Mulai Latihan Soal ({subQuestions.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* TAB CONTENT B: KUIS & LATIHAN SOAL SUB-ELEMEN                    */}
            {/* =============================================================== */}
            {activeTab === "questions" && (
              <div className="space-y-space-md animate-fadeIn">
                {subQuestions.length > 0 && currentQ ? (
                  <div className="space-y-space-md">
                    {/* Adaptive Feedback & Bookmark Notifications */}
                    {adaptiveToast && (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-primary/20 border border-amber-500/40 text-on-surface font-semibold text-body-sm flex items-center gap-2.5 animate-fadeIn shadow-elevation-1">
                        <Flame className="w-5 h-5 text-amber-500 shrink-0 animate-bounce" />
                        <span>{adaptiveToast}</span>
                      </div>
                    )}

                    {bookmarkToast && (
                      <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant text-body-xs font-mono text-on-surface flex items-center gap-2 animate-fadeIn">
                        <span>{bookmarkToast}</span>
                      </div>
                    )}

                    {/* Progress indicator */}
                    <div className="flex items-center justify-between bg-surface-container-lowest px-space-md py-2.5 rounded-xl border border-outline-variant text-body-sm font-mono text-on-surface-variant flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span>
                          Soal <strong>{currentQIndex + 1}</strong> dari <strong>{subQuestions.length}</strong>
                        </span>
                        {adaptiveStreak > 0 && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                            <Flame className="w-3.5 h-3.5 fill-current" />
                            {adaptiveStreak}x Beruntun
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[12px] text-secondary">
                          <Clock className="w-3.5 h-3.5" />
                          Kecepatan Terpantau
                        </span>
                        <span>
                          Skor: <strong>{scoreCount.correct}</strong> / {scoreCount.total} Benar
                        </span>
                      </div>
                    </div>

                    {/* Question Card */}
                    <QuestionCard
                      question={currentQ}
                      questionNumber={currentQIndex + 1}
                      totalQuestions={subQuestions.length}
                      selectedAnswers={selectedAnswers}
                      isReviewMode={hasCheckedAnswer}
                      onSelectOption={handleOptionToggle}
                      isBookmarked={isCurrentQBookmarked}
                      onToggleBookmark={handleToggleBookmarkCurrent}
                    />

                    {/* Bottom Action Bar / Controls */}
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant shadow-elevation-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-md">
                      <div className="flex items-center gap-space-sm">
                        {currentQIndex > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentQIndex((prev) => prev - 1);
                              setSelectedAnswers([]);
                              setHasCheckedAnswer(false);
                              setIsAnswerCorrect(null);
                            }}
                            className="px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-body-sm font-semibold hover:bg-surface-container transition-all flex items-center gap-1.5"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Sebelumnya</span>
                          </button>
                        )}

                        {!hasCheckedAnswer ? (
                          <button
                            type="button"
                            onClick={handleCheckAnswer}
                            disabled={selectedAnswers.length === 0}
                            className={`px-space-xl py-2.5 rounded-xl font-bold text-body-sm transition-all flex items-center gap-2 ${
                              selectedAnswers.length > 0
                                ? "bg-primary text-on-primary hover:bg-primary-container shadow-elevation-2"
                                : "bg-surface-container text-on-surface-variant/40 border border-outline-variant cursor-not-allowed"
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Cek Jawaban</span>
                          </button>
                        ) : (
                          <>
                            {currentQIndex < subQuestions.length - 1 ? (
                              <button
                                type="button"
                                onClick={handleNextQuestion}
                                className="px-space-xl py-2.5 rounded-xl bg-success text-on-success font-bold text-body-sm hover:bg-emerald-600 shadow-elevation-2 transition-all flex items-center gap-2"
                              >
                                <span>Soal Berikutnya</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentQIndex(0);
                                  setSelectedAnswers([]);
                                  setHasCheckedAnswer(false);
                                  setIsAnswerCorrect(null);
                                }}
                                className="px-space-xl py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-body-sm hover:bg-secondary-container transition-all flex items-center gap-2"
                              >
                                <RefreshCw className="w-4 h-4" />
                                <span>Ulangi Latihan</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      {/* Status / Feedback Indicator */}
                      <div className="text-body-xs font-mono text-on-surface-variant sm:text-right pr-0 sm:pr-4">
                        {!hasCheckedAnswer ? (
                          selectedAnswers.length === 0 ? (
                            <span className="text-on-surface-variant/70 italic">
                              💡 Pilih salah satu opsi di atas untuk mengaktifkan tombol Cek Jawaban
                            </span>
                          ) : (
                            <span className="text-primary font-semibold">
                              ✓ Opsi {selectedAnswers.join(", ")} terpilih &bull; Klik Cek Jawaban
                            </span>
                          )
                        ) : (
                          <span className="text-success font-semibold">
                            {isAnswerCorrect ? "Jawaban Anda Benar!" : "Jawaban Kurang Tepat — Baca Pembahasan di Bawah"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AI Explanation Card Reveal (with In-Question AI Chat) */}
                    {hasCheckedAnswer && (
                      <AIExplanationCard
                        question={currentQ}
                        userAnswer={selectedAnswers}
                        explanation={currentQ.explanation}
                        correctAnswerText={currentQ.options
                          .filter((o) => currentQ.correctAnswer.includes(o.key))
                          .map((o) => `${o.key}. ${o.text}`)
                          .join("; ")}
                        isCorrect={isAnswerCorrect ?? false}
                        onNext={currentQIndex < subQuestions.length - 1 ? handleNextQuestion : undefined}
                        nextLabel="Lanjut ke Soal Berikutnya"
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-surface-container-lowest p-space-xl rounded-2xl border border-outline-variant text-center space-y-space-md">
                    <p className="text-body-md text-on-surface-variant">
                      Belum ada soal untuk sub-elemen ini. Silakan baca rangkuman materi terlebih dahulu.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("material")}
                      className="px-space-lg py-space-sm rounded-xl bg-primary text-on-primary font-bold text-body-sm"
                    >
                      Buka Rangkuman Materi
                    </button>
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
