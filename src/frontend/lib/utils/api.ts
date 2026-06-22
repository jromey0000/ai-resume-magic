import Axios from 'axios';
import config from '@/config';

const _API_KEY = config.STRAPI_API_KEY;
const API_BASE_URL = config.API_BASE_URL;

const axiosInstance = Axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json; charset=utf-8',
  },
});

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
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error('An unknown error occurred');
  }
};

const updateResumeDetail = (
  id: string | undefined,
  payload:
    | PersonalDetailsFormData
    | SummaryFormData
    | WorkExperienceFormData
    | EducationFormData
    | SkillsFormData
    | { data?: Partial<ResumeInfo> }
) => {
  console.log(id, payload);
  axiosInstance.put(`/user-resumes/${id}`, payload);
};

export { fetcher, updateResumeDetail };
