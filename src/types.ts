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
  onViewMore: () => void;
}

// Define types for the context
export interface NotificationContextType {
  addNotification: (notification: NotificationType) => void;
}
