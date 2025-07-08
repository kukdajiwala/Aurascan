export interface AssessmentResult {
  id: number;
  fullName: string;
  evaluationType: string;
  moodScore: number;
  moodText: string;
  trustScore: number;
  riskScore: number;
  recommendation: string;
  reason: string;
  createdAt: Date;
  voiceSentiment?: {
    emotion: string;
    confidence: number;
    tone: string;
  };
}

export interface AppConfig {
  id: number;
  appName: string;
  accentColor: string;
  hireLabel: string;
  reviewLabel: string;
  rejectLabel: string;
}

export interface AssessmentFormData {
  fullName: string;
  evaluationType: "mood" | "trust" | "risk" | "final" | "comprehensive";
  resume: File | null;
  image: File | null;
}
