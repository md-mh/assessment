"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddQuestionModal } from "@/features/dashboard/components/create-test/add-question-modal";
import { CreateTestStepper } from "@/features/dashboard/components/create-test/create-test-stepper";
import { QuestionCard } from "@/features/dashboard/components/create-test/question-card";
import type { ExamQuestion } from "@/features/dashboard/types/exam-question";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";

type QuestionsResponse = { items: ExamQuestion[] };

export function QuestionsSetsPage() {
  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");
  const token = useAppSelector((s) => s.auth.token);
  const role = useAppSelector((s) => s.auth.user?.role);
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuestionTitleNumber, setNewQuestionTitleNumber] = useState(1);
  const [persistError, setPersistError] = useState<string | null>(null);

  const {
    data: questions = [],
    isPending: questionsLoading,
    isError: questionsError,
    error: questionsErr,
  } = useQuery({
    queryKey: ["online-test-questions", testId],
    queryFn: () => fetchQuestionsForTest(testId!, token),
    enabled: Boolean(testId && token),
  });

  const persistMutation = useMutation({
    mutationFn: (q: ExamQuestion) =>
      apiPost<unknown>(
        `/api/online-tests/${testId}/questions`,
        {
          id: q.id,
          score: q.score,
          questionType: q.questionType,
          questionBody: q.questionBody,
          options: q.options,
        },
        token,
      ),
    onSuccess: async () => {
      setPersistError(null);
      await queryClient.invalidateQueries({
        queryKey: ["online-test-questions", testId],
      });
    },
    onError: (err: Error) => {
      setPersistError(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (questionId: string) =>
      apiDelete(
        `/api/online-tests/${testId}/questions/${encodeURIComponent(questionId)}`,
        token,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["online-test-questions", testId],
      });
    },
    onError: (err: Error) => {
      setPersistError(err.message);
    },
  });

  const initialQuestion = useMemo((): ExamQuestion | null => {
    if (!editingId) return null;
    return questions.find((q) => q.id === editingId) ?? null;
  }, [editingId, questions]);

  const modalQuestionNumber = useMemo(() => {
    if (editingId) {
      const i = questions.findIndex((q) => q.id === editingId);
      return i >= 0 ? i + 1 : 1;
    }
    return newQuestionTitleNumber;
  }, [editingId, questions, newQuestionTitleNumber]);

  const openAddQuestionModal = useCallback(() => {
    setEditingId(null);
    setNewQuestionTitleNumber(questions.length + 1);
    setModalOpen(true);
    setPersistError(null);
  }, [questions.length]);

  const openEditQuestion = useCallback((id: string) => {
    setEditingId(id);
    setModalOpen(true);
    setPersistError(null);
  }, []);

  const handleSaveQuestion = useCallback(
    (q: ExamQuestion) => {
      if (!testId || !token || role !== "employer") return;
      persistMutation.mutate(q, {
        onSuccess: () => {
          setModalOpen(false);
          setEditingId(null);
        },
      });
    },
    [persistMutation, role, testId, token],
  );

  const handleSaveAndAddMore = useCallback(
    (q: ExamQuestion) => {
      if (!testId || !token || role !== "employer") return;
      persistMutation.mutate(q, {
        onSuccess: () => {
          setNewQuestionTitleNumber((prev) => prev + 1);
          setEditingId(null);
        },
      });
    },
    [persistMutation, role, testId, token],
  );

  const handleRemoveQuestion = useCallback(
    (id: string) => {
      if (!testId || !token || role !== "employer") {
        setPersistError("You must be signed in as an employer to remove questions.");
        return;
      }
      deleteMutation.mutate(id);
      if (editingId === id) {
        setModalOpen(false);
        setEditingId(null);
      }
    },
    [deleteMutation, editingId, role, testId, token],
  );

  const canPersist = Boolean(testId && token && role === "employer");

  if (!testId) {
    return (
      <div className="flex flex-1 flex-col bg-[#eef0f4] px-4 py-10">
        <div className="mx-auto max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-900">
          <p className="font-medium">No online test selected.</p>
          <p className="mt-2 text-amber-800">
            Complete step 1 first, then continue to add questions.
          </p>
          <Link
            href="/dashboard/create"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-[12px] bg-[#6633FF] px-5 text-sm font-semibold text-white"
          >
            Go to basic information
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#eef0f4]">
      <div className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 sm:py-8 min-[1440px]:px-8 min-[1440px]:py-10">
        <div className="rounded-[16px] border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6 min-[1440px]:p-8">
          <div className="flex flex-col gap-4 min-[1440px]:gap-5">
            <h1 className="text-left text-lg font-semibold text-ink-900 sm:text-xl min-[1440px]:text-2xl">
              Manage Online Test
            </h1>

            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <CreateTestStepper current={2} />
              <Link
                href="/dashboard"
                className="inline-flex h-10 shrink-0 items-center justify-center self-start rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {!canPersist ? (
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Sign in as an employer to save questions to the server.
          </p>
        ) : null}

        {persistError ? (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {persistError}
          </p>
        ) : null}

        {questionsLoading && canPersist ? (
          <p className="mt-8 text-center text-sm text-slate-600">
            Loading questions…
          </p>
        ) : null}

        {questionsError && canPersist ? (
          <p className="mt-8 text-center text-sm text-rose-700">
            {questionsErr instanceof Error
              ? questionsErr.message
              : "Could not load questions."}
          </p>
        ) : null}

        <div className="mt-[56px] space-y-5 px-[150px]">
          {questions.map((q, index) => (
            <QuestionCard
              key={q.id}
              question={q}
              displayIndex={index + 1}
              onCardClick={() => openEditQuestion(q.id)}
              onEdit={(e) => {
                e.stopPropagation();
                openEditQuestion(q.id);
              }}
              onRemove={(e) => {
                e.stopPropagation();
                handleRemoveQuestion(q.id);
              }}
            />
          ))}

          <button
            type="button"
            onClick={openAddQuestionModal}
            disabled={!canPersist || persistMutation.isPending}
            className="flex h-12 w-full items-center justify-center rounded-[12px] bg-[#6633FF] text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6633FF]/40 focus-visible:ring-offset-2 disabled:opacity-50"
          >
            Add Question
          </button>
        </div>
      </div>

      <AddQuestionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
        }}
        questionNumber={modalQuestionNumber}
        initialQuestion={initialQuestion}
        onSave={handleSaveQuestion}
        onSaveAndAddMore={handleSaveAndAddMore}
      />
    </div>
  );
}

function fetchQuestionsForTest(
  testId: string,
  token: string | null,
): Promise<ExamQuestion[]> {
  return apiGet<QuestionsResponse>(
    `/api/online-tests/${encodeURIComponent(testId)}/questions`,
    token,
  ).then((res) => res.items);
}
