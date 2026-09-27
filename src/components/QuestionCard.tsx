import React from "react";
import { Question } from "@/types";
import { DifficultyBadge } from "./DifficultyBadge";
import { AnswerOption } from "./AnswerOption";
import { HelpCircle, Bookmark, Flag, Terminal, CheckCircle2 } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  questionNumber?: number;
  totalQuestions?: number;
  selectedAnswers: string[];
  isReviewMode?: boolean;
  onSelectOption: (optionKey: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  isFlagged?: boolean;
  onToggleFlag?: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswers,
  isReviewMode = false,
  onSelectOption,
  isBookmarked = false,
  onToggleBookmark,
  isFlagged = false,
  onToggleFlag,
}: QuestionCardProps) {
  // Parse code blocks in question stem with syntax-highlighted IDE container
  const renderStem = (stem: string) => {
    const parts = stem.split(/(```[\s\S]*?```)/g);

    return parts.map((part, idx) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const lang = hasLang ? firstLine : "code";
        const codeLines = hasLang ? lines.slice(1) : lines;

        return (
          <div
            key={idx}
            className="my-4 rounded-xl border border-slate-700/80 bg-[#0f172a] shadow-elevation-2 overflow-hidden text-left"
          >
            <div className="px-4 py-2 bg-slate-800/90 border-b border-slate-700/70 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-primary font-semibold uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                {lang}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Cuplikan Kode / Source Code</span>
            </div>
            <div className="p-3 sm:p-4 text-[13px] font-mono text-slate-100 overflow-x-auto leading-relaxed bg-[#0a0f1d]">
              <div className="table w-full border-collapse">
                {codeLines.map((line, lIdx) => (
                  <div key={lIdx} className="table-row hover:bg-slate-800/40">
                    <span className="table-cell select-none pr-4 text-right text-slate-500 text-[11px] font-mono w-8 border-r border-slate-700/50">
                      {lIdx + 1}
                    </span>
                    <span className="table-cell pl-4 whitespace-pre font-mono text-slate-100">
                      {line || "\u00A0"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      return (
        <p key={idx} className="text-body-lg text-on-surface leading-relaxed whitespace-pre-line mb-space-sm">
          {part}
        </p>
      );
    });
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-space-lg shadow-elevation-1">
      {/* Question Header Meta */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-md border-b border-outline-variant mb-space-md">
        <div className="flex items-center gap-space-xs">
          {questionNumber !== undefined && (
            <span className="font-mono font-bold text-headline-sm text-primary">
              Soal {questionNumber}
              {totalQuestions ? ` / ${totalQuestions}` : ""}
            </span>
          )}
          <span className="text-body-sm text-on-surface-variant font-medium px-2 py-0.5 rounded bg-surface-container">
            {question.topic}
          </span>
        </div>

        <div className="flex items-center gap-space-xs">
          <DifficultyBadge difficulty={question.difficulty} />
          {question.type === "multiple" && (
            <span className="px-2.5 py-1 rounded-full text-label-sm font-mono bg-tertiary-container text-on-tertiary-container border border-primary/20 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-tertiary" />
              PG Kompleks (Pilih &gt;1)
            </span>
          )}

          {question.type === "boolean" && (
            <span className="px-2.5 py-1 rounded-full text-label-sm font-mono bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              Benar / Salah
            </span>
          )}

          {question.type === "single" && (
            <span className="px-2.5 py-1 rounded-full text-label-sm font-mono bg-surface-container text-on-surface-variant border border-outline-variant flex items-center gap-1 font-medium">
              Pilihan Ganda
            </span>
          )}

          {isFlagged && !isReviewMode && (
            <span className="px-2.5 py-1 rounded-full text-label-sm font-mono font-bold bg-amber-500 text-white flex items-center gap-1 shadow-elevation-1 animate-pulse">
              <Flag className="w-3.5 h-3.5 fill-current" />
              <span>Ragu-ragu</span>
            </span>
          )}

          {onToggleBookmark && (
            <button
              type="button"
              onClick={onToggleBookmark}
              title={isBookmarked ? "Hapus dari soal tersimpan" : "Tandai / simpan soal ini untuk dipelajari lagi"}
              className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-label-sm font-mono ${
                isBookmarked
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold"
                  : "bg-surface-container-low border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary/40"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{isBookmarked ? "Tersimpan" : "Tandai"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Stem / Pertanyaan */}
      <div className="mb-space-lg">
        {renderStem(question.stem)}
      </div>

      {/* Pilihan Jawaban */}
      <div className="space-y-space-sm">
        {question.options.map((opt) => {
          const isSelected = selectedAnswers.includes(opt.key);
          const isCorrectOption = question.correctAnswer.includes(opt.key);

          return (
            <AnswerOption
              key={opt.key}
              optionKey={opt.key}
              text={opt.text}
              type={question.type}
              isSelected={isSelected}
              isDisabled={isReviewMode}
              isReviewMode={isReviewMode}
              isCorrectOption={isCorrectOption}
              onSelect={onSelectOption}
            />
          );
        })}
      </div>

      {/* ANBK-Style Ragu-ragu Checkbox Bar */}
      {onToggleFlag && !isReviewMode && (
        <div className="pt-space-md mt-space-md border-t border-outline-variant/60 flex items-center justify-between flex-wrap gap-2">
          <label className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all font-bold text-body-sm select-none shadow-elevation-1 ${
            isFlagged
              ? "bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300 dark:ring-amber-800"
              : "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 hover:bg-amber-500/20"
          }`}>
            <input
              type="checkbox"
              checked={isFlagged}
              onChange={onToggleFlag}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <Flag className={`w-4 h-4 ${isFlagged ? "fill-current" : ""}`} />
              <span>{isFlagged ? "Soal Ini Ditandai Ragu-Ragu ✓" : "Tandai Ragu-Ragu"}</span>
            </span>
          </label>

          <span className="text-[11px] font-mono text-on-surface-variant hidden sm:inline">
            Tekan <kbd className="px-1.5 py-0.5 rounded bg-surface-container border text-primary font-bold">R</kbd> di keyboard untuk toggle ragu-ragu
          </span>
        </div>
      )}
    </div>
  );
}
