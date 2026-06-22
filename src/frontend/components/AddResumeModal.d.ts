interface AddResumeModalProps {
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onCreateResume: () => void;
  resumeTitle: string;
  showModal: boolean;
}
declare function AddResumeModal({
  isLoading,
  onChange,
  onClose,
  onCreateResume,
  resumeTitle,
  showModal,
}: AddResumeModalProps): import('react').JSX.Element;
export default AddResumeModal;
