import { Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEditorContext } from '@/lib/contexts/EditorContext';
import { generateOptimizedSummary } from '@/lib/services/ai';
import { cn } from '@/lib/utils';
import { useNotification } from '@/lib/utils/hooks';

interface SummaryProps {
  onEnabledNext: (val: boolean) => void;
}

function Summary({ onEnabledNext }: SummaryProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<ResumeInfo>();

  const { jobDescription, jobTitle } = useEditorContext();
  const { addNotification } = useNotification();

  const summary = watch('summary') || '';
  const charCount = summary.length;

  const handleAiSuggest = async () => {
    setIsGenerating(true);
    try {
      const resumeData = getValues();
      const generated = await generateOptimizedSummary(
        resumeData,
        jobDescription || 'General professional role',
        jobTitle || resumeData.jobTitle
      );
      if (generated) {
        setValue('summary', generated, { shouldDirty: true });
        onEnabledNext(true);
        addNotification({
          title: 'Summary generated',
          message: jobDescription
            ? 'AI tailored your summary to the job description.'
            : 'AI generated a professional summary. Add a job description for better targeting.',
        });
      }
    } catch (err) {
      console.error('Failed to generate summary:', err);
      addNotification({
        title: 'Generation failed',
        message: 'Could not generate summary. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Write a compelling summary that highlights your key qualifications and career goals.
      </p>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="summary">Professional Summary</Label>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-xs h-7"
            onClick={handleAiSuggest}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
            AI Suggest
          </Button>
        </div>
        <Textarea
          id="summary"
          className={cn(
            'min-h-[180px] resize-y',
            errors?.summary && 'border-destructive focus-visible:ring-destructive'
          )}
          {...register('summary', {
            minLength: {
              value: 50,
              message: 'Summary should be at least 50 characters for best results',
            },
            maxLength: {
              value: 500,
              message: 'Summary should not exceed 500 characters',
            },
          })}
          placeholder="Results-driven professional with X years of experience in [industry]. Proven track record of [key achievement]. Skilled in [top skills]. Seeking to leverage my expertise to [goal] at [target company/role type]..."
        />
        <div className="flex justify-between items-center">
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className={charCount >= 50 ? 'text-teal-600 dark:text-teal-400' : ''}>
              {charCount}/500 characters
            </span>
            {charCount > 0 && charCount < 50 && (
              <span className="text-amber-500">Add {50 - charCount} more for better results</span>
            )}
          </div>
          {errors?.summary?.message && (
            <p className="text-xs text-destructive">{errors.summary.message}</p>
          )}
        </div>
      </div>

      <Card className="border-picton-blue-200 dark:border-picton-blue-800 bg-picton-blue-50 dark:bg-picton-blue-900/20">
        <CardContent className="pt-4">
          <h4 className="text-sm font-medium text-picton-blue-800 dark:text-picton-blue-200 mb-2">
            Tips for a great summary:
          </h4>
          <ul className="text-xs text-picton-blue-700 dark:text-picton-blue-300 space-y-1">
            <li>• Start with your professional title and years of experience</li>
            <li>• Include 2-3 key accomplishments or skills</li>
            <li>• Mention the value you bring to employers</li>
            <li>• Keep it concise—3-4 sentences is ideal</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default Summary;
