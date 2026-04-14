export type QuestionType =
  | 'scale_1_5'
  | 'single_choice'
  | 'multi_choice'
  | 'open_text'
  | 'short_text'
  | 'number'
  | 'composite_scale';

export interface SubQuestion {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  subquestions?: SubQuestion[];
  prefix?: string;
  critical?: boolean;
}

export interface Block {
  id: number;
  title: string;
  subtitle: string;
  intro_text: string;
  questions: Question[];
}

export interface TestMeta {
  title: string;
  version: string;
  total_questions: number;
  estimated_minutes: number;
}

export interface FinancialTestData {
  meta: TestMeta;
  scale_labels: Record<string, string>;
  blocks: Block[];
}

export type AnswerValue = string | number | string[] | Record<string, number> | null;
export type Answers = Record<string, AnswerValue>;

export interface TestSubmission {
  slug: string;
  answers: Answers;
  email: string;
  name?: string;
  phone?: string;
  wantsConsultation: boolean;
  createdAt: string;
}
