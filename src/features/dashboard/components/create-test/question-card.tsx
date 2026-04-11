"use client";

import type { MouseEvent } from "react";
import { Check } from "lucide-react";
import type { ExamQuestion } from "@/features/dashboard/types/exam-question";
import { examQuestionTypeLabel } from "@/features/dashboard/types/exam-question";
import { cn } from "@/lib/utils";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type QuestionCardProps = {
  question: ExamQuestion;
  displayIndex: number;
  onCardClick: () => void;
  onEdit: (e: MouseEvent) => void;
  onRemove: (e: MouseEvent) => void;
};

function formatPoints(score: string): string {
  const n = Number.parseFloat(score);
  if (Number.isNaN(n)) return `${score} pt`;
  return n === 1 ? "1 pt" : `${n} pt`;
}

/** Strip simple markdown markers for card preview */
function plainPreview(raw: string): string {
  return raw.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").trim();
}

export function QuestionCard({
  question,
  displayIndex,
  onCardClick,
  onEdit,
  onRemove,
}: QuestionCardProps) {
  const typeLabel = examQuestionTypeLabel(question.questionType);
  const title = `Question ${displayIndex}`;
  const qText = plainPreview(question.questionBody) || "—";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick();
        }
      }}
      className={cn(
        "rounded-[12px] border border-slate-200/90 bg-white p-5 shadow-sm transition",
        "cursor-pointer outline-none hover:border-slate-300 hover:shadow-md",
        "focus-visible:ring-2 focus-visible:ring-[#6633FF]/35",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-ink-900">{title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-ink-800">
            {typeLabel}
          </span>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-[#6633FF]">
            {formatPoints(question.score)}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold leading-snug text-ink-900">
        {qText}
      </p>

      {question.questionType === "text" ? (
        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-slate-600">
          {plainPreview(question.options[0]?.body ?? "") || "—"}
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {question.options.map((opt, idx) => (
            <li
              key={opt.id}
              className={cn(
                "flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-sm",
                opt.correct ? "bg-slate-100" : "bg-transparent",
              )}
            >
              <span className="min-w-0 flex-1 text-ink-900">
                <span className="font-medium text-slate-600">
                  {LETTERS[idx] ?? idx}.
                </span>{" "}
                {plainPreview(opt.body) || "—"}
              </span>
              {opt.correct && (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <Check
                    className="h-4 w-4 text-emerald-600"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-medium text-[#6633FF] transition hover:underline"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-sm font-medium text-rose-600 transition hover:underline"
        >
          Remove From Exam
        </button>
      </div>
    </article>
  );
}
