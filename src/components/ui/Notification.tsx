import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface NotificationProps {
  title: string;
  message: string;
  onDismiss?: () => void;
  onViewMore?: () => void;
  showDismiss?: boolean;
  showViewMore?: boolean;
}

const Notification = ({
  title,
  message,
  onDismiss,
  onViewMore,
  showDismiss = false,
  showViewMore = false,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  const handleViewMore = () => {
    if (onViewMore) onViewMore();
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return createPortal(
    <div className="space-y-5 fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
      <div className="relative mx-auto max-w-[500px] rounded-xl border border-secondary-50 bg-white dark:bg-cod-gray-900 dark:border-cod-gray-900 p-4 text-sm shadow-lg">
        <button
          className="absolute top-4 right-4 ml-auto text-secondary-500 hover:text-secondary-900"
          onClick={handleDismiss}>
          <X />
        </button>
        <div className="flex space-x-4">
          <div className="flex-1">
            <h4 className="pr-6 font-medium text-secondary-900">{title}</h4>
            <div className="mt-1 text-secondary-500">{message}</div>
            <div className="mt-2 flex space-x-4">
              {showDismiss ? (
                <button
                  className="inline-block font-medium leading-loose text-secondary-500 hover:text-secondary-900"
                  onClick={handleDismiss}>
                  Dismiss
                </button>
              ) : null}
              {showViewMore ? (
                <button
                  className="inline-block font-medium leading-loose text-primary-600 hover:text-primary-700"
                  onClick={handleViewMore}>
                  View more
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body // This renders the notification directly into the body element
  );
};

export default Notification;
