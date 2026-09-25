"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, Lock, Mail, User, School, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { DEMO_USERS, loginUser, registerUser, getRegisteredUsers } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");
  const [hasUsers, setHasUsers] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regSchool, setRegSchool] = useState("");
  const [regClass, setRegClass] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const users = getRegisteredUsers();
    const count = users.length;
    setHasUsers(count > 0);
    if (count === 0) {
      setActiveTab("register");
    } else {
      setActiveTab("login");
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const result = loginUser(loginEmail, loginPassword);
      if (result.success) {
        setSuccessMsg("Berhasil masuk! Mengalihkan ke Dashboard...");
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      } else {
        setErrorMsg(result.message);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg("Terjadi kesalahan saat masuk. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const result = registerUser({
        name: regName,
        email: regEmail,
        school: regSchool,
        classGrade: regClass,
        password: regPassword,
      });

      if (result.success) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          window.location.href = "/";
        }, 600);
      } else {
        setErrorMsg(result.message);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Register error:", err);
      setErrorMsg("Terjadi kesalahan saat menyimpan pendaftaran akun baru.");
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setErrorMsg(null);
    setIsLoading(true);
    setTimeout(() => {
      const result = loginUser(demoEmail, "password123");
      if (result.success) {
        router.push("/");
      } else {
        setErrorMsg(result.message);
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col justify-between p-margin">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-space-md">
        <Link href="/" className="flex items-center gap-space-xs group">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-headline-sm shadow-elevation-1 group-hover:bg-primary-container transition-colors">
            C
          </div>
          <div>
            <span className="font-bold text-headline-sm text-on-surface tracking-tight">
              CBT-PPLG
            </span>
            <span className="block text-[11px] font-mono text-tertiary">
              Portal Akses CBT Siswa
            </span>
          </div>
        </Link>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-md mx-auto w-full my-auto animate-fadeIn">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-space-lg md:p-space-xl shadow-elevation-2 space-y-space-md">
          {/* Header pill */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container border border-primary/20 text-label-sm font-mono mb-space-xs">
              <Sparkles className="w-3.5 h-3.5 text-tertiary" />
              <span>Standar CBT Kemendikdasmen</span>
            </div>
            <h1 className="text-headline-lg font-bold text-on-surface tracking-tight">
              {activeTab === "login" ? "Masuk Ruang Ujian" : "Daftar Akun Siswa"}
            </h1>
            <p className="text-body-sm text-on-surface-variant mt-1">
              {activeTab === "login"
                ? "Gunakan email terdaftar untuk melanjutkan simulasi dan bimbingan AI."
                : "Buat profil siswa baru untuk mulai mencatat riwayat dan skor IRT personal."}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-surface-container border border-outline-variant text-body-sm font-medium">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-lg transition-all text-center font-semibold ${
                activeTab === "login"
                  ? "bg-surface-container-lowest text-primary shadow-elevation-1"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2 rounded-lg transition-all text-center font-semibold ${
                activeTab === "register"
                  ? "bg-surface-container-lowest text-primary shadow-elevation-1"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Daftar Baru
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-space-sm rounded-lg bg-error-container text-on-error-container border border-error/30 text-body-sm flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-error shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-space-sm rounded-lg bg-success-container text-on-success-container border border-success/30 text-body-sm flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Tab 1: Form Login */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-space-sm">
              <div>
                <label className="block text-body-sm font-semibold text-on-surface mb-1">
                  Email Siswa
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama@smk.sch.id"
                    className="w-full pl-9 pr-space-md py-2 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-body-sm font-semibold text-on-surface mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-space-md py-2 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] font-mono text-on-surface-variant">
                  <span>Demo default: password123</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-body-md hover:bg-primary-container shadow-elevation-1 transition-all flex items-center justify-center gap-2 mt-space-md disabled:opacity-50"
              >
                <span>{isLoading ? "Memproses..." : "Masuk ke Ruang Ujian"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Tab 2: Form Registrasi */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-space-xs">
              <div>
                <label className="block text-label-sm font-semibold text-on-surface mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-9 pr-space-md py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-on-surface mb-1">
                  Asal Sekolah (SMK)
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="Contoh: SMKN 1 Jakarta"
                    className="w-full pl-9 pr-space-md py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-xs">
                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1">
                    Kelas / Rombel
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={regClass}
                      onChange={(e) => setRegClass(e.target.value)}
                      placeholder="XII PPLG 1"
                      className="w-full pl-9 pr-2 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono text-[12px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-label-sm font-semibold text-on-surface mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="budi@smk.sch.id"
                      className="w-full pl-9 pr-2 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-label-sm font-semibold text-on-surface mb-1">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-9 pr-space-md py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-body-md hover:bg-primary-container shadow-elevation-1 transition-all flex items-center justify-center gap-2 mt-space-sm disabled:opacity-50"
              >
                <span>{isLoading ? "Mendaftarkan..." : "Daftar & Langsung Masuk"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Login Preset (Hanya muncul jika ada demo users) */}
          {DEMO_USERS.length > 0 && (
            <div className="pt-space-sm border-t border-outline-variant">
              <span className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant font-semibold block mb-space-xs text-center">
                Akses Cepat 1-Klik Akun Contoh
              </span>
              <div className="grid grid-cols-2 gap-space-xs">
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleQuickLogin(demo.email)}
                    className="p-space-xs rounded-lg border border-outline-variant bg-surface-container-low text-left hover:border-primary/50 text-[12px] transition-all hover:bg-tertiary-container/30"
                  >
                    <span className="font-semibold block text-on-surface truncate">{demo.name}</span>
                    <span className="text-on-surface-variant text-[10px] font-mono block">
                      {demo.classGrade} &bull; {demo.school.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!hasUsers && activeTab === "login" && (
            <div className="pt-space-sm border-t border-outline-variant text-center">
              <p className="text-[12px] text-on-surface-variant">
                Belum ada akun siswa terdaftar. Silakan pilih tab{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className="text-primary font-bold hover:underline"
                >
                  Daftar Baru
                </button>{" "}
                untuk membuat akun pertama Anda.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full pt-space-md text-center text-body-sm text-on-surface-variant font-mono">
        CBT-PPLG &bull; Kemendikdasmen TKA Vocational Readiness System
      </footer>
    </div>
  );
}
