import React from "react";
import { Check, AlertTriangle, XCircle } from "lucide-react";
import { Difficulty } from "@/types";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  showIcon?: boolean;
  className?: string;
}

export function DifficultyBadge({ difficulty, showIcon = true, className = "" }: DifficultyBadgeProps) {
  switch (difficulty) {
    case "mudah":
      return (
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-label-sm font-mono bg-success-container text-on-success-container border border-success/30 ${className}`}
        >
          {showIcon && <Check className="w-3 h-3 text-success" />}
          <span>Mudah</span>
        </span>
      );
    case "sedang":
      return (
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-label-sm font-mono bg-warning-container text-on-warning-container border border-warning/30 ${className}`}
        >
          {showIcon && <AlertTriangle className="w-3 h-3 text-warning" />}
          <span>Sedang</span>
        </span>
      );
    case "sulit":
      return (
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-label-sm font-mono bg-error-container text-on-error-container border border-error/30 ${className}`}
        >
          {showIcon && <XCircle className="w-3 h-3 text-error" />}
          <span>Sulit</span>
        </span>
      );
  }
}
