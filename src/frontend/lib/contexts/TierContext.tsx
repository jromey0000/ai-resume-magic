import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type TierName = 'free' | 'pro' | 'enterprise';

export interface TierLimits {
  maxResumes: number;
  aiOptimizationsPerMonth: number;
  templates: number;
  exportFormats: string[];
  hasJobMatching: boolean;
  hasVersionHistory: boolean;
  hasAdvancedATS: boolean;
  hasCustomColors: boolean;
  hasTeamManagement: boolean;
  teamSeats: number;
  hasAnalytics: boolean;
  hasWhiteLabel: boolean;
  hasApiAccess: boolean;
  hasBulkProcessing: boolean;
  hasPrioritySupport: boolean;
}

export interface UsageStats {
  resumesCreated: number;
  aiOptimizationsUsed: number;
  aiOptimizationsResetDate: Date;
  teamMembersCount: number;
}

export interface TierInfo {
  name: TierName;
  displayName: string;
  price: string;
  period: 'forever' | 'one-time';
  limits: TierLimits;
}

/**
 * One-Time Pricing based on actual service costs:
 * - Clerk: $0.02/MAU after 10K free
 * - Stripe: 2.9% + $0.30 per transaction
 * - OpenAI: ~$0.05 per AI optimization (GPT-4 Turbo)
 * - Hostinger VPS: ~$16/month
 * 
 * AI limits are capped to ensure sustainable margins (27-39%).
 * See /lib/pricing-costs.ts for detailed breakdown.
 */
const TIER_CONFIGS: Record<TierName, TierInfo> = {
  free: {
    name: 'free',
    displayName: 'Free',
    price: '$0',
    period: 'forever',
    limits: {
      maxResumes: 1,
      aiOptimizationsPerMonth: 3,
      templates: 3,
      exportFormats: ['PDF'],
      hasJobMatching: false,
      hasVersionHistory: false,
      hasAdvancedATS: false,
      hasCustomColors: false,
      hasTeamManagement: false,
      teamSeats: 0,
      hasAnalytics: false,
      hasWhiteLabel: false,
      hasApiAccess: false,
      hasBulkProcessing: false,
      hasPrioritySupport: false,
    },
  },
  pro: {
    name: 'pro',
    displayName: 'Pro',
    price: '$79',
    period: 'one-time',
    limits: {
      maxResumes: Infinity,
      aiOptimizationsPerMonth: 30,
      templates: 15,
      exportFormats: ['PDF', 'DOCX', 'TXT'],
      hasJobMatching: true,
      hasVersionHistory: true,
      hasAdvancedATS: true,
      hasCustomColors: true,
      hasTeamManagement: false,
      teamSeats: 0,
      hasAnalytics: false,
      hasWhiteLabel: false,
      hasApiAccess: false,
      hasBulkProcessing: false,
      hasPrioritySupport: false,
    },
  },
  enterprise: {
    name: 'enterprise',
    displayName: 'Enterprise',
    price: '$249',
    period: 'one-time',
    limits: {
      maxResumes: Infinity,
      aiOptimizationsPerMonth: 100,
      templates: 15,
      exportFormats: ['PDF', 'DOCX', 'TXT'],
      hasJobMatching: true,
      hasVersionHistory: true,
      hasAdvancedATS: true,
      hasCustomColors: true,
      hasTeamManagement: true,
      teamSeats: 5,
      hasAnalytics: true,
      hasWhiteLabel: true,
      hasApiAccess: true,
      hasBulkProcessing: true,
      hasPrioritySupport: true,
    },
  },
};

export interface UsageWarning {
  type: 'resumes' | 'optimizations' | 'team';
  severity: 'warning' | 'critical' | 'over_limit';
  message: string;
  percentage: number;
}

type UsageUpdate =
  | Partial<UsageStats>
  | ((previous: UsageStats) => Partial<UsageStats>);

interface TierContextValue {
  tier: TierInfo;
  usage: UsageStats;
  setTier: (tierName: TierName) => void;
  updateUsage: (updates: UsageUpdate) => void;
  syncResumeCount: (count: number) => void;
  canCreateResume: boolean;
  canUseAIOptimization: boolean;
  remainingResumes: number;
  remainingOptimizations: number;
  usagePercentage: {
    resumes: number;
    optimizations: number;
  };
  warnings: UsageWarning[];
  isOverLimit: boolean;
  dismissWarning: (type: UsageWarning['type']) => void;
}

const TierContext = createContext<TierContextValue | null>(null);

interface TierProviderProps {
  children: ReactNode;
  initialTier?: TierName;
}

export function TierProvider({ children, initialTier = 'free' }: TierProviderProps) {
  const [tierName, setTierName] = useState<TierName>(initialTier);
  const [usage, setUsage] = useState<UsageStats>({
    resumesCreated: 0,
    aiOptimizationsUsed: 0,
    aiOptimizationsResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    teamMembersCount: 1,
  });
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<UsageWarning['type']>>(new Set());

  const tier = TIER_CONFIGS[tierName];

  const setTier = useCallback((newTierName: TierName) => {
    setTierName(newTierName);
    setDismissedWarnings(new Set());
  }, []);

  const updateUsage = useCallback((updates: UsageUpdate) => {
    setUsage((prev) => ({
      ...prev,
      ...(typeof updates === 'function' ? updates(prev) : updates),
    }));
  }, []);

  const syncResumeCount = useCallback((count: number) => {
    setUsage((prev) =>
      prev.resumesCreated === count ? prev : { ...prev, resumesCreated: count }
    );
  }, []);

  const dismissWarning = useCallback((type: UsageWarning['type']) => {
    setDismissedWarnings((prev) => new Set(prev).add(type));
  }, []);

  const value = useMemo(() => {
    const remainingResumes =
      tier.limits.maxResumes === Infinity
        ? Infinity
        : Math.max(0, tier.limits.maxResumes - usage.resumesCreated);

    const remainingOptimizations =
      tier.limits.aiOptimizationsPerMonth === Infinity
        ? Infinity
        : Math.max(0, tier.limits.aiOptimizationsPerMonth - usage.aiOptimizationsUsed);

    const resumePercentage =
      tier.limits.maxResumes === Infinity
        ? 0
        : (usage.resumesCreated / tier.limits.maxResumes) * 100;

    const optimizationPercentage =
      tier.limits.aiOptimizationsPerMonth === Infinity
        ? 0
        : (usage.aiOptimizationsUsed / tier.limits.aiOptimizationsPerMonth) * 100;

    const teamPercentage =
      tier.limits.teamSeats === 0
        ? 0
        : (usage.teamMembersCount / tier.limits.teamSeats) * 100;

    const warnings: UsageWarning[] = [];

    if (tier.limits.maxResumes !== Infinity && !dismissedWarnings.has('resumes')) {
      if (resumePercentage > 100) {
        warnings.push({
          type: 'resumes',
          severity: 'over_limit',
          message: `You have ${usage.resumesCreated - tier.limits.maxResumes} resume(s) over your plan limit. Please delete some or upgrade.`,
          percentage: resumePercentage,
        });
      } else if (resumePercentage >= 100) {
        warnings.push({
          type: 'resumes',
          severity: 'critical',
          message: "You've reached your resume limit. Upgrade to create more.",
          percentage: resumePercentage,
        });
      } else if (resumePercentage >= 80) {
        warnings.push({
          type: 'resumes',
          severity: 'warning',
          message: `You're approaching your resume limit (${usage.resumesCreated}/${tier.limits.maxResumes}).`,
          percentage: resumePercentage,
        });
      }
    }

    if (tier.limits.aiOptimizationsPerMonth !== Infinity && !dismissedWarnings.has('optimizations')) {
      if (optimizationPercentage > 100) {
        warnings.push({
          type: 'optimizations',
          severity: 'over_limit',
          message: "You've exceeded your AI optimization limit. Upgrade or wait for reset.",
          percentage: optimizationPercentage,
        });
      } else if (optimizationPercentage >= 100) {
        warnings.push({
          type: 'optimizations',
          severity: 'critical',
          message: "You've used all your AI optimizations this month.",
          percentage: optimizationPercentage,
        });
      } else if (optimizationPercentage >= 67) {
        warnings.push({
          type: 'optimizations',
          severity: 'warning',
          message: `${tier.limits.aiOptimizationsPerMonth - usage.aiOptimizationsUsed} AI optimization(s) remaining this month.`,
          percentage: optimizationPercentage,
        });
      }
    }

    if (tier.limits.teamSeats > 0 && !dismissedWarnings.has('team')) {
      if (teamPercentage >= 100) {
        warnings.push({
          type: 'team',
          severity: 'critical',
          message: "You've reached your team member limit.",
          percentage: teamPercentage,
        });
      } else if (teamPercentage >= 80) {
        warnings.push({
          type: 'team',
          severity: 'warning',
          message: `You're approaching your team member limit (${usage.teamMembersCount}/${tier.limits.teamSeats}).`,
          percentage: teamPercentage,
        });
      }
    }

    const isOverLimit =
      (tier.limits.maxResumes !== Infinity && usage.resumesCreated > tier.limits.maxResumes) ||
      (tier.limits.aiOptimizationsPerMonth !== Infinity &&
        usage.aiOptimizationsUsed > tier.limits.aiOptimizationsPerMonth);

    return {
      tier,
      usage,
      setTier,
      updateUsage,
      syncResumeCount,
      canCreateResume: remainingResumes > 0,
      canUseAIOptimization: remainingOptimizations > 0,
      remainingResumes,
      remainingOptimizations,
      usagePercentage: {
        resumes: resumePercentage,
        optimizations: optimizationPercentage,
      },
      warnings,
      isOverLimit,
      dismissWarning,
    };
  }, [tier, usage, updateUsage, syncResumeCount, setTier, dismissedWarnings, dismissWarning]);

  return <TierContext.Provider value={value}>{children}</TierContext.Provider>;
}

export function useTier() {
  const context = useContext(TierContext);
  if (!context) {
    throw new Error('useTier must be used within a TierProvider');
  }
  return context;
}

export { TIER_CONFIGS };
