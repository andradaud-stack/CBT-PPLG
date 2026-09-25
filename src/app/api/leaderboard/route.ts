import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { LeaderboardEntry } from "@/types";
import { checkRateLimit, validateExamSubmission, sanitizeInput } from "@/lib/security";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADERBOARD_FILE = path.join(DATA_DIR, "leaderboard.json");

// In-memory fallback if file system is read-only in some serverless hosts
let inMemoryLeaderboard: LeaderboardEntry[] = [];

// Empty seed: leaderboard begins completely clean for real tryout participants
const SEED_LEADERBOARD: LeaderboardEntry[] = [];

async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const data = await fs.readFile(LEADERBOARD_FILE, "utf-8");
      const parsed: LeaderboardEntry[] = JSON.parse(data);
      if (Array.isArray(parsed)) {
        inMemoryLeaderboard = parsed;
        return parsed;
      }
    } catch {
      // File not found or empty, initialize seed
    }

    await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(SEED_LEADERBOARD, null, 2), "utf-8");
    inMemoryLeaderboard = SEED_LEADERBOARD;
    return SEED_LEADERBOARD;
  } catch (err) {
    console.warn("Storage warning in leaderboard, using in-memory:", err);
    if (inMemoryLeaderboard.length === 0) {
      inMemoryLeaderboard = SEED_LEADERBOARD;
    }
    return inMemoryLeaderboard;
  }
}

async function saveLeaderboard(entries: LeaderboardEntry[]): Promise<void> {
  inMemoryLeaderboard = entries;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(entries, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write leaderboard to file, kept in memory:", err);
  }
}

const SubmissionSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  school: z.string().optional().default("SMK"),
  classGrade: z.string().optional().default("XII PPLG"),
  score: z.number().min(200).max(800),
  theta: z.number(),
  totalQuestions: z.number().min(1),
  totalCorrect: z.number().min(0),
  accuracy: z.number().min(0).max(100),
  durationSeconds: z.number().min(1),
  packageId: z.number().min(1),
  packageName: z.string().min(1),
  streak: z.number().optional().default(1),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const packageFilter = searchParams.get("packageId");
    const sortBy = searchParams.get("sort") || "score"; // "score" | "streak" | "recent"

    let entries = await loadLeaderboard();

    // Filter paket jika diminta
    if (packageFilter && packageFilter !== "all") {
      const pId = parseInt(packageFilter, 10);
      if (!isNaN(pId)) {
        entries = entries.filter((e) => e.packageId === pId);
      }
    }

    // Pengurutan
    if (sortBy === "streak") {
      entries.sort((a, b) => (b.streak || 0) - (a.streak || 0) || b.score - a.score);
    } else if (sortBy === "recent") {
      entries.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    } else {
      // Default: Skor Tertinggi (IRT) lalu akurasi tertinggi, lalu durasi tercepat
      entries.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
        return a.durationSeconds - b.durationSeconds;
      });
    }

    return NextResponse.json({
      success: true,
      totalParticipants: entries.length,
      top3: entries.slice(0, 3),
      leaderboard: entries,
    });
  } catch (err) {
    console.error("Leaderboard GET error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data peringkat" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // 1. Rate Limiting Protection (Mencegah spam submit dan flooding skor)
  const rateCheck = checkRateLimit(req, { keyPrefix: "lead-post", limit: 15, windowMs: 60000 });
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: `Terlalu banyak permintaan submit. Coba lagi dalam ${rateCheck.resetInSec} detik.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = SubmissionSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Data submission tidak valid", details: parseResult.error },
        { status: 400 }
      );
    }

    const sub = parseResult.data;

    // 2. Exam Integrity & Anti-Speedhack Defense
    const integrity = validateExamSubmission({
      totalQuestions: sub.totalQuestions,
      totalCorrect: sub.totalCorrect,
      durationSeconds: sub.durationSeconds,
      score: sub.score,
    });

    if (!integrity.valid || integrity.isFlagged) {
      const reasonMsg = integrity.reasons.join(". ");
      return NextResponse.json(
        {
          success: false,
          error: `Integritas Ujian Ditolak: ${reasonMsg}. Percobaan ini tidak dapat dicatat ke papan peringkat resmi demi keadilan kompetisi.`,
        },
        { status: 422 }
      );
    }

    // 3. XSS Sanitization pada nama & profil
    const sanitizedName = sanitizeInput(sub.name);
    const sanitizedSchool = sanitizeInput(sub.school || "SMK");
    const sanitizedClass = sanitizeInput(sub.classGrade || "XII PPLG");

    const entries = await loadLeaderboard();

    // Cek apakah user sudah punya entri untuk paket ini
    const existingIndex = entries.findIndex(
      (e) => e.userId === sub.userId && e.packageId === sub.packageId
    );

    const newEntry: LeaderboardEntry = {
      id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: sub.userId,
      name: sanitizedName,
      school: sanitizedSchool,
      classGrade: sanitizedClass,
      score: sub.score,
      theta: sub.theta,
      totalQuestions: sub.totalQuestions,
      totalCorrect: sub.totalCorrect,
      accuracy: sub.accuracy,
      durationSeconds: sub.durationSeconds,
      packageId: sub.packageId,
      packageName: sub.packageName,
      streak: sub.streak,
      submittedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      const old = entries[existingIndex];
      // Hanya perbarui jika skor baru lebih tinggi atau sama dengan durasi lebih cepat
      if (sub.score > old.score || (sub.score === old.score && sub.durationSeconds < old.durationSeconds)) {
        entries[existingIndex] = newEntry;
      }
    } else {
      entries.push(newEntry);
    }

    // Urutkan ulang berdasarkan skor IRT
    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return a.durationSeconds - b.durationSeconds;
    });

    await saveLeaderboard(entries);

    // Cari posisi rank siswa
    const currentRank = entries.findIndex((e) => e.userId === sub.userId && e.packageId === sub.packageId) + 1;

    return NextResponse.json({
      success: true,
      rank: currentRank,
      totalParticipants: entries.length,
      entry: newEntry,
    });
  } catch (err) {
    console.error("Leaderboard POST error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan skor ke peringkat" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    inMemoryLeaderboard = [];
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(LEADERBOARD_FILE, JSON.stringify([], null, 2), "utf-8");
    return NextResponse.json({
      success: true,
      message: "Data papan peringkat berhasil direset.",
      totalParticipants: 0,
    });
  } catch (err) {
    console.error("Leaderboard DELETE error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal mereset papan peringkat" },
      { status: 500 }
    );
  }
}

