import { AlertTriangle, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  const iconColors = {
    danger:
      'bg-coral-rose-100 dark:bg-coral-rose-950/50 text-coral-rose-600 dark:text-coral-rose-400',
    warning: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    default:
      'bg-fuchsia-pink-100 dark:bg-fuchsia-pink-950/50 text-fuchsia-pink-600 dark:text-fuchsia-pink-400',
  };

  const confirmButtonVariant = variant === 'danger' ? 'ghost' : 'primary';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm micro-enter-fade-scale border-0 p-0 cursor-default"
        aria-label="Close dialog"
        onClick={isLoading ? undefined : onClose}
        disabled={isLoading}
      />

      <div
        ref={modalRef}
        className="relative bg-white dark:bg-cod-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 micro-enter-slide-down"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-cod-gray-100 dark:hover:bg-cod-gray-800 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-cod-gray-500" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${iconColors[variant]}`}
          >
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-semibold text-cod-gray-900 dark:text-white mb-2">{title}</h3>

          <p className="text-cod-gray-600 dark:text-cod-gray-400 mb-6">{message}</p>

          <div className="flex gap-3 w-full">
            <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button
              variant={confirmButtonVariant}
              className={`flex-1 ${variant === 'danger' ? 'bg-coral-rose-600 hover:bg-coral-rose-700 text-white border-coral-rose-600' : ''}`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
