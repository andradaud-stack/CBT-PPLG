"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { QuestionCard } from "@/components/QuestionCard";
import { AIExplanationCard } from "@/components/AIExplanationCard";
import { evaluateAnswer } from "@/lib/irt";
import {
  updateTopicProgress,
  getTopicProgress,
  addQuestionToRemedial,
  isQuestionBookmarked,
  toggleBookmark,
  recordQuestionSpeed,
  touchLastActiveTime,
} from "@/lib/storage";
import { recordQuestionAnsweredToday } from "@/lib/targets";
import { Question, StudentAnswer, PPLGTopic, TopicProgress } from "@/types";
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
  Layers,
  GraduationCap,
  Lightbulb,
  Code,
  HelpCircle,
  Flame,
  Clock,
  Minus,
  Plus,
  X,
  Check,
  Play,
  RotateCcw,
  Award,
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

  // Bottom Sheet Practice Configuration Modal State
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configuringSubElement, setConfiguringSubElement] = useState<SubElement | null>(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [isInstantCorrection, setIsInstantCorrection] = useState(true);
  const [useAIGenerator, setUseAIGenerator] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Non-instant correction mode state (simulasi latihan)
  const [examAnswers, setExamAnswers] = useState<Record<number, string[]>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);

  // Topic mastery progress cache from storage
  const [topicProgressMap, setTopicProgressMap] = useState<Record<string, TopicProgress>>({});

  // Load mastery progress from storage
  const loadMasteryProgress = useCallback(() => {
    try {
      const list = getTopicProgress();
      const map: Record<string, TopicProgress> = {};
      for (const item of list) {
        map[item.topic.toLowerCase().trim()] = item;
      }
      setTopicProgressMap(map);
    } catch (err) {
      console.error("Error loading topic progress:", err);
    }
  }, []);

  // Handle URL Query Params & initial load
  useEffect(() => {
    loadMasteryProgress();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const subParam = params.get("subElement") || params.get("subId");
      if (subParam) {
        const decoded = decodeURIComponent(subParam).toLowerCase().trim();
        for (const elem of OFFICIAL_CURRICULUM) {
          const found = elem.subElements.find(
            (s) =>
              s.id.toLowerCase() === decoded ||
              s.name.toLowerCase() === decoded ||
              s.name.toLowerCase().includes(decoded) ||
              decoded.includes(s.name.toLowerCase())
          );
          if (found) {
            setSelectedSubElement(found);
            setConfiguringSubElement(found);
            setIsConfigModalOpen(true);
            break;
          }
        }
      }
    }
  }, [loadMasteryProgress]);

  // Timer Countdown Effect
  useEffect(() => {
    if (
      !isTimerActive ||
      timerSecondsLeft === null ||
      activeTab !== "questions" ||
      isExamSubmitted ||
      (isInstantCorrection && hasCheckedAnswer)
    ) {
      return;
    }

    if (timerSecondsLeft <= 0) {
      if (isInstantCorrection) {
        handleCheckAnswer();
      } else {
        handleSaveAndNextExam();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimerSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [
    isTimerActive,
    timerSecondsLeft,
    activeTab,
    isExamSubmitted,
    isInstantCorrection,
    hasCheckedAnswer,
  ]);

  // Get progress for a sub-element
  const getSubElementProgress = (subName: string, elemName: string): TopicProgress => {
    const keySub = subName.toLowerCase().trim();
    if (topicProgressMap[keySub]) return topicProgressMap[keySub];

    const keyElem = elemName.toLowerCase().trim();
    if (topicProgressMap[keyElem]) return topicProgressMap[keyElem];

    for (const [k, val] of Object.entries(topicProgressMap)) {
      if (keySub.includes(k) || k.includes(keySub)) {
        return val;
      }
    }

    return {
      topic: subName as PPLGTopic,
      totalAnswered: 0,
      totalCorrect: 0,
      accuracy: 0,
      masteryLevel: "Belum Dicoba",
    };
  };

  // Open configuration modal for a sub-element
  const handleOpenPracticeConfig = (sub: SubElement) => {
    setConfiguringSubElement(sub);
    setIsConfigModalOpen(true);
  };

  // Start practice from modal configuration
  const handleStartPractice = async () => {
    if (!configuringSubElement) return;
    const sub = configuringSubElement;
    setSelectedSubElement(sub);
    setIsConfigModalOpen(false);
    setActiveTab("questions");
    setCurrentQIndex(0);
    setSelectedAnswers([]);
    setHasCheckedAnswer(false);
    setIsAnswerCorrect(null);
    setScoreCount({ correct: 0, total: 0 });
    setExamAnswers({});
    setIsExamSubmitted(false);
    setQuestionStartTime(Date.now());

    if (isTimerActive) {
      setTimerSecondsLeft(60);
    } else {
      setTimerSecondsLeft(null);
    }

    // Generate or fetch questions
    if (useAIGenerator) {
      setIsGeneratingAI(true);
      try {
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "practice",
            subElementId: sub.id,
            subElementName: sub.name,
            count: questionCount,
          }),
        });
        const data = await res.json();
        if (data.success && data.questions && data.questions.length > 0) {
          setSubQuestions(data.questions);
          setIsGeneratingAI(false);
          return;
        }
      } catch (err) {
        console.warn("AI Question Generation error, falling back to curated bank:", err);
      }
      setIsGeneratingAI(false);
    }

    // Curated bank fallback
    const curated = getQuestionsForSubElement(sub.id);
    if (curated && curated.length > 0) {
      const list: Question[] = [];
      for (let i = 0; i < questionCount; i++) {
        const base = curated[i % curated.length];
        list.push({
          ...base,
          id: `${base.id}-${i}-${Date.now().toString(36)}`,
        });
      }
      setSubQuestions(list);
    } else {
      setSubQuestions([]);
    }
  };

  // Handle choosing a sub-element from catalog (Direct reading of theory)
  const handleSelectSubElementTheory = (sub: SubElement) => {
    setSelectedSubElement(sub);
    setActiveTab("material");
    const questions = getQuestionsForSubElement(sub.id);
    setSubQuestions(questions);
    setCurrentQIndex(0);
    setSelectedAnswers([]);
    setHasCheckedAnswer(false);
    setIsAnswerCorrect(null);
    setScoreCount({ correct: 0, total: 0 });
    setIsExamSubmitted(false);
  };

  // Back to catalog
  const handleBackToCatalog = () => {
    setSelectedSubElement(null);
    setSubQuestions([]);
    setSelectedAnswers([]);
    setHasCheckedAnswer(false);
    setIsExamSubmitted(false);
    loadMasteryProgress();
  };

  // Handle answer selection
  const handleOptionToggle = (key: string) => {
    if (hasCheckedAnswer && isInstantCorrection) return;
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

  // Check answer in Instant Correction mode
  const handleCheckAnswer = () => {
    const currentQ = subQuestions[currentQIndex];
    if (!currentQ) return;

    const studentAnswer: StudentAnswer = {
      questionId: currentQ.id,
      selectedAnswers,
      isFlagged: false,
      isAnswered: selectedAnswers.length > 0,
    };

    const isCorrect = evaluateAnswer(currentQ, studentAnswer);
    setIsAnswerCorrect(isCorrect);
    setHasCheckedAnswer(true);

    const elapsedSec = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    recordQuestionSpeed(currentQ.id, currentQ.topic, elapsedSec, isCorrect);
    recordQuestionAnsweredToday(1);
    touchLastActiveTime();

    setScoreCount((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

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
      addQuestionToRemedial(currentQ, selectedAnswers);
    }

    if (selectedSubElement) {
      updateTopicProgress(selectedSubElement.name, isCorrect);
    } else if (currentQ.topic) {
      updateTopicProgress(currentQ.topic as PPLGTopic, isCorrect);
    }
    loadMasteryProgress();
  };

  // Save answer and move to next in Non-Instant mode
  const handleSaveAndNextExam = () => {
    const currentQ = subQuestions[currentQIndex];
    if (!currentQ) return;

    const newAnswers = { ...examAnswers, [currentQIndex]: selectedAnswers };
    setExamAnswers(newAnswers);

    if (currentQIndex < subQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswers(newAnswers[currentQIndex + 1] || []);
      setQuestionStartTime(Date.now());
      if (isTimerActive) setTimerSecondsLeft(60);
    } else {
      let correct = 0;
      subQuestions.forEach((q, idx) => {
        const ans = newAnswers[idx] || [];
        const isCorr = evaluateAnswer(q, {
          questionId: q.id,
          selectedAnswers: ans,
          isFlagged: false,
          isAnswered: ans.length > 0,
        });
        if (isCorr) correct++;
        if (selectedSubElement) {
          updateTopicProgress(selectedSubElement.name, isCorr);
        }
      });
      setScoreCount({ correct, total: subQuestions.length });
      recordQuestionAnsweredToday(subQuestions.length);
      setIsExamSubmitted(true);
      loadMasteryProgress();
    }
  };

  // Next question in Instant Correction mode
  const handleNextQuestion = () => {
    if (currentQIndex < subQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswers([]);
      setHasCheckedAnswer(false);
      setIsAnswerCorrect(null);
      setQuestionStartTime(Date.now());
      if (isTimerActive) setTimerSecondsLeft(60);
    }
  };

  // Toggle bookmark current question
  const handleToggleBookmarkCurrent = () => {
    const currentQ = subQuestions[currentQIndex];
    if (!currentQ) return;
    const isSaved = toggleBookmark(currentQ);
    setBookmarkToast(
      isSaved ? "⭐ Soal disimpan ke Bookmark pribadi!" : "🗑️ Soal dihapus dari Bookmark"
    );
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                      {elem.subElements.map((sub: SubElement, subIdx: number) => {
                        const prog = getSubElementProgress(sub.name, sub.elementName);
                        const isMastered = prog.masteryLevel === "Dikuasai";
                        const isNotAttempted = prog.totalAnswered === 0;

                        return (
                          <div
                            key={sub.id}
                            className="p-space-md rounded-2xl border border-outline-variant bg-surface-container-low hover:bg-surface-container-lowest hover:border-primary/40 hover:shadow-elevation-2 transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[11px] font-mono text-tertiary font-bold uppercase tracking-wider bg-tertiary-container/40 px-2 py-0.5 rounded-md">
                                  Sub-Elemen {elem.id}.{subIdx + 1}
                                </span>
                                <div className="flex items-center gap-1.5 font-mono text-[12px] font-bold text-primary">
                                  <span>{prog.accuracy}%</span>
                                  <span className="text-on-surface-variant font-normal text-[11px]">
                                    ({prog.totalCorrect}/{prog.totalAnswered})
                                  </span>
                                </div>
                              </div>

                              <h3 className="text-title-md font-bold text-on-surface hover:text-primary transition-colors">
                                {sub.name}
                              </h3>
                              <p className="text-body-sm text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">
                                {sub.competency}
                              </p>

                              {/* Progress Track */}
                              <div className="mt-3 space-y-1">
                                <div className="h-2 w-full rounded-full bg-outline-variant/60 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      isNotAttempted
                                        ? "bg-transparent"
                                        : isMastered
                                        ? "bg-success"
                                        : "bg-[#e91e63]"
                                    }`}
                                    style={{
                                      width: `${isNotAttempted ? 0 : Math.max(6, prog.accuracy)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons: Baca Teori vs Latihan Soal */}
                            <div className="mt-space-md pt-space-xs border-t border-outline-variant/60 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => handleSelectSubElementTheory(sub)}
                                className="px-3 py-1.5 rounded-xl border border-outline-variant bg-surface-container hover:bg-surface-container-high text-on-surface text-body-xs font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-primary" />
                                <span>Baca Teori</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenPracticeConfig(sub)}
                                className="px-3.5 py-1.5 rounded-xl bg-[#e91e63] hover:bg-[#d81557] text-white text-body-xs font-bold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Latihan Soal</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
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
                  onClick={() => handleOpenPracticeConfig(selectedSubElement)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e91e63] hover:bg-[#d81557] text-white text-label-sm font-bold shadow-elevation-1 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Atur Latihan Soal</span>
                </button>

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
                      Uji tingkat pemahamanmu dengan latihan soal mandiri berbobot TKA atau racik soal baru dengan AI.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenPracticeConfig(selectedSubElement)}
                    className="px-space-lg py-space-sm rounded-xl bg-[#e91e63] hover:bg-[#d81557] text-white font-bold text-body-md shadow-elevation-1 transition-all flex items-center gap-2 shrink-0"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Atur &amp; Mulai Latihan Soal</span>
                  </button>
                </div>
              </div>
            )}

            {/* =============================================================== */}
            {/* TAB CONTENT B: KUIS & LATIHAN SOAL SUB-ELEMEN                    */}
            {/* =============================================================== */}
            {activeTab === "questions" && (
              <div className="space-y-space-md animate-fadeIn">
                {/* Result screen for Non-Instant mode */}
                {isExamSubmitted ? (
                  <div className="bg-surface-container-lowest p-space-xl rounded-2xl border border-outline-variant shadow-elevation-2 text-center space-y-space-md animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-success-container text-on-success-container mx-auto flex items-center justify-center">
                      <Award className="w-8 h-8 text-success" />
                    </div>
                    <div>
                      <h2 className="text-headline-md font-bold text-on-surface">
                        Latihan Selesai!
                      </h2>
                      <p className="text-body-md text-on-surface-variant mt-1">
                        Sub-Elemen: {selectedSubElement.name}
                      </p>
                    </div>

                    <div className="max-w-xs mx-auto p-4 rounded-xl bg-surface-container border border-outline-variant">
                      <span className="text-[12px] font-mono text-on-surface-variant block">
                        Skor Akurasi
                      </span>
                      <span className="text-display-md font-mono font-bold text-primary">
                        {Math.round((scoreCount.correct / Math.max(1, scoreCount.total)) * 100)}%
                      </span>
                      <span className="text-body-sm text-on-surface-variant block mt-1">
                        {scoreCount.correct} dari {scoreCount.total} soal benar
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleOpenPracticeConfig(selectedSubElement)}
                        className="px-5 py-2.5 rounded-xl bg-[#e91e63] text-white font-bold text-body-sm hover:bg-[#d81557] transition-all flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Latihan Lagi</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleBackToCatalog}
                        className="px-5 py-2.5 rounded-xl border border-outline-variant bg-surface-container text-on-surface font-semibold text-body-sm hover:bg-surface-container-high transition-all"
                      >
                        Kembali ke Katalog
                      </button>
                    </div>
                  </div>
                ) : subQuestions.length > 0 && currentQ ? (
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

                    {/* Progress & Timer Bar */}
                    <div className="flex items-center justify-between bg-surface-container-lowest px-space-md py-2.5 rounded-xl border border-outline-variant text-body-sm font-mono text-on-surface-variant flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span>
                          Soal <strong>{currentQIndex + 1}</strong> dari <strong>{subQuestions.length}</strong>
                        </span>
                        {adaptiveStreak > 0 && isInstantCorrection && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                            <Flame className="w-3.5 h-3.5 fill-current" />
                            {adaptiveStreak}x Beruntun
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {isTimerActive && timerSecondsLeft !== null && (
                          <span
                            className={`flex items-center gap-1 text-[12px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                              timerSecondsLeft <= 10
                                ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse"
                                : "bg-primary/10 border-primary/30 text-primary"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>00:{timerSecondsLeft.toString().padStart(2, "0")}</span>
                          </span>
                        )}

                        {isInstantCorrection && (
                          <span>
                            Skor: <strong>{scoreCount.correct}</strong> / {scoreCount.total} Benar
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Card */}
                    <QuestionCard
                      question={currentQ}
                      questionNumber={currentQIndex + 1}
                      totalQuestions={subQuestions.length}
                      selectedAnswers={selectedAnswers}
                      isReviewMode={isInstantCorrection ? hasCheckedAnswer : false}
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
                              setSelectedAnswers(examAnswers[currentQIndex - 1] || []);
                              setHasCheckedAnswer(false);
                              setIsAnswerCorrect(null);
                            }}
                            className="px-space-md py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-body-sm font-semibold hover:bg-surface-container transition-all flex items-center gap-1.5"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Sebelumnya</span>
                          </button>
                        )}

                        {/* Instant Correction Mode Buttons */}
                        {isInstantCorrection ? (
                          !hasCheckedAnswer ? (
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
                                  onClick={() => handleOpenPracticeConfig(selectedSubElement)}
                                  className="px-space-xl py-2.5 rounded-xl bg-secondary text-on-secondary font-bold text-body-sm hover:bg-secondary-container transition-all flex items-center gap-2"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                  <span>Ulangi / Atur Soal</span>
                                </button>
                              )}
                            </>
                          )
                        ) : (
                          /* Non-Instant Mode: Simpan & Lanjut */
                          <button
                            type="button"
                            onClick={handleSaveAndNextExam}
                            disabled={selectedAnswers.length === 0}
                            className={`px-space-xl py-2.5 rounded-xl font-bold text-body-sm transition-all flex items-center gap-2 ${
                              selectedAnswers.length > 0
                                ? "bg-[#e91e63] hover:bg-[#d81557] text-white shadow-elevation-2"
                                : "bg-surface-container text-on-surface-variant/40 border border-outline-variant cursor-not-allowed"
                            }`}
                          >
                            <span>
                              {currentQIndex === subQuestions.length - 1
                                ? "Selesai & Kumpulkan"
                                : "Simpan & Lanjut"}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Status / Feedback Indicator */}
                      <div className="text-body-xs font-mono text-on-surface-variant sm:text-right pr-0 sm:pr-4">
                        {isInstantCorrection ? (
                          !hasCheckedAnswer ? (
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
                              {isAnswerCorrect
                                ? "Jawaban Anda Benar!"
                                : "Jawaban Kurang Tepat — Baca Pembahasan di Bawah"}
                            </span>
                          )
                        ) : (
                          <span className="text-on-surface-variant">
                            Mode Ujian &bull; Koreksi ditampilkan di akhir sesi
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AI Explanation Card Reveal (with In-Question AI Chat) */}
                    {isInstantCorrection && hasCheckedAnswer && (
                      <AIExplanationCard
                        question={currentQ}
                        userAnswer={selectedAnswers}
                        explanation={currentQ.explanation}
                        correctAnswerText={currentQ.options
                          .filter((o) => currentQ.correctAnswer.includes(o.key))
                          .map((o) => `${o.key}. ${o.text}`)
                          .join("; ")}
                        isCorrect={isAnswerCorrect ?? false}
                        onNext={
                          currentQIndex < subQuestions.length - 1
                            ? handleNextQuestion
                            : undefined
                        }
                        nextLabel="Lanjut ke Soal Berikutnya"
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-surface-container-lowest p-space-xl rounded-2xl border border-outline-variant text-center space-y-space-md">
                    <p className="text-body-md text-on-surface-variant">
                      Belum ada soal untuk sub-elemen ini. Silakan buat soal dengan AI atau baca rangkuman materi terlebih dahulu.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenPracticeConfig(selectedSubElement)}
                        className="px-space-lg py-space-sm rounded-xl bg-[#e91e63] text-white font-bold text-body-sm shadow-elevation-1"
                      >
                        ✨ Buat Soal AI
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("material")}
                        className="px-space-lg py-space-sm rounded-xl border border-outline-variant bg-surface-container text-on-surface font-semibold text-body-sm"
                      >
                        Buka Rangkuman Materi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* MODAL BOTTOM SHEET: "ATUR LATIHAN SOAL"                            */}
        {/* =================================================================== */}
        {isConfigModalOpen && configuringSubElement && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
            {/* Backdrop click */}
            <div
              className="absolute inset-0"
              onClick={() => setIsConfigModalOpen(false)}
            />

            {/* Bottom Sheet Card */}
            <div className="relative w-full sm:max-w-md bg-surface-container-lowest rounded-t-[28px] sm:rounded-3xl border border-outline-variant shadow-elevation-4 overflow-hidden z-10 animate-slideUp">
              {/* Mobile Top Drag Indicator */}
              <div className="w-12 h-1.5 bg-outline-variant/80 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-outline-variant/40 relative">
                <div className="w-full text-center">
                  <h3 className="text-title-lg font-bold text-on-surface">
                    Atur Latihan Soal
                  </h3>
                  <p className="text-body-xs text-on-surface-variant truncate max-w-[260px] mx-auto mt-0.5">
                    {configuringSubElement.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Options */}
              <div className="p-6 space-y-4">
                {/* Row 1: Jumlah Soal */}
                <div className="p-4 rounded-2xl border border-outline-variant/80 bg-surface-container-lowest flex items-center justify-between shadow-sm">
                  <span className="font-semibold text-body-md text-on-surface">
                    Jumlah Soal
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuestionCount((prev) => Math.max(1, prev - 1))}
                      disabled={questionCount <= 1}
                      className="w-9 h-9 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono font-bold text-title-md text-on-surface min-w-[24px] text-center">
                      {questionCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuestionCount((prev) => Math.min(20, prev + 1))}
                      disabled={questionCount >= 20}
                      className="w-9 h-9 rounded-full border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Row 2: Aktifkan timer */}
                <div className="p-4 rounded-2xl border border-outline-variant/80 bg-surface-container-lowest flex items-center justify-between shadow-sm">
                  <div>
                    <span className="font-semibold text-body-md text-on-surface block">
                      Aktifkan timer
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      60 detik per butir soal
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTimerActive(!isTimerActive)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                      isTimerActive ? "bg-primary" : "bg-outline-variant/70"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        isTimerActive ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Row 3: Tampilkan Koreksi Instan */}
                <div className="p-4 rounded-2xl border border-outline-variant/80 bg-surface-container-lowest flex items-center justify-between shadow-sm">
                  <div>
                    <span className="font-semibold text-body-md text-on-surface block">
                      Tampilkan Koreksi Instan
                    </span>
                    <span className="text-[12px] text-on-surface-variant">
                      Lihat benar/salah setiap selesai menjawab
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsInstantCorrection(!isInstantCorrection)}
                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                      isInstantCorrection
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-outline-variant bg-transparent text-transparent"
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

                {/* Row 4: Mode Soal Baru AI Generator */}
                <div className="p-4 rounded-2xl border border-primary/30 bg-primary/5 flex items-center justify-between shadow-sm">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#e91e63]" />
                      <span className="font-semibold text-body-md text-on-surface">
                        Racik Soal Baru dengan AI
                      </span>
                    </div>
                    <span className="text-[12px] text-on-surface-variant">
                      Generate butir soal HOTS baru via Cendekia AI
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseAIGenerator(!useAIGenerator)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                      useAIGenerator ? "bg-[#e91e63]" : "bg-outline-variant/70"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        useAIGenerator ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Bottom Pink Button: Mulai */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStartPractice}
                    disabled={isGeneratingAI}
                    className="w-full py-4 px-6 rounded-2xl bg-[#e91e63] hover:bg-[#d81557] active:scale-[0.98] text-white font-bold text-body-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isGeneratingAI ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Meracik Soal AI...</span>
                      </>
                    ) : (
                      <span>Mulai</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </Sidebar>
  );
}
