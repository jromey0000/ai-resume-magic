import { UserResume } from '@/types';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const BASE_URL = 'http://localhost:1337/api/';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
});

const CreateNewResume = (data: UserResume) =>
  axiosClient.post('/user-resumes', data);

export { CreateNewResume };
