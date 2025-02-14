// Define types for the notification object
interface NotificationType {
  title: string;
  message: string;
  onViewMore?: () => void;
  showViewMore?: boolean;
  showDismiss?: boolean;
}

// Define types for the context
interface NotificationContextType {
  addNotification: (notification: NotificationType) => void;
}
