export declare const useCreateNewResume: () => {
  createNewResume: (resumeData: UserResume) => Promise<unknown>;
  data: unknown;
  error: unknown;
};
export declare const useDeleteResume: () => {
  deleteResume: (documentId: string, userEmail: string) => Promise<boolean>;
};
export declare const useDuplicateResume: () => {
  duplicateResume: (
    resume: Resume,
    userEmail: string,
    existingTitles?: string[]
  ) => Promise<unknown>;
};
export declare const useGetUserResumes: (userEmail: string) => {
  data: unknown;
  error: unknown;
  isLoading: boolean;
  mutate: import('swr').KeyedMutator<unknown>;
};
export declare const useGetUserResume: (id: string | undefined) => {
  data: unknown;
  error: unknown;
  isLoading: boolean;
  mutate: import('swr').KeyedMutator<unknown>;
};
