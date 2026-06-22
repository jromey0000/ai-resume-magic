import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/custom/Header';
import ErrorBoundary from './components/ErrorBoundry';

import './App.css';

const GUEST_ALLOWED_PATHS = ['/dashboard/new', '/dashboard/resume/guest/edit'];

function App() {
  const { isLoaded, isSignedIn } = useUser();
  const location = useLocation();

  const isGuestAllowed = GUEST_ALLOWED_PATHS.some((path) => location.pathname.startsWith(path));

  if (!isSignedIn && isLoaded && !isGuestAllowed) {
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
