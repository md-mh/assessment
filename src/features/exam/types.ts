export type ExamQuestionPublic = {
  id: string;
  questionType: "checkbox" | "radio" | "text";
  questionBody: string;
  options: { id: string; body: string }[];
};

export type StartExamResponse = {
  attemptId: string;
  testId: string;
  testTitle: string;
  totalQuestions: number;
  durationSeconds: number;
  endsAt: string;
  resumed: boolean;
};

export type QuestionPayload = {
  index: number;
  total: number;
  question: ExamQuestionPublic;
  savedAnswer: {
    selectedOptionIds: string[];
    textAnswer: string;
  } | null;
  skipped: boolean;
};
