import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ButtonConfig {
  label: string | React.RefAttributes<SVGSVGElement> | ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'error' | 'ghost';
  disabled?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  buttons?: ButtonConfig[];
}

const Modal = ({
  isOpen,
  onClose,
  title = 'Modal Title',
  children,
  buttons,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        className="fixed inset-0 bg-black opacity-85 transition-opacity duration-300"
        onClick={onClose}></div>
      <div className="relative mx-auto overflow-hidden rounded-lg bg-white dark:bg-cod-gray-900 shadow-xl sm:w-full sm:max-w-xl">
        <div className="p-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-1 text-center font-medium text-secondary-500 transition-all hover:bg-secondary-100 cursor-pointer">
            <X />
          </button>
          <h3 className="text-xl font-large text-secondary-900 font-bold">
            {title}
          </h3>
          <div className="mt-2 text-sm text-secondary-500">{children}</div>
        </div>
        <div className="flex justify-end gap-3 bg-secondary-50 px-6 py-3">
          {buttons && buttons.length > 0 ? (
            buttons.map((button, index) => (
              <Button
                key={index}
                disabled={button.disabled || false}
                variant={button.variant || 'primary'}
                onClick={() => {
                  button.onClick();
                }}>
                {button.label as string}
              </Button>
            ))
          ) : (
            <>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onClose}>Confirm</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
