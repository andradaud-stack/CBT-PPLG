import { NextRequest, NextResponse } from "next/server";
import { isTiDBConfigured, query, execute } from "@/lib/db/tidb";

export const dynamic = "force-dynamic";

// GET /api/admin/users - Ambil daftar semua user dari database TiDB
export async function GET() {
  try {
    if (!isTiDBConfigured()) {
      return NextResponse.json({
        success: true,
        source: "local_storage_fallback",
        users: [],
      });
    }

    const rows = await query<Record<string, unknown>>(
      `SELECT 
        u.\`id\`, 
        u.\`name\`, 
        u.\`email\`, 
        u.\`school\`, 
        u.\`class_grade\` as classGrade, 
        u.\`role\`, 
        u.\`latest_irt_score\` as latestIrtScore, 
        u.\`is_active\` as isActive, 
        u.\`created_at\` as createdAt,
        CAST(COUNT(a.\`id\`) AS SIGNED) as totalAttempts,
        CAST(COALESCE(ROUND(AVG(a.\`irt_score\`)), 0) AS SIGNED) as averageIrtScore,
        CAST(COALESCE(MAX(a.\`irt_score\`), 0) AS SIGNED) as bestIrtScore
      FROM \`users\` u
      LEFT JOIN \`attempts\` a ON (a.\`user_id\` = u.\`id\` OR a.\`user_name\` = u.\`name\`)
      GROUP BY u.\`id\`, u.\`name\`, u.\`email\`, u.\`school\`, u.\`class_grade\`, u.\`role\`, u.\`latest_irt_score\`, u.\`is_active\`, u.\`created_at\`
      ORDER BY u.\`created_at\` DESC`
    );

    const formattedUsers = rows.map((r) => ({
      id: String(r.id),
      name: String(r.name),
      email: String(r.email),
      school: String(r.school || "SMK"),
      classGrade: String(r.classGrade || "XII PPLG"),
      role: String(r.role || "student"),
      latestIrtScore: Number(r.latestIrtScore) || 0,
      isActive: Boolean(r.isActive),
      createdAt: String(r.createdAt),
      totalAttempts: Number(r.totalAttempts) || 0,
      averageIrtScore: Number(r.averageIrtScore) || 0,
      bestIrtScore: Number(r.bestIrtScore) || 0,
    }));

    return NextResponse.json(
      {
        success: true,
        source: "tidb_serverless",
        users: formattedUsers,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Gagal mengambil data user dari TiDB";
    console.error("[TiDB Users GET Error]:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

// POST /api/admin/users - Tambah atau Perbarui User di TiDB
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, email, school, classGrade, role, password_hash } = body;

    if (!id || !name || !email) {
      return NextResponse.json({ success: false, error: "ID, Nama, dan Email wajib diisi." }, { status: 400 });
    }

    if (!isTiDBConfigured()) {
      return NextResponse.json({
        success: true,
        source: "local_storage_fallback",
        message: "Data user disimpan di localStorage (TiDB belum dikonfigurasi).",
      });
    }

    const validRole =
      role === "teacher" || role === "guru"
        ? "guru"
        : role === "admin"
        ? "admin"
        : "siswa";

    await execute(
      `INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password_hash\`, \`school\`, \`class_grade\`, \`role\`, \`latest_irt_score\`, \`is_active\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, TRUE)
       ON DUPLICATE KEY UPDATE 
         \`name\` = VALUES(\`name\`),
         \`school\` = VALUES(\`school\`),
         \`class_grade\` = VALUES(\`class_grade\`),
         \`role\` = VALUES(\`role\`);`,
      [
        id,
        name,
        email.trim().toLowerCase(),
        password_hash || "fallback_pass_hash_secure",
        school || "",
        classGrade || "",
        validRole,
      ]
    );

    return NextResponse.json({
      success: true,
      source: "tidb_serverless",
      message: `User ${name} berhasil disimpan di TiDB.`,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Gagal menyimpan user di TiDB";
    console.error("[TiDB Users POST Error]:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

// DELETE /api/admin/users?id=... - Hapus User Permanen dari TiDB
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ success: false, error: "Parameter ID user wajib disertakan." }, { status: 400 });
    }

    if (!isTiDBConfigured()) {
      return NextResponse.json({
        success: true,
        source: "local_storage_fallback",
        message: "User dihapus dari penyimpanan lokal.",
      });
    }

    // Hapus dari tabel users di TiDB
    await execute(`DELETE FROM \`users\` WHERE \`id\` = ? OR \`email\` = ?`, [userId, userId]);

    // Hapus juga attempt terkait user tersebut agar bersih
    await execute(`DELETE FROM \`attempts\` WHERE \`user_id\` = ?`, [userId]);

    return NextResponse.json({
      success: true,
      source: "tidb_serverless",
      message: `User ID ${userId} berhasil dihapus permanen dari TiDB Cloud.`,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Gagal menghapus user di TiDB";
    console.error("[TiDB Users DELETE Error]:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
