import * as React from 'react';

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
declare const Modal: ({
  isOpen,
  onClose,
  title,
  children,
  buttons,
  className,
}: ModalProps) => React.JSX.Element | null;
export default Modal;
