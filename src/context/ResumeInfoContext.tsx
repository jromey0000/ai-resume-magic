import { createContext } from 'react';

interface ResumeInfoContextType {
  resumeInfo: ResumeInfo | null;
  setResumeInfo: (resumeInfo: ResumeInfo) => void;
}

export const ResumeInfoContext = createContext<ResumeInfoContextType>({
  resumeInfo: null,
  setResumeInfo: () => {},
});
