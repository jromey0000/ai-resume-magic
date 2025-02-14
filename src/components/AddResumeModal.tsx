import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

import { Loader2 } from 'lucide-react';

interface AddResumeModalProps {
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onCreateResume: () => void;
  resumeTitle: string;
  showModal: boolean;
}

function AddResumeModal({
  isLoading,
  onChange,
  onClose,
  onCreateResume,
  resumeTitle,
  showModal,
}: AddResumeModalProps) {
  return (
    <div>
      <Modal
        isOpen={showModal}
        onClose={onClose}
        title="Add Resume"
        buttons={[
          {
            label: 'Cancel',
            onClick: () => onClose(),
            variant: 'ghost',
          },
          {
            label: isLoading ? <Loader2 className="animate-spin" /> : 'Create',
            onClick: () => onCreateResume(),
            variant: 'primary',
            disabled: !resumeTitle || isLoading,
          },
        ]}>
        <p>Add a title for your new resume</p>
        <Input
          placeholder="Ex. Full Stack Developer Resume"
          value={resumeTitle}
          onChange={(e) => onChange(e)}
          maxLength={50}
          autoFocus
        />
      </Modal>
    </div>
  );
}

export default AddResumeModal;
