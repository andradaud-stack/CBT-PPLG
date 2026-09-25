"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import {
  getAttempts,
  getTopicProgress,
  getUserProfile,
  resetAllDataToZero,
  getTopicSpeedMetrics,
} from "@/lib/storage";
import { Attempt, TopicProgress, UserProfile, TopicSpeedMetric } from "@/types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Calendar,
  Layers,
  RotateCcw,
  Check,
} from "lucide-react";

export default function HistoryProgressPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [speedMetrics, setSpeedMetrics] = useState<TopicSpeedMetric[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [hasJustReset, setHasJustReset] = useState(false);

  useEffect(() => {
    setAttempts(getAttempts());
    setTopicProgress(getTopicProgress());
    setProfile(getUserProfile());
    setSpeedMetrics(getTopicSpeedMetrics());
  }, []);

  const handleResetData = () => {
    resetAllDataToZero();
    setAttempts([]);
    setTopicProgress(getTopicProgress());
    setProfile(getUserProfile());
    setShowResetConfirm(false);
    setHasJustReset(true);
    setTimeout(() => setHasJustReset(false), 3000);
  };

  // Format data untuk grafik Recharts
  const chartData = attempts
    .filter((a) => a.irtResult)
    .map((a, idx) => {
      const date = new Date(a.startedAt);
      return {
        session: `Ujian ${idx + 1}`,
        date: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        skor: a.irtResult?.score ?? 500,
        akurasi: a.irtResult?.overallAccuracy ?? 0,
      };
    })
    .reverse();

  return (
    <Sidebar>
      <main className="max-w-6xl mx-auto px-margin py-space-xl space-y-space-xl animate-fadeIn w-full">
        {/* Header & Reset Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
          <div>
            <span className="text-label-sm font-mono text-primary font-semibold px-3 py-1 rounded-full bg-primary/10">
              Analisis Komparatif &bull; Multi-Attempt
            </span>
            <h1 className="text-display-lg-mobile md:text-display-lg font-bold text-on-surface tracking-tight mt-space-xs">
              Riwayat &amp; Tren Progres Belajar
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1">
              Pantau pertumbuhan skor IRT {profile?.name ? `untuk ${profile.name}` : ""} antarsesi ujian dan matriks penguasaan 8 sub-topik kejuruan PPLG.
            </p>
          </div>

          <div className="flex items-center gap-space-sm self-start sm:self-auto shrink-0">
            {hasJustReset && (
              <span className="text-body-xs font-mono text-success flex items-center gap-1 bg-success-container px-2.5 py-1 rounded-lg">
                <Check className="w-3.5 h-3.5" /> Riwayat Direset ke Nol
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-space-md py-2 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface hover:bg-error-container hover:text-on-error-container hover:border-error/30 text-body-sm font-semibold transition-all flex items-center gap-1.5 shadow-elevation-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Riwayat ke Nol</span>
            </button>
          </div>
        </div>

        {/* Section 1: IRT Score Trend Graph (Recharts) */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg shadow-elevation-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md border-b border-outline-variant mb-space-lg gap-space-xs">
            <div>
              <div className="flex items-center gap-space-xs">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-headline-sm font-semibold text-on-surface">
                  Grafik Pertumbuhan Skor IRT (Skala 200–800)
                </h2>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-0.5">
                Target ambang batas kompeten TKA Nasional: 500 poin
              </p>
            </div>

            <div className="flex items-center gap-space-md font-mono text-label-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span>Skor IRT</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis domain={[200, 800]} stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgba(67, 56, 202, 0.08)",
                      fontFamily: "monospace",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="skor"
                    name="Skor IRT"
                    stroke="#4338ca"
                    strokeWidth={3}
                    dot={{ fill: "#4338ca", r: 5 }}
                    activeDot={{ r: 8, stroke: "#6366f1", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-space-md space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-title-md text-on-surface">Belum Ada Riwayat Ujian</h4>
                <p className="text-body-sm text-on-surface-variant max-w-md">
                  Grafik pertumbuhan skor IRT akan otomatis terbentuk setelah Anda menyelesaikan salah satu paket pada menu Simulasi Ujian.
                </p>
                <Link
                  href="/simulation"
                  className="mt-2 inline-flex items-center gap-1.5 px-space-md py-2 rounded-xl bg-primary text-on-primary font-semibold text-body-xs hover:bg-primary-container transition-all shadow-elevation-1"
                >
                  <span>Mulai Tryout Paket 1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Matriks Penguasaan per Sub-Topik (Dikuasai / Perlu Diulang / Belum Dicoba) */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg shadow-elevation-1">
          <div className="flex items-center gap-space-xs pb-space-sm border-b border-outline-variant mb-space-md">
            <Layers className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-headline-sm font-semibold text-on-surface">
                Status Penguasaan 14 Sub-Elemen Resmi Kemendikdasmen
              </h2>
              <p className="text-body-xs text-on-surface-variant">
                5 Elemen Utama Kurikulum Resmi PPLG &bull; Dimulai dari Nol (Clean Slate)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {topicProgress.map((tp) => {
              const isMastered = tp.masteryLevel === "Dikuasai";
              const isNeedsRepeat = tp.masteryLevel === "Perlu Diulang";
              const isNotAttempted = tp.totalAnswered === 0;

              let badgeStyle = "bg-surface-container text-on-surface-variant";
              let Icon = HelpCircle;

              if (isMastered) {
                badgeStyle = "bg-success-container text-on-success-container border border-success/30";
                Icon = CheckCircle2;
              } else if (isNeedsRepeat) {
                badgeStyle = "bg-warning-container text-on-warning-container border border-warning/30";
                Icon = AlertTriangle;
              }

              return (
                <div
                  key={tp.topic}
                  className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant flex flex-col justify-between"
                >
                  <div>
                    {tp.elementName && (
                      <span className="text-[10px] font-mono font-semibold text-primary/80 uppercase block truncate mb-1.5">
                        Elemen {tp.elementId}: {tp.elementName}
                      </span>
                    )}
                    <div className="flex items-center justify-between gap-space-xs mb-space-xs">
                      <span className={`px-2.5 py-0.5 rounded-full text-label-sm font-mono flex items-center gap-1 ${badgeStyle}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {tp.masteryLevel}
                      </span>
                    </div>
                    <h3 className="font-semibold text-title-sm text-on-surface mt-1 leading-snug">{tp.topic}</h3>
                  </div>

                  <div className="mt-space-md pt-space-xs border-t border-outline-variant/60">
                    <div className="flex items-center justify-between font-mono text-label-sm mb-1.5">
                      <span className="text-on-surface-variant">Akurasi:</span>
                      <span className="font-bold text-on-surface">{tp.accuracy}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-outline-variant overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isNotAttempted
                            ? "bg-transparent"
                            : isMastered
                            ? "bg-success"
                            : "bg-primary"
                        }`}
                        style={{ width: `${isNotAttempted ? 0 : Math.max(5, tp.accuracy)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-on-surface-variant block mt-1">
                      {tp.totalCorrect} dari {tp.totalAnswered} soal benar
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2.5: Analisis Kecepatan & Efisiensi Menjawab (Time-to-Answer) */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg shadow-elevation-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-sm border-b border-outline-variant mb-space-md gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-headline-sm font-semibold text-on-surface">
                  Analisis Kecepatan &amp; Efisiensi Menjawab per Topik
                </h2>
              </div>
              <p className="text-body-xs text-on-surface-variant mt-0.5">
                Mengidentifikasi topik &quot;Paham tapi Lambat&quot; vs &quot;Belum Paham&quot; untuk mengoptimalkan manajemen waktu saat ujian riil.
              </p>
            </div>
            <span className="font-mono text-label-sm text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full shrink-0">
              Target Ideal: &le; 90 detik/soal
            </span>
          </div>

          {speedMetrics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {speedMetrics.map((sm) => {
                const isFast = sm.speedCategory === "cepat";
                const isSlow = sm.speedCategory === "lambat";
                const isHighAcc = sm.accuracy >= 75;

                return (
                  <div
                    key={sm.topic}
                    className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-title-sm text-on-surface truncate" title={sm.topic}>
                          {sm.topic}
                        </span>
                        <span
                          className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isFast
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                              : isSlow
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                              : "bg-surface-container text-on-surface-variant"
                          }`}
                        >
                          {sm.avgSeconds}s / soal
                        </span>
                      </div>

                      <div className="text-[12px] text-on-surface-variant font-medium pt-1">
                        {sm.insight === "paham-cepat" && "⚡ Paham & Cepat: Refleks konsep sangat matang!"}
                        {sm.insight === "paham-lambat" && "⏳ Tepat tapi Lambat: Akurat, namun butuh efisiensi waktu."}
                        {sm.insight === "kurang-teliti" && "💨 Cepat tapi Terburu-buru: Teliti kembali opsi jawaban."}
                        {sm.insight === "belum-paham" && "⚠️ Perlu Pendalaman: Butuh review di Bank Remedial."}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/60 flex items-center justify-between font-mono text-[11px] text-on-surface-variant">
                      <span>{sm.totalQuestions} Soal Terpantau</span>
                      <span className={`font-bold ${isHighAcc ? "text-success" : "text-warning"}`}>
                        Akurasi {sm.accuracy}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-space-md text-center text-on-surface-variant space-y-1">
              <p className="text-body-sm">Belum cukup data kecepatan pengerjaan.</p>
              <p className="text-[12px] text-on-surface-variant/70">
                Selesaikan beberapa latihan bebas atau simulasi tryout untuk mengaktifkan kalkulasi kecepatan otomatis.
              </p>
            </div>
          )}
        </section>

        {/* Section 3: Daftar Riwayat Sesi (Log Sesi) */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg shadow-elevation-1">
          <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant mb-space-md">
            <h2 className="text-headline-sm font-semibold text-on-surface">Daftar Sesi Pengerjaan</h2>
            <span className="font-mono text-label-sm text-on-surface-variant">
              {attempts.length} Total Sesi
            </span>
          </div>

          {attempts.length > 0 ? (
            <div className="divide-y divide-outline-variant">
              {attempts.map((att) => {
                const minutes = Math.floor(att.durationSeconds / 60);
                const isSim = att.mode === "simulation";

                return (
                  <div
                    key={att.id}
                    className="py-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm first:pt-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-space-xs">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-label-sm font-mono ${
                            isSim
                              ? "bg-primary-fixed text-on-primary-fixed-variant font-semibold"
                              : "bg-tertiary-container text-on-tertiary-container"
                          }`}
                        >
                          {isSim ? (att.packageName || "Simulasi TKA (30 Soal)") : `Latihan Bebas: ${att.topic ?? "Umum"}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-space-sm text-body-sm text-on-surface-variant font-mono text-[12px]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(att.startedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Durasi: {minutes} menit
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-space-md">
                      {att.irtResult && (
                        <div className="text-right font-mono">
                          <span className="text-[11px] text-on-surface-variant block uppercase">
                            Skor IRT
                          </span>
                          <span className="text-headline-sm font-bold text-primary">
                            {att.irtResult.score}
                          </span>
                        </div>
                      )}

                      {isSim && (
                        <Link
                          href={`/simulation/result/${att.id}`}
                          className="px-space-md py-1.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface hover:border-primary/60 text-body-sm font-medium transition-colors inline-flex items-center gap-1"
                        >
                          Detail <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-space-xl text-center text-on-surface-variant space-y-2">
              <Clock className="w-10 h-10 text-on-surface-variant/40 mx-auto" />
              <p className="font-semibold text-title-md text-on-surface">Belum Ada Sesi Ujian</p>
              <p className="text-body-sm text-on-surface-variant max-w-sm mx-auto">
                Setiap sesi latihan mandiri dan paket tryout yang Anda kerjakan akan tercatat rapi di sini.
              </p>
              <Link
                href="/simulation"
                className="inline-flex items-center gap-1.5 px-space-lg py-2.5 rounded-xl bg-primary text-on-primary text-body-sm font-bold hover:bg-primary-container shadow-elevation-1 transition-all mt-2"
              >
                Mulai Simulasi Paket 1
              </Link>
            </div>
          )}
        </section>

        {/* Modal Konfirmasi Reset */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-margin bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl border border-outline-variant p-space-lg shadow-elevation-3 space-y-space-md">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto mb-space-sm">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <h3 className="text-headline-sm font-bold text-on-surface">
                  Reset Semua Riwayat ke Nol?
                </h3>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Aksi ini akan menghapus seluruh data simulasi, mengunci kembali Paket 2 s.d. 10, dan mengembalikan penguasaan 8 sub-topik ke status &ldquo;Belum Dicoba&rdquo;.
                </p>
              </div>

              <div className="flex items-center gap-space-sm pt-space-xs">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-space-sm rounded-lg border border-outline-variant text-on-surface font-medium hover:bg-surface-container-low transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="flex-1 py-space-sm rounded-lg bg-error text-on-error font-bold hover:bg-red-700 shadow-elevation-1 transition-all"
                >
                  Ya, Reset ke Nol
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Sidebar>
  );
}
