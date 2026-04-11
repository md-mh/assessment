import type { OnlineTestItem } from "@/features/dashboard/types";

/**
 * Ensures every card has employer + candidate fields populated from GET /api/online-tests
 * (handles older responses or missing keys safely).
 */
export function normalizeOnlineTestItem(raw: unknown): OnlineTestItem {
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, fallback: string) =>
    v !== undefined && v !== null && String(v).trim() !== ""
      ? String(v).trim()
      : fallback;

  return {
    id: str(r.id, ""),
    title: str(r.title, "Untitled"),
    candidates: str(r.candidates, "—"),
    questionSets: str(r.questionSets, "—"),
    examSlots: str(r.examSlots, "—"),
    duration: str(r.duration, "30 min"),
    questionCount: str(
      r.questionCount ?? r.question_count,
      "0",
    ),
    negativeMarking: str(r.negativeMarking ?? r.negative_marking, "-0.25/wrong"),
  };
}
