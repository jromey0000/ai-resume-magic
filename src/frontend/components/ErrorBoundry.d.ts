import type React from 'react';
import { Component, type ReactNode } from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}
declare class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps);
  static getDerivedStateFromError(error: Error): State;
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
  handleReset: () => void;
  handleGoHome: () => void;
  render():
    | string
    | number
    | bigint
    | boolean
    | React.JSX.Element
    | Iterable<React.ReactNode>
    | Promise<
        | string
        | number
        | bigint
        | boolean
        | React.ReactPortal
        | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
        | Iterable<React.ReactNode>
        | null
        | undefined
      >
    | null
    | undefined;
}
export default ErrorBoundary;
