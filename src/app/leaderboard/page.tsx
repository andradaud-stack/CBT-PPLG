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
  Filter,
  RefreshCw,
  ChevronRight,
  TrendingUp,
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
    (e) => e.userId === currentUser?.id || (currentUser?.name && e.name.toLowerCase() === currentUser.name.toLowerCase())
  );
  const currentUserEntry = currentUserEntryIndex >= 0 ? filteredEntries[currentUserEntryIndex] : null;
  const currentUserRank = currentUserEntryIndex >= 0 ? currentUserEntryIndex + 1 : null;

  // Top 3 Podium
  const podiumTop3 = useMemo(() => {
    return filteredEntries.slice(0, 3);
  }, [filteredEntries]);

  // Format durasi
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  return (
    <Sidebar>
      <main className="max-w-6xl mx-auto px-margin py-space-lg space-y-space-xl">
        {/* Header Banner */}
        <section className="bg-gradient-to-r from-amber-500/10 via-primary/10 to-surface-container-lowest border border-amber-500/30 rounded-2xl p-space-lg shadow-elevation-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-label-sm font-mono mb-space-xs">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Peringkat Terbuka Bersama &bull; Real-time Multi-User</span>
              </div>
              <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-surface tracking-tight">
                Papan Peringkat TKA PPLG
              </h1>
              <p className="text-body-md text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
                Klasemen kompetisi resmi antar siswa SMK PPLG se-Indonesia yang dihitung berdasarkan model evaluasi IRT Kemendikdasmen (200–800) dan akurasi soal.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success-container/60 text-on-success-container border border-success/30 text-body-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                <span>Server Terhubung</span>
              </div>

              <button
                type="button"
                onClick={() => fetchLeaderboard(true)}
                disabled={isRefreshing}
                className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-body-xs font-semibold border border-outline-variant flex items-center gap-1.5 transition-all shadow-elevation-1 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
                <span>Segarkan</span>
              </button>
            </div>
          </div>
        </section>

        {/* Current User Status Card */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-md shadow-elevation-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-headline-sm shadow-elevation-1 shrink-0">
                {currentUserRank ? `#${currentUserRank}` : <User className="w-6 h-6" />}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant font-semibold block">
                  Status Peringkat Anda
                </span>
                <h3 className="font-bold text-title-md text-on-surface">
                  {currentUser?.name || "Siswa PPLG"}
                </h3>
                <p className="text-body-xs text-on-surface-variant">
                  {currentUser?.classGrade || "XII PPLG"} &bull; {currentUser?.school || "SMK"}
                </p>
              </div>
            </div>

            {currentUserEntry ? (
              <div className="flex items-center gap-space-lg self-start sm:self-auto bg-surface-container-low px-space-md py-space-xs rounded-xl border border-outline-variant">
                <div className="text-center">
                  <span className="text-[10px] font-mono text-on-surface-variant block uppercase font-semibold">
                    Peringkat
                  </span>
                  <span className="font-mono text-headline-sm font-bold text-amber-500">
                    #{currentUserRank}
                    <span className="text-body-xs text-on-surface-variant font-normal"> / {filteredEntries.length}</span>
                  </span>
                </div>
                <div className="w-px h-8 bg-outline-variant" />
                <div className="text-center">
                  <span className="text-[10px] font-mono text-on-surface-variant block uppercase font-semibold">
                    Skor IRT
                  </span>
                  <span className="font-mono text-headline-sm font-bold text-primary">
                    {currentUserEntry.score}
                  </span>
                </div>
                <div className="w-px h-8 bg-outline-variant" />
                <div className="text-center">
                  <span className="text-[10px] font-mono text-on-surface-variant block uppercase font-semibold">
                    Akurasi
                  </span>
                  <span className="font-mono text-headline-sm font-bold text-success">
                    {currentUserEntry.accuracy}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <p className="text-body-sm text-on-surface-variant">
                  Anda belum tercatat di papan peringkat paket ini.
                </p>
                <Link
                  href="/simulation"
                  className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-semibold text-body-sm hover:bg-primary-container shadow-elevation-1 transition-all inline-flex items-center gap-1.5 shrink-0"
                >
                  <span>Mulai Tryout Resmi</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Podium Top 3 Juara (Visual Crown Standings) */}
        {podiumTop3.length >= 3 && !searchQuery && (
          <section className="space-y-space-md">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-title-lg font-bold text-on-surface">
                Podium 3 Besar Teratas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md items-end pt-8">
              {/* Rank 2: Perak (Left) */}
              <div className="bg-surface-container-lowest border-2 border-slate-300 dark:border-slate-600 rounded-2xl p-space-md text-center shadow-elevation-2 relative order-2 md:order-1 flex flex-col justify-between min-h-[220px]">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-title-md border-2 border-slate-300 dark:border-slate-500 shadow-elevation-1">
                  🥈
                </div>

                <div className="pt-4 space-y-1">
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-mono font-bold uppercase">
                    Juara 2 &bull; Medali Perak
                  </span>
                  <h3 className="font-bold text-title-md text-on-surface truncate">
                    {podiumTop3[1].name}
                  </h3>
                  <p className="text-[12px] text-on-surface-variant truncate">
                    {podiumTop3[1].school}
                  </p>
                </div>

                <div className="pt-space-xs border-t border-outline-variant space-y-1 mt-space-sm">
                  <div className="font-mono text-display-lg-mobile font-bold text-slate-700 dark:text-slate-200">
                    {podiumTop3[1].score}
                    <span className="text-body-xs font-normal text-on-surface-variant"> IRT</span>
                  </div>
                  <div className="text-[11px] font-mono text-on-surface-variant flex justify-center gap-3">
                    <span>Akurasi: <strong>{podiumTop3[1].accuracy}%</strong></span>
                    <span>Waktu: <strong>{formatDuration(podiumTop3[1].durationSeconds)}</strong></span>
                  </div>
                </div>
              </div>

              {/* Rank 1: Emas (Center & Tallest) */}
              <div className="bg-surface-container-lowest border-2 border-amber-400 dark:border-amber-500 rounded-2xl p-space-lg text-center shadow-elevation-3 relative order-1 md:order-2 flex flex-col justify-between min-h-[260px] bg-gradient-to-b from-amber-500/5 to-surface-container-lowest">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-headline-sm border-2 border-amber-300 shadow-elevation-2 animate-bounce">
                  👑
                </div>

                <div className="pt-4 space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-mono font-bold uppercase">
                    🥇 Juara 1 &bull; Peringkat Tertinggi
                  </span>
                  <h3 className="font-bold text-headline-sm text-on-surface truncate">
                    {podiumTop3[0].name}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant truncate font-medium">
                    {podiumTop3[0].school} &bull; {podiumTop3[0].classGrade}
                  </p>
                </div>

                <div className="pt-space-sm border-t border-amber-400/40 space-y-1 mt-space-sm">
                  <div className="font-mono text-display-lg font-bold text-amber-500">
                    {podiumTop3[0].score}
                    <span className="text-body-sm font-normal text-on-surface-variant"> IRT</span>
                  </div>
                  <div className="text-[12px] font-mono text-on-surface-variant flex justify-center gap-3">
                    <span>Akurasi: <strong className="text-success">{podiumTop3[0].accuracy}%</strong></span>
                    <span>Durasi: <strong>{formatDuration(podiumTop3[0].durationSeconds)}</strong></span>
                  </div>
                </div>
              </div>

              {/* Rank 3: Perunggu (Right) */}
              <div className="bg-surface-container-lowest border-2 border-amber-700/40 dark:border-amber-700/60 rounded-2xl p-space-md text-center shadow-elevation-2 relative order-3 flex flex-col justify-between min-h-[200px]">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-title-md border-2 border-amber-700/40 shadow-elevation-1">
                  🥉
                </div>

                <div className="pt-4 space-y-1">
                  <span className="px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold uppercase">
                    Juara 3 &bull; Medali Perunggu
                  </span>
                  <h3 className="font-bold text-title-md text-on-surface truncate">
                    {podiumTop3[2].name}
                  </h3>
                  <p className="text-[12px] text-on-surface-variant truncate">
                    {podiumTop3[2].school}
                  </p>
                </div>

                <div className="pt-space-xs border-t border-outline-variant space-y-1 mt-space-sm">
                  <div className="font-mono text-display-lg-mobile font-bold text-amber-700 dark:text-amber-400">
                    {podiumTop3[2].score}
                    <span className="text-body-xs font-normal text-on-surface-variant"> IRT</span>
                  </div>
                  <div className="text-[11px] font-mono text-on-surface-variant flex justify-center gap-3">
                    <span>Akurasi: <strong>{podiumTop3[2].accuracy}%</strong></span>
                    <span>Waktu: <strong>{formatDuration(podiumTop3[2].durationSeconds)}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filter, Search & Table Controls */}
        <section className="space-y-space-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama peserta atau sekolah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-space-md py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
              />
            </div>

            {/* Filter by Package & Sort */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant text-body-xs">
                <Filter className="w-3.5 h-3.5 text-on-surface-variant" />
                <span className="font-mono text-on-surface-variant">Paket:</span>
                <select
                  value={packageFilter}
                  onChange={(e) => setPackageFilter(e.target.value)}
                  className="bg-transparent text-on-surface font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="all">Semua Paket Tryout</option>
                  {TRYOUT_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      Paket {pkg.id}: {pkg.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant text-body-xs">
                <TrendingUp className="w-3.5 h-3.5 text-on-surface-variant" />
                <span className="font-mono text-on-surface-variant">Urut:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "score" | "streak" | "recent")}
                  className="bg-transparent text-on-surface font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="score">Skor Tertinggi (IRT)</option>
                  <option value="streak">Streak Terbanyak 🔥</option>
                  <option value="recent">Terbaru Diselesaikan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leaderboard Table Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-elevation-1 overflow-hidden">
            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                <p className="text-body-sm font-mono text-on-surface-variant">
                  Memuat data klasemen peserta...
                </p>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="py-16 text-center space-y-3 px-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto shadow-elevation-1">
                  <Trophy className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-headline-sm text-on-surface">Papan Peringkat Masih Bersih</h4>
                <p className="text-body-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  Belum ada peserta yang menyelesaikan simulasi tryout. Jadilah peserta pertama yang menyelesaikan ujian dan menduduki posisi puncak klasemen!
                </p>
                <div className="pt-2">
                  <Link
                    href="/simulation"
                    className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-primary text-on-primary font-bold text-body-sm hover:bg-primary-container shadow-elevation-1 transition-all"
                  >
                    <span>Mulai Tryout Paket 1</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-low/50 text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
                      <th className="py-3 px-space-md w-16 text-center">Rank</th>
                      <th className="py-3 px-space-md">Peserta & Asal Sekolah</th>
                      <th className="py-3 px-space-md hidden sm:table-cell">Paket Tryout</th>
                      <th className="py-3 px-space-md text-center">Akurasi</th>
                      <th className="py-3 px-space-md text-center hidden md:table-cell">Durasi</th>
                      <th className="py-3 px-space-md text-right">Skor IRT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60 text-body-sm">
                    {filteredEntries.map((entry, index) => {
                      const rank = index + 1;
                      const isMe =
                        entry.userId === currentUser?.id ||
                        (currentUser?.name && entry.name.toLowerCase() === currentUser.name.toLowerCase());

                      return (
                        <tr
                          key={entry.id}
                          className={`hover:bg-surface-container-low/50 transition-colors ${
                            isMe ? "bg-primary/5 font-semibold" : ""
                          }`}
                        >
                          {/* Rank Icon / Number */}
                          <td className="py-3.5 px-space-md text-center">
                            {rank === 1 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400 font-bold text-label-md">
                                🥇
                              </span>
                            ) : rank === 2 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300/30 text-slate-700 dark:text-slate-300 font-bold text-label-md">
                                🥈
                              </span>
                            ) : rank === 3 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-700 dark:text-amber-400 font-bold text-label-md">
                                🥉
                              </span>
                            ) : (
                              <span className="font-mono text-label-md text-on-surface-variant font-bold">
                                #{rank}
                              </span>
                            )}
                          </td>

                          {/* Name & School */}
                          <td className="py-3.5 px-space-md">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface flex items-center justify-center font-bold text-label-sm shrink-0">
                                {entry.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-on-surface truncate block">
                                    {entry.name}
                                  </span>
                                  {isMe && (
                                    <span className="px-1.5 py-0.2 rounded bg-primary text-white text-[10px] font-mono font-bold">
                                      KAMU
                                    </span>
                                  )}
                                  {entry.streak && entry.streak >= 3 && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold">
                                      <Flame className="w-2.5 h-2.5 fill-amber-500" />
                                      {entry.streak}h
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-on-surface-variant truncate block">
                                  {entry.school} &bull; {entry.classGrade}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Package */}
                          <td className="py-3.5 px-space-md hidden sm:table-cell">
                            <span className="text-body-xs font-mono text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-md">
                              Paket {entry.packageId}
                            </span>
                          </td>

                          {/* Accuracy */}
                          <td className="py-3.5 px-space-md text-center">
                            <span
                              className={`font-mono text-body-sm font-semibold ${
                                entry.accuracy >= 80
                                  ? "text-success"
                                  : entry.accuracy >= 65
                                  ? "text-primary"
                                  : "text-warning"
                              }`}
                            >
                              {entry.accuracy}%
                            </span>
                          </td>

                          {/* Duration */}
                          <td className="py-3.5 px-space-md text-center font-mono text-[12px] text-on-surface-variant hidden md:table-cell">
                            {formatDuration(entry.durationSeconds)}
                          </td>

                          {/* Score */}
                          <td className="py-3.5 px-space-md text-right">
                            <span className="font-mono text-headline-sm font-bold text-primary block leading-none">
                              {entry.score}
                            </span>
                            <span className="font-mono text-[10px] text-on-surface-variant">
                              &theta;: {entry.theta >= 0 ? `+${entry.theta.toFixed(2)}` : entry.theta.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Tips & Fairness Footer Card */}
        <section className="p-space-md rounded-2xl bg-surface-container-low/60 border border-outline-variant flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md text-body-sm text-on-surface-variant">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-on-surface text-body-md">
                Transparansi & Akurasi Penilaian IRT
              </h4>
              <p className="text-body-xs leading-relaxed">
                Skor IRT memperhitungkan tingkat kesulitan masing-masing soal. Menjawab benar soal sulit bernilai bobot logit (&theta;) lebih tinggi daripada soal mudah.
              </p>
            </div>
          </div>

          <Link
            href="/simulation"
            className="px-space-md py-2.5 rounded-xl bg-primary text-on-primary font-bold text-body-sm hover:bg-primary-container shadow-elevation-1 transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Tingkatkan Peringkat</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </Sidebar>
  );
}
