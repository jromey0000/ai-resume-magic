import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

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
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter');

  const dismiss = () => {
    setPhase('exit');
  };

  const handleDismiss = () => {
    dismiss();
  };

  const handleViewMore = () => {
    if (onViewMore) onViewMore();
  };

  const handleAnimationEnd = () => {
    if (phase === 'exit') {
      onDismiss?.();
    } else if (phase === 'enter') {
      setPhase('visible');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setPhase('exit'), 5000);
    return () => clearTimeout(timer);
  }, []);

  return createPortal(
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <div
        className={cn(
          'relative mx-auto max-w-[500px] rounded-xl border border-secondary-50 bg-white dark:bg-cod-gray-900 dark:border-cod-gray-900 p-4 text-sm shadow-lg',
          phase === 'enter' && 'micro-enter-slide-down',
          phase === 'exit' && 'micro-exit-slide-down'
        )}
        onAnimationEnd={handleAnimationEnd}
      >
        <button
          type="button"
          className="absolute top-4 right-4 ml-auto text-secondary-500 hover:text-secondary-900 active:scale-95 transition-transform"
          onClick={handleDismiss}
        >
          <X />
        </button>
        <div className="flex space-x-4">
          <div className="flex-1">
            <h4 className="pr-6 font-medium text-secondary-900 dark:text-white">{title}</h4>
            <div className="mt-1 text-secondary-500">{message}</div>
            <div className="mt-2 flex space-x-4">
              {showDismiss ? (
                <button
                  type="button"
                  className="inline-block font-medium leading-loose text-secondary-500 hover:text-secondary-900"
                  onClick={handleDismiss}
                >
                  Dismiss
                </button>
              ) : null}
              {showViewMore ? (
                <button
                  type="button"
                  className="inline-block font-medium leading-loose text-primary-600 hover:text-primary-700"
                  onClick={handleViewMore}
                >
                  View more
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Notification;
