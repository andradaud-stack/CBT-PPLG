"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Users,
  BookOpen,
  Layers,
  ShieldAlert,
  ShieldCheck,
  FileCheck2,
  HelpCircle,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Lock,
  ArrowLeft,
  Database,
  Shield,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/storage";
import { UserProfile } from "@/types";

export type AdminTab =
  | "overview"
  | "users"
  | "questions"
  | "curriculum"
  | "monitoring"
  | "security"
  | "modules"
  | "moderation"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  usersCount?: number;
  questionsCount?: number;
  moderationCount?: number;
  dbStatus?: { connected: boolean; latencyMs?: number; tablesCount?: number } | null;
  onLockAdmin?: () => void;
  children: React.ReactNode;
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  usersCount = 0,
  questionsCount = 0,
  moderationCount = 0,
  dbStatus,
  onLockAdmin,
  children,
}: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const session = getAuthSession();
    setProfile(session.user || getUserProfile());
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  const adminNavItems = [
    { id: "overview", label: "Overview & Analitik", icon: BarChart3 },
    { id: "users", label: "Manajemen Siswa", icon: Users, count: usersCount },
    { id: "questions", label: "Bank Soal & AI", icon: BookOpen, count: questionsCount },
    { id: "curriculum", label: "Kisi-kisi & Bobot", icon: Layers },
    { id: "monitoring", label: "Live Proctoring", icon: ShieldAlert, badge: "Anti-Curang" },
    { id: "security", label: "Keamanan Siber", icon: ShieldCheck, badge: "Shield Active" },
    { id: "modules", label: "Modul Belajar", icon: FileCheck2 },
    { id: "moderation", label: "Moderasi Soal", icon: HelpCircle, count: moderationCount },
    { id: "settings", label: "Pengaturan Sistem", icon: Settings },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-surface-container-lowest border-r border-outline-variant select-none overflow-hidden">
      {/* Scrollable Upper Menu */}
      <div className="flex-1 overflow-y-auto p-space-md space-y-space-md scrollbar-none">
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/60">
          <Link href="/admin" className="flex items-center gap-space-xs group">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-title-md shadow-elevation-1 group-hover:bg-amber-700 transition-all">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-headline-sm text-on-surface tracking-tight group-hover:text-primary transition-colors block leading-tight">
                  CBT-PPLG
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  Admin
                </span>
              </div>
              <span className="text-[11px] font-mono text-tertiary block">
                Portal Manajemen &amp; Ujian
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
            Menu Administrator
          </span>

          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as AdminTab);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-space-sm py-2.5 rounded-xl text-body-sm font-medium transition-all group text-left ${
                    isActive
                      ? "bg-primary text-on-primary font-bold shadow-elevation-1 scale-[1.01]"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <div
                    className={`p-1 rounded-lg transition-colors ${
                      isActive
                        ? "bg-on-primary/20 text-on-primary"
                        : "text-on-surface-variant group-hover:text-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate flex-1">{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                        isActive
                          ? "bg-on-primary/20 text-on-primary"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold shrink-0 ${
                        isActive
                          ? "bg-on-primary/30 text-white"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Database Status Card */}
        <div className="p-space-sm rounded-xl bg-surface-container-low border border-outline-variant space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono font-semibold">
            <span className="flex items-center gap-1.5 text-on-surface">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>TiDB Serverless</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <span className={`w-2 h-2 rounded-full ${dbStatus?.connected ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`} />
              <span className="text-[10px] font-bold">{dbStatus?.connected ? "Connected" : "Offline"}</span>
            </span>
          </div>
          <p className="text-[10px] font-mono text-on-surface-variant">
            AWS Singapore &bull; {dbStatus?.latencyMs ? `${dbStatus.latencyMs}ms` : "Active"}
          </p>
        </div>
      </div>

      {/* Bottom Profile, Theme & Logout Section (Guaranteed visibility) */}
      <div className="p-space-md pt-space-xs pb-5 border-t border-outline-variant/80 space-y-2 shrink-0 bg-surface-container-lowest">
        {/* Link Kembali ke Siswa */}
        <Link
          href="/"
          className="w-full flex items-center gap-2 px-space-sm py-2 rounded-xl text-body-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Portal Siswa</span>
        </Link>

        {/* Dark Mode Switcher */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-space-sm py-1.5 rounded-xl text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
        >
          <div className="flex items-center gap-2.5">
            {isDark ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-secondary" />}
            <span className="text-body-xs font-medium">{isDark ? "Mode Terang" : "Mode Gelap"}</span>
          </div>
          <span className="text-[10px] font-mono uppercase text-on-surface-variant/80">
            {isDark ? "Dark" : "Light"}
          </span>
        </button>

        {/* Admin User Card & Lock Button */}
        <div className="p-space-xs rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-mono text-label-sm font-bold shrink-0">
              A
            </div>
            <div className="min-w-0 flex-1 text-left">
              <span className="text-body-xs font-bold text-on-surface block truncate leading-tight">
                {profile?.name || "Administrator Utama"}
              </span>
              <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300 block truncate">
                SysAdmin &bull; Server
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLockAdmin}
            title="Kunci Panel Admin"
            className="p-1.5 rounded-lg text-amber-800 dark:text-amber-200 hover:text-red-600 hover:bg-red-500/10 transition-colors shrink-0"
            aria-label="Kunci sesi admin"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
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
            aria-label="Buka Menu Admin"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-title-md">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-title-md text-on-surface tracking-tight">
              CBT-PPLG Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-[11px] font-mono font-semibold px-2 py-1 rounded bg-surface-container text-primary flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Siswa</span>
          </Link>
          <button
            type="button"
            onClick={onLockAdmin}
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-500/10 transition-colors"
            title="Kunci Admin"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Desktop Fixed Sidebar (w-64) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fadeIn">
          <div
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
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
