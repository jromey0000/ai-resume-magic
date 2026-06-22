import { SignIn } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { AlertCircle, WandSparkles } from 'lucide-react';
import { Component, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useTheme } from '@/lib/contexts/ThemeContext';

function isValidRedirectUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('/') && !url.startsWith('//')) return true;
  return false;
}

function sanitizeRedirectUrl(url: string | null): string {
  const defaultUrl = '/dashboard';
  if (!url) return defaultUrl;

  const decoded = decodeURIComponent(url);
  if (!isValidRedirectUrl(decoded)) return defaultUrl;

  return decoded;
}

interface SignInErrorBoundaryState {
  hasError: boolean;
}

class SignInErrorBoundary extends Component<
  { children: ReactNode },
  SignInErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): SignInErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center gap-4 p-6 bg-destructive/10 border border-destructive/20 rounded-xl max-w-md">
          <AlertCircle className="w-10 h-10 text-destructive" />
          <div className="text-center">
            <h3 className="font-semibold mb-1">Sign-in unavailable</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't load the sign-in form. Please check your connection and try again.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
          >
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

function SignInPage() {
  const { resolvedTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const redirectUrl = sanitizeRedirectUrl(searchParams.get('redirect_url'));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-8 max-w-md">
        <div className="inline-flex items-center gap-2 mb-4">
          <WandSparkles className="w-8 h-8 text-primary" />
          <span className="font-bold text-2xl">AI Resume Magic</span>
        </div>
        <h1 className="text-xl font-semibold mb-2">Sign in to save your resume</h1>
        <p className="text-muted-foreground text-sm">
          Your progress is preserved. Sign in to save to the cloud and unlock premium features.
        </p>
      </div>

      <div className="flex items-center justify-center">
        <SignInErrorBoundary>
          <SignIn
            appearance={{ baseTheme: resolvedTheme === 'dark' ? dark : undefined }}
            fallbackRedirectUrl={redirectUrl}
            forceRedirectUrl={redirectUrl}
          />
        </SignInErrorBoundary>
      </div>

      <Link
        to="/dashboard/new"
        className="mt-6 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        Continue building without an account →
      </Link>
    </div>
  );
}

export default SignInPage;
