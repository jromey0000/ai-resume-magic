import { type ReactNode } from 'react';
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
  period: 'forever' | 'one-time';
  limits: TierLimits;
}
declare const TIER_CONFIGS: Record<TierName, TierInfo>;
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
interface TierProviderProps {
  children: ReactNode;
  initialTier?: TierName;
}
export declare function TierProvider({
  children,
  initialTier,
}: TierProviderProps): import('react').JSX.Element;
export declare function useTier(): TierContextValue;
export { TIER_CONFIGS };
