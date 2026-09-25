import React from "react";
import { StudentAnswer } from "@/types";

interface NavigatorGridProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, StudentAnswer>;
  questionIds: string[];
  onSelectIndex: (index: number) => void;
  isReviewMode?: boolean;
  questionResults?: { isCorrect: boolean }[];
}

export function NavigatorGrid({
  totalQuestions,
  currentIndex,
  answers,
  questionIds,
  onSelectIndex,
  isReviewMode = false,
  questionResults,
}: NavigatorGridProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-md shadow-elevation-1">
      <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant mb-space-sm">
        <h3 className="font-semibold text-title-md text-on-surface">Nomor Soal</h3>
        <span className="text-label-sm font-mono text-on-surface-variant">
          {Object.values(answers).filter((a) => a.isAnswered).length} / {totalQuestions} Terjawab
        </span>
      </div>

      {/* Grid: 5 columns on desktop, 4-6px gap */}
      <div className="grid grid-cols-5 gap-2 max-h-[360px] overflow-y-auto p-1">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const qId = questionIds[index];
          const studentAns = answers[qId];
          const isCurrent = index === currentIndex;
          const isAnswered = studentAns?.isAnswered;
          const isFlagged = studentAns?.isFlagged;
          const result = questionResults ? questionResults[index] : null;

          let tileStyle = "bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:border-primary/40";

          if (isReviewMode && result) {
            if (result.isCorrect) {
              tileStyle = "bg-success text-on-success font-bold";
            } else {
              tileStyle = "bg-error text-on-error font-bold";
            }
          } else if (isFlagged) {
            tileStyle = "bg-amber-500 text-white font-bold border border-amber-600 shadow-elevation-1 ring-1 ring-amber-400";
          } else if (isAnswered) {
            tileStyle = "bg-primary text-on-primary font-bold shadow-elevation-1";
          }

          const activeRing = isCurrent ? "border-2 border-tertiary ring-2 ring-tertiary/30 scale-105" : "";

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelectIndex(index)}
              className={`w-10 h-10 rounded-md font-mono text-label-md flex items-center justify-center relative transition-all cursor-pointer ${tileStyle} ${activeRing}`}
              aria-label={`Soal nomor ${index + 1}`}
            >
              {index + 1}

              {/* Flag indicator badge in top-right */}
              {isFlagged && !isReviewMode && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-on-warning ring-1 ring-warning" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-space-md pt-space-sm border-t border-outline-variant grid grid-cols-2 gap-y-1.5 text-body-sm text-on-surface-variant font-mono text-[11px]">
        {!isReviewMode ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-primary" />
              <span>Terjawab</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-500 border border-amber-600" />
              <span>Ragu-ragu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-surface-container-lowest border border-outline-variant" />
              <span>Belum</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm border-2 border-tertiary" />
              <span>Aktif</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-success" />
              <span>Benar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-error" />
              <span>Salah</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
