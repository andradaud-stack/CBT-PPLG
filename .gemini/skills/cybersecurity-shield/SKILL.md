---
name: cybersecurity-shield
description: Enterprise Cybersecurity Shield and Defense Protocols for CBT-PPLG adapted from Anthropic Cybersecurity Skills, OWASP, and NIST CSF 2.0.
---

# CBT-PPLG Cybersecurity Shield & Threat Mitigation Playbook

This skill outlines the active cybersecurity defensive controls implemented within the **CBT-PPLG** examination platform, adapted from the Anthropic Cybersecurity Skills playbook, OWASP Top 10 API Security, and NIST CSF 2.0.

## 1. Architecture Overview

```
[ Incoming Client / Browser ]
             │
             ▼
[ 1. HTTP Security Headers Shield (next.config.mjs) ]
  • Content-Security-Policy (CSP)
  • Strict-Transport-Security (HSTS - 2 years)
  • X-Frame-Options: SAMEORIGIN (Anti-Clickjacking)
  • X-Content-Type-Options: nosniff
  • Permissions-Policy (Camera, Microphone, Geolocation restricted)
             │
             ▼
[ 2. API Rate Limiting Shield (src/lib/security.ts) ]
  • Sliding-Window Token Bucket
  • /api/ai/chat: 20 req/minute
  • /api/ai/generate: 30 req/minute
  • /api/leaderboard: 15 req/minute
             │
             ▼
[ 3. AI Guardrail Shield (Anthropic Prompt Defense) ]
  • Prompt Injection Detection (regex heuristic filter)
  • Block DAN / Jailbreak overrides
  • Block answer-key leakage & system prompt extraction
             │
             ▼
[ 4. Input Sanitization & Anti-XSS Filter ]
  • Strips script tags, inline event handlers (onload, onerror), javascript: pseudo-protocols
             │
             ▼
[ 5. Anti-Speedhack & Exam Integrity Verification ]
  • IRT score range validation (200 - 800)
  • Time anomaly detection (<15 seconds for 30 questions triggers bot flag and reject)
```

---

## 2. Implemented Defense Controls

### 2.1 HTTP Security Headers
- **File**: `next.config.mjs`
- **Standards**: OWASP A05:2021 (Security Misconfiguration)
- **Protection**:
  - `Content-Security-Policy`: Restricts scripts, styles, objects, and connect sources to trusted endpoints (Groq API, CDNs).
  - `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload` enforces HTTPS everywhere.
  - `X-Frame-Options: SAMEORIGIN`: Prevents clickjacking attacks and framing inside unauthorized iframes.
  - `X-Content-Type-Options: nosniff`: Prevents MIME-confusion attacks.

### 2.2 Rate Limiting Protection
- **File**: `src/lib/security.ts` (`checkRateLimit`)
- **Standards**: OWASP API4:2023 (Unrestricted Resource Consumption)
- **Mechanism**: In-memory token bucket sliding-window tracker with auto-cleanup every 5 minutes. Returns HTTP 429 with standard `Retry-After` headers when limits are exceeded.

### 2.3 Prompt Injection Defense for AI Tutor
- **File**: `src/lib/security.ts` (`detectPromptInjection`) & `src/app/api/ai/chat/route.ts`
- **Standards**: OWASP LLM01:2025 (Prompt Injection) & Anthropic Cyber Playbook
- **Mechanism**: Heuristic analysis detecting system prompt leakage attempts, jailbreaks (DAN, godmode), and exam question disclosure. Automatically denies request with HTTP 403 before LLM tokens are consumed.

### 2.4 Exam Integrity & Anti-Speedhack
- **File**: `src/lib/security.ts` (`validateExamSubmission`) & `src/app/api/leaderboard/route.ts`
- **Standards**: NIST CSF 2.0 PR.DS (Data Security & Integrity)
- **Mechanism**: Submissions claiming 30 questions completed in under 15 seconds are flagged as automated bot/script manipulation and rejected with HTTP 422.

### 2.5 Real-Time Admin Security Operations Center (SOC)
- **File**: `src/app/admin/page.tsx`
- **Features**:
  - Real-time compliance matrix view.
  - Interactive Attack Simulator sandbox for testing malicious prompts against detection rules.
  - Live proctoring logs for window-blur and tab-switching infractions.

---

## 3. Maintenance & Testing Checklist
- [x] Run `npm run build` to confirm zero lint or TypeScript compilation errors.
- [x] Test `curl -I http://localhost:3000` to verify security headers.
- [x] Test `/api/ai/chat` with prompt injection string to confirm HTTP 403 response.
- [x] Test `/api/leaderboard` with duration < 15s to confirm rejection.
