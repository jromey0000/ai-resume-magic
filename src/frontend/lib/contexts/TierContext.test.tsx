import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { TIER_CONFIGS, TierProvider, useTier, type TierName } from './TierContext';

function createWrapper(initialTier: TierName = 'free') {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <TierProvider initialTier={initialTier}>{children}</TierProvider>;
  };
}

describe('TierContext', () => {
  describe('TIER_CONFIGS', () => {
    it('defines free tier with correct limits', () => {
      const free = TIER_CONFIGS.free;
      expect(free.name).toBe('free');
      expect(free.displayName).toBe('Free');
      expect(free.limits.maxResumes).toBe(1);
      expect(free.limits.aiOptimizationsPerMonth).toBe(3);
      expect(free.limits.templates).toBe(3);
      expect(free.limits.hasJobMatching).toBe(false);
      expect(free.limits.hasCustomColors).toBe(false);
      expect(free.limits.hasTeamManagement).toBe(false);
    });

    it('defines pro tier with correct limits', () => {
      const pro = TIER_CONFIGS.pro;
      expect(pro.name).toBe('pro');
      expect(pro.displayName).toBe('Pro');
      expect(pro.limits.maxResumes).toBe(Infinity);
      expect(pro.limits.aiOptimizationsPerMonth).toBe(30);
      expect(pro.limits.templates).toBe(15);
      expect(pro.limits.hasJobMatching).toBe(true);
      expect(pro.limits.hasCustomColors).toBe(true);
      expect(pro.limits.hasTeamManagement).toBe(false);
    });

    it('defines enterprise tier with correct limits', () => {
      const enterprise = TIER_CONFIGS.enterprise;
      expect(enterprise.name).toBe('enterprise');
      expect(enterprise.displayName).toBe('Enterprise');
      expect(enterprise.limits.maxResumes).toBe(Infinity);
      expect(enterprise.limits.aiOptimizationsPerMonth).toBe(100);
      expect(enterprise.limits.teamSeats).toBe(5);
      expect(enterprise.limits.hasTeamManagement).toBe(true);
      expect(enterprise.limits.hasAnalytics).toBe(true);
      expect(enterprise.limits.hasApiAccess).toBe(true);
    });
  });

  describe('useTier hook', () => {
    it('throws when used outside TierProvider', () => {
      expect(() => {
        renderHook(() => useTier());
      }).toThrow('useTier must be used within a TierProvider');
    });

    it('returns correct initial tier', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      expect(result.current.tier.name).toBe('free');
    });

    it('allows tier switching', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      act(() => {
        result.current.setTier('pro');
      });

      expect(result.current.tier.name).toBe('pro');
    });
  });

  describe('usage tracking', () => {
    it('initializes with zero usage', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      expect(result.current.usage.resumesCreated).toBe(0);
      expect(result.current.usage.aiOptimizationsUsed).toBe(0);
    });

    it('updates usage correctly', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      act(() => {
        result.current.updateUsage({ resumesCreated: 1 });
      });

      expect(result.current.usage.resumesCreated).toBe(1);
      expect(result.current.usage.aiOptimizationsUsed).toBe(0);
    });

    it('tracks AI optimizations', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      act(() => {
        result.current.updateUsage({ aiOptimizationsUsed: 2 });
      });

      expect(result.current.usage.aiOptimizationsUsed).toBe(2);
    });
  });

  describe('canCreateResume', () => {
    it('returns true when under limit', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      expect(result.current.canCreateResume).toBe(true);
    });

    it('returns false when at limit', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      act(() => {
        result.current.updateUsage({ resumesCreated: 1 });
      });

      expect(result.current.canCreateResume).toBe(false);
    });

    it('always returns true for unlimited tiers', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      act(() => {
        result.current.updateUsage({ resumesCreated: 100 });
      });

      expect(result.current.canCreateResume).toBe(true);
    });
  });

  describe('canUseAIOptimization', () => {
    it('returns true when under limit', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      expect(result.current.canUseAIOptimization).toBe(true);
    });

    it('returns false when at limit', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      act(() => {
        result.current.updateUsage({ aiOptimizationsUsed: 3 });
      });

      expect(result.current.canUseAIOptimization).toBe(false);
    });

    it('returns true when under monthly cap', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      act(() => {
        result.current.updateUsage({ aiOptimizationsUsed: 29 });
      });

      expect(result.current.canUseAIOptimization).toBe(true);
    });
  });

  describe('remainingResumes', () => {
    it('calculates remaining correctly for free tier', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      expect(result.current.remainingResumes).toBe(1);

      act(() => {
        result.current.updateUsage({ resumesCreated: 1 });
      });

      expect(result.current.remainingResumes).toBe(0);
    });

    it('returns Infinity for unlimited tiers', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      expect(result.current.remainingResumes).toBe(Infinity);
    });

    it('never goes below zero', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      act(() => {
        result.current.updateUsage({ resumesCreated: 5 });
      });

      expect(result.current.remainingResumes).toBe(0);
    });
  });

  describe('remainingOptimizations', () => {
    it('calculates remaining correctly for free tier', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      expect(result.current.remainingOptimizations).toBe(3);

      act(() => {
        result.current.updateUsage({ aiOptimizationsUsed: 2 });
      });

      expect(result.current.remainingOptimizations).toBe(1);
    });

    it('returns remaining count for capped tiers', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('enterprise'),
      });

      expect(result.current.remainingOptimizations).toBe(100);
    });
  });

  describe('usagePercentage', () => {
    it('calculates resume percentage correctly', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      expect(result.current.usagePercentage.resumes).toBe(0);

      act(() => {
        result.current.updateUsage({ resumesCreated: 1 });
      });

      expect(result.current.usagePercentage.resumes).toBe(100);
    });

    it('calculates optimization percentage correctly', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      act(() => {
        result.current.updateUsage({ aiOptimizationsUsed: 1 });
      });

      expect(result.current.usagePercentage.optimizations).toBeCloseTo(33.33, 1);
    });

    it('returns 0 for unlimited tiers', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      act(() => {
        result.current.updateUsage({ resumesCreated: 100 });
      });

      expect(result.current.usagePercentage.resumes).toBe(0);
      expect(result.current.usagePercentage.optimizations).toBe(0);
    });
  });

  describe('tier transitions', () => {
    it('preserves usage when upgrading', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('free'),
      });

      act(() => {
        result.current.updateUsage({
          resumesCreated: 1,
          aiOptimizationsUsed: 2,
        });
      });

      act(() => {
        result.current.setTier('pro');
      });

      expect(result.current.usage.resumesCreated).toBe(1);
      expect(result.current.usage.aiOptimizationsUsed).toBe(2);
      expect(result.current.canCreateResume).toBe(true);
      expect(result.current.canUseAIOptimization).toBe(true);
    });

    it('applies new limits when downgrading', () => {
      const { result } = renderHook(() => useTier(), {
        wrapper: createWrapper('pro'),
      });

      act(() => {
        result.current.updateUsage({
          resumesCreated: 5,
          aiOptimizationsUsed: 10,
        });
      });

      act(() => {
        result.current.setTier('free');
      });

      expect(result.current.usage.resumesCreated).toBe(5);
      expect(result.current.canCreateResume).toBe(false);
      expect(result.current.canUseAIOptimization).toBe(false);
      expect(result.current.remainingResumes).toBe(0);
    });
  });
});
