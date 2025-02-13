import { UserResume } from '@/types';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_BASE_URL = import.meta.env;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
});

const CreateNewResume = (data: UserResume) =>
  axiosClient.post('/user-resumes', data);

const GetUserResumes = (userEmail: string) =>
  axiosClient.get(`/user-resumes?filters[userEmail][$eq]=${userEmail}`);

export { CreateNewResume, GetUserResumes };
