"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Clock,
  BarChart3,
  Palette,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Sparkles,
  User,
  RotateCcw,
  Flame,
  Trophy,
} from "lucide-react";
import { getUserProfile } from "@/lib/storage";
import { getAuthSession, logoutUser } from "@/lib/auth";
import { getLearningGoals } from "@/lib/targets";
import { UserProfile } from "@/types";

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    const updateProfileAndGoals = () => {
      const session = getAuthSession();
      setProfile(session.user || getUserProfile());
      const goals = getLearningGoals();
      setStreak(goals.currentStreak);
    };

    updateProfileAndGoals();
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    window.addEventListener("cendekia:auth-changed", updateProfileAndGoals);
    window.addEventListener("cendekia:goals-updated", updateProfileAndGoals);
    return () => {
      window.removeEventListener("cendekia:auth-changed", updateProfileAndGoals);
      window.removeEventListener("cendekia:goals-updated", updateProfileAndGoals);
    };
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  const navLinks = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Latihan Bebas", href: "/practice", icon: BookOpen },
    { label: "Simulasi TKA", href: "/simulation", icon: Clock },
    { label: "Bank Remedial", href: "/remedial", icon: RotateCcw },
    { label: "Riwayat & Progres", href: "/history", icon: BarChart3 },
    { label: "Papan Peringkat", href: "/leaderboard", icon: Trophy },
    { label: "Profil Saya", href: "/profile", icon: User },
    { label: "Token Inspector", href: "/token-inspector", icon: Palette },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-surface-container-lowest border-r border-outline-variant p-space-md select-none">
      {/* Top Brand & Menu */}
      <div className="space-y-space-lg">
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/60">
          <Link href="/" className="flex items-center gap-space-xs group">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-title-md shadow-elevation-1 group-hover:bg-primary-container transition-all">
              C
            </div>
            <div>
              <span className="font-bold text-headline-sm text-on-surface tracking-tight group-hover:text-primary transition-colors block leading-tight">
                CBT-PPLG
              </span>
              <span className="text-[11px] font-mono text-tertiary block">
                Studio Kemendikdasmen
              </span>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant font-semibold px-space-xs block mb-1">
            Menu Utama
          </span>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-space-sm py-2.5 rounded-xl text-body-sm font-medium transition-all group ${
                    isActive
                      ? "bg-tertiary-container text-primary font-bold border border-primary/20 shadow-elevation-1"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <div
                    className={`p-1 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-on-primary"
                        : "text-on-surface-variant group-hover:text-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate flex-1">{link.label}</span>
                  {(link as { badge?: string }).badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold shrink-0">
                      {(link as { badge?: string }).badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Info Badge */}
        <div className="p-space-sm rounded-xl bg-tertiary-container/60 border border-primary/20 space-y-1">
          <div className="flex items-center gap-1.5 text-primary text-[11px] font-semibold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-tertiary shrink-0" />
            <span>AI Tutor Aktif</span>
          </div>
          <p className="text-[11px] text-on-tertiary-container leading-relaxed">
            Terhubung ke AI Engine untuk evaluasi 5 Elemen Standar Kemendikdasmen.
          </p>
        </div>
      </div>

      {/* Bottom Profile, Theme & Logout */}
      <div className="pt-space-sm border-t border-outline-variant/80 space-y-space-xs">
        {/* Dark Mode Switcher */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-space-sm py-2 rounded-xl text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
        >
          <div className="flex items-center gap-2.5">
            {isDark ? (
              <Sun className="w-4 h-4 text-warning" />
            ) : (
              <Moon className="w-4 h-4 text-secondary" />
            )}
            <span className="text-body-sm font-medium">
              {isDark ? "Mode Terang" : "Mode Gelap"}
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase text-on-surface-variant/80">
            {isDark ? "Dark" : "Light"}
          </span>
        </button>

        {/* Student Profile Card */}
        {profile && (
          <div className="p-space-xs rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between gap-2">
            <Link
              href="/profile"
              title="Profil Siswa / Edit Profil"
              className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-mono text-label-sm font-bold shrink-0">
                {profile.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <span className="text-body-sm font-semibold text-on-surface block truncate leading-tight">
                  {profile.name}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-mono text-on-surface-variant block truncate">
                    {profile.classGrade}
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold shrink-0">
                    <Flame className="w-2.5 h-2.5 fill-amber-500" />
                    {streak}h
                  </span>
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              title="Keluar (Logout)"
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors shrink-0"
              aria-label="Keluar dari akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      {/* Mobile Top Navigation Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-surface-container-lowest border-b border-outline-variant px-margin py-3 flex items-center justify-between shadow-elevation-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Buka Menu Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-title-md">
              C
            </div>
            <span className="font-bold text-title-md text-on-surface tracking-tight">
              CBT-PPLG
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-mono font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
            <span>{streak}h</span>
          </div>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
            aria-label="Toggle tema"
          >
            {isDark ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-secondary" />}
          </button>
          {profile && (
            <Link
              href="/profile"
              title="Profil Siswa"
              className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-mono text-label-sm font-bold"
            >
              {profile.name.charAt(0)}
            </Link>
          )}
        </div>
      </header>

      {/* Desktop Fixed Sidebar (w-64) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sliding Drawer Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fadeIn">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="relative w-72 max-w-[85vw] h-full shadow-elevation-3 z-10 animate-slideRight">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {children}
      </div>
    </div>
  );
}
