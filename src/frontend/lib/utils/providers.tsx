import { type ReactNode, useState } from 'react';
import Notification from '@/components/ui/Notification';
import { NotificationContext } from './hooks';

// Corrected NotificationProviderProps interface
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = (notification: NotificationType) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { ...notification, id: crypto.randomUUID() },
    ]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          title={notification.title}
          message={notification.message}
          onDismiss={() => notification.id && removeNotification(notification.id)}
          onViewMore={notification.onViewMore}
        />
      ))}
    </NotificationContext.Provider>
  );
};
