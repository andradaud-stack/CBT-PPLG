"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Clock,
  BarChart3,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  User,
  RotateCcw,
  Flame,
  Trophy,
  Bot,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";
import { getUserProfile } from "@/lib/storage";
import { getAuthSession, logoutUser } from "@/lib/auth";
import { getLearningGoals } from "@/lib/targets";
import { UserProfile } from "@/types";

export interface SidebarContextType {
  isDesktopOpen: boolean;
  setIsDesktopOpen: (open: boolean) => void;
  toggleDesktopSidebar: () => void;
}

export const SidebarContext = React.createContext<SidebarContextType>({
  isDesktopOpen: true,
  setIsDesktopOpen: () => {},
  toggleDesktopSidebar: () => {},
});

export const useSidebar = () => React.useContext(SidebarContext);

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cbt_desktop_sidebar_open");
      if (saved !== null) {
        setIsDesktopOpen(saved === "true");
      }
    } catch {
      // Ignored
    }
  }, []);

  const toggleDesktopSidebar = () => {
    setIsDesktopOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("cbt_desktop_sidebar_open", String(next));
      } catch {
        // Ignored
      }
      return next;
    });
  };

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
    { label: "Tanya AI Tutor", href: "/ai-tutor", icon: Bot, badge: "AI Pro" },
    { label: "Riwayat & Progres", href: "/history", icon: BarChart3 },
    { label: "Papan Peringkat", href: "/leaderboard", icon: Trophy },
    { label: "Profil Saya", href: "/profile", icon: User },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-surface-container-lowest border-r border-outline-variant select-none overflow-hidden">
      {/* Scrollable Top Brand & Menu */}
      <div className="flex-1 overflow-y-auto p-space-md space-y-space-md scrollbar-none">
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

          <div className="flex items-center gap-1">
            {/* Close button for desktop */}
            <button
              type="button"
              onClick={toggleDesktopSidebar}
              className="hidden lg:flex p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors shrink-0"
              title="Tutup Menu Dashboard"
              aria-label="Tutup Menu Dashboard"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>

            {/* Close button for mobile drawer */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors shrink-0"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
      </div>

      {/* Bottom Profile, Theme & Logout */}
      <div className="p-space-md pt-space-xs pb-5 border-t border-outline-variant/80 space-y-2 shrink-0 bg-surface-container-lowest">
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

  const isAiTutor = pathname === "/ai-tutor";

  return (
    <SidebarContext.Provider
      value={{
        isDesktopOpen,
        setIsDesktopOpen,
        toggleDesktopSidebar,
      }}
    >
      <div
        className={`bg-surface flex flex-col lg:flex-row ${
          isAiTutor ? "h-screen max-h-screen overflow-hidden" : "min-h-screen"
        }`}
      >
        {/* Mobile Top Navigation Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-surface-container-lowest border-b border-outline-variant px-margin py-3 flex items-center justify-between shadow-elevation-1 shrink-0">
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

        {/* Desktop Fixed Collapsible Sidebar */}
        <aside
          className={`hidden lg:block h-screen sticky top-0 shrink-0 z-30 transition-all duration-300 ease-in-out ${
            isDesktopOpen
              ? "w-64 border-r border-outline-variant"
              : "w-0 overflow-hidden border-r-0"
          }`}
        >
          <div className="w-64 h-full">
            {sidebarContent}
          </div>
        </aside>

        {/* Floating toggle button when desktop sidebar is closed on other pages */}
        {!isDesktopOpen && !isAiTutor && (
          <div className="hidden lg:flex fixed top-3 left-3 z-40 animate-fadeIn">
            <button
              type="button"
              onClick={toggleDesktopSidebar}
              className="p-2 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-elevation-2 hover:bg-surface-container text-on-surface hover:text-primary transition-all flex items-center gap-2 group"
              title="Buka Menu Dashboard"
              aria-label="Buka Menu Dashboard"
            >
              <PanelLeft className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold font-mono text-on-surface group-hover:text-primary">
                Menu
              </span>
            </button>
          </div>
        )}

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
        <div className={`flex-1 min-w-0 flex flex-col ${isAiTutor ? "h-full overflow-hidden" : ""}`}>
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
