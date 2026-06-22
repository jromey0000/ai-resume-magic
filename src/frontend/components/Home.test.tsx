import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import Home from './Home';

vi.mock('react-router-dom', () => ({
  Link: ({ to, children }: { to: string; children: ReactNode }) => <a href={to}>{children}</a>,
}));

function renderHome() {
  return render(
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}

describe('Home', () => {
  it('renders the hero headline', () => {
    renderHome();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Stop Getting');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Start Getting Interviews');
  });

  it('shows primary call-to-action links', () => {
    renderHome();

    expect(screen.getByRole('link', { name: /build your resume free/i })).toHaveAttribute(
      'href',
      '/dashboard/new'
    );
    expect(screen.getByRole('link', { name: /see how it works/i })).toHaveAttribute(
      'href',
      '#how-it-works'
    );
  });

  it('renders trust and ATS messaging', () => {
    renderHome();

    expect(
      screen.getByText(/trusted by job seekers building ats-ready resumes/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/75% of resumes are rejected by ats systems/i)).toBeInTheDocument();
    expect(
      screen.getByText(/optimized for all major applicant tracking systems/i)
    ).toBeInTheDocument();
  });
});
