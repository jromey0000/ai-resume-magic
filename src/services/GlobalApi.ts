import { UserResume } from '@/types';
import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = Axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
});

const axiosClient = setupCache(axiosInstance, {
  debug: console.log,
  methods: ['get'],
});

const CreateNewResume = (data: UserResume) =>
  axiosClient.post('/user-resumes', data, { cache: false });

const GetUserResumes = (userEmail: string) =>
  axiosClient.get(`/user-resumes?filters[userEmail][$eq]=${userEmail}`);

export { CreateNewResume, GetUserResumes };
