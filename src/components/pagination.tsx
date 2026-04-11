"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  perPage: number;
  onPerPageChange: (value: number) => void;
  perPageOptions?: number[];
  perPageLabel?: string;
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  perPage,
  onPerPageChange,
  perPageOptions = [8, 16, 24, 32],
  perPageLabel = "Online Test Per Page",
  className,
}: PaginationProps) {
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-center justify-center gap-2 sm:justify-start">
        <button
          type="button"
          aria-label="Previous page"
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span
          className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border border-slate-200 bg-slate-100 px-2 text-sm font-medium text-slate-800"
          aria-current="page"
        >
          {currentPage}
        </span>
        <button
          type="button"
          aria-label="Next page"
          disabled={!canNext}
          onClick={() => canNext && onPageChange(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-3">
        <label
          htmlFor="pagination-per-page"
          className="whitespace-nowrap text-center text-[12px] font-medium text-[#666666] sm:text-left"
        >
          {perPageLabel}
        </label>
        <div className="relative mx-auto w-full max-w-[120px] sm:mx-0">
          <select
            id="pagination-per-page"
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm font-medium text-ink-900 outline-none focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/20"
          >
            {perPageOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
