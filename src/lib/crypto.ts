/**
 * CBT-PPLG Cryptographic Security Helpers
 * Zero-dependency, Universal (Works in Node.js, Next.js Edge, and Browser)
 */

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

export function sha256(ascii: string): string {
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i = 0;
  let j = 0;
  let result = "";

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, number> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  hash = hash.slice(0, 8);

  words[asciiBitLength >> 5] |= 0x80 << (24 - (asciiBitLength % 32));
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (i = 0; i < ascii.length; i++) {
    const charCode = ascii.charCodeAt(i);
    words[i >> 2] |= charCode << ((3 - (i % 4)) * 8);
  }

  const w: number[] = [];
  for (i = 0; i < words.length; i += 16) {
    const oldHash = [...hash];

    for (j = 0; j < 64; j++) {
      if (j < 16) {
        w[j] = words[i + j] || 0;
      } else {
        const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (((w[j - 16] + s0) | 0) + ((w[j - 7] + s1) | 0)) | 0;
      }

      const s1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (((((hash[7] + s1) | 0) + ch) | 0) + ((k[j] + w[j]) | 0)) | 0;
      const s0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0 + maj) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + temp1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (temp1 + temp2) | 0;
    }

    for (j = 0; j < 8; j++) {
      hash[j] = (hash[j] + oldHash[j]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (8 * j)) & 255;
      result += (b < 16 ? "0" : "") + b.toString(16);
    }
  }

  return result;
}

// Secret Salt for CBT-PPLG cryptographic operations
const SYSTEM_SALT = "cbt_pplg_sec_2026_x89a_def";

/**
 * Hash password using Salted SHA-256
 */
export function hashPassword(password: string): string {
  if (!password) return "";
  return sha256(`salt:${SYSTEM_SALT}:pwd:${password}`);
}

/**
 * Verify password against stored hash or fallback plaintext for legacy accounts
 */
export function verifyPassword(inputPassword: string, storedPasswordHash: string): boolean {
  if (!storedPasswordHash) return false;
  // If stored password is still plaintext (legacy account), match directly or upgrade
  if (storedPasswordHash === inputPassword) return true;
  return hashPassword(inputPassword) === storedPasswordHash;
}

/**
 * Create a cryptographic HMAC-like integrity signature for an exam attempt
 * Prevents attackers from forging high scores via cURL / DevTools POST to /api/leaderboard
 */
export function createExamSignature(payload: {
  userId: string;
  packageId: number;
  totalQuestions: number;
  totalCorrect: number;
  score: number;
}): string {
  const rawString = `${payload.userId}#${payload.packageId}#${payload.totalQuestions}#${payload.totalCorrect}#${payload.score}#${SYSTEM_SALT}`;
  return sha256(rawString);
}

/**
 * Verify an exam submission signature
 */
export function verifyExamSignature(
  signature: string | undefined,
  payload: {
    userId: string;
    packageId: number;
    totalQuestions: number;
    totalCorrect: number;
    score: number;
  }
): boolean {
  if (!signature) return false;
  const expectedSignature = createExamSignature(payload);
  return signature === expectedSignature;
}
