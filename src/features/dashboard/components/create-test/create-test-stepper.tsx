import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type CreateTestStepperProps = {
  /** `1` = Basic Info step; `2` = Questions Sets step */
  current: 1 | 2;
};

export function CreateTestStepper({ current }: CreateTestStepperProps) {
  const onQuestionsStep = current === 2;

  return (
    <div
      className="flex min-w-0 flex-1 items-center justify-start gap-2"
      aria-label="Progress"
    >
      <div className="flex items-center gap-2">
        {onQuestionsStep ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6633FF] text-white">
            <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          </span>
        ) : (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6633FF] text-sm font-semibold text-white"
            aria-current="step"
          >
            1
          </span>
        )}
        <span className="text-sm font-medium text-[#6633FF]">Basic Info</span>
      </div>

      <div className="h-px w-8 bg-[#4B5563] sm:w-12" aria-hidden />

      <div
        className={cn(
          "flex items-center gap-2",
          !onQuestionsStep && "opacity-70",
        )}
      >
        {onQuestionsStep ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6633FF] text-white">
            <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          </span>
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-[#D1D5DB] text-sm font-semibold text-slate-500">
            2
          </span>
        )}
        <span
          className={cn(
            "text-sm font-medium",
            onQuestionsStep ? "text-[#6633FF]" : "text-slate-500",
          )}
        >
          Questions Sets
        </span>
      </div>
    </div>
  );
}
