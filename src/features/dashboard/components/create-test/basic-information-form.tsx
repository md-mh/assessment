"use client";

import type { MouseEvent, ReactNode } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  BasicInformationValues,
  basicInformationSchema,
} from "@/features/dashboard/schemas/basic-information.schema";
import { cn } from "@/lib/utils";

const SLOT_OPTIONS = ["4", "8", "12", "16", "20", "24"];
const QUESTION_SET_OPTIONS = ["1", "2", "3", "4", "5"];
const QUESTION_TYPE_OPTIONS = [
  { value: "mixed", label: "Mixed" },
  { value: "mcq", label: "Multiple choice" },
  { value: "written", label: "Written" },
];

function openTimePickerOnFieldClick(e: MouseEvent<HTMLInputElement>) {
  const el = e.currentTarget;
  if (typeof el.showPicker === "function") {
    try {
      void el.showPicker();
    } catch {
      /* not supported or picker already open */
    }
  }
}

/** Hides the browser’s built-in time icon so only our Lucide clock shows (WebKit/Chromium). */
const timeInputHideNativeIcon =
  "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0";

type FieldLabelProps = { children: ReactNode; required?: boolean };

function FieldLabel({ children, required }: FieldLabelProps) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-ink-800">
      {children}
      {required && (
        <span className="ml-0.5 text-red-600" aria-hidden>
          *
        </span>
      )}
    </label>
  );
}

type BasicInformationFormProps = {
  formId?: string;
  onSubmit: (values: BasicInformationValues) => void;
  defaultValues?: Partial<BasicInformationValues>;
};

export function BasicInformationForm({
  formId = "basic-information-form",
  onSubmit,
  defaultValues,
}: BasicInformationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInformationValues>({
    resolver: yupResolver(basicInformationSchema),
    defaultValues: {
      onlineTestTitle: "",
      totalCandidates: "",
      totalSlots: "",
      totalQuestionSet: "",
      questionType: "",
      startTime: "",
      endTime: "",
      duration: "",
      ...defaultValues,
    },
  });

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="rounded-[16px] border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6 min-[1440px]:p-8">
        <h2 className="text-base font-semibold text-ink-900 sm:text-lg">
          Basic Information
        </h2>

        <div className="mt-6 space-y-5">
          <div>
            <FieldLabel required>Online Test Title</FieldLabel>
            <Input
              placeholder="Enter online test title"
              className="h-12 rounded-lg border-slate-200 focus:border-[#6633FF] focus:ring-[#6633FF]/15"
              {...register("onlineTestTitle")}
            />
            {errors.onlineTestTitle && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.onlineTestTitle.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <div>
              <FieldLabel required>Total Candidates</FieldLabel>
              <Input
                inputMode="numeric"
                placeholder="Enter total candidates"
                className="h-12 rounded-lg border-slate-200 focus:border-[#6633FF] focus:ring-[#6633FF]/15"
                {...register("totalCandidates")}
              />
              {errors.totalCandidates && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.totalCandidates.message}
                </p>
              )}
            </div>
            <div>
              <FieldLabel required>Total Slots</FieldLabel>
              <Select {...register("totalSlots")}>
                <option value="">Select total slots</option>
                {SLOT_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
              {errors.totalSlots && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.totalSlots.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <div>
              <FieldLabel required>Total Question Set</FieldLabel>
              <Select {...register("totalQuestionSet")}>
                <option value="">Select total question set</option>
                {QUESTION_SET_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
              {errors.totalQuestionSet && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.totalQuestionSet.message}
                </p>
              )}
            </div>
            <div>
              <FieldLabel required>Question Type</FieldLabel>
              <Select {...register("questionType")}>
                <option value="">Select question type</option>
                {QUESTION_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
              {errors.questionType && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.questionType.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.82fr)] md:gap-4">
            <div>
              <FieldLabel required>Start Time</FieldLabel>
              <div className="relative">
                <Input
                  type="time"
                  className={cn(
                    "relative h-12 rounded-lg border-slate-200 pr-10 focus:border-[#6633FF] focus:ring-[#6633FF]/15",
                    timeInputHideNativeIcon,
                  )}
                  {...register("startTime")}
                  onClick={openTimePickerOnFieldClick}
                />
                <Clock
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
              </div>
              {errors.startTime && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.startTime.message}
                </p>
              )}
            </div>
            <div>
              <FieldLabel required>End Time</FieldLabel>
              <div className="relative">
                <Input
                  type="time"
                  className={cn(
                    "relative h-12 rounded-lg border-slate-200 pr-10 focus:border-[#6633FF] focus:ring-[#6633FF]/15",
                    timeInputHideNativeIcon,
                  )}
                  {...register("endTime")}
                  onClick={openTimePickerOnFieldClick}
                />
                <Clock
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
              </div>
              {errors.endTime && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.endTime.message}
                </p>
              )}
            </div>
            <div>
              <FieldLabel>Duration</FieldLabel>
              <Input
                placeholder="Duration Time"
                className="h-12 rounded-lg border-slate-200 focus:border-[#6633FF] focus:ring-[#6633FF]/15"
                {...register("duration")}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
