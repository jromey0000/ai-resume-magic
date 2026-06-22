import { useUser } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/custom/Header';
import ErrorBoundary from './components/ErrorBoundry';

import './App.css';

const GUEST_ALLOWED_PATHS = ['/dashboard/new', '/dashboard/resume/guest/edit'];

function App() {
  const { isLoaded, isSignedIn } = useUser();
  const location = useLocation();

  const isGuestAllowed = GUEST_ALLOWED_PATHS.some((path) =>
    location.pathname.toLowerCase().startsWith(path.toLowerCase())
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn && !isGuestAllowed) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/sign-in?redirect_url=${redirectUrl}`} replace />;
  }

  return (
    <>
      <Header />
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </>
  );
}

export default App;
