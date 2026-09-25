"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Send, Bot, User, Loader2, Terminal } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AITutorChatProps {
  currentContext?: {
    questionStem?: string;
    topic?: string;
    explanation?: string;
  };
}

export function AITutorChat({ currentContext }: AITutorChatProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExamActive, setIsExamActive] = useState(false);

  // Monitor status ujian: jika siswa sedang mengerjakan simulasi, blokir total AI Tutor
  useEffect(() => {
    const handleExamMode = (e: Event) => {
      const custom = e as CustomEvent<{ isExam: boolean }>;
      const isExam = !!custom.detail?.isExam;
      setIsExamActive(isExam);
      if (isExam) {
        setIsOpen(false);
      }
    };

    // Periksa status aktif awal dari atribut body
    if (typeof document !== "undefined" && document.body.getAttribute("data-exam-active") === "true") {
      setIsExamActive(true);
      setIsOpen(false);
    }

    window.addEventListener("cendekia:exam-mode", handleExamMode);
    return () => window.removeEventListener("cendekia:exam-mode", handleExamMode);
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Halo! Saya **CBT-PPLG AI Tutor** 🧑‍🏫.\n\nSiap membantumu menguasai materi TKA Kejuruan PPLG sesuai standar resmi **Kemendikdasmen** (Wawasan Kerja PPLG, K3LH 5R, Jaringan Komputer & Subnetting, Algoritma Dasar, dan PBO & MVC).\n\nAda materi atau soal yang ingin kamu diskusikan? Pilih topik kisi-kisi cepat di bawah atau ketik langsung pertanyaanmu!",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = React.useCallback(
    async (textToSend?: string) => {
      const message = (textToSend || inputMessage).trim();
      if (!message || isLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: message,
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInputMessage("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
            context: currentContext,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const assistantReply: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: data.reply || "Maaf, saya tidak dapat memahami pertanyaan tersebut.",
          };
          setMessages((prev) => [...prev, assistantReply]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `err-${Date.now()}`,
              role: "assistant",
              content: "Terjadi gangguan sementara saat menghubungi AI Tutor. Silakan coba lagi.",
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: "Koneksi terputus. Pastikan server aktif dan coba lagi.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [inputMessage, isLoading, messages, currentContext]
  );

  useEffect(() => {
    const handleAskAiEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ prompt?: string; context?: Record<string, unknown> }>;
      setIsOpen(true);
      if (customEvent.detail?.prompt) {
        handleSendMessage(customEvent.detail.prompt);
      }
    };

    window.addEventListener("cendekia:ask-ai", handleAskAiEvent);
    return () => {
      window.removeEventListener("cendekia:ask-ai", handleAskAiEvent);
    };
  }, [handleSendMessage]);


  const quickPrompts = [
    "Tahapan SDLC & Metodologi Scrum",
    "Prinsip K3LH & Budaya 5R di Lab PPLG",
    "Cara Hitung Subnetting IP & TCP/IP",
    "Perbedaan For, While, dan Do-While",
    "4 Pilar PBO: Enkapsulasi & Polimorfisme",
    "Konsep Pola Desain Arsitektur MVC",
  ];

  // Helper render inline markdown: bold, italic, and inline code
  const renderInlineFormatted = (text: string, isUser = false) => {
    // 1. Process inline code `...`
    const codeParts = text.split(/(`[^`]+`)/g);

    return codeParts.map((cPart, cIdx) => {
      if (cPart.startsWith("`") && cPart.endsWith("`")) {
        return (
          <code
            key={cIdx}
            className={`px-1.5 py-0.5 mx-0.5 rounded-md font-mono text-[11px] font-semibold ${
              isUser
                ? "bg-white/20 text-white border border-white/30"
                : "bg-surface-container-high border border-outline-variant/70 text-primary"
            }`}
          >
            {cPart.slice(1, -1)}
          </code>
        );
      }

      // 2. Process **bold**
      const boldParts = cPart.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith("**") && bPart.endsWith("**")) {
          return (
            <strong key={bIdx} className={`font-bold ${isUser ? "text-white" : "text-on-surface"}`}>
              {bPart.slice(2, -2)}
            </strong>
          );
        }

        // 3. Process *italic*
        const italicParts = bPart.split(/(\*[^*]+\*)/g);
        return italicParts.map((iPart, iIdx) => {
          if (iPart.startsWith("*") && iPart.endsWith("*")) {
            return (
              <em key={iIdx} className={`italic ${isUser ? "text-white/90" : "text-on-surface-variant"}`}>
                {iPart.slice(1, -1)}
              </em>
            );
          }
          return iPart;
        });
      });
    });
  };

  // Helper render formatted markdown text & code blocks
  const renderMessageContent = (text: string, isUser = false) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, pIdx) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        let lang = "";
        let codeLines = lines;
        if (lines.length > 0 && /^[a-zA-Z0-9_-]+$/.test(lines[0].trim())) {
          lang = lines[0].trim();
          codeLines = lines.slice(1);
        }
        const code = codeLines.join("\n");

        return (
          <div
            key={pIdx}
            className="my-2.5 rounded-xl border border-slate-700/80 bg-[#0f172a] shadow-elevation-2 overflow-hidden text-left"
          >
            <div className="px-3 py-1.5 bg-slate-800/90 border-b border-slate-700/70 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-primary font-semibold uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                {lang || "Code"}
              </span>
            </div>
            <div className="p-3 text-[12px] font-mono text-slate-100 overflow-x-auto leading-relaxed">
              <pre>
                <code>{code}</code>
              </pre>
            </div>
          </div>
        );
      }

      // Non-code block: process lines
      const rawLines = part.split("\n");

      return (
        <div
          key={pIdx}
          className={`space-y-1.5 leading-relaxed text-body-sm text-left ${
            isUser ? "text-white" : "text-on-surface"
          }`}
        >
          {rawLines.map((line, lIdx) => {
            const trimmed = line.trim();

            if (!trimmed) {
              return <div key={lIdx} className="h-1" />;
            }

            // 1. Horizontal Rules: ---, ***, ___
            if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
              return <div key={lIdx} className="my-2.5 border-t border-outline-variant/60" />;
            }

            // 2. Headings: #, ##, ###, ####
            if (trimmed.startsWith("#### ")) {
              return (
                <h5 key={lIdx} className="font-bold text-title-xs text-on-surface mt-2 mb-1 flex items-center gap-1.5">
                  {renderInlineFormatted(trimmed.slice(5))}
                </h5>
              );
            }
            if (trimmed.startsWith("### ")) {
              return (
                <h4 key={lIdx} className="font-bold text-title-sm text-primary mt-2 mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-primary rounded-full inline-block shrink-0" />
                  {renderInlineFormatted(trimmed.slice(4))}
                </h4>
              );
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h3 key={lIdx} className="font-bold text-title-md text-on-surface border-b border-outline-variant/60 pb-1 mt-2.5 mb-1.5">
                  {renderInlineFormatted(trimmed.slice(3))}
                </h3>
              );
            }
            if (trimmed.startsWith("# ")) {
              return (
                <h2 key={lIdx} className="font-bold text-headline-sm text-on-surface mt-3 mb-1.5">
                  {renderInlineFormatted(trimmed.slice(2))}
                </h2>
              );
            }

            // 3. Clean ugly ASCII branch/tree markers (├──, └──, │, |--, ||)
            if (/^[├└│\|\-\+]+/.test(trimmed)) {
              const cleanedText = trimmed.replace(/^[├└│\|\-\+\s]+/, "").trim();
              if (!cleanedText) return null;
              return (
                <div key={lIdx} className="flex items-start gap-2 ml-3 my-0.5 text-body-xs font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0 mt-1.5" />
                  <span>{renderInlineFormatted(cleanedText)}</span>
                </div>
              );
            }

            // 4. SQL comment lines (-- ...)
            if (trimmed.startsWith("-- ")) {
              return (
                <div key={lIdx} className="my-1.5 p-2 rounded-lg bg-surface-container border-l-2 border-primary text-body-xs font-mono text-on-surface-variant flex items-center gap-2">
                  <span className="font-semibold text-primary shrink-0">Contoh:</span>
                  <span>{renderInlineFormatted(trimmed.slice(3))}</span>
                </div>
              );
            }

            // 5. Bullet Lists (- , * , • )
            if (/^[-*•]\s+/.test(trimmed)) {
              return (
                <div key={lIdx} className="flex items-start gap-2 ml-1 my-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                  <span className="flex-1">{renderInlineFormatted(trimmed.replace(/^[-*•]\s+/, ""))}</span>
                </div>
              );
            }

            // 6. Numbered Lists (1. , 2. )
            const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
            if (numMatch) {
              return (
                <div key={lIdx} className="flex items-start gap-2 ml-1 my-0.5">
                  <span className="font-mono text-label-sm font-bold text-primary shrink-0 mt-0.5">
                    {numMatch[1]}.
                  </span>
                  <span className="flex-1">{renderInlineFormatted(numMatch[2])}</span>
                </div>
              );
            }

            // 7. Regular paragraph text
            return (
              <p key={lIdx} className={`leading-relaxed ${isUser ? "text-white font-medium" : ""}`}>
                {renderInlineFormatted(line, isUser)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  // Sembunyikan total tombol mengambang AI Tutor saat ujian berlangsung maupun di halaman pembahasan
  if (isExamActive || pathname?.startsWith("/simulation")) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-4 md:right-6 z-50 flex items-center gap-2 px-space-md py-3 rounded-full bg-tertiary text-on-tertiary shadow-ai-glow hover:bg-primary transition-all duration-300 hover:scale-105 active:scale-95 group font-medium text-body-sm print:hidden"
          aria-label="Tanya AI Tutor CBT-PPLG"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          </div>
          <span className="font-semibold tracking-wide">Tanya AI Tutor</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-3 md:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[420px] h-[540px] md:h-[580px] max-h-[80vh] md:max-h-[85vh] bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-elevation-3 flex flex-col overflow-hidden animate-fadeIn print:hidden">
          {/* Header */}
          <div className="px-space-md py-space-sm bg-tertiary-container border-b border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-elevation-1">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-title-md text-on-surface leading-tight flex items-center gap-1.5">
                  CBT-PPLG AI Tutor
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-success-container text-on-success-container border border-success/30">
                    Online
                  </span>
                </h3>
                <span className="text-[11px] font-mono text-on-tertiary-container">
                  Bimbingan Belajar TKA PPLG
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Tutup AI Tutor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Banner if studying a question */}
          {currentContext?.questionStem && (
            <div className="bg-surface-container-low px-space-md py-1.5 border-b border-outline-variant text-[11px] text-on-surface-variant flex items-center justify-between">
              <span className="truncate max-w-[280px]">
                📌 Topik: <strong>{currentContext.topic || "PPLG"}</strong>
              </span>
              <span className="font-mono text-primary font-semibold">Konteks Aktif</span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-space-md overflow-y-auto space-y-space-md">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-body-sm shadow-elevation-1 ${
                      isUser
                        ? "bg-primary text-white rounded-tr-none font-medium shadow-elevation-2"
                        : "bg-surface-container-lowest text-on-surface border border-outline-variant/80 rounded-tl-none shadow-elevation-1"
                    }`}
                  >
                    {renderMessageContent(m.content, isUser)}
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2 justify-start items-center">
                <div className="w-7 h-7 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="p-space-sm rounded-xl bg-surface-container-low text-on-surface border border-outline-variant flex items-center gap-2 text-body-sm font-mono text-[12px]">
                  <Loader2 className="w-4 h-4 animate-spin text-tertiary" />
                  <span>AI Tutor sedang berpikir...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          {messages.length <= 2 && (
            <div className="px-space-md py-1.5 border-t border-outline-variant/80 bg-surface-container-low/50 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
              <span className="text-[10px] font-mono text-primary font-bold shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-tertiary" />
                Kisi-Kisi:
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-sans font-medium bg-surface-container-lowest text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all border border-outline-variant/80 shrink-0 shadow-elevation-1 active:scale-95"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-space-sm border-t border-outline-variant bg-surface-container-lowest flex items-center gap-space-xs"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanyakan konsep atau soal PPLG..."
              className="flex-1 px-space-md py-2 rounded-xl bg-surface-container border border-outline-variant text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container disabled:opacity-40 disabled:cursor-not-allowed shadow-elevation-1 transition-all"
              aria-label="Kirim pertanyaan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
