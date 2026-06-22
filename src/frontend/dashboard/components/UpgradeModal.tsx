import { Building2, Check, Crown, Sparkles, X, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import { TIER_CONFIGS, type TierName, useTier } from '@/lib/contexts/TierContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeatureRow {
  label: string;
  free: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

const featureComparison: FeatureRow[] = [
  { label: 'Resumes', free: '1', pro: 'Unlimited', enterprise: 'Unlimited' },
  { label: 'AI Optimizations', free: '3/month', pro: 'Unlimited', enterprise: 'Unlimited' },
  { label: 'ATS Scoring', free: 'Basic', pro: 'Advanced', enterprise: 'Advanced' },
  { label: 'Templates', free: '2', pro: '15+', enterprise: '15+' },
  { label: 'Export Formats', free: 'PDF', pro: 'PDF', enterprise: 'PDF' },
  { label: 'Job Matching', free: true, pro: true, enterprise: true },
  { label: 'Resume Duplication', free: false, pro: true, enterprise: true },
  { label: 'Team Management', free: false, pro: false, enterprise: '5 seats' },
  { label: 'Analytics Dashboard', free: false, pro: false, enterprise: true },
  { label: 'White-label Exports', free: false, pro: false, enterprise: true },
  { label: 'Custom Branding', free: false, pro: false, enterprise: true },
  { label: 'API Access', free: false, pro: false, enterprise: true },
  { label: 'Bulk Processing', free: false, pro: false, enterprise: true },
  { label: 'Priority Support', free: false, pro: false, enterprise: true },
];

function TierIcon({ tier, size = 'md' }: { tier: TierName; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  switch (tier) {
    case 'enterprise':
      return <Building2 className={sizeClasses[size]} />;
    case 'pro':
      return <Crown className={sizeClasses[size]} />;
    default:
      return <Sparkles className={sizeClasses[size]} />;
  }
}

function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-teal-500" />
    ) : (
      <X className="w-5 h-5 text-cod-gray-300 dark:text-cod-gray-600" />
    );
  }
  return <span className="text-sm font-medium">{value}</span>;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { tier: currentTier, setTier } = useTier();

  if (!isOpen) return null;

  const tiers: TierName[] = ['free', 'pro', 'enterprise'];

  const handleSelectTier = (tierName: TierName) => {
    setTier(tierName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm border-0 p-0 cursor-default"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-cod-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cod-gray-200 dark:border-cod-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-cod-gray-900 dark:text-white">
              Choose Your Plan
            </h2>
            <p className="text-cod-gray-500 dark:text-cod-gray-400 mt-1">
              Unlock more features to supercharge your job search
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-cod-gray-100 dark:hover:bg-cod-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-cod-gray-500" />
          </button>
        </div>

        {/* Tier Cards */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {tiers.map((tierName) => {
              const tierConfig = TIER_CONFIGS[tierName];
              const isCurrentTier = currentTier.name === tierName;
              const isPro = tierName === 'pro';

              return (
                <div
                  key={tierName}
                  className={`
                    relative rounded-xl p-6 border-2 transition-all
                    ${
                      isPro
                        ? 'border-fuchsia-pink-500 bg-gradient-to-br from-fuchsia-pink-50 to-white dark:from-fuchsia-pink-950/30 dark:to-cod-gray-900'
                        : isCurrentTier
                          ? 'border-fuchsia-pink-300 dark:border-fuchsia-pink-700 bg-cod-gray-50 dark:bg-cod-gray-800'
                          : 'border-cod-gray-200 dark:border-cod-gray-700 bg-white dark:bg-cod-gray-900'
                    }
                  `}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-fuchsia-pink-500 to-primary text-white rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${
                        tierName === 'enterprise'
                          ? 'bg-gradient-to-br from-violet-600 to-fuchsia-pink-600 text-white'
                          : tierName === 'pro'
                            ? 'bg-gradient-to-br from-fuchsia-pink-600 to-primary text-white'
                            : 'bg-cod-gray-200 dark:bg-cod-gray-700 text-cod-gray-600 dark:text-cod-gray-300'
                      }
                    `}
                    >
                      <TierIcon tier={tierName} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-cod-gray-900 dark:text-white">
                        {tierConfig.displayName}
                      </h3>
                      {isCurrentTier && (
                        <span className="text-xs text-fuchsia-pink-600 dark:text-fuchsia-pink-400 font-medium">
                          Current Plan
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-cod-gray-900 dark:text-white">
                      {tierConfig.price}
                    </span>
                    <span className="text-cod-gray-500 dark:text-cod-gray-400">
                      {tierConfig.period}
                    </span>
                  </div>

                  <Button
                    variant={isPro ? 'primary' : 'ghost'}
                    className="w-full"
                    onClick={() => handleSelectTier(tierName)}
                    disabled={isCurrentTier}
                  >
                    {isCurrentTier
                      ? 'Current Plan'
                      : tierName === 'enterprise'
                        ? 'Contact Sales'
                        : 'Select Plan'}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Feature Comparison Table */}
          <div className="rounded-xl border border-cod-gray-200 dark:border-cod-gray-700 overflow-hidden">
            <div className="bg-cod-gray-50 dark:bg-cod-gray-800 px-6 py-3 border-b border-cod-gray-200 dark:border-cod-gray-700">
              <h3 className="font-semibold text-cod-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-fuchsia-pink-500" />
                Feature Comparison
              </h3>
            </div>

            <div className="divide-y divide-cod-gray-200 dark:divide-cod-gray-700">
              {/* Header Row */}
              <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-white dark:bg-cod-gray-900">
                <div className="text-sm font-medium text-cod-gray-500 dark:text-cod-gray-400">
                  Feature
                </div>
                {tiers.map((tierName) => (
                  <div key={tierName} className="text-center">
                    <span
                      className={`
                      text-sm font-semibold
                      ${
                        currentTier.name === tierName
                          ? 'text-fuchsia-pink-600 dark:text-fuchsia-pink-400'
                          : 'text-cod-gray-900 dark:text-white'
                      }
                    `}
                    >
                      {TIER_CONFIGS[tierName].displayName}
                    </span>
                  </div>
                ))}
              </div>

              {/* Feature Rows */}
              {featureComparison.map((feature, index) => (
                <div
                  key={feature.label}
                  className={`
                    grid grid-cols-4 gap-4 px-6 py-3
                    ${index % 2 === 0 ? 'bg-white dark:bg-cod-gray-900' : 'bg-cod-gray-50 dark:bg-cod-gray-800/50'}
                  `}
                >
                  <div className="text-sm text-cod-gray-700 dark:text-cod-gray-300">
                    {feature.label}
                  </div>
                  <div className="flex justify-center items-center text-cod-gray-900 dark:text-white">
                    <FeatureValue value={feature.free} />
                  </div>
                  <div className="flex justify-center items-center text-cod-gray-900 dark:text-white">
                    <FeatureValue value={feature.pro} />
                  </div>
                  <div className="flex justify-center items-center text-cod-gray-900 dark:text-white">
                    <FeatureValue value={feature.enterprise} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-6 text-center">
            <p className="text-sm text-cod-gray-500 dark:text-cod-gray-400">
              All plans include a 7-day money-back guarantee. No questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
