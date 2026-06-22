import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import type React from 'react';
import { Component, type ReactNode } from 'react';
import Button from './ui/Button';

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error, errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isNetworkError =
        this.state.error?.message?.includes('Network') ||
        this.state.error?.message?.includes('fetch') ||
        this.state.error?.name === 'NetworkError';

      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-red-200 dark:border-red-800 p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
                <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {isNetworkError ? 'Connection Error' : 'Something Went Wrong'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {isNetworkError
                    ? 'Unable to connect to the server. Please check your internet connection and try again.'
                    : 'An unexpected error occurred. Please try refreshing the page.'}
                </p>
              </div>

              {this.state.error?.message && (
                <div className="w-full mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                    <span className="font-medium">Error:</span> {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
                <Button
                  variant="primary"
                  onClick={this.handleReset}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>

              {this.state.errorInfo && process.env.NODE_ENV === 'development' && (
                <details className="w-full mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    Show technical details
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-md text-xs overflow-auto max-h-48 border border-gray-200 dark:border-gray-700">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
