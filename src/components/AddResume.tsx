import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { useUser } from '@clerk/clerk-react';
import { PlusSquare } from 'lucide-react';
import { CreateNewResume } from '@/services/GlobalApi';

import { useNotification } from '@/utils/hooks';

import AddResumeModal from './AddResumeModal';

function AddResume() {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');

  const { user } = useUser();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResumeTitle(event.target.value);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const showNotifiction = () => {
    addNotification({
      title: 'Succesfully created resume',
      message: '',
    });
  };

  const handleCreateResume = async () => {
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
        const { documentId } = response.data.data;

        setIsLoading(false);
        showNotifiction();
        navigate(`/dashboard/resume/${documentId}/edit`);
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

    handleCloseModal();
  };

  return (
    <div>
      <div
        className="p-14 py-24 border-dashed border-2 border-cod-gray-300 items-center flex justify-center rounded-lg h-[280px] bg-cod-gray-100 hover:bg-cod-gray-200 dark:bg-cod-gray-900 dark:hover:bg-cod-gray-800 hover:scale-105 transition-all hover:shadow-md cursor-pointer"
        onClick={handleOpenModal}>
        <PlusSquare />
      </div>
      <AddResumeModal
        isLoading={isLoading}
        onChange={handleChange}
        onClose={handleCloseModal}
        onCreateResume={handleCreateResume}
        resumeTitle={resumeTitle}
        showModal={openModal}
      />
    </div>
  );
}

export default AddResume;
