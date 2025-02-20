import { createContext, useContext } from 'react';

const defaultContext: NotificationContextType = {
  addNotification: () => {}, // Default no-op function for safety
};

// Create the context with the default value
export const NotificationContext = createContext(defaultContext);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
