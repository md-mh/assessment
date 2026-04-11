"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bold,
  CheckCircle2,
  Italic,
  Redo2,
  Timer,
  Undo2,
  XCircle,
} from "lucide-react";
import { ApiError, apiGet, apiPost } from "@/lib/api";
import type {
  QuestionPayload,
  StartExamResponse,
} from "@/features/exam/types";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

type Phase = "loading" | "exam" | "completed" | "timedOut";

export type ExamTakePageProps = {
  /** Resolved from the URL by the App Router (preferred over client `useParams`). */
  routeTestId?: string;
};

function formatTimeLeft(seconds: number): string {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function ExamTakePage({ routeTestId }: ExamTakePageProps = {}) {
  const params = useParams();
  const testId =
    routeTestId ??
    (typeof params.testId === "string" ? params.testId : "");
  const hasStartedRef = useRef(false);
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);
  const queryClient = useQueryClient();

  const [phase, setPhase] = useState<Phase>("loading");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [endsAt, setEndsAt] = useState<string | null>(null);
  const [testTitle, setTestTitle] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSec, setRemainingSec] = useState(0);
  const [startError, setStartError] = useState<string | null>(null);
  const [startErrorCode, setStartErrorCode] = useState<string | undefined>();

  const [selectedRadio, setSelectedRadio] = useState<string | null>(null);
  const [selectedChecks, setSelectedChecks] = useState<Set<string>>(
    () => new Set(),
  );
  const [textAnswer, setTextAnswer] = useState("");

  const startMutation = useMutation({
    mutationFn: () => {
      if (!testId) throw new Error("Missing test id");
      return apiPost<StartExamResponse>(
        `/api/candidate/exams/${encodeURIComponent(testId)}/start`,
        {},
        token,
      );
    },
    onSuccess: (data) => {
      setAttemptId(data.attemptId);
      setEndsAt(data.endsAt);
      setTestTitle(data.testTitle);
      setTotalQuestions(data.totalQuestions);
      setCurrentIndex(0);
      setPhase("exam");
      const end = new Date(data.endsAt).getTime();
      setRemainingSec(Math.max(0, Math.floor((end - Date.now()) / 1000)));
      setStartError(null);
      setStartErrorCode(undefined);
    },
    onError: (e: Error) => {
      setPhase("loading");
      hasStartedRef.current = false;
      if (e instanceof ApiError) {
        setStartError(e.message);
        setStartErrorCode(e.code);
      } else {
        setStartError(e.message);
        setStartErrorCode(undefined);
      }
    },
  });

  useEffect(() => {
    hasStartedRef.current = false;
  }, [testId]);

  useEffect(() => {
    if (
      !testId ||
      !token ||
      user?.role !== "candidate" ||
      hasStartedRef.current
    )
      return;
    hasStartedRef.current = true;
    startMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional single start per testId
  }, [token, user?.role, testId]);

  const questionQuery = useQuery({
    queryKey: ["exam-question", attemptId, currentIndex],
    queryFn: () =>
      apiGet<QuestionPayload>(
        `/api/candidate/exams/attempts/${encodeURIComponent(attemptId!)}/questions/${currentIndex}`,
        token,
      ),
    enabled: Boolean(token && attemptId && phase === "exam"),
    retry: (failureCount, err) => {
      if (err instanceof ApiError && [400, 401, 403, 404, 410].includes(err.status)) {
        return false;
      }
      return failureCount < 2;
    },
  });

  useEffect(() => {
    const q = questionQuery.data;
    if (!q) return;
    if (q.skipped || !q.savedAnswer) {
      setSelectedRadio(null);
      setSelectedChecks(new Set());
      setTextAnswer("");
      return;
    }
    const sa = q.savedAnswer;
    if (q.question.questionType === "radio") {
      setSelectedRadio(sa.selectedOptionIds[0] ?? null);
    } else if (q.question.questionType === "checkbox") {
      setSelectedChecks(new Set(sa.selectedOptionIds));
    } else {
      setTextAnswer(sa.textAnswer);
    }
  }, [questionQuery.data]);

  useEffect(() => {
    if (!endsAt || phase !== "exam") return;
    const tick = () => {
      const end = new Date(endsAt).getTime();
      const left = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setRemainingSec(left);
      if (left <= 0 && attemptId && token) {
        void apiPost(
          `/api/candidate/exams/attempts/${encodeURIComponent(attemptId)}/timeout`,
          {},
          token,
        ).catch(() => {});
        setPhase("timedOut");
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt, phase, attemptId, token]);

  const saveMutation = useMutation({
    mutationFn: async (input: {
      skipped: boolean;
      questionId: string;
    }) => {
      const q = questionQuery.data?.question;
      if (!q || !attemptId) throw new Error("No question");
      let selectedOptionIds: string[] = [];
      let text = "";
      if (!input.skipped) {
        if (q.questionType === "radio" && selectedRadio) {
          selectedOptionIds = [selectedRadio];
        } else if (q.questionType === "checkbox") {
          selectedOptionIds = [...selectedChecks];
        } else if (q.questionType === "text") {
          text = textAnswer;
        }
      }
      return apiPost<{
        savedIndex: number;
        isLastQuestion: boolean;
      }>(
        `/api/candidate/exams/attempts/${encodeURIComponent(attemptId)}/answers`,
        {
          questionId: input.questionId,
          skipped: input.skipped,
          selectedOptionIds:
            q.questionType === "text" ? undefined : selectedOptionIds,
          textAnswer: q.questionType === "text" ? text : undefined,
        },
        token,
      );
    },
    onSuccess: async (result) => {
      if (!attemptId) return;
      if (result.isLastQuestion) {
        await apiPost<{ testTitle: string; testId: string }>(
          `/api/candidate/exams/attempts/${encodeURIComponent(attemptId)}/complete`,
          {},
          token,
        );
        setPhase("completed");
        void queryClient.invalidateQueries({ queryKey: ["online-tests"] });
        return;
      }
      setCurrentIndex((i) => i + 1);
      void queryClient.invalidateQueries({
        queryKey: ["exam-question", attemptId],
      });
    },
    onError: (e: Error) => {
      if (e instanceof ApiError && e.code === "TIME_UP") {
        setPhase("timedOut");
      }
    },
  });

  const handleSkip = useCallback(() => {
    const q = questionQuery.data?.question;
    if (!q || saveMutation.isPending) return;
    saveMutation.mutate({ skipped: true, questionId: q.id });
  }, [questionQuery.data?.question, saveMutation]);

  const handleSaveContinue = useCallback(() => {
    const q = questionQuery.data?.question;
    if (!q || saveMutation.isPending) return;
    saveMutation.mutate({ skipped: false, questionId: q.id });
  }, [questionQuery.data?.question, saveMutation]);

  const headerRight = useMemo(
    () => formatTimeLeft(remainingSec),
    [remainingSec],
  );

  if (!token || user?.role !== "candidate") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-slate-600">
        <p>Sign in as a candidate to take this exam.</p>
        <Link href="/login" className="mt-4 inline-block text-[#6633FF] underline">
          Sign in
        </Link>
      </div>
    );
  }

  if (!testId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">
        Loading exam…
      </div>
    );
  }

  if (startError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm text-rose-700">{startError}</p>
        {startErrorCode === "NOT_FOUND" ? (
          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            There is no exam with id{" "}
            <span className="font-mono text-slate-800">{testId}</span> in the
            database. Use{" "}
            <span className="font-medium text-slate-800">Start</span> from the
            dashboard so the link matches a real test.
          </p>
        ) : null}
        {startErrorCode === "NO_QUESTIONS" ? (
          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            This exam has no questions yet. Ask the organizer to add questions,
            then try again.
          </p>
        ) : null}
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (phase === "loading" || startMutation.isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">
        Starting exam…
      </div>
    );
  }

  if (phase === "completed") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#eef0f4] px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 ring-2 ring-amber-200">
            <CheckCircle2 className="h-9 w-9 text-blue-600" aria-hidden />
          </div>
          <h1 className="mt-6 text-xl font-bold text-slate-800">Test Completed</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Congratulations!{" "}
            <span className="font-semibold text-slate-800">{user.fullName}</span>,
            you have completed your exam for{" "}
            <span className="font-semibold text-slate-800">{testTitle}</span>.
            Thank you for participating.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-8 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "timedOut") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#eef0f4] px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
            <Timer className="h-14 w-14 text-slate-600" strokeWidth={1.5} />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white">
              <XCircle className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <h1 className="mt-6 text-xl font-bold text-slate-800">Timeout!</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Dear {user.fullName}, your exam time has finished. Thank you for
            participating.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-8 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const q = questionQuery.data;
  const question = q?.question;
  const loadingQ = questionQuery.isPending || questionQuery.isFetching;
  const questionErr =
    questionQuery.isError && questionQuery.error instanceof Error
      ? questionQuery.error
      : null;

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#eef0f4] px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-700">
            Question ({currentIndex + 1}/{totalQuestions || q?.total || "—"})
          </p>
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-slate-200/80 px-4 py-2 text-sm font-medium text-slate-700 sm:self-auto">
            <Timer className="h-4 w-4" aria-hidden />
            {headerRight} left
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-8">
          {questionErr ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-rose-700">{questionErr.message}</p>
              <button
                type="button"
                onClick={() => void questionQuery.refetch()}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Try again
              </button>
            </div>
          ) : loadingQ && !q ? (
            <p className="text-sm text-slate-500">Loading question…</p>
          ) : question ? (
            <>
              <div className="text-base font-semibold leading-snug text-slate-900">
                <span className="text-[#6633FF]">Q{currentIndex + 1}. </span>
                <span className="font-normal text-slate-800">
                  {question.questionBody?.trim()
                    ? question.questionBody
                    : "(Question text is empty)"}
                </span>
              </div>

              {question.questionType === "text" ? (
                <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
                    <button
                      type="button"
                      className="rounded p-1.5 text-slate-500"
                      aria-hidden
                    >
                      <Undo2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 text-slate-500"
                      aria-hidden
                    >
                      <Redo2 className="h-4 w-4" />
                    </button>
                    <span className="mx-1 text-xs text-slate-400">|</span>
                    <button
                      type="button"
                      className="rounded p-1.5 text-slate-500"
                      aria-hidden
                    >
                      <Bold className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 text-slate-500"
                      aria-hidden
                    >
                      <Italic className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Type your answer here…"
                    className="min-h-[180px] w-full resize-y border-0 px-4 py-3 text-sm text-slate-800 outline-none ring-0 placeholder:text-slate-400"
                    rows={8}
                  />
                </div>
              ) : (
                <ul className="mt-6 space-y-3">
                  {(question.options ?? []).map((opt) => (
                    <li key={opt.id}>
                      <label
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm text-slate-800 transition",
                          question.questionType === "radio" &&
                            selectedRadio === opt.id
                            ? "border-[#6633FF] bg-[#6633FF]/[0.04]"
                            : question.questionType === "checkbox" &&
                                selectedChecks.has(opt.id)
                              ? "border-[#6633FF] bg-[#6633FF]/[0.04]"
                              : "border-slate-200 hover:border-slate-300",
                        )}
                      >
                        <input
                          type={
                            question.questionType === "radio"
                              ? "radio"
                              : "checkbox"
                          }
                          name={
                            question.questionType === "radio"
                              ? `q-${question.id}`
                              : undefined
                          }
                          checked={
                            question.questionType === "radio"
                              ? selectedRadio === opt.id
                              : selectedChecks.has(opt.id)
                          }
                          onChange={() => {
                            if (question.questionType === "radio") {
                              setSelectedRadio(opt.id);
                            } else {
                              setSelectedChecks((prev) => {
                                const next = new Set(prev);
                                if (next.has(opt.id)) next.delete(opt.id);
                                else next.add(opt.id);
                                return next;
                              });
                            }
                          }}
                          className="mt-0.5 h-4 w-4 shrink-0 border-slate-300 text-[#6633FF] focus:ring-[#6633FF]"
                        />
                        <span>{opt.body}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={saveMutation.isPending}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Skip this Question
                </button>
                <button
                  type="button"
                  onClick={handleSaveContinue}
                  disabled={saveMutation.isPending}
                  className="h-11 rounded-xl bg-[#6633FF] px-8 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-50"
                >
                  {saveMutation.isPending ? "Saving…" : "Save & Continue"}
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-rose-600">Could not load question.</p>
          )}
        </div>
      </div>
    </div>
  );
}
