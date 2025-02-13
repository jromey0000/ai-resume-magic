import { useEffect, useState } from 'react';
import AddResume from '@/components/AddResume';
import { useUser } from '@clerk/clerk-react';
import { GetUserResumes } from '@/services/GlobalApi';
import ResumeItem from './ResumeItem';

function Dashboard() {
  const [resumeList, setResumeList] = useState([]);
  const { user } = useUser();

  const getResumeList = async () => {
    try {
      const response = await GetUserResumes(
        user?.primaryEmailAddress?.emailAddress as string
      );

      if (response) {
        const data = await response.data.data;
        setResumeList(data);
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error(String(err));
      }
    }
  };

  useEffect(() => {
    if (user) getResumeList();
  }, [user]);

  return (
    <div className="p-10 md:px-15 lg:px-20">
      <h2 className="font-light text-4xl mb-4">My Resume</h2>
      <p>Start creating your AI resume.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-10">
        <AddResume />
        {resumeList?.map((resume, index) => (
          <ResumeItem key={index} resume={resume} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
