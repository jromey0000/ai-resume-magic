import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ATSScorePillProps {
  score: number;
  isAnalyzing?: boolean;
  onClick?: () => void;
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-teal-600 dark:text-teal-400';
  if (score >= 60) return 'text-amber-600 dark:text-amber-400';
  return 'text-coral-rose-600 dark:text-coral-rose-400';
}

function getScoreBg(score: number) {
  if (score >= 80) return 'bg-teal-100 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800';
  if (score >= 60)
    return 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
  return 'bg-coral-rose-100 dark:bg-coral-rose-900/30 border-coral-rose-200 dark:border-coral-800';
}

export default function ATSScorePill({ score, isAnalyzing, onClick }: ATSScorePillProps) {
  if (isAnalyzing) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-muted text-sm">
        <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-muted-foreground">Analyzing...</span>
      </div>
    );
  }

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors',
        getScoreBg(score),
        onClick && 'hover:opacity-80 cursor-pointer'
      )}
      title="ATS match score — click to view analysis"
    >
      <TrendingUp className={cn('w-3.5 h-3.5', getScoreColor(score))} />
      <span className={getScoreColor(score)}>ATS {score}%</span>
    </Wrapper>
  );
}
