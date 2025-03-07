import useSWR, { mutate } from 'swr';
import { fetcher } from '@/lib/utils/api';

export const useCreateNewResume = () => {
  const { data, error } = useSWR('/user-resumes', fetcher);

  // create a new resume
  const createNewResume = async (resumeData: UserResume) => {
    try {
      const response = await fetcher('/user-resumes', 'POST', resumeData);

      // Update local SWR cache (optimistically)
      mutate('/user-resumes', response, false);

      return response;
    } catch (err) {
      console.error('Failed to create resume:', err);
      throw err;
    }
  };

  return { createNewResume, data, error };
};

export const useGetUserResumes = (userEmail: string) => {
  const dataKey = `/user-resumes?filters[userEmail][$eq]=${userEmail}`;
  const getFetcher = () => fetcher(dataKey, 'GET');
  const { data, error, isLoading } = useSWR(dataKey, getFetcher);

  return {
    data: data?.data || [],
    error,
    isLoading,
  };
};

export const useGetUserResume = (id: string | undefined) => {
  const dataKey = `/user-resumes/${id}`;
  const getFetcher = () => fetcher(dataKey, 'GET');
  const { data, error, isLoading } = useSWR(dataKey, getFetcher);
  return {
    data: data?.data || [],
    error,
    isLoading,
  };
};
