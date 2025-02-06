import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CreateNewResume } from '@/services/GlobalApi';
import { useUser } from '@clerk/clerk-react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useNotification } from '@/utils/hooks';
import { UserResume } from '@/types';
import { Loader2 } from 'lucide-react';

interface AddResumeModalProps {
  showModal: boolean;
  onClose: () => void;
}

function AddResumeModal({ showModal, onClose }: AddResumeModalProps) {
  const [resumeTitle, setResumeTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();
  const { addNotification } = useNotification();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResumeTitle(event.target.value);
  };

  const showNotifiction = () => {
    addNotification({
      title: 'Succesfully created resume title',
      message: '',
      onViewMore: () => console.log('View more clicked'),
    });
  };

  const onCreate = async () => {
    setIsLoading(true);
    const uuid = uuidv4();
    const data: UserResume = {
      data: {
        title: resumeTitle,
        resumeId: uuid,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
      },
    };

    try {
      const response = await CreateNewResume(data);
      if (response) {
        setIsLoading(false);
        showNotifiction();
      } else {
        setIsLoading(false);
        // throw a toast message for error
        showNotifiction();
      }
    } catch (err) {
      setIsLoading(false);
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error(String(err));
      }
    }

    onClose();
  };

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
            onClick: () => onCreate(),
            variant: 'primary',
            disabled: !resumeTitle || isLoading,
          },
        ]}>
        <p>Add a title for your new resume</p>
        <Input
          placeholder="Ex. Full Stack Developer Resume"
          value={resumeTitle}
          onChange={(e) => handleChange(e)}
          maxLength={50}
          autoFocus
        />
      </Modal>
    </div>
  );
}

export default AddResumeModal;
