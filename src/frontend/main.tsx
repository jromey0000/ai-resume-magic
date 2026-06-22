import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import {
  createBrowserRouter,
  isRouteErrorResponse,
  Link,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';
import config from '@/config';
import App from './App.tsx';
import SignInPage from './auth/SignInPage.tsx';
import Home from './components/Home.tsx';
import LegalPage from './components/LegalPage.tsx';
import AnalyticsPage from './dashboard/AnalyticsPage.tsx';
import DashboardLayout from './dashboard/components/DashboardLayout';
import HelpPage from './dashboard/HelpPage.tsx';
import Dashboard from './dashboard/index.tsx';
import EditResume from './dashboard/resume/[resumeId]/edit/index.tsx';
import { OnboardingFlow } from './dashboard/resume/onboarding';
import SettingsPage from './dashboard/SettingsPage.tsx';
import TeamPage from './dashboard/TeamPage.tsx';
import { ThemeProvider } from './lib/contexts/ThemeContext';
import { TierProvider } from './lib/contexts/TierContext';
import { NotificationProvider } from './lib/utils/providers';

const PUBLISHABLE_KEY = config.CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

function RouteErrorBoundary() {
  const error = useRouteError();

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page not found';
      message = "Sorry, the page you're looking for doesn't exist.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || message;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-cod-gray-950 dark:to-cod-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-cod-gray-900 dark:text-white mb-4">
          {isRouteErrorResponse(error) ? error.status : '!'}
        </h1>
        <h2 className="text-2xl font-semibold text-cod-gray-700 dark:text-cod-gray-200 mb-2">
          {title}
        </h2>
        <p className="text-cod-gray-500 dark:text-cod-gray-400 mb-8">{message}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/legal',
    element: <LegalPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/auth/sign-in',
    element: <SignInPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/dashboard',
    element: <App />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'analytics',
            element: <AnalyticsPage />,
          },
          {
            path: 'team',
            element: <TeamPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'help',
            element: <HelpPage />,
          },
          {
            path: 'new',
            element: <OnboardingFlow />,
          },
          {
            path: 'resume/:resumeId/edit',
            element: <EditResume />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <RouteErrorBoundary />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider>
        <TierProvider initialTier="free">
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </TierProvider>
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>
);
