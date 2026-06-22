import { SignIn } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { WandSparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTheme } from '@/lib/contexts/ThemeContext';

function SignInPage() {
  const { resolvedTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-8 max-w-md">
        <div className="inline-flex items-center gap-2 mb-4">
          <WandSparkles className="w-8 h-8 text-primary" />
          <span className="font-bold text-2xl">AI Resume Magic</span>
        </div>
        <h1 className="text-xl font-semibold mb-2">Sign in to save your resume</h1>
        <p className="text-muted-foreground text-sm">
          Your progress is preserved. Sign in to save, export, and access your resumes anytime.
        </p>
      </div>

      <div className="flex items-center justify-center">
        <SignIn
          appearance={{ baseTheme: resolvedTheme === 'dark' ? dark : undefined }}
          fallbackRedirectUrl={redirectUrl}
          forceRedirectUrl={redirectUrl}
        />
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
