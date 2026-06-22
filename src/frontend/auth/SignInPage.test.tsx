import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import SignInPage from './SignInPage';

vi.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: ReactNode }) => <a href={to}>{children}</a>,
  useSearchParams: () => [new URLSearchParams('redirect_url=/dashboard')],
}));

vi.mock('@/lib/contexts/ThemeContext', () => ({
  useTheme: () => ({ resolvedTheme: 'light' as const }),
}));

describe('SignInPage', () => {
  it('renders branding and sign-in prompt', () => {
    render(<SignInPage />);

    expect(screen.getByText('AI Resume Magic')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /sign in to save your resume/i })
    ).toBeInTheDocument();
  });

  it('offers a guest continue link', () => {
    render(<SignInPage />);

    expect(
      screen.getByRole('link', { name: /continue building without an account/i })
    ).toHaveAttribute('href', '/dashboard/new');
  });
});
