import { useState, ReactNode } from 'react';
import Notification from '@/components/ui/Notification';
import { NotificationType } from '@/types';
import { NotificationContext } from './hooks';

// Corrected NotificationProviderProps interface
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = (notification: NotificationType) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
  };

  const removeNotification = (index: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {notifications.map((notification, index) => (
        <Notification
          key={index}
          title={notification.title}
          message={notification.message}
          onDismiss={() => removeNotification(index)}
          onViewMore={notification.onViewMore}
        />
      ))}
    </NotificationContext.Provider>
  );
};
