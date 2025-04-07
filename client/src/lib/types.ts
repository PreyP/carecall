// Patient types
export type Patient = {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mrn: string;
  phone: string;
  hasRedAlert: boolean;
  hasYellowAlert: boolean;
  lastCallDate: string;
  initials: string;
};

// Call types
export type CallTranscript = {
  id: number;
  patientId: number;
  date: string;
  time: string;
  durationSeconds: number;
  transcript: TranscriptEntry[];
};

export type TranscriptEntry = {
  id: number;
  speaker: 'AI' | 'Patient';
  speakerName: string;
  text: string;
  highlightType?: 'yellow' | 'red' | null;
};

// Health Assessment types
export type HealthAssessment = {
  id: number;
  patientId: number;
  callId: number;
  date: string;
  frailty: {
    score: number;
    risk: RiskLevel;
  };
  adl: {
    score: number;
    risk: RiskLevel;
  };
  iadl: {
    score: number;
    risk: RiskLevel;
  };
  medicationAdherence: {
    score: number;
    risk: RiskLevel;
  };
  cardiacRiskFactors: {
    score: number;
    risk: RiskLevel;
  };
};

export type RiskLevel = 'low' | 'moderate' | 'high';

// Key Findings
export type KeyFinding = {
  id: number;
  text: string;
  risk: RiskLevel;
};

// Health Trends
export type HealthTrendEntry = {
  id: number;
  date: string;
  summary: string;
  risk: RiskLevel;
};

// Recommended Actions
export type RecommendedAction = {
  id: number;
  category: string;
  actions: string[];
};

// Alert types
export type Alert = {
  id: number;
  patientId: number;
  type: 'red' | 'yellow' | 'green';
  category: string;
  description: string;
};
