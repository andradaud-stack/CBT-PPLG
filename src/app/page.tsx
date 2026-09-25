"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { ScoreGauge } from "@/components/ScoreGauge";
import {
  getAttempts,
  getTopicProgress,
  getUserProfile,
  getRemedialQueue,
  getDaysSinceLastActive,
  touchLastActiveTime,
} from "@/lib/storage";
import { getAuthSession } from "@/lib/auth";
import { Attempt, TopicProgress, UserProfile } from "@/types";
import { LearningTargetsCard } from "@/components/LearningTargetsCard";
import {
  BookOpen,
  Clock,
  Sparkles,
  TrendingUp,
  ChevronRight,
  RotateCcw,
  Trophy,
  Bell,
} from "lucide-react";
import { getSystemAnnouncement } from "@/lib/adminStorage";
import { SystemAnnouncement } from "@/types/admin";

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [remedialCount, setRemedialCount] = useState(0);
  const [daysAway, setDaysAway] = useState(0);

  const [announcement, setAnnouncement] = useState<SystemAnnouncement | null>(null);

  useEffect(() => {
    const session = getAuthSession();
    setProfile(session.user || getUserProfile());
    setTopicProgress(getTopicProgress());
    setAttempts(getAttempts());
    setRemedialCount(getRemedialQueue().length);
    setDaysAway(getDaysSinceLastActive());
    setAnnouncement(getSystemAnnouncement());
    touchLastActiveTime();
  }, []);

  const latestScore = profile?.latestIrtScore ?? 0;
  const recentAttempts = attempts.slice(0, 3);

  // Hitung rata-rata penguasaan keseluruhan
  const totalCorrect = topicProgress.reduce((acc, t) => acc + t.totalCorrect, 0);
  const totalAnswered = topicProgress.reduce((acc, t) => acc + t.totalAnswered, 0);
  const avgAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <Sidebar>
      <main className="max-w-6xl mx-auto px-margin py-space-lg space-y-space-md">
        {/* Banner Pengumuman dari Pengawas / Admin */}
        {announcement && announcement.enabled && (
          <div
            className={`p-space-md rounded-2xl border flex items-start gap-3 shadow-elevation-1 animate-fadeIn ${
              announcement.type === "urgent"
                ? "bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200"
                : announcement.type === "warning"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                : announcement.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                : "bg-primary/10 border-primary/20 text-on-surface"
            }`}
          >
            <Bell className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
            <div className="flex-1 text-body-sm">
              <strong className="block text-title-sm mb-0.5">{announcement.title}</strong>
              <p className="text-on-surface-variant leading-relaxed">{announcement.message}</p>
            </div>
          </div>
        )}

        {/* Welcome Greeting & Summary */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl border border-outline-variant shadow-elevation-1">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container border border-primary/20 text-label-sm font-mono mb-space-xs">
              <Sparkles className="w-3.5 h-3.5 text-tertiary" />
              <span>Persiapan TKA PPLG Kemendikdasmen</span>
            </div>
            <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-surface tracking-tight">
              Selamat Belajar, {profile?.name ?? "Siswa"}!
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1">
              {profile?.classGrade} &bull; {profile?.school}
            </p>
          </div>

          <div className="flex items-center gap-space-md self-start md:self-auto bg-surface-container-low px-space-md py-space-sm rounded-lg border border-outline-variant">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
                Skor IRT Terakhir
              </span>
              <span className="font-mono text-headline-lg font-bold text-primary">
                {latestScore > 0 ? (
                  <>
                    {latestScore}
                    <span className="text-body-sm text-on-surface-variant font-normal"> / 800</span>
                  </>
                ) : (
                  <span className="text-title-lg text-on-surface-variant/70 font-semibold">Belum Ada</span>
                )}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* Interactive Goals & Target Motivation Card */}
        <LearningTargetsCard profile={profile} />

        {/* Gentle Study Reminder Banner */}
        {remedialCount > 0 && (
          <section className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-primary/10 border border-amber-500/30 rounded-2xl p-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md shadow-elevation-1 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-title-md text-on-surface">
                  {daysAway >= 2
                    ? `Sudah ${daysAway} hari sejak sesi terakhirmu. Yuk segarkan daya ingat!`
                    : `Ada ${remedialCount} butir soal di Bank Remedial yang siap kamu latih!`}
                </h4>
                <p className="text-body-sm text-on-surface-variant">
                  Mengulang soal yang pernah salah secara berkala (spaced repetition) melatih retensi memori jangka panjang hingga 80%.
                </p>
              </div>
            </div>

            <Link
              href="/remedial"
              className="px-space-md py-2.5 rounded-xl bg-amber-500 text-slate-900 font-bold text-body-sm hover:bg-amber-400 shadow-elevation-1 transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <span>Latih Bank Remedial</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </section>
        )}

        {/* Two Main Entry Doors */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {/* Practice Door */}
          <Link
            href="/practice"
            className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg shadow-elevation-1 hover:shadow-elevation-2 hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-tertiary-container text-tertiary flex items-center justify-center mb-space-md shadow-elevation-1 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-label-sm font-mono text-tertiary font-semibold uppercase tracking-wider">
                Mode Mandiri &bull; Tanpa Batas Waktu
              </span>
              <h2 className="text-headline-sm font-semibold text-on-surface mt-1 group-hover:text-primary transition-colors">
                Latihan Bebas per Topik
              </h2>
              <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
                Belajar santai per sub-topik PPLG. Pembahasan AI muncul seketika setelah setiap soal dijawab untuk memperdalam pemahaman konsep logika dan sintaksis.
              </p>
            </div>

            <div className="mt-space-lg pt-space-md border-t border-outline-variant flex items-center justify-between text-primary font-medium text-body-sm">
              <span className="text-on-surface-variant font-mono text-[12px]">8 Sub-topik Tersedia</span>
              <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Mulai Latihan <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Simulation Door */}
          <Link
            href="/simulation"
            className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg shadow-elevation-1 hover:shadow-elevation-2 hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center mb-space-md shadow-elevation-1 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <span className="text-label-sm font-mono text-primary font-semibold uppercase tracking-wider">
                Mode Resmi &bull; Terstandar TKA
              </span>
              <h2 className="text-headline-sm font-semibold text-on-surface mt-1 group-hover:text-primary transition-colors">
                Simulasi Ujian TKA PPLG
              </h2>
              <p className="text-body-md text-on-surface-variant mt-2 leading-relaxed">
                Uji ketahanan dan kesiapan riil: 30 soal campuran PG biasa dan kompleks, timer ketat 50 menit, dan skor akhir berbasis model IRT (Item Response Theory 200–800).
              </p>
            </div>

            <div className="mt-space-lg pt-space-md border-t border-outline-variant flex items-center justify-between text-primary font-medium text-body-sm">
              <span className="text-on-surface-variant font-mono text-[12px]">30 Soal &bull; 50 Menit &bull; Skor IRT</span>
              <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Masuk Ruang Ujian <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </section>

        {/* Analytics Section: Topic Progress & IRT Score Meter */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          {/* Left 2 Cols: Topic Mastery Matrix */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg shadow-elevation-1">
            <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant mb-space-md">
              <div>
                <h3 className="text-headline-sm font-semibold text-on-surface">
                  Penguasaan 14 Sub-Elemen Resmi Kemendikdasmen
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  5 Elemen Utama Kurikulum PPLG &bull; Akumulasi akurasi latihan dan simulasi
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-label-md font-bold text-primary">
                  {avgAccuracy}%
                </span>
                <span className="block text-[11px] font-mono text-on-surface-variant">
                  Rata-rata Akurasi
                </span>
              </div>
            </div>

            <div className="space-y-space-md max-h-[480px] overflow-y-auto pr-1">
              {topicProgress.map((item) => {
                const isMastered = item.masteryLevel === "Dikuasai";
                const isNotAttempted = item.totalAnswered === 0;

                return (
                  <div key={item.topic} className="space-y-1">
                    <div className="flex items-center justify-between text-body-sm">
                      <div className="flex items-center gap-1.5 truncate max-w-[65%]">
                        {item.elementId && (
                          <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                            E{item.elementId}
                          </span>
                        )}
                        <span className="font-medium text-on-surface truncate">{item.topic}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-label-sm shrink-0">
                        <span className="text-on-surface-variant">
                          {item.totalCorrect}/{item.totalAnswered} ({item.accuracy}%)
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] ${
                            isNotAttempted
                              ? "bg-surface-container text-on-surface-variant"
                              : isMastered
                              ? "bg-success-container text-on-success-container"
                              : "bg-warning-container text-on-warning-container"
                          }`}
                        >
                          {item.masteryLevel}
                        </span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="h-2 w-full rounded-full bg-outline-variant overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isNotAttempted
                            ? "bg-transparent"
                            : isMastered
                            ? "bg-success"
                            : "bg-primary"
                        }`}
                        style={{ width: `${isNotAttempted ? 0 : Math.max(5, item.accuracy)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 1 Col: IRT Score Gauge & Recent Attempts */}
          <div className="space-y-space-lg">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-md shadow-elevation-1 flex flex-col items-center">
              <ScoreGauge score={latestScore} size={180} label="Estimasi Skor IRT" />
            </div>

            {/* Recent Attempts Box */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-md shadow-elevation-1">
              <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant mb-space-sm">
                <h4 className="text-title-md font-semibold text-on-surface">Percobaan Terbaru</h4>
                <Link
                  href="/history"
                  className="text-body-sm text-primary font-medium hover:underline inline-flex items-center"
                >
                  Semua <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentAttempts.length > 0 ? (
                <div className="space-y-space-xs">
                  {recentAttempts.map((att) => (
                    <div
                      key={att.id}
                      className="p-space-xs rounded-lg bg-surface-container-low flex items-center justify-between text-body-sm"
                    >
                      <div>
                        <span className="font-semibold text-on-surface block">
                          {att.mode === "simulation" ? (att.packageName || "Simulasi TKA") : "Latihan Bebas"}
                        </span>
                        <span className="text-[11px] font-mono text-on-surface-variant">
                          {new Date(att.startedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="text-right">
                        {att.irtResult ? (
                          <span className="font-mono font-bold text-label-md text-primary">
                            {att.irtResult.score} IRT
                          </span>
                        ) : (
                          <span className="font-mono text-label-sm text-success">Selesai</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-space-md text-center text-on-surface-variant space-y-1.5">
                  <p className="text-body-sm">Belum ada riwayat pengerjaan.</p>
                  <Link
                    href="/simulation"
                    className="inline-flex items-center gap-1 text-body-xs font-semibold text-primary hover:underline"
                  >
                    Mulai Tryout Paket 1 <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Leaderboard Card */}
            <div className="bg-gradient-to-r from-amber-500/10 via-primary/5 to-surface-container-lowest border border-amber-500/20 rounded-xl p-space-md shadow-elevation-1 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-headline-sm shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-title-md text-on-surface leading-tight">
                    Papan Peringkat TKA
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Lihat peringkatmu vs siswa SMK se-Indonesia
                  </p>
                </div>
              </div>

              <Link
                href="/leaderboard"
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-body-xs hover:bg-amber-400 shadow-sm transition-all shrink-0 flex items-center gap-1"
              >
                <span>Lihat Rank</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Sidebar>
  );
}
