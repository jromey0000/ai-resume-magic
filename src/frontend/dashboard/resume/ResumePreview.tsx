import { useFormContext } from 'react-hook-form';
import { getTemplateById } from '@/lib/templates';
import { cn } from '@/lib/utils';
import EducationSection from '../preview/EducationSection';
import ExperienceSection from '../preview/ExperienceSection';
import PersonalDetailPreview from '../preview/PersonalDetailSection';
import SkillsSection from '../preview/SkillsSection';
import SummarySection from '../preview/SummarySection';

function ResumePreview() {
  const { watch } = useFormContext<ResumeInfo>();
  const resumeInfo = watch() as ResumeInfo;
  const template = getTemplateById(resumeInfo?.templateId);
  const themeColor = resumeInfo?.themeColor || template.themeColor;

  return (
    <div
      id="resume-preview"
      className={cn(
        'shadow-lg h-full p-8 bg-white dark:bg-cod-gray-900',
        template.preview.accentStyle === 'bar' && 'border-t-[4px]',
        template.preview.accentStyle === 'sidebar' && 'border-l-[4px]',
        template.preview.accentStyle === 'underline' && 'border-t-[2px]'
      )}
      style={{ borderColor: themeColor }}
    >
      <div
        className={cn(
          template.preview.headerAlign === 'left' && '[&_.resume-header]:text-left',
          template.preview.headerAlign === 'center' && '[&_.resume-header]:text-center'
        )}
      >
        <PersonalDetailPreview resumeInfo={{ ...resumeInfo, themeColor }} />
        <SummarySection resumeInfo={{ ...resumeInfo, themeColor }} />
        <ExperienceSection resumeInfo={{ ...resumeInfo, themeColor }} />
        <EducationSection resumeInfo={{ ...resumeInfo, themeColor }} />
        <SkillsSection resumeInfo={{ ...resumeInfo, themeColor }} />
      </div>
    </div>
  );
}

export default ResumePreview;
