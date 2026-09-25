import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Daftar pola berbahaya yang sering digunakan bot/scanner hacker
const BLOCKED_PATH_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/\.aws/i,
  /\/\.ssh/i,
  /\/\.svn/i,
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/xmlrpc\.php/i,
  /\/phpmyadmin/i,
  /\/pma/i,
  /\/config\.(json|yaml|yml|bak|old)/i,
  /\/package\.json/i,
  /\/tsconfig\.json/i,
  /\/etc\/passwd/i,
  /\.\.\//, // Path traversal
  /\.\.%2f/i, // Encoded path traversal
];

// User-agent scanner peretas yang dikenal
const BLOCKED_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /acunetix/i,
  /masscan/i,
  /wpscan/i,
  /zgrab/i,
  /nmap/i,
  /dirbuster/i,
  /gobuster/i,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";

  // 1. Blokir User-Agent scanner otomatis
  for (const badAgent of BLOCKED_USER_AGENTS) {
    if (badAgent.test(userAgent)) {
      return new NextResponse(
        JSON.stringify({
          error: "Akses Ditolak: Pemindai keamanan otomatis tidak diizinkan oleh sistem CBT-PPLG.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", "X-Defense-Shield": "Active-Drop" },
        }
      );
    }
  }

  // 2. Blokir upaya Path Traversal & file probe (.env, .git, backdoor)
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse(
        JSON.stringify({
          error: "Akses Terlarang (HTTP 403): Permintaan ke berkas sistem ini diblokir oleh Cyber Defense Shield.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", "X-Defense-Shield": "Active-Drop" },
        }
      );
    }
  }

  // 3. Teruskan request dengan menyuntikkan security headers pada response
  const response = NextResponse.next();
  response.headers.set("X-Defense-Shield", "Active-L7");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    /*
     * Terapkan ke semua rute kecuali file statis Next.js & favicon
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
