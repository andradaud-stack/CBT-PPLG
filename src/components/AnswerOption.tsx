import React from "react";
import { Check, X } from "lucide-react";
import { QuestionType } from "@/types";

interface AnswerOptionProps {
  optionKey: "A" | "B" | "C" | "D" | "E";
  text: string;
  type: QuestionType;
  isSelected: boolean;
  isDisabled?: boolean;
  isReviewMode?: boolean;
  isCorrectOption?: boolean;
  onSelect: (key: string) => void;
}

export function AnswerOption({
  optionKey,
  text,
  type,
  isSelected,
  isDisabled = false,
  isReviewMode = false,
  isCorrectOption = false,
  onSelect,
}: AnswerOptionProps) {
  // Tentukan state styling berdasarkan mode review atau aktif
  let containerStyles = "bg-surface-container-lowest border border-outline-variant text-on-surface shadow-elevation-1 hover:border-primary/40";
  let pillStyles = "bg-surface-container text-on-surface-variant";
  let checkIcon = null;

  if (isReviewMode) {
    if (isCorrectOption) {
      containerStyles = "bg-success-container border-[1.5px] border-success text-on-success-container shadow-elevation-1";
      pillStyles = "bg-success text-on-success font-bold";
      checkIcon = <Check className="w-4 h-4 text-success ml-auto" />;
    } else if (isSelected && !isCorrectOption) {
      containerStyles = "bg-error-container border-[1.5px] border-error text-on-error-container shadow-elevation-1";
      pillStyles = "bg-error text-on-error font-bold";
      checkIcon = <X className="w-4 h-4 text-error ml-auto" />;
    } else {
      containerStyles = "bg-surface-container-lowest opacity-60 border border-outline-variant text-on-surface-variant";
      pillStyles = "bg-surface-container text-on-surface-variant";
    }
  } else if (isSelected) {
    containerStyles = "bg-tertiary-container border-[1.5px] border-primary text-on-surface shadow-elevation-2";
    pillStyles = "bg-primary text-on-primary font-bold";
  }

  return (
    <button
      type="button"
      onClick={() => !isDisabled && onSelect(optionKey)}
      disabled={isDisabled}
      className={`w-full text-left p-space-md rounded-lg flex items-center gap-space-sm transition-all cursor-pointer ${
        isDisabled ? "cursor-default" : ""
      } ${containerStyles}`}
    >
      {/* Indicator Pill: Circle for single, square with rounded-sm for multiple */}
      <span
        className={`w-8 h-8 ${
          type === "multiple" ? "rounded-md" : "rounded-full"
        } flex items-center justify-center font-mono text-label-md shrink-0 transition-colors ${pillStyles}`}
      >
        {optionKey}
      </span>

      {/* Option Text */}
      <span className="text-body-md font-medium flex-1 leading-relaxed">
        {text}
      </span>

      {checkIcon}
    </button>
  );
}
