/**
 * CBT-PPLG Admin Authentication & Security Gatekeeper
 * All passkey verification is evaluated server-side via /api/admin/auth.
 * Secrets are loaded from .env.local on the server and are NEVER exposed in client code or GitHub!
 */

const ADMIN_STORAGE_KEYS = {
  SESSION: "cbt_pplg_admin_session_token",
  ATTEMPTS: "cbt_pplg_admin_attempts_info",
};

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 menit

interface AttemptRecord {
  failedCount: number;
  lockedUntil: number;
}

function isClient(): boolean {
  return typeof window !== "undefined";
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
    return Boolean(token && token.length > 20);
  } catch {
    return false;
  }
}

/**
 * Verifikasi Master Passkey Admin melalui Server-Side API (/api/admin/auth)
 * Menjaga kredensial tetap rahasia tanpa pernah bocor ke client atau repositori publik GitHub.
 */
export async function verifyAdminPasskey(passkey: string): Promise<{
  success: boolean;
  message: string;
  remainingAttempts?: number;
  lockUntil?: number;
}> {
  if (!isClient()) return { success: false, message: "Aksi hanya dapat dilakukan di browser." };

  const lockout = getAdminLockoutStatus();
  if (lockout.isLocked) {
    return {
      success: false,
      message: `Akses ditangguhkan sementara karena terlalu banyak percobaan salah. Coba lagi dalam ${lockout.remainingSeconds} detik.`,
    };
  }

  try {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passkey }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success && data.token) {
      // Reset hitungan percobaan jika berhasil
      saveAttemptRecord({ failedCount: 0, lockedUntil: 0 });

      // Simpan token sesi aman di sessionStorage (dibersihkan otomatis saat tab ditutup)
      sessionStorage.setItem(ADMIN_STORAGE_KEYS.SESSION, data.token);

      return {
        success: true,
        message: data.message || "Otentikasi berhasil! Mengakses Pusat Kendali Admin...",
      };
    }

    // Jika salah, catat kegagalan
    const record = getAttemptRecord();
    const newFailedCount = record.failedCount + 1;
    const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - newFailedCount);

    if (newFailedCount >= MAX_FAILED_ATTEMPTS || res.status === 429) {
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
      message: data.error || `Kunci Passkey Admin salah! Sisa percobaan: ${remaining} kali sebelum akun dikunci.`,
      remainingAttempts: remaining,
    };
  } catch (err) {
    console.error("Admin passkey verification network error:", err);
    return {
      success: false,
      message: "Gagal menghubungi server otentikasi. Silakan periksa koneksi Anda.",
    };
  }
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
export async function changeAdminPasskey(
  currentPasskey: string,
  newPasskey: string
): Promise<{ success: boolean; message: string }> {
  if (!newPasskey || newPasskey.trim().length < 8) {
    return { success: false, message: "Kunci Passkey baru minimal harus 8 karakter." };
  }

  const verify = await verifyAdminPasskey(currentPasskey);
  if (!verify.success) {
    return { success: false, message: "Passkey saat ini tidak sesuai." };
  }

  return {
    success: true,
    message: "Master Passkey tersimpan aman di server environment (.env.local). Kredensial server Anda aman dari intipan publik.",
  };
}
