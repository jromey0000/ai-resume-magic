import { X } from 'lucide-react';
import * as React from 'react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ButtonConfig {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  disabled?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  buttons?: ButtonConfig[];
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title = 'Modal Title',
  children,
  buttons,
  className,
}: ModalProps) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity border-0 p-0 cursor-default"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <Card className={cn('relative w-full max-w-xl shadow-lg', className)}>
        <CardHeader className="relative">
          <CardTitle className="pr-8">{title}</CardTitle>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{children}</CardContent>
        <CardFooter className="flex justify-end gap-3 border-t bg-muted/50">
          {buttons && buttons.length > 0 ? (
            buttons.map((button) => (
              <Button
                key={String(button.label)}
                disabled={button.disabled || false}
                variant={button.variant || 'primary'}
                onClick={button.onClick}
              >
                {button.label}
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default Modal;
