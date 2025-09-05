// Pingala Module Types
// Everything starts from Zero - Mathematical precision in ASR

// Language interfaces - imported from landing module concept
export interface Language {
  code: string;
  name: string;
  native: string;
  speakers: string;
  region: string;
  sampleText: string;
  flag?: string;
  isAvailable: boolean;
}

export interface LanguageMeta {
  code: string;
  name: string;
  native: string;
  speakers: string;
  script: string;
  status: 'available' | 'coming-soon';
  sampleText: string;
  region: string;
}

export interface Region {
  name: string;
  description: string;
  languages: LanguageMeta[];
  count: number;
}

export interface PingalaBenchmark {
  dataset: string;
  pingalaWER: number;
  competitorWER: number;
  improvement: number;
  description: string;
}

export interface LanguageSupport {
  region: string;
  languageCount: number;
  population: number;
  examples: string[];
}

export interface ExpertSpecialist {
  name: string;
  description: string;
  activationRate: number;
  specialty: string;
}

export interface ResearchPublication {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  abstract: string;
}

export interface TechnicalMetric {
  name: string;
  value: string;
  description: string;
  formula?: string;
}

export interface MathematicalFoundation {
  principle: string;
  description: string;
  formula: string;
  application: string;
}
