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
export declare function isValidJobUrl(text: string): boolean;
export declare function scrapeJobUrl(url: string): Promise<ScrapedJobData>;
export declare function formatScrapedJobForTextarea(data: ScrapedJobData): string;
