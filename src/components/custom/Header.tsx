import { Link } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { useThemeDetector } from '@/utils/hooks';
import Button from '@/components/ui/Button';

function Header() {
  const { user, isSignedIn, isLoaded } = useUser();
  const isDarkMode = useThemeDetector();

  return (
    <div className="flex items-center justify-between p-4 mb-14 shadow-lg dark:border-b-1 dark:border-black">
      <Link to={'/'}>
        <img src="/ai-resume-magic.svg" style={{ height: '35px' }} />
      </Link>

      {isSignedIn && isLoaded ? (
        <div className="flex items-center">
          <Link to={'/dashboard'}>
            <Button variant="ghost">Dashboard</Button>
          </Link>

          <div className="ml-4">
            <UserButton
              appearance={{ baseTheme: isDarkMode ? dark : undefined }}
            />
          </div>
        </div>
      ) : (
        <Link to={'/auth/sign-in'}>
          <Button>Get Started</Button>
        </Link>
      )}
    </div>
  );
}

export default Header;
