import {
  AlertCircle,
  CheckCircle2,
  ClipboardPaste,
  Crown,
  Globe,
  Link2,
  Loader2,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ATSScore from '@/components/ui/ATSScore';
import ATSSuggestions from '@/components/ui/ATSSuggestions';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTier } from '@/lib/contexts/TierContext';
import { useEditorContext } from '@/lib/contexts/EditorContext';
import { analyzeResumeWithAI } from '@/lib/services/ai';
import {
  formatScrapedJobForTextarea,
  isValidJobUrl,
  type ScrapedJobData,
  scrapeJobUrl,
} from '@/lib/services/job-scraper';
import { applySuggestionToForm } from '@/lib/utils/apply-suggestion';
import { useNotification } from '@/lib/utils/hooks';

interface JobMatchingProps {
  onEnabledNext: (val: boolean) => void;
  initialJobDescription?: string;
}

function JobMatching({ onEnabledNext, initialJobDescription }: JobMatchingProps) {
  const {
    atsAnalysis,
    setAtsAnalysis,
    isAnalyzing,
    setIsAnalyzing,
    jobDescription: contextJd,
    setJobDescription: setContextJd,
    jobTitle: contextJobTitle,
    setJobTitle: setContextJobTitle,
  } = useEditorContext();

  const [jobDescription, setJobDescription] = useState(initialJobDescription || contextJd || '');
  const [jobTitle, setJobTitle] = useState(contextJobTitle || '');
  const [company, setCompany] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [scrapedData, setScrapedData] = useState<ScrapedJobData | null>(null);

  const { addNotification } = useNotification();
  const { tier, canUseAIOptimization, remainingOptimizations, updateUsage } = useTier();
  const navigate = useNavigate();

  const isUnlimited = tier.limits.aiOptimizationsPerMonth === Infinity;
  const hasJobMatching = tier.limits.hasJobMatching;

  useEffect(() => {
    if (initialJobDescription && !jobDescription) {
      setJobDescription(initialJobDescription);
      setContextJd(initialJobDescription);
    }
  }, [initialJobDescription, jobDescription, setContextJd]);

  const methods = useFormContext<ResumeInfo>();
  const { watch, setValue, getValues } = methods;
  const formValues = watch();

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
        setContextJobTitle(data.title);
      }
      if (data.company && !company) {
        setCompany(data.company);
      }

      const formattedDescription = formatScrapedJobForTextarea(data);
      setJobDescription(formattedDescription);
      setContextJd(formattedDescription);
    } catch (error) {
      console.error('Failed to fetch job URL:', error);
      setUrlError(error instanceof Error ? error.message : 'Failed to fetch job posting');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();

      if (isValidJobUrl(text)) {
        setJobUrl(text);
        handleFetchFromUrl(text);
      } else {
        setJobDescription(text);
        setContextJd(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const analyzeResume = async () => {
    if (!jobDescription.trim()) return;

    if (!canUseAIOptimization) {
      addNotification({
        title: 'Optimization limit reached',
        message: `You've used all ${tier.limits.aiOptimizationsPerMonth} AI optimizations this month. Upgrade to Pro for unlimited access.`,
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeResumeWithAI({
        resumeData: formValues,
        jobDescription,
        jobTitle: jobTitle || undefined,
        company: company || undefined,
      });

      updateUsage((prev) => ({ aiOptimizationsUsed: prev.aiOptimizationsUsed + 1 }));

      setAtsAnalysis(result);
      setContextJd(jobDescription);
      if (jobTitle) setContextJobTitle(jobTitle);
      onEnabledNext(true);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      addNotification({
        title: 'Analysis failed',
        message: 'Could not analyze your resume. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setJobDescription('');
    setJobTitle('');
    setCompany('');
    setAtsAnalysis(null);
    setContextJd('');
    setContextJobTitle('');
    setJobUrl('');
    setUrlError(null);
    setScrapedData(null);
  };

  const handleApplySuggestion = (suggestion: ATSSuggestion) => {
    const applied = applySuggestionToForm(suggestion, setValue, getValues);
    if (applied) {
      addNotification({
        title: 'Suggestion applied',
        message: suggestion.title,
      });
    } else {
      addNotification({
        title: 'Could not apply',
        message: 'This suggestion needs to be applied manually.',
      });
    }
  };

  const analysis = atsAnalysis;

  if (!hasJobMatching) {
    return (
      <Card className="border-t-primary border-t-4">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <CardTitle>ATS Job Matching</CardTitle>
            <Badge variant="outline" className="gap-1">
              <Crown className="w-3 h-3" /> Pro
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Unlock ATS Job Matching</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Upgrade to Pro to analyze job descriptions, get AI-powered keyword suggestions, and
              improve your ATS score to land more interviews.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                AI-powered analysis
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                Keyword optimization
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                ATS score improvement
              </span>
            </div>
            <Button variant="primary" onClick={() => navigate('/dashboard/settings')}>
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-t-primary border-t-4">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <CardTitle>ATS Job Matching</CardTitle>
        </div>
        <p className="text-muted-foreground">
          Paste a job description to analyze how well your resume matches and get AI-powered
          suggestions to improve your ATS score.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-1.5">
          <Label htmlFor="jobUrl">
            Job Posting URL{' '}
            <span className="text-muted-foreground font-normal">(paste a URL to auto-fill)</span>
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="jobUrl"
                type="url"
                value={jobUrl}
                onChange={(e) => {
                  setJobUrl(e.target.value);
                  setUrlError(null);
                }}
                placeholder="https://greenhouse.io/company/job or any job URL"
                className="flex h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
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
            <div className="flex items-center gap-1.5 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              {urlError}
            </div>
          )}
          {scrapedData && !urlError && (
            <div className="flex items-center gap-1.5 text-sm text-teal-600 dark:text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
              Fetched from {scrapedData.source}: {scrapedData.title || 'Job posting'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Job Title (Optional)"
            value={jobTitle}
            onChange={(e) => {
              setJobTitle(e.target.value);
              setContextJobTitle(e.target.value);
            }}
            placeholder="e.g., Senior Software Engineer"
          />
          <Input
            label="Company (Optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., Google, Microsoft"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePaste}
              className="flex items-center gap-1 text-sm h-7"
            >
              <ClipboardPaste className="w-4 h-4" /> Paste
            </Button>
          </div>
          <Textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              setContextJd(e.target.value);
            }}
            placeholder="Paste the full job description here. Include requirements, qualifications, and responsibilities for the best analysis..."
            className="min-h-[200px] resize-y"
          />
          <p className="text-sm text-muted-foreground">{jobDescription.length} characters</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={analyzeResume}
            disabled={!jobDescription.trim() || isAnalyzing || !canUseAIOptimization}
            className="flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Analyze Match
              </>
            )}
          </Button>
          {analysis && (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={analyzeResume}
                disabled={isAnalyzing || !canUseAIOptimization}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Re-analyze
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={clearAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" /> Clear
              </Button>
            </>
          )}

          {!isUnlimited && (
            <div className="flex items-center gap-2 ml-auto text-sm">
              {canUseAIOptimization ? (
                <span className="text-muted-foreground">
                  {remainingOptimizations} optimization{remainingOptimizations === 1 ? '' : 's'} left
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/settings')}
                  className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  Limit reached — Upgrade to Pro
                </button>
              )}
            </div>
          )}
        </div>

        {(isAnalyzing || analysis) && (
          <div className="space-y-6">
            <ATSScore
              score={analysis?.score || 0}
              keywordsFound={analysis?.keywordsFound.length || 0}
              keywordsTotal={
                (analysis?.keywordsFound.length || 0) + (analysis?.keywordsMissing.length || 0)
              }
              skillsMatched={analysis?.skillsMatch.matched.length || 0}
              skillsTotal={analysis?.skillsMatch.total || 0}
              isAnalyzing={isAnalyzing}
            />
            <ATSSuggestions
              suggestions={analysis?.suggestions || []}
              onApplySuggestion={handleApplySuggestion}
              isLoading={isAnalyzing}
            />
          </div>
        )}

        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800">
              <CardContent className="pt-4">
                <h4 className="font-medium text-teal-800 dark:text-teal-300 mb-3">
                  Keywords Found ({analysis.keywordsFound.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordsFound.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200 border-transparent"
                    >
                      {keyword}
                    </Badge>
                  ))}
                  {analysis.keywordsFound.length === 0 && (
                    <span className="text-sm text-teal-600 dark:text-teal-400">
                      No keywords matched yet
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-coral-rose-50 dark:bg-coral-rose-900/20 border-coral-rose-200 dark:border-coral-rose-800">
              <CardContent className="pt-4">
                <h4 className="font-medium text-coral-rose-800 dark:text-coral-rose-300 mb-3">
                  Missing Keywords ({analysis.keywordsMissing.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordsMissing.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="bg-coral-rose-200 dark:bg-coral-rose-800 text-coral-rose-800 dark:text-coral-rose-200 border-transparent"
                    >
                      {keyword}
                    </Badge>
                  ))}
                  {analysis.keywordsMissing.length === 0 && (
                    <span className="text-sm text-teal-600 dark:text-teal-400">
                      Great! No missing keywords
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default JobMatching;
