export type IslandSlug =
  | 'basics'
  | 'banking-budgeting'
  | 'credit-protection'
  | 'taxes-investing'
  | 'markets-business'
  | 'finance-psychology'
  | 'capstone';

export type Standard =
  | 'earning_income'
  | 'spending'
  | 'saving'
  | 'investing'
  | 'managing_credit'
  | 'managing_risk';

export type LearnFormat =
  | 'walkthrough'
  | 'play'
  | 'explore'
  | 'story'
  | 'compare'
  | 'explain';

export type QuestionType =
  | 'mc'
  | 'true_false'
  | 'sort'
  | 'order'
  | 'wordbank'
  | 'numberline'
  | 'slider'
  | 'fill_number'
  | 'spot_mistake'
  | 'scenario';

export type LearnData = Record<string, unknown>;

// Inline question data (no DB lookup needed)
export interface QuestionConfig {
  type: QuestionType
  prompt: string
  explanation: string
  config: Record<string, unknown>  // type-specific, see scoring/index.ts
}

export interface AnotherWay {
  format: Exclude<LearnFormat, 'explore'>;
  title: string;
  body: string;
  data?: LearnData;
  // practice question shown after anotherWay card (ungraded)
  practiceQuestion?: QuestionConfig;
}

export type Step =
  | { kind: 'hook'; text: string }
  | { kind: 'learn'; format: LearnFormat; title: string; body: string; data?: LearnData; anotherWay?: AnotherWay }
  | { kind: 'question' } & QuestionConfig & { questionId: string; graded?: boolean }
  | { kind: 'try_it'; widget: 'compound' | 'loan_payoff' | 'retirement'; config: Record<string, number> }
  | { kind: 'money_move'; text: string };

export interface Island {
  slug: IslandSlug;
  title: string;
  tagline: string;
  order: number;
  art: string;
  standards: Standard[];
  color: string;
}

export interface Unit {
  id: string;
  slug: string;
  island: IslandSlug;
  order: number;
  title: string;
  summary: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  centsReward: number;
}

export interface Lesson {
  id: string;
  slug: string;
  unitId: string;
  order: number;
  title: string;
  minutes: number;
  centsReward: number;
  objective: string;
  steps: Step[];
  factCheckedAt?: string;
}
