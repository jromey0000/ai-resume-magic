import type { UseFormGetValues, UseFormSetValue } from 'react-hook-form';

export function applySuggestionToForm(
  suggestion: ATSSuggestion,
  setValue: UseFormSetValue<ResumeInfo>,
  getValues: UseFormGetValues<ResumeInfo>
): boolean {
  if (!suggestion.suggestedText) {
    return false;
  }

  switch (suggestion.type) {
    case 'summary': {
      setValue('summary', suggestion.suggestedText, { shouldDirty: true });
      return true;
    }

    case 'skill': {
      const existing = getValues('skills') || [];
      const newSkillNames = suggestion.suggestedText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const existingNames = new Set(existing.map((s) => s.name.toLowerCase()));
      const toAdd = newSkillNames
        .filter((name) => !existingNames.has(name.toLowerCase()))
        .map((name) => ({ id: String(Date.now() + Math.random()), name, rating: 80 }));

      if (toAdd.length > 0) {
        setValue('skills', [...existing, ...toAdd], { shouldDirty: true });
        return true;
      }
      return false;
    }

    case 'experience': {
      const experiences = getValues('experience') || [];
      if (experiences.length === 0) {
        return false;
      }
      const updated = [...experiences];
      const first = { ...updated[0] };
      const addition = suggestion.suggestedText;
      first.workSummary = first.workSummary ? `${first.workSummary}\n${addition}` : addition;
      updated[0] = first;
      setValue('experience', updated, { shouldDirty: true });
      return true;
    }

    case 'keyword': {
      const summary = getValues('summary') || '';
      const keywords = suggestion.suggestedText.replace(/^Consider adding:\s*/i, '');
      const updatedSummary = summary
        ? `${summary} ${keywords}`
        : `Experienced professional skilled in ${keywords}.`;
      setValue('summary', updatedSummary.trim(), { shouldDirty: true });
      return true;
    }

    case 'format':
      return false;

    default:
      return false;
  }
}
