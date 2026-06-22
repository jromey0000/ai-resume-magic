import {
  BarChart3,
  Building2,
  ChevronRight,
  Crown,
  FileText,
  HelpCircle,
  Lock,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { TIER_CONFIGS, type TierName, useTier } from '@/lib/contexts/TierContext';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  requiredTier?: TierName;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'My Resumes', icon: FileText, href: '/dashboard' },
  { label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics', requiredTier: 'enterprise' },
  { label: 'Team', icon: Users, href: '/dashboard/team', requiredTier: 'enterprise' },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  { label: 'Help & Support', icon: HelpCircle, href: '/dashboard/help' },
];

function TierIcon({ tier }: { tier: TierName }) {
  switch (tier) {
    case 'enterprise':
      return <Building2 className="w-5 h-5" />;
    case 'pro':
      return <Crown className="w-5 h-5" />;
    default:
      return <Sparkles className="w-5 h-5" />;
  }
}

function UsageBar({
  label,
  used,
  total,
  color = 'primary',
}: {
  label: string;
  used: number;
  total: number | null;
  color?: 'primary' | 'warning' | 'danger';
}) {
  const isUnlimited = total === null || total === Infinity;
  const percentage = isUnlimited ? 0 : Math.min(100, (used / total) * 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  const colorClasses = {
    primary: 'bg-fuchsia-pink-500',
    warning: 'bg-amber-500',
    danger: 'bg-coral-rose-500',
  };

  const actualColor = isAtLimit ? 'danger' : isNearLimit ? 'warning' : color;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-cod-gray-600 dark:text-cod-gray-400">{label}</span>
        <span className="font-medium text-cod-gray-900 dark:text-white">
          {used}
          {isUnlimited ? '' : ` / ${total}`}
          {isUnlimited && <span className="text-fuchsia-pink-500 ml-1">∞</span>}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 bg-cod-gray-200 dark:bg-cod-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${colorClasses[actualColor]} rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function DashboardSidebar({ onUpgradeClick }: { onUpgradeClick?: () => void }) {
  const tierContext = useTier();
  const { tier, canCreateResume } = tierContext;
  const { resumesCreated, aiOptimizationsUsed, teamMembersCount } = tierContext.usage;
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return (
        location.pathname === '/dashboard' ||
        (location.pathname.startsWith('/dashboard/resume/') &&
          !location.pathname.includes('/guest/'))
      );
    }
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const tierOrder: TierName[] = ['free', 'pro', 'enterprise'];
  const currentTierIndex = tierOrder.indexOf(tier.name);

  const canAccessFeature = (requiredTier?: TierName) => {
    if (!requiredTier) return true;
    const requiredIndex = tierOrder.indexOf(requiredTier);
    return currentTierIndex >= requiredIndex;
  };

  const nextTier =
    currentTierIndex < tierOrder.length - 1 ? TIER_CONFIGS[tierOrder[currentTierIndex + 1]] : null;

  return (
    <aside className="w-72 bg-white dark:bg-cod-gray-900 border-r border-cod-gray-200 dark:border-cod-gray-800 flex flex-col h-full">
      {/* Tier Badge */}
      <div className="p-5 border-b border-cod-gray-200 dark:border-cod-gray-800">
        <div
          className={`
          flex items-center gap-3 p-3 rounded-xl
          ${
            tier.name === 'enterprise'
              ? 'bg-gradient-to-r from-violet-100 to-fuchsia-pink-100 dark:from-violet-950/50 dark:to-fuchsia-pink-950/50 border border-violet-200 dark:border-violet-800/30'
              : tier.name === 'pro'
                ? 'bg-gradient-to-r from-fuchsia-pink-100 to-primary/10 dark:from-fuchsia-pink-950/50 dark:to-primary/10 border border-fuchsia-pink-200 dark:border-fuchsia-pink-800/30'
                : 'bg-cod-gray-100 dark:bg-cod-gray-800 border border-cod-gray-200 dark:border-cod-gray-700'
          }
        `}
        >
          <div
            className={`
            w-10 h-10 rounded-lg flex items-center justify-center
            ${
              tier.name === 'enterprise'
                ? 'bg-gradient-to-br from-violet-600 to-fuchsia-pink-600 text-white'
                : tier.name === 'pro'
                  ? 'bg-gradient-to-br from-fuchsia-pink-600 to-primary text-white'
                  : 'bg-cod-gray-200 dark:bg-cod-gray-700 text-cod-gray-600 dark:text-cod-gray-300'
            }
          `}
          >
            <TierIcon tier={tier.name} />
          </div>
          <div>
            <div className="font-semibold text-cod-gray-900 dark:text-white">
              {tier.displayName}
            </div>
            <div className="text-sm text-cod-gray-500 dark:text-cod-gray-400">
              {tier.price}
              {tier.period}
            </div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="p-5 border-b border-cod-gray-200 dark:border-cod-gray-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-cod-gray-700 dark:text-cod-gray-300">
          <TrendingUp className="w-4 h-4" />
          Usage This Month
        </div>

        <UsageBar
          label="Resumes"
          used={resumesCreated}
          total={tier.limits.maxResumes === Infinity ? null : tier.limits.maxResumes}
        />

        <UsageBar
          label="AI Optimizations"
          used={aiOptimizationsUsed}
          total={
            tier.limits.aiOptimizationsPerMonth === Infinity
              ? null
              : tier.limits.aiOptimizationsPerMonth
          }
        />

        {tier.name === 'enterprise' && (
          <UsageBar
            label="Team Members"
            used={teamMembersCount}
            total={tier.limits.teamSeats}
          />
        )}

        {!canCreateResume && tier.name === 'free' && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/30">
            <p className="text-xs text-amber-700 dark:text-amber-300">
              You've reached your resume limit. Upgrade to create more.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const hasAccess = canAccessFeature(item.requiredTier);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={hasAccess ? item.href : '#'}
              onClick={(e) => {
                if (!hasAccess) {
                  e.preventDefault();
                  onUpgradeClick?.();
                }
              }}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group
                ${
                  isActive(item.href)
                    ? 'bg-fuchsia-pink-100 dark:bg-fuchsia-pink-950/50 text-fuchsia-pink-700 dark:text-fuchsia-pink-300'
                    : hasAccess
                      ? 'text-cod-gray-600 dark:text-cod-gray-400 hover:bg-cod-gray-100 dark:hover:bg-cod-gray-800'
                      : 'text-cod-gray-400 dark:text-cod-gray-600 cursor-not-allowed'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {!hasAccess && <Lock className="w-4 h-4 text-cod-gray-400 dark:text-cod-gray-600" />}
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-medium bg-fuchsia-pink-100 dark:bg-fuchsia-pink-950 text-fuchsia-pink-700 dark:text-fuchsia-pink-300 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      {nextTier && (
        <div className="p-4 border-t border-cod-gray-200 dark:border-cod-gray-800">
          <div className="p-4 rounded-xl bg-gradient-to-br from-fuchsia-pink-50 to-primary/5 dark:from-fuchsia-pink-950/30 dark:to-primary/10 border border-fuchsia-pink-200 dark:border-fuchsia-pink-800/30">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-fuchsia-pink-600 dark:text-fuchsia-pink-400" />
              <span className="font-semibold text-cod-gray-900 dark:text-white">
                Upgrade to {nextTier.displayName}
              </span>
            </div>
            <p className="text-sm text-cod-gray-600 dark:text-cod-gray-400 mb-3">
              {tier.name === 'free'
                ? 'Unlock unlimited resumes and AI optimizations'
                : 'Get team management and analytics'}
            </p>
            <Button variant="primary" size="sm" className="w-full" onClick={onUpgradeClick}>
              Upgrade Now
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="p-4 border-t border-cod-gray-200 dark:border-cod-gray-800 space-y-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                ${
                  isActive(item.href)
                    ? 'bg-fuchsia-pink-100 dark:bg-fuchsia-pink-950/50 text-fuchsia-pink-700 dark:text-fuchsia-pink-300'
                    : 'text-cod-gray-600 dark:text-cod-gray-400 hover:bg-cod-gray-100 dark:hover:bg-cod-gray-800'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
