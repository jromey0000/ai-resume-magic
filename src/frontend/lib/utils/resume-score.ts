export function computeCompletionScore(resume: Partial<ResumeInfo>): number {
  let score = 0;

  if (resume.firstName && resume.lastName && resume.email && resume.phone && resume.jobTitle) {
    score += 20;
  }
  if (resume.summary && resume.summary.length > 50) score += 20;
  if (resume.experience && resume.experience.length > 0) score += 25;
  if (resume.education && resume.education.length > 0) score += 15;
  if (resume.skills && resume.skills.length > 0) score += 20;

  return Math.min(score, 100);
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function extractTargetRole(resume: Resume): string | null {
  if (resume.jobTitle) return resume.jobTitle;
  const match = resume.title.match(/Resume for (.+)/i);
  return match?.[1] ?? null;
}
