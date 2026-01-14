export type View = 'dashboard' | 'job-generator' | 'resume-analyzer' | 'interview-prep';

export interface JobDescriptionParams {
  title: string;
  department: string;
  seniority: string;
  location: string;
  type: string;
  skills: string;
}

export interface InterviewParams {
  role: string;
  focus: string; // e.g., Technical, Cultural, Leadership
  experienceLevel: string;
}

export interface ResumeAnalysisResult {
  matchScore: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  summary: string;
}

export interface InterviewQuestion {
  category: string;
  question: string;
  expectedAnswerKeyPoints: string[];
}

export interface InterviewScriptResult {
  introduction: string;
  questions: InterviewQuestion[];
  closing: string;
}
