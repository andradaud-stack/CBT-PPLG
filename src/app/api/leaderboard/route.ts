import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { LeaderboardEntry } from "@/types";
import { checkRateLimit, validateExamSubmission, sanitizeInput } from "@/lib/security";
import { verifyExamSignature } from "@/lib/crypto";
import { isTiDBConfigured, query, execute } from "@/lib/db/tidb";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADERBOARD_FILE = path.join(DATA_DIR, "leaderboard.json");

// In-memory fallback if file system is read-only in some serverless hosts
let inMemoryLeaderboard: LeaderboardEntry[] = [];

// Empty seed: leaderboard begins completely clean for real tryout participants
const SEED_LEADERBOARD: LeaderboardEntry[] = [];

async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
  // 1. Prioritaskan data cloud TiDB Serverless (persisten lintas lambda & perangkat)
  if (isTiDBConfigured()) {
    try {
      const rows = await query<Record<string, unknown>>(`
        SELECT 
          a.id,
          a.user_id as userId,
          COALESCE(u.name, a.user_name) as name,
          COALESCE(u.school, 'SMK Negeri 2 Semarang') as school,
          COALESCE(u.class_grade, 'XII PPLG') as classGrade,
          a.irt_score as score,
          0 as theta,
          a.total_questions as totalQuestions,
          a.correct_count as totalCorrect,
          ROUND((a.correct_count / a.total_questions) * 100) as accuracy,
          a.duration_seconds as durationSeconds,
          CAST(a.package_id AS SIGNED) as packageId,
          a.package_title as packageName,
          1 as streak,
          a.created_at as submittedAt
        FROM \`attempts\` a
        LEFT JOIN \`users\` u ON a.user_id = u.id OR a.user_name = u.name
        ORDER BY a.irt_score DESC, a.duration_seconds ASC;
      `);

      if (Array.isArray(rows) && rows.length > 0) {
        const dbEntries: LeaderboardEntry[] = rows.map((r) => ({
          id: String(r.id),
          userId: String(r.userId),
          name: String(r.name || "Siswa"),
          school: String(r.school || "SMK"),
          classGrade: String(r.classGrade || "XII PPLG"),
          score: Number(r.score || 0),
          theta: Number(r.theta || 0),
          totalQuestions: Number(r.totalQuestions || 30),
          totalCorrect: Number(r.totalCorrect || 0),
          accuracy: Number(r.accuracy || 0),
          durationSeconds: Number(r.durationSeconds || 0),
          packageId: Number(r.packageId || 1),
          packageName: String(r.packageName || "Paket Tryout"),
          streak: Number(r.streak || 1),
          submittedAt: String(r.submittedAt || new Date().toISOString()),
        }));

        // Deduplikasi: Ambil percobaan terbaik per user per paket
        const bestMap = new Map<string, LeaderboardEntry>();
        for (const entry of dbEntries) {
          const key = `${entry.userId}-${entry.packageId}`;
          const existing = bestMap.get(key);
          if (!existing || entry.score > existing.score || (entry.score === existing.score && entry.durationSeconds < existing.durationSeconds)) {
            bestMap.set(key, entry);
          }
        }

        const uniqueEntries = Array.from(bestMap.values());
        inMemoryLeaderboard = uniqueEntries;
        return uniqueEntries;
      }
    } catch (err) {
      console.warn("[Leaderboard TiDB Query Fallback]:", err);
    }
  }

  // 2. Fallback file lokal / in-memory
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const data = await fs.readFile(LEADERBOARD_FILE, "utf-8");
      const parsed: LeaderboardEntry[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryLeaderboard = parsed;
        return parsed;
      }
    } catch {
      // File not found or empty, initialize seed
    }

    if (inMemoryLeaderboard.length > 0) {
      return inMemoryLeaderboard;
    }

    return SEED_LEADERBOARD;
  } catch (err) {
    console.warn("Storage warning in leaderboard, using in-memory:", err);
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
  signature: z.string().optional(),
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

    // 2.5 Cryptographic Signature Verification (Anti-Spoofing & cURL / DevTools Tampering)
    const isSignatureValid = verifyExamSignature(sub.signature, {
      userId: sub.userId,
      packageId: sub.packageId,
      totalQuestions: sub.totalQuestions,
      totalCorrect: sub.totalCorrect,
      score: sub.score,
    });

    if (!isSignatureValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Integritas Kriptografi Ditolak: Tanda tangan digital (signature) ujian tidak valid atau terindikasi manipulasi sepihak melalui DevTools/API eksternal.",
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

    // Update TiDB users table latest_irt_score jika tersedia
    if (isTiDBConfigured() && sub.userId && sub.score > 0) {
      execute(
        "UPDATE `users` SET `latest_irt_score` = ? WHERE `id` = ? AND (`latest_irt_score` IS NULL OR `latest_irt_score` < ?)",
        [sub.score, sub.userId, sub.score]
      ).catch(() => {});
    }

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

