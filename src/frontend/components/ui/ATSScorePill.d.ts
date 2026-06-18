interface ATSScorePillProps {
  score: number;
  isAnalyzing?: boolean;
  onClick?: () => void;
}
export default function ATSScorePill({
  score,
  isAnalyzing,
  onClick,
}: ATSScorePillProps): import('react').JSX.Element;
