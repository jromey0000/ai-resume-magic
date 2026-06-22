import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface ErrorDisplayProps {
  error: Error | { message?: string };
  title?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorDisplay({ error, title, onRetry, className }: ErrorDisplayProps) {
  const errorMessage = error?.message || 'An unexpected error occurred';
  const isNetworkError =
    errorMessage.includes('Network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('Failed to fetch') ||
    (error as Error)?.name === 'NetworkError';

  const displayTitle = title || (isNetworkError ? 'Connection Error' : 'Error');

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[40vh] px-4 ${className || ''}`}
    >
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-red-200 dark:border-red-800 p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
            <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{displayTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isNetworkError
                ? 'Unable to connect to the server. Please check your internet connection and try again.'
                : 'Something went wrong while loading the data.'}
            </p>
          </div>

          <div className="w-full mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
              <span className="font-medium">Details:</span> {errorMessage}
            </p>
          </div>

          {onRetry && (
            <div className="w-full mt-6">
              <Button
                variant="primary"
                onClick={onRetry}
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
