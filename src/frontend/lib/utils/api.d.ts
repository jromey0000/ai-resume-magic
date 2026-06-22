declare const fetcher: (
  url: string,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: unknown
) => Promise<unknown>;
declare const updateResumeDetail: (
  id: string | undefined,
  payload:
    | PersonalDetailsFormData
    | SummaryFormData
    | WorkExperienceFormData
    | EducationFormData
    | SkillsFormData
    | {
        data?: Partial<ResumeInfo>;
      }
) => void;

export { fetcher, updateResumeDetail };
