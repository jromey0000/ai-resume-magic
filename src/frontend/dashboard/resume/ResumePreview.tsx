import { useFormContext } from 'react-hook-form';
import type { ResumeTemplate } from '@/lib/templates';
import ResumePreviewContent from './ResumePreviewContent';

export interface PreviewSectionProps {
  resumeInfo: ResumeInfo;
  template: ResumeTemplate;
}

function ResumePreview() {
  const { watch } = useFormContext<ResumeInfo>();
  const resumeInfo = watch() as ResumeInfo;

  return <ResumePreviewContent resumeInfo={resumeInfo} />;
}

export default ResumePreview;
