import { createContext } from 'react';
import { ResumeInfo } from '@/types';

interface ResumeInfoContextType {
  resumeInfo: ResumeInfo | null;
  setResumeInfo: (resumeInfo: ResumeInfo) => void;
}

export const ResumeInfoContext = createContext<ResumeInfoContextType>({
  resumeInfo: null,
  setResumeInfo: () => {},
});
