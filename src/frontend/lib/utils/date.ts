export function formatDate(
  dateString: string | undefined | null,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions,
  fallback = ''
): string {
  if (!dateString?.trim()) {
    return fallback;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    ...options,
  }).format(date);
}
