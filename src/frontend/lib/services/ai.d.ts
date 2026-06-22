interface AnalyzeResumeRequest {
  resumeData: ResumeInfo;
  jobDescription: string;
  jobTitle?: string;
  company?: string;
}
export declare function analyzeResumeWithAI(request: AnalyzeResumeRequest): Promise<ATSAnalysis>;
export declare function generateOptimizedSummary(
  resumeData: ResumeInfo,
  jobDescription: string,
  jobTitle?: string
): Promise<string>;
