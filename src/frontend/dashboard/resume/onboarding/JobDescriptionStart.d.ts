interface JobDescriptionStartProps {
  onContinue: (jobDescription: string, jobTitle: string) => void;
  onBack: () => void;
  isLoading: boolean;
}
declare function JobDescriptionStart({
  onContinue,
  onBack,
  isLoading,
}: JobDescriptionStartProps): import('react').JSX.Element;
export default JobDescriptionStart;
