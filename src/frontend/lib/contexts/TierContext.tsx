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
  period: string;
  limits: TierLimits;
}

const TIER_CONFIGS: Record<TierName, TierInfo> = {
  free: {
    name: 'free',
    displayName: 'Free',
    price: '$0',
    period: 'forever',
    limits: {
      maxResumes: 1,
      aiOptimizationsPerMonth: 3,
      templates: 2,
      exportFormats: ['PDF'],
      hasJobMatching: false,
      hasVersionHistory: false,
      hasAdvancedATS: false,
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
    price: '$12',
    period: '/month',
    limits: {
      maxResumes: Infinity,
      aiOptimizationsPerMonth: Infinity,
      templates: 15,
      exportFormats: ['PDF', 'DOCX', 'TXT'],
      hasJobMatching: true,
      hasVersionHistory: true,
      hasAdvancedATS: true,
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
    price: '$29',
    period: '/month',
    limits: {
      maxResumes: Infinity,
      aiOptimizationsPerMonth: Infinity,
      templates: 15,
      exportFormats: ['PDF', 'DOCX', 'TXT'],
      hasJobMatching: true,
      hasVersionHistory: true,
      hasAdvancedATS: true,
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

interface TierContextValue {
  tier: TierInfo;
  usage: UsageStats;
  setTier: (tierName: TierName) => void;
  updateUsage: (updates: Partial<UsageStats>) => void;
  canCreateResume: boolean;
  canUseAIOptimization: boolean;
  remainingResumes: number;
  remainingOptimizations: number;
  usagePercentage: {
    resumes: number;
    optimizations: number;
  };
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

  const tier = TIER_CONFIGS[tierName];

  const setTier = useCallback((newTierName: TierName) => {
    setTierName(newTierName);
  }, []);

  const updateUsage = useCallback((updates: Partial<UsageStats>) => {
    setUsage((prev) => ({ ...prev, ...updates }));
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

    return {
      tier,
      usage,
      setTier,
      updateUsage,
      canCreateResume: remainingResumes > 0,
      canUseAIOptimization: remainingOptimizations > 0,
      remainingResumes,
      remainingOptimizations,
      usagePercentage: {
        resumes:
          tier.limits.maxResumes === Infinity
            ? 0
            : (usage.resumesCreated / tier.limits.maxResumes) * 100,
        optimizations:
          tier.limits.aiOptimizationsPerMonth === Infinity
            ? 0
            : (usage.aiOptimizationsUsed / tier.limits.aiOptimizationsPerMonth) * 100,
      },
    };
  }, [tier, usage, updateUsage, setTier]);

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
