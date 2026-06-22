import {
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  History,
  RefreshCw,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useTier } from '@/lib/contexts/TierContext';
import { cn } from '@/lib/utils';
import { useNotification } from '@/lib/utils/hooks';

export interface ResumeVersion {
  id: string;
  createdAt: Date;
  label: string;
  atsScore?: number;
  changesSummary: string;
  data: Partial<ResumeInfo>;
}

const MOCK_VERSIONS: ResumeVersion[] = [
  {
    id: 'v3',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    label: 'Current',
    atsScore: 87,
    changesSummary: 'Added Python and AWS skills',
    data: {},
  },
  {
    id: 'v2',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    label: 'Yesterday',
    atsScore: 72,
    changesSummary: 'Updated work experience descriptions',
    data: {},
  },
  {
    id: 'v1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    label: 'Initial version',
    atsScore: 65,
    changesSummary: 'Created resume from template',
    data: {},
  },
];

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  versions?: ResumeVersion[];
  onRestore?: (version: ResumeVersion) => void;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function VersionHistory({
  isOpen,
  onClose,
  versions = MOCK_VERSIONS,
  onRestore,
}: VersionHistoryProps) {
  const { tier } = useTier();
  const { reset } = useFormContext<ResumeInfo>();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const hasVersionHistory = tier.limits.hasVersionHistory;

  if (!isOpen) return null;

  const handleRestore = async (version: ResumeVersion) => {
    setIsRestoring(true);
    setSelectedVersion(version.id);

    await new Promise((r) => setTimeout(r, 500));

    if (onRestore) {
      onRestore(version);
    } else if (Object.keys(version.data).length > 0) {
      reset(version.data as ResumeInfo);
    }

    addNotification({
      title: 'Version restored',
      message: `Restored to "${version.label}" version`,
    });

    setIsRestoring(false);
    setSelectedVersion(null);
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

      <div className="relative bg-background rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden border">
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                Version History
                {!hasVersionHistory && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Crown className="w-3 h-3" /> Pro
                  </Badge>
                )}
              </h2>
              <p className="text-sm text-muted-foreground">Restore previous versions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!hasVersionHistory ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Unlock Version History</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Upgrade to Pro to access version history. Never lose your work and easily restore
              previous versions of your resume.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                Automatic snapshots
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                One-click restore
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                Compare versions
              </span>
            </div>
            <Button variant="primary" onClick={() => { onClose(); navigate('/dashboard/settings'); }}>
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </Button>
          </div>
        ) : (
          <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
            {versions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No versions yet</p>
                <p className="text-sm">Versions are created automatically as you edit</p>
              </div>
            ) : (
              versions.map((version, index) => {
                const isCurrent = index === 0;
                const isSelected = selectedVersion === version.id;

                return (
                  <div
                    key={version.id}
                    className={cn(
                      'p-4 rounded-xl border transition-all',
                      isCurrent
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{version.label}</span>
                          {isCurrent && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                          {version.atsScore && (
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-xs',
                                version.atsScore >= 80
                                  ? 'border-teal-500 text-teal-600'
                                  : version.atsScore >= 60
                                    ? 'border-amber-500 text-amber-600'
                                    : 'border-red-500 text-red-600'
                              )}
                            >
                              ATS {version.atsScore}%
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {version.changesSummary}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatRelativeTime(version.createdAt)}
                        </div>
                      </div>

                      {!isCurrent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestore(version)}
                          disabled={isRestoring}
                          className="flex items-center gap-1.5"
                        >
                          {isSelected && isRestoring ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VersionHistory;
