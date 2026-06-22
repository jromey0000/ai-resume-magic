import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { TierProvider, useTier } from './TierContext';

function createWrapper(initialTier: 'free' | 'pro' | 'enterprise' = 'free') {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <TierProvider initialTier={initialTier}>{children}</TierProvider>;
  };
}

describe('Tier Upgrade/Downgrade Integration', () => {
  describe('Free to Pro upgrade flow', () => {
    it('unlocks unlimited resumes after upgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      expect(result.current.tier.limits.maxResumes).toBe(1);
      expect(result.current.remainingResumes).toBe(1);

      act(() => {
        result.current.updateUsage({ resumesCreated: 1 });
      });

      expect(result.current.canCreateResume).toBe(false);

      act(() => {
        result.current.setTier('pro');
      });

      expect(result.current.canCreateResume).toBe(true);
      expect(result.current.remainingResumes).toBe(Infinity);
    });

    it('unlocks higher AI optimization cap after upgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      act(() => {
        result.current.updateUsage({ aiOptimizationsUsed: 3 });
      });

      expect(result.current.canUseAIOptimization).toBe(false);
      expect(result.current.remainingOptimizations).toBe(0);

      act(() => {
        result.current.setTier('pro');
      });

      expect(result.current.canUseAIOptimization).toBe(true);
      expect(result.current.remainingOptimizations).toBe(27);
    });

    it('unlocks job matching feature after upgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      expect(result.current.tier.limits.hasJobMatching).toBe(false);

      act(() => {
        result.current.setTier('pro');
      });

      expect(result.current.tier.limits.hasJobMatching).toBe(true);
    });

    it('unlocks custom colors after upgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      expect(result.current.tier.limits.hasCustomColors).toBe(false);

      act(() => {
        result.current.setTier('pro');
      });

      expect(result.current.tier.limits.hasCustomColors).toBe(true);
    });

    it('unlocks more templates after upgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      expect(result.current.tier.limits.templates).toBe(3);

      act(() => {
        result.current.setTier('pro');
      });

      expect(result.current.tier.limits.templates).toBe(15);
    });
  });

  describe('Pro to Enterprise upgrade flow', () => {
    it('unlocks team management after upgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      expect(result.current.tier.limits.hasTeamManagement).toBe(false);
      expect(result.current.tier.limits.teamSeats).toBe(0);

      act(() => {
        result.current.setTier('enterprise');
      });

      expect(result.current.tier.limits.hasTeamManagement).toBe(true);
      expect(result.current.tier.limits.teamSeats).toBe(5);
    });

    it('unlocks analytics after upgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      expect(result.current.tier.limits.hasAnalytics).toBe(false);

      act(() => {
        result.current.setTier('enterprise');
      });

      expect(result.current.tier.limits.hasAnalytics).toBe(true);
    });

    it('unlocks API access after upgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      expect(result.current.tier.limits.hasApiAccess).toBe(false);

      act(() => {
        result.current.setTier('enterprise');
      });

      expect(result.current.tier.limits.hasApiAccess).toBe(true);
    });

    it('unlocks bulk processing after upgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      expect(result.current.tier.limits.hasBulkProcessing).toBe(false);

      act(() => {
        result.current.setTier('enterprise');
      });

      expect(result.current.tier.limits.hasBulkProcessing).toBe(true);
    });
  });

  describe('Pro to Free downgrade flow', () => {
    it('enforces resume limit after downgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      act(() => {
        result.current.updateUsage({ resumesCreated: 5 });
      });

      expect(result.current.canCreateResume).toBe(true);

      act(() => {
        result.current.setTier('free');
      });

      expect(result.current.canCreateResume).toBe(false);
      expect(result.current.remainingResumes).toBe(0);
      expect(result.current.usage.resumesCreated).toBe(5);
    });

    it('enforces AI optimization limit after downgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      act(() => {
        result.current.updateUsage({ aiOptimizationsUsed: 10 });
      });

      expect(result.current.canUseAIOptimization).toBe(true);

      act(() => {
        result.current.setTier('free');
      });

      expect(result.current.canUseAIOptimization).toBe(false);
      expect(result.current.remainingOptimizations).toBe(0);
    });

    it('locks job matching feature after downgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      expect(result.current.tier.limits.hasJobMatching).toBe(true);

      act(() => {
        result.current.setTier('free');
      });

      expect(result.current.tier.limits.hasJobMatching).toBe(false);
    });

    it('locks custom colors after downgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      expect(result.current.tier.limits.hasCustomColors).toBe(true);

      act(() => {
        result.current.setTier('free');
      });

      expect(result.current.tier.limits.hasCustomColors).toBe(false);
    });
  });

  describe('Enterprise to Pro downgrade flow', () => {
    it('locks team management after downgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('enterprise'),
      });

      act(() => {
        result.current.updateUsage({ teamMembersCount: 4 });
      });

      expect(result.current.tier.limits.hasTeamManagement).toBe(true);

      act(() => {
        result.current.setTier('pro');
      });

      expect(result.current.tier.limits.hasTeamManagement).toBe(false);
      expect(result.current.usage.teamMembersCount).toBe(4);
    });

    it('locks analytics after downgrade', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('enterprise'),
      });

      expect(result.current.tier.limits.hasAnalytics).toBe(true);

      act(() => {
        result.current.setTier('pro');
      });

      expect(result.current.tier.limits.hasAnalytics).toBe(false);
    });

    it('applies pro optimization cap after downgrade from enterprise', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('enterprise'),
      });

      act(() => {
        result.current.updateUsage({
          resumesCreated: 100,
          aiOptimizationsUsed: 500,
        });
      });

      act(() => {
        result.current.setTier('pro');
      });

      expect(result.current.canCreateResume).toBe(true);
      expect(result.current.canUseAIOptimization).toBe(false);
      expect(result.current.remainingResumes).toBe(Infinity);
      expect(result.current.remainingOptimizations).toBe(0);
    });
  });

  describe('Usage tracking across tiers', () => {
    it('preserves all usage data through multiple tier changes', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      act(() => {
        result.current.updateUsage({
          resumesCreated: 1,
          aiOptimizationsUsed: 2,
          teamMembersCount: 1,
        });
      });

      act(() => {
        result.current.setTier('pro');
      });

      expect(result.current.usage.resumesCreated).toBe(1);
      expect(result.current.usage.aiOptimizationsUsed).toBe(2);

      act(() => {
        result.current.setTier('enterprise');
      });

      expect(result.current.usage.resumesCreated).toBe(1);
      expect(result.current.usage.aiOptimizationsUsed).toBe(2);

      act(() => {
        result.current.setTier('free');
      });

      expect(result.current.usage.resumesCreated).toBe(1);
      expect(result.current.usage.aiOptimizationsUsed).toBe(2);
    });

    it('calculates correct percentages for different tiers', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      act(() => {
        result.current.updateUsage({
          resumesCreated: 1,
          aiOptimizationsUsed: 1,
        });
      });

      expect(result.current.usagePercentage.resumes).toBe(100);
      expect(result.current.usagePercentage.optimizations).toBeCloseTo(33.33, 1);

      act(() => {
        result.current.setTier('pro');
      });

      expect(result.current.usagePercentage.resumes).toBe(0);
      expect(result.current.usagePercentage.optimizations).toBeCloseTo(3.33, 1);
    });
  });

  describe('Feature access combinations', () => {
    it('free tier has minimal features', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      const limits = result.current.tier.limits;
      expect(limits.hasJobMatching).toBe(false);
      expect(limits.hasVersionHistory).toBe(false);
      expect(limits.hasAdvancedATS).toBe(false);
      expect(limits.hasCustomColors).toBe(false);
      expect(limits.hasTeamManagement).toBe(false);
      expect(limits.hasAnalytics).toBe(false);
      expect(limits.hasWhiteLabel).toBe(false);
      expect(limits.hasApiAccess).toBe(false);
      expect(limits.hasBulkProcessing).toBe(false);
      expect(limits.hasPrioritySupport).toBe(false);
    });

    it('pro tier has individual features but not team features', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      const limits = result.current.tier.limits;
      expect(limits.hasJobMatching).toBe(true);
      expect(limits.hasVersionHistory).toBe(true);
      expect(limits.hasAdvancedATS).toBe(true);
      expect(limits.hasCustomColors).toBe(true);
      expect(limits.hasTeamManagement).toBe(false);
      expect(limits.hasAnalytics).toBe(false);
      expect(limits.hasWhiteLabel).toBe(false);
      expect(limits.hasApiAccess).toBe(false);
      expect(limits.hasBulkProcessing).toBe(false);
      expect(limits.hasPrioritySupport).toBe(false);
    });

    it('enterprise tier has all features', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('enterprise'),
      });

      const limits = result.current.tier.limits;
      expect(limits.hasJobMatching).toBe(true);
      expect(limits.hasVersionHistory).toBe(true);
      expect(limits.hasAdvancedATS).toBe(true);
      expect(limits.hasCustomColors).toBe(true);
      expect(limits.hasTeamManagement).toBe(true);
      expect(limits.hasAnalytics).toBe(true);
      expect(limits.hasWhiteLabel).toBe(true);
      expect(limits.hasApiAccess).toBe(true);
      expect(limits.hasBulkProcessing).toBe(true);
      expect(limits.hasPrioritySupport).toBe(true);
    });
  });
});
