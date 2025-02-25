import { formatDate } from '@/lib/utils/date';

interface ExperienceSectionProps {
  resumeInfo: ResumeInfo | null;
}

function ExperienceSection({ resumeInfo }: ExperienceSectionProps) {
  return (
    <div className="my-6">
      <h2
        className="text-center text-sm font-bold mb-1"
        style={{ color: resumeInfo?.themeColor }}>
        Professional Experience
      </h2>
      <hr className="mb-3" style={{ borderColor: resumeInfo?.themeColor }} />
      {resumeInfo?.experience?.map((experience) => (
        <div key={experience?.id} className="my-4">
          <h3
            className="text-sm font-bold"
            style={{ color: resumeInfo?.themeColor }}>
            {experience?.title}
          </h3>
          <h3 className="text-xs font-medium flex justify-between mb-2">
            {experience?.companyName}, {experience?.city} {experience?.state}
            <span className="text-xs font-normal ml-2">
              {formatDate(experience?.startDate, 'en-US', {
                month: 'short',
              })}{' '}
              -
              {experience?.currentlyWorking
                ? 'Present'
                : formatDate(experience?.endDate, 'en-US', {
                    month: 'short',
                  })}
            </span>
          </h3>
          <p className="text-xs">{experience.workSummary}</p>
        </div>
      ))}
    </div>
  );
}

export default ExperienceSection;
