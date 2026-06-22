import { getTemplateById } from '@/lib/templates';
import { cn } from '@/lib/utils';
import EducationSection from '../preview/EducationSection';
import ExperienceSection from '../preview/ExperienceSection';
import PersonalDetailPreview from '../preview/PersonalDetailSection';
import SkillsSection from '../preview/SkillsSection';
import SummarySection from '../preview/SummarySection';

interface ResumePreviewContentProps {
  resumeInfo: ResumeInfo;
  id?: string;
  className?: string;
}

function ResumePreviewContent({ resumeInfo, id = 'resume-preview', className }: ResumePreviewContentProps) {
  const template = getTemplateById(resumeInfo?.templateId);
  const themeColor = resumeInfo?.themeColor || template.themeColor;
  const enrichedResumeInfo = { ...resumeInfo, themeColor };

  return (
    <div
      id={id}
      className={cn(
        'bg-white text-gray-900',
        'w-[816px] min-h-[1056px]',
        'px-[72px] py-[56px]',
        'font-["Times_New_Roman",_Georgia,_serif]',
        'text-[11pt] leading-[1.4]',
        'print:shadow-none print:p-0',
        template.preview.accentStyle === 'bar' && 'border-t-[4px]',
        template.preview.accentStyle === 'sidebar' && 'border-l-[4px]',
        template.preview.accentStyle === 'underline' && 'border-t-[2px]',
        template.preview.sectionSpacing === 'compact' && '[&_.section-gap]:my-4',
        template.preview.sectionSpacing === 'normal' && '[&_.section-gap]:my-6',
        template.preview.sectionSpacing === 'relaxed' && '[&_.section-gap]:my-8',
        className
      )}
      style={{ borderColor: themeColor }}
    >
      <div
        className={cn(
          template.preview.headerAlign === 'left' && '[&_.resume-header]:text-left',
          template.preview.headerAlign === 'center' && '[&_.resume-header]:text-center'
        )}
      >
        <PersonalDetailPreview resumeInfo={enrichedResumeInfo} template={template} />
        <SummarySection resumeInfo={enrichedResumeInfo} template={template} />
        <ExperienceSection resumeInfo={enrichedResumeInfo} template={template} />
        <EducationSection resumeInfo={enrichedResumeInfo} template={template} />
        <SkillsSection resumeInfo={enrichedResumeInfo} template={template} />
      </div>
    </div>
  );
}

export default ResumePreviewContent;
