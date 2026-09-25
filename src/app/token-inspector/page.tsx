"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Sparkles, Moon, Sun, Check, AlertTriangle, XCircle, ArrowRight, Layers, Type, Palette, Box } from "lucide-react";

export default function TokenInspectorPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <Sidebar>
      <div className="p-margin max-w-6xl mx-auto w-full">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-space-lg border-b border-outline-variant gap-space-md">
        <div>
          <div className="flex items-center gap-space-sm mb-space-xs">
            <span className="px-space-sm py-1 rounded-full text-label-sm font-mono bg-tertiary-container text-on-tertiary-container border border-primary/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-tertiary" />
              DESIGN.md Verification
            </span>
            <span className="text-body-sm text-on-surface-variant font-mono">v1.0.0</span>
          </div>
          <h1 className="text-display-lg font-bold text-on-surface tracking-tight">
            CBT-PPLG Token Inspector
          </h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Verifikasi menyeluruh pemetaan seluruh token warna, tipografi, radius lembut (rounded curves), dan bayangan sesuai spesifikasi DESIGN.md.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface shadow-elevation-1 hover:bg-surface-container-low transition-all"
          >
            {isDark ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4 text-secondary" />}
            <span className="text-body-sm font-medium">{isDark ? "Mode Terang" : "Mode Gelap"}</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary text-on-primary font-medium text-body-sm hover:bg-primary-container shadow-elevation-1 transition-all"
          >
            <span>Buka Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto mt-space-xl space-y-space-xl">
        {/* Section 1: Color Palette */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg shadow-elevation-1">
          <div className="flex items-center gap-space-sm mb-space-md">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-headline-sm font-semibold text-on-surface">1. Color Palette Tokens</h2>
          </div>

          <div className="space-y-space-lg">
            {/* Primary & Brand */}
            <div>
              <h3 className="text-title-md font-semibold text-on-surface mb-space-sm">Brand Primary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-space-sm">
                <ColorSwatch label="primary" bgClass="bg-primary" textClass="text-on-primary" hex="#4338CA" />
                <ColorSwatch label="primary-container" bgClass="bg-primary-container" textClass="text-on-primary" hex="#3730A3" />
                <ColorSwatch label="on-primary-container" bgClass="bg-on-primary-container" textClass="text-primary-container" hex="#C1BEFF" />
                <ColorSwatch label="primary-fixed" bgClass="bg-primary-fixed" textClass="text-on-primary-fixed" hex="#E3DFFF" />
                <ColorSwatch label="inverse-primary" bgClass="bg-inverse-primary" textClass="text-on-surface" hex="#C3C0FF" />
              </div>
            </div>

            {/* Tertiary / AI Intelligence */}
            <div>
              <h3 className="text-title-md font-semibold text-on-surface mb-space-sm">Tertiary (AI Intelligence)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-space-sm">
                <ColorSwatch label="tertiary" bgClass="bg-tertiary" textClass="text-on-tertiary" hex="#6366F1" />
                <ColorSwatch label="tertiary-container" bgClass="bg-tertiary-container" textClass="text-on-tertiary-container" hex="#EEF2FF" />
                <ColorSwatch label="tertiary-fixed" bgClass="bg-tertiary-fixed" textClass="text-on-tertiary-fixed" hex="#E1E0FF" />
                <ColorSwatch label="on-tertiary-fixed" bgClass="bg-on-tertiary-fixed" textClass="text-tertiary-fixed" hex="#07006C" />
              </div>
            </div>

            {/* Semantic Feedback */}
            <div>
              <h3 className="text-title-md font-semibold text-on-surface mb-space-sm">Semantic TKA Scale</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-space-sm">
                <ColorSwatch label="success" bgClass="bg-success" textClass="text-on-success" hex="#10B981" />
                <ColorSwatch label="success-container" bgClass="bg-success-container" textClass="text-on-success-container" hex="#ECFDF5" />
                <ColorSwatch label="warning" bgClass="bg-warning" textClass="text-on-warning" hex="#F59E0B" />
                <ColorSwatch label="warning-container" bgClass="bg-warning-container" textClass="text-on-warning-container" hex="#FFFBEB" />
                <ColorSwatch label="error" bgClass="bg-error" textClass="text-on-error" hex="#EF4444" />
                <ColorSwatch label="error-container" bgClass="bg-error-container" textClass="text-on-error-container" hex="#FEF2F2" />
              </div>
            </div>

            {/* Surface & Containers */}
            <div>
              <h3 className="text-title-md font-semibold text-on-surface mb-space-sm">Surfaces & Containers</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-space-sm">
                <ColorSwatch label="surface" bgClass="bg-surface" textClass="text-on-surface" hex="#FAFAFB" border />
                <ColorSwatch label="surface-container-lowest" bgClass="bg-surface-container-lowest" textClass="text-on-surface" hex="#FFFFFF" border />
                <ColorSwatch label="surface-container-low" bgClass="bg-surface-container-low" textClass="text-on-surface" hex="#F8FAFC" border />
                <ColorSwatch label="surface-container" bgClass="bg-surface-container" textClass="text-on-surface" hex="#F1F5F9" border />
                <ColorSwatch label="surface-container-high" bgClass="bg-surface-container-high" textClass="text-on-surface" hex="#DCE9FF" border />
                <ColorSwatch label="surface-container-highest" bgClass="bg-surface-container-highest" textClass="text-on-surface" hex="#D3E4FE" border />
              </div>
            </div>

            {/* Outlines & Text */}
            <div>
              <h3 className="text-title-md font-semibold text-on-surface mb-space-sm">Outlines & Contrasts</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                <ColorSwatch label="on-surface" bgClass="bg-on-surface" textClass="text-surface" hex="#0F172A" />
                <ColorSwatch label="on-surface-variant" bgClass="bg-on-surface-variant" textClass="text-surface" hex="#464554" />
                <ColorSwatch label="outline" bgClass="bg-outline" textClass="text-surface" hex="#777586" />
                <ColorSwatch label="outline-variant" bgClass="bg-outline-variant" textClass="text-on-surface" hex="#E2E8F0" border />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Typography */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg shadow-elevation-1">
          <div className="flex items-center gap-space-sm mb-space-md">
            <Type className="w-5 h-5 text-primary" />
            <h2 className="text-headline-sm font-semibold text-on-surface">2. Typography Scale (Plus Jakarta Sans & JetBrains Mono)</h2>
          </div>

          <div className="space-y-space-md divide-y divide-outline-variant">
            <div className="pt-space-xs">
              <span className="text-label-sm font-mono text-on-surface-variant">display-lg (36px / 44px bold)</span>
              <p className="text-display-lg text-on-surface font-bold mt-1">CBT-PPLG 2026</p>
            </div>

            <div className="pt-space-sm">
              <span className="text-label-sm font-mono text-on-surface-variant">headline-lg (24px / 32px semibold)</span>
              <p className="text-headline-lg text-on-surface font-semibold mt-1">Simulasi Tes Kemampuan Akademik Kejuruan</p>
            </div>

            <div className="pt-space-sm">
              <span className="text-label-sm font-mono text-on-surface-variant">headline-sm (18px / 26px semibold)</span>
              <p className="text-headline-sm text-on-surface font-semibold mt-1">Analisis Logika Algoritma & Struktur Data</p>
            </div>

            <div className="pt-space-sm">
              <span className="text-label-sm font-mono text-on-surface-variant">title-md (16px / 24px semibold)</span>
              <p className="text-title-md text-on-surface font-semibold mt-1">Pilihan Ganda Kompleks — Tandai Jawaban Valid</p>
            </div>

            <div className="pt-space-sm">
              <span className="text-label-sm font-mono text-on-surface-variant">body-lg (16px / 26px regular)</span>
              <p className="text-body-lg text-on-surface mt-1">
                Diberikan sebuah fungsi rekursif untuk menghitung deret Fibonacci. Manakah dari pernyataan berikut yang paling tepat mengenai kompleksitas waktu algoritma tersebut tanpa teknik memoization?
              </p>
            </div>

            <div className="pt-space-sm">
              <span className="text-label-sm font-mono text-on-surface-variant">body-md (14px / 22px regular)</span>
              <p className="text-body-md text-on-surface-variant mt-1">
                Waktu pengerjaan tersisa 48 menit. Pastikan seluruh soal telah dijawab sebelum waktu habis.
              </p>
            </div>

            <div className="pt-space-sm">
              <span className="text-label-sm font-mono text-on-surface-variant">body-sm (12px / 18px regular)</span>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Hasil penilaian diestimasi menggunakan model Rasch 1-PL dengan skala 200–800.
              </p>
            </div>

            <div className="pt-space-sm">
              <span className="text-label-sm font-mono text-on-surface-variant">label-md (13px / 18px medium, JetBrains Mono)</span>
              <p className="text-label-md font-mono text-primary font-medium mt-1">TIMER: 00:48:22 | SKOR IRT: 642 / 800</p>
            </div>

            <div className="pt-space-sm">
              <span className="text-label-sm font-mono text-on-surface-variant">code-block (13px / 22px regular, JetBrains Mono)</span>
              <div className="mt-2 bg-on-surface text-outline-variant p-space-md rounded-lg font-mono text-code-block overflow-x-auto">
                <code>
                  {`function calculateComplexity(n: number): number {\n  if (n <= 1) return n;\n  return calculateComplexity(n - 1) + calculateComplexity(n - 2);\n}`}
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Elevation & Depth */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg shadow-elevation-1">
          <div className="flex items-center gap-space-sm mb-space-md">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="text-headline-sm font-semibold text-on-surface">3. Elevation & Depth Tokens</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="p-space-md rounded-xl border border-outline-variant bg-surface shadow-elevation-0">
              <span className="text-label-sm font-mono text-on-surface-variant">Level 0: Flat Canvas</span>
              <p className="text-body-sm text-on-surface mt-1">shadow-elevation-0</p>
            </div>
            <div className="p-space-md rounded-xl border border-outline-variant bg-surface-container-lowest shadow-elevation-1">
              <span className="text-label-sm font-mono text-on-surface-variant">Level 1: Container Card</span>
              <p className="text-body-sm text-on-surface mt-1">shadow-elevation-1</p>
            </div>
            <div className="p-space-md rounded-xl border border-indigo-200 dark:border-primary bg-surface-container-lowest shadow-elevation-2">
              <span className="text-label-sm font-mono text-primary">Level 2: Active / Hover</span>
              <p className="text-body-sm text-on-surface mt-1">shadow-elevation-2</p>
            </div>
            <div className="p-space-md rounded-xl border border-tertiary/40 bg-tertiary-container shadow-ai-glow">
              <div className="flex items-center gap-1 text-tertiary font-mono text-label-sm">
                <Sparkles className="w-3 h-3" />
                <span>AI Glow Callout</span>
              </div>
              <p className="text-body-sm text-on-surface mt-1">shadow-ai-glow</p>
            </div>
          </div>
        </section>

        {/* Section 4: Component Patterns Preview */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg shadow-elevation-1">
          <div className="flex items-center gap-space-sm mb-space-md">
            <Box className="w-5 h-5 text-primary" />
            <h2 className="text-headline-sm font-semibold text-on-surface">4. Component Pattern Visual Test (100% Token-Driven, Lengkung Lembut)</h2>
          </div>

          <div className="space-y-space-lg">
            {/* Badges */}
            <div>
              <h3 className="text-title-md font-semibold text-on-surface mb-space-sm">Difficulty & AI Chips (Pill Geometry)</h3>
              <div className="flex flex-wrap gap-space-sm items-center">
                <span className="px-3 py-1 rounded-full text-label-sm font-mono bg-success-container text-on-success-container border border-success/30 flex items-center gap-1">
                  <Check className="w-3 h-3 text-success" />
                  Mudah
                </span>
                <span className="px-3 py-1 rounded-full text-label-sm font-mono bg-warning-container text-on-warning-container border border-warning/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-warning" />
                  Sedang
                </span>
                <span className="px-3 py-1 rounded-full text-label-sm font-mono bg-error-container text-on-error-container border border-error/30 flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-error" />
                  Sulit
                </span>
                <span className="px-3 py-1 rounded-full text-label-sm font-mono bg-tertiary-container text-on-tertiary-container border border-primary/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-tertiary" />
                  Dijelaskan oleh AI
                </span>
              </div>
            </div>

            {/* Answer Options States */}
            <div>
              <h3 className="text-title-md font-semibold text-on-surface mb-space-sm">Question Option States (rounded-lg / 16px)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                {/* Resting */}
                <div className="flex items-center gap-space-sm p-space-md rounded-lg border border-outline-variant bg-surface-container-lowest shadow-elevation-1 hover:border-primary/40 transition-all">
                  <span className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant font-mono text-label-md flex items-center justify-center">
                    A
                  </span>
                  <span className="text-body-md text-on-surface">State Normal (Resting)</span>
                </div>

                {/* Selected */}
                <div className="flex items-center gap-space-sm p-space-md rounded-lg border-[1.5px] border-primary bg-tertiary-container shadow-elevation-2">
                  <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-mono text-label-md flex items-center justify-center font-bold">
                    B
                  </span>
                  <span className="text-body-md text-on-surface font-medium">State Terpilih (Selected)</span>
                </div>

                {/* Review Correct */}
                <div className="flex items-center gap-space-sm p-space-md rounded-lg border-[1.5px] border-success bg-success-container shadow-elevation-1">
                  <span className="w-7 h-7 rounded-full bg-success text-on-success font-mono text-label-md flex items-center justify-center font-bold">
                    C
                  </span>
                  <span className="text-body-md text-on-success-container font-medium">Review: Jawaban Benar</span>
                </div>

                {/* Review Incorrect */}
                <div className="flex items-center gap-space-sm p-space-md rounded-lg border-[1.5px] border-error bg-error-container shadow-elevation-1">
                  <span className="w-7 h-7 rounded-full bg-error text-on-error font-mono text-label-md flex items-center justify-center font-bold">
                    D
                  </span>
                  <span className="text-body-md text-on-error-container font-medium">Review: Jawaban Salah</span>
                </div>
              </div>
            </div>

            {/* Navigator Tiles */}
            <div>
              <h3 className="text-title-md font-semibold text-on-surface mb-space-sm">Question Navigator Grid Tiles (40x40px, rounded-md / 12px lengkung halus)</h3>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="w-10 h-10 rounded-md bg-primary text-on-primary font-mono font-bold text-label-md flex items-center justify-center shadow-elevation-1">
                  1
                </div>
                <div className="w-10 h-10 rounded-md bg-surface-container-lowest text-on-surface-variant border border-outline-variant font-mono font-bold text-label-md flex items-center justify-center">
                  2
                </div>
                <div className="w-10 h-10 rounded-md bg-warning text-on-warning font-mono font-bold text-label-md flex items-center justify-center relative shadow-elevation-1">
                  3
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-on-warning" />
                </div>
                <div className="w-10 h-10 rounded-md bg-surface-container-lowest text-primary border-2 border-tertiary ring-2 ring-tertiary/20 font-mono font-bold text-label-md flex items-center justify-center shadow-elevation-2">
                  4
                </div>
              </div>
              <p className="text-body-sm text-on-surface-variant mt-2">
                Urutan: Terjawab (1), Belum Terjawab (2), Ragu-ragu (3), Soal Aktif (4).
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-space-xl pt-space-md border-t border-outline-variant text-center text-body-sm text-on-surface-variant font-mono">
        CBT-PPLG &bull; Design Token Subsystem Verified & Ready for Review
      </footer>
      </div>
    </Sidebar>
  );
}

function ColorSwatch({
  label,
  bgClass,
  textClass,
  hex,
  border = false,
}: {
  label: string;
  bgClass: string;
  textClass: string;
  hex: string;
  border?: boolean;
}) {
  return (
    <div className={`p-space-sm rounded-lg ${bgClass} ${textClass} ${border ? "border border-outline-variant" : ""} flex flex-col justify-between min-h-[72px] shadow-elevation-1 transition-transform hover:-translate-y-0.5`}>
      <span className="font-mono text-label-sm font-semibold truncate">{label}</span>
      <span className="font-mono text-[10px] opacity-80">{hex}</span>
    </div>
  );
}
