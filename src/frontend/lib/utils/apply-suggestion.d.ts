import type { UseFormGetValues, UseFormSetValue } from 'react-hook-form';
export declare function applySuggestionToForm(
  suggestion: ATSSuggestion,
  setValue: UseFormSetValue<ResumeInfo>,
  getValues: UseFormGetValues<ResumeInfo>
): boolean;
