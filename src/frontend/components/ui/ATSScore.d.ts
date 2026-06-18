interface ATSScoreProps {
  score: number;
  keywordsFound: number;
  keywordsTotal: number;
  skillsMatched: number;
  skillsTotal: number;
  isAnalyzing?: boolean;
}
export default function ATSScore({
  score,
  keywordsFound,
  keywordsTotal,
  skillsMatched,
  skillsTotal,
  isAnalyzing,
}: ATSScoreProps): import('react').JSX.Element;
