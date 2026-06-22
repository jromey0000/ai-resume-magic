const COPY_SUFFIX_PATTERN = /\s*\(Copy(?:\s+(\d+))?\)$/i;

export function getBaseResumeTitle(title: string): string {
  return title.replace(COPY_SUFFIX_PATTERN, '').trim();
}

export function getDuplicateResumeTitle(sourceTitle: string, existingTitles: string[]): string {
  const baseTitle = getBaseResumeTitle(sourceTitle);
  const escapedBase = baseTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const copyTitlePattern = new RegExp(`^${escapedBase}\\s*\\(Copy(?:\\s+(\\d+))?\\)$`, 'i');

  let maxCopyNumber = 0;

  for (const title of existingTitles) {
    const match = title.match(copyTitlePattern);
    if (match) {
      const copyNumber = match[1] ? parseInt(match[1], 10) : 1;
      maxCopyNumber = Math.max(maxCopyNumber, copyNumber);
    }
  }

  return `${baseTitle} (Copy ${maxCopyNumber + 1})`;
}
