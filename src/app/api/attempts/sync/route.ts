import { NextRequest, NextResponse } from "next/server";
import { isTiDBConfigured, execute } from "@/lib/db/tidb";
import { Attempt } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const attempt: Attempt = body.attempt;
    const userName: string = body.userName || "Siswa";

    if (!attempt || !attempt.id || !attempt.userId) {
      return NextResponse.json(
        { success: false, error: "Data attempt tidak lengkap (id atau userId hilang)" },
        { status: 400 }
      );
    }

    // Jika TiDB belum terkonfigurasi, kembalikan status local fallback
    if (!isTiDBConfigured()) {
      return NextResponse.json({
        success: true,
        mode: "local_storage_fallback",
        message: "Attempt disimpan di localStorage (TiDB DATABASE_URL belum dikonfigurasi)",
      });
    }

    const score = attempt.irtResult?.overallAccuracy || 0;
    const irtScore = attempt.irtResult?.score || 0;
    const totalQuestions = attempt.questions?.length || 0;
    const correctCount = attempt.irtResult?.totalCorrect || 0;
    const incorrectCount = totalQuestions - correctCount;

    // Simpan ke tabel attempts TiDB
    await execute(
      `INSERT INTO \`attempts\` 
       (\`id\`, \`user_id\`, \`user_name\`, \`package_id\`, \`package_title\`, \`score\`, \`irt_score\`, \`total_questions\`, \`correct_count\`, \`incorrect_count\`, \`duration_seconds\`, \`answers\`, \`created_at\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         \`score\` = VALUES(\`score\`),
         \`irt_score\` = VALUES(\`irt_score\`),
         \`duration_seconds\` = VALUES(\`duration_seconds\`);`,
      [
        attempt.id,
        attempt.userId,
        userName,
        attempt.packageId ? String(attempt.packageId) : "practice",
        attempt.packageName || attempt.topic || "Latihan Mandiri",
        score,
        irtScore,
        totalQuestions,
        correctCount,
        incorrectCount,
        attempt.durationSeconds || 0,
        JSON.stringify(attempt.answers || {}),
        attempt.finishedAt || new Date().toISOString(),
      ]
    );

    // Update skor IRT terbaru di profil user
    if (attempt.userId && irtScore > 0) {
      await execute(
        `UPDATE \`users\` SET \`latest_irt_score\` = ? WHERE \`id\` = ?`,
        [irtScore, attempt.userId]
      );
    }

    return NextResponse.json({
      success: true,
      mode: "tidb_serverless",
      message: "Attempt berhasil disinkronisasi ke database TiDB Cloud",
      attemptId: attempt.id,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Gagal menyinkronkan attempt ke TiDB";
    console.error("[TiDB Sync Error]:", errorMsg);
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
