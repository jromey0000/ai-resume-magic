import { useUser } from '@clerk/clerk-react';
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
  Target,
  Upload,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Button from '@/components/ui/Button';
import { createGuestDraft } from '@/lib/guest-resume';
import { useCreateNewResume } from '@/lib/hooks/resume';
import { convertParsedToResumeInfo, parseResume } from '@/lib/services/resume-parser';
import { useNotification } from '@/lib/utils/hooks';
import JobDescriptionStart from './JobDescriptionStart';

type OnboardingStep = 'choose' | 'job-first' | 'upload' | 'fresh';

interface OnboardingFlowProps {
  onComplete?: () => void;
}

const START_OPTIONS = [
  {
    id: 'job-first',
    icon: Target,
    title: 'Start with a Job Posting',
    description: 'Paste a job description and our AI will tailor your resume to match',
    badge: 'Recommended',
    benefits: ['AI extracts key requirements', 'Auto-suggests keywords', 'Higher ATS scores'],
  },
  {
    id: 'upload',
    icon: Upload,
    title: 'Upload Existing Resume',
    description: "We'll parse your resume and let you enhance it with AI",
    badge: null,
    benefits: ['Smart parsing', 'Keep your content', 'Improve formatting'],
  },
  {
    id: 'fresh',
    icon: Sparkles,
    title: 'Start Fresh',
    description: 'Build your resume from scratch with AI assistance',
    badge: null,
    benefits: ['Guided process', 'AI suggestions', 'Professional templates'],
  },
] as const;

function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('choose');
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { createNewResume } = useCreateNewResume();
  const { addNotification } = useNotification();

  const handleOptionSelect = (optionId: string) => {
    if (optionId === 'job-first') {
      setCurrentStep('job-first');
    } else if (optionId === 'upload') {
      setCurrentStep('upload');
    } else {
      setCurrentStep('fresh');
    }
  };

  const createResumeAndNavigate = async (title: string, initialData?: Partial<ResumeInfo>) => {
    setIsCreating(true);

    const queryParams = new URLSearchParams();
    if (jobDescription) {
      queryParams.set('jd', encodeURIComponent(jobDescription));
    }
    if (jobTitle) {
      queryParams.set('jobTitle', encodeURIComponent(jobTitle));
    }
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    if (!isSignedIn) {
      createGuestDraft(title, initialData || {}, {
        jobDescription: jobDescription || undefined,
        jobTitle: jobTitle || undefined,
      });
      navigate(`/dashboard/resume/guest/edit${queryString}`);
      onComplete?.();
      setIsCreating(false);
      return;
    }

    const uuid = uuidv4();

    const data: UserResume = {
      data: {
        title: title || 'My Resume',
        resumeId: uuid,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
        ...(initialData && { ...initialData }),
      },
    };

    try {
      const response = await createNewResume(data);
      const documentId = response?.data?.documentId;
      if (documentId) {
        addNotification({
          title: 'Resume created!',
          message: "Let's build something great.",
        });

        const url = `/dashboard/resume/${documentId}/edit${queryString}`;
        navigate(url);
        onComplete?.();
      }
    } catch (err) {
      console.error('Error creating resume:', err);
      addNotification({
        title: 'Error',
        message: 'Failed to create resume. Please try again.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJobFirstContinue = (jd: string, title: string) => {
    setJobDescription(jd);
    setJobTitle(title);
    createResumeAndNavigate(title ? `Resume for ${title}` : 'Tailored Resume', {});
  };

  const handleFreshStart = (targetRole?: string) => {
    const title = targetRole ? `${targetRole} Resume` : 'My Resume';
    const initialData: Partial<ResumeInfo> = targetRole ? { jobTitle: targetRole } : {};
    createResumeAndNavigate(title, initialData);
  };

  const handleUploadComplete = (parsedData: Partial<ResumeInfo>) => {
    const title = parsedData.jobTitle
      ? `${parsedData.firstName || 'My'} ${parsedData.lastName || ''} - ${parsedData.jobTitle}`.trim()
      : 'Imported Resume';
    createResumeAndNavigate(title, parsedData);
  };

  if (currentStep === 'job-first') {
    return (
      <JobDescriptionStart
        onContinue={handleJobFirstContinue}
        onBack={() => setCurrentStep('choose')}
        isLoading={isCreating}
      />
    );
  }

  if (currentStep === 'upload') {
    return (
      <UploadResumeStart
        onComplete={handleUploadComplete}
        onBack={() => setCurrentStep('choose')}
        isLoading={isCreating}
      />
    );
  }

  if (currentStep === 'fresh') {
    return (
      <FreshStart
        onContinue={handleFreshStart}
        onBack={() => setCurrentStep('choose')}
        isLoading={isCreating}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">AI-Powered Resume Builder</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How would you like to{' '}
            <span className="bg-gradient-to-r from-primary to-fuchsia-pink-400 text-transparent bg-clip-text">
              get started?
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the path that works best for you. Our AI will help you create an ATS-optimized
            resume no matter which option you pick.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {START_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className="group relative bg-white dark:bg-cod-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-cod-gray-700 hover:border-primary dark:hover:border-primary transition-all duration-300 text-left hover:shadow-lg hover:shadow-primary/10"
            >
              {option.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-gradient-to-r from-primary to-fuchsia-pink-500 text-white text-xs font-semibold rounded-full">
                    {option.badge}
                  </span>
                </div>
              )}

              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-fuchsia-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <option.icon className="w-7 h-7 text-primary" />
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {option.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{option.description}</p>

              <ul className="space-y-2 mb-6">
                {option.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="flex items-center text-primary font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                Get Started <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          All options include AI assistance, ATS optimization, and unlimited exports
        </p>
      </div>
    </div>
  );
}

interface SubStepProps {
  onBack: () => void;
  isLoading: boolean;
}

function UploadResumeStart({
  onComplete,
  onBack,
  isLoading,
}: SubStepProps & { onComplete: (data: Partial<ResumeInfo>) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<{
    name?: string;
    email?: string;
    skills?: number;
    experience?: number;
  } | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.docx'))
    ) {
      handleFileSelected(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelected(selectedFile);
    }
  };

  const handleFileSelected = async (selectedFile: File) => {
    setFile(selectedFile);
    setParseError(null);
    setParsedPreview(null);
    setIsParsing(true);

    try {
      const parsed = await parseResume(selectedFile);
      setParsedPreview({
        name: [parsed.firstName, parsed.lastName].filter(Boolean).join(' ') || undefined,
        email: parsed.email,
        skills: parsed.skills?.length || 0,
        experience: parsed.experience?.length || 0,
      });
    } catch (err) {
      console.error('Failed to parse resume:', err);
      setParseError(err instanceof Error ? err.message : 'Failed to parse resume');
    } finally {
      setIsParsing(false);
    }
  };

  const handleContinue = async () => {
    if (!file) return;
    setIsParsing(true);
    setParseError(null);

    try {
      const parsed = await parseResume(file);
      const resumeInfo = convertParsedToResumeInfo(parsed);
      onComplete(resumeInfo);
    } catch (err) {
      console.error('Failed to parse resume:', err);
      setParseError(err instanceof Error ? err.message : 'Failed to parse resume');
      setIsParsing(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setParsedPreview(null);
    setParseError(null);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-8 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to options
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-fuchsia-pink-500/20 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Upload Your Resume</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We'll extract your information and help you enhance it with AI
          </p>
        </div>

        {/* biome-ignore lint/a11y/noStaticElementInteractions: native drag-and-drop requires these handlers on a container */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : file
                ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                : 'border-gray-300 dark:border-cod-gray-600 hover:border-primary/50'
          }`}
        >
          {file ? (
            <div className="space-y-4">
              <FileText className="w-12 h-12 text-primary mx-auto" />
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>

              {isParsing && (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Analyzing resume...</span>
                </div>
              )}

              {parsedPreview && !isParsing && (
                <div className="mt-4 p-4 bg-white dark:bg-cod-gray-800 rounded-xl border border-gray-200 dark:border-cod-gray-600 text-left">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-sm">Resume Parsed Successfully</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {parsedPreview.name && (
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <p className="font-medium">{parsedPreview.name}</p>
                      </div>
                    )}
                    {parsedPreview.email && (
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium truncate">{parsedPreview.email}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Skills Found:</span>
                      <p className="font-medium">{parsedPreview.skills}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Experience:</span>
                      <p className="font-medium">{parsedPreview.experience} positions</p>
                    </div>
                  </div>
                </div>
              )}

              {parseError && (
                <div className="flex items-center justify-center gap-2 text-coral-rose-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{parseError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleClearFile}
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                Choose a different file
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop your resume here</p>
              <p className="text-gray-500 text-sm mb-4">or click to browse</p>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="inline-flex items-center px-5 py-2.5 rounded-lg border border-primary text-primary text-sm font-medium cursor-pointer hover:bg-primary hover:text-white transition-all"
              >
                Browse Files
              </label>
              <p className="text-xs text-gray-400 mt-4">Supports PDF and DOCX files</p>
            </>
          )}
        </div>

        {file && parsedPreview && !parseError && (
          <Button
            variant="primary"
            size="lg"
            className="w-full mt-6"
            onClick={handleContinue}
            disabled={isParsing || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Creating Resume...
              </>
            ) : (
              <>
                Continue with Parsed Data <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        )}

        {file && parseError && (
          <Button
            variant="primary"
            size="lg"
            className="w-full mt-6"
            onClick={() => onComplete({})}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                Continue Anyway (Start Fresh) <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function FreshStart({
  onContinue,
  onBack,
  isLoading,
}: SubStepProps & { onContinue: (targetRole?: string) => void }) {
  const [targetRole, setTargetRole] = useState('');

  const commonRoles = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
    'Marketing Manager',
    'Sales Representative',
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-8 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to options
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-fuchsia-pink-500/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Let's Build Something Great</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Quick question to help us personalize your experience
          </p>
        </div>

        <div className="bg-white dark:bg-cod-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-cod-gray-700">
          <label htmlFor="target-role" className="block text-sm font-medium mb-2">
            What role are you targeting?
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="target-role"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Software Engineer, Product Manager..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-cod-gray-600 dark:bg-cod-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {commonRoles.map((role) => (
              <button
                type="button"
                key={role}
                onClick={() => setTargetRole(role)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  targetRole === role
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-cod-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-3">
            This helps our AI provide better suggestions (you can skip this)
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full mt-6"
          onClick={() => onContinue(targetRole || undefined)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Creating Resume...
            </>
          ) : (
            <>
              Start Building <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        <button
          type="button"
          onClick={() => onContinue()}
          className="w-full mt-3 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          Skip — I'll decide later
        </button>
      </div>
    </div>
  );
}

export default OnboardingFlow;
