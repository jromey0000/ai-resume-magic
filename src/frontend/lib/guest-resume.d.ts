export interface GuestResumeDraft {
  title: string;
  resumeInfo: ResumeInfo;
  jobDescription?: string;
  jobTitle?: string;
  createdAt: string;
}
export declare function getGuestDraft(): GuestResumeDraft | null;
export declare function saveGuestDraft(draft: GuestResumeDraft): void;
export declare function updateGuestResumeInfo(resumeInfo: ResumeInfo): void;
export declare function createGuestDraft(
  title: string,
  resumeInfo: Partial<ResumeInfo>,
  options?: {
    jobDescription?: string;
    jobTitle?: string;
  }
): GuestResumeDraft;
export declare function clearGuestDraft(): void;
export declare function hasGuestDraft(): boolean;
