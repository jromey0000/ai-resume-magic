import { GraduationCap } from 'lucide-react';
import type { ResumeTemplate } from '@/lib/templates';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils/date';

interface EducationSectionProps {
  resumeInfo: ResumeInfo;
  template: ResumeTemplate;
}

function EducationSection({ resumeInfo, template }: EducationSectionProps) {
  const hasEducation = resumeInfo?.education && resumeInfo.education.length > 0;
  const { sectionHeaderAlign, sectionDivider, datePosition } = template.preview;
  const themeColor = resumeInfo?.themeColor;

  if (!hasEducation) {
    return (
      <div className="section-gap py-6 border-2 border-dashed border-gray-200 rounded-lg">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <GraduationCap className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-xs text-gray-400 font-medium">Education</p>
          <p className="text-[10px] text-gray-300">Add your academic background</p>
        </div>
      </div>
    );
  }

  const formatDateRange = (education: Education) => {
    const start = formatDate(education?.startDate, 'en-US', { month: 'short' });
    const end = formatDate(education?.endDate, 'en-US', { month: 'short' });
    if (!start && !end) return null;
    if (start && end) return `${start} - ${end}`;
    return start || end;
  };

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
        Education
      </h2>
      {sectionDivider === 'line' && <hr className="mb-3" style={{ borderColor: themeColor }} />}
      {sectionDivider === 'double-line' && (
        <div className="mb-3 space-y-0.5">
          <hr style={{ borderColor: themeColor }} />
          <hr style={{ borderColor: themeColor }} />
        </div>
      )}
      {resumeInfo?.education?.map((education) => (
        <div key={education?.id} className="my-4">
          <div
            className={cn(
              datePosition === 'right' && 'flex justify-between items-baseline',
              datePosition === 'inline' && 'flex items-baseline gap-2'
            )}
          >
            <h3 className="text-sm font-bold" style={{ color: themeColor }}>
              {education?.school}
            </h3>
            {datePosition === 'right' && (
              <span className="text-xs font-normal text-gray-600 shrink-0">
                {formatDateRange(education)}
              </span>
            )}
          </div>
          <div
            className={cn(
              'text-xs font-medium mb-2',
              datePosition === 'inline' && 'flex justify-between'
            )}
          >
            <span>
              {education?.degree}
              {education?.major && ` in ${education.major}`}
            </span>
            {datePosition === 'inline' && (
              <span className="text-xs font-normal ml-2">{formatDateRange(education)}</span>
            )}
          </div>
          {datePosition === 'below' && (
            <p className="text-xs text-gray-500 mb-1">{formatDateRange(education)}</p>
          )}
          {education?.description && <p className="text-xs">{education.description}</p>}
        </div>
      ))}
    </div>
  );
}

export default EducationSection;
