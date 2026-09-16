export interface QuestionEntry {
  id: string;
  question: string;
  answer: string;
  theme: string;
  action: { label: string; route: string };
}
