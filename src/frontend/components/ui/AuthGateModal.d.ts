interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}
declare function AuthGateModal({
  isOpen,
  onClose,
  title,
  message,
}: AuthGateModalProps): import('react').JSX.Element | null;
export default AuthGateModal;
