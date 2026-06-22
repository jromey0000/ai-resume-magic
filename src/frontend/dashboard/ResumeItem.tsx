import { Check, Copy, Pencil, Trash2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedItem from '@/components/ui/AnimatedItem';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ResumeThumbnail from '@/components/ui/ResumeThumbnail';
import { cn } from '@/lib/utils';
import {
  computeCompletionScore,
  extractTargetRole,
  formatRelativeTime,
} from '@/lib/utils/resume-score';

interface ResumeItemProps {
  resume: Resume;
  viewMode?: 'gallery' | 'list';
  onDelete?: (resume: Resume) => void;
  onDuplicate?: (resume: Resume) => void;
  isExiting?: boolean;
  isHighlighted?: boolean;
  enterDelay?: number;
  onExitComplete?: () => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (resume: Resume, selected: boolean) => void;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
      : score >= 50
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        : 'bg-cod-gray-100 text-cod-gray-600 dark:bg-cod-gray-800 dark:text-cod-gray-400';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        color
      )}
    >
      <TrendingUp className="w-3 h-3" />
      {score}%
    </span>
  );
}

function ResumeItem({
  resume,
  viewMode = 'gallery',
  onDelete,
  onDuplicate,
  isExiting = false,
  isHighlighted = false,
  enterDelay = 0,
  onExitComplete,
  selectionMode = false,
  isSelected = false,
  onSelectionChange,
}: ResumeItemProps) {
  const relativeDate = resume.updatedAt ? formatRelativeTime(resume.updatedAt) : 'Recently';
  const completionScore = resume.atsScore ?? computeCompletionScore(resume);
  const targetRole = extractTargetRole(resume);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(resume);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDuplicate?.(resume);
  };

  const handleSelectionToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectionChange?.(resume, !isSelected);
  };

  const actionButtons = (
    <>
      <Link
        to={`/dashboard/resume/${resume.documentId}/edit`}
        className="p-2 rounded-md hover:bg-primary/10 transition-colors active:scale-95"
        aria-label="Edit resume"
        title="Edit"
      >
        <Pencil className="w-4 h-4 text-muted-foreground hover:text-primary" />
      </Link>
      <button
        type="button"
        onClick={handleDuplicate}
        className="p-2 rounded-md hover:bg-primary/10 transition-colors active:scale-95"
        aria-label="Duplicate resume"
        title="Duplicate"
      >
        <Copy className="w-4 h-4 text-muted-foreground hover:text-primary" />
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="p-2 rounded-md hover:bg-coral-rose-100 dark:hover:bg-coral-rose-950/30 transition-colors active:scale-95"
        aria-label="Delete resume"
        title="Delete"
      >
        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-coral-rose-600" />
      </button>
    </>
  );

  const selectionCheckbox = (
    <button
      type="button"
      onClick={handleSelectionToggle}
      className={cn(
        'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
        isSelected
          ? 'bg-primary border-primary text-primary-foreground'
          : 'border-muted-foreground/40 hover:border-primary'
      )}
      aria-label={isSelected ? 'Deselect resume' : 'Select resume'}
    >
      {isSelected && <Check className="w-3 h-3" />}
    </button>
  );

  if (viewMode === 'list') {
    return (
      <AnimatedItem
        variant="fade-up"
        isExiting={isExiting}
        isHighlighted={isHighlighted}
        delay={enterDelay}
        onExitComplete={onExitComplete}
      >
        <div
          className={cn(
            'group flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors first:rounded-t-xl last:rounded-b-xl',
            isSelected && 'bg-primary/5'
          )}
        >
          {selectionMode && selectionCheckbox}
          <div className="w-10 h-12 rounded border overflow-hidden flex-shrink-0 hidden sm:block">
            <ResumeThumbnail resume={resume} />
          </div>
          <Link
            to={`/dashboard/resume/${resume.documentId}/edit`}
            className="flex-1 min-w-0 hover:text-primary transition-colors"
          >
            <p className="font-medium truncate">{resume.title}</p>
            {targetRole && <p className="text-xs text-muted-foreground truncate">{targetRole}</p>}
          </Link>
          <ScoreBadge score={completionScore} />
          <span className="text-sm text-muted-foreground hidden md:block flex-shrink-0 min-w-[72px] text-right">
            {relativeDate}
          </span>
          {!selectionMode && (
            <div className="flex items-center gap-0.5 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              {actionButtons}
            </div>
          )}
        </div>
      </AnimatedItem>
    );
  }

  return (
    <AnimatedItem
      variant="fade-scale"
      isExiting={isExiting}
      isHighlighted={isHighlighted}
      delay={enterDelay}
      onExitComplete={onExitComplete}
      className="rounded-xl"
    >
      <Link to={`/dashboard/resume/${resume.documentId}/edit`} className="group block">
        <Card
          className={cn(
            'h-[300px] hover:scale-[1.02] transition-all hover:shadow-md hover:cursor-pointer hover:border-primary overflow-hidden',
            isSelected && 'ring-2 ring-primary border-primary'
          )}
        >
          <CardContent className="flex flex-col h-full p-0 relative">
            <div className="flex-1 m-3 rounded-lg border overflow-hidden shadow-sm">
              <ResumeThumbnail resume={resume} />
            </div>

            <div className="px-3 pb-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-medium text-sm truncate flex-1">{resume.title}</h2>
                <ScoreBadge score={completionScore} />
              </div>
              {targetRole && (
                <Badge variant="outline" className="text-[10px] font-normal truncate max-w-full">
                  {targetRole}
                </Badge>
              )}
              <p className="text-xs text-muted-foreground">{relativeDate}</p>
            </div>

            {selectionMode ? (
              <div className="absolute top-2 left-2">{selectionCheckbox}</div>
            ) : (
              <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="p-1.5 rounded-md bg-background/90 shadow-sm hover:bg-primary/10 transition-colors"
                  aria-label="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-1.5 rounded-md bg-background/90 shadow-sm hover:bg-coral-rose-100 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </AnimatedItem>
  );
}

export default ResumeItem;
