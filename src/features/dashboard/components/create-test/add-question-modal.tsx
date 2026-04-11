"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  Bold,
  ChevronDown,
  Italic,
  Plus,
  Redo2,
  Trash2,
  Undo2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import type {
  ExamAnswerOption,
  ExamQuestion,
  ExamQuestionKind,
} from "@/features/dashboard/types/exam-question";
import { createExamQuestionId } from "@/features/dashboard/types/exam-question";
import { cn } from "@/lib/utils";

const QUESTION_TYPES = [
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio" },
  { value: "text", label: "Text" },
];

const TEXT_STYLES = [
  { value: "normal", label: "Normal text" },
  { value: "h2", label: "Heading" },
];

const LIST_STYLES = [
  { value: "none", label: "List" },
  { value: "bullet", label: "Bullet list" },
  { value: "ordered", label: "Numbered list" },
];

function circledDigit(n: number): string {
  if (n >= 1 && n <= 9) {
    return String.fromCharCode(0x245f + n);
  }
  return String(n);
}

function wrapSelection(
  el: HTMLTextAreaElement,
  before: string,
  after: string = before,
) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const v = el.value;
  const sel = v.slice(start, end);
  const next = `${v.slice(0, start)}${before}${sel}${after}${v.slice(end)}`;
  el.value = next;
  const cursor = start + before.length + sel.length + after.length;
  el.focus();
  el.setSelectionRange(cursor, cursor);
}

type EditorFieldProps = {
  minHeightClass?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
};

function MiniEditorField({
  minHeightClass = "min-h-[140px]",
  placeholder,
  value,
  onChange,
}: EditorFieldProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  const run = (fn: (el: HTMLTextAreaElement) => void) => {
    const el = taRef.current;
    if (el) fn(el);
    onChange(taRef.current?.value ?? "");
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        <button
          type="button"
          className="rounded p-1.5 text-slate-600 hover:bg-slate-200/80"
          title="Undo"
        >
          <Undo2 className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          className="rounded p-1.5 text-slate-600 hover:bg-slate-200/80"
          title="Redo"
        >
          <Redo2 className="h-4 w-4" aria-hidden />
        </button>
        <span className="mx-0.5 h-5 w-px bg-slate-300" aria-hidden />
        <div className="relative">
          <select
            className="h-8 appearance-none rounded border border-transparent bg-transparent py-0 pl-2 pr-7 text-xs text-slate-700 hover:bg-slate-200/60"
            defaultValue="normal"
            aria-label="Text style"
          >
            {TEXT_STYLES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>
        <div className="relative">
          <select
            className="h-8 appearance-none rounded border border-transparent bg-transparent py-0 pl-2 pr-7 text-xs text-slate-700 hover:bg-slate-200/60"
            defaultValue="none"
            aria-label="List style"
          >
            {LIST_STYLES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>
        <span className="mx-0.5 h-5 w-px bg-slate-300" aria-hidden />
        <button
          type="button"
          className="rounded p-1.5 font-semibold text-slate-700 hover:bg-slate-200/80"
          title="Bold"
          onClick={() =>
            run((el) => wrapSelection(el, "**", "**"))
          }
        >
          <Bold className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          className="rounded p-1.5 italic text-slate-700 hover:bg-slate-200/80"
          title="Italic"
          onClick={() =>
            run((el) => wrapSelection(el, "*", "*"))
          }
        >
          <Italic className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full resize-y border-0 px-3 py-2.5 text-sm text-ink-900 outline-none ring-0 placeholder:text-slate-400 focus:ring-0",
          minHeightClass,
        )}
      />
    </div>
  );
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const MAX_OPTIONS = 5;
const MIN_OPTIONS_MC = 2;

function createId() {
  return `opt-${Math.random().toString(36).slice(2, 11)}`;
}

function defaultMcOptions(): ExamAnswerOption[] {
  return [
    { id: createId(), body: "", correct: false },
    { id: createId(), body: "", correct: false },
    { id: createId(), body: "", correct: false },
  ];
}

type AddQuestionModalProps = {
  open: boolean;
  onClose: () => void;
  questionNumber: number;
  /** When set, form loads this question (edit mode). */
  initialQuestion: ExamQuestion | null;
  onSave: (question: ExamQuestion) => void;
  onSaveAndAddMore: (question: ExamQuestion) => void;
};

export function AddQuestionModal({
  open,
  onClose,
  questionNumber,
  initialQuestion,
  onSave,
  onSaveAndAddMore,
}: AddQuestionModalProps) {
  const titleId = useId();
  const correctAnswerGroupId = useId();
  const [score, setScore] = useState("1");
  const [questionType, setQuestionType] =
    useState<ExamQuestionKind>("checkbox");
  const [questionBody, setQuestionBody] = useState("");
  const [options, setOptions] = useState<ExamAnswerOption[]>(() =>
    defaultMcOptions(),
  );

  const isText = questionType === "text";
  const isRadio = questionType === "radio";

  const resetFields = useCallback(() => {
    setScore("1");
    setQuestionType("checkbox");
    setQuestionBody("");
    setOptions(defaultMcOptions());
  }, []);

  const applyQuestion = useCallback((q: ExamQuestion) => {
    setScore(q.score);
    setQuestionType(q.questionType);
    setQuestionBody(q.questionBody);
    setOptions(
      q.options.map((o) => ({
        ...o,
        id: o.id || createId(),
      })),
    );
  }, []);

  const buildPayload = useCallback((): ExamQuestion => {
    return {
      id: initialQuestion?.id ?? createExamQuestionId(),
      score,
      questionType,
      questionBody,
      options: options.map((o) => ({ ...o })),
    };
  }, [
    initialQuestion?.id,
    score,
    questionType,
    questionBody,
    options,
  ]);

  const handleQuestionTypeChange = (value: string) => {
    const prev = questionType;
    setQuestionType(value as ExamQuestionKind);

    if (value === "text") {
      setOptions((opts) => {
        const merged = opts[0]?.body?.trim()
          ? opts[0].body
          : opts.map((o) => o.body).find((b) => b.trim()) ?? "";
        return [{ id: createId(), body: merged, correct: false }];
      });
      return;
    }

    if (prev === "text") {
      const base = defaultMcOptions();
      setOptions(
        value === "radio"
          ? base.map((o, i) => ({ ...o, correct: i === 0 }))
          : base,
      );
      return;
    }

    if (value === "radio") {
      setOptions((opts) => {
        const firstCorrect = opts.findIndex((o) => o.correct);
        const keepIdx = firstCorrect >= 0 ? firstCorrect : 0;
        return opts.map((o, i) => ({
          ...o,
          correct: i === keepIdx,
        }));
      });
    }
  };

  useEffect(() => {
    if (!open) return;
    if (initialQuestion) {
      applyQuestion(initialQuestion);
    } else {
      resetFields();
    }
  }, [open, initialQuestion?.id, applyQuestion, resetFields, initialQuestion]);

  const updateOption = (
    id: string,
    patch: Partial<Pick<ExamAnswerOption, "body" | "correct">>,
  ) => {
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    );
  };

  const removeOption = (id: string) => {
    if (isText) return;
    setOptions((prev) => {
      if (prev.length <= MIN_OPTIONS_MC) return prev;
      const next = prev.filter((o) => o.id !== id);
      if (isRadio) {
        const hadCorrect = prev.find((o) => o.id === id)?.correct;
        if (hadCorrect && next.length)
          return next.map((o, i) => ({ ...o, correct: i === 0 }));
      }
      return next;
    });
  };

  const addOption = () => {
    if (isText || options.length >= MAX_OPTIONS) return;
    setOptions((prev) => {
      if (prev.length >= MAX_OPTIONS) return prev;
      const next = [...prev, { id: createId(), body: "", correct: false }];
      if (questionType === "radio" && !next.some((o) => o.correct)) {
        return next.map((o, i) => ({ ...o, correct: i === 0 }));
      }
      return next;
    });
  };

  const setCorrectRadio = (id: string) => {
    setOptions((prev) =>
      prev.map((o) => ({ ...o, correct: o.id === id })),
    );
  };

  const handleSave = () => {
    onSave(buildPayload());
    onClose();
  };

  const handleSaveAndAddMore = () => {
    onSaveAndAddMore(buildPayload());
    resetFields();
  };

  const titleText =
    questionNumber >= 1 && questionNumber <= 9
      ? `${circledDigit(questionNumber)} Question ${questionNumber}`
      : `Question ${questionNumber}`;

  return (
    <Modal open={open} onClose={onClose} titleId={titleId}>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 id={titleId} className="text-base font-semibold text-ink-900">
              {titleText}
            </h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <label className="flex items-center gap-2 text-sm text-ink-800">
                <span>Score:</span>
                <input
                  type="number"
                  min={0}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="h-9 w-14 rounded-lg border border-slate-200 px-2 text-center text-sm outline-none focus:border-[#6633FF] focus:ring-2 focus:ring-[#6633FF]/15"
                />
              </label>
              <div className="w-[140px] sm:w-[160px]">
                <Select
                  value={questionType}
                  onChange={(e) => handleQuestionTypeChange(e.target.value)}
                  className="h-9 text-sm"
                >
                  {QUESTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-rose-600"
                title="Remove question"
              >
                <Trash2 className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          <p className="mb-2 text-sm font-medium text-ink-800">Question</p>
          <MiniEditorField
            value={questionBody}
            onChange={setQuestionBody}
            placeholder="Type your question here…"
          />

          <div className="mt-6 space-y-5">
            {options.map((opt, idx) => (
              <div key={opt.id}>
                {isText ? (
                  <>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-ink-800"
                        aria-hidden
                      >
                        A
                      </span>
                      <button
                        type="button"
                        onClick={() => updateOption(opt.id, { body: "" })}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600"
                        title="Clear answer"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <MiniEditorField
                      minHeightClass="min-h-[100px]"
                      value={opt.body}
                      onChange={(v) => updateOption(opt.id, { body: v })}
                      placeholder="Expected answer or instructions…"
                    />
                  </>
                ) : (
                  <>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-ink-800"
                          aria-hidden
                        >
                          {LETTERS[idx] ?? idx + 1}
                        </span>
                        {isRadio ? (
                          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-800">
                            <input
                              type="radio"
                              name={correctAnswerGroupId}
                              checked={opt.correct}
                              onChange={() => setCorrectRadio(opt.id)}
                              className="h-4 w-4 border-slate-300 accent-[#6633FF] focus:ring-[#6633FF]/30"
                            />
                            Set as correct answer
                          </label>
                        ) : (
                          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-800">
                            <input
                              type="checkbox"
                              checked={opt.correct}
                              onChange={(e) =>
                                updateOption(opt.id, {
                                  correct: e.target.checked,
                                })
                              }
                              className="h-4 w-4 rounded border-slate-300 accent-[#6633FF] text-[#6633FF] focus:ring-[#6633FF]/30"
                            />
                            Set as correct answer
                          </label>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOption(opt.id)}
                        disabled={options.length <= MIN_OPTIONS_MC}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Remove option"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                    <MiniEditorField
                      minHeightClass="min-h-[100px]"
                      value={opt.body}
                      onChange={(v) => updateOption(opt.id, { body: v })}
                      placeholder={`Answer ${LETTERS[idx] ?? idx + 1}…`}
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          {!isText && (
            <button
              type="button"
              onClick={addOption}
              disabled={options.length >= MAX_OPTIONS}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#6633FF] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Another options
            </button>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={handleSave}
            className="h-11 rounded-[10px] border border-[#6633FF] bg-white px-6 text-sm font-semibold text-[#6633FF] transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6633FF]/40"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleSaveAndAddMore}
            className="h-11 rounded-[10px] bg-[#6633FF] px-6 text-sm font-semibold text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6633FF]/40"
          >
            Save &amp; Add More
          </button>
        </div>
      </div>
    </Modal>
  );
}
