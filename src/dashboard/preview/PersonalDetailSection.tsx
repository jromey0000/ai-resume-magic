interface PersonalDetailSectionProps {
  resumeInfo: ResumeInfo | null;
}

function PersonalDetailPreview({ resumeInfo }: PersonalDetailSectionProps) {
  const themeColor = resumeInfo?.themeColor;
  return (
    <div className="mb-6">
      <h2
        className="font-bold text-xl text-center"
        style={{ color: themeColor }}>
        {resumeInfo?.firstName} {resumeInfo?.lastName}
      </h2>
      <h2 className="text-center text-sm font-medium">
        {resumeInfo?.jobTitle}
      </h2>
      <h2
        className="text-center font-normal text-xs mb-3"
        style={{ color: themeColor }}>
        {resumeInfo?.address}
      </h2>

      <div className="flex justify-between">
        {[resumeInfo?.phone, resumeInfo?.email].map((item, index) => (
          <h2
            key={index}
            className="font-bold text-xs"
            style={{ color: themeColor }}>
            {item}
          </h2>
        ))}
      </div>
      <hr className="border-[1px] my-2" style={{ color: themeColor }} />
    </div>
  );
}

export default PersonalDetailPreview;
