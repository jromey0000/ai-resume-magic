export function formatDate(
  dateString: string,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    ...options,
  }).format(date);
}
