import { Lock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

function AuthGateModal({
  isOpen,
  onClose,
  title = 'Sign in to continue',
  message = 'Create a free account to export your resume and save your progress.',
}: AuthGateModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignIn = () => {
    const currentPath = window.location.pathname + window.location.search;
    navigate(`/auth/sign-in?redirect_url=${encodeURIComponent(currentPath)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm border-0 p-0 cursor-default"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative bg-background rounded-2xl shadow-2xl max-w-md w-full p-6 border">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-primary" />
        </div>

        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground text-sm mb-6">{message}</p>

        <div className="flex flex-col gap-2">
          <Button variant="primary" className="w-full" onClick={handleSignIn}>
            Sign in — it's free
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Keep editing
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AuthGateModal;
