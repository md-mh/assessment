"use client";

import Link from "next/link";
import { Clock, FileText, Users, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnlineTestItem } from "@/features/dashboard/types";
import { useAppSelector } from "@/store/hooks";

type OnlineTestCardProps = {
  exam: OnlineTestItem;
};

export function OnlineTestCard({ exam }: OnlineTestCardProps) {
  const labelClass = "text-slate-500";
  const role = useAppSelector((s) => s.auth.user?.role);
  const isCandidate = role === "candidate";

  return (
    <article className="flex flex-col rounded-[16px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-[15px] font-semibold leading-snug text-ink-900 sm:text-base">
        {exam.title}
      </h2>

      {isCandidate ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-3 sm:gap-2 md:gap-4">
          <div className="flex min-w-0 items-start gap-2">
            <Clock
              className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
              strokeWidth={1.75}
              aria-hidden
            />
            <p className="text-xs leading-snug text-ink-800 sm:text-sm">
              <span className={labelClass}>Duration: </span>
              <span className="font-medium">{exam.duration}</span>
            </p>
          </div>
          <div className="flex min-w-0 items-start gap-2">
            <FileText
              className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
              strokeWidth={1.75}
              aria-hidden
            />
            <p className="text-xs leading-snug text-ink-800 sm:text-sm">
              <span className={labelClass}>Question: </span>
              <span className="font-medium">{exam.questionCount}</span>
            </p>
          </div>
          <div className="flex min-w-0 items-start gap-2">
            <XCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
              strokeWidth={1.75}
              aria-hidden
            />
            <p className="text-xs leading-snug text-ink-800 sm:text-sm">
              <span className={labelClass}>Negative Marking: </span>
              <span className="font-medium">{exam.negativeMarking}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-3 sm:gap-2 md:gap-4">
          <div className="flex min-w-0 items-start gap-2">
            <Users
              className="mt-0.5 h-4 w-4 shrink-0 text-[#6633FF]"
              strokeWidth={1.75}
              aria-hidden
            />
            <p className="text-xs leading-snug text-ink-800 sm:text-sm">
              <span className={labelClass}>Candidates: </span>
              <span className="font-medium">{exam.candidates}</span>
            </p>
          </div>
          <div className="flex min-w-0 items-start gap-2">
            <FileText
              className="mt-0.5 h-4 w-4 shrink-0 text-[#6633FF]"
              strokeWidth={1.75}
              aria-hidden
            />
            <p className="text-xs leading-snug text-ink-800 sm:text-sm">
              <span className={labelClass}>Question Set: </span>
              <span className="font-medium">{exam.questionSets}</span>
            </p>
          </div>
          <div className="flex min-w-0 items-start gap-2">
            <Clock
              className="mt-0.5 h-4 w-4 shrink-0 text-[#6633FF]"
              strokeWidth={1.75}
              aria-hidden
            />
            <p className="text-xs leading-snug text-ink-800 sm:text-sm">
              <span className={labelClass}>Exam Slots: </span>
              <span className="font-medium">{exam.examSlots}</span>
            </p>
          </div>
        </div>
      )}

      <div
        className={cn(
          "mt-5 flex flex-1 gap-2 sm:mt-6",
          isCandidate ? "justify-start" : "",
        )}
      >
        {!isCandidate ? (
          <button
            type="button"
            className="w-full rounded-[12px] border border-[#6633FF] px-4 py-2.5 text-sm font-semibold text-[#6633FF] transition hover:bg-[#6633FF]/[0.06] sm:w-auto sm:self-start"
          >
            View Candidates
          </button>
        ) : (
          <Link
            href={`/dashboard/exam/${encodeURIComponent(exam.id)}/take`}
            className={cn(
              "inline-flex items-center justify-center rounded-[12px] border border-[#6633FF] px-4 py-2.5 text-sm font-semibold text-[#6633FF] transition hover:bg-[#6633FF]/[0.06] sm:self-start",
              "w-full sm:w-auto",
            )}
          >
            Start
          </Link>
        )}
      </div>
    </article>
  );
}
