import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useTier } from '@/lib/contexts/TierContext';
import { useGetUserResumes } from '@/lib/hooks/resume';

export function useSyncResumeUsage() {
  const { isLoaded, user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const { data: resumeList, isLoading } = useGetUserResumes(isLoaded ? userEmail : undefined);
  const { syncResumeCount } = useTier();

  useEffect(() => {
    if (!isLoaded || !userEmail || isLoading) return;
    syncResumeCount(resumeList.length);
  }, [isLoaded, userEmail, isLoading, resumeList.length, syncResumeCount]);
}
