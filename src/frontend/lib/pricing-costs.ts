/**
 * Pricing Cost Breakdown & Margin Analysis
 * 
 * This file documents actual service costs to ensure sustainable pricing.
 * All costs are estimates based on typical usage patterns.
 */

export const SERVICE_COSTS = {
  /**
   * Clerk Authentication
   * - Free tier: 10,000 MAUs included
   * - After free tier: $0.02 per MAU per month
   * @see https://clerk.com/pricing
   */
  clerk: {
    freeMAUs: 10000,
    costPerMAU: 0.02,
    estimatedCostPerUserPerMonth: 0.02,
  },

  /**
   * Stripe Payment Processing
   * - Standard rate: 2.9% + $0.30 per successful charge
   * @see https://stripe.com/pricing
   */
  stripe: {
    percentageFee: 0.029,
    flatFee: 0.30,
    calculateFee: (amount: number) => amount * 0.029 + 0.30,
  },

  /**
   * Hostinger VPS Hosting
   * - KVM 2: ~$15/month (4GB RAM, 2 vCPU)
   * - Includes Strapi CMS (self-hosted)
   * - Domain: ~$12/year
   */
  hosting: {
    monthlyVPS: 15,
    annualDomain: 12,
    totalMonthly: 16,
  },

  /**
   * OpenAI API Costs (GPT-4 Turbo)
   * - Input: $0.01 per 1K tokens
   * - Output: $0.03 per 1K tokens
   * - Average resume optimization: ~800 input + 400 output tokens
   * - Estimated cost per AI optimization: $0.02 - $0.08
   * @see https://openai.com/pricing
   */
  openai: {
    inputCostPer1K: 0.01,
    outputCostPer1K: 0.03,
    avgInputTokens: 800,
    avgOutputTokens: 400,
    estimatedCostPerOptimization: 0.05,
  },
} as const;

/**
 * Pricing Tier Costs & Margins (One-Time Payment Model)
 * 
 * Key assumptions for one-time pricing:
 * - Average active user lifespan: 12-18 months
 * - AI costs are capped per month to ensure sustainability
 * - Target margin: 40-60% to cover support, dev, marketing, scaling
 */
export const TIER_ECONOMICS = {
  free: {
    price: 0,
    billing: 'forever',
    aiOpsPerMonth: 3,
    lifetimeCost: {
      aiCost: 3 * 12 * SERVICE_COSTS.openai.estimatedCostPerOptimization, // $1.80/year
      clerkCost: 0, // Within free tier
      total: 1.80,
    },
    margin: -100, // Loss leader for acquisition
    notes: 'Acquisition funnel - converts to paid',
  },

  pro: {
    price: 79,
    billing: 'one-time',
    aiOpsPerMonth: 30, // Capped for sustainability
    expectedLifetimeMonths: 18,
    lifetimeCost: {
      aiCost: 30 * 18 * SERVICE_COSTS.openai.estimatedCostPerOptimization, // $27
      clerkCost: 18 * SERVICE_COSTS.clerk.estimatedCostPerUserPerMonth, // $0.36
      hostingShare: 1.00, // Amortized
      stripeFee: SERVICE_COSTS.stripe.calculateFee(79), // $2.59
      total: 30.95,
    },
    lifetimeMargin: 79 - 30.95, // $48.05
    marginPercent: 61, // Healthy margin
    notes: 'Job seekers typically active 3-6 months, 30 AI/mo is plenty',
  },

  enterprise: {
    price: 249,
    billing: 'one-time',
    aiOpsPerMonth: 100, // Per team, capped for sustainability
    teamSeats: 5,
    expectedLifetimeMonths: 18,
    lifetimeCost: {
      aiCost: 100 * 18 * SERVICE_COSTS.openai.estimatedCostPerOptimization, // $90
      clerkCost: 5 * 18 * SERVICE_COSTS.clerk.estimatedCostPerUserPerMonth, // $1.80
      hostingShare: 3.00,
      stripeFee: SERVICE_COSTS.stripe.calculateFee(249), // $7.52
      prioritySupport: 10, // Estimated lifetime support cost
      total: 112.32,
    },
    lifetimeMargin: 249 - 112.32, // $136.68
    marginPercent: 55, // Healthy margin
    notes: 'Career coaches/recruiters - high value, repeat referrals',
  },
} as const;

/**
 * Summary of One-Time Pricing Strategy
 * 
 * | Tier       | Price  | AI Ops/mo | Lifetime Cost | Margin |
 * |------------|--------|-----------|---------------|--------|
 * | Free       | $0     | 3         | $1.80/yr      | Loss   |
 * | Pro        | $79    | 30        | $30.95        | 61%    |
 * | Enterprise | $249   | 100       | $112.32       | 55%    |
 * 
 * Why these AI limits work:
 * - Free (3/mo): Enough to try the product, converts to paid
 * - Pro (30/mo): Job seekers make ~10-20 applications/month
 * - Enterprise (100/mo): Teams processing multiple candidates
 * 
 * Margin buffer covers:
 * - Customer support
 * - Development costs  
 * - Marketing/acquisition
 * - Infrastructure scaling
 * - Heavy users (offset by light users)
 */
