export type ExamQuestionKind = "checkbox" | "radio" | "text";

export type ExamAnswerOption = {
  id: string;
  body: string;
  correct: boolean;
};

export type ExamQuestion = {
  id: string;
  score: string;
  questionType: ExamQuestionKind;
  questionBody: string;
  options: ExamAnswerOption[];
};

export function createExamQuestionId(): string {
  return `eq-${Math.random().toString(36).slice(2, 12)}`;
}

export function examQuestionTypeLabel(type: ExamQuestionKind): string {
  if (type === "radio") return "MCQ";
  if (type === "checkbox") return "Checkbox";
  return "Text";
}
