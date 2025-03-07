import React, { Component, ReactNode } from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
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

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h2 className="flex justify-center my-4 text-xl">
            Something went wrong.
          </h2>
          <details
            className="py-6 text-center"
            style={{ whiteSpace: 'pre-wrap' }}>
            <summary className="flex justify-center">
              Click for more details
            </summary>
            <div>
              <p>
                <strong>Error:</strong> {this.state.error?.message}
              </p>
              <p>
                <strong>Stack Trace:</strong>
              </p>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </div>
          </details>
        </>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
