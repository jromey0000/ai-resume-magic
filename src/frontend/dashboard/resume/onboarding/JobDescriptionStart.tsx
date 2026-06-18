import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ClipboardPaste,
  Globe,
  Link2,
  Loader2,
  Sparkles,
  Target,
} from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import {
  formatScrapedJobForTextarea,
  isValidJobUrl,
  type ScrapedJobData,
  scrapeJobUrl,
} from '@/lib/services/job-scraper';

interface JobDescriptionStartProps {
  onContinue: (jobDescription: string, jobTitle: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

interface ExtractedInfo {
  suggestedTitle: string;
  company: string;
  keySkills: string[];
  experienceLevel: string;
}

function JobDescriptionStart({ onContinue, onBack, isLoading }: JobDescriptionStartProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);
  const [jobUrl, setJobUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [scrapedData, setScrapedData] = useState<ScrapedJobData | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();

      if (isValidJobUrl(text)) {
        setJobUrl(text);
        handleFetchFromUrl(text);
      } else {
        setJobDescription(text);
        if (text.length > 100) {
          analyzeJobDescription(text);
        }
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const analyzeJobDescription = async (text: string) => {
    setIsAnalyzing(true);

    // Simulate AI extraction - in production this would call the AI service
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simple heuristic extraction for demo
    const lines = text.split('\n').filter((l) => l.trim());
    let detectedTitle = '';
    let detectedCompany = '';

    // Try to extract job title from common patterns
    for (const line of lines.slice(0, 10)) {
      const lower = line.toLowerCase();
      if (
        lower.includes('engineer') ||
        lower.includes('developer') ||
        lower.includes('manager') ||
        lower.includes('designer') ||
        lower.includes('analyst')
      ) {
        if (
          line.length < 60 &&
          !lower.includes('responsibilities') &&
          !lower.includes('requirements')
        ) {
          detectedTitle = line.trim();
          break;
        }
      }
    }

    // Try to extract company name
    const companyPatterns = [
      /(?:at|@|company[:\s]+)([A-Z][A-Za-z\s]+)/i,
      /(?:about|join)\s+([A-Z][A-Za-z\s]+)/i,
    ];
    for (const pattern of companyPatterns) {
      const match = text.match(pattern);
      if (match) {
        detectedCompany = match[1].trim();
        break;
      }
    }

    // Extract key skills
    const skillKeywords = [
      'React',
      'TypeScript',
      'JavaScript',
      'Python',
      'Node.js',
      'AWS',
      'Docker',
      'Kubernetes',
      'SQL',
      'PostgreSQL',
      'MongoDB',
      'GraphQL',
      'REST API',
      'Agile',
      'Scrum',
      'CI/CD',
      'Git',
      'Linux',
      'Java',
      'Go',
      'Rust',
      'Machine Learning',
      'AI',
      'Data Analysis',
      'Product Management',
      'UX',
      'UI',
    ];
    const foundSkills = skillKeywords.filter((skill) =>
      text.toLowerCase().includes(skill.toLowerCase())
    );

    // Detect experience level
    let experienceLevel = 'Mid-level';
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes('senior') ||
      lowerText.includes('lead') ||
      lowerText.includes('principal')
    ) {
      experienceLevel = 'Senior';
    } else if (
      lowerText.includes('junior') ||
      lowerText.includes('entry') ||
      lowerText.includes('associate')
    ) {
      experienceLevel = 'Entry-level';
    } else if (lowerText.includes('staff') || lowerText.includes('architect')) {
      experienceLevel = 'Staff+';
    }

    setExtractedInfo({
      suggestedTitle: detectedTitle,
      company: detectedCompany,
      keySkills: foundSkills.slice(0, 8),
      experienceLevel,
    });

    if (detectedTitle && !jobTitle) {
      setJobTitle(detectedTitle);
    }
    if (detectedCompany && !company) {
      setCompany(detectedCompany);
    }

    setIsAnalyzing(false);
  };

  const handleFetchFromUrl = async (url?: string) => {
    const urlToFetch = url || jobUrl;
    if (!urlToFetch.trim()) return;

    setIsFetchingUrl(true);
    setUrlError(null);

    try {
      const data = await scrapeJobUrl(urlToFetch);
      setScrapedData(data);

      if (data.title && !jobTitle) {
        setJobTitle(data.title);
      }
      if (data.company && !company) {
        setCompany(data.company);
      }

      const formattedDescription = formatScrapedJobForTextarea(data);
      setJobDescription(formattedDescription);

      if (formattedDescription.length > 100) {
        analyzeJobDescription(formattedDescription);
      }
    } catch (error) {
      console.error('Failed to fetch job URL:', error);
      setUrlError(error instanceof Error ? error.message : 'Failed to fetch job posting');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJobDescription(text);

    // Auto-analyze when enough text is entered
    if (text.length > 200 && !extractedInfo && !isAnalyzing) {
      analyzeJobDescription(text);
    }
  };

  const handleContinue = () => {
    onContinue(jobDescription, jobTitle || extractedInfo?.suggestedTitle || '');
  };

  const charCount = jobDescription.length;
  const isReady = charCount >= 100;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-8 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to options
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-fuchsia-pink-500/20 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Target Your Dream Job</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Paste the job posting and our AI will help you create a perfectly tailored resume
          </p>
        </div>

        {/* Job URL Input */}
        <div className="mb-4">
          <label
            htmlFor="job-url"
            className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            Job Posting URL <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="job-url"
                type="url"
                value={jobUrl}
                onChange={(e) => {
                  setJobUrl(e.target.value);
                  setUrlError(null);
                }}
                placeholder="https://greenhouse.io/company/job or paste any job URL"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-cod-gray-600 dark:bg-cod-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFetchFromUrl()}
              disabled={!jobUrl.trim() || isFetchingUrl}
              className="flex items-center gap-1.5 px-4"
            >
              {isFetchingUrl ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
              Fetch
            </Button>
          </div>
          {urlError && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-coral-rose-600">
              <AlertCircle className="w-4 h-4" />
              {urlError}
            </div>
          )}
          {scrapedData && !urlError && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              Fetched from {scrapedData.source}: {scrapedData.title || 'Job posting'}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Supports Greenhouse, Lever, LinkedIn, and most job boards
          </p>
        </div>

        {/* Optional: Job title and company fields */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="job-title"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Job Title
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-cod-gray-600 dark:bg-cod-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="job-company"
              className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
            >
              Company
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="job-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google, Stripe"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-cod-gray-600 dark:bg-cod-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Job Description Textarea */}
        <div className="bg-white dark:bg-cod-gray-900 rounded-2xl border border-gray-200 dark:border-cod-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-cod-gray-700 bg-gray-50 dark:bg-cod-gray-800">
            <span className="text-sm font-medium">Job Description</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePaste}
              className="flex items-center gap-1.5 text-sm"
            >
              <ClipboardPaste className="w-4 h-4" /> Paste from Clipboard
            </Button>
          </div>
          <textarea
            value={jobDescription}
            onChange={handleTextChange}
            placeholder="Paste the full job description here...

Include:
• Job title and responsibilities
• Required qualifications
• Preferred skills
• About the company

The more detail you provide, the better we can tailor your resume!"
            className="w-full p-4 min-h-[280px] resize-y border-0 focus:ring-0 outline-none dark:bg-cod-gray-900 text-sm"
          />
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-cod-gray-700 bg-gray-50 dark:bg-cod-gray-800">
            <span className={`text-sm ${isReady ? 'text-green-600' : 'text-gray-500'}`}>
              {charCount} characters {!isReady && '(minimum 100)'}
            </span>
            {isAnalyzing && (
              <span className="flex items-center gap-2 text-sm text-primary">
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
              </span>
            )}
          </div>
        </div>

        {/* Extracted Info Preview */}
        {extractedInfo && !isAnalyzing && (
          <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-fuchsia-pink-500/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-medium text-sm">AI-Detected Information</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {extractedInfo.suggestedTitle && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Role:</span>
                  <p className="font-medium truncate">{extractedInfo.suggestedTitle}</p>
                </div>
              )}
              {extractedInfo.company && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Company:</span>
                  <p className="font-medium">{extractedInfo.company}</p>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400">Key Skills Detected:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {extractedInfo.keySkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {extractedInfo.keySkills.length === 0 && (
                    <span className="text-gray-400 text-xs">None detected yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Benefits reminder */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> Auto-extracts requirements
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> Suggests keywords
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" /> Higher ATS scores
          </span>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full mt-6"
          onClick={handleContinue}
          disabled={!isReady || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Creating Resume...
            </>
          ) : (
            <>
              Continue to Resume Builder <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        <button
          type="button"
          onClick={() => onContinue('', '')}
          className="w-full mt-3 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          Skip for now — I'll add a job description later
        </button>
      </div>
    </div>
  );
}

export default JobDescriptionStart;
