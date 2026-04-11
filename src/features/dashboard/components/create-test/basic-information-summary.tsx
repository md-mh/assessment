"use client";

import { Pencil } from "lucide-react";
import type { BasicInformationValues } from "@/features/dashboard/schemas/basic-information.schema";

const QUESTION_TYPE_LABEL: Record<string, string> = {
  mixed: "Mixed",
  mcq: "MCQ",
  written: "Written",
};

function formatCandidates(raw: string): string {
  const n = Number.parseInt(raw.replace(/,/g, ""), 10);
  if (Number.isNaN(n)) return raw;
  return n.toLocaleString("en-US");
}

type RowFieldProps = { label: string; value: string };

function RowField({ label, value }: RowFieldProps) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink-900 sm:text-base">
        {value || "—"}
      </p>
    </div>
  );
}

type BasicInformationSummaryProps = {
  values: BasicInformationValues;
  onEdit: () => void;
};

export function BasicInformationSummary({
  values,
  onEdit,
}: BasicInformationSummaryProps) {
  const questionLabel =
    QUESTION_TYPE_LABEL[values.questionType] ?? values.questionType;

  return (
    <div className="rounded-[16px] border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6 min-[1440px]:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <h2 className="text-base font-semibold text-ink-900 sm:text-lg">
          Basic Information
        </h2>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-medium text-[#6633FF] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6633FF]/40 focus-visible:ring-offset-2"
        >
          <Pencil className="h-4 w-4" aria-hidden />
          Edit
        </button>
      </div>

      <div className="mt-6 space-y-8">
        <RowField
          label="Online Test Title"
          value={values.onlineTestTitle.trim()}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <RowField
            label="Total Candidates"
            value={formatCandidates(values.totalCandidates)}
          />
          <RowField label="Total Slots" value={values.totalSlots} />
          <RowField label="Total Question Set" value={values.totalQuestionSet} />
          <RowField
            label="Duration Per Slots (Minutes)"
            value={values.duration?.trim() || "—"}
          />
        </div>

        <RowField label="Question Type" value={questionLabel} />
      </div>
    </div>
  );
}
