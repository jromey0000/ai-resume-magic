import AddResume from '@/components/AddResume';
import { useUser } from '@clerk/clerk-react';
import { useGetUserResumes } from '@/lib/hooks/resume';
import { Loader2 } from 'lucide-react';
import ResumeItem from './ResumeItem';

function Dashboard() {
  const { user } = useUser();
  const {
    data: resumeList,
    error,
    isLoading,
  } = useGetUserResumes(user?.primaryEmailAddress?.emailAddress as string);

  if (isLoading)
    return isLoading ? (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-[45px] w-[45px]" />
      </div>
    ) : (
      'Loading resumes...'
    );
  if (error) return <div>Error loading resumes: {error.message}</div>;

  return (
    <div className="p-10 md:px-15 lg:px-20">
      <h2 className="font-light text-4xl mb-4">My Resume</h2>
      <p>Start creating your AI resume.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-10">
        <AddResume />
        {resumeList?.map((resume: Resume, index: number) => (
          <ResumeItem key={index} resume={resume} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
