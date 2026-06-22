import { createContext, type ReactNode, useCallback, useContext, useState } from 'react';

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

const EditorContext = createContext<EditorContextValue | null>(null);

interface EditorProviderProps {
  children: ReactNode;
  isGuestMode?: boolean;
  initialJobDescription?: string;
  initialJobTitle?: string;
}

export function EditorProvider({
  children,
  isGuestMode = false,
  initialJobDescription = '',
  initialJobTitle = '',
}: EditorProviderProps) {
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState(initialJobDescription);
  const [jobTitle, setJobTitle] = useState(initialJobTitle);

  const handleSetAtsAnalysis = useCallback((analysis: ATSAnalysis | null) => {
    setAtsAnalysis(analysis);
  }, []);

  return (
    <EditorContext.Provider
      value={{
        atsAnalysis,
        setAtsAnalysis: handleSetAtsAnalysis,
        isAnalyzing,
        setIsAnalyzing,
        jobDescription,
        setJobDescription,
        jobTitle,
        setJobTitle,
        isGuestMode,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext(): EditorContextValue {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider');
  }
  return context;
}
