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
  firstName: string | null;
  lastName: string | null;
  jobTitle: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  themeColor: string | null;
  templateId?: string | null;
  atsScore?: number | null;
  summary?: string;
  experience?: WorkExperience[];
  education?: Education[];
  skills?: Skill[];
}

interface WorkExperience {
  id?: string;
  title: string;
  companyName: string;
  city: string;
  state: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  workSummary: string;
}

interface Education {
  id?: string;
  universityName: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface Skill {
  id?: string;
  name: string;
  rating: number;
}

interface ResumeInfo {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  address?: string;
  phone?: string;
  email?: string;
  themeColor?: string;
  templateId?: string;
  atsScore?: number;
  summary?: string;
  experience?: WorkExperience[];
  education?: Education[];
  skills?: Skill[];
}

interface UserResume {
  data: {
    title: string;
    resumeId: string;
    userName: string;
    userEmail: string;
  };
}

interface NotificationType {
  id?: string;
  title: string;
  message: string;
  onViewMore?: () => void;
}

interface PersonalDetailsFormData {
  data: {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

interface SummaryFormData {
  data: {
    summary?: string;
  };
}

interface WorkExperienceFormData {
  data: {
    experience?: WorkExperience[];
  };
}

interface EducationFormData {
  data: {
    education?: Education[];
  };
}

interface SkillsFormData {
  data: {
    skills?: Skill[];
  };
}

interface ATSSuggestion {
  id: string;
  type: 'keyword' | 'skill' | 'experience' | 'format' | 'summary';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  currentText?: string;
  suggestedText?: string;
}

interface ATSAnalysis {
  score: number;
  keywordsFound: string[];
  keywordsMissing: string[];
  skillsMatch: {
    matched: string[];
    missing: string[];
    total: number;
  };
  suggestions: ATSSuggestion[];
  experienceRelevance: number;
  formatScore: number;
}
