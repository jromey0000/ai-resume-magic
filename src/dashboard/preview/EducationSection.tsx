import { formatDate } from '@/lib/utils/date';

interface EducationSectionProps {
  resumeInfo: ResumeInfo | null;
}

function EducationSection({ resumeInfo }: EducationSectionProps) {
  return (
    <div>
      <h2
        className="text-center text-sm font-bold mb-1"
        style={{ color: resumeInfo?.themeColor }}>
        Education
      </h2>
      <hr className="mb-3" style={{ borderColor: resumeInfo?.themeColor }} />
      {resumeInfo?.education.map((education) => (
        <div key={education?.id} className="my-4">
          <h3
            className="text-sm font-bold"
            style={{ color: resumeInfo?.themeColor }}>
            {education?.school}
          </h3>
          <h3 className="text-xs font-medium flex justify-between mb-2">
            {education?.degree} in {education?.major}
            <span>
              {formatDate(education?.startDate, 'en-US', {
                month: 'short',
              })}{' '}
              -{' '}
              {formatDate(education?.endDate, 'en-US', {
                month: 'short',
              })}
            </span>
          </h3>
          <p className="text-xs">{education?.description}</p>
        </div>
      ))}
    </div>
  );
}

export default EducationSection;
