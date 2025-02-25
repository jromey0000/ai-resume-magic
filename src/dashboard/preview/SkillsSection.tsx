interface SkillsSectionProps {
  resumeInfo: ResumeInfo | null;
}

function SkillsSection({ resumeInfo }: SkillsSectionProps) {
  return (
    <div>
      <h2
        className="text-center text-sm font-bold mb-1"
        style={{ color: resumeInfo?.themeColor }}>
        Skills
      </h2>
      <hr className="mb-3" style={{ borderColor: resumeInfo?.themeColor }} />
      <div className="grid grid-cols-2 gap-3 my-4">
        {resumeInfo?.skills?.map((skill) => (
          <div key={skill?.id} className="flex items-center justify-between">
            <h3 className="text-xs">{skill?.name}</h3>
            <div className="h-2 bg-cod-gray-200 dark:bg-cod-gray-500 w-[120px]">
              <div
                className="h-2"
                style={{
                  backgroundColor: resumeInfo?.themeColor,
                  width: `${skill?.rating}%`,
                }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsSection;
