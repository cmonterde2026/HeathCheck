export type SectionId =
  | 'dashboard'
  | 'symptoms'
  | 'bmi'
  | 'wellness'
  | 'tips'
  | 'account';

export type SymptomCategory =
  | 'General & Systemic'
  | 'Respiratory'
  | 'Neurological'
  | 'Digestive'
  | 'Musculoskeletal'
  | 'Skin';

export interface SymptomItem {
  id: string;
  name: string;
  category: SymptomCategory;
  isRedFlag?: boolean;
  followUpQuestions: string[];
  generalInfo: string;
  selfCareGuidance: string[];
  whenToSeekCare: string[];
}

export interface BmiRecord {
  id: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obesity';
  recordedAt: string;
}

export interface ActivityEntry {
  id: string;
  type: string;
  durationMinutes: number;
  intensity: 'Light' | 'Moderate' | 'Vigorous';
  loggedAt: string;
}

export type SleepQuality = 'Rested' | 'Fair' | 'Restless';

export interface DailyWellnessLog {
  date: string; // YYYY-MM-DD
  waterMl: number;
  sleepHours: number | null;
  sleepQuality: SleepQuality | null;
  activities: ActivityEntry[];
}

export interface WellnessTargets {
  waterMl: number;
  sleepHours: number;
  activityMinutes: number;
}

export type TipCategory =
  | 'Healthy Eating'
  | 'Hydration'
  | 'Exercise'
  | 'Sleep'
  | 'Personal Wellness';

export interface HealthTipArticle {
  id: string;
  category: TipCategory;
  title: string;
  summary: string;
  readTime: string;
  imageUrl?: string;
  imageAlt?: string;
  keyPractices: string[];
  guidanceDetails: string;
}
