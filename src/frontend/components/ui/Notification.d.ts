interface NotificationProps {
  title: string;
  message: string;
  onDismiss?: () => void;
  onViewMore?: () => void;
  showDismiss?: boolean;
  showViewMore?: boolean;
}
declare const Notification: ({
  title,
  message,
  onDismiss,
  onViewMore,
  showDismiss,
  showViewMore,
}: NotificationProps) => import('react').ReactPortal;
export default Notification;
