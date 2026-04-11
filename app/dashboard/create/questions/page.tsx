import { Suspense } from "react";
import { QuestionsSetsPage } from "@/features/dashboard/components/create-test/questions-sets-page";

export default function CreateTestQuestionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] flex-1 items-center justify-center bg-[#eef0f4] text-sm text-slate-600">
          Loading…
        </div>
      }
    >
      <QuestionsSetsPage />
    </Suspense>
  );
}
