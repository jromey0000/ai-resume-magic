interface JobMatchingProps {
  onEnabledNext: (val: boolean) => void;
  initialJobDescription?: string;
}
declare function JobMatching({
  onEnabledNext,
  initialJobDescription,
}: JobMatchingProps): import('react').JSX.Element;
export default JobMatching;
