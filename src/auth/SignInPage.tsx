import { SignIn } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

function SignInPage() {
  const isDarkMode = true;
  return (
    <div className="mx-auto max-w-md m-8">
      <div className="flex max-w-md items-center justify-center">
        <SignIn appearance={{ baseTheme: isDarkMode ? dark : undefined }} />
      </div>
    </div>
  );
}

export default SignInPage;
