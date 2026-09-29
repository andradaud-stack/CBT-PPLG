"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, ExternalLink, Info, AlertTriangle, Lightbulb, ShieldAlert } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
  className?: string;
}

interface TableData {
  headers: string[];
  alignments: ("left" | "center" | "right")[];
  rows: string[][];
}

export function MarkdownRenderer({ content, isUser = false, className = "" }: MarkdownRendererProps) {
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  const handleCopy = (codeText: string, key: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeKey(key);
    setTimeout(() => {
      setCopiedCodeKey(null);
    }, 2000);
  };

  // Helper to render inline markdown: code, bold-italic, bold, italic, strikethrough, links
  const renderInline = (text: string, keyPrefix = ""): React.ReactNode => {
    if (!text) return null;

    const tokens: React.ReactNode[] = [];
    let remaining = text;
    let idx = 0;

    const regex = /(`[^`]+`|\*\*\*(?!\s)[^*]+(?<!\s)\*\*\*|\*\*(?!\s)[^*]+(?<!\s)\*\*|__(?!\s)[^_]+(?<!\s)__|(?<!\*)\*(?!\s)[^*]+(?<!\s)\*(?!\*)|(?<!_)_(?!\s)[^_]+(?<!\s)_(?!_)|~~(?!\s)[^~]+(?<!\s)~~|\[([^\]]+)\]\(([^)]+)\))/;

    while (remaining.length > 0) {
      const match = remaining.match(regex);
      if (!match || match.index === undefined) {
        tokens.push(remaining);
        break;
      }

      if (match.index > 0) {
        tokens.push(remaining.substring(0, match.index));
      }

      const raw = match[0];
      const matchKey = `${keyPrefix}-tok-${idx++}`;

      if (raw.startsWith("`") && raw.endsWith("`") && raw.length >= 2) {
        tokens.push(
          <code
            key={matchKey}
            className={`px-1.5 py-0.5 rounded font-mono text-[12px] font-semibold ${
              isUser
                ? "bg-white/20 text-white"
                : "bg-surface-container-high text-primary border border-outline-variant/60"
            }`}
          >
            {raw.slice(1, -1)}
          </code>
        );
      } else if (raw.startsWith("***") && raw.endsWith("***") && raw.length >= 6) {
        tokens.push(
          <strong key={matchKey} className={`font-bold italic ${isUser ? "text-white" : "text-on-surface"}`}>
            {raw.slice(3, -3)}
          </strong>
        );
      } else if (
        (raw.startsWith("**") && raw.endsWith("**") && raw.length >= 4) ||
        (raw.startsWith("__") && raw.endsWith("__") && raw.length >= 4)
      ) {
        tokens.push(
          <strong key={matchKey} className={`font-bold ${isUser ? "text-white" : "text-on-surface"}`}>
            {raw.slice(2, -2)}
          </strong>
        );
      } else if (
        (raw.startsWith("*") && raw.endsWith("*") && raw.length >= 2) ||
        (raw.startsWith("_") && raw.endsWith("_") && raw.length >= 2)
      ) {
        tokens.push(
          <em key={matchKey} className={`italic ${isUser ? "text-white/90" : "text-on-surface-variant"}`}>
            {raw.slice(1, -1)}
          </em>
        );
      } else if (raw.startsWith("~~") && raw.endsWith("~~") && raw.length >= 4) {
        tokens.push(
          <del key={matchKey} className="line-through opacity-70">
            {raw.slice(2, -2)}
          </del>
        );
      } else if (raw.startsWith("[") && raw.includes("](") && raw.endsWith(")")) {
        const linkMatch = raw.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          tokens.push(
            <a
              key={matchKey}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-0.5 underline font-medium hover:opacity-80 transition-opacity ${
                isUser ? "text-white decoration-white/70" : "text-primary decoration-primary/50"
              }`}
            >
              <span>{linkMatch[1]}</span>
              <ExternalLink className="w-3 h-3 inline shrink-0" />
            </a>
          );
        } else {
          tokens.push(raw);
        }
      } else {
        tokens.push(raw);
      }

      remaining = remaining.substring(match.index + raw.length);
    }

    return <>{tokens}</>;
  };

  // Helper to parse markdown table
  const parseTable = (lines: string[]): TableData | null => {
    if (lines.length < 2) return null;

    const parseRow = (line: string): string[] => {
      let clean = line.trim();
      if (clean.startsWith("|")) clean = clean.substring(1);
      if (clean.endsWith("|")) clean = clean.substring(0, clean.length - 1);
      return clean.split("|").map((cell) => cell.trim());
    };

    const headerRow = parseRow(lines[0]);
    const separatorLine = lines[1].trim();

    if (!separatorLine.includes("-") || !separatorLine.includes("|")) {
      return null;
    }

    const separatorCells = parseRow(separatorLine);
    if (separatorCells.length === 0 || !separatorCells.every((cell) => /^:?-+:?$/.test(cell))) {
      return null;
    }

    const alignments: ("left" | "center" | "right")[] = separatorCells.map((cell) => {
      const startColon = cell.startsWith(":");
      const endColon = cell.endsWith(":");
      if (startColon && endColon) return "center";
      if (endColon) return "right";
      return "left";
    });

    const rows: string[][] = [];
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      if (line.includes("|")) {
        rows.push(parseRow(line));
      }
    }

    return {
      headers: headerRow,
      alignments,
      rows,
    };
  };

  // Split content into blocks: Code blocks vs Text/Table blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`markdown-body space-y-2 text-left leading-relaxed ${className}`}>
      {parts.map((part, partIdx) => {
        // 1. Code Block (``` ... ```)
        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          let lang = "";
          let codeLines = lines;
          if (lines.length > 0 && /^[a-zA-Z0-9_-]+$/.test(lines[0].trim())) {
            lang = lines[0].trim();
            codeLines = lines.slice(1);
          }
          const codeText = codeLines.join("\n");
          const codeKey = `code-block-${partIdx}`;

          return (
            <div
              key={partIdx}
              className="my-3 rounded-2xl border border-slate-700/80 bg-[#0f172a] shadow-elevation-2 overflow-hidden text-left"
            >
              <div className="px-4 py-2 bg-slate-800/90 border-b border-slate-700/70 flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span className="flex items-center gap-1.5 text-primary font-semibold uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  {lang || "Code"}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(codeText, codeKey)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
                  title="Salin kode"
                >
                  {copiedCodeKey === codeKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 text-[13px] font-mono text-slate-100 overflow-x-auto leading-relaxed">
                <pre>
                  <code>{codeText}</code>
                </pre>
              </div>
            </div>
          );
        }

        // 2. Regular Text: Parse lines, Tables, Headings, Lists, Blockquotes
        const rawLines = part.split("\n");
        const renderedBlocks: React.ReactNode[] = [];
        let i = 0;

        while (i < rawLines.length) {
          const line = rawLines[i];
          const trimmed = line.trim();

          // Empty line
          if (!trimmed) {
            renderedBlocks.push(<div key={`blank-${i}`} className="h-1.5" />);
            i++;
            continue;
          }

          // Check if this line is the start of a Markdown Table
          if (
            trimmed.includes("|") &&
            i + 1 < rawLines.length &&
            rawLines[i + 1].trim().includes("|") &&
            rawLines[i + 1].trim().includes("-") &&
            /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(rawLines[i + 1].trim())
          ) {
            const tableLines: string[] = [line, rawLines[i + 1]];
            let j = i + 2;
            while (j < rawLines.length && rawLines[j].trim().includes("|") && rawLines[j].trim() !== "") {
              tableLines.push(rawLines[j]);
              j++;
            }

            const tableData = parseTable(tableLines);
            if (tableData && tableData.rows.length > 0) {
              const tableKey = `table-${i}`;
              renderedBlocks.push(
                <div
                  key={tableKey}
                  className="my-3 overflow-x-auto rounded-2xl border border-outline-variant/80 bg-surface-container-lowest shadow-elevation-1"
                >
                  <table className="w-full text-left border-collapse text-body-xs min-w-[320px]">
                    <thead className="bg-surface-container border-b border-outline-variant text-on-surface">
                      <tr>
                        {tableData.headers.map((th, hIdx) => {
                          const align = tableData.alignments[hIdx] || "left";
                          const alignClass =
                            align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
                          return (
                            <th
                              key={hIdx}
                              className={`px-4 py-2.5 text-xs font-bold text-primary tracking-wide uppercase ${alignClass}`}
                            >
                              {renderInline(th, `th-${i}-${hIdx}`)}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40">
                      {tableData.rows.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className="hover:bg-primary/5 transition-colors odd:bg-transparent even:bg-surface-container-low/40"
                        >
                          {tableData.headers.map((_, cIdx) => {
                            const cellValue = row[cIdx] || "";
                            const align = tableData.alignments[cIdx] || "left";
                            const alignClass =
                              align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
                            return (
                              <td
                                key={cIdx}
                                className={`px-4 py-2 text-on-surface font-mono text-[12.5px] leading-relaxed ${alignClass}`}
                              >
                                {renderInline(cellValue, `td-${i}-${rIdx}-${cIdx}`)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
              i = j;
              continue;
            }
          }

          // Horizontal Divider (---, ***, ___)
          if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
            renderedBlocks.push(
              <div key={`hr-${i}`} className="my-3 border-t border-outline-variant/60" />
            );
            i++;
            continue;
          }

          // Headings: #, ##, ###, ####, #####, ######
          const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
          if (headingMatch) {
            const level = headingMatch[1].length;
            const headingText = headingMatch[2].trim();
            const hKey = `heading-${i}`;

            if (level === 1) {
              renderedBlocks.push(
                <h2
                  key={hKey}
                  className="font-bold text-title-lg text-on-surface border-b border-outline-variant/60 pb-1.5 mt-4 mb-2"
                >
                  {renderInline(headingText, hKey)}
                </h2>
              );
            } else if (level === 2) {
              renderedBlocks.push(
                <h3
                  key={hKey}
                  className="font-bold text-title-md text-on-surface border-b border-outline-variant/60 pb-1 mt-3.5 mb-1.5"
                >
                  {renderInline(headingText, hKey)}
                </h3>
              );
            } else if (level === 3) {
              renderedBlocks.push(
                <h4
                  key={hKey}
                  className="font-bold text-title-sm text-primary mt-3 mb-1.5 flex items-center gap-2"
                >
                  <span className="w-1.5 h-3.5 bg-primary rounded-full inline-block shrink-0" />
                  <span>{renderInline(headingText, hKey)}</span>
                </h4>
              );
            } else if (level === 4) {
              renderedBlocks.push(
                <h5
                  key={hKey}
                  className="font-bold text-[13.5px] text-primary mt-2.5 mb-1 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span>{renderInline(headingText, hKey)}</span>
                </h5>
              );
            } else {
              renderedBlocks.push(
                <h6
                  key={hKey}
                  className="font-bold text-xs uppercase tracking-wider text-on-surface-variant mt-2 mb-1"
                >
                  {renderInline(headingText, hKey)}
                </h6>
              );
            }
            i++;
            continue;
          }

          // Blockquote (> ...) or Callout (> [!NOTE], > [!TIP], etc.)
          if (trimmed.startsWith(">")) {
            const quoteContent = trimmed.replace(/^>\s*/, "");
            const calloutMatch = quoteContent.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i);

            if (calloutMatch) {
              const type = calloutMatch[1].toUpperCase();
              const text = calloutMatch[2];
              let icon = <Info className="w-4 h-4 text-blue-500 shrink-0" />;
              let borderClass = "border-blue-500/40 bg-blue-500/10 text-blue-900 dark:text-blue-100";

              if (type === "TIP") {
                icon = <Lightbulb className="w-4 h-4 text-emerald-500 shrink-0" />;
                borderClass = "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100";
              } else if (type === "WARNING" || type === "CAUTION") {
                icon = <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
                borderClass = "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100";
              } else if (type === "IMPORTANT") {
                icon = <ShieldAlert className="w-4 h-4 text-purple-500 shrink-0" />;
                borderClass = "border-purple-500/40 bg-purple-500/10 text-purple-900 dark:text-purple-100";
              }

              renderedBlocks.push(
                <div
                  key={`callout-${i}`}
                  className={`p-3 rounded-xl border my-2 flex items-start gap-2 text-body-xs leading-relaxed ${borderClass}`}
                >
                  {icon}
                  <div className="flex-1 font-medium">{renderInline(text, `callout-${i}`)}</div>
                </div>
              );
            } else {
              renderedBlocks.push(
                <blockquote
                  key={`quote-${i}`}
                  className="pl-3.5 border-l-2 border-primary/70 text-on-surface-variant italic my-1.5 text-body-xs bg-surface-container-low/40 py-1.5 rounded-r-xl"
                >
                  {renderInline(quoteContent, `quote-${i}`)}
                </blockquote>
              );
            }
            i++;
            continue;
          }

          // Unordered List (- item, * item, + item, • item)
          const bulletMatch = trimmed.match(/^([-*+•])\s+(.*)$/);
          if (bulletMatch) {
            const listText = bulletMatch[2];
            renderedBlocks.push(
              <div key={`bullet-${i}`} className="flex items-start gap-2 pl-2 my-0.5">
                <span className="text-primary mt-1 font-bold leading-none shrink-0">&bull;</span>
                <span className={`flex-1 ${isUser ? "text-white" : "text-on-surface"}`}>
                  {renderInline(listText, `b-${i}`)}
                </span>
              </div>
            );
            i++;
            continue;
          }

          // Ordered List (1. item, 2. item)
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
          if (numMatch) {
            renderedBlocks.push(
              <div key={`num-${i}`} className="flex items-start gap-2 pl-2 my-0.5">
                <span className="font-mono text-primary font-bold text-[12px] min-w-[20px] text-right shrink-0">
                  {numMatch[1]}.
                </span>
                <span className={`flex-1 ${isUser ? "text-white" : "text-on-surface"}`}>
                  {renderInline(numMatch[2], `num-${i}`)}
                </span>
              </div>
            );
            i++;
            continue;
          }

          // Clean broken ASCII branch markers if any (├──, └──, │)
          if (/^[├└│\|\-\+]{2,}/.test(trimmed)) {
            const cleaned = trimmed.replace(/^[├└│\|\-\+\s]+/, "").trim();
            if (cleaned) {
              renderedBlocks.push(
                <div key={`tree-${i}`} className="flex items-start gap-2 pl-3 my-0.5 text-body-xs font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0 mt-1.5" />
                  <span className="text-on-surface">{renderInline(cleaned, `tree-${i}`)}</span>
                </div>
              );
            }
            i++;
            continue;
          }

          // Strip lone outer pipes e.g. "| text |"
          let displayLine = line;
          if (trimmed.startsWith("|") && trimmed.endsWith("|") && !trimmed.slice(1, -1).includes("|")) {
            displayLine = trimmed.slice(1, -1).trim();
          }

          // Standard paragraph
          renderedBlocks.push(
            <p
              key={`p-${i}`}
              className={`leading-relaxed ${isUser ? "text-white font-medium" : "text-on-surface"}`}
            >
              {renderInline(displayLine, `line-${i}`)}
            </p>
          );
          i++;
        }

        return <React.Fragment key={partIdx}>{renderedBlocks}</React.Fragment>;
      })}
    </div>
  );
}
