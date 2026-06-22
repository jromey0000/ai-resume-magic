import { Briefcase } from 'lucide-react';
import type { ResumeTemplate } from '@/lib/templates';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils/date';

interface ExperienceSectionProps {
  resumeInfo: ResumeInfo;
  template: ResumeTemplate;
}

function ExperienceSection({ resumeInfo, template }: ExperienceSectionProps) {
  const hasExperience = resumeInfo?.experience && resumeInfo.experience.length > 0;
  const { sectionHeaderAlign, sectionDivider, datePosition } = template.preview;
  const themeColor = resumeInfo?.themeColor;

  if (!hasExperience) {
    return (
      <div className="section-gap py-6 border-2 border-dashed border-gray-200 rounded-lg">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <Briefcase className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-xs text-gray-400 font-medium">Work Experience</p>
          <p className="text-[10px] text-gray-300">Add your professional history</p>
        </div>
      </div>
    );
  }

  const formatDateRange = (experience: Experience) => {
    const start = formatDate(experience?.startDate, 'en-US', { month: 'short' });
    if (!start) return null;
    const end = experience?.currentlyWorking
      ? 'Present'
      : formatDate(experience?.endDate, 'en-US', { month: 'short' });
    return end ? `${start} - ${end}` : start;
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
        Professional Experience
      </h2>
      {sectionDivider === 'line' && <hr className="mb-3" style={{ borderColor: themeColor }} />}
      {sectionDivider === 'double-line' && (
        <div className="mb-3 space-y-0.5">
          <hr style={{ borderColor: themeColor }} />
          <hr style={{ borderColor: themeColor }} />
        </div>
      )}
      {resumeInfo?.experience?.map((experience) => (
        <div key={experience?.id} className="my-4">
          <div
            className={cn(
              datePosition === 'right' && 'flex justify-between items-baseline',
              datePosition === 'inline' && 'flex items-baseline gap-2'
            )}
          >
            <h3 className="text-sm font-bold" style={{ color: themeColor }}>
              {experience?.title}
            </h3>
            {datePosition === 'right' && (
              <span className="text-xs font-normal text-gray-600 shrink-0">
                {formatDateRange(experience)}
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
              {experience?.companyName}
              {(experience?.city || experience?.state) && ', '}
              {experience?.city} {experience?.state}
            </span>
            {datePosition === 'inline' && (
              <span className="text-xs font-normal ml-2">{formatDateRange(experience)}</span>
            )}
          </div>
          {datePosition === 'below' && (
            <p className="text-xs text-gray-500 mb-1">{formatDateRange(experience)}</p>
          )}
          <p className="text-xs">{experience.workSummary}</p>
        </div>
      ))}
    </div>
  );
}

export default ExperienceSection;
