"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Terminal,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/storage";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

const STORAGE_KEY = "cbt_ai_tutor_fullpage_messages";

const QUICK_PROMPTS = [
  {
    topic: "PBO / OOP",
    title: "4 Pilar Utama OOP",
    prompt: "Jelaskan secara komprehensif 4 pilar OOP (Enkapsulasi, Abstraksi, Inheritance, Polymorphism) dengan contoh kode nyata dalam TypeScript/PHP beserta analogi kehidupan sehari-hari.",
    icon: "🧩",
  },
  {
    topic: "Jaringan Komputer",
    title: "Rumus Cepat Subnetting",
    prompt: "Bagaimana cara mudah menghitung Subnet Mask, Network ID, Broadcast ID, dan jumlah Host valid pada notasi CIDR /27 dan /28? Berikan langkah perhitungan praktisnya.",
    icon: "🌐",
  },
  {
    topic: "K3LH & Budaya Kerja",
    title: "Penerapan 5R & Ergonomi",
    prompt: "Jelaskan prinsip Budaya Kerja 5R (Ringkas, Rapi, Resik, Rawat, Rajin) dan standar ergonomis posisi duduk programmer di lingkungan kerja industri PPLG.",
    icon: "🦺",
  },
  {
    topic: "Rekayasa Perangkat Lunak",
    title: "Alur Pola Desain MVC",
    prompt: "Jelaskan alur data Model-View-Controller (MVC) saat pengguna mengirim form login di aplikasi web modern, termasuk peran controller dan sanitasi input.",
    icon: "📐",
  },
];

const TOPIC_CHIPS = [
  "PBO / OOP",
  "Subnetting TCP/IP",
  "K3LH & 5R",
  "Struktur Data & Algoritma",
  "Git & Scrum Workflow",
  "Keamanan Siber Dasar",
];

export default function AITutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [userName, setUserName] = useState("Siswa");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history & user profile
  useEffect(() => {
    const session = getAuthSession();
    const profile = session.user || getUserProfile();
    if (profile?.name) {
      setUserName(profile.name.split(" ")[0]);
    }

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch {
      // Ignored
    }

    // Default welcome message
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Halo, **${profile?.name ? profile.name.split(" ")[0] : "Siswa PPLG"}**! 👋\n\nSelamat datang di **CBT-PPLG AI Tutor Studio** 🧑‍🏫.\n\nSaya adalah asisten belajar cerdas yang dilatih dengan standar resmi **Kurikulum Kemendikdasmen RI** untuk Uji Kompetensi Keahlian TKA PPLG. Saya dapat membantumu:\n- Membedah materi ujian (Wawasan Kerja, K3LH 5R, Jaringan Komputer, Algoritma, dan OOP).\n- Menjelaskan logika kode program, debugging, dan arsitektur perangkat lunak.\n- Memberikan contoh soal latihan beserta pembahasannya yang komprehensif.\n\nSilakan pilih topik cepat di bawah atau ketikkan pertanyaanmu secara langsung!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  // Save to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        // Ignored
      }
    }
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantReply: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.reply || "Maaf, respon tidak dapat dihasilkan.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantReply]);
      } else {
        const err = await res.json().catch(() => ({}));
        const errorReply: ChatMessage = {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ **Pemberitahuan Sistem**: ${
            err.error || "Gagal menghubungi AI Engine. Pastikan koneksi internet stabil lalu coba beberapa saat lagi."
          }`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorReply]);
      }
    } catch {
      const offlineReply: ChatMessage = {
        id: `ai-offline-${Date.now()}`,
        role: "assistant",
        content:
          "⚠️ **Koneksi Terputus**: Tidak dapat terhubung ke server AI CBT-PPLG. Silakan periksa jaringan internet Anda.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, offlineReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Hapus seluruh riwayat percakapan dengan AI Tutor?")) {
      sessionStorage.removeItem(STORAGE_KEY);
      setMessages([
        {
          id: "welcome-reset",
          role: "assistant",
          content: `Riwayat obrolan telah dibersihkan. Apa yang ingin kamu pelajari hari ini, **${userName}**?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2000);
  };

  // Helper render formatted markdown text & code blocks
  const renderInlineFormatted = (text: string, isUser = false) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={index}
            className={`px-1.5 py-0.5 rounded font-mono text-[12px] font-semibold ${
              isUser
                ? "bg-white/20 text-white"
                : "bg-surface-container text-primary border border-outline-variant/60"
            }`}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={index} className={`font-bold ${isUser ? "text-white" : "text-on-surface"}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return (
          <em key={index} className="italic">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

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
        const codeId = `code-${pIdx}-${code.slice(0, 10)}`;

        return (
          <div
            key={pIdx}
            className="my-3 rounded-2xl border border-slate-700/80 bg-[#0f172a] shadow-elevation-2 overflow-hidden text-left"
          >
            <div className="px-4 py-2 bg-slate-800/90 border-b border-slate-700/70 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-primary font-semibold uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                {lang || "Code"}
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode(code, codeId)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                title="Salin kode"
              >
                {copiedCodeId === codeId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 text-[13px] font-mono text-slate-100 overflow-x-auto leading-relaxed">
              <pre>
                <code>{code}</code>
              </pre>
            </div>
          </div>
        );
      }

      // Non-code block
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
              return <div key={lIdx} className="h-1.5" />;
            }

            // Horizontal Rules
            if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
              return <div key={lIdx} className="my-3 border-t border-outline-variant/60" />;
            }

            // Headings
            if (trimmed.startsWith("### ")) {
              return (
                <h4 key={lIdx} className="font-bold text-title-sm text-primary mt-3 mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-primary rounded-full inline-block shrink-0" />
                  {renderInlineFormatted(trimmed.slice(4))}
                </h4>
              );
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h3 key={lIdx} className="font-bold text-title-md text-on-surface border-b border-outline-variant/60 pb-1 mt-3 mb-1.5">
                  {renderInlineFormatted(trimmed.slice(3))}
                </h3>
              );
            }

            // Blockquotes
            if (trimmed.startsWith("> ")) {
              return (
                <blockquote
                  key={lIdx}
                  className="pl-3.5 border-l-2 border-primary/60 text-on-surface-variant italic my-1.5 text-body-xs bg-surface-container-low/40 py-1 rounded-r-lg"
                >
                  {renderInlineFormatted(trimmed.slice(2))}
                </blockquote>
              );
            }

            // Unordered list
            if (/^[-*+]\s+/.test(trimmed)) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2">
                  <span className="text-primary mt-1 font-bold leading-none">&bull;</span>
                  <span className="flex-1">{renderInlineFormatted(trimmed.replace(/^[-*+]\s+/, ""))}</span>
                </div>
              );
            }

            // Numbered list
            const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
            if (numMatch) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2">
                  <span className="font-mono text-primary font-bold text-[12px] min-w-[20px] text-right">
                    {numMatch[1]}.
                  </span>
                  <span className="flex-1">{renderInlineFormatted(numMatch[2])}</span>
                </div>
              );
            }

            // Regular paragraph
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

  return (
    <Sidebar>
      <div className="flex-1 bg-surface flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="px-margin lg:px-space-xl py-space-sm bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between shrink-0 shadow-elevation-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-tertiary text-on-tertiary flex items-center justify-center shadow-elevation-1">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-title-md font-bold text-on-surface tracking-tight">
                  CBT-PPLG AI Tutor Studio
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Model 120B Online
                </span>
              </div>
              <p className="text-body-xs text-on-surface-variant flex items-center gap-2">
                <span>Asisten Belajar Interaktif</span>
                <span>&bull;</span>
                <span className="text-primary font-medium">Standar Kemendikdasmen 5 Elemen PPLG</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearChat}
              className="px-3 py-1.5 rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-red-600 transition-colors text-body-xs font-semibold flex items-center gap-1.5 active:scale-95"
              title="Bersihkan riwayat percakapan"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bersihkan Chat</span>
            </button>
          </div>
        </header>

        {/* Chat Stream Area */}
        <main className="flex-1 overflow-y-auto p-margin lg:p-space-lg space-y-space-md">
          <div className="max-w-4xl mx-auto space-y-space-md">
            {/* Quick Prompt Cards (Shown when conversation is short) */}
            {messages.length <= 1 && (
              <div className="space-y-space-sm pt-2 animate-fadeIn">
                <div className="flex items-center justify-between text-body-xs text-on-surface-variant font-medium">
                  <span className="flex items-center gap-1.5 text-primary font-bold">
                    <Sparkles className="w-4 h-4 text-tertiary" />
                    Rekomendasi Topik Belajar Cepat Uji Kompetensi
                  </span>
                  <span className="font-mono text-[11px]">Pilih salah satu untuk mulai</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  {QUICK_PROMPTS.map((qp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(qp.prompt)}
                      className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant hover:border-primary/50 hover:bg-surface-container-low transition-all text-left shadow-elevation-1 group flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-2xl">{qp.icon}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold">
                          {qp.topic}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-body-sm text-on-surface group-hover:text-primary transition-colors">
                          {qp.title}
                        </h4>
                        <p className="text-[12px] text-on-surface-variant line-clamp-2 mt-0.5 leading-relaxed">
                          {qp.prompt}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:translate-x-1 transition-transform">
                        <span>Tanyakan Topik Ini</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Bubbles */}
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 animate-fadeIn ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="w-9 h-9 rounded-2xl bg-tertiary text-on-tertiary flex items-center justify-center shrink-0 shadow-elevation-1 mt-1">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  {/* Bubble Content */}
                  <div
                    className={`max-w-[85%] md:max-w-[78%] rounded-3xl p-4 shadow-elevation-1 ${
                      isUser
                        ? "bg-primary text-on-primary rounded-tr-sm"
                        : "bg-surface-container-lowest border border-outline-variant text-on-surface rounded-tl-sm"
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-outline-variant/60 text-[11px] font-mono text-on-surface-variant">
                        <span className="font-bold text-primary flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-tertiary" />
                          CBT-PPLG AI Tutor
                        </span>
                        {msg.timestamp && <span>{msg.timestamp}</span>}
                      </div>
                    )}

                    {renderMessageContent(msg.content, isUser)}

                    {isUser && msg.timestamp && (
                      <div className="text-right text-[10px] text-on-primary/70 font-mono mt-1">
                        {msg.timestamp}
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="w-9 h-9 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 font-bold font-mono text-label-md mt-1 shadow-elevation-1">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading typing indicator */}
            {isLoading && (
              <div className="flex gap-3 animate-fadeIn">
                <div className="w-9 h-9 rounded-2xl bg-tertiary text-on-tertiary flex items-center justify-center shrink-0 shadow-elevation-1 mt-1">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-3xl rounded-tl-sm bg-surface-container-lowest border border-outline-variant shadow-elevation-1 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" />
                  </div>
                  <span className="text-body-xs font-mono text-on-surface-variant">
                    AI Tutor sedang merumuskan jawaban &amp; telaah kurikulum...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Bottom Input Area */}
        <footer className="px-margin lg:px-space-xl pb-space-md pt-2 bg-surface-container-lowest border-t border-outline-variant shrink-0">
          <div className="max-w-4xl mx-auto space-y-2">
            {/* Topic Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-mono text-on-surface-variant font-semibold shrink-0 pr-1">
                Topik Cepat:
              </span>
              {TOPIC_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const text = `Tolong jelaskan materi tentang ${chip} yang sering keluar di ujian TKA SMK PPLG.`;
                    handleSendMessage(text);
                  }}
                  className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant text-[11px] font-medium text-on-surface-variant hover:text-primary whitespace-nowrap transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Main Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-end gap-2 bg-surface-container-low border border-outline-variant rounded-2xl p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-elevation-1"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  // Auto expand height up to 140px
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ketik pertanyaanmu di sini... (Enter untuk kirim, Shift+Enter untuk baris baru)"
                className="flex-1 bg-transparent px-2 py-1.5 text-body-sm text-on-surface placeholder:text-on-surface-variant/70 resize-none focus:outline-none max-h-[140px]"
              />

              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-2.5 rounded-xl bg-primary text-on-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-container transition-all shrink-0 active:scale-95"
                title="Kirim pesan"
                aria-label="Kirim pertanyaan ke AI Tutor"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant px-1">
              <span>Bimbingan Uji Kompetensi Keahlian TKA PPLG</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Anti-Jailbreak Protection Active
              </span>
            </div>
          </div>
        </footer>
      </div>
    </Sidebar>
  );
}
