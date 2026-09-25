import type { NextRequest } from "next/server";

// =========================================================================
// 1. RATE LIMITER (In-Memory Sliding Window / Token Bucket)
// =========================================================================
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Bersihkan data lama setiap 5 menit agar memori tetap bersih
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

export function checkRateLimit(
  req: NextRequest,
  options: { keyPrefix: string; limit: number; windowMs: number }
): { allowed: boolean; remaining: number; resetInSec: number; clientIp: string } {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  const key = `${options.keyPrefix}:${ip}`;
  const now = Date.now();

  let record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    record = {
      count: 1,
      resetAt: now + options.windowMs,
    };
    rateLimitStore.set(key, record);
    return {
      allowed: true,
      remaining: options.limit - 1,
      resetInSec: Math.ceil(options.windowMs / 1000),
      clientIp: ip,
    };
  }

  record.count += 1;
  const remaining = Math.max(0, options.limit - record.count);
  const resetInSec = Math.max(1, Math.ceil((record.resetAt - now) / 1000));

  if (record.count > options.limit) {
    return { allowed: false, remaining: 0, resetInSec, clientIp: ip };
  }

  return { allowed: true, remaining, resetInSec, clientIp: ip };
}

// =========================================================================
// 2. INPUT SANITIZATION & XSS DEFENSE
// =========================================================================
export function sanitizeInput(input: string): string {
  if (!input) return "";

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:text\/html/gi, "")
    .trim();
}

// =========================================================================
// 3. PROMPT INJECTION & JAILBREAK DEFENSE (Anthropic Cyber Standards)
// =========================================================================
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /you\s+are\s+now\s+(unrestricted|DAN|jailbroken|godmode|developer mode)/i,
  /override\s+(system|safety|moderation|exam)\s+(prompt|settings|rules)/i,
  /reveal\s+(the\s+)?(system\s+prompt|hidden\s+instructions|api\s+key)/i,
  /print\s+everything\s+above/i,
  /forget\s+you\s+are\s+an\s+ai\s+tutor/i,
  /bocorkan\s+(kunci\s+jawaban|soal\s+rahasia|system\s+prompt)/i,
  /abaikan\s+(semua\s+)?(aturan|perintah\s+sebelumnya)/i,
];

export function detectPromptInjection(userText: string): { isSuspicious: boolean; patternDetected?: string } {
  if (!userText) return { isSuspicious: false };

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(userText)) {
      return {
        isSuspicious: true,
        patternDetected: pattern.source,
      };
    }
  }

  return { isSuspicious: false };
}

// =========================================================================
// 4. EXAM INTEGRITY & ANTI-SPEEDHACK VALIDATOR
// =========================================================================
export interface IntegrityValidationResult {
  valid: boolean;
  isFlagged: boolean;
  reasons: string[];
}

export function validateExamSubmission(submission: {
  totalQuestions: number;
  totalCorrect: number;
  durationSeconds: number;
  score: number;
}): IntegrityValidationResult {
  const reasons: string[] = [];
  let isFlagged = false;

  // Skor harus berada dalam rentang resmi 200 - 800
  if (submission.score < 200 || submission.score > 800) {
    return { valid: false, isFlagged: true, reasons: ["Skor di luar batas valid IRT (200 - 800)."] };
  }

  // Jumlah soal harus valid
  if (submission.totalQuestions <= 0 || submission.totalCorrect > submission.totalQuestions) {
    return { valid: false, isFlagged: true, reasons: ["Perhitungan butir soal tidak konsisten."] };
  }

  // Anti-Speedhack: Mengerjakan 30 soal dalam durasi di bawah 15 detik adalah tidak manusiawi
  if (submission.totalQuestions >= 20 && submission.durationSeconds < 15) {
    isFlagged = true;
    reasons.push("Durasi pengerjaan terlalu cepat secara ekstrem (< 15 detik untuk 30 soal). Terindikasi script/bot otomatis.");
  }

  return {
    valid: true,
    isFlagged,
    reasons,
  };
}
