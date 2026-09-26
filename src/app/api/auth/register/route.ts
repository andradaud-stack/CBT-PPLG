import { NextRequest, NextResponse } from "next/server";
import { isTiDBConfigured, query, execute } from "@/lib/db/tidb";
import { hashPassword } from "@/lib/crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const school = (body.school || "").trim();
    const classGrade = (body.classGrade || "").trim();
    const password = body.password || "password123";

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Nama lengkap dan email wajib diisi." },
        { status: 400 }
      );
    }

    if (!isTiDBConfigured()) {
      return NextResponse.json(
        {
          success: false,
          fallbackToLocal: true,
          message: "Database cloud tidak terhubung. Menggunakan penyimpanan lokal.",
        },
        { status: 503 }
      );
    }

    // Periksa apakah email sudah ada di TiDB
    const existing = await query<{ id: string }>(
      "SELECT `id` FROM `users` WHERE LOWER(`email`) = LOWER(?) LIMIT 1",
      [email]
    );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email ini sudah terdaftar. Silakan langsung masuk pada tab 'Masuk Akun'.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Simpan akun baru ke TiDB Serverless
    await execute(
      `INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password_hash\`, \`school\`, \`class_grade\`, \`role\`, \`latest_irt_score\`, \`is_active\`)
       VALUES (?, ?, ?, ?, ?, ?, 'siswa', 0, 1)`,
      [
        userId,
        name,
        email,
        hashedPassword,
        school || "SMK Pusat Keunggulan PPLG",
        classGrade || "XII PPLG",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil! Akun Anda aktif di Cloud CBT-PPLG.",
      user: {
        id: userId,
        name,
        email,
        school: school || "SMK Pusat Keunggulan PPLG",
        classGrade: classGrade || "XII PPLG",
        role: "siswa",
        latestIrtScore: 0,
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Terjadi kesalahan internal server";
    console.error("[Auth Register API Error]:", errorMsg);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memproses pendaftaran: " + errorMsg,
      },
      { status: 500 }
    );
  }
}
