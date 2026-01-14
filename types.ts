export type View = 'dashboard' | 'resume-optimizer' | 'resume-analyzer' | 'interview-prep';

export interface ResumeOptimizerParams {
  jobDescription: string;
  resumeText: string;
}

export interface ResumeOptimizationResult {
  optimizedContent: string;
  keyChanges: string[];
  atsKeywordsAdded: string[];
}

export interface InterviewParams {
  jobDescription: string;
  resumeText: string;
  focus: string; // e.g., Technical, Soft Skills, Culture Fit
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
  context: string; // Why this question was asked based on resume/job
  expectedAnswerKeyPoints: string[];
}

export interface InterviewScriptResult {
  introduction: string;
  questions: InterviewQuestion[];
  closing: string;
}

export interface JobDescriptionParams {
  title: string;
  department: string;
  seniority: string;
  location: string;
  type: string;
  skills: string;
}
