import { useContext } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import PersonalDetailPreview from '../preview/PersonalDetailSection';
import SummarySection from '../preview/SummarySection';
import ExperienceSection from '../preview/ExperienceSection';
import EducationSection from '../preview/EducationSection';
import SkillsSection from '../preview/SkillsSection';

function ResumePreview() {
  const { resumeInfo } = useContext(ResumeInfoContext);

  return (
    <div
      className="shadow-lg h-full p-8 border-t-[4px] border-colorVariants[resumeInfo?.themeColor]"
      style={{ borderColor: resumeInfo?.themeColor }}>
      {/* Personal Information */}
      <PersonalDetailPreview resumeInfo={resumeInfo} />
      {/* Summary */}
      <SummarySection resumeInfo={resumeInfo} />
      {/* Work Experience */}
      <ExperienceSection resumeInfo={resumeInfo} />
      {/* Education */}
      <EducationSection resumeInfo={resumeInfo} />
      {/* Skills */}
      <SkillsSection resumeInfo={resumeInfo} />
    </div>
  );
}

export default ResumePreview;
