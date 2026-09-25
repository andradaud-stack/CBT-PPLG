"use client";

import React, { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface ExamTimerProps {
  initialSeconds: number;
  onExpire: () => void;
  isPaused?: boolean;
}

export function ExamTimer({ initialSeconds, onExpire, isPaused = false }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isPaused, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isUrgent = secondsLeft <= 300; // < 5 menit

  return (
    <div
      className={`inline-flex items-center gap-2 px-space-md py-1.5 rounded-lg border font-mono transition-colors shadow-elevation-1 ${
        isUrgent
          ? "bg-error-container text-on-error-container border-error animate-pulse"
          : "bg-surface-container-lowest text-on-surface border-outline-variant"
      }`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-4 h-4 text-error" />
      ) : (
        <Clock className="w-4 h-4 text-primary" />
      )}
      <div className="flex flex-col text-left">
        <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">
          Sisa Waktu
        </span>
        <span className={`text-title-md font-bold tracking-wider ${isUrgent ? "text-error" : "text-primary"}`}>
          {formatted}
        </span>
      </div>
    </div>
  );
}
