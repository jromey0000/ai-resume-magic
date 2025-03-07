import Axios from 'axios';
import config from '@/config';

const API_KEY = config.STRAPI_API_KEY;
const API_BASE_URL = config.API_BASE_URL;

const axiosInstance = Axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: `Bearer ${API_KEY}`,
  },
});

const fetcher = async (url: string, method: 'GET' | 'POST', data?: unknown) => {
  try {
    let response;

    if (method === 'POST') {
      response = await axiosInstance.post(url, data);
    } else if (method === 'GET') {
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
  payload: PersonalDetailsFormData
) => {
  console.log(id, payload);
  axiosInstance.put(`/user-resumes/${id}`, payload);
};

export { fetcher, updateResumeDetail };
