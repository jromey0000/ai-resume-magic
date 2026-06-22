import { AlertCircle, CheckCircle2, TrendingUp, XCircle } from 'lucide-react';
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
    if (score >= 80) return 'text-teal-500';
    if (score >= 60) return 'text-amber-500';
    if (score >= 40) return 'text-amber-600';
    return 'text-coral-rose-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-teal-500 to-teal-600';
    if (score >= 60) return 'from-amber-500 to-amber-600';
    if (score >= 40) return 'from-amber-600 to-amber-700';
    return 'from-coral-rose-500 to-coral-rose-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Needs Improvement';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-5 h-5 text-teal-500" />;
    if (score >= 60) return <TrendingUp className="w-5 h-5 text-amber-500" />;
    if (score >= 40) return <AlertCircle className="w-5 h-5 text-amber-600" />;
    return <XCircle className="w-5 h-5 text-coral-rose-500" />;
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  if (isAnalyzing) {
    return (
      <div className="bg-white dark:bg-cod-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-cod-gray-700">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 animate-spin" viewBox="0 0 100 100" aria-hidden="true">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-cod-gray-700"
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
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
            Analyzing your resume...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-cod-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-cod-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        ATS Compatibility Score
      </h3>

      <div className="flex flex-col items-center">
        {/* Circular Progress */}
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-cod-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  className={cn(
                    'stop-color-current',
                    getScoreBgColor(score).split(' ')[0].replace('from-', 'text-')
                  )}
                />
                <stop
                  offset="100%"
                  className={cn(
                    'stop-color-current',
                    getScoreBgColor(score).split(' ')[1].replace('to-', 'text-')
                  )}
                />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-3xl font-bold', getScoreColor(score))}>{score}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">/ 100</span>
          </div>
        </div>

        {/* Score Label */}
        <div className="flex items-center gap-2 mb-6">
          {getScoreIcon(score)}
          <span className={cn('font-medium', getScoreColor(score))}>{getScoreLabel(score)}</span>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-cod-gray-900 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Keywords</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {keywordsFound}/{keywordsTotal}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-cod-gray-700 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${keywordsTotal > 0 ? (keywordsFound / keywordsTotal) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-cod-gray-900 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Skills</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {skillsMatched}/{skillsTotal}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-cod-gray-700 rounded-full h-2">
              <div
                className="bg-secondary h-2 rounded-full transition-all duration-500"
                style={{ width: `${skillsTotal > 0 ? (skillsMatched / skillsTotal) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
