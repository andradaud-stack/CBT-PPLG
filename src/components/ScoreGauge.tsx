import React from "react";

interface ScoreGaugeProps {
  score: number; // 200 - 800
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ScoreGauge({
  score,
  size = 200,
  strokeWidth = 12,
  label = "Skor IRT TKA",
}: ScoreGaugeProps) {
  // Rentang skor IRT: 200 (0%) hingga 800 (100%)
  const minScore = 200;
  const maxScore = 800;
  const percentage = Math.max(0, Math.min(100, ((score - minScore) / (maxScore - minScore)) * 100));

  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Warna transisi dinamis: jika skor >= 650 bernuansa success
  const strokeColorClass = score >= 650 ? "stroke-success" : score >= 500 ? "stroke-primary" : "stroke-warning";

  return (
    <div className="flex flex-col items-center justify-center p-space-md">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Outer Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            className="stroke-outline-variant"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Inner Active Stroke */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            className={`${strokeColorClass} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Centered Readout in JetBrains Mono */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono font-bold text-display-lg text-on-surface tracking-tight">
            {score}
          </span>
          <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
            Skala 200–800
          </span>
        </div>
      </div>

      <span className="mt-space-sm font-semibold text-title-md text-on-surface">
        {label}
      </span>
      <span className="text-body-sm text-on-surface-variant">
        {score >= 650
          ? "Sangat Baik (Di atas ambang kelulusan TKA)"
          : score >= 500
          ? "Kompeten (Memenuhi rata-rata nasional)"
          : "Perlu Latihan Tambahan"}
      </span>
    </div>
  );
}
