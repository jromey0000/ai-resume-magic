import { type ReactNode } from 'react';

interface EditorContextValue {
  atsAnalysis: ATSAnalysis | null;
  setAtsAnalysis: (analysis: ATSAnalysis | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  jobTitle: string;
  setJobTitle: (title: string) => void;
  isGuestMode: boolean;
}
interface EditorProviderProps {
  children: ReactNode;
  isGuestMode?: boolean;
  initialJobDescription?: string;
  initialJobTitle?: string;
}
export declare function EditorProvider({
  children,
  isGuestMode,
  initialJobDescription,
  initialJobTitle,
}: EditorProviderProps): import('react').JSX.Element;
export declare function useEditorContext(): EditorContextValue;
