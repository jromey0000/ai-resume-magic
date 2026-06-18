interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function UpgradeModal({
  isOpen,
  onClose,
}: UpgradeModalProps): import('react').JSX.Element | null;
