---
name: cybersecurity-shield
description: Enterprise Cybersecurity Shield and Defense Protocols for CBT-PPLG adapted from Anthropic Cybersecurity Skills, OWASP, and NIST CSF 2.0.
---

# CBT-PPLG Cybersecurity Shield & Threat Mitigation Playbook

This skill outlines the active cybersecurity defensive controls implemented within the **CBT-PPLG** examination platform, adapted from the Anthropic Cybersecurity Skills playbook, OWASP Top 10 API Security, and NIST CSF 2.0.

## 1. Multi-Tier Defense Architecture Overview

```
[ Incoming Client / Browser / Attacker Scanner ]
             │
             ▼
[ 1. Next.js Edge Security Middleware (src/middleware.ts) ]
  • Drop automated scanner bots (sqlmap, nikto, masscan, wpscan)
  • Drop path traversal probes (/.env, /.git, /wp-login, ../)
  • Inject defense headers (X-Defense-Shield: Active-L7)
             │
             ▼
[ 2. HTTP Security Headers Shield (next.config.mjs) ]
  • Content-Security-Policy (CSP)
  • Strict-Transport-Security (HSTS - 2 years)
  • X-Frame-Options: SAMEORIGIN (Anti-Clickjacking)
  • X-Content-Type-Options: nosniff
  • Permissions-Policy (Camera, Microphone, Geolocation restricted)
             │
             ▼
[ 3. Access Control & Admin Gatekeeper (src/lib/adminAuth.ts) ]
  • Master Passkey authentication required for /admin
  • Anti-brute force lockout (5 failed attempts = 15m lockout)
  • Cryptographic session token (sessionStorage)
             │
             ▼
[ 4. API Rate Limiting Shield (src/lib/security.ts) ]
  • Sliding-Window Token Bucket
  • /api/ai/chat: 20 req/minute
  • /api/ai/generate: 30 req/minute
  • /api/leaderboard: 15 req/minute
             │
             ▼
[ 5. AI Guardrail Shield (Anthropic Prompt Defense) ]
  • Prompt Injection Detection (regex heuristic filter)
  • Block DAN / Jailbreak overrides
  • Block answer-key leakage & system prompt extraction
             │
             ▼
[ 6. Credential & Data Security (src/lib/crypto.ts) ]
  • Salted SHA-256 password hashing (zero plaintext storage)
  • Input sanitization & anti-XSS filter
             │
             ▼
[ 7. Anti-Speedhack & Cryptographic Exam Integrity ]
  • HMAC-SHA256 signature verification on /api/leaderboard
  • Reject forged scores submitted via DevTools / cURL
  • IRT score range validation (200 - 800) & bot detection (<15s)
```

---

## 2. Implemented Defense Controls

### 2.1 Next.js Global Edge Security Middleware
- **File**: `src/middleware.ts`
- **Protection**: Rejects probes targeting environment files (`.env`), git metadata (`.git`), configuration dumps, and path traversal (`../`) at the edge with HTTP 403 before executing application logic. Drops known scanner user agents (`sqlmap`, `nikto`, `wpscan`).

### 2.2 Admin Passkey Gatekeeper & Brute-Force Lockout
- **Files**: `src/lib/adminAuth.ts`, `src/app/admin/page.tsx`
- **Standards**: OWASP A01:2021 (Broken Access Control)
- **Protection**: Blocks unauthorized navigation to `/admin`. Requires Master Passkey authentication with salted hash verification. Automatic 15-minute lockout triggered after 5 consecutive failed attempts.

### 2.3 Cryptographic Score Signature (Anti-Spoofing HMAC)
- **Files**: `src/lib/crypto.ts`, `src/app/api/leaderboard/route.ts`, `src/app/simulation/page.tsx`
- **Standards**: OWASP A08:2021 (Software and Data Integrity Failures)
- **Protection**: Client cannot submit arbitrary scores to `/api/leaderboard`. Each legitimate submission generates a cryptographic signature `SHA256(userId + packageId + totalQuestions + totalCorrect + score + salt)` that the server verifies. Forged requests from cURL or DevTools lacking valid signatures are immediately rejected with HTTP 422.

### 2.4 Salted SHA-256 Password Hashing
- **Files**: `src/lib/crypto.ts`, `src/lib/auth.ts`, `src/app/admin/page.tsx`
- **Standards**: OWASP A02:2021 (Cryptographic Failures)
- **Protection**: Passwords are never stored as plaintext in localStorage or admin state. They are converted to salted SHA-256 hashes immediately upon registration and creation.

### 2.5 HTTP Security Headers
- **File**: `next.config.mjs`
- **Standards**: OWASP A05:2021 (Security Misconfiguration)
- **Protection**: Strict CSP, HSTS with preload, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`.

### 2.6 Rate Limiting Protection
- **File**: `src/lib/security.ts` (`checkRateLimit`)
- **Standards**: OWASP API4:2023 (Unrestricted Resource Consumption)
- **Protection**: Sliding-window token bucket with auto-garbage collection every 5 minutes. Returns HTTP 429 with `Retry-After`.

### 2.7 Prompt Injection Defense for Groq AI Tutor
- **File**: `src/lib/security.ts` (`detectPromptInjection`) & `src/app/api/ai/chat/route.ts`
- **Standards**: OWASP LLM01:2025 (Prompt Injection) & Anthropic Cyber Playbook
- **Protection**: Heuristic analysis blocking system prompt leakage, jailbreaks (DAN, godmode), and exam question disclosure with HTTP 403.
