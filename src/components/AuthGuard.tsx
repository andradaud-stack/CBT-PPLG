"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Rute yang bebas diakses tanpa login
    const publicPaths = ["/login", "/token-inspector"];
    if (publicPaths.includes(pathname)) {
      setIsChecking(false);
      setIsAuthenticated(true);
      return;
    }

    const session = getAuthSession();
    if (!session.isLoggedIn) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
      setIsChecking(false);
    }
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-space-md">
        <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-elevation-2 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-body-sm text-on-surface-variant font-mono">
            Memeriksa sesi login siswa...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !["/login", "/token-inspector"].includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
