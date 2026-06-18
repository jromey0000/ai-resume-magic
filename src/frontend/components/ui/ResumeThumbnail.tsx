interface ResumeThumbnailProps {
  resume: Resume;
  className?: string;
}

function ResumeThumbnail({ resume, className = '' }: ResumeThumbnailProps) {
  const themeColor = resume.themeColor || '#cb37d8';
  const name = [resume.firstName, resume.lastName].filter(Boolean).join(' ') || 'Your Name';
  const hasContent = Boolean(resume.firstName || resume.summary || resume.experience?.length);

  return (
    <div
      className={`w-full h-full bg-white dark:bg-cod-gray-900 overflow-hidden ${className}`}
      style={{ borderTop: `3px solid ${themeColor}` }}
    >
      {hasContent ? (
        <div className="p-2.5 h-full flex flex-col text-[5px] leading-[1.3] text-cod-gray-800 dark:text-cod-gray-200">
          <div className="text-center mb-1.5">
            <div className="font-bold text-[7px]" style={{ color: themeColor }}>
              {name}
            </div>
            {resume.jobTitle && (
              <div className="text-[5px] text-cod-gray-600 dark:text-cod-gray-400 mt-0.5">
                {resume.jobTitle}
              </div>
            )}
          </div>

          {resume.summary && (
            <div className="mb-1.5">
              <div className="font-semibold text-[5px] mb-0.5" style={{ color: themeColor }}>
                SUMMARY
              </div>
              <div className="line-clamp-3 text-cod-gray-600 dark:text-cod-gray-400">
                {resume.summary}
              </div>
            </div>
          )}

          {resume.experience && resume.experience.length > 0 && (
            <div className="flex-1 min-h-0">
              <div className="font-semibold text-[5px] mb-0.5" style={{ color: themeColor }}>
                EXPERIENCE
              </div>
              <div className="font-medium text-[5px]">{resume.experience[0].title}</div>
              <div className="text-cod-gray-500 line-clamp-2">
                {resume.experience[0].companyName}
              </div>
            </div>
          )}

          {resume.skills && resume.skills.length > 0 && (
            <div className="flex flex-wrap gap-0.5 mt-auto pt-1">
              {resume.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill.id ?? skill.name}
                  className="px-1 py-0.5 rounded text-[4px] bg-cod-gray-100 dark:bg-cod-gray-800"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-[8px] text-muted-foreground">
          Empty resume
        </div>
      )}
    </div>
  );
}

export default ResumeThumbnail;
