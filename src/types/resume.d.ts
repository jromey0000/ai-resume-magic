interface UserResume {
  data: UserDataObject;
}

interface Resume {
  id: number;
  documentId: string;
  title: string;
  resumeId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Experience {
  id: number;
  title: string;
  companyName: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  workSummary: string;
}

interface Education {
  id: number;
  degree: string;
  major: string;
  school: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  id: number;
  name: string;
  rating: number;
}

interface ResumeInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  phone: string;
  email: string;
  themeColor?: string;
  summary?: string;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
}
