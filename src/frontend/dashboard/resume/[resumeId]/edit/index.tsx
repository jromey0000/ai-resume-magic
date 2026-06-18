import { useUser } from '@clerk/clerk-react';
import { Eye, FileEdit, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import UpgradeModal from '@/dashboard/components/UpgradeModal';
import { EditorProvider } from '@/lib/contexts/EditorContext';
import { clearGuestDraft, getGuestDraft } from '@/lib/guest-resume';
import { useCreateNewResume, useGetUserResume } from '@/lib/hooks/resume';
import { cn } from '@/lib/utils';
import FormSection from '../../FormSection';
import ResumePreview from '../../ResumePreview';

type MobileTab = 'edit' | 'preview';

function EditResume() {
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);
  const [guestLoaded, setGuestLoaded] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('edit');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const migrationAttempted = useRef(false);

  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const isGuest = params?.resumeId === 'guest';

  const jobDescriptionParam = searchParams.get('jd')
    ? decodeURIComponent(searchParams.get('jd')!)
    : '';
  const jobTitleParam = searchParams.get('jobTitle')
    ? decodeURIComponent(searchParams.get('jobTitle')!)
    : '';

  const { data, error, isLoading, mutate } = useGetUserResume(
    isGuest ? undefined : params?.resumeId
  );
  const { createNewResume } = useCreateNewResume();

  const methods = useForm<ResumeInfo>({
    defaultValues: resumeInfo || { themeColor: '#cb37d8', templateId: 'classic' },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isGuest && !guestLoaded) {
      const draft = getGuestDraft();
      if (draft) {
        setResumeInfo({
          themeColor: '#cb37d8',
          templateId: 'classic',
          ...draft.resumeInfo,
        });
      } else {
        setResumeInfo({ themeColor: '#cb37d8', templateId: 'classic' });
      }
      setGuestLoaded(true);
    }
  }, [isGuest, guestLoaded]);

  useEffect(() => {
    if (!isGuest && data && !isLoading && !error) {
      setResumeInfo({
        themeColor: '#cb37d8',
        templateId: 'classic',
        ...data,
      });
    }
  }, [data, isLoading, error, isGuest]);

  useEffect(() => {
    if (resumeInfo) {
      methods.reset(resumeInfo);
    }
  }, [resumeInfo, methods]);

  const migrateGuestToAccount = useCallback(async () => {
    const draft = getGuestDraft();
    const formData = methods.getValues();
    if (!draft || !user?.primaryEmailAddress?.emailAddress) return;

    setIsMigrating(true);
    try {
      const uuid = uuidv4();
      const response = await createNewResume({
        data: {
          title: draft.title,
          resumeId: uuid,
          userEmail: user.primaryEmailAddress.emailAddress,
          userName: user.fullName || '',
          ...formData,
        },
      });

      const documentId = response?.data?.documentId;
      if (documentId) {
        clearGuestDraft();
        const query = searchParams.toString();
        navigate(`/dashboard/resume/${documentId}/edit${query ? `?${query}` : ''}`, {
          replace: true,
        });
      }
    } catch (err) {
      console.error('Failed to migrate guest resume:', err);
    } finally {
      setIsMigrating(false);
    }
  }, [createNewResume, methods, navigate, searchParams, user]);

  useEffect(() => {
    if (
      isGuest &&
      isSignedIn &&
      user &&
      guestLoaded &&
      !isMigrating &&
      !migrationAttempted.current
    ) {
      migrationAttempted.current = true;
      migrateGuestToAccount();
    }
  }, [isGuest, isSignedIn, user, guestLoaded, isMigrating, migrateGuestToAccount]);

  if (isMigrating) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-3">
        <Loader2 className="animate-spin h-[45px] w-[45px]" />
        <p className="text-muted-foreground">Saving your resume to your account...</p>
      </div>
    );
  }

  if (!isGuest && isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-[45px] w-[45px]" />
      </div>
    );
  }

  if (!isGuest && error) {
    return <ErrorDisplay error={error} title="Error Loading Resume" onRetry={() => mutate()} />;
  }

  if (isGuest && !guestLoaded) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-[45px] w-[45px]" />
      </div>
    );
  }

  const draft = isGuest ? getGuestDraft() : null;
  const initialJd = jobDescriptionParam || draft?.jobDescription || '';
  const initialJobTitle = jobTitleParam || draft?.jobTitle || '';
  const resumeTitle = draft?.title || data?.title || 'Resume';

  return (
    <EditorProvider
      isGuestMode={isGuest}
      initialJobDescription={initialJd}
      initialJobTitle={initialJobTitle}
    >
      <FormProvider {...methods}>
        <div className="p-4 md:p-8 lg:p-10">
          {/* Breadcrumb */}
          {!isGuest && (
            <nav className="text-sm text-muted-foreground mb-4 hidden sm:block">
              <Link to="/dashboard" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{resumeTitle}</span>
            </nav>
          )}

          {/* Mobile tab toggle */}
          <div className="md:hidden flex rounded-lg border p-1 mb-4 bg-muted/50">
            <button
              type="button"
              onClick={() => setMobileTab('edit')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all',
                mobileTab === 'edit'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <FileEdit className="w-4 h-4" /> Edit
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('preview')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all',
                mobileTab === 'preview'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>

          <FormSection
            onShowUpgrade={() => setShowUpgrade(true)}
            preview={<ResumePreview />}
            mobileTab={mobileTab}
          />
        </div>

        <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
      </FormProvider>
    </EditorProvider>
  );
}

export default EditResume;
