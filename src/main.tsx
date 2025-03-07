import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { NotificationProvider } from './lib/utils/providers';
import { ErrorBoundary } from 'react-error-boundary';
import SignInPage from './auth/SignInPage.tsx';
import Home from './components/Home.tsx';
import Dashboard from './dashboard/index.tsx';
import EditResume from './dashboard/resume/[resumeId]/edit/index.tsx';
import config from '@/config';

const PUBLISHABLE_KEY = config.CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/dashboard/resume/:resumeId/edit',
        element: <EditResume />,
      },
    ],
  },
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth/sign-in',
    element: <SignInPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </ClerkProvider>
  </StrictMode>
);
