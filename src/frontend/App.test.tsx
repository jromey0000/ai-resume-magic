import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockUseUser } from '@/test/mocks/clerk';
import App from './App';

const mockUseLocation = vi.fn(() => ({
  pathname: '/dashboard',
  search: '',
}));

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div data-testid="redirect">{to}</div>,
  Outlet: () => <div>Protected content</div>,
  useLocation: () => mockUseLocation(),
}));

vi.mock('@/components/custom/Header', () => ({
  default: () => <header>App header</header>,
}));

describe('App auth guard', () => {
  it('redirects unauthenticated users away from the dashboard', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
      user: null,
    });
    mockUseLocation.mockReturnValue({
      pathname: '/dashboard',
      search: '',
    });

    render(<App />);

    expect(screen.getByTestId('redirect')).toHaveTextContent(
      '/auth/sign-in?redirect_url=%2Fdashboard'
    );
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('allows guest access to the onboarding route', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
      user: null,
    });
    mockUseLocation.mockReturnValue({
      pathname: '/dashboard/new',
      search: '',
    });

    render(<App />);

    expect(screen.getByText('Protected content')).toBeInTheDocument();
    expect(screen.getByText('App header')).toBeInTheDocument();
    expect(screen.queryByTestId('redirect')).not.toBeInTheDocument();
  });

  it('renders protected dashboard content for signed-in users', () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: { id: 'user_123' },
    });
    mockUseLocation.mockReturnValue({
      pathname: '/dashboard',
      search: '',
    });

    render(<App />);

    expect(screen.getByText('Protected content')).toBeInTheDocument();
    expect(screen.queryByTestId('redirect')).not.toBeInTheDocument();
  });
});
