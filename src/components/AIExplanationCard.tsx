"use client";

import React, { useState } from "react";
import {
  Brain,
  CheckCircle2,
  ArrowRight,
  Bot,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AIIdentifierChip } from "./AIIdentifierChip";
import { Question } from "@/types";

interface AIExplanationCardProps {
  explanation: string;
  correctAnswerText?: string;
  isCorrect?: boolean;
  onNext?: () => void;
  nextLabel?: string;
  question?: Question;
  userAnswer?: string[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AIExplanationCard({
  explanation,
  correctAnswerText,
  isCorrect,
  onNext,
  nextLabel,
  question,
  userAnswer,
}: AIExplanationCardProps) {
  const [showInlineChat, setShowInlineChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Quick Chips
  const quickChips = [
    "Jelasin step-by-step konsep dasarnya",
    "Kenapa pilihan saya keliru?",
    "Beri contoh kode program nyata",
  ];

  const handleSendQuery = async (customText?: string) => {
    const textToSend = (customText || query).trim();
    if (!textToSend || isLoading) return;

    const newMessages: ChatMessage[] = [
      ...chatMessages,
      { role: "user", content: textToSend },
    ];
    setChatMessages(newMessages);
    setQuery("");
    setIsLoading(true);
    setShowInlineChat(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          context: {
            questionStem: question?.stem,
            topic: question?.topic,
            explanation: explanation,
            options: question?.options,
            userAnswer: userAnswer,
            correctAnswer: question?.correctAnswer,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply || "Maaf, respon tidak dapat diproses." },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Maaf, terjadi kendala koneksi AI Tutor." },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Gagal terhubung ke AI Tutor." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse code blocks in markdown if present
  const renderFormattedExplanation = (text: string) => {
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
            className="my-space-sm p-space-md rounded-lg bg-surface-container-lowest border border-outline-variant font-mono text-code-block text-on-surface overflow-x-auto shadow-elevation-1"
          >
            <code>{code}</code>
          </div>
        );
      }

      // Convert **bold** markdown to strong tags
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
        <p key={index} className="text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line mb-space-xs">
          {formattedSubparts}
        </p>
      );
    });
  };

  return (
    <div className="relative rounded-2xl border border-primary/30 bg-tertiary-container shadow-ai-glow overflow-hidden transition-all animate-fadeIn">
      {/* Top subtle gradient accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-tertiary via-indigo-500 to-primary" />

      <div className="p-space-lg space-y-space-md">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <AIIdentifierChip label="Pembahasan AI Terkalibrasi" />
            <span className="text-[11px] font-mono text-primary font-semibold px-2 py-0.5 rounded bg-primary/10">
              Groq Cloud AI (~0.3s)
            </span>
          </div>

          {typeof isCorrect === "boolean" && (
            <span
              className={`px-3 py-1 rounded-full font-mono text-label-sm font-bold flex items-center gap-1 border ${
                isCorrect
                  ? "bg-success-container text-on-success-container border-success/30"
                  : "bg-error-container text-on-error-container border-error/30"
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  Jawaban Anda Tepat
                </>
              ) : (
                <>
                  <Brain className="w-3.5 h-3.5 text-error" />
                  Perlu Dipelajari
                </>
              )}
            </span>
          )}
        </div>

        {/* Correct Answer Highlight if provided */}
        {correctAnswerText && (
          <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant text-body-sm flex items-center gap-2 shadow-elevation-1">
            <span className="font-mono font-bold text-primary shrink-0">Kunci Jawaban:</span>
            <span className="text-on-surface font-semibold">{correctAnswerText}</span>
          </div>
        )}

        {/* Explanation Body */}
        <div className="space-y-space-xs text-on-surface bg-surface-container-lowest/60 p-4 rounded-xl border border-outline-variant/60">
          {renderFormattedExplanation(explanation)}
        </div>

        {/* Inline AI Chat Section (Analitica In-Question Chat Bar) */}
        <div className="pt-2 border-t border-outline-variant/60 space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowInlineChat(!showInlineChat)}
              className="text-body-xs font-bold text-primary hover:text-primary-container flex items-center gap-1.5 transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>{showInlineChat ? "Sembunyikan Tanya AI Soal Ini" : "Kurang Paham? Tanya AI Soal Ini 💬"}</span>
              {showInlineChat ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {chatMessages.length > 0 && (
              <span className="text-[11px] font-mono text-on-surface-variant">
                {chatMessages.filter((m) => m.role === "user").length} Pertanyaan Diajukan
              </span>
            )}
          </div>

          {/* Quick Chips & Chat Input Box */}
          <div className="space-y-2">
            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendQuery(chip)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full border border-primary/20 bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary whitespace-nowrap transition-all shadow-elevation-1"
                >
                  💡 {chip}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jelasin step-by-step dari konsep dasar bgt caa..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 text-body-xs focus:outline-none focus:ring-1 focus:ring-primary font-sans shadow-elevation-1"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="p-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-elevation-1 shrink-0"
                title="Kirim ke AI Tutor"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>

          {/* Chat Message Stream */}
          {showInlineChat && chatMessages.length > 0 && (
            <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto p-3 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-elevation-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl text-body-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-on-primary ml-6 rounded-tr-none font-medium"
                      : "bg-surface-container-low border border-outline-variant text-on-surface mr-6 rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-[11px] font-mono opacity-80">
                    {msg.role === "user" ? "Anda" : "AI Tutor"}
                  </div>
                  <div>{renderFormattedExplanation(msg.content)}</div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-body-xs text-primary font-mono animate-pulse p-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>AI Tutor sedang membedah jawaban...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Next Question Navigation if provided */}
        {onNext && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-2 px-space-xl py-2.5 rounded-xl bg-primary text-on-primary font-bold text-body-sm hover:bg-primary-container shadow-elevation-2 transition-all hover:scale-105 active:scale-95"
            >
              <span>{nextLabel || "Lanjut ke Soal Berikutnya"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
