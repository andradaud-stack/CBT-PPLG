import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security";
import { sha256, hashPassword } from "@/lib/crypto";

// Fallback hash (Salted SHA-256) untuk memastikan akun tetap langsung aktif di Vercel/Cloud meski belum menyetel ENV
const FALLBACK_PASSKEY_HASH = "b480adeda7ecc89d8f363388bec995bc9b7dcba21f3a00ca1a3e2d7d9e072b73";

export async function POST(req: NextRequest) {
  // 1. Rate Limiting Protection (Anti-Brute Force at Server Level: max 5 attempts per 15 minutes)
  const rateCheck = checkRateLimit(req, {
    keyPrefix: "admin-auth-bf",
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Akses ditangguhkan karena terlalu banyak percobaan salah. Coba lagi dalam ${rateCheck.resetInSec} detik demi keamanan server.`,
        locked: true,
        resetInSec: rateCheck.resetInSec,
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const passkey = (body.passkey || "").trim();

    if (!passkey) {
      return NextResponse.json(
        { success: false, error: "Master Passkey wajib diisi." },
        { status: 400 }
      );
    }

    // Bandingkan passkey secara aman di sisi Server:
    // 1) Gunakan nilai dari process.env.ADMIN_MASTER_PASSKEY jika dikonfigurasi di dashboard hosting (Vercel)
    // 2) Atau verifikasi kecocokan hash satu arah (Salted SHA-256) jika ENV belum disetel
    const envPasskey = process.env.ADMIN_MASTER_PASSKEY;
    const isPasskeyCorrect = envPasskey
      ? passkey === envPasskey
      : hashPassword(passkey) === FALLBACK_PASSKEY_HASH;

    if (isPasskeyCorrect) {
      // Terbitkan token sesi terverifikasi kriptografi
      const sessionToken = sha256(`admin_session_valid:${passkey}:salt_sys`);

      return NextResponse.json({
        success: true,
        message: "Otentikasi berhasil! Mengakses Pusat Kendali Admin...",
        token: sessionToken,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: `Kunci Passkey Admin salah! Sisa percobaan: ${rateCheck.remaining} kali sebelum terkunci.`,
        remainingAttempts: rateCheck.remaining,
      },
      { status: 401 }
    );
  } catch (err) {
    console.error("Admin auth server error:", err);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal server saat memverifikasi hak akses." },
      { status: 500 }
    );
  }
}
