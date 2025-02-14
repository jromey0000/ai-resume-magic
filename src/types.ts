type UserDataObjecct = {
  title: string;
  resumeId: string;
  userEmail: string | undefined;
  userName: string | undefined | null;
};

export interface UserResume {
  data: UserDataObjecct;
}

// Define types for the notification object
export interface NotificationType {
  title: string;
  message: string;
  onViewMore?: () => void;
  showViewMore?: boolean;
  showDismiss?: boolean;
}

// Define types for the context
export interface NotificationContextType {
  addNotification: (notification: NotificationType) => void;
}

export interface Resume {
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
  school: string;
  city: string;
  state: string;
  graduationDate: string;
}

interface Skill {
  id: number;
  name: string;
  level: string;
}

export interface ResumeInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  address: string;
  phone: string;
  email: string;
  themeColor: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}
