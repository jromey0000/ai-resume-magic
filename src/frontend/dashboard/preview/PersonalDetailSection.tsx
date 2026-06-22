import { User } from 'lucide-react';
import type { ResumeTemplate } from '@/lib/templates';
import { cn } from '@/lib/utils';

interface PersonalDetailSectionProps {
  resumeInfo: ResumeInfo;
  template: ResumeTemplate;
}

function PersonalDetailPreview({ resumeInfo, template }: PersonalDetailSectionProps) {
  const themeColor = resumeInfo?.themeColor;
  const hasName = resumeInfo?.firstName || resumeInfo?.lastName;
  const hasContact = resumeInfo?.email || resumeInfo?.phone;
  const { headerAlign, contactLayout, nameSize, sectionDivider } = template.preview;

  if (!hasName && !hasContact) {
    return (
      <div className="mb-6 py-8 border-2 border-dashed border-gray-200 rounded-lg resume-header">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <User className="w-10 h-10 text-gray-300 mb-2" />
          <p className="text-sm text-gray-400 font-medium">Your Name</p>
          <p className="text-xs text-gray-300">Add your personal details</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('mb-6 resume-header', headerAlign === 'center' && 'text-center')}>
      <h2
        className={cn('font-bold', nameSize === 'xlarge' ? 'text-2xl' : 'text-xl')}
        style={{ color: themeColor }}
      >
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h2>
      {resumeInfo?.jobTitle && <h2 className="text-sm font-medium">{resumeInfo.jobTitle}</h2>}
      {resumeInfo?.address && (
        <h2 className="font-normal text-xs mb-3" style={{ color: themeColor }}>
          {resumeInfo.address}
        </h2>
      )}

      {hasContact && (
        <div
          className={cn(
            'flex flex-wrap gap-2',
            contactLayout === 'row' && 'justify-between',
            contactLayout === 'centered' && 'justify-center gap-4',
            contactLayout === 'columns' && 'flex-col gap-1'
          )}
        >
          {resumeInfo?.phone && (
            <span
              className={cn('font-bold text-xs', contactLayout === 'centered' && 'font-normal')}
              style={{ color: themeColor }}
            >
              {resumeInfo.phone}
            </span>
          )}
          {resumeInfo?.email && (
            <span
              className={cn('font-bold text-xs', contactLayout === 'centered' && 'font-normal')}
              style={{ color: themeColor }}
            >
              {resumeInfo.email}
            </span>
          )}
        </div>
      )}
      {sectionDivider === 'line' && (
        <hr className="border-[1px] my-2" style={{ borderColor: themeColor }} />
      )}
      {sectionDivider === 'double-line' && (
        <div className="my-2 space-y-0.5">
          <hr className="border-[1px]" style={{ borderColor: themeColor }} />
          <hr className="border-[1px]" style={{ borderColor: themeColor }} />
        </div>
      )}
    </div>
  );
}

export default PersonalDetailPreview;
