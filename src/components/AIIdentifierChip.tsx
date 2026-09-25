import React from "react";
import { Sparkles } from "lucide-react";

interface AIIdentifierChipProps {
  label?: string;
  className?: string;
}

export function AIIdentifierChip({ label = "Dijelaskan oleh AI", className = "" }: AIIdentifierChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm font-mono bg-tertiary-container text-on-tertiary-container border border-primary/20 shadow-elevation-1 ${className}`}
    >
      <Sparkles className="w-3.5 h-3.5 text-tertiary" />
      <span>{label}</span>
    </span>
  );
}
