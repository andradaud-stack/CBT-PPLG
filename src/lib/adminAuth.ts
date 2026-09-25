/**
 * CBT-PPLG Admin Authentication & Security Gatekeeper
 * Protects /admin from unauthorized access with Master Passkey verification,
 * anti-brute-force rate limiting, and cryptographic session tokens.
 */

import { sha256 } from "./crypto";

const ADMIN_STORAGE_KEYS = {
  SESSION: "cbt_pplg_admin_session_token",
  ATTEMPTS: "cbt_pplg_admin_attempts_info",
  CUSTOM_PASSKEY_HASH: "cbt_pplg_admin_passkey_hash",
};

// Default fallback master passkey hash for "cbt-admin-2026"
const DEFAULT_PASSKEY_HASH = sha256("salt:admin_gate:pwd:cbt-admin-2026");

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 menit

interface AttemptRecord {
  failedCount: number;
  lockedUntil: number;
}

function isClient(): boolean {
  return typeof window !== "undefined";
}

function getStoredPasskeyHash(): string {
  if (!isClient()) return DEFAULT_PASSKEY_HASH;
  return localStorage.getItem(ADMIN_STORAGE_KEYS.CUSTOM_PASSKEY_HASH) || DEFAULT_PASSKEY_HASH;
}

function getAttemptRecord(): AttemptRecord {
  if (!isClient()) return { failedCount: 0, lockedUntil: 0 };
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEYS.ATTEMPTS);
    if (!raw) return { failedCount: 0, lockedUntil: 0 };
    return JSON.parse(raw);
  } catch {
    return { failedCount: 0, lockedUntil: 0 };
  }
}

function saveAttemptRecord(record: AttemptRecord): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(ADMIN_STORAGE_KEYS.ATTEMPTS, JSON.stringify(record));
  } catch (err) {
    console.error("Error saving admin attempt record:", err);
  }
}

/**
 * Cek apakah admin sedang terkunci karena salah PIN/Passkey berulang kali
 */
export function getAdminLockoutStatus(): { isLocked: boolean; remainingSeconds: number } {
  const record = getAttemptRecord();
  const now = Date.now();
  if (record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds };
  }
  return { isLocked: false, remainingSeconds: 0 };
}

/**
 * Cek apakah sesi admin saat ini valid dan terautentikasi
 */
export function isAdminAuthenticated(): boolean {
  if (!isClient()) return false;
  try {
    const token = sessionStorage.getItem(ADMIN_STORAGE_KEYS.SESSION);
    if (!token) return false;
    const currentHash = getStoredPasskeyHash();
    const expectedToken = sha256(`admin_session_valid:${currentHash}`);
    return token === expectedToken;
  } catch {
    return false;
  }
}

/**
 * Verifikasi Master Passkey Admin dengan proteksi Brute-Force
 */
export function verifyAdminPasskey(passkey: string): {
  success: boolean;
  message: string;
  remainingAttempts?: number;
  lockUntil?: number;
} {
  if (!isClient()) return { success: false, message: "Aksi hanya dapat dilakukan di browser." };

  const lockout = getAdminLockoutStatus();
  if (lockout.isLocked) {
    return {
      success: false,
      message: `Akses ditangguhkan sementara karena terlalu banyak percobaan salah. Coba lagi dalam ${lockout.remainingSeconds} detik.`,
    };
  }

  const record = getAttemptRecord();
  const inputHash = sha256(`salt:admin_gate:pwd:${passkey.trim()}`);
  const targetHash = getStoredPasskeyHash();

  if (inputHash === targetHash) {
    // Reset percobaan jika berhasil
    saveAttemptRecord({ failedCount: 0, lockedUntil: 0 });

    // Terbitkan token sesi admin (hanya berlaku selama tab aktif via sessionStorage)
    const sessionToken = sha256(`admin_session_valid:${targetHash}`);
    sessionStorage.setItem(ADMIN_STORAGE_KEYS.SESSION, sessionToken);

    return {
      success: true,
      message: "Otentikasi berhasil! Mengakses Pusat Kendali Admin...",
    };
  }

  // Jika salah, catat kegagalan
  const newFailedCount = record.failedCount + 1;
  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - newFailedCount);

  if (newFailedCount >= MAX_FAILED_ATTEMPTS) {
    const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    saveAttemptRecord({ failedCount: newFailedCount, lockedUntil });
    return {
      success: false,
      message: "Terlalu banyak percobaan gagal. Akses Admin dikunci otomatis selama 15 menit demi keamanan.",
      remainingAttempts: 0,
      lockUntil: lockedUntil,
    };
  }

  saveAttemptRecord({ failedCount: newFailedCount, lockedUntil: 0 });
  return {
    success: false,
    message: `Kunci Passkey Admin salah! Sisa percobaan: ${remaining} kali sebelum akun dikunci.`,
    remainingAttempts: remaining,
  };
}

/**
 * Keluar dari sesi admin
 */
export function logoutAdmin(): void {
  if (!isClient()) return;
  try {
    sessionStorage.removeItem(ADMIN_STORAGE_KEYS.SESSION);
  } catch (err) {
    console.error("Error logging out admin:", err);
  }
}

/**
 * Ubah Master Passkey Admin
 */
export function changeAdminPasskey(
  currentPasskey: string,
  newPasskey: string
): { success: boolean; message: string } {
  if (!newPasskey || newPasskey.trim().length < 8) {
    return { success: false, message: "Kunci Passkey baru minimal harus 8 karakter." };
  }

  const verify = verifyAdminPasskey(currentPasskey);
  if (!verify.success) {
    return { success: false, message: "Passkey saat ini tidak sesuai." };
  }

  const newHash = sha256(`salt:admin_gate:pwd:${newPasskey.trim()}`);
  localStorage.setItem(ADMIN_STORAGE_KEYS.CUSTOM_PASSKEY_HASH, newHash);

  // Perbarui token sesi dengan hash baru
  const sessionToken = sha256(`admin_session_valid:${newHash}`);
  sessionStorage.setItem(ADMIN_STORAGE_KEYS.SESSION, sessionToken);

  return { success: true, message: "Master Passkey Admin berhasil diperbarui!" };
}
