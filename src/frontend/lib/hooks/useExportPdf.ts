import { useCallback, useState } from 'react';

export type ExportQuality = 'standard' | 'high';
export type PaperSize = 'a4' | 'letter';

export type ExportStep = 'idle' | 'validating' | 'preparing' | 'rendering' | 'generating' | 'complete' | 'error';

export interface ExportOptions {
  quality: ExportQuality;
  paperSize: PaperSize;
  filename: string;
  includeAtsScore?: boolean;
}

export interface ExportProgress {
  step: ExportStep;
  progress: number;
  message: string;
}

export interface ValidationIssue {
  field: string;
  severity: 'error' | 'warning';
  message: string;
}

export interface ExportValidation {
  isValid: boolean;
  completionScore: number;
  issues: ValidationIssue[];
}

const STEP_MESSAGES: Record<ExportStep, string> = {
  idle: 'Ready to export',
  validating: 'Checking your resume...',
  preparing: 'Preparing your resume...',
  rendering: 'Rendering preview...',
  generating: 'Creating PDF...',
  complete: 'Download complete!',
  error: 'Export failed',
};

const STEP_PROGRESS: Record<ExportStep, number> = {
  idle: 0,
  validating: 10,
  preparing: 25,
  rendering: 50,
  generating: 80,
  complete: 100,
  error: 0,
};

export function validateResumeForExport(resumeInfo: ResumeInfo): ExportValidation {
  const issues: ValidationIssue[] = [];

  if (!resumeInfo.firstName || !resumeInfo.lastName) {
    issues.push({
      field: 'name',
      severity: 'error',
      message: 'Name is required',
    });
  }

  if (!resumeInfo.email) {
    issues.push({
      field: 'email',
      severity: 'error',
      message: 'Email is required',
    });
  }

  if (!resumeInfo.jobTitle) {
    issues.push({
      field: 'jobTitle',
      severity: 'warning',
      message: 'Job title helps recruiters understand your target role',
    });
  }

  if (!resumeInfo.summary || resumeInfo.summary.length < 50) {
    issues.push({
      field: 'summary',
      severity: 'warning',
      message: 'A strong summary significantly improves your chances',
    });
  }

  if (!resumeInfo.experience || resumeInfo.experience.length === 0) {
    issues.push({
      field: 'experience',
      severity: 'warning',
      message: 'Adding work experience makes your resume more compelling',
    });
  }

  if (!resumeInfo.skills || resumeInfo.skills.length === 0) {
    issues.push({
      field: 'skills',
      severity: 'warning',
      message: 'Skills help your resume pass ATS filters',
    });
  }

  const hasErrors = issues.some((i) => i.severity === 'error');

  let completionScore = 0;
  if (resumeInfo.firstName && resumeInfo.lastName) completionScore += 15;
  if (resumeInfo.email) completionScore += 10;
  if (resumeInfo.phone) completionScore += 5;
  if (resumeInfo.jobTitle) completionScore += 10;
  if (resumeInfo.summary && resumeInfo.summary.length >= 50) completionScore += 15;
  if (resumeInfo.experience && resumeInfo.experience.length > 0) completionScore += 20;
  if (resumeInfo.education && resumeInfo.education.length > 0) completionScore += 10;
  if (resumeInfo.skills && resumeInfo.skills.length > 0) completionScore += 15;

  return {
    isValid: !hasErrors,
    completionScore: Math.min(100, completionScore),
    issues,
  };
}

export function useExportPdf() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState<ExportProgress>({
    step: 'idle',
    progress: 0,
    message: STEP_MESSAGES.idle,
  });
  const [error, setError] = useState<string | null>(null);

  const updateStep = useCallback((step: ExportStep, customMessage?: string) => {
    setProgress({
      step,
      progress: STEP_PROGRESS[step],
      message: customMessage ?? STEP_MESSAGES[step],
    });
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setError(null);
    updateStep('idle');
  }, [updateStep]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
    updateStep('idle');
  }, [updateStep]);

  const reset = useCallback(() => {
    setError(null);
    updateStep('idle');
  }, [updateStep]);

  return {
    isModalOpen,
    progress,
    error,
    openModal,
    closeModal,
    updateStep,
    setError,
    reset,
  };
}
