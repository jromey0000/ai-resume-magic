import AddResume from '@/components/AddResume';
import { useUser } from '@clerk/clerk-react';
import { useGetUserResumes } from '@/lib/hooks/resume';
import ResumeItem from './ResumeItem';

function Dashboard() {
  const { user } = useUser();
  const {
    data: resumeList,
    error,
    isLoading,
  } = useGetUserResumes(user?.primaryEmailAddress?.emailAddress as string);

  if (isLoading)
    return (
      <div className="text-primary p-4 text-center">Loading resumes...</div>
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
