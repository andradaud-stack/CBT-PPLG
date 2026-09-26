import { NextRequest, NextResponse } from "next/server";
import { isTiDBConfigured, query, execute } from "@/lib/db/tidb";
import { hashPassword } from "@/lib/crypto";

export const dynamic = "force-dynamic";

interface TiDBUserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  school: string | null;
  class_grade: string | null;
  role: string | null;
  latest_irt_score: number | null;
  is_active: number | boolean | null;
  created_at: string | null;
}

// GET /api/auth/sync - Ambil seluruh daftar user aktif dari TiDB
export async function GET() {
  try {
    if (!isTiDBConfigured()) {
      return NextResponse.json({ success: true, users: [] });
    }

    const rows = await query<TiDBUserRow>(
      `SELECT \`id\`, \`name\`, \`email\`, \`school\`, \`class_grade\` as classGrade, \`role\`, \`latest_irt_score\` as latestIrtScore, \`is_active\` as isActive, \`created_at\` as createdAt
       FROM \`users\`
       WHERE \`is_active\` = 1 OR \`is_active\` IS NULL
       ORDER BY \`created_at\` DESC`
    );

    return NextResponse.json({
      success: true,
      users: rows.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        school: u.school || "",
        classGrade: u.class_grade || "",
        role: u.role || "siswa",
        latestIrtScore: Number(u.latest_irt_score) === 800 ? 0 : Number(u.latest_irt_score) || 0,
        createdAt: u.created_at || new Date().toISOString(),
      })),
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Error querying TiDB users";
    console.error("[TiDB Auth Sync GET Error]:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

// POST /api/auth/sync - Unggah akun lokal ke TiDB agar sinkron antar perangkat (HP & Laptop)
export async function POST(req: NextRequest) {
  try {
    if (!isTiDBConfigured()) {
      return NextResponse.json({ success: true, message: "TiDB offline fallback" });
    }

    const body = await req.json().catch(() => ({}));
    const localUsers: Array<{
      id?: string;
      name?: string;
      email?: string;
      school?: string;
      classGrade?: string;
      role?: string;
      password?: string;
      latestIrtScore?: number;
    }> = Array.isArray(body.users) ? body.users : [];

    let syncedCount = 0;

    for (const u of localUsers) {
      if (!u.email || !u.name) continue;
      const normalizedEmail = u.email.trim().toLowerCase();

      // Lewati admin master
      if (normalizedEmail === "admin@cbt-pplg.sch.id") continue;

      // Cek apakah sudah ada di TiDB
      const existing = await query<{ id: string }>(
        "SELECT `id` FROM `users` WHERE LOWER(`email`) = LOWER(?) LIMIT 1",
        [normalizedEmail]
      );

      if (!existing || existing.length === 0) {
        // Insert user lokal ke TiDB
        const newId = u.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const passHash = u.password ? (u.password.length === 64 ? u.password : hashPassword(u.password)) : hashPassword("password123");
        const score = Number(u.latestIrtScore) === 800 ? 0 : Number(u.latestIrtScore) || 0;

        await execute(
          `INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password_hash\`, \`school\`, \`class_grade\`, \`role\`, \`latest_irt_score\`, \`is_active\`)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            newId,
            u.name.trim(),
            normalizedEmail,
            passHash,
            u.school || "SMK Pusat Keunggulan PPLG",
            u.classGrade || "XII PPLG",
            u.role || "siswa",
            score,
          ]
        );
        syncedCount++;
      }
    }

    // Ambil daftar terbaru dari TiDB untuk dikembalikan ke client
    const allUsers = await query<TiDBUserRow>(
      `SELECT \`id\`, \`name\`, \`email\`, \`school\`, \`class_grade\` as classGrade, \`role\`, \`latest_irt_score\` as latestIrtScore, \`is_active\` as isActive, \`created_at\` as createdAt
       FROM \`users\`
       WHERE \`is_active\` = 1 OR \`is_active\` IS NULL
       ORDER BY \`created_at\` DESC`
    );

    return NextResponse.json({
      success: true,
      syncedCount,
      users: allUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        school: u.school || "",
        classGrade: u.class_grade || "",
        role: u.role || "siswa",
        latestIrtScore: Number(u.latest_irt_score) === 800 ? 0 : Number(u.latest_irt_score) || 0,
        createdAt: u.created_at || new Date().toISOString(),
      })),
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Error syncing users";
    console.error("[TiDB Auth Sync POST Error]:", errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
