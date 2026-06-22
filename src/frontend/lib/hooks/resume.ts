import useSWR, { mutate } from 'swr';
import { v4 as uuidv4 } from 'uuid';
import { fetcher } from '@/lib/utils/api';
import { getDuplicateResumeTitle } from '@/lib/utils/resume-title';

export const useCreateNewResume = () => {
  const { data, error } = useSWR('/user-resumes', fetcher);

  const createNewResume = async (resumeData: UserResume) => {
    try {
      const response = await fetcher('/user-resumes', 'POST', resumeData);
      mutate('/user-resumes', response, false);
      const userEmail = resumeData.data.userEmail;
      if (userEmail) {
        mutate(`/user-resumes?filters[userEmail][$eq]=${userEmail}`);
      }
      return response;
    } catch (err) {
      console.error('Failed to create resume:', err);
      throw err;
    }
  };

  return { createNewResume, data, error };
};

export const useDeleteResume = () => {
  const deleteResume = async (documentId: string, userEmail: string) => {
    try {
      await fetcher(`/user-resumes/${documentId}`, 'DELETE');
      const cacheKey = `/user-resumes?filters[userEmail][$eq]=${userEmail}`;
      mutate(cacheKey);
      return true;
    } catch (err) {
      console.error('Failed to delete resume:', err);
      throw err;
    }
  };

  return { deleteResume };
};

export const useBulkDeleteResumes = () => {
  const bulkDeleteResumes = async (documentIds: string[], userEmail: string) => {
    const results: { id: string; success: boolean; error?: Error }[] = [];

    await Promise.all(
      documentIds.map(async (documentId) => {
        try {
          await fetcher(`/user-resumes/${documentId}`, 'DELETE');
          results.push({ id: documentId, success: true });
        } catch (err) {
          results.push({ id: documentId, success: false, error: err as Error });
        }
      })
    );

    const cacheKey = `/user-resumes?filters[userEmail][$eq]=${userEmail}`;
    mutate(cacheKey);

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return { results, successCount, failureCount };
  };

  return { bulkDeleteResumes };
};

export const useDuplicateResume = () => {
  const duplicateResume = async (
    resume: Resume,
    userEmail: string,
    existingTitles: string[] = []
  ) => {
    try {
      const newUuid = uuidv4();
      const duplicateTitle = getDuplicateResumeTitle(resume.title, existingTitles);
      const duplicateData: UserResume = {
        data: {
          title: duplicateTitle,
          resumeId: newUuid,
          userEmail: userEmail,
          userName: resume.userName,
          firstName: resume.firstName,
          lastName: resume.lastName,
          jobTitle: resume.jobTitle,
          address: resume.address,
          phone: resume.phone,
          email: resume.email,
          summary: resume.summary,
          experience: resume.experience,
          education: resume.education,
          skills: resume.skills,
          themeColor: resume.themeColor,
        },
      };

      const response = await fetcher('/user-resumes', 'POST', duplicateData);
      const cacheKey = `/user-resumes?filters[userEmail][$eq]=${userEmail}`;
      mutate(cacheKey);
      return response;
    } catch (err) {
      console.error('Failed to duplicate resume:', err);
      throw err;
    }
  };

  return { duplicateResume };
};

export const useGetUserResumes = (userEmail: string | undefined) => {
  const dataKey = userEmail ? `/user-resumes?filters[userEmail][$eq]=${userEmail}` : null;
  const getFetcher = dataKey ? () => fetcher(dataKey, 'GET') : null;
  const { data, error, isLoading, mutate } = useSWR(dataKey, getFetcher);

  return {
    data: data?.data || [],
    error,
    isLoading: userEmail ? isLoading : false,
    mutate,
  };
};

export const useGetUserResume = (id: string | undefined) => {
  const dataKey = `/user-resumes/${id}`;
  const getFetcher = () => fetcher(dataKey, 'GET');
  const { data, error, isLoading, mutate } = useSWR(dataKey, getFetcher);
  return {
    data: data?.data || [],
    error,
    isLoading,
    mutate,
  };
};
