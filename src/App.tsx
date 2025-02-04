import { Outlet, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

import './App.css';

function App() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isSignedIn && isLoaded) {
    return <Navigate to="/auth/sign-in" />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
