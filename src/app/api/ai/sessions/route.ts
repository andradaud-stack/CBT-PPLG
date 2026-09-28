import { NextRequest, NextResponse } from "next/server";
import { isTiDBConfigured, execute, query } from "@/lib/db/tidb";
import { ChatSession, ChatMessage } from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/ai/sessions?userId=...&email=...
 * Mengambil seluruh sesi percakapan AI Tutor milik pengguna dari TiDB Serverless.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: "userId atau email harus disertakan" },
        { status: 400 }
      );
    }

    if (!isTiDBConfigured()) {
      return NextResponse.json({
        success: true,
        mode: "local_only",
        sessions: [],
      });
    }

    let targetUserId = userId;
    if (!targetUserId && email) {
      const userRows = await query<Record<string, unknown>>(
        "SELECT `id` FROM `users` WHERE `email` = ? LIMIT 1;",
        [email]
      );
      if (userRows.length > 0) {
        targetUserId = String(userRows[0].id);
      }
    }

    if (!targetUserId) {
      return NextResponse.json({
        success: true,
        count: 0,
        sessions: [],
      });
    }

    // Ambil data sesi percakapan dari TiDB
    const rows = await query<Record<string, unknown>>(
      "SELECT `id`, `user_id`, `title`, `messages`, `created_at`, `updated_at` FROM `ai_chat_sessions` WHERE `user_id` = ? ORDER BY `updated_at` DESC;",
      [targetUserId]
    );

    const sessions: ChatSession[] = rows.map((r) => {
      let parsedMessages: ChatMessage[] = [];
      try {
        if (typeof r.messages === "string") {
          parsedMessages = JSON.parse(r.messages);
        } else if (Array.isArray(r.messages)) {
          parsedMessages = r.messages as unknown as ChatMessage[];
        }
      } catch {
        parsedMessages = [];
      }

      return {
        id: String(r.id),
        userId: String(r.user_id),
        title: String(r.title || "Obrolan AI"),
        messages: parsedMessages,
        createdAt: r.created_at ? new Date(String(r.created_at)).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(String(r.updated_at)).toISOString() : new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      mode: "tidb_serverless",
      count: sessions.length,
      sessions,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Gagal mengambil riwayat sesi AI dari TiDB";
    console.error("[TiDB Fetch AI Sessions Error]:", errorMsg);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/sessions
 * Menyimpan / menyinkronkan satu atau beberapa sesi obrolan ke TiDB Serverless.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId: string | undefined = body.userId;
    const email: string | undefined = body.email;
    const singleSession: ChatSession | undefined = body.session;
    const multipleSessions: ChatSession[] | undefined = body.sessions;

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: "userId atau email wajib disertakan" },
        { status: 400 }
      );
    }

    if (!isTiDBConfigured()) {
      return NextResponse.json({
        success: true,
        mode: "local_storage_fallback",
        message: "TiDB tidak terkonfigurasi, disimpan secara lokal",
      });
    }

    let targetUserId = userId;
    if (!targetUserId && email) {
      const userRows = await query<Record<string, unknown>>(
        "SELECT `id` FROM `users` WHERE `email` = ? LIMIT 1;",
        [email]
      );
      if (userRows.length > 0) {
        targetUserId = String(userRows[0].id);
      }
    }

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan di database" },
        { status: 404 }
      );
    }

    const sessionsToSave: ChatSession[] = multipleSessions || (singleSession ? [singleSession] : []);

    if (sessionsToSave.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Tidak ada data sesi untuk disimpan",
      });
    }

    // Upsert setiap sesi ke TiDB
    for (const s of sessionsToSave) {
      if (!s.id) continue;
      const title = (s.title || "Obrolan AI").slice(0, 250);
      const messagesJson = JSON.stringify(s.messages || []);
      const createdAt = s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 19).replace("T", " ") : new Date().toISOString().slice(0, 19).replace("T", " ");
      const updatedAt = s.updatedAt ? new Date(s.updatedAt).toISOString().slice(0, 19).replace("T", " ") : new Date().toISOString().slice(0, 19).replace("T", " ");

      await execute(
        `INSERT INTO \`ai_chat_sessions\`
         (\`id\`, \`user_id\`, \`title\`, \`messages\`, \`created_at\`, \`updated_at\`)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           \`title\` = VALUES(\`title\`),
           \`messages\` = VALUES(\`messages\`),
           \`updated_at\` = VALUES(\`updated_at\`);`,
        [s.id, targetUserId, title, messagesJson, createdAt, updatedAt]
      );
    }

    return NextResponse.json({
      success: true,
      mode: "tidb_serverless",
      message: `Berhasil menyinkronkan ${sessionsToSave.length} sesi obrolan AI ke cloud`,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Gagal menyinkronkan sesi AI ke TiDB";
    console.error("[TiDB Save AI Sessions Error]:", errorMsg);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ai/sessions?id=...&userId=...
 * Menghapus sesi percakapan dari TiDB Serverless.
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");
    const clearAll = searchParams.get("clearAll") === "true";

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId wajib disertakan" },
        { status: 400 }
      );
    }

    if (!isTiDBConfigured()) {
      return NextResponse.json({ success: true, mode: "local_only" });
    }

    if (clearAll) {
      await execute("DELETE FROM `ai_chat_sessions` WHERE `user_id` = ?;", [userId]);
      return NextResponse.json({
        success: true,
        message: "Seluruh riwayat sesi percakapan AI pengguna berhasil dihapus dari cloud",
      });
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Parameter id sesi wajib disertakan" },
        { status: 400 }
      );
    }

    await execute("DELETE FROM `ai_chat_sessions` WHERE `id` = ? AND `user_id` = ?;", [id, userId]);

    return NextResponse.json({
      success: true,
      message: "Sesi percakapan AI berhasil dihapus dari cloud",
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Gagal menghapus sesi AI dari TiDB";
    console.error("[TiDB Delete AI Session Error]:", errorMsg);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
