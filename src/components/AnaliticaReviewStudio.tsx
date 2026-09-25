"use client";

import React, { useState, useEffect, useRef } from "react";
import { Question, StudentAnswer } from "@/types";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Send,
  CheckCircle2,
  XCircle,
  Bookmark,
  Grid,
  Bot,
  User,
  Loader2,
  Lightbulb,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { isQuestionBookmarked, toggleBookmark } from "@/lib/storage";

interface AnaliticaReviewStudioProps {
  questions: Question[];
  answers: Record<string, StudentAnswer>;
  initialIndex?: number;
  packageTitle?: string;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function AnaliticaReviewStudio({
  questions,
  answers,
  initialIndex = 0,
  packageTitle = "Simulasi TKA PPLG",
  onClose,
}: AnaliticaReviewStudioProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [activeTab, setActiveTab] = useState<"observasi" | "konseptual" | "ai">("observasi");
  const [showRightPane, setShowRightPane] = useState(true);
  const [showGridModal, setShowGridModal] = useState(false);

  // Chat AI State per Question (stored in a dictionary keyed by question.id)
  const [questionChats, setQuestionChats] = useState<Record<string, ChatMessage[]>>({});
  const [inputMessage, setInputMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Bookmark toast
  const [bookmarked, setBookmarked] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const currentQ = questions[currentIndex];
  const currentAns = currentQ ? answers[currentQ.id] : null;
  const userSelected = currentAns?.selectedAnswers ?? [];
  const correctKeys = currentQ?.correctAnswer ?? [];

  // Hitung status benar / salah
  const isQuestionCorrect =
    userSelected.length === correctKeys.length &&
    userSelected.every((key) => correctKeys.includes(key));

  useEffect(() => {
    if (currentQ) {
      setBookmarked(isQuestionBookmarked(currentQ.id));
    }
  }, [currentIndex, currentQ]);

  useEffect(() => {
    // Auto scroll chat to bottom when messages update
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [questionChats, currentIndex, activeTab]);

  if (!currentQ) return null;

  const currentChatHistory = questionChats[currentQ.id] || [];

  // Toggle bookmark
  const handleToggleBookmark = () => {
    const nextSaved = toggleBookmark(currentQ);
    setBookmarked(nextSaved);
    setToastMsg(nextSaved ? "⭐ Soal disimpan ke Bookmark pribadi!" : "🗑️ Soal dihapus dari Bookmark");
    setTimeout(() => setToastMsg(null), 2000);
  };

  // Quick Chips
  const quickChips = [
    { label: "💡 Konsep Dasar", text: "Jelasin step-by-step konsep dasarnya dari awal ya!" },
    { label: "🔍 Mengapa Salah?", text: `Kenapa pilihan saya (Opsi ${userSelected.join(", ") || "kosong"}) keliru dan bukan jawaban yang benar?` },
    { label: "💻 Contoh Kode", text: "Beri contoh kode nyata atau studi kasus singkat untuk materi soal ini." },
    { label: "⚡ Trik Cepat", text: "Ada tips dan trik cepat mengenali jawaban soal model begini saat ujian TKA?" },
  ];

  // Send message to AI Tutor
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isAiLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedHistory = [...currentChatHistory, userMsg];
    setQuestionChats((prev) => ({
      ...prev,
      [currentQ.id]: updatedHistory,
    }));
    setInputMessage("");
    setIsAiLoading(true);

    // Otomatis buka tab AI jika belum aktif
    if (activeTab !== "ai") {
      setActiveTab("ai");
    }

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({ role: m.role, content: m.content })),
          context: {
            questionStem: currentQ.stem,
            topic: currentQ.topic,
            explanation: currentQ.explanation,
            options: currentQ.options,
            userAnswer: userSelected,
            correctAnswer: correctKeys,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.reply || "Maaf, saya tidak dapat merespons saat ini.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setQuestionChats((prev) => ({
          ...prev,
          [currentQ.id]: [...(prev[currentQ.id] || []), aiMsg],
        }));
      } else {
        const errMsg: ChatMessage = {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: "Maaf, terjadi kendala saat menghubungi AI Tutor. Silakan coba kembali sesaat lagi.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setQuestionChats((prev) => ({
          ...prev,
          [currentQ.id]: [...(prev[currentQ.id] || []), errMsg],
        }));
      }
    } catch {
      const errMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: "assistant",
        content: "Gagal terhubung ke layanan AI Tutor. Pastikan jaringan internet aktif.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setQuestionChats((prev) => ({
        ...prev,
        [currentQ.id]: [...(prev[currentQ.id] || []), errMsg],
      }));
    } finally {
      setIsAiLoading(false);
    }
  };

  // Render text with code blocks & markdown bold
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const code = hasLang ? lines.slice(1).join("\n") : lines.join("\n");

        return (
          <div
            key={index}
            className="my-space-sm p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant font-mono text-code-block text-on-surface overflow-x-auto shadow-elevation-1"
          >
            <code>{code}</code>
          </div>
        );
      }

      const formattedSubparts = part.split(/(\*\*.*?\*\*)/g).map((sub, sIndex) => {
        if (sub.startsWith("**") && sub.endsWith("**")) {
          return (
            <strong key={sIndex} className="font-semibold text-on-surface">
              {sub.slice(2, -2)}
            </strong>
          );
        }
        return sub;
      });

      return (
        <span key={index} className="whitespace-pre-line leading-relaxed">
          {formattedSubparts}
        </span>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col text-on-surface animate-fadeIn">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-surface-container-lowest border border-primary/30 text-on-surface shadow-elevation-3 font-mono text-body-xs animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Top Studio Header Bar */}
      <header className="h-14 border-b border-outline-variant bg-surface-container-lowest px-4 flex items-center justify-between shrink-0 shadow-elevation-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-1.5 font-semibold text-body-sm"
            title="Kembali ke Ringkasan"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <div className="h-5 w-px bg-outline-variant hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-title-sm text-on-surface truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {packageTitle}
              </span>
              <span className="hidden md:inline text-[11px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                Studio Pembahasan Soal
              </span>
            </div>
            <p className="text-[11px] font-mono text-on-surface-variant truncate">
              {currentQ.topic} &bull; Tingkat: {currentQ.difficulty.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-body-xs font-semibold ${
              bookmarked
                ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400"
                : "border-outline-variant hover:bg-surface-container text-on-surface-variant"
            }`}
            title={bookmarked ? "Hapus dari Bookmark" : "Simpan Soal ke Bookmark"}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
            <span className="hidden lg:inline">{bookmarked ? "Tersimpan" : "Tandai Soal"}</span>
          </button>

          {/* Toggle Pembahasan Pane on/off */}
          <button
            type="button"
            onClick={() => setShowRightPane(!showRightPane)}
            className={`px-3 py-1.5 rounded-xl border text-body-xs font-semibold transition-all flex items-center gap-1.5 ${
              showRightPane
                ? "bg-primary text-on-primary border-primary shadow-elevation-1"
                : "bg-surface-container border-outline-variant text-on-surface"
            }`}
            title="Buka / Tutup Panel Pembahasan"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Pembahasan</span>
          </button>
        </div>
      </header>

      {/* Studio Dual-Pane Main View */}
      <div className="flex-1 flex overflow-hidden">
        {/* ========================================================= */}
        {/* LEFT PANE: Lembar Soal & Pilihan Jawaban                  */}
        {/* ========================================================= */}
        <div
          className={`flex-1 flex flex-col justify-between overflow-y-auto p-4 sm:p-6 transition-all duration-300 ${
            showRightPane ? "lg:w-[52%] xl:w-[50%]" : "w-full max-w-4xl mx-auto"
          }`}
        >
          <div className="space-y-4 max-w-3xl mx-auto w-full">
            {/* Question Header Status */}
            <div className="flex items-center justify-between gap-2 border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-headline-sm font-bold text-primary">
                  Soal {currentIndex + 1}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                  {currentIndex + 1} dari {questions.length}
                </span>
              </div>

              {/* Benar / Salah Badge */}
              <div
                className={`px-3 py-1 rounded-full font-mono text-[11px] font-bold flex items-center gap-1.5 border ${
                  isQuestionCorrect
                    ? "bg-success-container text-on-success-container border-success/40"
                    : "bg-error-container text-on-error-container border-error/40"
                }`}
              >
                {isQuestionCorrect ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span>Jawaban Tepat</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-error" />
                    <span>Perlu Dipelajari</span>
                  </>
                )}
              </div>
            </div>

            {/* Question Stem */}
            <div className="text-body-lg text-on-surface leading-relaxed whitespace-pre-line py-1">
              {renderFormattedText(currentQ.stem)}
            </div>

            {/* Options List (Analitica Style Highlight) */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((option) => {
                const isChosen = userSelected.includes(option.key);
                const isCorrect = correctKeys.includes(option.key);

                // Option styling rules ala Analitica
                let cardStyle = "bg-surface-container-lowest border-outline-variant text-on-surface hover:border-primary/40";
                let badge = null;

                if (isChosen && isCorrect) {
                  // User chose correct
                  cardStyle = "bg-emerald-500/10 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-elevation-1";
                  badge = (
                    <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                      <Check className="w-3 h-3" /> Pilihan Anda (Benar)
                    </span>
                  );
                } else if (isChosen && !isCorrect) {
                  // User chose wrong
                  cardStyle = "bg-red-500/10 border-2 border-red-500 text-red-950 dark:text-red-100 shadow-elevation-1";
                  badge = (
                    <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-red-700 dark:text-red-400 bg-red-500/20 px-2 py-0.5 rounded">
                      <X className="w-3 h-3" /> Pilihan Anda (Salah)
                    </span>
                  );
                } else if (!isChosen && isCorrect) {
                  // Correct answer that was not chosen
                  cardStyle = "bg-emerald-500/5 border-2 border-dashed border-emerald-500 text-on-surface";
                  badge = (
                    <span className="flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                      <Check className="w-3 h-3" /> Kunci Jawaban
                    </span>
                  );
                }

                return (
                  <div
                    key={option.key}
                    className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${cardStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-label-md font-bold shrink-0 mt-0.5 ${
                        isChosen && isCorrect
                          ? "bg-emerald-600 text-white"
                          : isChosen && !isCorrect
                          ? "bg-red-600 text-white"
                          : isCorrect
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {option.key}
                    </span>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-body-md font-medium leading-relaxed">{option.text}</span>
                        {badge}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Left Toolbar: Pagination & Navigator */}
          <div className="pt-4 mt-6 border-t border-outline-variant flex items-center justify-between gap-2 max-w-3xl mx-auto w-full">
            {/* Quick Toggle Pembahasan Mobile */}
            <button
              type="button"
              onClick={() => setShowRightPane(!showRightPane)}
              className="lg:hidden px-3 py-2 rounded-xl border border-outline-variant text-body-xs font-semibold flex items-center gap-1.5 bg-surface-container-low"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pembahasan</span>
            </button>

            {/* Central Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="p-2 rounded-xl border border-outline-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Soal Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowGridModal(true)}
                className="px-3.5 py-1.5 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container font-mono text-body-sm font-semibold flex items-center gap-2 transition-all"
                title="Buka Daftar Semua Soal"
              >
                <Grid className="w-3.5 h-3.5 text-primary" />
                <span>
                  {currentIndex + 1} / {questions.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIndex === questions.length - 1}
                className="p-2 rounded-xl border border-outline-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Soal Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick indicator summary */}
            <div className="hidden sm:flex items-center gap-2 font-mono text-body-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {Object.values(answers).filter((a) => {
                  const q = questions.find((item) => item.id === a.questionId);
                  return q && q.correctAnswer.every((k) => a.selectedAnswers.includes(k));
                }).length}{" "}
                Benar
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANE: Panel Pembahasan & AI Tutor ala Analitica    */}
        {/* ========================================================= */}
        {showRightPane && (
          <aside className="w-full lg:w-[48%] xl:w-[50%] border-l border-outline-variant bg-surface-container-low flex flex-col justify-between overflow-hidden shadow-elevation-2 animate-fadeIn">
            {/* Pane Header with Filter / Tabs */}
            <div className="p-3 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-body-sm text-on-surface">Pembahasan Soal</span>
              </div>

              {/* Segmented View Mode Buttons */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container border border-outline-variant text-[11px] font-mono font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("observasi")}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === "observasi"
                      ? "bg-surface-container-lowest text-primary shadow-elevation-1 font-bold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span>🌺 Observasi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("konseptual")}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    activeTab === "konseptual"
                      ? "bg-surface-container-lowest text-primary shadow-elevation-1 font-bold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span>📐 Konseptual</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ai")}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 relative ${
                    activeTab === "ai"
                      ? "bg-primary text-on-primary shadow-elevation-1 font-bold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <Bot className="w-3 h-3" />
                  <span>Tanya AI</span>
                  {currentChatHistory.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1 right-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Tab 1: Observasi Analisis Opsi (Mirip Analitica) */}
              {activeTab === "observasi" && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-title-sm text-on-surface flex items-center gap-1.5">
                      <span>Analisis Jawaban</span>
                      <span className="text-sm">🧐</span>
                    </h4>
                    <span className="text-[11px] font-mono text-on-surface-variant">
                      Kunci: <strong>Opsi {correctKeys.join(", ")}</strong>
                    </span>
                  </div>

                  {/* Bedah Tiap Opsi */}
                  <div className="space-y-2.5">
                    {currentQ.options.map((opt) => {
                      const isKunci = correctKeys.includes(opt.key);
                      const isUser = userSelected.includes(opt.key);

                      return (
                        <div
                          key={opt.key}
                          className={`p-3 rounded-xl border text-body-xs leading-relaxed transition-all ${
                            isKunci
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-100"
                              : isUser
                              ? "bg-red-500/10 border-red-500/40 text-red-950 dark:text-red-100"
                              : "bg-surface-container-lowest border-outline-variant/60 text-on-surface"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold mb-1 font-mono">
                            {isKunci ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                            )}
                            <span>Opsi {opt.key}:</span>
                            {isKunci && (
                              <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold ml-1">
                                Kunci Benar
                              </span>
                            )}
                            {isUser && !isKunci && (
                              <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-red-500/20 text-red-700 dark:text-red-300 font-bold ml-1">
                                Jawaban Anda
                              </span>
                            )}
                          </div>
                          <p className="text-on-surface-variant pl-5">
                            {isKunci
                              ? `Tepat! Opsi ini merupakan solusi yang sesuai kaidah materi ${currentQ.topic}.`
                              : isUser
                              ? `Pilihan ini kurang tepat. Perhatikan batasan dan premis pada pokok soal.`
                              : `Pengecoh. Tidak sesuai dengan indikator pencapaian kompetensi pada soal.`}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Box Penjelasan Resmi */}
                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-elevation-1 space-y-2 mt-3">
                    <span className="font-mono text-[11px] font-bold uppercase text-primary tracking-wide block">
                      Rangkuman Penjelasan Resmi:
                    </span>
                    <div className="text-body-sm text-on-surface leading-relaxed">
                      {renderFormattedText(currentQ.explanation)}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Konseptual (Materi & Teori Mendalam) */}
              {activeTab === "konseptual" && (
                <div className="space-y-3.5 animate-fadeIn">
                  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-on-surface">
                    <span className="font-mono text-[11px] font-bold uppercase text-primary block mb-1">
                      Pilar Konsep Kemendikdasmen:
                    </span>
                    <h4 className="font-bold text-title-sm text-primary mb-1">{currentQ.topic}</h4>
                    <p className="text-body-xs text-on-surface-variant leading-relaxed">
                      Soal ini menguji pemahaman Anda pada sub-elemen kompetensi keahlian PPLG. Penguasaan konsep teoritis dan logika praktis dibutuhkan agar tidak terkecoh opsi jawaban serupa.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-elevation-1 space-y-2.5">
                    <h5 className="font-bold text-title-xs text-on-surface flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Penjelasan Mendalam:</span>
                    </h5>
                    <div className="text-body-sm text-on-surface leading-relaxed">
                      {renderFormattedText(currentQ.explanation)}
                    </div>
                  </div>

                  {/* CTA Tanya AI */}
                  <div className="p-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-center space-y-2">
                    <p className="text-body-xs text-on-surface-variant">
                      Masih ada istilah atau sintaks yang membingungkan dari penjelasan di atas?
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("ai")}
                      className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-body-xs hover:bg-primary-container shadow-elevation-1 transition-all inline-flex items-center gap-2"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Tanyakan Langsung ke AI Tutor</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Diskusi Interaktif Bersama AI Tutor */}
              {activeTab === "ai" && (
                <div className="space-y-3 animate-fadeIn">
                  {currentChatHistory.length === 0 ? (
                    <div className="py-6 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 shadow-elevation-1">
                        <Bot className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-title-sm text-on-surface">Tanya AI Soal Nomor {currentIndex + 1}</h4>
                      <p className="text-body-xs text-on-surface-variant max-w-xs mx-auto">
                        Tanyakan apa saja seputar soal ini. AI Tutor siap menjelaskan step-by-step dari konsep paling mendasar!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentChatHistory.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {msg.role === "assistant" && (
                            <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 mt-1 shadow-elevation-1">
                              <Bot className="w-4 h-4" />
                            </div>
                          )}

                          <div
                            className={`p-3 rounded-2xl max-w-[85%] text-body-xs leading-relaxed shadow-elevation-1 ${
                              msg.role === "user"
                                ? "bg-primary text-on-primary rounded-tr-sm"
                                : "bg-surface-container-lowest border border-outline-variant text-on-surface rounded-tl-sm"
                            }`}
                          >
                            <div>{renderFormattedText(msg.content)}</div>
                            <span
                              className={`block text-[10px] font-mono mt-1 text-right ${
                                msg.role === "user" ? "text-on-primary/70" : "text-on-surface-variant/70"
                              }`}
                            >
                              {msg.timestamp}
                            </span>
                          </div>

                          {msg.role === "user" && (
                            <div className="w-7 h-7 rounded-lg bg-surface-container text-on-surface flex items-center justify-center shrink-0 mt-1">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      ))}

                      {isAiLoading && (
                        <div className="flex gap-2.5 items-center text-body-xs text-on-surface-variant font-mono animate-pulse">
                          <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                          <span>AI Tutor sedang membedah soal...</span>
                        </div>
                      )}

                      <div ref={chatBottomRef} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Docked AI Input Bar (Mirip Analitica) */}
            <div className="p-3 border-t border-outline-variant bg-surface-container-lowest shrink-0 space-y-2">
              {/* Quick Prompt Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip.text)}
                    disabled={isAiLoading}
                    className="px-2.5 py-1 rounded-full border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary/40 text-on-surface-variant whitespace-nowrap transition-all shrink-0 active:scale-95 disabled:opacity-50"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Chat Input Field */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Jelasin step-by-step dari konsep dasar bgt caa..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/60 text-body-xs focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                  disabled={isAiLoading}
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isAiLoading}
                  className="p-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-elevation-1 shrink-0"
                  title="Kirim Pertanyaan"
                >
                  {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </div>
          </aside>
        )}
      </div>

      {/* Navigator Grid Modal (Quick Jump to any question) */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl border border-outline-variant p-5 shadow-elevation-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-title-md text-on-surface">Pilih Nomor Soal</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowGridModal(false)}
                className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface-variant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isCorrect =
                  ans &&
                  ans.selectedAnswers.length === q.correctAnswer.length &&
                  ans.selectedAnswers.every((k) => q.correctAnswer.includes(k));
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowGridModal(false);
                    }}
                    className={`h-11 rounded-xl font-mono text-label-md font-bold transition-all border flex flex-col items-center justify-center ${
                      isCurrent
                        ? "ring-2 ring-primary ring-offset-2 scale-105"
                        : "hover:scale-105"
                    } ${
                      isCorrect
                        ? "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                        : "bg-red-500/15 border-red-500 text-red-700 dark:text-red-300"
                    }`}
                  >
                    <span>{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-around pt-2 border-t border-outline-variant text-[11px] font-mono text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500" />
                <span>Benar</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-500/20 border border-red-500" />
                <span>Salah</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
