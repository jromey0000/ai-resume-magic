import { config } from '@/config';

export interface ScrapedJobData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary: string | null;
  source: string;
  url: string;
}

interface ScrapeResponse {
  data: ScrapedJobData;
  meta: {
    scraped_at: string;
  };
}

export function isValidJobUrl(text: string): boolean {
  if (!text) return false;

  const trimmed = text.trim();

  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return false;
  }

  try {
    new URL(trimmed);
  } catch {
    return false;
  }

  const jobBoardPatterns = [
    /greenhouse\.io/i,
    /lever\.co/i,
    /linkedin\.com\/jobs/i,
    /indeed\.com/i,
    /glassdoor\.com/i,
    /workday\.com/i,
    /smartrecruiters\.com/i,
    /ashbyhq\.com/i,
    /breezy\.hr/i,
    /jobvite\.com/i,
    /workable\.com/i,
    /bamboohr\.com/i,
    /icims\.com/i,
    /jazz\.co/i,
    /recruitee\.com/i,
    /jobs\./i,
    /careers\./i,
    /job-boards\./i,
    /apply\./i,
  ];

  return jobBoardPatterns.some((pattern) => pattern.test(trimmed));
}

export async function scrapeJobUrl(url: string): Promise<ScrapedJobData> {
  const apiBaseUrl = config.API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error('API_BASE_URL is not configured');
  }

  const response = await fetch(`${apiBaseUrl}/job-scraper/scrape`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: url.trim() }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Failed to fetch job posting: ${response.statusText}`
    );
  }

  const result: ScrapeResponse = await response.json();
  return result.data;
}

export function formatScrapedJobForTextarea(data: ScrapedJobData): string {
  const sections: string[] = [];

  if (data.title) {
    sections.push(`Job Title: ${data.title}`);
  }

  if (data.company) {
    sections.push(`Company: ${data.company}`);
  }

  if (data.location) {
    sections.push(`Location: ${data.location}`);
  }

  if (data.salary) {
    sections.push(`Salary: ${data.salary}`);
  }

  sections.push('');

  if (data.responsibilities.length > 0) {
    sections.push('Responsibilities:');
    for (const r of data.responsibilities) {
      sections.push(`• ${r}`);
    }
    sections.push('');
  }

  if (data.requirements.length > 0) {
    sections.push('Requirements:');
    for (const r of data.requirements) {
      sections.push(`• ${r}`);
    }
    sections.push('');
  }

  if (data.description) {
    sections.push('Full Description:');
    sections.push(data.description);
  }

  return sections.join('\n');
}
