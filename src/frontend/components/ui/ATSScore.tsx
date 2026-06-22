import { AlertCircle, CheckCircle2, Target, TrendingUp, XCircle } from 'lucide-react';
import cn from '@/lib/utils/cn';

interface ATSScoreProps {
  score: number;
  keywordsFound: number;
  keywordsTotal: number;
  skillsMatched: number;
  skillsTotal: number;
  isAnalyzing?: boolean;
}

export default function ATSScore({
  score,
  keywordsFound,
  keywordsTotal,
  skillsMatched,
  skillsTotal,
  isAnalyzing = false,
}: ATSScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-error';
  };

  const getScoreStroke = (score: number) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    if (score >= 40) return 'oklch(65% 0.15 55)';
    return 'var(--error)';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Needs Work';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-5 h-5 text-success" />;
    if (score >= 60) return <TrendingUp className="w-5 h-5 text-warning" />;
    if (score >= 40) return <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    return <XCircle className="w-5 h-5 text-error" />;
  };

  const getProgressBarColor = (percent: number) => {
    if (percent >= 70) return 'bg-success';
    if (percent >= 40) return 'bg-warning';
    return 'bg-error';
  };

  const keywordsPercent = keywordsTotal > 0 ? (keywordsFound / keywordsTotal) * 100 : 0;
  const skillsPercent = skillsTotal > 0 ? (skillsMatched / skillsTotal) * 100 : 0;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  if (isAnalyzing) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex flex-col items-center sm:items-start">
            <div className="relative w-36 h-36">
              <svg className="w-36 h-36 animate-spin" viewBox="0 0 100 100" aria-hidden="true">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * 0.75}
                  className="text-primary"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-48" />
              <div className="space-y-3">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
            <p className="text-muted-foreground font-medium">
              Analyzing your resume...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        {/* Score Ring */}
        <div className="flex flex-col items-center sm:items-start">
          <div className="relative w-36 h-36">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={getScoreStroke(score)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-4xl font-bold', getScoreColor(score))}>{score}</span>
              <span className="text-sm text-muted-foreground font-medium">/ 100</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {getScoreIcon(score)}
            <span className={cn('font-semibold', getScoreColor(score))}>{getScoreLabel(score)}</span>
          </div>
        </div>

        {/* Stats Breakdown */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">ATS Score Breakdown</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground/80">Keywords Found</span>
                <span className={cn('text-sm font-bold', getProgressBarColor(keywordsPercent).replace('bg-', 'text-'))}>
                  {keywordsFound} / {keywordsTotal}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={cn('h-3 rounded-full transition-all duration-500', getProgressBarColor(keywordsPercent))}
                  style={{ width: `${keywordsPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {keywordsPercent >= 70 ? 'Great keyword coverage!' : keywordsPercent >= 40 ? 'Add more relevant keywords' : 'Missing important keywords'}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground/80">Skills Matched</span>
                <span className={cn('text-sm font-bold', getProgressBarColor(skillsPercent).replace('bg-', 'text-'))}>
                  {skillsMatched} / {skillsTotal}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={cn('h-3 rounded-full transition-all duration-500', getProgressBarColor(skillsPercent))}
                  style={{ width: `${skillsPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {skillsPercent >= 70 ? 'Skills align well!' : skillsPercent >= 40 ? 'Consider adding more skills' : 'Add required skills to improve'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Target:</span> Aim for 75+ for best interview chances
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
