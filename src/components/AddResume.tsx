import { useState } from 'react';
import { PlusSquare } from 'lucide-react';
import AddResumeModal from './AddResumeModal';

function AddResume() {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <div
        className="p-14 py-24 border-dashed border-2 border-cod-gray-300 items-center flex justify-center rounded-lg h-[280px] bg-cod-gray-100 hover:bg-cod-gray-200 dark:bg-cod-gray-900 dark:hover:bg-cod-gray-800 hover:scale-105 transition-all hover:shadow-md cursor-pointer"
        onClick={handleOpenModal}>
        <PlusSquare />
      </div>
      <AddResumeModal showModal={openModal} onClose={handleCloseModal} />
    </div>
  );
}

export default AddResume;
