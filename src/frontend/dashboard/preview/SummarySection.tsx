interface SummarySectionProps {
  resumeInfo: ResumeInfo | null;
}

function SummarySection({ resumeInfo }: SummarySectionProps) {
  return (
    <div>
      <p className="text-xs mb-4">{resumeInfo?.summary}</p>
    </div>
  );
}

export default SummarySection;
