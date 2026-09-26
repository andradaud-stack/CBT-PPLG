import { UserProfile } from "@/types";
import { saveUserProfile } from "./storage";
import { hashPassword, verifyPassword } from "./crypto";

export interface RegisteredUser extends UserProfile {
  password?: string;
  createdAt: string;
}

const AUTH_STORAGE_KEYS = {
  SESSION: "cbt_pplg_session",
  USERS: "cbt_pplg_registered_users",
};

export const OFFICIAL_ADMIN_USER: RegisteredUser = {
  id: "admin-master-root",
  name: "Administrator Utama (SysAdmin)",
  email: "admin@cbt-pplg.sch.id",
  school: "SMK Pusat Keunggulan PPLG",
  classGrade: "Ruang Kontrol & Server",
  latestIrtScore: 0,
  // Pre-hashed with salted SHA-256 (Original password is never exposed in git)
  password: "b480adeda7ecc89d8f363388bec995bc9b7dcba21f3a00ca1a3e2d7d9e072b73",
  createdAt: "2026-09-01T00:00:00.000Z",
};

export const DEMO_USERS: RegisteredUser[] = [];

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getRegisteredUsers(): RegisteredUser[] {
  if (!isClient()) return [OFFICIAL_ADMIN_USER];
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(AUTH_STORAGE_KEYS.USERS, JSON.stringify([OFFICIAL_ADMIN_USER]));
      return [OFFICIAL_ADMIN_USER];
    }
    const list: RegisteredUser[] = JSON.parse(raw);
    if (!Array.isArray(list)) return [OFFICIAL_ADMIN_USER];
    const cleaned = list.filter(
      (u) =>
        u.id !== "user-arya-1" &&
        u.id !== "user-nadia-2" &&
        u.email !== "arya.wicaksana@smk.cbt-pplg.sch.id" &&
        u.email !== "nadia.kirana@smk.cbt-pplg.sch.id"
    );

    const hasAdmin = cleaned.some((u) => u.email.toLowerCase() === "admin@cbt-pplg.sch.id");
    if (!hasAdmin) {
      cleaned.unshift(OFFICIAL_ADMIN_USER);
    } else {
      const adminIdx = cleaned.findIndex((u) => u.email.toLowerCase() === "admin@cbt-pplg.sch.id");
      if (adminIdx !== -1) {
        if (cleaned[adminIdx].password !== OFFICIAL_ADMIN_USER.password) {
          cleaned[adminIdx].password = OFFICIAL_ADMIN_USER.password;
        }
        // Bersihkan skor lama 800 yang dulu ter-seed tidak sengaja
        if (cleaned[adminIdx].latestIrtScore === 800) {
          cleaned[adminIdx].latestIrtScore = 0;
        }
      }
    }

    localStorage.setItem(AUTH_STORAGE_KEYS.USERS, JSON.stringify(cleaned));
    return cleaned;
  } catch {
    return [OFFICIAL_ADMIN_USER];
  }
}

export function saveRegisteredUsers(users: RegisteredUser[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.error("Error saving registered users:", err);
  }
}

export function getAuthSession(): { isLoggedIn: boolean; user: UserProfile | null } {
  if (!isClient()) return { isLoggedIn: false, user: null };
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.SESSION);
    if (!raw) {
      return { isLoggedIn: false, user: null };
    }
    const session = JSON.parse(raw);
    if (
      !session ||
      !session.user ||
      session.user.id === "user-arya-1" ||
      session.user.id === "user-nadia-2" ||
      session.user.email === "arya.wicaksana@smk.cbt-pplg.sch.id" ||
      session.user.email === "nadia.kirana@smk.cbt-pplg.sch.id"
    ) {
      localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
      return { isLoggedIn: false, user: null };
    }
    if (session && session.user && session.user.latestIrtScore === 800) {
      session.user.latestIrtScore = 0;
      localStorage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify(session));
      saveUserProfile(session.user);
    }
    return session && session.isLoggedIn ? session : { isLoggedIn: false, user: null };
  } catch {
    return { isLoggedIn: false, user: null };
  }
}

export function setAuthSession(user: UserProfile): void {
  if (!isClient()) return;
  try {
    const session = { isLoggedIn: true, user };
    localStorage.setItem(AUTH_STORAGE_KEYS.SESSION, JSON.stringify(session));
    saveUserProfile(user);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cendekia:auth-changed"));
    }
  } catch (err) {
    console.error("Error saving auth session:", err);
  }
}

export function clearAuthSession(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cendekia:auth-changed"));
    }
  } catch (err) {
    console.error("Error clearing auth session:", err);
  }
}

export function loginUser(email: string, password?: string): { success: boolean; message: string; user?: UserProfile } {
  const users = getRegisteredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    return {
      success: false,
      message: "Email belum terdaftar. Silakan lakukan pendaftaran akun baru pada tab 'Daftar Baru'.",
    };
  }

  if (password && user.password && !verifyPassword(password, user.password)) {
    return {
      success: false,
      message: "Kata sandi salah. Silakan periksa kembali.",
    };
  }

  const profile: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    school: user.school,
    classGrade: user.classGrade,
    latestIrtScore: user.latestIrtScore || 0,
  };

  setAuthSession(profile);
  return { success: true, message: "Berhasil masuk ke ruang ujian.", user: profile };
}

export function registerUser(userData: {
  name: string;
  email: string;
  school: string;
  classGrade: string;
  password?: string;
}): { success: boolean; message: string; user?: UserProfile } {
  const users = getRegisteredUsers();
  const normalizedEmail = userData.email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return {
      success: false,
      message: "Email sudah terdaftar. Silakan langsung masuk (login).",
    };
  }

  const rawPassword = userData.password || "password123";
  const hashedPassword = hashPassword(rawPassword);

  const newUser: RegisteredUser = {
    id: `user-${Date.now()}`,
    name: userData.name.trim(),
    email: normalizedEmail,
    school: userData.school.trim(),
    classGrade: userData.classGrade.trim(),
    latestIrtScore: 0, // Awal dari 0
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  saveRegisteredUsers(updatedUsers);

  const profile: UserProfile = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    school: newUser.school,
    classGrade: newUser.classGrade,
    latestIrtScore: 0,
  };

  setAuthSession(profile);
  return { success: true, message: "Pendaftaran berhasil! Selamat datang di CBT-PPLG.", user: profile };
}

export function resetAllAccountsAndSession(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.SESSION);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USERS);
    localStorage.removeItem("cendekia_user_profile");
    localStorage.setItem("cendekia_attempts", JSON.stringify([]));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cendekia:auth-changed"));
    }
  } catch (err) {
    console.error("Error resetting all accounts:", err);
  }
}

export function logoutUser(): void {
  clearAuthSession();
}

export function updateUserProfile(updates: {
  name: string;
  email?: string;
  school: string;
  classGrade: string;
  password?: string;
}): { success: boolean; message: string; user?: UserProfile } {
  if (!isClient()) return { success: false, message: "Lingkungan bukan client." };

  const session = getAuthSession();
  if (!session.isLoggedIn || !session.user) {
    return { success: false, message: "Tidak ada sesi aktif. Silakan login terlebih dahulu." };
  }

  const users = getRegisteredUsers();
  const currentId = session.user.id;
  const currentEmail = session.user.email.toLowerCase();

  // Jika email diubah, pastikan tidak bertabrakan dengan akun lain
  const targetEmail = updates.email ? updates.email.trim().toLowerCase() : currentEmail;
  if (
    targetEmail !== currentEmail &&
    users.some((u) => u.id !== currentId && u.email.toLowerCase() === targetEmail)
  ) {
    return {
      success: false,
      message: "Alamat email tersebut sudah digunakan oleh akun siswa lain.",
    };
  }

  let found = false;
  const updatedUsers = users.map((u) => {
    if (u.id === currentId || u.email.toLowerCase() === currentEmail) {
      found = true;
      return {
        ...u,
        name: updates.name.trim(),
        email: targetEmail,
        school: updates.school.trim(),
        classGrade: updates.classGrade.trim(),
        ...(updates.password ? { password: updates.password } : {}),
      };
    }
    return u;
  });

  if (!found) {
    updatedUsers.push({
      id: currentId,
      name: updates.name.trim(),
      email: targetEmail,
      school: updates.school.trim(),
      classGrade: updates.classGrade.trim(),
      latestIrtScore: session.user.latestIrtScore || 0,
      password: updates.password || "password123",
      createdAt: new Date().toISOString(),
    });
  }

  saveRegisteredUsers(updatedUsers);

  const updatedProfile: UserProfile = {
    ...session.user,
    name: updates.name.trim(),
    email: targetEmail,
    school: updates.school.trim(),
    classGrade: updates.classGrade.trim(),
  };

  setAuthSession(updatedProfile);

  return {
    success: true,
    message: "Profil siswa berhasil diperbarui!",
    user: updatedProfile,
  };
}
