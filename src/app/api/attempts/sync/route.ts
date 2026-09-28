import { NextRequest, NextResponse } from "next/server";
import { isTiDBConfigured, execute, query } from "@/lib/db/tidb";
import { Attempt } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const userName = searchParams.get("userName");
    const email = searchParams.get("email");
    const getAll = searchParams.get("all") === "true";

    if (!userId && !userName && !email && !getAll) {
      return NextResponse.json(
        { success: false, error: "userId, userName, atau email harus disertakan" },
        { status: 400 }
      );
    }

    if (!isTiDBConfigured()) {
      return NextResponse.json({
        success: true,
        mode: "local_only",
        attempts: [],
      });
    }

    // Ambil data attempt dari TiDB
    let sql = "SELECT * FROM `attempts` WHERE 1=0";
    const params: (string | number | boolean | null)[] = [];

    if (getAll) {
      sql = "SELECT * FROM `attempts` ORDER BY `created_at` DESC";
    } else {
      // Cari user ID jika diberikan email
      let targetUserId = userId;
      let targetUserName = userName;
      if (email) {
        const userRows = await query<Record<string, unknown>>(
          "SELECT id, name FROM `users` WHERE `email` = ? LIMIT 1;",
          [email]
        );
        if (userRows.length > 0) {
          if (!targetUserId) targetUserId = String(userRows[0].id);
          if (!targetUserName) targetUserName = String(userRows[0].name);
        }
      }

      if (targetUserId && targetUserName) {
        sql = "SELECT * FROM `attempts` WHERE `user_id` = ? OR `user_name` = ? ORDER BY `created_at` DESC";
        params.push(targetUserId, targetUserName);
      } else if (targetUserId) {
        sql = "SELECT * FROM `attempts` WHERE `user_id` = ? ORDER BY `created_at` DESC";
        params.push(targetUserId);
      } else if (targetUserName) {
        sql = "SELECT * FROM `attempts` WHERE `user_name` = ? ORDER BY `created_at` DESC";
        params.push(targetUserName);
      }
    }

    const rows = await query<Record<string, unknown>>(sql, params);

    const attempts: Attempt[] = rows.map((r) => {
      let parsedAnswers = {};
      try {
        if (typeof r.answers === "string") {
          parsedAnswers = JSON.parse(r.answers);
        } else if (r.answers && typeof r.answers === "object") {
          parsedAnswers = r.answers;
        }
      } catch {
        parsedAnswers = {};
      }

      const totalQ = Number(r.total_questions) || 30;
      const correctQ = Number(r.correct_count) || 0;
      const rawScore = Number(r.score) || (totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0);
      const irtScore = Number(r.irt_score) || (rawScore > 0 ? Math.round(rawScore * 6 + 200) : 0);
      const pkgId = parseInt(String(r.package_id), 10) || 1;

      return {
        id: String(r.id),
        userId: String(r.user_id),
        mode: "simulation",
        packageId: pkgId,
        packageName: String(r.package_title || `Paket ${pkgId}`),
        startedAt: String(r.created_at),
        finishedAt: String(r.created_at),
        durationSeconds: Number(r.duration_seconds) || 0,
        questions: [],
        answers: parsedAnswers,
        irtResult: {
          theta: 0,
          score: irtScore,
          overallAccuracy: rawScore,
          totalQuestions: totalQ,
          totalAnswered: totalQ,
          totalCorrect: correctQ,
          byDifficulty: {
            mudah: { total: 0, correct: 0, percentage: 0 },
            sedang: { total: 0, correct: 0, percentage: 0 },
            sulit: { total: 0, correct: 0, percentage: 0 },
          },
          byTopic: {},
        },
        proctoringMode: true,
        tabSwitchCount: 0,
        isFullscreenViolated: false,
        integrityStatus: "clean",
      };
    });

    return NextResponse.json({
      success: true,
      mode: "tidb_serverless",
      count: attempts.length,
      attempts,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Gagal mengambil data attempts dari TiDB";
    console.error("[TiDB Fetch Attempts Error]:", errorMsg);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

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
