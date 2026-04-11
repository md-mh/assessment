"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BasicInformationForm } from "@/features/dashboard/components/create-test/basic-information-form";
import { BasicInformationSummary } from "@/features/dashboard/components/create-test/basic-information-summary";
import { CreateTestStepper } from "@/features/dashboard/components/create-test/create-test-stepper";
import type { BasicInformationValues } from "@/features/dashboard/schemas/basic-information.schema";
import { apiPost } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

const BASIC_INFO_FORM_ID = "basic-information-form";

export function ManageOnlineTestPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAppSelector((s) => s.auth.token);
  const role = useAppSelector((s) => s.auth.user?.role);
  const [basicInfoStep, setBasicInfoStep] = useState<"form" | "summary">(
    "form",
  );
  const [basicInfoValues, setBasicInfoValues] =
    useState<BasicInformationValues | null>(null);
  const [formRemountKey, setFormRemountKey] = useState(0);

  const createTestMutation = useMutation({
    mutationFn: (values: BasicInformationValues) =>
      apiPost<{ id: string }>("/api/online-tests", values, token),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["online-tests"] });
      router.push(`/dashboard/create/questions?testId=${encodeURIComponent(data.id)}`);
    },
  });

  const handleFormSubmit = useCallback((values: BasicInformationValues) => {
    setBasicInfoValues(values);
    setBasicInfoStep("summary");
  }, []);

  const handleSummaryContinue = useCallback(() => {
    if (!basicInfoValues) return;
    if (!token || role !== "employer") {
      createTestMutation.reset();
      return;
    }
    createTestMutation.mutate(basicInfoValues);
  }, [basicInfoValues, createTestMutation, role, token]);

  const handleCancel = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const handleEditSummary = useCallback(() => {
    setFormRemountKey((k) => k + 1);
    setBasicInfoStep("form");
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-[#eef0f4]">
      <div className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 sm:py-8 min-[1440px]:px-8 min-[1440px]:py-10">
        <div className="rounded-[16px] border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6 min-[1440px]:p-8">
          <div className="flex flex-col gap-4 min-[1440px]:gap-5">
            <h1 className="text-left text-lg font-semibold text-ink-900 sm:text-xl min-[1440px]:text-2xl">
              Manage Online Test
            </h1>

            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <CreateTestStepper current={1} />
              <Link
                href="/dashboard"
                className="inline-flex h-10 shrink-0 items-center justify-center self-start rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 min-[1440px]:mt-8 px-[150px] space-y-6">
          {basicInfoStep === "form" ? (
            <BasicInformationForm
              key={formRemountKey}
              formId={BASIC_INFO_FORM_ID}
              defaultValues={basicInfoValues ?? undefined}
              onSubmit={handleFormSubmit}
            />
          ) : (
            basicInfoValues && (
              <BasicInformationSummary
                values={basicInfoValues}
                onEdit={handleEditSummary}
              />
            )
          )}

          {basicInfoStep === "summary" && createTestMutation.error ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {createTestMutation.error.message}
            </p>
          ) : null}
          {basicInfoStep === "summary" && (!token || role !== "employer") ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Sign in as an employer to save this test to the server.
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 rounded-[16px] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleCancel}
              className={cn(
                "h-12 rounded-[12px] border border-[#E5E7EB] bg-white px-6 text-sm font-medium text-slate-600",
                "transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
              )}
            >
              Cancel
            </button>
            {basicInfoStep === "form" ? (
              <button
                type="submit"
                form={BASIC_INFO_FORM_ID}
                className="h-12 rounded-[12px] bg-[#6633FF] px-8 text-sm font-semibold text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6633FF]/40 focus-visible:ring-offset-2"
              >
                Save & Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSummaryContinue}
                disabled={
                  createTestMutation.isPending ||
                  !token ||
                  role !== "employer"
                }
                className="h-12 rounded-[12px] bg-[#6633FF] px-8 text-sm font-semibold text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6633FF]/40 focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {createTestMutation.isPending ? "Saving…" : "Save & Continue"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
