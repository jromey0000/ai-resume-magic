import { FileText } from 'lucide-react';
import type { ResumeTemplate } from '@/lib/templates';
import { cn } from '@/lib/utils';

interface SummarySectionProps {
  resumeInfo: ResumeInfo;
  template: ResumeTemplate;
}

function SummarySection({ resumeInfo, template }: SummarySectionProps) {
  const hasSummary = resumeInfo?.summary && resumeInfo.summary.trim().length > 0;
  const { sectionHeaderAlign, sectionDivider } = template.preview;
  const themeColor = resumeInfo?.themeColor;

  if (!hasSummary) {
    return (
      <div className="section-gap py-4 border-2 border-dashed border-gray-200 rounded-lg">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <FileText className="w-6 h-6 text-gray-300 mb-1" />
          <p className="text-xs text-gray-400 font-medium">Professional Summary</p>
          <p className="text-[10px] text-gray-300">Write a compelling introduction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-gap">
      <h2
        className={cn(
          'text-sm font-bold mb-1',
          sectionHeaderAlign === 'center' && 'text-center',
          sectionHeaderAlign === 'left' && 'text-left'
        )}
        style={{ color: themeColor }}
      >
        Summary
      </h2>
      {sectionDivider === 'line' && (
        <hr className="mb-2" style={{ borderColor: themeColor }} />
      )}
      {sectionDivider === 'double-line' && (
        <div className="mb-2 space-y-0.5">
          <hr style={{ borderColor: themeColor }} />
          <hr style={{ borderColor: themeColor }} />
        </div>
      )}
      <p className="text-xs whitespace-pre-wrap">{resumeInfo?.summary}</p>
    </div>
  );
}

export default SummarySection;
