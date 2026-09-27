"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Sidebar, useSidebar } from "@/components/Sidebar";
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
  Plus,
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  Search,
  Edit3,
  X,
  LayoutDashboard,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/storage";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY_SESSIONS = "cbt_ai_tutor_sessions_v2";
const LEGACY_STORAGE_KEY = "cbt_ai_tutor_fullpage_messages";

const QUICK_PROMPTS = [
  {
    topic: "PBO / OOP",
    title: "4 Pilar Utama OOP",
    prompt:
      "Jelaskan secara komprehensif 4 pilar OOP (Enkapsulasi, Abstraksi, Inheritance, Polymorphism) dengan contoh kode nyata dalam TypeScript/PHP beserta analogi kehidupan sehari-hari.",
    icon: "🧩",
  },
  {
    topic: "Jaringan Komputer",
    title: "Rumus Cepat Subnetting",
    prompt:
      "Bagaimana cara mudah menghitung Subnet Mask, Network ID, Broadcast ID, dan jumlah Host valid pada notasi CIDR /27 dan /28? Berikan langkah perhitungan praktisnya.",
    icon: "🌐",
  },
  {
    topic: "K3LH & Budaya Kerja",
    title: "Penerapan 5R & Ergonomi",
    prompt:
      "Jelaskan prinsip Budaya Kerja 5R (Ringkas, Rapi, Resik, Rawat, Rajin) dan standar ergonomis posisi duduk programmer di lingkungan kerja industri PPLG.",
    icon: "🦺",
  },
  {
    topic: "Rekayasa Perangkat Lunak",
    title: "Alur Pola Desain MVC",
    prompt:
      "Jelaskan alur data Model-View-Controller (MVC) saat pengguna mengirim form login di aplikasi web modern, termasuk peran controller dan sanitasi input.",
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

function generateTitleFromPrompt(prompt: string): string {
  const clean = prompt
    .replace(/^([^\w\s]+)/, "")
    .replace(/^tolong jelaskan\s+/i, "")
    .replace(/^jelaskan\s+/i, "")
    .replace(/^bagaimana\s+/i, "")
    .trim();
  const firstClause = clean.split(/[.?!:\n]/)[0].trim();
  if (firstClause.length <= 34) return firstClause || "Obrolan Belajar";

  const words = firstClause.split(" ");
  let result = "";
  for (const word of words) {
    if ((result + " " + word).trim().length > 30) break;
    result = (result + " " + word).trim();
  }
  return (result || firstClause.slice(0, 30)) + "...";
}

function createWelcomeMessage(studentName: string): ChatMessage {
  return {
    id: `welcome-${Date.now()}`,
    role: "assistant",
    content: `Halo, **${studentName}**! 👋\n\nSelamat datang di **CBT-PPLG AI Tutor Studio** 🧑‍🏫.\n\nSaya adalah asisten belajar cerdas yang dilatih dengan standar resmi **Kurikulum Kemendikdasmen RI** untuk Uji Kompetensi Keahlian TKA PPLG. Saya siap membantumu:\n- Membedah materi ujian (Wawasan Kerja, K3LH 5R, Jaringan Komputer, Algoritma, dan OOP).\n- Menjelaskan logika kode program, debugging, dan arsitektur perangkat lunak.\n- Memberikan contoh soal latihan beserta pembahasannya yang komprehensif.\n\nSilakan pilih topik cepat di bawah atau ketikkan pertanyaanmu secara langsung!`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

function AITutorContent() {
  const { isDesktopOpen, toggleDesktopSidebar } = useSidebar();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [historySearch, setHistorySearch] = useState("");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [userName, setUserName] = useState("Siswa");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 1. Initial Load: user profile & chat sessions
  useEffect(() => {
    const session = getAuthSession();
    const profile = session.user || getUserProfile();
    const displayName = profile?.name ? profile.name.split(" ")[0] : "Siswa";
    setUserName(displayName);

    let loadedSessions: ChatSession[] = [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedSessions = parsed;
        }
      }
    } catch {
      // Ignored
    }

    // Migrasi data lama dari sessionStorage jika belum ada sessions di localStorage
    if (loadedSessions.length === 0) {
      try {
        const legacy = sessionStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy);
          if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
            const firstUserMsg = parsedLegacy.find((m: ChatMessage) => m.role === "user");
            loadedSessions.push({
              id: `session-legacy-${Date.now()}`,
              title: firstUserMsg ? generateTitleFromPrompt(firstUserMsg.content) : "Sesi Belajar Sebelumnya",
              messages: parsedLegacy,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
      } catch {
        // Ignored
      }
    }

    // Jika tetap belum ada riwayat sama sekali, inisialisasi session pertama
    if (loadedSessions.length === 0) {
      const firstSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: "Obrolan Baru",
        messages: [createWelcomeMessage(displayName)],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      loadedSessions = [firstSession];
    }

    setSessions(loadedSessions);
    setActiveSessionId(loadedSessions[0].id);

    // Auto collapse sidebar on small mobile screens
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsHistoryOpen(false);
    }
  }, []);

  // 2. Persist sessions to localStorage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
      } catch {
        // Ignored
      }
    }
  }, [sessions]);

  // Current active session & messages
  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === activeSessionId) || sessions[0] || null;
  }, [sessions, activeSessionId]);

  const messages = useMemo(() => {
    return activeSession ? activeSession.messages : [];
  }, [activeSession]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, activeSessionId]);

  // Handle Create New Chat Session (ChatGPT style)
  const handleNewChat = () => {
    // Jika sesi saat ini masih kosong (hanya berisi 1 pesan selamat datang tanpa pesan user), gunakan sesi ini saja
    if (activeSession && activeSession.messages.filter((m) => m.role === "user").length === 0) {
      if (textareaRef.current) textareaRef.current.focus();
      return;
    }

    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: "Obrolan Baru",
      messages: [createWelcomeMessage(userName)],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);

    // On mobile, close drawer after creating new chat
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsHistoryOpen(false);
    }

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  // Handle Delete Session
  const handleDeleteSession = (sessionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const sessionToDelete = sessions.find((s) => s.id === sessionId);
    const title = sessionToDelete ? `"${sessionToDelete.title}"` : "percakapan ini";

    if (!window.confirm(`Hapus ${title} dari riwayat?`)) return;

    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (filtered.length === 0) {
        const fresh: ChatSession = {
          id: `session-${Date.now()}`,
          title: "Obrolan Baru",
          messages: [createWelcomeMessage(userName)],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Handle Clear All Sessions
  const handleClearAllSessions = () => {
    if (!window.confirm("Hapus seluruh riwayat percakapan AI Tutor? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }
    const fresh: ChatSession = {
      id: `session-${Date.now()}`,
      title: "Obrolan Baru",
      messages: [createWelcomeMessage(userName)],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSessions([fresh]);
    setActiveSessionId(fresh.id);
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
    sessionStorage.removeItem(LEGACY_STORAGE_KEY);
  };

  // Handle Start Rename Session
  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  // Handle Save Renamed Session
  const handleSaveRename = (sessionId: string) => {
    if (!editingTitle.trim()) {
      setEditingSessionId(null);
      return;
    }
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: editingTitle.trim() } : s))
    );
    setEditingSessionId(null);
  };

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading || !activeSession) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const isFirstUserMessage = activeSession.messages.filter((m) => m.role === "user").length === 0;
    const newTitle = isFirstUserMessage ? generateTitleFromPrompt(text) : activeSession.title;

    const updatedMessages = [...activeSession.messages, userMessage];

    // Optimistically update session
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              title: newTitle,
              messages: updatedMessages,
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );

    setInputMessage("");
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
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

        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSession.id
              ? {
                  ...s,
                  messages: [...s.messages, assistantReply],
                  updatedAt: new Date().toISOString(),
                }
              : s
          )
        );
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
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSession.id
              ? { ...s, messages: [...s.messages, errorReply], updatedAt: new Date().toISOString() }
              : s
          )
        );
      }
    } catch {
      const offlineReply: ChatMessage = {
        id: `ai-offline-${Date.now()}`,
        role: "assistant",
        content:
          "⚠️ **Koneksi Terputus**: Tidak dapat terhubung ke server AI CBT-PPLG. Silakan periksa jaringan internet Anda.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? { ...s, messages: [...s.messages, offlineReply], updatedAt: new Date().toISOString() }
            : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2000);
  };

  // Group sessions by date like ChatGPT
  const groupedSessions = useMemo(() => {
    const query = historySearch.trim().toLowerCase();
    const filtered = query
      ? sessions.filter(
          (s) =>
            s.title.toLowerCase().includes(query) ||
            s.messages.some((m) => m.content.toLowerCase().includes(query))
        )
      : sessions;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const last7DaysStart = todayStart - 7 * 86400000;

    const groups: {
      today: ChatSession[];
      yesterday: ChatSession[];
      last7Days: ChatSession[];
      older: ChatSession[];
    } = {
      today: [],
      yesterday: [],
      last7Days: [],
      older: [],
    };

    filtered.forEach((s) => {
      const time = new Date(s.updatedAt || s.createdAt).getTime();
      if (time >= todayStart) {
        groups.today.push(s);
      } else if (time >= yesterdayStart) {
        groups.yesterday.push(s);
      } else if (time >= last7DaysStart) {
        groups.last7Days.push(s);
      } else {
        groups.older.push(s);
      }
    });

    return groups;
  }, [sessions, historySearch]);

  // Markdown rendering helpers
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

            if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
              return <div key={lIdx} className="my-3 border-t border-outline-variant/60" />;
            }

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

            if (/^[-*+]\s+/.test(trimmed)) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2">
                  <span className="text-primary mt-1 font-bold leading-none">&bull;</span>
                  <span className="flex-1">{renderInlineFormatted(trimmed.replace(/^[-*+]\s+/, ""))}</span>
                </div>
              );
            }

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

  // Render History Item Row
  const renderSessionItem = (session: ChatSession) => {
    const isActive = session.id === activeSessionId;
    const isEditing = editingSessionId === session.id;

    return (
      <div
        key={session.id}
        onClick={() => {
          if (!isEditing) {
            setActiveSessionId(session.id);
            if (typeof window !== "undefined" && window.innerWidth < 1024) {
              setIsHistoryOpen(false);
            }
          }
        }}
        className={`group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-body-sm transition-all select-none ${
          isActive
            ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-elevation-1"
            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-on-surface-variant/70"}`} />
          {isEditing ? (
            <input
              type="text"
              autoFocus
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveRename(session.id);
                if (e.key === "Escape") setEditingSessionId(null);
              }}
              onBlur={() => handleSaveRename(session.id)}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-surface border border-primary rounded px-1.5 py-0.5 text-xs text-on-surface focus:outline-none"
            />
          ) : (
            <span className="truncate text-body-xs tracking-tight">{session.title}</span>
          )}
        </div>

        {/* Action icons on hover / active */}
        {!isEditing && (
          <div
            className={`flex items-center gap-1 shrink-0 ${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            } transition-opacity`}
          >
            <button
              type="button"
              onClick={(e) => handleStartRename(session, e)}
              className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
              title="Ganti Judul"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => handleDeleteSession(session.id, e)}
              className="p-1 rounded hover:bg-red-500/10 text-on-surface-variant hover:text-red-600 transition-colors"
              title="Hapus Obrolan"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-surface flex h-screen max-h-screen overflow-hidden">
      {/* ============================================================== */}
      {/* CHATGPT-STYLE CONVERSATION HISTORY SIDEBAR                     */}
      {/* ============================================================== */}
      {/* Mobile Backdrop */}
      {isHistoryOpen && (
        <div
          onClick={() => setIsHistoryOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-xs animate-fadeIn"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 bottom-0 lg:bottom-auto left-0 z-40 lg:z-20 w-[280px] shrink-0 bg-surface-container-lowest border-r border-outline-variant flex flex-col h-screen max-h-screen transition-all duration-300 ease-in-out ${
          isHistoryOpen ? "translate-x-0" : "-translate-x-full lg:hidden"
        }`}
      >
          {/* History Header & New Chat Button */}
          <div className="p-3 border-b border-outline-variant/70 space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-tertiary text-on-tertiary flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="font-bold text-body-sm text-on-surface">Riwayat Tutor</span>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                title="Tutup Riwayat"
                aria-label="Tutup panel riwayat"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* + Obrolan Baru Button (Prominent ChatGPT Style) */}
            <button
              type="button"
              onClick={handleNewChat}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-body-sm shadow-elevation-1 hover:bg-primary-container transition-all active:scale-98 group"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
                <span>Obrolan Baru</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* Search History Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-on-surface-variant absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Cari percakapan..."
                className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-[12px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary"
              />
              {historySearch && (
                <button
                  type="button"
                  onClick={() => setHistorySearch("")}
                  className="absolute right-2 top-2 text-on-surface-variant hover:text-on-surface"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Grouped History List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-none">
            {groupedSessions.today.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant/70 px-2 block">
                  Hari Ini
                </span>
                {groupedSessions.today.map(renderSessionItem)}
              </div>
            )}

            {groupedSessions.yesterday.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant/70 px-2 block">
                  Kemarin
                </span>
                {groupedSessions.yesterday.map(renderSessionItem)}
              </div>
            )}

            {groupedSessions.last7Days.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant/70 px-2 block">
                  7 Hari Terakhir
                </span>
                {groupedSessions.last7Days.map(renderSessionItem)}
              </div>
            )}

            {groupedSessions.older.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant/70 px-2 block">
                  Lebih Lama
                </span>
                {groupedSessions.older.map(renderSessionItem)}
              </div>
            )}

            {sessions.length === 0 && (
              <div className="p-4 text-center text-on-surface-variant text-body-xs">
                Belum ada riwayat percakapan. Mulai pertanyaan pertamamu!
              </div>
            )}
          </div>

          {/* History Footer Actions */}
          <div className="p-2.5 border-t border-outline-variant/70 bg-surface-container-low flex items-center justify-between text-[11px] font-mono text-on-surface-variant shrink-0">
            <span>{sessions.length} Obrolan Tersimpan</span>
            <button
              type="button"
              onClick={handleClearAllSessions}
              className="text-red-600 hover:underline flex items-center gap-1 font-semibold"
              title="Hapus semua riwayat percakapan"
            >
              <Trash2 className="w-3 h-3" />
              <span>Hapus Semua</span>
            </button>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* MAIN CHAT WORKSPACE (RIGHT SIDE)                               */}
        {/* ============================================================== */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
          {/* Top Header Bar */}
          <header className="px-3 lg:px-4 py-2 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between shrink-0 shadow-elevation-1">
            <div className="flex items-center gap-2 min-w-0">
              {/* Toggle Dashboard Sidebar Button */}
              <button
                type="button"
                onClick={toggleDesktopSidebar}
                className={`p-2 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors shrink-0 flex items-center gap-1.5 ${
                  !isDesktopOpen
                    ? "bg-primary text-on-primary font-bold shadow-elevation-1 border-primary"
                    : "text-on-surface-variant hover:text-on-surface bg-surface-container-low"
                }`}
                title={isDesktopOpen ? "Tutup Sidebar Dashboard (CBT-PPLG)" : "Buka Sidebar Dashboard (CBT-PPLG)"}
                aria-label="Toggle Sidebar Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-mono font-medium">
                  {isDesktopOpen ? "Tutup Menu" : "Buka Menu"}
                </span>
              </button>

              {/* Toggle History Sidebar Button */}
              <button
                type="button"
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className={`p-2 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors shrink-0 flex items-center gap-1.5 ${
                  !isHistoryOpen
                    ? "bg-tertiary-container text-on-tertiary-container border-tertiary/40 font-bold"
                    : "text-on-surface-variant hover:text-on-surface bg-surface-container-low"
                }`}
                title={isHistoryOpen ? "Sembunyikan Riwayat Obrolan" : "Buka Riwayat Obrolan"}
                aria-label="Toggle riwayat percakapan"
              >
                <PanelLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-mono font-medium">
                  {isHistoryOpen ? "Tutup Riwayat" : "Buka Riwayat"}
                </span>
              </button>

              {/* Divider */}
              <div className="h-4 w-px bg-outline-variant shrink-0 mx-1 hidden sm:block" />

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-body-md font-bold text-on-surface tracking-tight truncate">
                    {activeSession ? activeSession.title : "CBT-PPLG AI Tutor Studio"}
                  </h1>
                  <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Model 120B Online
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant truncate">
                  Asisten Belajar Standar Kemendikdasmen 5 Elemen PPLG
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Quick New Chat Button in Header */}
              <button
                type="button"
                onClick={handleNewChat}
                className="px-3 py-1.5 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-body-xs transition-all flex items-center gap-1.5 shadow-elevation-1 active:scale-95"
                title="Mulai obrolan baru"
              >
                <Plus className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">Obrolan Baru</span>
              </button>
            </div>
          </header>

          {/* Chat Stream Area */}
          <main className="flex-1 overflow-y-auto p-margin lg:p-space-lg space-y-space-md">
            <div className="max-w-4xl mx-auto space-y-space-md">
              {/* Quick Prompt Cards (Shown when conversation has no user messages) */}
              {messages.filter((m) => m.role === "user").length === 0 && (
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
                    {!isUser && (
                      <div className="w-9 h-9 rounded-2xl bg-tertiary text-on-tertiary flex items-center justify-center shrink-0 shadow-elevation-1 mt-1">
                        <Bot className="w-5 h-5" />
                      </div>
                    )}

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

          {/* Bottom Input Bar */}
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
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Tanyakan apa saja seputar materi & kejuruan PPLG... (Enter untuk kirim, Shift+Enter untuk baris baru)"
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
      </div>
  );
}

export default function AITutorPage() {
  return (
    <Sidebar>
      <AITutorContent />
    </Sidebar>
  );
}
