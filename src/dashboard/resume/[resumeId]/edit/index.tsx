import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';

import FormSection from '../../FormSection';
import ResumePreview from '../../ResumePreview';
import { useGetUserResume } from '@/lib/hooks/resume';
import { Loader2 } from 'lucide-react';

function EditResume() {
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);

  const params = useParams();
  const { data, error, isLoading } = useGetUserResume(params?.resumeId);

  const methods = useForm({
    defaultValues: resumeInfo || {},
    mode: 'onChange',
  });

  useEffect(() => {
    if (data && !isLoading && !error) {
      setResumeInfo(data);
    }
  }, [data, isLoading, error, setResumeInfo, methods]);

  useEffect(() => {
    if (resumeInfo) {
      methods.reset(resumeInfo); // reset form with new data
    }
  }, [resumeInfo, methods]);

  if (isLoading)
    return isLoading ? (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-[45px] w-[45px]" />
      </div>
    ) : (
      'Loading resume...'
    );

  if (error) return <div>Error loading resume: {error.message}</div>;

  return (
    <FormProvider {...methods}>
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <FormSection />
        <ResumePreview />
      </div>
    </FormProvider>
  );
}

export default EditResume;
