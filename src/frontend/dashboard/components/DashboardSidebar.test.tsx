import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TierProvider, type TierName } from '@/lib/contexts/TierContext';
import DashboardSidebar from './DashboardSidebar';

vi.mock('react-router-dom', () => ({
  Link: ({ to, children, onClick, className }: { to: string; children: ReactNode; onClick?: () => void; className?: string }) => (
    <a href={to} onClick={onClick} className={className}>{children}</a>
  ),
  useLocation: () => ({ pathname: '/dashboard' }),
}));

function createWrapper(initialTier: TierName = 'free') {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <TierProvider initialTier={initialTier}>{children}</TierProvider>;
  };
}

describe('DashboardSidebar', () => {
  describe('tier badge display', () => {
    it('shows Free tier badge', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('free') });
      expect(screen.getByText('Free')).toBeInTheDocument();
      expect(screen.getByText(/\$0/)).toBeInTheDocument();
    });

    it('shows Pro tier badge', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('pro') });
      expect(screen.getByText('Pro')).toBeInTheDocument();
      expect(screen.getByText(/\$79/)).toBeInTheDocument();
    });

    it('shows Enterprise tier badge', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('enterprise') });
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
      expect(screen.getByText(/\$249/)).toBeInTheDocument();
    });
  });

  describe('navigation items', () => {
    it('shows My Resumes link for all tiers', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('free') });
      expect(screen.getByRole('link', { name: /my resumes/i })).toBeInTheDocument();
    });

    it('shows locked Analytics link for free tier', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('free') });
      const analyticsLink = screen.getByText('Analytics').closest('a');
      expect(analyticsLink).toHaveAttribute('href', '#');
    });

    it('shows locked Team link for free tier', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('free') });
      const teamLink = screen.getByText('Team').closest('a');
      expect(teamLink).toHaveAttribute('href', '#');
    });

    it('shows locked Analytics and Team for pro tier', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('pro') });
      const analyticsLink = screen.getByText('Analytics').closest('a');
      const teamLink = screen.getByText('Team').closest('a');
      expect(analyticsLink).toHaveAttribute('href', '#');
      expect(teamLink).toHaveAttribute('href', '#');
    });

    it('unlocks Analytics and Team for enterprise tier', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('enterprise') });
      const analyticsLink = screen.getByText('Analytics').closest('a');
      const teamLink = screen.getByText('Team').closest('a');
      expect(analyticsLink).toHaveAttribute('href', '/dashboard/analytics');
      expect(teamLink).toHaveAttribute('href', '/dashboard/team');
    });
  });

  describe('usage display', () => {
    it('shows usage section', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('free') });
      expect(screen.getByText('Usage This Month')).toBeInTheDocument();
    });

    it('shows resume usage bar', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('free') });
      expect(screen.getByText('Resumes')).toBeInTheDocument();
    });

    it('shows AI optimization usage bar', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('free') });
      expect(screen.getByText('AI Optimizations')).toBeInTheDocument();
    });

    it('shows team members usage for enterprise only', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('enterprise') });
      expect(screen.getByText('Team Members')).toBeInTheDocument();
    });

    it('hides team members usage for non-enterprise', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('pro') });
      expect(screen.queryByText('Team Members')).not.toBeInTheDocument();
    });
  });

  describe('upgrade CTA', () => {
    it('shows upgrade to Pro CTA for free tier', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('free') });
      expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument();
      expect(
        screen.getByText('Unlock unlimited resumes and AI optimizations')
      ).toBeInTheDocument();
    });

    it('shows upgrade to Enterprise CTA for pro tier', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('pro') });
      expect(screen.getByText('Upgrade to Enterprise')).toBeInTheDocument();
      expect(screen.getByText('Get team management and analytics')).toBeInTheDocument();
    });

    it('hides upgrade CTA for enterprise tier', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('enterprise') });
      expect(screen.queryByText('Upgrade to')).not.toBeInTheDocument();
    });
  });

  describe('locked feature click', () => {
    it('calls onUpgradeClick when clicking locked feature', async () => {
      const user = userEvent.setup();
      const onUpgradeClick = vi.fn();

      render(<DashboardSidebar onUpgradeClick={onUpgradeClick} />, {
        wrapper: createWrapper('free'),
      });

      const analyticsLink = screen.getByText('Analytics').closest('a');
      await user.click(analyticsLink!);

      expect(onUpgradeClick).toHaveBeenCalledOnce();
    });

    it('does not call onUpgradeClick for unlocked features', async () => {
      const user = userEvent.setup();
      const onUpgradeClick = vi.fn();

      render(<DashboardSidebar onUpgradeClick={onUpgradeClick} />, {
        wrapper: createWrapper('enterprise'),
      });

      const analyticsLink = screen.getByText('Analytics').closest('a');
      await user.click(analyticsLink!);

      expect(onUpgradeClick).not.toHaveBeenCalled();
    });
  });

  describe('bottom navigation', () => {
    it('shows Settings link', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('free') });
      expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute(
        'href',
        '/dashboard/settings'
      );
    });

    it('shows Help & Support link', () => {
      render(<DashboardSidebar />, { wrapper: createWrapper('free') });
      expect(screen.getByRole('link', { name: /help/i })).toHaveAttribute(
        'href',
        '/dashboard/help'
      );
    });
  });
});
