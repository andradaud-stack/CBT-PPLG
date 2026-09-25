"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { getAuthSession, updateUserProfile, logoutUser } from "@/lib/auth";
import { getAttempts, getTopicProgress, getUserProfile, resetAllApplicationData } from "@/lib/storage";
import { UserProfile, Attempt, TopicProgress } from "@/types";
import {
  User,
  School,
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  LogOut,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Target,
  Flame,
  Trash2,
} from "lucide-react";
import { getLearningGoals, getExamCountdown } from "@/lib/targets";
import { LearningGoals } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [goals, setGoals] = useState<LearningGoals | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status feedback
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const session = getAuthSession();
    const current = session.user || getUserProfile();
    setProfile(current);
    setName(current.name || "");
    setEmail(current.email || "");
    setSchool(current.school || "");
    setClassGrade(current.classGrade || "");

    const userAttempts = getAttempts();
    setAttempts(userAttempts);
    setTopicProgress(getTopicProgress());
    setGoals(getLearningGoals());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!name.trim()) {
      setMessage({ type: "error", text: "Nama lengkap tidak boleh kosong." });
      return;
    }
    if (!school.trim()) {
      setMessage({ type: "error", text: "Nama sekolah tidak boleh kosong." });
      return;
    }
    if (!classGrade.trim()) {
      setMessage({ type: "error", text: "Kelas dan rombel tidak boleh kosong." });
      return;
    }
    if (password && password.length < 6) {
      setMessage({ type: "error", text: "Kata sandi baru minimal harus 6 karakter." });
      return;
    }
    if (password && password !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi kata sandi tidak cocok." });
      return;
    }

    setIsSaving(true);

    try {
      const result = updateUserProfile({
        name,
        email,
        school,
        classGrade,
        ...(password ? { password } : {}),
      });

      if (result.success && result.user) {
        setProfile(result.user);
        setPassword("");
        setConfirmPassword("");
        setMessage({
          type: "success",
          text: "Profil siswa berhasil diperbarui dan tersinkronisasi!",
        });
        setTimeout(() => {
          setMessage(null);
        }, 4000);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Gagal memperbarui profil.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan saat menyimpan profil." });
    } finally {
      setIsSaving(false);
    }
  };

  const [isResetting, setIsResetting] = useState(false);

  const handleResetToSaved = () => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setSchool(profile.school);
      setClassGrade(profile.classGrade);
      setPassword("");
      setConfirmPassword("");
      setMessage(null);
    }
  };

  const handleResetAllData = async () => {
    const confirmed = window.confirm(
      "PERINGATAN RESIK: Apakah Anda yakin ingin menghapus SEMUA data aplikasi (riwayat tryout, skor IRT, leaderboard, bookmark, antrean remedial, dan sesi lokal) ke kondisi awal sebelum deploy? Tindakan ini tidak dapat dibatalkan."
    );
    if (!confirmed) return;

    setIsResetting(true);
    try {
      resetAllApplicationData();
      await fetch("/api/leaderboard", { method: "DELETE" }).catch(() => {});
      setMessage({
        type: "success",
        text: "Semua data aplikasi berhasil direset bersih ke kondisi awal pabrik.",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch {
      setMessage({
        type: "error",
        text: "Gagal mereset data aplikasi.",
      });
      setIsResetting(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  // Hitung metrik belajar siswa
  const completedAttempts = attempts.filter((a) => !!a.finishedAt || !!a.irtResult);
  const masteredTopicsCount = topicProgress.filter((t) => t.masteryLevel === "Dikuasai").length;
  const highestIrt = attempts.reduce((max, a) => {
    return Math.max(max, a.irtResult?.score || 0);
  }, profile?.latestIrtScore || 0);

  const initialLetter = name ? name.trim().charAt(0).toUpperCase() : "S";

  return (
    <Sidebar>
      <div className="flex-1 bg-surface p-margin lg:p-space-xl overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-space-lg">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-space-sm border-b border-outline-variant">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-mono font-semibold border border-primary/20">
                  Data Siswa & Pengaturan
                </span>
                <span className="text-[11px] font-mono text-on-surface-variant flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  Akun Terverifikasi
                </span>
              </div>
              <h1 className="text-headline-lg font-bold text-on-surface tracking-tight">
                Profil Siswa
              </h1>
              <p className="text-body-sm text-on-surface-variant">
                Kelola informasi biodata, asal sekolah, kelas, dan kredensial akun CBT-PPLG Anda.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/simulation"
                className="px-3.5 py-2 rounded-xl bg-tertiary-container text-primary font-semibold text-body-sm hover:bg-tertiary-container/80 transition-all flex items-center gap-1.5 border border-primary/20"
              >
                <span>Mulai Tryout</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-error-container text-on-error-container font-semibold text-body-sm hover:opacity-90 transition-all flex items-center gap-1.5 border border-error/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          {/* Feedback Message Banner */}
          {message && (
            <div
              className={`p-space-sm rounded-xl flex items-center gap-3 border transition-all animate-fadeIn ${
                message.type === "success"
                  ? "bg-success-container/70 border-success/30 text-on-success-container"
                  : "bg-error-container/70 border-error/30 text-on-error-container"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-error shrink-0" />
              )}
              <span className="text-body-sm font-medium">{message.text}</span>
            </div>
          )}

          {/* Profile Overview Card & Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
            {/* User Hero Card */}
            <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-elevation-1 flex flex-col justify-between">
              <div className="space-y-space-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center font-bold text-headline-lg shadow-elevation-1">
                    {initialLetter}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-title-md font-bold text-on-surface truncate">
                      {name || "Nama Siswa"}
                    </h2>
                    <p className="text-body-xs font-mono text-on-surface-variant truncate">
                      {email || "email@smk.sch.id"}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-semibold">
                      {classGrade || "XII PPLG"}
                    </span>
                  </div>
                </div>

                <div className="pt-space-xs border-t border-outline-variant space-y-2 text-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{school || "SMK Belum Diatur"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-tertiary shrink-0" />
                    <span>Kurikulum Merdeka SMK — Konsentrasi PPLG</span>
                  </div>
                </div>
              </div>

              <div className="mt-space-md pt-space-xs border-t border-outline-variant flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                <span>ID Akun:</span>
                <span className="font-semibold text-on-surface">{profile?.id || "user-001"}</span>
              </div>
            </div>

            {/* Quick Learning Stats */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-elevation-1 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-body-xs font-mono text-on-surface-variant uppercase font-semibold">
                    Skor IRT Terakhir
                  </span>
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div className="mt-2">
                  <div className="text-display-lg-mobile font-bold text-primary">
                    {profile?.latestIrtScore ? profile.latestIrtScore : 0}
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Skor Tertinggi: <span className="font-semibold text-on-surface">{highestIrt}</span>
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono text-tertiary">
                  Model 2-PL Rasch IRT
                </div>
              </div>

              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-elevation-1 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-body-xs font-mono text-on-surface-variant uppercase font-semibold">
                    Simulasi Selesai
                  </span>
                  <BookOpen className="w-5 h-5 text-secondary" />
                </div>
                <div className="mt-2">
                  <div className="text-display-lg-mobile font-bold text-on-surface">
                    {completedAttempts.length}
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Dari 10 Paket Tryout Resmi
                  </p>
                </div>
                <Link
                  href="/history"
                  className="mt-2 text-[10px] font-mono text-primary font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Lihat Riwayat &rarr;
                </Link>
              </div>

              <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-elevation-1 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-body-xs font-mono text-on-surface-variant uppercase font-semibold">
                    Sub-Elemen Dikuasai
                  </span>
                  <Target className="w-5 h-5 text-success" />
                </div>
                <div className="mt-2">
                  <div className="text-display-lg-mobile font-bold text-success">
                    {masteredTopicsCount}
                    <span className="text-title-md font-normal text-on-surface-variant">/14</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Standar Kemendikdasmen
                  </p>
                </div>
                <div className="mt-2 text-[10px] font-mono text-on-surface-variant">
                  {masteredTopicsCount === 14 ? "Lengkap 100%" : "Perlu latihan lanjutan"}
                </div>
              </div>
            </div>

            {/* Target Belajar & Motivasi Banner */}
            {goals && (
              <div className="lg:col-span-3 p-space-md rounded-2xl bg-gradient-to-r from-primary/10 via-amber-500/10 to-surface-container-lowest border border-primary/20 shadow-elevation-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-elevation-1">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-body-md text-on-surface flex items-center gap-2">
                      <span>Target Skor: {goals.targetIrtScore} IRT</span>
                      <span className="text-on-surface-variant font-normal">&bull;</span>
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        Streak {goals.currentStreak} Hari
                      </span>
                    </h3>
                    <p className="text-[12px] text-on-surface-variant">
                      Hari ini: {goals.todayQuestionsAnswered}/{goals.dailyQuestionsGoal} butir soal tuntas &bull; {getExamCountdown(goals.examDate).daysLeft} hari menuju simulasi resmi
                    </p>
                  </div>
                </div>

                <Link
                  href="/"
                  className="px-3 py-1.5 rounded-xl bg-primary text-on-primary font-semibold text-body-xs hover:bg-primary-container shadow-elevation-1 transition-all self-start sm:self-auto flex items-center gap-1 shrink-0"
                >
                  <span>Atur di Dashboard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Edit Form Section */}
          <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-elevation-1">
            <form onSubmit={handleSave} className="space-y-space-md">
              <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-title-md font-bold text-on-surface">
                    Formulir Biodata & Keamanan Akun
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-on-surface-variant">
                  Perubahan langsung tersimpan ke browser
                </span>
              </div>

              {/* Grid Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Field: Nama Lengkap */}
                <div className="space-y-1.5">
                  <label className="block text-body-sm font-semibold text-on-surface">
                    Nama Lengkap Siswa <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap siswa..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-outline-variant text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Nama ini akan tercetak di sertifikat hasil tryout dan salam dashboard.
                  </p>
                </div>

                {/* Field: Email Siswa */}
                <div className="space-y-1.5">
                  <label className="block text-body-sm font-semibold text-on-surface">
                    Alamat Email <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="siswa@smk.sch.id"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-outline-variant text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Digunakan untuk identifikasi login akun siswa.
                  </p>
                </div>

                {/* Field: Asal Sekolah */}
                <div className="space-y-1.5">
                  <label className="block text-body-sm font-semibold text-on-surface">
                    Asal Sekolah SMK <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="Contoh: SMK Negeri 1 Bidang Keahlian TI"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-outline-variant text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Nama SMK tempat Anda menempuh pendidikan kejuruan.
                  </p>
                </div>

                {/* Field: Kelas & Rombel */}
                <div className="space-y-1.5">
                  <label className="block text-body-sm font-semibold text-on-surface">
                    Tingkat Kelas & Rombel <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={classGrade}
                      onChange={(e) => setClassGrade(e.target.value)}
                      placeholder="Contoh: XII PPLG 2 atau XI PPLG 1"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-outline-variant text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  {/* Preset Quick Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["XII PPLG 1", "XII PPLG 2", "XI PPLG 1", "XI PPLG 2", "XII RPL 1"].map(
                      (preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setClassGrade(preset)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all ${
                            classGrade === preset
                              ? "bg-primary text-on-primary border-primary"
                              : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-outline-variant"
                          }`}
                        >
                          {preset}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Password Change Box (Optional) */}
              <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  <h3 className="text-body-sm font-bold text-on-surface">
                    Ubah Kata Sandi Akun (Opsional)
                  </h3>
                </div>
                <p className="text-[12px] text-on-surface-variant">
                  Biarkan kolom kata sandi kosong jika Anda tidak ingin mengubah kata sandi saat ini.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-1">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-on-surface">
                      Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="w-full px-3.5 py-2 rounded-lg bg-surface border border-outline-variant text-body-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-on-surface">
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang kata sandi baru"
                      className="w-full px-3.5 py-2 rounded-lg bg-surface border border-outline-variant text-body-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-space-xs border-t border-outline-variant">
                <button
                  type="button"
                  onClick={handleResetToSaved}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-semibold text-body-sm transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Batal / Reset</span>
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-body-sm shadow-elevation-1 hover:bg-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Info Card: Standar Kurikulum PPLG */}
          <div className="p-space-md rounded-2xl bg-tertiary-container/30 border border-primary/20 space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-body-sm">
              <Sparkles className="w-4 h-4 text-tertiary" />
              <span>Standar Pembelajaran & Uji Kompetensi PPLG 2026/2027</span>
            </div>
            <p className="text-body-xs text-on-surface-variant leading-relaxed">
              Data profil Anda digunakan untuk mengkalkulasi rekomendasi materi belajar adaptif AI Tutor,
              skor IRT parameter 2-PL, serta pencatatan kemajuan kelulusan pada 5 Elemen Utama
              Kemendikdasmen: Wawasan Kerja, K3LH & Budaya Kerja, Jaringan Komputer, Pemrograman Terstruktur,
              dan Pemrograman Berorientasi Objek.
            </p>
          </div>

          {/* Zona Bahaya: Reset Seluruh Data (Persiapan Deploy) */}
          <div className="p-space-md rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-red-600 font-bold text-body-sm">
                <Trash2 className="w-4 h-4 shrink-0" />
                <span>Zona Bahaya: Reset Seluruh Data (Persiapan Deploy)</span>
              </div>
              <span className="text-[11px] font-mono text-red-600 font-semibold bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                Fresh Clean Deploy
              </span>
            </div>
            <p className="text-body-xs text-on-surface-variant leading-relaxed">
              Gunakan fitur ini untuk membersihkan seluruh data pengujian lokal, riwayat pengerjaan tryout, skor IRT, leaderboard, akun sesi, dan antrean remedial agar aplikasi siap digunakan oleh peserta ujian asli saat dideploy.
            </p>
            <div className="pt-1 flex items-center justify-end">
              <button
                type="button"
                onClick={handleResetAllData}
                disabled={isResetting}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-body-xs shadow-elevation-1 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isResetting ? "Mereset Seluruh Data..." : "Reset Semua Data Sekarang"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
