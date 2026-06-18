export interface ParsedResumeData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  jobTitle?: string;
  summary?: string;
  experience?: Array<{
    title: string;
    companyName: string;
    city?: string;
    state?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
    workSummary?: string;
  }>;
  education?: Array<{
    degree?: string;
    major?: string;
    school: string;
    city?: string;
    state?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  skills?: Array<{
    name: string;
    rating?: number;
  }>;
  rawText: string;
}
export declare function parseResume(file: File): Promise<ParsedResumeData>;
export declare function convertParsedToResumeInfo(parsed: ParsedResumeData): Partial<ResumeInfo>;
