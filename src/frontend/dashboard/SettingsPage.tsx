import { UserButton, useUser } from '@clerk/clerk-react';
import { Crown, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTier } from '@/lib/contexts/TierContext';

export default function SettingsPage() {
  const { user } = useUser();
  const { tier } = useTier();

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
          <CardContent className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {tier.name === 'pro' || tier.name === 'enterprise' ? (
                <Crown className="w-5 h-5 text-primary" />
              ) : (
                <Sparkles className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <p className="font-semibold">{tier.displayName}</p>
              <p className="text-sm text-muted-foreground">
                {tier.price}
                {tier.period}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
