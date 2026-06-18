const GUEST_DRAFT_KEY = 'ai-resume-magic-guest-draft';

export interface GuestResumeDraft {
  title: string;
  resumeInfo: ResumeInfo;
  jobDescription?: string;
  jobTitle?: string;
  createdAt: string;
}

export function getGuestDraft(): GuestResumeDraft | null {
  try {
    const raw = localStorage.getItem(GUEST_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GuestResumeDraft;
  } catch {
    return null;
  }
}

export function saveGuestDraft(draft: GuestResumeDraft): void {
  localStorage.setItem(GUEST_DRAFT_KEY, JSON.stringify(draft));
}

export function updateGuestResumeInfo(resumeInfo: ResumeInfo): void {
  const draft = getGuestDraft();
  if (!draft) return;
  saveGuestDraft({ ...draft, resumeInfo });
}

export function createGuestDraft(
  title: string,
  resumeInfo: Partial<ResumeInfo>,
  options?: { jobDescription?: string; jobTitle?: string }
): GuestResumeDraft {
  const draft: GuestResumeDraft = {
    title,
    resumeInfo: {
      themeColor: '#cb37d8',
      templateId: 'classic',
      ...resumeInfo,
    },
    jobDescription: options?.jobDescription,
    jobTitle: options?.jobTitle,
    createdAt: new Date().toISOString(),
  };
  saveGuestDraft(draft);
  return draft;
}

export function clearGuestDraft(): void {
  localStorage.removeItem(GUEST_DRAFT_KEY);
}

export function hasGuestDraft(): boolean {
  return getGuestDraft() !== null;
}
