import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  Crown,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  Lock,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import ResumePreviewContent from '@/dashboard/resume/ResumePreviewContent';
import { useTier } from '@/lib/contexts/TierContext';
import { cn } from '@/lib/utils';
import {
  ExportQuality,
  ExportStep,
  PaperSize,
  validateResumeForExport,
} from '@/lib/hooks/useExportPdf';
import { exportResumeToPdf } from '@/lib/utils/export-pdf';
import Button from './Button';

type ExportFormat = 'pdf' | 'docx' | 'txt';

interface FormatOption {
  value: ExportFormat;
  label: string;
  description: string;
  icon: React.ElementType;
  requiresPro: boolean;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeInfo: ResumeInfo;
  onSuccess?: () => void;
}

type ModalView = 'options' | 'exporting' | 'success' | 'error';

const QUALITY_OPTIONS: { value: ExportQuality; label: string; description: string }[] = [
  { value: 'standard', label: 'Standard', description: 'Optimized for file size (~200KB)' },
  { value: 'high', label: 'High Quality', description: 'Best for printing (~500KB)' },
];

const PAPER_OPTIONS: { value: PaperSize; label: string }[] = [
  { value: 'a4', label: 'A4 (210 × 297 mm)' },
  { value: 'letter', label: 'US Letter (8.5 × 11 in)' },
];

const FORMAT_OPTIONS: FormatOption[] = [
  {
    value: 'pdf',
    label: 'PDF',
    description: 'Best for ATS systems',
    icon: FileText,
    requiresPro: false,
  },
  {
    value: 'docx',
    label: 'Word (.docx)',
    description: 'Editable document',
    icon: FileSpreadsheet,
    requiresPro: true,
  },
  {
    value: 'txt',
    label: 'Plain Text',
    description: 'Simple text format',
    icon: FileText,
    requiresPro: true,
  },
];

const EXPORT_STEPS: { step: ExportStep; label: string }[] = [
  { step: 'validating', label: 'Validating' },
  { step: 'preparing', label: 'Preparing' },
  { step: 'rendering', label: 'Rendering' },
  { step: 'generating', label: 'Creating PDF' },
  { step: 'complete', label: 'Complete' },
];

const RESUME_PREVIEW_WIDTH = 816;

function ExportModal({ isOpen, onClose, resumeInfo, onSuccess }: ExportModalProps) {
  const [view, setView] = useState<ModalView>('options');
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [quality, setQuality] = useState<ExportQuality>('standard');
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [whiteLabel, setWhiteLabel] = useState(false);
  const [currentStep, setCurrentStep] = useState<ExportStep>('validating');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { tier } = useTier();

  const validation = useMemo(
    () => (isOpen ? validateResumeForExport(resumeInfo) : null),
    [isOpen, resumeInfo]
  );

  const hasProExportFormats = tier.limits.exportFormats.includes('DOCX');
  const hasWhiteLabel = tier.limits.hasWhiteLabel;

  useEffect(() => {
    if (!isOpen) return;
    setView('options');
    setCurrentStep('validating');
    setProgress(0);
    setError(null);
  }, [isOpen]);

  const handleExport = useCallback(async () => {
    setView('exporting');
    setCurrentStep('validating');
    setProgress(5);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 400));
      setCurrentStep('preparing');
      setProgress(15);

      const filename =
        [resumeInfo.firstName, resumeInfo.lastName].filter(Boolean).join('_') || 'resume';

      const previewElementId =
        document.getElementById('resume-preview')?.offsetParent !== null
          ? 'resume-preview'
          : 'export-modal-preview';

      await exportResumeToPdf(previewElementId, `${filename}-resume`, {
        quality,
        paperSize,
        onProgress: (step, prog) => {
          setCurrentStep(step);
          setProgress(prog);
        },
      });

      setCurrentStep('complete');
      setProgress(100);
      await new Promise((r) => setTimeout(r, 500));
      setView('success');
      onSuccess?.();
    } catch (err) {
      console.error('Export failed:', err);
      setError(err instanceof Error ? err.message : 'Export failed. Please try again.');
      setView('error');
    }
  }, [resumeInfo, quality, paperSize, onSuccess]);

  const handleClose = useCallback(() => {
    if (view === 'exporting') return;
    onClose();
  }, [view, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && view !== 'exporting') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, view, handleClose]);

  if (!isOpen) return null;

  const errors = validation?.issues.filter((i) => i.severity === 'error') ?? [];
  const warnings = validation?.issues.filter((i) => i.severity === 'warning') ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity border-0 p-0 cursor-default"
        aria-label="Close dialog"
        onClick={handleClose}
        disabled={view === 'exporting'}
      />

      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {view !== 'exporting' && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 rounded-full p-2 bg-muted hover:bg-muted/80 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {view === 'options' && (
          <div className="grid md:grid-cols-2 gap-0 max-h-[90vh]">
            {/* Preview Panel */}
            <div className="bg-muted/30 p-6 border-r overflow-auto">
              <h3 className="font-medium text-sm text-muted-foreground mb-4">Preview</h3>
              <div className="aspect-[8.5/11] bg-white rounded-lg shadow-lg overflow-hidden [container-type:inline-size]">
                <div
                  className="origin-top-left pointer-events-none"
                  style={{
                    width: RESUME_PREVIEW_WIDTH,
                    transform: 'scale(calc(100cqw / 816px))',
                  }}
                >
                  <ResumePreviewContent resumeInfo={resumeInfo} id="export-modal-preview" />
                </div>
              </div>

              {/* Completion Score */}
              {validation && (
                <div className="mt-4 p-3 bg-background rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Resume Completeness</span>
                    <span
                      className={cn(
                        'text-sm font-bold',
                        validation.completionScore >= 80
                          ? 'text-teal-600'
                          : validation.completionScore >= 50
                            ? 'text-amber-600'
                            : 'text-red-600'
                      )}
                    >
                      {validation.completionScore}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-500 rounded-full',
                        validation.completionScore >= 80
                          ? 'bg-teal-500'
                          : validation.completionScore >= 50
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                      )}
                      style={{ width: `${validation.completionScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Options Panel */}
            <div className="p-6 overflow-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-fuchsia-pink-500 flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Export Resume</h2>
                  <p className="text-sm text-muted-foreground">Configure your PDF settings</p>
                </div>
              </div>

              {/* Validation Alerts */}
              {errors.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300 font-medium text-sm mb-2">
                    <AlertCircle className="w-4 h-4" />
                    Required fields missing
                  </div>
                  <ul className="space-y-1">
                    {errors.map((issue) => (
                      <li key={issue.field} className="text-sm text-red-600 dark:text-red-400">
                        • {issue.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {warnings.length > 0 && errors.length === 0 && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-medium text-sm mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    Suggestions to improve your resume
                  </div>
                  <ul className="space-y-1">
                    {warnings.map((issue) => (
                      <li key={issue.field} className="text-sm text-amber-600 dark:text-amber-400">
                        • {issue.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Format Selection */}
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2">Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {FORMAT_OPTIONS.map((option) => {
                    const isLocked = option.requiresPro && !hasProExportFormats;
                    const isSelected = format === option.value;
                    const Icon = option.icon;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          if (!isLocked) {
                            setFormat(option.value);
                          }
                        }}
                        disabled={isLocked}
                        className={cn(
                          'p-3 rounded-lg border-2 text-left transition-all relative',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : isLocked
                              ? 'border-muted bg-muted/30 opacity-60 cursor-not-allowed'
                              : 'border-muted hover:border-muted-foreground/30'
                        )}
                      >
                        {isLocked && (
                          <div className="absolute top-2 right-2">
                            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{option.label}</span>
                          {option.requiresPro && (
                            <Crown className="w-3 h-3 text-amber-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
                {!hasProExportFormats && (
                  <Link
                    to="/dashboard/settings"
                    className="text-xs text-muted-foreground mt-2 flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <Crown className="w-3 h-3 text-amber-500" />
                    Upgrade to Pro to unlock DOCX and TXT formats
                  </Link>
                )}
              </div>

              {/* Quality Selection (PDF only) */}
              {format === 'pdf' && (
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2">Quality</label>
                  <div className="grid grid-cols-2 gap-3">
                    {QUALITY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setQuality(option.value)}
                        className={cn(
                          'p-3 rounded-lg border-2 text-left transition-all',
                          quality === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-muted-foreground/30'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {option.value === 'high' && <Sparkles className="w-4 h-4 text-primary" />}
                          <span className="font-medium text-sm">{option.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Paper Size Selection (PDF only) */}
              {format === 'pdf' && (
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2">Paper Size</label>
                  <div className="grid grid-cols-2 gap-3">
                    {PAPER_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPaperSize(option.value)}
                        className={cn(
                          'p-3 rounded-lg border-2 text-left transition-all',
                          paperSize === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-muted-foreground/30'
                        )}
                      >
                        <span className="font-medium text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* White Label Option (Enterprise only) */}
              <div className="mb-6 p-4 rounded-lg border border-muted bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        hasWhiteLabel
                          ? 'bg-violet-100 dark:bg-violet-900/30'
                          : 'bg-muted'
                      )}
                    >
                      <Zap
                        className={cn(
                          'w-4 h-4',
                          hasWhiteLabel
                            ? 'text-violet-600 dark:text-violet-400'
                            : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">White Label Export</span>
                        <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                          Enterprise
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Remove all app branding from exported files
                      </p>
                    </div>
                  </div>
                  {hasWhiteLabel ? (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={whiteLabel}
                      onClick={() => setWhiteLabel(!whiteLabel)}
                      className={cn(
                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                        whiteLabel ? 'bg-primary' : 'bg-muted'
                      )}
                    >
                      <span
                        className={cn(
                          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition',
                          whiteLabel ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* Export Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleExport}
                disabled={!validation?.isValid}
              >
                <Download className="w-5 h-5" />
                Download {format.toUpperCase()}
                <ChevronRight className="w-4 h-4" />
              </Button>

              {!validation?.isValid && (
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Please fill in the required fields to export
                </p>
              )}
            </div>
          </div>
        )}

        {view === 'exporting' && (
          <CardContent className="py-12 px-8">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-fuchsia-pink-500/20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>

              <h2 className="text-xl font-semibold mb-2">Creating your PDF</h2>
              <p className="text-muted-foreground mb-8">This usually takes a few seconds...</p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-fuchsia-pink-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{progress}% complete</p>
              </div>

              {/* Steps */}
              <div className="flex justify-center gap-2">
                {EXPORT_STEPS.map((step, index) => {
                  const stepIndex = EXPORT_STEPS.findIndex((s) => s.step === currentStep);
                  const isComplete = index < stepIndex;
                  const isCurrent = step.step === currentStep;

                  return (
                    <div key={step.step} className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all',
                          isComplete
                            ? 'bg-teal-500 text-white'
                            : isCurrent
                              ? 'bg-primary text-white'
                              : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {isComplete ? <Check className="w-3 h-3" /> : index + 1}
                      </div>
                      <span
                        className={cn(
                          'text-xs hidden sm:inline',
                          isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                        )}
                      >
                        {step.label}
                      </span>
                      {index < EXPORT_STEPS.length - 1 && (
                        <div className="w-4 h-px bg-muted hidden sm:block" />
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  setView('options');
                  setProgress(0);
                  setError(null);
                }}
                className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel export
              </button>
            </div>
          </CardContent>
        )}

        {view === 'success' && (
          <CardContent className="py-12 px-8">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>

              <h2 className="text-xl font-semibold mb-2">Resume Downloaded!</h2>
              <p className="text-muted-foreground mb-8">
                Your PDF is ready. Check your downloads folder.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setView('options');
                    setProgress(0);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Again
                </Button>
              </div>

              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Pro Tip
                </div>
                <p className="text-sm text-muted-foreground">
                  Save your resume as a PDF when applying online. Most ATS systems work best with PDF
                  format.
                </p>
              </div>
            </div>
          </CardContent>
        )}

        {view === 'error' && (
          <CardContent className="py-12 px-8">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>

              <h2 className="text-xl font-semibold mb-2">Export Failed</h2>
              <p className="text-muted-foreground mb-2">{error}</p>
              <p className="text-sm text-muted-foreground mb-8">
                Please try again or contact support if the issue persists.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setView('options');
                    setError(null);
                    setProgress(0);
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default ExportModal;
