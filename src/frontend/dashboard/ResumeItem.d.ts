interface ResumeItemProps {
  resume: Resume;
  viewMode?: 'gallery' | 'list';
  onDelete?: (resume: Resume) => void;
  onDuplicate?: (resume: Resume) => void;
  isExiting?: boolean;
  isHighlighted?: boolean;
  enterDelay?: number;
  onExitComplete?: () => void;
}
declare function ResumeItem({
  resume,
  viewMode,
  onDelete,
  onDuplicate,
  isExiting,
  isHighlighted,
  enterDelay,
  onExitComplete,
}: ResumeItemProps): import('react').JSX.Element;
export default ResumeItem;
