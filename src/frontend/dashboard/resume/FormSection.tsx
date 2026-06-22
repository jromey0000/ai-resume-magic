import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  History,
  LayoutTemplate,
  Loader2,
  Sparkles,
  Target,
  User,
  Wand2,
  Wrench,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { createMockResumeInfo } from '@/lib/utils/dev-fixtures';
import { useParams, useSearchParams } from 'react-router-dom';
import ATSScorePill from '@/components/ui/ATSScorePill';
import AuthGateModal from '@/components/ui/AuthGateModal';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/card';
import ExportModal from '@/components/ui/ExportModal';
import { useEditorContext } from '@/lib/contexts/EditorContext';
import { getGuestDraft, saveGuestDraft } from '@/lib/guest-resume';
import { useDebounce } from '@/lib/hooks/debounce';
import { cn } from '@/lib/utils';
import { updateResumeDetail } from '@/lib/utils/api';
import { useNotification } from '@/lib/utils/hooks';
import Education from './forms/Education';
import JobMatching from './forms/JobMatching';
import PersonalDetails from './forms/PersonalDetails';
import Skills from './forms/Skills';
import Summary from './forms/Summary';
import WorkExperience from './forms/WorkExperience';
import TemplatePicker from './TemplatePicker';
import VersionHistory from './VersionHistory';

const SECTIONS = [
  { id: 'personal', name: 'Personal', icon: User, component: PersonalDetails, optional: false },
  { id: 'summary', name: 'Summary', icon: FileText, component: Summary, optional: false },
  {
    id: 'experience',
    name: 'Experience',
    icon: Briefcase,
    component: WorkExperience,
    optional: false,
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    component: Education,
    optional: false,
  },
  { id: 'skills', name: 'Skills', icon: Wrench, component: Skills, optional: false },
  { id: 'ats', name: 'ATS Match', icon: Target, component: JobMatching, optional: true },
] as const;

interface SectionCompletionState {
  personal: boolean;
  summary: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
  ats: boolean;
}

interface FormSectionProps {
  onShowUpgrade?: () => void;
  preview?: React.ReactNode;
  mobileTab?: 'edit' | 'preview';
}

function FormSection({ onShowUpgrade, preview, mobileTab = 'edit' }: FormSectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [sectionCompletion, setSectionCompletion] = useState<SectionCompletionState>({
    personal: false,
    summary: false,
    experience: false,
    education: false,
    skills: false,
    ats: false,
  });

  const params = useParams();
  const [searchParams] = useSearchParams();
  const jobDescriptionFromUrl = searchParams.get('jd')
    ? decodeURIComponent(searchParams.get('jd')!)
    : '';

  const { atsAnalysis, isAnalyzing, isGuestMode } = useEditorContext();
  const { addNotification } = useNotification();

  const { watch, reset } = useFormContext<ResumeInfo>();
  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 1500);

  const handleDevAutoFill = () => {
    const mockData = createMockResumeInfo();
    reset(mockData);
    addNotification({ title: 'Form filled', message: 'Sample resume data loaded.' });
  };

  const checkSectionCompletion = useCallback(
    (values: ResumeInfo): SectionCompletionState => ({
      personal: Boolean(
        values.firstName && values.lastName && values.email && values.phone && values.jobTitle
      ),
      summary: Boolean(values.summary && values.summary.length > 50),
      experience: Boolean(values.experience && values.experience.length > 0),
      education: Boolean(values.education && values.education.length > 0),
      skills: Boolean(values.skills && values.skills.length > 0),
      ats: Boolean(atsAnalysis && atsAnalysis.score > 0),
    }),
    [atsAnalysis]
  );

  useEffect(() => {
    if (jobDescriptionFromUrl) {
      const atsIndex = SECTIONS.findIndex((s) => s.id === 'ats');
      if (atsIndex >= 0) setCurrentStep(atsIndex);
    }
  }, [jobDescriptionFromUrl]);

  useEffect(() => {
    setSectionCompletion(checkSectionCompletion(formValues));
  }, [formValues, checkSectionCompletion]);

  useEffect(() => {
    if (!debouncedValues) return;

    const saveData = async () => {
      setIsSaving(true);
      try {
        const dataToSave = {
          ...debouncedValues,
          ...(atsAnalysis ? { atsScore: atsAnalysis.score } : {}),
        };

        if (isGuestMode) {
          const draft = getGuestDraft();
          if (draft) {
            saveGuestDraft({ ...draft, resumeInfo: dataToSave });
            setLastSaved(new Date());
          }
        } else if (params?.resumeId) {
          await updateResumeDetail(params.resumeId, { data: dataToSave });
          setLastSaved(new Date());
        }
      } catch (err) {
        console.error('Auto-save failed:', err);
        addNotification({
          title: 'Auto-save failed',
          message: 'Your changes may not be saved. Please try again.',
        });
      } finally {
        setIsSaving(false);
      }
    };

    saveData();
  }, [debouncedValues, params?.resumeId, isGuestMode, atsAnalysis, addNotification]);

  const completedCount = Object.values(sectionCompletion).filter(Boolean).length;
  const totalSections = SECTIONS.length - 1;
  const completionPercentage = Math.round((completedCount / totalSections) * 100);

  const currentSection = SECTIONS[currentStep];
  const SectionComponent = currentSection.component;
  const isFirst = currentStep === 0;
  const isLast = currentStep === SECTIONS.length - 1;

  const goToStep = (index: number) => {
    setCurrentStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleExportSuccess = () => {
    addNotification({ title: 'Resume exported', message: 'Your PDF has been downloaded.' });
  };

  return (
    <div className="space-y-4">
      <Card className="sticky top-0 z-10">
        <CardContent className="py-4 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-28 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-fuchsia-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {completionPercentage}%
                </span>
              </div>

              {(atsAnalysis || isAnalyzing) && (
                <ATSScorePill
                  score={atsAnalysis?.score ?? 0}
                  isAnalyzing={isAnalyzing}
                  onClick={() => goToStep(SECTIONS.findIndex((s) => s.id === 'ats'))}
                />
              )}

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                    <span>{isGuestMode ? 'Saved locally' : 'Auto-saved'}</span>
                  </>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {import.meta.env.DEV && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                  onClick={handleDevAutoFill}
                  title="Dev only: Fill form with sample data"
                >
                  <Wand2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Auto Fill</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => setShowVersionHistory(true)}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => setShowTemplates(true)}
                aria-label="Template"
              >
                <LayoutTemplate className="w-4 h-4" />
                <span className="hidden sm:inline">Template</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleExport}
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {SECTIONS.map((section, index) => {
              const isComplete = sectionCompletion[section.id as keyof SectionCompletionState];
              const isCurrent = index === currentStep;

              return (
                <button
                  type="button"
                  key={section.id}
                  onClick={() => goToStep(index)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
                    isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : isComplete
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-200'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {isComplete && !isCurrent ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <section.icon className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">{section.name}</span>
                  <span className="sm:hidden">{index + 1}</span>
                </button>
              );
            })}
          </div>

          {isGuestMode && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-800 dark:text-amber-200">
                Guest mode — sign in to save your resume to the cloud
              </span>
            </div>
          )}

          {jobDescriptionFromUrl && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Tailoring for targeted job posting</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div className={cn('space-y-4', mobileTab !== 'edit' && 'hidden md:block')}>
          {/* Current step content */}
          <Card className="border-primary/30 shadow-lg shadow-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <currentSection.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{currentSection.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {SECTIONS.length}
                    {currentSection.optional && ' · Optional'}
                  </p>
                </div>
              </div>

              <SectionComponent
                onEnabledNext={() => {}}
                initialJobDescription={
                  currentSection.id === 'ats' ? jobDescriptionFromUrl : undefined
                }
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 pb-4">
            <Button
              variant="ghost"
              onClick={() => goToStep(currentStep - 1)}
              disabled={isFirst}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>

            <div className="flex gap-2">
              {currentSection.optional && !isLast && (
                <Button variant="ghost" onClick={() => goToStep(currentStep + 1)}>
                  Skip
                </Button>
              )}
              {!isLast ? (
                <Button
                  variant="primary"
                  onClick={() => goToStep(currentStep + 1)}
                  className="flex items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="primary" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" /> Export PDF
                </Button>
              )}
            </div>
          </div>
        </div>

        {preview && (
          <div
            className={cn(
              'md:sticky md:top-24 md:self-start',
              mobileTab !== 'preview' && 'hidden md:block'
            )}
          >
            {preview}
          </div>
        )}
      </div>

      <TemplatePicker
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onUpgradeClick={onShowUpgrade}
      />

      <AuthGateModal
        isOpen={showAuthGate}
        onClose={() => setShowAuthGate(false)}
        title="Sign in to export your resume"
        message="Create a free account to download your PDF and save your resume to the cloud."
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        resumeInfo={formValues}
        onSuccess={handleExportSuccess}
      />

      <VersionHistory
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
      />
    </div>
  );
}

export default FormSection;
