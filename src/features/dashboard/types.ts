export type OnlineTestItem = {
  id: string;
  title: string;
  /** Shown on employer dashboard cards */
  candidates: string;
  questionSets: string;
  examSlots: string;
  /** Shown on candidate dashboard cards */
  duration: string;
  questionCount: string;
  negativeMarking: string;
};
