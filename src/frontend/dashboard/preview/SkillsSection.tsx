import { Wrench } from 'lucide-react';
import type { ResumeTemplate } from '@/lib/templates';
import { cn } from '@/lib/utils';

interface SkillsSectionProps {
  resumeInfo: ResumeInfo;
  template: ResumeTemplate;
}

function SkillsSection({ resumeInfo, template }: SkillsSectionProps) {
  const hasSkills = resumeInfo?.skills && resumeInfo.skills.length > 0;
  const { sectionHeaderAlign, sectionDivider, skillsLayout } = template.preview;
  const themeColor = resumeInfo?.themeColor;

  if (!hasSkills) {
    return (
      <div className="section-gap py-6 border-2 border-dashed border-gray-200 rounded-lg">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <Wrench className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-xs text-gray-400 font-medium">Skills</p>
          <p className="text-[10px] text-gray-300">Showcase your abilities</p>
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
        Skills
      </h2>
      {sectionDivider === 'line' && <hr className="mb-3" style={{ borderColor: themeColor }} />}
      {sectionDivider === 'double-line' && (
        <div className="mb-3 space-y-0.5">
          <hr style={{ borderColor: themeColor }} />
          <hr style={{ borderColor: themeColor }} />
        </div>
      )}

      {skillsLayout === 'bars' && (
        <div className="grid grid-cols-2 gap-3 my-4">
          {resumeInfo?.skills?.map((skill) => (
            <div key={skill?.id} className="flex items-center justify-between">
              <h3 className="text-xs">{skill?.name}</h3>
              <div className="h-2 bg-gray-200 w-[120px]">
                <div
                  className="h-2"
                  style={{
                    backgroundColor: themeColor,
                    width: `${skill?.rating}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {skillsLayout === 'tags' && (
        <div className="flex flex-wrap gap-2 my-4">
          {resumeInfo?.skills?.map((skill) => (
            <span
              key={skill?.id}
              className="px-2.5 py-1 text-xs rounded-full border"
              style={{
                borderColor: themeColor,
                color: themeColor,
                backgroundColor: `${themeColor}10`,
              }}
            >
              {skill?.name}
            </span>
          ))}
        </div>
      )}

      {skillsLayout === 'list' && (
        <div className="my-4">
          <p className="text-xs leading-relaxed">
            {resumeInfo?.skills?.map((skill, index) => (
              <span key={skill?.id}>
                {skill?.name}
                {index < (resumeInfo.skills?.length || 0) - 1 && (
                  <span className="mx-1.5" style={{ color: themeColor }}>
                    •
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}

export default SkillsSection;
