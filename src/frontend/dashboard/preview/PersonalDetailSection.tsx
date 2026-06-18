interface PersonalDetailSectionProps {
  resumeInfo: ResumeInfo | null;
}

function PersonalDetailPreview({ resumeInfo }: PersonalDetailSectionProps) {
  const themeColor = resumeInfo?.themeColor;
  return (
    <div className="mb-6 resume-header">
      <h2 className="font-bold text-xl" style={{ color: themeColor }}>
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h2>
      <h2 className="text-sm font-medium">{resumeInfo?.jobTitle}</h2>
      <h2 className="font-normal text-xs mb-3" style={{ color: themeColor }}>
        {resumeInfo?.address}
      </h2>

      <div className="flex justify-between">
        {resumeInfo?.phone ? (
          <h2 className="font-bold text-xs" style={{ color: themeColor }}>
            {resumeInfo.phone}
          </h2>
        ) : null}
        {resumeInfo?.email ? (
          <h2 className="font-bold text-xs" style={{ color: themeColor }}>
            {resumeInfo.email}
          </h2>
        ) : null}
      </div>
      <hr className="border-[1px] my-2" style={{ color: themeColor }} />
    </div>
  );
}

export default PersonalDetailPreview;
