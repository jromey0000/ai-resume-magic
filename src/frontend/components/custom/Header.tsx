import { UserButton, useUser } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { ChevronDown, Monitor, Moon, Settings, Sun, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useTheme } from '@/lib/contexts/ThemeContext';

function Header() {
  const { isSignedIn, isLoaded } = useUser();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  return (
    <div className="shadow-lg bg-white/80 dark:bg-transparent border-b border-cod-gray-200 dark:border-cod-gray-700/50 backdrop-blur-sm">
      <div className="px-10 md:px-15 lg:px-20 py-4 flex items-center justify-between">
        <Link to={'/'}>
          <img src="/ai-resume-magic.svg" alt="AI Resume Magic" style={{ height: '35px' }} />
        </Link>

        <div className="flex items-center gap-2">
          {isSignedIn && isLoaded && (
            <Link to={'/dashboard'}>
              <Button variant="ghost">Dashboard</Button>
            </Link>
          )}

          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="flex items-center gap-1 p-2 rounded-lg text-cod-gray-500 dark:text-cod-gray-400 hover:text-cod-gray-900 dark:hover:text-white hover:bg-cod-gray-100 dark:hover:bg-cod-gray-800 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-cod-gray-900 border border-cod-gray-200 dark:border-cod-gray-800 shadow-xl z-50 overflow-hidden">
                <div className="p-3 border-b border-cod-gray-200 dark:border-cod-gray-800">
                  <p className="text-xs font-medium text-cod-gray-500 dark:text-cod-gray-400 uppercase tracking-wide mb-2">
                    Theme
                  </p>
                  <div className="flex gap-1">
                    {themeOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                          theme === option.value
                            ? 'bg-fuchsia-pink-600 text-white'
                            : 'hover:bg-cod-gray-100 dark:hover:bg-cod-gray-800 text-cod-gray-500 dark:text-cod-gray-400'
                        }`}
                        aria-label={option.label}
                      >
                        <option.icon className="w-4 h-4" />
                        <span className="text-xs">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {isSignedIn && isLoaded && (
                  <div className="p-2">
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setIsSettingsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-cod-gray-600 dark:text-cod-gray-300 hover:bg-cod-gray-100 dark:hover:bg-cod-gray-800 hover:text-cod-gray-900 dark:hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Account Settings</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {isSignedIn && isLoaded ? (
            <div className="ml-2">
              <UserButton appearance={{ baseTheme: resolvedTheme === 'dark' ? dark : undefined }} />
            </div>
          ) : (
            <Link to={'/auth/sign-in'}>
              <Button>Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
