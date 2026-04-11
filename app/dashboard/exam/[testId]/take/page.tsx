import { ExamTakePage } from "@/features/exam/components/exam-take-page";

type PageProps = {
  params: Promise<{ testId: string }>;
};

export default async function ExamTakeRoutePage({ params }: PageProps) {
  const { testId } = await params;
  return <ExamTakePage routeTestId={testId} />;
}
