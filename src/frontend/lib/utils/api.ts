import Axios, { AxiosError } from 'axios';
import config from '@/config';

const API_KEY = config.STRAPI_API_KEY;
const API_BASE_URL = config.API_BASE_URL;

const axiosInstance = Axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json; charset=utf-8',
    ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
  },
});

interface ApiError extends Error {
  status?: number;
  code?: string;
}

function createApiError(message: string, status?: number, code?: string): ApiError {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.code = code;
  return error;
}

const fetcher = async (
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: unknown
) => {
  try {
    let response: Awaited<ReturnType<typeof axiosInstance.get>>;

    switch (method) {
      case 'POST':
        response = await axiosInstance.post(url, data);
        break;
      case 'PUT':
        response = await axiosInstance.put(url, data);
        break;
      case 'DELETE':
        response = await axiosInstance.delete(url);
        break;
      default:
        response = await axiosInstance.get(url);
    }

    return response?.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.response?.status;
      const data = err.response?.data as { error?: { message?: string } } | undefined;
      const message = data?.error?.message || err.message;
      throw createApiError(message, status, err.code);
    }
    if (err instanceof Error) {
      throw createApiError(err.message);
    }
    throw createApiError('An unknown error occurred');
  }
};

const updateResumeDetail = async (
  id: string | undefined,
  payload:
    | PersonalDetailsFormData
    | SummaryFormData
    | WorkExperienceFormData
    | EducationFormData
    | SkillsFormData
    | { data?: Partial<ResumeInfo> }
): Promise<void> => {
  if (!id) {
    throw createApiError('Resume ID is required', 400, 'MISSING_ID');
  }
  await axiosInstance.put(`/user-resumes/${id}`, payload);
};

export { fetcher, updateResumeDetail, createApiError };
export type { ApiError };
