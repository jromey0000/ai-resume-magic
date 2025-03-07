import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Header from '@/components/custom/Header';
import ErrorBoundary from './components/ErrorBoundry';

import './App.css';

function App() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isSignedIn && isLoaded) {
    return <Navigate to="/auth/sign-in" />;
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
