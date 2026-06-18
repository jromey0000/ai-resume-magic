interface ErrorDisplayProps {
  error:
    | Error
    | {
        message?: string;
      };
  title?: string;
  onRetry?: () => void;
  className?: string;
}
export default function ErrorDisplay({
  error,
  title,
  onRetry,
  className,
}: ErrorDisplayProps): import('react').JSX.Element;
