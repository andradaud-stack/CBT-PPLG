"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { getAuthSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/storage";
import { LeaderboardEntry, UserProfile } from "@/types";
import { TRYOUT_PACKAGES } from "@/lib/tryoutPackages";
import {
  Trophy,
  Award,
  Flame,
  Search,
  RefreshCw,
  ChevronRight,
  User,
  CheckCircle2,
} from "lucide-react";

export default function LeaderboardPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [packageFilter, setPackageFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"score" | "streak" | "recent">("score");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLeaderboard = React.useCallback(
    async (isManual = false) => {
      if (isManual) setIsRefreshing(true);
      try {
        const url = `/api/leaderboard?packageId=${packageFilter}&sort=${sortBy}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setEntries(data.leaderboard || []);
        }
      } catch (err) {
        console.error("Gagal memuat papan peringkat:", err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [packageFilter, sortBy]
  );

  useEffect(() => {
    const session = getAuthSession();
    setCurrentUser(session.user || getUserProfile());
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Filter berdasarkan search query
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.school.toLowerCase().includes(q) ||
        e.packageName.toLowerCase().includes(q)
    );
  }, [entries, searchQuery]);

  // Cek posisi user saat ini
  const currentUserEntryIndex = filteredEntries.findIndex(
    (e) =>
      e.userId === currentUser?.id ||
      (currentUser?.name && e.name.toLowerCase() === currentUser.name.toLowerCase())
  );
  const currentUserEntry = currentUserEntryIndex >= 0 ? filteredEntries[currentUserEntryIndex] : null;
  const currentUserRank = currentUserEntryIndex >= 0 ? currentUserEntryIndex + 1 : null;

  // Top 3 Podium
  const top1 = filteredEntries[0] || null;
  const top2 = filteredEntries[1] || null;
  const top3 = filteredEntries[2] || null;
  const hasPodium = !!top1;

  // Format durasi
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  return (
    <Sidebar>
      <main className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-6 space-y-3 sm:space-y-4 pb-24 text-on-surface">
        {/* 1. Header Banner Mobile-First */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/15 via-primary/10 to-surface-container-lowest border border-amber-500/25 p-3.5 sm:p-5 shadow-elevation-1">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[10px] sm:text-xs font-mono font-bold mb-1">
                <Trophy className="w-3 h-3 text-amber-500 shrink-0" />
                <span>Klasemen Nasional Multi-Device</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-on-surface">
                Papan Peringkat TKA PPLG
              </h1>
              <p className="text-[11px] sm:text-xs text-on-surface-variant mt-0.5 line-clamp-1 sm:line-clamp-none">
                Evaluasi model IRT Kemendikdasmen (200–800) antar siswa SMK se-Indonesia
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => fetchLeaderboard(true)}
                disabled={isRefreshing}
                className="h-8 px-2.5 rounded-xl bg-surface-container-lowest/80 hover:bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50 active:scale-95"
                title="Segarkan peringkat"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-primary ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Segarkan</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Status Peringkat Anda (Card Highlight Mobile) */}
        <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant p-3 sm:p-4 shadow-elevation-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* User Profile Mini */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-indigo-700 text-white flex items-center justify-center font-bold font-mono text-base shadow-sm shrink-0">
                {currentUserRank ? `#${currentUserRank}` : <User className="w-5 h-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                    Peringkat Anda
                  </span>
                  {currentUserEntry && (
                    <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[9px] font-mono font-bold">
                      Aktif
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-on-surface truncate">
                  {currentUser?.name || "Siswa PPLG"}
                </h3>
                <p className="text-[11px] text-on-surface-variant truncate">
                  {currentUser?.classGrade || "XII PPLG"} &bull; {currentUser?.school || "SMK Negeri"}
                </p>
              </div>
            </div>

            {/* User Stat Counters */}
            {currentUserEntry ? (
              <div className="grid grid-cols-3 gap-2 bg-surface-container-low/70 p-2 sm:px-3 sm:py-2 rounded-xl border border-outline-variant/60 text-center shrink-0">
                <div>
                  <span className="text-[9px] font-mono text-on-surface-variant block uppercase font-semibold">
                    Posisi
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-amber-500">
                    #{currentUserRank}
                    <span className="text-[9px] text-on-surface-variant font-normal">/{filteredEntries.length}</span>
                  </span>
                </div>
                <div className="border-x border-outline-variant/60 px-1">
                  <span className="text-[9px] font-mono text-on-surface-variant block uppercase font-semibold">
                    Skor IRT
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-primary">
                    {currentUserEntry.score}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-on-surface-variant block uppercase font-semibold">
                    Akurasi
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-success">
                    {currentUserEntry.accuracy}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                <span className="text-xs text-on-surface-variant">Belum ada skor tryout</span>
                <Link
                  href="/simulation"
                  className="px-3 py-1.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 shadow-sm transition-all inline-flex items-center gap-1 shrink-0"
                >
                  <span>Mulai Tryout</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 3. Mobile Compact Podium (3 Pilar Juara) */}
        {hasPodium && !searchQuery && (
          <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant p-3 sm:p-4 shadow-elevation-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <h2 className="text-xs sm:text-sm font-bold text-on-surface uppercase tracking-wider">
                  Podium 3 Teratas
                </h2>
              </div>
              <span className="text-[10px] font-mono text-on-surface-variant">
                Paket {packageFilter === "all" ? "Semua" : packageFilter}
              </span>
            </div>

            {/* 3 Pedestal Layout */}
            <div className="grid grid-cols-3 gap-2 items-end pt-3">
              {/* RANK 2: PERAK (KIRI) */}
              {top2 ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-sm border-2 border-slate-300 dark:border-slate-500 shadow-sm">
                      {top2.name.charAt(0)}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-400 text-white font-mono text-[10px] font-bold flex items-center justify-center border border-white dark:border-surface">
                      2
                    </span>
                  </div>
                  <span className="font-bold text-xs text-on-surface truncate max-w-[90px] sm:max-w-[120px] text-center">
                    {top2.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant truncate max-w-[90px] text-center">
                    {top2.school.split(" ")[0]} {top2.school.split(" ")[1] || ""}
                  </span>
                  <div className="w-full mt-1.5 pt-2 pb-2.5 rounded-t-xl bg-slate-100 dark:bg-slate-800/80 border-t-2 border-slate-300 dark:border-slate-600 text-center">
                    <span className="font-mono font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 block">
                      {top2.score}
                    </span>
                    <span className="text-[9px] font-mono text-on-surface-variant block">
                      {top2.accuracy}% Akurat
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-60">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center text-sm mb-1 text-slate-500">
                    🥈
                  </div>
                  <span className="font-semibold text-[11px] text-on-surface-variant">Slot Juara 2</span>
                  <span className="text-[9px] text-on-surface-variant/70">Ayo Rebut!</span>
                  <div className="w-full mt-1.5 h-16 rounded-t-xl bg-surface-container-low/40 border-t-2 border-dashed border-outline-variant/60 flex items-center justify-center text-[10px] text-on-surface-variant/80 font-mono">
                    Tersedia
                  </div>
                </div>
              )}

              {/* RANK 1: EMAS (TENGAH - LEBIH TINGGI DENGAN MAHKOTA) */}
              {top1 ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-1">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm animate-bounce">
                      👑
                    </span>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-amber-950 flex items-center justify-center font-bold text-base border-2 border-amber-300 shadow-md">
                      {top1.name.charAt(0)}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold flex items-center justify-center border border-white dark:border-surface shadow-sm">
                      1
                    </span>
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-on-surface truncate max-w-[100px] sm:max-w-[140px] text-center">
                    {top1.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant truncate max-w-[100px] text-center">
                    {top1.school.split(" ")[0]} {top1.school.split(" ")[1] || ""}
                  </span>
                  <div className="w-full mt-1.5 pt-3 pb-3.5 rounded-t-xl bg-gradient-to-b from-amber-500/20 to-amber-500/5 border-t-2 border-amber-400 dark:border-amber-500 text-center shadow-inner">
                    <span className="font-mono font-bold text-sm sm:text-base text-amber-600 dark:text-amber-400 block leading-tight">
                      {top1.score}
                    </span>
                    <span className="text-[9px] font-mono text-success font-bold block">
                      {top1.accuracy}% Akurat
                    </span>
                  </div>
                </div>
              ) : null}

              {/* RANK 3: PERUNGGU (KANAN) */}
              {top3 ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-sm border-2 border-amber-700/40 shadow-sm">
                      {top3.name.charAt(0)}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-700 text-white font-mono text-[10px] font-bold flex items-center justify-center border border-white dark:border-surface">
                      3
                    </span>
                  </div>
                  <span className="font-bold text-xs text-on-surface truncate max-w-[90px] sm:max-w-[120px] text-center">
                    {top3.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant truncate max-w-[90px] text-center">
                    {top3.school.split(" ")[0]} {top3.school.split(" ")[1] || ""}
                  </span>
                  <div className="w-full mt-1.5 pt-1.5 pb-2 rounded-t-xl bg-amber-900/10 dark:bg-amber-950/30 border-t-2 border-amber-700/40 text-center">
                    <span className="font-mono font-bold text-xs sm:text-sm text-amber-800 dark:text-amber-300 block">
                      {top3.score}
                    </span>
                    <span className="text-[9px] font-mono text-on-surface-variant block">
                      {top3.accuracy}% Akurat
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-60">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-outline-variant flex items-center justify-center text-sm mb-1 text-amber-700">
                    🥉
                  </div>
                  <span className="font-semibold text-[11px] text-on-surface-variant">Slot Juara 3</span>
                  <span className="text-[9px] text-on-surface-variant/70">Tersedia</span>
                  <div className="w-full mt-1.5 h-12 rounded-t-xl bg-surface-container-low/40 border-t-2 border-dashed border-outline-variant/60 flex items-center justify-center text-[10px] text-on-surface-variant/80 font-mono">
                    Tersedia
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. Touch-Friendly Filters & Search */}
        <section className="space-y-2">
          {/* Search Bar Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama peserta atau sekolah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant hover:text-on-surface"
              >
                ✕
              </button>
            )}
          </div>

          {/* Horizontal Scrollable Pills for Paket */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setPackageFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                packageFilter === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-container"
              }`}
            >
              Semua Paket
            </button>
            {TRYOUT_PACKAGES.map((pkg) => {
              const isSelected = packageFilter === String(pkg.id);
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setPackageFilter(String(pkg.id))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-container"
                  }`}
                >
                  Paket {pkg.id}
                </button>
              );
            })}
          </div>

          {/* Sort By Toggle Pills */}
          <div className="flex items-center justify-between pt-0.5 text-xs">
            <span className="text-[11px] font-mono text-on-surface-variant font-semibold">
              Total {filteredEntries.length} Peserta
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSortBy("score")}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  sortBy === "score"
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                🏆 Skor IRT
              </button>
              <button
                type="button"
                onClick={() => setSortBy("streak")}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  sortBy === "streak"
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                🔥 Streak
              </button>
              <button
                type="button"
                onClick={() => setSortBy("recent")}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  sortBy === "recent"
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                ⏱️ Terbaru
              </button>
            </div>
          </div>
        </section>

        {/* 5. Daftar Peringkat: Native App-Style Mobile Cards */}
        <section className="space-y-2">
          {isLoading ? (
            <div className="py-16 text-center space-y-2 bg-surface-container-lowest rounded-2xl border border-outline-variant">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-mono text-on-surface-variant">
                Memuat klasemen peserta...
              </p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="py-12 text-center space-y-2 px-4 bg-surface-container-lowest rounded-2xl border border-outline-variant">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-on-surface">Belum Ada Hasil Ujian</h4>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                Jadilah siswa pertama yang menyelesaikan Tryout dan tercatat di papan peringkat!
              </p>
              <div className="pt-2">
                <Link
                  href="/simulation"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white font-bold text-xs"
                >
                  <span>Mulai Tryout</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-elevation-1 overflow-hidden divide-y divide-outline-variant/50">
              {filteredEntries.map((entry, index) => {
                const rank = index + 1;
                const isMe =
                  entry.userId === currentUser?.id ||
                  (currentUser?.name && entry.name.toLowerCase() === currentUser.name.toLowerCase());

                return (
                  <div
                    key={entry.id || `${entry.name}-${index}`}
                    className={`p-3 sm:p-3.5 flex items-center justify-between gap-2.5 transition-colors ${
                      isMe
                        ? "bg-primary/10 border-l-4 border-l-primary font-medium"
                        : "hover:bg-surface-container-low/60"
                    }`}
                  >
                    {/* Rank Badge & User Details */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Rank Number / Medal */}
                      <div className="w-7 text-center shrink-0">
                        {rank === 1 ? (
                          <span className="text-lg">🥇</span>
                        ) : rank === 2 ? (
                          <span className="text-lg">🥈</span>
                        ) : rank === 3 ? (
                          <span className="text-lg">🥉</span>
                        ) : (
                          <span className="font-mono text-xs font-bold text-on-surface-variant">
                            #{rank}
                          </span>
                        )}
                      </div>

                      {/* Initial Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          rank === 1
                            ? "bg-amber-400 text-amber-950 font-bold"
                            : rank === 2
                            ? "bg-slate-300 text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                            : rank === 3
                            ? "bg-amber-700/30 text-amber-800 dark:text-amber-200"
                            : "bg-surface-container text-on-surface"
                        }`}
                      >
                        {entry.name.charAt(0)}
                      </div>

                      {/* Name & School Meta */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-on-surface truncate">
                            {entry.name}
                          </span>
                          {isMe && (
                            <span className="px-1.5 py-0.2 rounded bg-primary text-white text-[9px] font-mono font-bold shadow-sm">
                              KAMU
                            </span>
                          )}
                          {entry.streak && entry.streak >= 2 && (
                            <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-mono font-bold">
                              <Flame className="w-2.5 h-2.5 fill-amber-500" />
                              {entry.streak}h
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-on-surface-variant truncate mt-0.5">
                          <span className="truncate">{entry.school}</span>
                          <span>&bull;</span>
                          <span className="font-mono shrink-0 font-medium">Paket {entry.packageId}</span>
                        </div>
                      </div>
                    </div>

                    {/* Score & Accuracy Badges */}
                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-sm sm:text-base text-primary leading-tight">
                        {entry.score}
                        <span className="text-[10px] font-normal text-on-surface-variant"> IRT</span>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 mt-0.5">
                        <span
                          className={`text-[9px] sm:text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full ${
                            entry.accuracy >= 80
                              ? "bg-success/15 text-success font-bold"
                              : entry.accuracy >= 65
                              ? "bg-primary/10 text-primary"
                              : "bg-warning/15 text-warning"
                          }`}
                        >
                          {entry.accuracy}%
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-mono text-on-surface-variant hidden xs:inline">
                          {formatDuration(entry.durationSeconds)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 6. Footer Info IRT */}
        <section className="p-3 rounded-2xl bg-surface-container-low/70 border border-outline-variant/60 flex items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <p className="text-[11px] leading-snug">
              Skor IRT dikalibrasi sesuai pembobotan logit Kemendikdasmen. Kerjakan tryout berikutnya untuk mendongkrak peringkat!
            </p>
          </div>
          <Link
            href="/simulation"
            className="px-3 py-1.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all shrink-0"
          >
            Tryout
          </Link>
        </section>
      </main>
    </Sidebar>
  );
}
