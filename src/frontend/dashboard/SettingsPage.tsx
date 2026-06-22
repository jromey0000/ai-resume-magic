import { UserButton, useUser } from '@clerk/clerk-react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  Copy,
  CreditCard,
  Crown,
  Eye,
  EyeOff,
  ExternalLink,
  Key,
  Loader2,
  Plus,
  Receipt,
  Shield,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TIER_CONFIGS, type TierName, useTier } from '@/lib/contexts/TierContext';
import { cn } from '@/lib/utils';

interface BillingHistory {
  id: string;
  date: Date;
  description: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed: Date | null;
}

function ApiKeyRow({
  apiKey,
  onDelete,
  onCopy,
}: {
  apiKey: ApiKey;
  onDelete: (id: string) => void;
  onCopy: (key: string) => void;
}) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maskedKey = apiKey.key.slice(0, 8) + '••••••••••••••••' + apiKey.key.slice(-4);

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{apiKey.name}</span>
          <span className="text-xs text-muted-foreground">
            Created {apiKey.createdAt.toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <code className="text-xs bg-background px-2 py-1 rounded font-mono">
            {showKey ? apiKey.key : maskedKey}
          </code>
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label={showKey ? 'Hide key' : 'Show key'}
          >
            {showKey ? (
              <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Copy key"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-teal-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
        </div>
        {apiKey.lastUsed && (
          <p className="text-xs text-muted-foreground mt-1">
            Last used {apiKey.lastUsed.toLocaleDateString()}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDelete(apiKey.id)}
        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
        aria-label="Delete key"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useUser();
  const { tier, setTier } = useTier();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TierName | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [billingHistory] = useState<BillingHistory[]>([
    {
      id: '1',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      description: 'Pro Plan - One-time purchase',
      amount: '$79.00',
      status: 'paid',
    },
  ]);

  const hasApiAccess = tier.limits.hasApiAccess;
  const hasPrioritySupport = tier.limits.hasPrioritySupport;

  const handleUpgrade = async (planName: TierName) => {
    if (planName === tier.name) return;

    setSelectedPlan(planName);
    setShowUpgradeModal(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan) return;

    setIsProcessingPayment(true);
    await new Promise((r) => setTimeout(r, 2000));
    setTier(selectedPlan);
    setIsProcessingPayment(false);
    setShowUpgradeModal(false);
    setSelectedPlan(null);
  };

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'rm_';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    setIsCreatingKey(true);
    await new Promise((r) => setTimeout(r, 500));

    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: newKeyName.trim(),
      key: generateApiKey(),
      createdAt: new Date(),
      lastUsed: null,
    };

    setApiKeys((prev) => [...prev, newKey]);
    setNewlyCreatedKey(newKey.key);
    setNewKeyName('');
    setIsCreatingKey(false);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-light mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your account and plan.</p>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user?.fullName || 'User'}</p>
              <p className="text-sm text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <UserButton />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {tier.name === 'pro' || tier.name === 'enterprise' ? (
                  <Crown className="w-5 h-5 text-primary" />
                ) : (
                  <Sparkles className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{tier.displayName}</p>
                  {hasPrioritySupport && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                      <Shield className="w-3 h-3" />
                      Priority Support
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {tier.price} {tier.period}
                </p>
              </div>
            </div>

            {/* Plan Options */}
            <div className="grid gap-3">
              {(['free', 'pro', 'enterprise'] as TierName[]).map((planName) => {
                const plan = TIER_CONFIGS[planName];
                const isCurrent = tier.name === planName;
                const isUpgrade =
                  (tier.name === 'free' && (planName === 'pro' || planName === 'enterprise')) ||
                  (tier.name === 'pro' && planName === 'enterprise');
                const isDowngrade =
                  (tier.name === 'enterprise' && (planName === 'pro' || planName === 'free')) ||
                  (tier.name === 'pro' && planName === 'free');

                return (
                  <div
                    key={planName}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all',
                      isCurrent
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/30'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center',
                            planName === 'enterprise'
                              ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                              : planName === 'pro'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {planName === 'enterprise' ? (
                            <Shield className="w-4 h-4" />
                          ) : planName === 'pro' ? (
                            <Crown className="w-4 h-4" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{plan.displayName}</p>
                          <p className="text-sm text-muted-foreground">
                            {plan.price} {plan.period}
                          </p>
                        </div>
                      </div>
                      {isCurrent ? (
                        <span className="text-xs font-medium text-primary flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Current
                        </span>
                      ) : isUpgrade ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpgrade(planName)}
                          className="h-8"
                        >
                          <Zap className="w-3.5 h-3.5 mr-1" />
                          Upgrade
                        </Button>
                      ) : isDowngrade ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpgrade(planName)}
                          className="h-8 text-muted-foreground"
                        >
                          Downgrade
                        </Button>
                      ) : null}
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      {planName === 'free' && '1 resume, 3 AI optimizations/month, 2 templates'}
                      {planName === 'pro' &&
                        'Unlimited resumes & AI, 15 templates, job matching, version history'}
                      {planName === 'enterprise' &&
                        'Everything in Pro + team management, analytics, API access, white-label'}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Billing & Payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Billing & Payments</CardTitle>
              {tier.name !== 'free' && (
                <Button variant="outline" size="sm" className="h-8">
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  Manage in Stripe
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {tier.name === 'free' ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">No billing history</p>
                <p className="text-xs text-muted-foreground">
                  Upgrade to a paid plan to start building your billing history.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Payment Method */}
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/27</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8">
                    Update
                  </Button>
                </div>

                {/* Billing History */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Receipt className="w-4 h-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">Billing History</h4>
                  </div>
                  <div className="space-y-2">
                    {billingHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">{item.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.date.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{item.amount}</p>
                          <span
                            className={cn(
                              'text-xs px-2 py-0.5 rounded-full',
                              item.status === 'paid'
                                ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                : item.status === 'pending'
                                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            )}
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Access Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">API Access</CardTitle>
                <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                  Enterprise
                </span>
              </div>
              {hasApiAccess && apiKeys.length < 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewKeyModal(true)}
                  className="h-8"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Key
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {hasApiAccess ? (
              <div className="space-y-4">
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <Key className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      No API keys yet. Create one to start using the API.
                    </p>
                    <Button variant="primary" size="sm" onClick={() => setShowNewKeyModal(true)}>
                      <Plus className="w-4 h-4 mr-1" />
                      Create API Key
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {apiKeys.map((apiKey) => (
                      <ApiKeyRow
                        key={apiKey.id}
                        apiKey={apiKey}
                        onDelete={handleDeleteKey}
                        onCopy={handleCopyKey}
                      />
                    ))}
                    {apiKeys.length >= 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        Maximum of 5 API keys reached
                      </p>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">API Documentation</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Use your API key to integrate resume generation into your workflows.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <code className="text-xs font-mono">
                      curl -X POST https://api.resumemagic.io/v1/resumes \{'\n'}
                      {'  '}-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \{'\n'}
                      {'  '}-H &quot;Content-Type: application/json&quot; \{'\n'}
                      {'  '}-d &apos;{'{'}...resume_data{'}'}&apos;
                    </code>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                  <Key className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  API access is available on the Enterprise plan
                </p>
                <p className="text-xs text-muted-foreground">
                  Integrate resume generation into your own applications and workflows.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upgrade/Downgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              if (!isProcessingPayment) {
                setShowUpgradeModal(false);
                setSelectedPlan(null);
              }
            }}
            aria-label="Close"
          />
          <Card className="relative w-full max-w-md shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg">
                {tier.name === 'free' ||
                (tier.name === 'pro' && selectedPlan === 'enterprise')
                  ? 'Upgrade Plan'
                  : 'Change Plan'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">{tier.displayName}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 text-right">
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-medium">{TIER_CONFIGS[selectedPlan].displayName}</p>
                  </div>
                </div>

                {selectedPlan !== 'free' && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">One-time payment</span>
                      <span className="font-semibold">
                        {TIER_CONFIGS[selectedPlan].price}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Lifetime access, no recurring fees
                    </p>
                  </div>
                )}

                {selectedPlan === 'free' && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        <p className="font-medium mb-1">Downgrade Warning</p>
                        <p>
                          You&apos;ll lose access to premium features. If you have more than 1
                          resume, you&apos;ll need to delete some.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowUpgradeModal(false);
                      setSelectedPlan(null);
                    }}
                    disabled={isProcessingPayment}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleConfirmUpgrade}
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : selectedPlan === 'free' ? (
                      'Confirm Downgrade'
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay {TIER_CONFIGS[selectedPlan].price}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              setShowNewKeyModal(false);
              setNewlyCreatedKey(null);
              setNewKeyName('');
            }}
            aria-label="Close"
          />
          <Card className="relative w-full max-w-md shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg">
                {newlyCreatedKey ? 'API Key Created' : 'Create API Key'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {newlyCreatedKey ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Make sure to copy your API key now. You won&apos;t be able to see it again!
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <code className="text-sm font-mono break-all">{newlyCreatedKey}</code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(newlyCreatedKey);
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Key
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => {
                        setShowNewKeyModal(false);
                        setNewlyCreatedKey(null);
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="key-name" className="block text-sm font-medium mb-2">
                      Key Name
                    </label>
                    <input
                      id="key-name"
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production API"
                      className={cn(
                        'w-full px-3 py-2 rounded-lg border bg-background text-sm',
                        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowNewKeyModal(false);
                        setNewKeyName('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleCreateKey}
                      disabled={!newKeyName.trim() || isCreatingKey}
                    >
                      {isCreatingKey ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Key'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
